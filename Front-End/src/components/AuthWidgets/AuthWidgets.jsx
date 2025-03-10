import PropTypes from "prop-types";
import "./AuthWidgets.css";

function AuthWidgets({ active, isRegistering, closeModal }) {
  return (
    <div
      className={`wrapper ${active ? "active-popup" : ""} ${
        isRegistering ? "active" : ""
      }`}
      style={{ right: active ? (isRegistering ? "26%" : "20%") : "-100%" }}
    >
      <span className="icon-close" onClick={closeModal}>
        <span className="material-symbols-outlined">close</span>
      </span>
      <div className="form-box login">
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
              <a href="#" className="register-link">
                Cadastre-se
              </a>
            </p>
          </div>
        </form>
      </div>

      <div className="form-box register">
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
        <form action="#" autoComplete="off">
          <div className="nome">
            <div className="input-box">
              <input
                type="text"
                id="nome-register"
                required
                placeholder="Nome"
              />
            </div>
            <div className="input-box">
              <input
                type="text"
                id="sobrenome-register"
                required
                placeholder="Sobrenome"
              />
            </div>
          </div>
          <div className="input-box">
            <input
              type="email"
              id="email-register"
              required
              placeholder="Email"
            />
            <p id="email-error" className="error-message"></p>
          </div>
          <div className="input-box">
            <input
              type="password"
              id="password-register"
              required
              placeholder="Senha"
            />
          </div>
          <div className="input-box">
            <input
              type="password"
              id="password-confirm"
              required
              placeholder="Confirme a senha"
            />
            <p id="password-confirm-error" className="error-message"></p>
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
              <a href="#" className="login-link">
                Login
              </a>
            </p>
          </div>
        </form>
      </div>

      <div id="code" style={{ display: "none" }}>
        <h2>Verifique seu e-mail</h2>

        <p>Digite o codigo que enviamos para o e-mail</p>
        <p>xxxxxxxxx@xxxxxx.com</p>
        <div className="input-code">
          <input maxLength="1" className="verification-code" />
          <input maxLength="1" className="verification-code" />
          <input maxLength="1" className="verification-code" />
          <input maxLength="1" className="verification-code" />
        </div>

        <button id="verify-code-btn">Confirmar</button>
      </div>
    </div>
  );
}

AuthWidgets.propTypes = {
  active: PropTypes.bool.isRequired,
  isRegistering: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
};

export default AuthWidgets;
