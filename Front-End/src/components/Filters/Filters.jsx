import PropTypes from "prop-types";
import "./Filters.css";
import Subfilters from "../SubFilters/SubFilters";
import { useEffect, useState } from "react";

function Filters({
  categoria,
  showFilters,
  selecionarSubFiltro,
  onClose,
  darkMode,
  isLoading,
  buscarMaisDados,
  handleSelecionarFiltro,
  dados,
  pagina,
  setPagina,
  setUltimoFiltro, 
  setUltimaCategoria, 
}) {
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
    let filtroParam = filtro
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
    handleSelecionarFiltro(filtroParam, categoria, 0);
  };

  const handleSubfiltroClick = (subfiltro) => {
    // Passa o filtro e o subfiltro selecionado para o componente pai
    if (selecionarSubFiltro) {
      selecionarSubFiltro(filtroSelecionado, subfiltro); // Passando o filtro e subfiltro selecionado
    }
  };

  const handleFiltroOuCategoria = (novoFiltro, novaCategoria) => {
    setUltimoFiltro(novoFiltro);
    setUltimaCategoria(novaCategoria);
    setPagina(0); // Isso vai disparar o useEffect acima
  };

  return (
    <div className={`filters ${isVisible ? "show" : ""}`}>
      {opcoesFiltros[categoria] ? (
        opcoesFiltros[categoria].map((filtro, index) => (
          <p
            key={index}
            className="filtro-item"
            onClick={() => {
              handleFiltroClick(filtro);
              handleFiltroOuCategoria(filtro, categoria);
            }}
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
          isLoading={isLoading}
          buscarMaisDados={buscarMaisDados}
          dados={dados}
          pagina={pagina}
          setPagina={setPagina}
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
  isLoading: PropTypes.bool,
  buscarMaisDados: PropTypes.func,
  handleSelecionarFiltro: PropTypes.func,
  dados: PropTypes.array,
  pagina: PropTypes.number,
  setPagina: PropTypes.func,
  setUltimoFiltro: PropTypes.func,
  setUltimaCategoria: PropTypes.func,
};

export default Filters;
