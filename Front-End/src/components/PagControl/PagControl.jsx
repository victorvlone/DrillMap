import PropTypes from "prop-types";
import "./PagControl.css";

function PagControl({ mudarPagina, paginaAtual, totalPages, onAttemptNext }) {
  return (
    <div className="pagControl">
      <span
        className={`material-symbols-outlined ${
          paginaAtual === 0 ? "disabled" : ""
        }`}
        onClick={() => {
          if (paginaAtual > 0) mudarPagina(paginaAtual - 1);
        }}
      >
        remove
      </span>
      <p>Carregar mais</p>
      <span
        className="material-symbols-outlined"
        onClick={() => {
          if (paginaAtual < totalPages - 1) {
            mudarPagina(paginaAtual + 1);
          } else {
            onAttemptNext(); // Chama a função quando tentar passar da última página
          }
        }}
      >
        add
      </span>
    </div>
  );
}

PagControl.propTypes = {
  mudarPagina: PropTypes.func.isRequired,
  paginaAtual: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onAttemptNext: PropTypes.func.isRequired,
};

export default PagControl;
