import { useEffect, useState } from "react";
import { auth } from "../../utils/firebaseConfig";
import "./FavoritosList.css";
import { onAuthStateChanged } from "firebase/auth";
import PropTypes from "prop-types";

function FavoritosList({ showFavoriteList, setShowFavoriteList }) {
  const [favoritos, setFavoritos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (showFavoriteList) {
      const timer = setTimeout(() => setIsVisible(true), 10);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [showFavoriteList]);

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
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const url = `${import.meta.env.VITE_API_URL}/favoritos/listar/${
          user.uid
        }`;
        fetch(url)
          .then((response) => response.json())
          .then((data) => {
            setFavoritos(data);
            setLoading(false);
          })
          .catch((err) => {
            console.error(
              "Erro ao listar poços favoritos do usuário:",
              err.message
            );
            setLoading(false);
          });
      } else {
        setLoading(false);
        setFavoritos([]);
      }
    });

    return () => unsubscribe(); // cleanup
  }, []);
  return (
    <div className={`favoritosList-container ${isVisible ? "show" : ""}`}>
      <h4>Salvos</h4>
      {loading ? (
        <p>Carregando...</p>
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
      <div className="back-btn" onClick={() => setShowFavoriteList(false)}>
        <span className="material-symbols-outlined">undo</span>
        <p>Voltar</p>
      </div>
    </div>
  );
}

FavoritosList.propTypes = {
  showFavoriteList: PropTypes.bool.isRequired,
  setShowFavoriteList: PropTypes.func.isRequired,
};

export default FavoritosList;
