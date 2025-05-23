import PropTypes from "prop-types";
import { useState } from "react";
import "./AuthWidgets.css";
import { auth } from "../../utils/firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";

function AuthWidgets({ active, isRegistering, setIsRegistering, closeModal }) {
  const [passwordError, setPasswordError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [showRequirements, setShowRequirements] = useState(false);

  const [primeiroNome, setPrimeiroNome] = useState("");
  const [ultimoNome, setUltimoNome] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // função para enviar um código de confirmação para o email do usuario
  function sendCode(email) {
    const body = JSON.stringify({ email });
    const url = `${import.meta.env.VITE_API_URL}/api/auth/send-code`;

    return fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Código de verificação enviado:", data);

        setIsRegistering("code");
        document.querySelector(".wrapper").style.height = "263px";

        return true;
      })
      .catch((error) => {
        console.error("erro ao enviar código:", error);
        return false;
      });
  }

  async function verificarCodigoeFinalizarCadastro(email) {
    const inputs = document.querySelectorAll(".verification-code");

    let enteredCode = "";
    inputs.forEach((input) => {
      enteredCode += input.value;
    });

    if (enteredCode.length < inputs.length) {
      alert("Por favor, preencha todos os dígitos do código.");
      return;
    }
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/verify-code`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, code: enteredCode }),
        }
      );

      const validationResult = await response.json();

      if (validationResult.valid) {
        console.log("Código validado com sucesso!");

        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCredential.user;

        fetch(`${import.meta.env.VITE_API_URL}/api/usuarios/salvar`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: user.uid,
            primeiroNome: primeiroNome,
            ultimoNome: ultimoNome,
            email: email,
          }),
        })
          .then((res) => res.json())
          .then((data) => console.log("Resposta:", data))
          .catch((err) => console.error("Erro:", err));

        setEmail("");
        setPassword("");
        setPrimeiroNome("");
        setUltimoNome("");
        console.log("Usuário criado!");
        closeModal();
      } else {
        alert("codigo invalido, tente novamente!");
      }
    } catch (error) {
      console.error("Erro ao verificar código e criar usuário:", error);
      alert("Erro ao verificar código ou criar usuário.");
    }
  }

  // função para verificar se o m-mail digitado pelo usuario realmente existe
  function validarEmail(email) {
    const body = JSON.stringify({ email });
    console.log("Corpo da requisição enviado:", body);

    const url = `${import.meta.env.VITE_API_URL}/validate-email`;

    return fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body,
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

  async function criarUser() {
    if (password !== confirmPassword) {
      setPasswordError(true);
      return;
    }

    const emailValido = await validarEmail(email);
    if (!emailValido) {
      setEmailError(true);
      return;
    }

    const codigoEnviado = await sendCode(email);
    if (!codigoEnviado) {
      alert("Erro ao enviar o código. Tente novamente.");
      return;
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    await criarUser();
  }

  const passwordRequirements = {
    length: /.{8,}/,
    number: /[0-9]/,
    lower: /[a-z]/,
    upper: /[A-Z]/,
    symbol: /[!@#$%^&*(),.?":{}|<>]/,
  };

  const checkRequirement = (regex) => regex.test(password);

  return (
    <div
      className={`wrapper ${active ? "active-popup" : ""} ${
        isRegistering === "register" ? "active" : ""
      } ${showRequirements ? "show-req" : ""}`}
      style={{
        right: active
          ? isRegistering === "register"
            ? "26%"
            : "20%"
          : "-100%",
      }}
    >
      <span className="icon-close" onClick={closeModal}>
        <span className="material-symbols-outlined">close</span>
      </span>

      <div
        className="form-box login"
        style={{ display: isRegistering === "code" ? "none" : "block" }}
      >
        <h2>Login</h2>
        <form action="#" autoComplete="off">
          <div className="input-box">
            <input type="email" id="Email-login" required placeholder="Email" />
          </div>
          <div className="input-box">
            <input
              type="password"
              id="Password-login"
              required
              placeholder="Senha"
            />
          </div>
          <div className="remember-forgot">
            <label>
              <input type="checkbox" />
              Lembrar de mim
            </label>
            <a href="#">Esqueceu a senha?</a>
          </div>
          <button type="submit" className="btn" id="Btn-login">
            Login
          </button>
          <div className="login-register">
            <p>
              Não tem uma conta?
              <a
                href="#"
                className="register-link"
                onClick={() => {
                  setIsRegistering("register");
                }}
              >
                Cadastre-se
              </a>
            </p>
          </div>
        </form>
      </div>

      <div
        className="form-box register"
        style={{ display: isRegistering === "code" ? "none" : "block" }}
      >
        <h2>Cadastro</h2>

        <div className="icons-login">
          <img
            className="facebook"
            src="assets/images/facebook_icon.png"
            alt="Icone do Facebook"
          />
          <div className="google-container">
            <img
              className="google"
              src="assets/images/google_icon.webp"
              alt="Icone do Google"
            />
          </div>
          <div className="twitter-container">
            <img className="twitter" src="assets/images/X_logo.png" alt="" />
          </div>
        </div>
        <form autoComplete="off" onSubmit={handleSubmit}>
          <div className="nome">
            <div className="input-box">
              <input
                type="text"
                id="nome-register"
                required
                placeholder="Nome"
                value={primeiroNome}
                onChange={(e) => setPrimeiroNome(e.target.value)}
              />
            </div>
            <div className="input-box">
              <input
                type="text"
                id="sobrenome-register"
                required
                placeholder="Sobrenome"
                value={ultimoNome}
                onChange={(e) => setUltimoNome(e.target.value)}
              />
            </div>
          </div>
          <div className="input-box">
            <input
              type="email"
              id="email-register"
              required
              placeholder="Email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (emailError) setEmailError(false);
              }}
            />
            <p
              id="email-error"
              className={`error-message ${emailError ? "show" : ""}`}
            >
              E-mail invalido ou já cadastrado.
            </p>
          </div>
          <div className="input-box">
            <div className="password-div">
              <input
                type="password"
                id="password-register"
                required
                placeholder="Senha"
                value={password}
                onChange={(e) => {
                  const value = e.target.value;
                  setPassword(value);
                  setShowRequirements(value.length > 0);
                }}
                onBlur={() => {
                  setShowRequirements(false);
                }}
              />
              <span className="material-symbols-outlined">visibility</span>
            </div>
            <ul
              className={`requirement-list ${
                showRequirements ? "visible" : ""
              }`}
            >
              <li
                className={
                  checkRequirement(passwordRequirements.length) ? "valid" : ""
                }
              >
                <span className="material-symbols-outlined">check_circle</span>
                <p>Pelo menos 8 caracteres</p>
              </li>
              <li
                className={
                  checkRequirement(passwordRequirements.number) ? "valid" : ""
                }
              >
                <span className="material-symbols-outlined">check_circle</span>
                <p>Pelo menos 1 número (0...9)</p>
              </li>
              <li
                className={
                  checkRequirement(passwordRequirements.lower) ? "valid" : ""
                }
              >
                <span className="material-symbols-outlined">check_circle</span>
                <p>Pelo menos 1 letra minúscula (a...z)</p>
              </li>
              <li
                className={
                  checkRequirement(passwordRequirements.symbol) ? "valid" : ""
                }
              >
                <span className="material-symbols-outlined">check_circle</span>
                <p>Pelo menos 1 símbolo especial</p>
              </li>
              <li
                className={
                  checkRequirement(passwordRequirements.upper) ? "valid" : ""
                }
              >
                <span className="material-symbols-outlined">check_circle</span>
                <p>Pelo menos 1 letra maiúscula (A...Z)</p>
              </li>
            </ul>
          </div>
          <div className="input-box">
            <div className="password-div">
              <input
                type="password"
                id="password-confirm"
                required
                placeholder="Confirme a senha"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (passwordError) setPasswordError(false);
                }}
              />
              <span className="material-symbols-outlined">visibility</span>
            </div>
            <p
              id="password-error"
              className={`error-message ${passwordError ? "show" : ""}`}
            >
              As senhas não coincidem
            </p>
          </div>
          <div className="remember-forgot">
            <label>
              <input type="checkbox" />
              Quero receber e-mails sobre atualizações
            </label>
          </div>
          <button type="submit" id="btn-register" className="btn">
            Cadastrar
          </button>
          <p id="general-error" className="error-message"></p>
          <div className="login-register">
            <p>
              Já tem uma conta?{" "}
              <a
                href="#"
                className="login-link"
                onClick={() => {
                  setIsRegistering("login");
                }}
              >
                Login
              </a>
            </p>
          </div>
        </form>
      </div>

      {isRegistering === "code" && (
        <div id="code">
          <h2>Verifique seu e-mail</h2>

          <p>Digite o codigo que enviamos para o e-mail</p>
          <p>xxxxxxxxx@xxxxxx.com</p>
          <div className="input-code">
            <input maxLength="1" className="verification-code" />
            <input maxLength="1" className="verification-code" />
            <input maxLength="1" className="verification-code" />
            <input maxLength="1" className="verification-code" />
          </div>

          <button
            id="verify-code-btn"
            onClick={() => verificarCodigoeFinalizarCadastro(email)}
          >
            Confirmar
          </button>
        </div>
      )}
    </div>
  );
}

AuthWidgets.propTypes = {
  active: PropTypes.bool.isRequired,
  isRegistering: PropTypes.bool.isRequired,
  setIsRegistering: PropTypes.func.isRequired,
  closeModal: PropTypes.func.isRequired,
};

export default AuthWidgets;
