import PropTypes from "prop-types";
import "./UserConfig.css";
import { useEffect, useState } from "react";

function UserConfig({
  showUserConfig,
  setShowUserProfile,
  setShowDeleteConfirm,
  setShowUserWidget,
  onClose,
}) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (showUserConfig) {
      setIsVisible(true);
    }
  }, [showUserConfig]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300); // Tempo igual ao da transição CSS
  };

  // Fechar ao clicar fora (opcional)
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isVisible && !e.target.closest(".userConfig-container")) {
        handleClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isVisible]);

  return (
    <div className={`userConfig-container ${isVisible ? "show" : ""}`}>
      <h4>Configurações</h4>
      <div
        className="config-options"
        onClick={() => {
          setShowUserProfile(true);
          handleClose();
        }}
      >
        <span className="material-symbols-outlined">person</span>
        <p>Seu perfil</p>
      </div>
      <div
        className="config-options person-remove"
        onClick={() => setShowDeleteConfirm(true)}
      >
        <span className="material-symbols-outlined">person_remove</span>
        <p>Desativar conta</p>
      </div>
      <div
        className="config-options"
        onClick={() => {
          setShowUserWidget(true);
          handleClose();
        }}
      >
        <span className="material-symbols-outlined">undo</span>
        <p>Voltar</p>
      </div>
    </div>
  );
}

UserConfig.propTypes = {
  showUserConfig: PropTypes.bool.isRequired,
  setShowUserConfig: PropTypes.func.isRequired,
  setShowUserProfile: PropTypes.func.isRequired,
  setShowDeleteConfirm: PropTypes.func.isRequired,
  setShowUserWidget: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};
export default UserConfig;
