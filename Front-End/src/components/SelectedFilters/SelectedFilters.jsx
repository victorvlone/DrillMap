import PropTypes from "prop-types";
import "./SelectedFilters.css";

function SelectedFilters({ filtrosSelecionados, removerFiltro }) {
  return (
    <div
      className={`filters-selected ${
        filtrosSelecionados.length > 0 ? "show" : ""
      }`}
    >
      {filtrosSelecionados.map((filtro, index) => (
        <div key={index} className="filter-selected">
          {filtro}
          <span
            className="material-symbols-outlined"
            onClick={() => removerFiltro(filtro)}
          >
            close
          </span>
        </div>
      ))}
    </div>
  );
}

SelectedFilters.propTypes = {
  filtrosSelecionados: PropTypes.array.isRequired, // Define que é um array obrigatório
  removerFiltro: PropTypes.func.isRequired,
};

export default SelectedFilters;
