import PropTypes from "prop-types";
import "./PocoInfoCard.css";
import { useEffect, useState } from "react";

function PocoInfoCard({ poco, onClose }) {
  const [isVisible, setIsVisible] = useState(false);

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
            <span className="material-symbols-outlined">bookmark</span>
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
};

export default PocoInfoCard;
