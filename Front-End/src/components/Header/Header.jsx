import { useEffect, useState } from "react";
import "./Header.css";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import AuthWidgets from "../AuthWidgets/AuthWidgets";
import Searchbar from "../Searchbar/Searchbar";
import UserWidget from "../userWidget/UserWidget";
import UserConfig from "../UserConfig/UserConfig";
import UserProfile from "../UserProfile/UserProfile";
import FavoritosList from "../FavoritosList/FavoritosList";

function Header({
  isMapPage,
  mudarPagina,
  paginaAtual,
  setShowPagControl,
  setPocoSelecionado,
  setStartHelpTour,
  setDadosPaginados,
  usuarioLogado,
  setUsuarioLogado,
  setShowDeleteConfirm,
}) {
  const [authPopup, setAuthPopUp] = useState(false);
  const [isRegistering, setIsRegistering] = useState("");
  const [showUserWidget, setShowUserWidget] = useState(false);
  const [showUserConfig, setShowUserConfig] = useState(false);
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [showFavoriteList, setShowFavoriteList] = useState(false);

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
            src="assets/images/Drillmap_logo.png"
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
            {usuarioLogado && (
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
            {showFavoriteList && (
              <FavoritosList
                showFavoriteList={showFavoriteList}
                setShowFavoriteList={setShowFavoriteList}
              />
            )}
            {showUserWidget && (
              <UserWidget
                showUserWidget={showUserWidget}
                setShowUserConfig={setShowUserConfig}
                setShowFavoriteList={setShowFavoriteList}
              />
            )}
            {showUserConfig && (
              <UserConfig
                showUserConfig={showUserConfig}
                setShowUserConfig={setShowUserConfig}
                setShowUserProfile={setShowUserProfile}
                setShowDeleteConfirm={setShowDeleteConfirm}
              />
            )}
            {showUserProfile && (
              <UserProfile
                showUserProfile={showUserProfile}
                setShowUserProfile={setShowUserProfile}
              />
            )}
            {!usuarioLogado && (
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
      <AuthWidgets
        active={authPopup}
        isRegistering={isRegistering}
        setIsRegistering={setIsRegistering}
        closeModal={() => setAuthPopUp(false)}
      />
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
  usuarioLogado: PropTypes.bool.isRequired,
  setUsuarioLogado: PropTypes.func.isRequired,
  setShowDeleteConfirm: PropTypes.func.isRequired,
};
export default Header;
