import { useCallback, useEffect, useState, useMemo } from "react";
// importação do css do SearchBar
import "./Searchbar.css";
import {
  marcarEstadosnoMapa,
  desmarcarEstadosnoMapa,
} from "../../utils/mapUtils.js";
import Filters from "../Filters/Filters";
import { map } from "leaflet";
import FailedSearch from "../FailedSearch/FailedSearch";
import SelectedFilters from "../SelectedFilters/SelectedFilters";

function Searchbar() {
  const [categoriaSelecionada, setCategoriaSelecionada] = useState("Bacias");
  const [dropdownAberto, setDropdownAberto] = useState(false);
  const [showError, setShowError] = useState(false);
  const [filtrosSelecionados, setFiltroSelecionado] = useState([]);
  const [categoriasBloqueadas, setCategoriasBloqueadas] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  const categorias = useMemo(() => ["Bacias", "Blocos", "Campos", "Poços"], []);

  useEffect(() => {
    mudarCategoria();
    console.log(categorias);
  }, [categoriasBloqueadas]);

  const mudarCategoria = useCallback(() => {
    const categoriasDisponiveis = categorias.filter(
      (categoria) => !categoriasBloqueadas.includes(categoria)
    );

    if (categoriasDisponiveis.length > 0) {
      setCategoriaSelecionada(categoriasDisponiveis[0]);
    } else {
      setCategoriaSelecionada(categorias[0]);
    }
  }, [categoriasBloqueadas, categorias]);

  const pesquisar = async () => {
    const input = document.getElementById("search-input");
    const nome = input.value;
    const url = `http://localhost:8080/api/search?nome=${encodeURIComponent(
      nome
    )}&categoria=${encodeURIComponent(categoriaSelecionada)}`;

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Erro ao buscar dados");
      const data = await response.json();
      if (!data || data.length === 0) {
        console.warn("Nenhum dado retornado da API");
        setShowError(true);
        return;
      }
      setShowError(false);
      setFiltroSelecionado((prev) => [...prev, nome]);
      setCategoriasBloqueadas((prev) => [...prev, categoriaSelecionada]);
      marcarEstadosnoMapa(data, map);
    } catch (error) {
      console.error("Error: ", error);
    }
    input.value = "";
  };

  const removerFiltro = (filtro) => {
    // Remove o filtro da lista de selecionados
    const novosFiltrosSelecionados = filtrosSelecionados.filter(
      (f) => f !== filtro
    );
    setFiltroSelecionado(novosFiltrosSelecionados);

    // Se não houver mais filtros ativos, limpa completamente categoriasBloqueadas
    if (novosFiltrosSelecionados.length === 0) {
      setCategoriasBloqueadas([]); // Limpa todas as categorias bloqueadas
    }

    desmarcarEstadosnoMapa();
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  return (
    <div className="search-bar">
      {showError && (
        <FailedSearch
          categoria={categoriaSelecionada}
          showError={showError}
          onClose={() => setShowError(false)}
        />
      )}

      <SelectedFilters
        filtrosSelecionados={filtrosSelecionados}
        removerFiltro={removerFiltro}
      />
      <div className="dropdown">
        <div
          id="drop-text"
          className="dropdown-text"
          onClick={() => setDropdownAberto(!dropdownAberto)}
        >
          <span id="span">{categoriaSelecionada}</span>
          <span
            id="iconOptions"
            className="material-symbols-outlined"
            style={{
              transform: dropdownAberto ? "rotate(-180deg)" : "rotate(0deg)",
            }}
          >
            keyboard_arrow_down
          </span>
        </div>
        {dropdownAberto && (
          <ul id="list" className="dropdown-list show">
            {categorias.map(
              (categoria) =>
                !categoriasBloqueadas.includes(categoria) && (
                  <li
                    key={categoria}
                    className="dropdown-list-item"
                    onClick={() => {
                      setCategoriaSelecionada(categoria);
                      setDropdownAberto(false);
                    }}
                  >
                    {categoria}
                  </li>
                )
            )}
          </ul>
        )}
      </div>

      <div className="search-box">
        <input
          type="text"
          className="search-input"
          id="search-input"
          placeholder={`Procure ${categoriaSelecionada}..`}
          autoComplete="off"
          onKeyDown={(event) => {
            if (event.key === "Enter") pesquisar();
          }}
        />
        <span
          id="filter-icon"
          className="material-symbols-outlined"
          onClick={toggleFilters}
        >
          tune
        </span>
        <span className="material-symbols-outlined" onClick={pesquisar}>
          search
        </span>
      </div>
      {showFilters && (
        <Filters categoria={categoriaSelecionada} showFilters={showFilters} />
      )}
    </div>
  );
}
export default Searchbar;
