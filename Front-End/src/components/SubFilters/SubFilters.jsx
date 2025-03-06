import { useEffect, useState } from "react";
import "./SubFilters.css";
import PropTypes from "prop-types";

function Subfilters({ categoria, filtro }) {
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

  return (
    <div className={`subFilters ${showSubfilters ? "show" : ""}`}>
      {[...new Set(subfiltros.flatMap(Object.values))].map((valor, index) => (
        <p key={index}>{valor}</p>
      ))}
    </div>
  );
}

Subfilters.propTypes = {
  categoria: PropTypes.string.isRequired,
  filtro: PropTypes.string.isRequired,
};
export default Subfilters;
