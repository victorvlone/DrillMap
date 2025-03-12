import { useEffect, useState } from "react";
import "./SubFilters.css";
import PropTypes from "prop-types";

function Subfilters({ categoria, filtro, onSubfiltroClick }) {
  const [subfiltros, setSubfiltros] = useState([]);
  const [showSubfilters, setShowSubfilters] = useState(false);

  useEffect(() => {
    const tabelaMap = {
      Bacias: "bacia",
      Blocos: "bloco_exploratorio",
      Campos: "campo",
      Poços: "poco",
    };
    const tabela = tabelaMap[categoria];

    const subFiltros = async () => {
      const url = `http://localhost:8080/api/filtros?tabela=${encodeURIComponent(
        tabela
      )}&campo=${encodeURIComponent(filtro)}`;

      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Erro ao carregar subfiltros");
        const data = await response.json();
        console.log("Dados recebidos:", data);
        setSubfiltros(data);
        setShowSubfilters(true);
      } catch (error) {
        console.error("Erro ao carregar subFiltros:", error);
      }
    };

    if (categoria && filtro) {
      subFiltros();
    }
  }, [categoria, filtro]);

  // Função para lidar com o clique no subfiltro
  const handleSubfiltroClick = (subfiltro) => {
    // Chama a função do componente pai e passa o filtro e o subfiltro
    if (onSubfiltroClick) {
      onSubfiltroClick(subfiltro); // Passa o subfiltro selecionado
    }
  };

  return (
    <div className={`subFilters ${showSubfilters ? "show" : ""}`}>
      {[...new Set(subfiltros.flatMap(Object.values))].map((valor, index) => (
        <p key={index} onClick={() => handleSubfiltroClick(valor)}>
          {valor}
        </p>
      ))}
    </div>
  );
}

Subfilters.propTypes = {
  categoria: PropTypes.string.isRequired,
  filtro: PropTypes.string.isRequired,
  onSubfiltroClick: PropTypes.func.isRequired,
};
export default Subfilters;
