import PropTypes from "prop-types";
import "./PocoInfoCard.css";
import { useEffect, useState } from "react";
import { auth } from "../../utils/firebaseConfig";
import { iconFavorito } from "../../utils/mapIcons";

function PocoInfoCard({ poco, onClose, markerLayerRef, darkMode }) {
  const [isVisible, setIsVisible] = useState(false);
  const [favoritado, setFavoritado] = useState(null);
  const [iconeCarregando, setIconeCarregando] = useState(true);

  useEffect(() => {
    // Adiciona a classe 'show' depois que o componente é montado
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const handleCloseClick = () => {
    setIsVisible(false); // Remove a classe 'show'

    // Aguarda a transição terminar antes de desmontar
    setTimeout(() => {
      onClose();
    }, 300); // mesmo tempo do transition no CSS
  };

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 10);

    setIconeCarregando(true);
    const verificarSeJaFoiFavoritado = async () => {
      const user = auth.currentUser;
      if (!user) {
        setIconeCarregando(false);
        return;
      }

      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/favoritos/listar/${user.uid}`
        );
        if (!res.ok) throw new Error("Erro ao buscar favoritos");

        const favoritos = await res.json();
        const jaFavoritado = favoritos.some((fav) => fav.poco.id === poco.id);
        setFavoritado(jaFavoritado);
      } catch (err) {
        console.error("Erro ao verificar favorito:", err);
      } finally {
        setIconeCarregando(false); // 🔁 Desliga o loading
      }
    };

    verificarSeJaFoiFavoritado();

    return () => clearTimeout(timer);
  }, [poco.id]);

  function favoritar() {
    const user = auth.currentUser;
    const url = `${import.meta.env.VITE_API_URL}/favoritos/favoritar`;

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        usuario: { id: user.uid },
        poco: { id: poco.id },
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Erro ao favoritar");
      })
      .then((data) => {
        console.log("Favoritado com sucesso: ", data);
        setFavoritado(true);

        if (markerLayerRef.current) {
          markerLayerRef.current.eachLayer((layer) => {
            const markerLatLng = layer.getLatLng();
            const pocoLat = parseFloat(
              poco.latitude.toString().replace(",", ".")
            );
            const pocoLng = parseFloat(
              poco.longitude.toString().replace(",", ".")
            );

            const isSameLocation =
              Math.abs(markerLatLng.lat - pocoLat) < 0.00001 &&
              Math.abs(markerLatLng.lng - pocoLng) < 0.00001;

            if (isSameLocation) {
              layer.setIcon(iconFavorito); // muda pro ícone de favorito
            }
          });
        }
      })
      .catch((err) => {
        console.error("Erro ao favoritar: ", err);
      });
  }

  return (
    <div className={`poco-container ${isVisible ? "show" : ""}`}>
      <div className="poco-title">
        <span
          className="material-symbols-outlined poco-close"
          onClick={handleCloseClick}
        >
          close
        </span>
        <div className="poco-buttons">
          <div className="icons-data">
            <span className="material-symbols-outlined">location_on</span>
            <div className="poco-name">
              <h5>{poco.nomePoco}</h5>
              <p>{poco.estado}</p>
            </div>
          </div>
          <div className="icons-buttons">
            <div onClick={favoritar} className="favorito-icon">
              {iconeCarregando || favoritado === null ? (
                // Mostra ícone de loading enquanto carrega ou ainda está indefinido
                <lord-icon
                  src="https://cdn.lordicon.com/ibckyoan.json"
                  trigger="loop"
                  colors={`primary:${darkMode ? "#ffffff" : "#000000"}`}
                  state="loop-autorenew"
                  style={{ width: "40px", height: "40px" }}
                />
              ) : (
                // Ícone final (favoritado ou não)
                <span
                  className="material-symbols-outlined"
                  style={{
                    fontSize: "36px",
                  }}
                >
                  {favoritado ? "bookmark_added" : "bookmark"}
                </span>
              )}
            </div>

            <span className="material-symbols-outlined">article</span>
          </div>
        </div>
      </div>
      <div className="poco-content">
        <div className="poco-data">
          <h3>Cadastro</h3>
          <h2>{poco.cadastro}</h2>
        </div>
        <div className="poco-data">
          <h3>Latitude</h3>
          <h2>{poco.latitude}</h2>
        </div>
        <div className="poco-data">
          <h3>Longitude</h3>
          <h2>{poco.longitude}</h2>
        </div>
        <div className="poco-data">
          <h3>Inicio</h3>
          <h2>{poco.inicio}</h2>
        </div>
        <div className="poco-data">
          <h3>Termino</h3>
          <h2>{poco.termino}</h2>
        </div>
        <div className="poco-data">
          <h3>Conclusão</h3>
          <h2>{poco.conclusao}</h2>
        </div>
        <div className="poco-data">
          <h3>Poço Operador</h3>
          <h2>{poco.pocoOperador}</h2>
        </div>
        <div className="poco-data">
          <h3>Terra/Mar</h3>
          <h2>{poco.tipodePoco}</h2>
        </div>
        <div className="poco-data">
          <h3>Bacia</h3>
          <h2>{poco.nomeBacia}</h2>
        </div>
        <div className="poco-data">
          <h3>Bloco</h3>
          <h2>{poco.nomeBloco}</h2>
        </div>
        <div className="poco-data">
          <h3>Campo</h3>
          <h2>{poco.nomeCampo}</h2>
        </div>
        <div className="poco-data">
          <h3>Situação</h3>
          <h2>{poco.situacao}</h2>
        </div>
        <div className="poco-data">
          <h3>Reclassificação</h3>
          <h2>{poco.reclassificacao}</h2>
        </div>
        <div className="poco-data">
          <h3>Categoria</h3>
          <h2>{poco.categoria}</h2>
        </div>
      </div>
    </div>
  );
}

PocoInfoCard.propTypes = {
  poco: PropTypes.any,
  onClose: PropTypes.func.isRequired,
  markerLayerRef: PropTypes.object,
  darkMode: PropTypes.bool,
};

export default PocoInfoCard;
