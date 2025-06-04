import { useEffect, useState } from "react";
import "./Header.css";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Searchbar from "../Searchbar/Searchbar";
import UserWidget from "../UserWidget/UserWidget.jsx";
import UserConfig from "../UserConfig/UserConfig";

function Header({
  isMapPage,
  mudarPagina,
  paginaAtual,
  setShowPagControl,
  setPocoSelecionado,
  setStartHelpTour,
  setDadosPaginados,
  usuario,
  setUsuario,
  setShowDeleteConfirm,
  markerLayerRef,
  setShowFavoriteList,
  setShowUserProfile,
  showUserConfig,
  setShowUserConfig,
  setIsRegistering,
  setAuthPopUp,
  setDarkMode,
  darkMode,
}) {
  const [showUserWidget, setShowUserWidget] = useState(false);

  const OpenAuthModal = (authType) => {
    setAuthPopUp(true);
    setIsRegistering(authType);
  };

  function altShowWidgets() {
    setShowUserWidget((prev) => !prev);
    setShowUserConfig(false);
    setShowUserProfile(false);
  }

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
            src={
              darkMode
                ? "assets/images/Drillmap_logo-dark.png"
                : "assets/images/Drillmap_logo.png"
            }
            className="header-logo"
          />
        </Link>

        <nav className="header-nav">
          <ul>
            {isMapPage && (
              <Searchbar
                mudarPagina={mudarPagina}
                paginaAtual={paginaAtual}
                setShowPagControl={setShowPagControl}
                setPocoSelecionado={setPocoSelecionado}
                setDadosPaginados={setDadosPaginados}
                markerLayerRef={markerLayerRef}
              />
            )}
            {isMapPage && (
              <li id="ajuda-btn" onClick={() => setStartHelpTour(true)}>
                Ajuda
              </li>
            )}
            {!isMapPage && (
              <Link to="/mapa">
                <span id="map-icon" className="material-symbols-outlined">
                  travel_explore
                </span>
              </Link>
            )}
            {isMapPage && (
              <span
                id="info-icon"
                className="material-symbols-outlined"
                onClick={() => setStartHelpTour(true)}
              >
                info
              </span>
            )}
            <span
              id="dark-mode-icon"
              className="material-symbols-outlined"
              onClick={() => setDarkMode((prev) => !prev)}
            >
              {darkMode ? "light_mode" : "dark_mode"}
            </span>
            {!usuario && (
              <span
                id="login-icon"
                className="material-symbols-outlined"
                onClick={() => OpenAuthModal("login")}
              >
                login
              </span>
            )}
            {!isMapPage && (
              <li>
                <Link to="/mapa" id="map-btn">
                  Mapa
                </Link>
              </li>
            )}
            <li
              className="darkModeToggle"
              onClick={() => setDarkMode((prev) => !prev)}
            >
              <span className="material-symbols-outlined icon">
                {" "}
                {darkMode ? "light_mode" : "dark_mode"}
              </span>
            </li>
            {usuario && (
              <>
                <li className="notification-icon">
                  <span className="material-symbols-outlined">
                    notifications
                  </span>
                </li>
                <img
                  className="profile"
                  src="assets/images/drillmapProfile.jpg"
                  alt=""
                  onClick={() => altShowWidgets()}
                />
              </>
            )}
            {showUserWidget && (
              <UserWidget
                showUserWidget={showUserWidget}
                setShowUserConfig={setShowUserConfig}
                setShowFavoriteList={setShowFavoriteList}
                setUsuario={setUsuario}
                onClose={() => setShowUserWidget(false)}
              />
            )}
            {showUserConfig && (
              <UserConfig
                showUserConfig={showUserConfig}
                setShowUserConfig={setShowUserConfig}
                setShowUserProfile={setShowUserProfile}
                setShowDeleteConfirm={setShowDeleteConfirm}
                setShowUserWidget={setShowUserWidget}
                onClose={() => setShowUserConfig(false)}
              />
            )}
            {!usuario && (
              <>
                <li
                  className="btnRegister-popup"
                  onClick={() => OpenAuthModal("register")}
                >
                  Cadastre-se
                </li>
                <li
                  className="header__loginBtn btnLogin-popup"
                  onClick={() => OpenAuthModal("login")}
                >
                  Login
                </li>
              </>
            )}
          </ul>
        </nav>
      </header>
    </div>
  );
}

Header.propTypes = {
  isMapPage: PropTypes.bool.isRequired,
  mudarPagina: PropTypes.func,
  paginaAtual: PropTypes.number,
  setShowPagControl: PropTypes.func,
  setPocoSelecionado: PropTypes.func,
  setStartHelpTour: PropTypes.func.isRequired,
  setDadosPaginados: PropTypes.func.isRequired,
  usuario: PropTypes.object,
  setUsuario: PropTypes.func,
  setShowDeleteConfirm: PropTypes.func.isRequired,
  markerLayerRef: PropTypes.object,
  setShowFavoriteList: PropTypes.func.isRequired,
  setShowUserProfile: PropTypes.func.isRequired,
  setShowUserConfig: PropTypes.func.isRequired,
  showUserConfig: PropTypes.bool.isRequired,
  setAuthPopUp: PropTypes.func,
  setIsRegistering: PropTypes.func.isRequired,
  setDarkMode: PropTypes.func,
  darkMode: PropTypes.bool,
};
export default Header;
