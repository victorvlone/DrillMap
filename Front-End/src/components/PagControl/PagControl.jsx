import PropTypes from "prop-types";
import "./PagControl.css";

function PagControl({ mudarPagina, paginaAtual }) {
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
        onClick={() => mudarPagina(paginaAtual + 1)}
      >
        add
      </span>
    </div>
  );
}

PagControl.propTypes = {
  mudarPagina: PropTypes.func.isRequired,
  paginaAtual: PropTypes.number.isRequired,
};

export default PagControl;
