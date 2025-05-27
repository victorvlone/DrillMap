import { useEffect, useState } from "react";
import { auth } from "../../utils/firebaseConfig";
import "./FavoritosList.css";
import { onAuthStateChanged } from "firebase/auth";
import PropTypes from "prop-types";

function FavoritosList({ showFavoriteList, setShowUserConfig, onClose }) {
  const [favoritos, setFavoritos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (showFavoriteList) {
      setIsVisible(true);
    }
  }, [showFavoriteList]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300); // Tempo igual ao da transição CSS
  };

  // Fechar ao clicar fora (opcional)
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isVisible && !e.target.closest(".favoritosList-container")) {
        handleClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isVisible]);

  function removerFavorito(id) {
    const url = `${import.meta.env.VITE_API_URL}/favoritos/excluir/${id}`;

    fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          console.log("Favorito removido com sucesso!");
          setFavoritos((prevFavoritos) =>
            prevFavoritos.filter((fav) => fav.id !== id)
          );
        } else {
          console.erro("Erro ao remover favorito: ", response.status);
        }
      })
      .then((data) => {
        console.log(data);
      })
      .catch((err) => {
        console.error("Erro na requisição: ", err.message());
      });
  }

  useEffect(() => {
    setLoading(true);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const url = `${import.meta.env.VITE_API_URL}/favoritos/listar/${
          user.uid
        }`;
        fetch(url)
          .then((response) => {
            if (!response.ok) throw new Error("Erro na requisição");
            return response.json();
          })
          .then((data) => {
            setFavoritos(data || []);
          })
          .catch((err) => {
            console.error("Erro ao listar favoritos:", err);
            setFavoritos([]);
          })
          .finally(() => {
            setLoading(false);
          });
      } else {
        setFavoritos([]);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);
  return (
    <div
      className={`favoritosList-container container ${
        isVisible ? "show" : ""
      } ${!loading ? "loaded" : ""}`}
    >
      <h4>Salvos</h4>
      {loading ? (
        <lord-icon
          src="https://cdn.lordicon.com/ibckyoan.json"
          trigger="loop"
          state="loop-autorenew"
          style={{ width: "40px", height: "40px" }}
        />
      ) : favoritos.length === 0 ? (
        <p>Nenhum poço salvo.</p>
      ) : (
        <ul>
          {favoritos.map((fav) => (
            <li key={fav.id} className="favorito-item">
              <img src="assets/images/mapaIcon.png" alt="" />
              <div className="favoritosList-info">
                <strong>{fav.poco?.nome || "Poço sem nome"}</strong>
                <p>{fav.poco?.situacao || "Situação desconhecida"}</p>
              </div>
              <span
                className="material-symbols-outlined removerFav"
                onClick={() => removerFavorito(fav.id)}
              >
                close
              </span>
            </li>
          ))}
        </ul>
      )}
      <div
        className="back-btn"
        onClick={() => {
          handleClose();
          setShowUserConfig(true);
        }}
      >
        <span className="material-symbols-outlined">undo</span>
        <p>Voltar</p>
      </div>
    </div>
  );
}

FavoritosList.propTypes = {
  showFavoriteList: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  setShowUserConfig: PropTypes.func.isRequired,
};

export default FavoritosList;
