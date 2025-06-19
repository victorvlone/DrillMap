import { useEffect, useRef, useState } from "react";
import "./SubFilters.css";
import PropTypes from "prop-types";

function Subfilters({
  categoria,
  filtro,
  onSubfiltroClick,
  onClose,
  darkMode,
  isLoading,
  buscarMaisDados,
  dados,
  pagina,
  setPagina,
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [itensVisiveis, setItensVisiveis] = useState(100);
  const listaRef = useRef(null);

  function removerAcentos(texto) {
    return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  function getCampoCorreto(categoria, filtro) {
    const filtroNormalizado = removerAcentos(filtro.trim().toLowerCase());

    if (filtroNormalizado === "nome") {
      switch (categoria) {
        case "Bacias":
          return "nomeBacia";
        case "Blocos":
          return "nomeBloco";
        case "Campos":
          return "nomeCampo";
        case "Poços":
          return "nomePoco";
        default:
          return "nome";
      }
    }
    if (filtroNormalizado === "tipo de poco") return "tipodePoco";
    if (filtroNormalizado === "poco operador") return "pocoOperador";

    return filtroNormalizado;
  }

  const campoParaListar = getCampoCorreto(categoria, filtro);
  const valoresUnicos = dados || [];

  useEffect(() => {
    setIsVisible(true);
  }, [filtro, dados]);

  const handleSubfiltroClick = (subfiltro) => {
    if (onSubfiltroClick) {
      onSubfiltroClick(subfiltro);
    }
    setIsVisible(false);
    setTimeout(() => {
      if (onClose) onClose();
    }, 300);
  };

  return (
    <div
      className={`subFilters ${isVisible ? "show" : ""}`}
      ref={listaRef}
      style={{ maxHeight: "300px", overflowY: "auto" }}
    >
      {isLoading ? (
        <div className="loading-container">
          <p>Carregando...</p>
        </div>
      ) : valoresUnicos.length === 0 ? (
        <div className="loading-container">
          <p>Nenhum valor encontrado</p>
        </div>
      ) : (
        <>
          {valoresUnicos.slice(0, itensVisiveis).map((valor, index) => (
            <p key={index} onClick={() => handleSubfiltroClick(valor)}>
              {valor}
            </p>
          ))}
          {valoresUnicos.map((valor, index) => (
            <p key={index} onClick={() => handleSubfiltroClick(valor)}>
              {valor}
            </p>
          ))}
          {!isLoading && valoresUnicos.length > 0 && (
            <div className="btns-container">
              <button
                onClick={() => {
                  setPagina((prev) => {
                    const paginaAnterior = prev - 1;
                    buscarMaisDados(filtro, categoria, paginaAnterior);
                    return paginaAnterior;
                  });
                }}
                disabled={isLoading}
                className="next-button"
              >
                <span className="material-symbols-outlined next-icon">
                  arrow_back_ios
                </span>
              </button>
              <button
                onClick={() => setPagina((prev) => prev + 1)} 
                disabled={isLoading}
                className="next-button"
              >
                <span className="material-symbols-outlined next-icon">
                  arrow_forward_ios
                </span>
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

Subfilters.propTypes = {
  categoria: PropTypes.string.isRequired,
  filtro: PropTypes.string.isRequired,
  onSubfiltroClick: PropTypes.func.isRequired,
  onClose: PropTypes.func,
  darkMode: PropTypes.bool,
  isLoading: PropTypes.bool,
  buscarMaisDados: PropTypes.func,
  dados: PropTypes.array,
  pagina: PropTypes.number,
  setPagina: PropTypes.func,
};
export default Subfilters;
