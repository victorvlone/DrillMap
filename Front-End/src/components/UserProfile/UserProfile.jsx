import { useEffect, useState } from "react";
import "./UserProfile.css";
import PropTypes from "prop-types";
import { auth } from "../../utils/firebaseConfig";

function UserProfile({ showUserProfile, setShowUserProfile }) {
  const [isVisible, setIsVisible] = useState(false);
  const [userData, setUserData] = useState({ name: "", email: "" });

  useEffect(() => {
    if (showUserProfile) {
      const timer = setTimeout(() => setIsVisible(true), 10);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [showUserProfile]);

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
          <p>senha12334</p>
        </div>
      </div>
      <div className="back-btn" onClick={() => setShowUserProfile(false)}>
        <span className="material-symbols-outlined">undo</span>
        <p>Voltar</p>
      </div>
    </div>
  );
}

UserProfile.propTypes = {
  showUserProfile: PropTypes.bool.isRequired,
  setShowUserProfile: PropTypes.func.isRequired,
};

export default UserProfile;
