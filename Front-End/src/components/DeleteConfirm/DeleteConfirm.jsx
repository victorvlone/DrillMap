import PropTypes from "prop-types";
import "./DeleteConfirm.css";
import { useEffect, useState } from "react";
import { auth } from "../../utils/firebaseConfig";
import { EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";

function DeleteConfirm({ showDeleteConfirm, setShowDeleteConfirm }) {
  const [isVisible, setIsVisible] = useState(false);
  const [senha, setSenha] = useState("");

  useEffect(() => {
    if (showDeleteConfirm) {
      const timer = setTimeout(() => setIsVisible(true), 10);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [showDeleteConfirm]);

  function deletar() {
    const user = auth.currentUser;
    if (!user) return;

    const email = auth.currentUser.email;

    const credencial = EmailAuthProvider.credential(email, senha);

    reauthenticateWithCredential(user, credencial)
      .then(() => {
        const url = `${import.meta.env.VITE_API_URL}/api/usuarios/${user.uid}`;

        fetch(url, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        });
      })
      .then((response) => {
        if (response.ok) {
          console.log(`Usuario deletado com sucesso.`);
          return user.delete();
        } else {
          console.error(`Erro ao deletar usuario: ${response.status}`);
        }
      })
      .then(() => {
        console.log("Usuário deletado do Firebase Auth.");
        setShowDeleteConfirm(false);
      })
      .catch((error) => {
        console.error(`Erro na requisição:`, error);
      });
  }

  return (
    <div className={`deleteConfirm-container ${isVisible ? "show" : ""}`}>
      <p>Tem certeza que deseja deletar sua conta?</p>
      <input
        type="password"
        placeholder="Digite sua senha"
        value={senha}
        onChange={(e) => setSenha(e.target.value)}
      />
      <div className="deletecConfirm-buttons">
        <button
          className="cancelar"
          onClick={() => setShowDeleteConfirm(false)}
        >
          Cancelar
        </button>
        <button className="confirmar" onClick={() => deletar()}>
          Confirmar
        </button>
      </div>
    </div>
  );
}

DeleteConfirm.propTypes = {
  showDeleteConfirm: PropTypes.bool.isRequired,
  setShowDeleteConfirm: PropTypes.func.isRequired,
};

export default DeleteConfirm;
