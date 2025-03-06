import PropTypes from "prop-types";
import "./Filters.css";
import Subfilters from "../SubFilters/SubFilters";
import { useState } from "react";

function Filters({ categoria, showFilters }) {
  const [filtroSelecionado, setFiltroSelecionado] = useState(null);

  const opcoesFiltros = {
    Bacias: ["Nome", "Estado"],
    Blocos: ["Nome", "Estado"],
    Campos: ["Nome", "Estado"],
    Poços: [
      "Nome",
      "Estado",
      "Inicio",
      "Termino",
      "Conclusão",
      "Reclassificação",
      "Tipo de poço",
      "Categoria",
      "Situação",
      "Poço operador",
    ],
  };

  const handleFiltroClick = (filtro) => {
    setFiltroSelecionado(filtro);
  };

  return (
    <div className={`filters ${showFilters ? "show" : "hidden"}`}>
      {opcoesFiltros[categoria] ? (
        opcoesFiltros[categoria].map((filtro, index) => (
          <p
            key={index}
            className="filtro-item"
            onClick={() => handleFiltroClick(filtro)} // Atualiza o estado ao clicar
          >
            {filtro}
          </p>
        ))
      ) : (
        <p>Nenhum filtro disponível</p>
      )}

      {/* Renderizando o componente Subfilters quando um filtro for selecionado */}
      {filtroSelecionado && (
        <Subfilters categoria={categoria} filtro={filtroSelecionado} />
      )}
    </div>
  );
}

Filters.propTypes = {
  categoria: PropTypes.string.isRequired,
  showFilters: PropTypes.bool.isRequired,
};

export default Filters;
