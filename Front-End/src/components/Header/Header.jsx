import { useEffect, useState } from "react";
import "./Header.css";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import AuthWidgets from "../AuthWidgets/AuthWidgets";
import Searchbar from "../Searchbar/Searchbar";

function Header({ isMapPage, setFiltroSelecionado, setSubFiltroSelecionado }) {
  const [authPopup, setAuthPopUp] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  const OpenAuthModal = (registring) => {
    setAuthPopUp(true);
    setIsRegistering(registring);
  };

  useEffect(() => {
    const cabecalho = document.querySelector(".header-container");
    const logoContainer = document.querySelector(".logoContainer");

    const handleScroll = () => {
      if (window.scrollY > 50) {
        cabecalho?.classList.add("scrolled");
        logoContainer?.classList.add("logoContainerNone");
      } else {
        cabecalho.classList.remove("scrolled");
        logoContainer?.classList.remove("logoContainerNone");
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="header-container">
      <header className="header container">
        <Link to="/home">
          <img
            id="logo"
            src="assets/images/Drillmap_logo.png"
            className="header-logo"
          />
        </Link>

        <nav className="header-nav">
          <ul>
            {isMapPage && (
              <Searchbar
                setFiltroSelecionado={setFiltroSelecionado}
                setSubFiltroSelecionado={setSubFiltroSelecionado}
              />
            )}
            {isMapPage && <li id="ajuda-btn">Ajuda</li>}
            {!isMapPage && (
              <Link to="/mapa">
                <span id="map-icon" className="material-symbols-outlined">
                  travel_explore
                </span>
              </Link>
            )}
            {isMapPage && (
              <span id="info-icon" className="material-symbols-outlined">
                info
              </span>
            )}
            <span id="dark-mode-icon" className="material-symbols-outlined">
              dark_mode
            </span>
            <span id="login-icon" className="material-symbols-outlined">
              login
            </span>
            {!isMapPage && (
              <li>
                <Link to="/mapa" id="map-btn">
                  Mapa
                </Link>
              </li>
            )}
            <li className="darkModeToggle">
              <span className="material-symbols-outlined icon">dark_mode</span>
            </li>
            <li
              className="btnRegister-popup"
              onClick={() => OpenAuthModal(true)}
            >
              Cadastre-se
            </li>
            <li
              className="header__loginBtn btnLogin-popup"
              onClick={() => OpenAuthModal(false)}
            >
              Login
            </li>
          </ul>
        </nav>
      </header>
      <AuthWidgets
        active={authPopup}
        isRegistering={isRegistering}
        closeModal={() => setAuthPopUp(false)}
      />
    </div>
  );
}

Header.propTypes = {
  isMapPage: PropTypes.bool.isRequired,
  setFiltroSelecionado: PropTypes.func.isRequired,
  setSubFiltroSelecionado: PropTypes.func.isRequired,
};
export default Header;
