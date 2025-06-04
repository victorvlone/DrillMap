import { useEffect, useState } from "react";
import "./UserProfile.css";
import PropTypes from "prop-types";
import { auth } from "../../utils/firebaseConfig";

function UserProfile({ showUserProfile, onClose }) {
  const [userData, setUserData] = useState({ name: "", email: "" });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (showUserProfile) {
      setIsVisible(true);
    }
  }, [showUserProfile]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300); // Tempo igual ao da transição CSS
  };

  // Fechar ao clicar fora (opcional)
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isVisible && !e.target.closest(".userProfile-container")) {
        handleClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isVisible]);

  useEffect(() => {
    async function fetchUserData() {
      const user = auth.currentUser;
      console.log(auth.currentUser);
      if (!user) return;

      fetch(`${import.meta.env.VITE_API_URL}/api/usuarios/${user.uid}`)
        .then((Response) => Response.json())
        .then((data) => {
          console.log(data);
          setUserData({
            name: (data.primeiroNome || "") + " " + (data.ultimoNome || ""),
            email: data.email || user.email,
          });
        })
        .catch((err) => console.error(err));
    }

    fetchUserData();
  }, []);

  return (
    <div className={`userProfile-container ${isVisible ? "show" : ""}`}>
      <div className="userProfile-banner">
        <img src="assets/images/drillmapProfile.jpg" alt="" />
        <div className="userProfile-edit">
          <h4>{userData.name || "Usuário sem nome"}</h4>
          <p>Editar Perfil</p>
        </div>
      </div>
      <div className="userProfile-data">
        <div className="userProfile-email">
          <h4>Email</h4>
          <p>{userData.email}</p>
        </div>
        <div className="userProfile-password">
          <h4>Senha</h4>
          <p>••••••••••</p>
        </div>
      </div>
      <div
        className="back-btn"
        onClick={() => {
          handleClose();
        }}
      >
        <span className="material-symbols-outlined">undo</span>
        <p>Voltar</p>
      </div>
    </div>
  );
}

UserProfile.propTypes = {
  showUserProfile: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default UserProfile;
