import { useEffect, useState } from "react";
import "./UserWidget.css";
import PropTypes from "prop-types";
import { auth } from "../../utils/firebaseConfig";
import { signOut } from "firebase/auth";

function UserWidget({
  showUserWidget,
  setShowUserConfig,
  setShowFavoriteList,
  onClose,
  setUsuario,
}) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (showUserWidget) {
      setIsVisible(true);
    }
  }, [showUserWidget]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300); // Tempo igual ao da transição CSS
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUsuario(null);
      handleClose();
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  // Fechar ao clicar fora (opcional)
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isVisible && !e.target.closest(".user-container")) {
        handleClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isVisible]);

  return (
    <>
      <div className={`user-container ${isVisible ? "show" : ""}`}>
        <div
          className="user-option"
          onClick={() => {
            setShowFavoriteList(true);
            handleClose();
          }}
        >
          <span className="material-symbols-outlined">bookmarks</span>
          <p>Salvos</p>
        </div>

        <div
          className="user-option"
          onClick={() => {
            setShowUserConfig(true);
            handleClose();
          }}
        >
          <span className="material-symbols-outlined">manufacturing</span>
          <p>Config.</p>
        </div>

        <div className="user-option" onClick={handleLogout}>
          <span className="material-symbols-outlined">logout</span>
          <p>Sair</p>
        </div>
      </div>
    </>
  );
}

UserWidget.propTypes = {
  showUserWidget: PropTypes.bool.isRequired,
  setShowUserConfig: PropTypes.func.isRequired,
  setShowFavoriteList: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  setUsuario: PropTypes.func,
};
export default UserWidget;
