import { useEffect, useState } from "react";
import "./UserWidget.css";
import PropTypes from "prop-types";

function UserWidget({
  showUserWidget,
  setShowUserConfig,
  setShowFavoriteList,
  onClose,
}) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (showUserWidget) {
      const timer = setTimeout(() => setIsVisible(true), 10);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
      const timeout = setTimeout(() => {
        onClose();
      }, 300);
      return () => clearTimeout(timeout);
    }
  }, [showUserWidget, onClose]);

  return (
    <>
      <div className={`user-container ${isVisible ? "show" : ""}`}>
        <div className="user-option" onClick={() => setShowFavoriteList(true)}>
          <span className="material-symbols-outlined">bookmarks</span>
          <p>Salvos</p>
        </div>

        <div className="user-option" onClick={() => setShowUserConfig(true)}>
          <span className="material-symbols-outlined">manufacturing</span>
          <p>Config.</p>
        </div>

        <div className="user-option">
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
};
export default UserWidget;
