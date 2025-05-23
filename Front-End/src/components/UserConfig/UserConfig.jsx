import PropTypes from "prop-types";
import "./UserConfig.css";
import { useEffect, useState } from "react";

function UserConfig({
  showUserConfig,
  setShowUserConfig,
  setShowUserProfile,
  setShowDeleteConfirm,
}) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (showUserConfig) {
      const timer = setTimeout(() => setIsVisible(true), 10);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [showUserConfig]);

  return (
    <div className={`userConfig-container ${isVisible ? "show" : ""}`}>
      <h4>Configurações</h4>
      <div className="config-options" onClick={() => setShowUserProfile(true)}>
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
      <div className="config-options" onClick={() => setShowUserConfig(false)}>
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
};
export default UserConfig;
