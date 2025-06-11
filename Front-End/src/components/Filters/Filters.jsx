import PropTypes from "prop-types";
import "./Filters.css";
import Subfilters from "../SubFilters/SubFilters";
import { useEffect, useState } from "react";

function Filters({ categoria, showFilters, selecionarSubFiltro, onClose, darkMode }) {
  const [filtroSelecionado, setFiltroSelecionado] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

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

  useEffect(() => {
    if (showFilters) {
      const timer = setTimeout(() => setIsVisible(true), 10);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
      const timeout = setTimeout(() => {
        onClose();
      }, 300);
      return () => clearTimeout(timeout);
    }
  }, [showFilters, onClose]);

  const handleFiltroClick = (filtro) => {
    setFiltroSelecionado(filtro);
  };

  const handleSubfiltroClick = (subfiltro) => {
    // Passa o filtro e o subfiltro selecionado para o componente pai
    if (selecionarSubFiltro) {
      selecionarSubFiltro(filtroSelecionado, subfiltro); // Passando o filtro e subfiltro selecionado
    }
  };

  return (
    <div className={`filters ${isVisible ? "show" : ""}`}>
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
        <Subfilters
          categoria={categoria}
          filtro={filtroSelecionado}
          onSubfiltroClick={handleSubfiltroClick}
          onClose={onClose}
          darkMode={darkMode}
        />
      )}
    </div>
  );
}

Filters.propTypes = {
  categoria: PropTypes.string.isRequired,
  showFilters: PropTypes.bool.isRequired,
  selecionarSubFiltro: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  darkMode: PropTypes.bool,
};

export default Filters;
