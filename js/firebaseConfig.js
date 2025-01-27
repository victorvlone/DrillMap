import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { loadEnv } from "./config.js";

(async function () {
  console.log("A IIFE foi iniciada com sucesso!");
  const env = await loadEnv();
  console.log("Variáveis carregadas:", env);

  const firebaseConfig = {
    apiKey: env.FIREBASE_API_KEY,
    authDomain: env.FIREBASE_AUTH_DOMAIN,
    projectId: env.FIREBASE_PROJECT_ID,
    storageBucket: env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: env.FIREBASE_MESSAGING_SENDER_ID,
    appId: env.FIREBASE_APP_ID,
  };

  console.log("Configuração do Firebase:", firebaseConfig);
  
  
  const app = initializeApp(firebaseConfig);
  const auth = getAuth();
  
  const btn_register = document.getElementById("btn-register");
  const code = document.getElementById("code");
  const loginPopup = document.querySelector(".btnLogin-popup");
  const registerPopup = document.querySelector(".btnRegister-popup");
  
  function clearForm(formSelector) {
    const form = document.querySelector(formSelector);
    if (form) {
      form.reset();
      const errors = form.querySelectorAll(".error-message");
      errors.forEach((error) => {
        error.textContent = "";
        error.style.visibility = "hidden";
      });
    }
  }
  
  function validarEmail(email) {
  const body = JSON.stringify({ email });
  console.log("Corpo da requisição enviado:", body);
  
  return fetch("http://localhost:8080/validate-email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  })
  .then((response) => {
      console.log("Status da resposta:", response.status);
      if (!response.ok) {
        throw new Error("Erro na validação de email.");
      }
      return response.json();
    })
    .then((data) => {
      console.log("Resultado da validação:", data);
      return data.status === "VALID";
    })
    .catch((error) => {
      console.error("Erro ao validar o e-mail:", error);
      return false;
    });
  }
  
  loginPopup.addEventListener("click", () => {
    document.querySelector(".form-box.login").style.display = "block";
    document.querySelector(".form-box.register").style.display = "none";
    code.style.display = "none";
    document.querySelector(".wrapper").style.height = "386px";
    
    clearForm(".form-box.register form");
  });
  
  registerPopup.addEventListener("click", () => {
    document.querySelector(".form-box.register").style.display = "block";
    document.querySelector(".form-box.login").style.display = "none";
    code.style.display = "none";
    document.querySelector(".wrapper").style.height = "588px";
    
    clearForm(".form-box.login form");
  });
  
  btn_register.addEventListener("click", function (event) {
    console.log("Botão foi clicado");
    event.preventDefault();
    
    const nome = document.getElementById("nome-register").value;
    const sobrenome = document.getElementById("sobrenome-register").value;
    const email = document.getElementById("email-register").value;
    console.log("Email capturado:", email);
    const password = document.getElementById("password-register").value;
    const passwordConfirm = document.getElementById("password-confirm").value;
    
    const passwordConfirmError = document.getElementById(
      "password-confirm-error"
    );
    const emailError = document.getElementById("email-error");
    const generalError = document.getElementById("general-error");
    
    passwordConfirmError.style.visibility = "hidden";
    emailError.style.visibility = "hidden";
    generalError.style.visibility = "hidden";
    
    let hasError = false;
    
    if (password != passwordConfirm) {
      passwordConfirmError.textContent = "As senhas são diferentes.";
      passwordConfirmError.style.visibility = "visible";
      hasError = true;
    }
    
    if (hasError) return;
    
    validarEmail(email).then((isValid) => {
      if (!isValid) {
      emailError.textContent = "E-mail inválido!";
      emailError.style.visibility = "visible";
      return;
    }
    
    fetch("http://localhost:8080/api/auth/send-code", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    })
    .then((response) => response.json())
    .then((data) => {
      console.log("Código de verificação enviado:", data);
      
      code.style.display = "flex";
      document.querySelector(".form-box.login").style.display = "none";
      document.querySelector(".form-box.register").style.display = "none";
      document.querySelector(".wrapper").style.height = "263px";
      
      const verifyBtn = document.getElementById(".verify-code-btn");
      verifyBtn.addEventListener("click", () => {
        
        const inputs = document.querySelectorAll("verification-code");
        
        let enteredCode = '';
        inputs.forEach(input => {
          enteredCode += input.value;
        });
        
        if(enteredCode.length < inputs.length){
          alert('Por favor, preencha todos os dígitos do código.');
          return;
        }
        
        fetch("http://localhost:8080/api/auth/verify-code", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, codigo: enteredCode }),
        })
        .then((response) => response.json())
        .then((validationResult) => {
          if (validationResult.valid) {
            console.log("Código validado com sucesso!");
            
            createUserWithEmailAndPassword(auth, email, password)
                  .then((userCredential) => {
                    const user = userCredential.user;
                    const userId = user.uid;

                    fetch("http://localhost:8080/api/usuarios", {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        uid: userId,
                        primeiroNome: nome,
                        ultimoNome: sobrenome,
                        email: email,
                        senha: password,
                      }),
                    })
                    .then((response) => response.json())
                    .then((data) => {
                      console.log("Usuário salvo no backend:", data);
                    })
                    .catch((error) => {
                        console.error("Erro ao salvar no backend:", error);
                      });
                    })
                    .catch((error) => {
                      console.error("Erro ao criar usuario no Firebase:", error);
                      generalError.textContent =
                      "Erro ao criar o usuário. Tente novamente.";
                      generalError.style.visibility = "visible";
                    });
                  } else {
                    console.error("Código de verificação inválido!");
                    alert("Código inválido. Tente novamente.");
                  }
            })
            .catch((error) => {
              console.error("Erro ao validar o código:", error);
            });
          });
        })
      .catch((error) => {
        console.error("erro ao enviar o código de verificação:", error);
      });
    });
  });
  
  const inputs = document.querySelectorAll(".verification-code");
  
  inputs.forEach((input, index) => {
    input.addEventListener("input", (e) => {
      // Limita a entrada para 1 caractere
      if (input.value.length > 1) {
        input.value = input.value[0];
      }
      
      // Se o campo atual estiver preenchido, passa para o próximo campo automaticamente
      if (input.value && index < inputs.length - 1) {
        inputs[index + 1].focus();
    }
  });
  
  input.addEventListener("Keydown", (e) => {
    // Volta para o campo anterior caso o Backspace seja pressionado e o campo atual esteja vazio
    if (e.key === "Backspace" && index > 0 && !input.value) {
      inputs[index - 1].focus();
    }
  });
});
})();
