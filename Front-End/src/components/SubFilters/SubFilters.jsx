import { useEffect, useState } from "react";
import "./SubFilters.css";
import PropTypes from "prop-types";

function Subfilters({ categoria, filtro, onSubfiltroClick, onClose, darkMode, dadosBrutos, isLoading = false }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, [filtro, dadosBrutos]);

  function getCampoCorreto(categoria, filtro) {
    const filtroNormalizado = filtro.trim().toLowerCase();
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
    // Adapte para outros filtros especiais se necessário
    // Exemplo: if (filtroNormalizado === "estado") return "estado";
    return filtroNormalizado;
  }

  const campoParaListar = getCampoCorreto(categoria, filtro);

  // Extrai valores únicos do campo selecionado
  const valoresUnicos = [
    ...new Set(
      (dadosBrutos || [])
        .map((item) => item[campoParaListar])
        .filter((v) => v !== undefined && v !== null && v !== "")
    ),
  ];

  // Função para lidar com o clique no subfiltro
  const handleSubfiltroClick = (subfiltro) => {
    if (onSubfiltroClick) {
      onSubfiltroClick(subfiltro);
    }
    setIsVisible(false);
    setTimeout(() => {
      if (onClose) onClose();
    }, 300);
  };

  console.log("dadosBrutos:", dadosBrutos);
console.log("valoresUnicos:", valoresUnicos);

  return (
    <div className={`subFilters ${isVisible ? "show" : ""}`}>
      {isLoading ? (
        <div className="loading-container">
          <p>Carregando...</p>
        </div>
      ) : valoresUnicos.length === 0 ? (
        <div className="loading-container">
          <p>Nenhum valor encontrado</p>
        </div>
      ) : (
        valoresUnicos.map((valor, index) => (
          <p key={index} onClick={() => handleSubfiltroClick(valor)}>
            {valor}
          </p>
        ))
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
  dadosBrutos: PropTypes.array.isRequired,
};
export default Subfilters;
