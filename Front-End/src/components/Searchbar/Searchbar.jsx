import { useCallback, useEffect, useState, useMemo } from "react";
// importação do css do SearchBar
import "./Searchbar.css";
import {
  marcarEstadosnoMapa,
  desmarcarEstadosnoMapa,
} from "../../utils/mapUtils.js";
import Filters from "../Filters/Filters";
import { map } from "leaflet";
import L from "leaflet";
import FailedSearch from "../FailedSearch/FailedSearch";
import SelectedFilters from "../SelectedFilters/SelectedFilters";
import PropTypes from "prop-types";
import { mapRef } from "../Map/Map.jsx";

function Searchbar({ setFiltroSelecionado, setSubFiltroSelecionado }) {
  const [categoriaSelecionada, setCategoriaSelecionada] = useState("Bacias");
  const [dropdownAberto, setDropdownAberto] = useState(false);
  const [showError, setShowError] = useState(false);
  const [filtrosSelecionados, setFiltroSelecionadoInterno] = useState([]);
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
    const filtro = input.value;

    const filtros = {
      nome: filtro,
    };
    const url = `http://localhost:8080/api/search?categoria=${encodeURIComponent(
      categoriaSelecionada
    )}`;

    console.log("Filtros que vão pro backend:", filtros);
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(filtros),
      });
      console.log("Response status:", response.status);
      if (!response.ok) throw new Error("Erro ao buscar dados");

      const data = await response.json();

      if (!data || data.length === 0) {
        console.warn("Nenhum dado retornado da API");
        setShowError(true);
        return;
      }

      setShowError(false);
      setFiltroSelecionadoInterno((prev) => [...prev, filtro]);
      setCategoriasBloqueadas((prev) => [...prev, categoriaSelecionada]);

      if (categoriaSelecionada === "Poços") {
        let markerLayer = null;
        console.log("Marcando poço no mapa...");

        // Limpa os markers antigos antes de adicionar novos
        if (markerLayer) {
          markerLayer.clearLayers();
        }

        // Cria um novo Layer Group para os markers
        markerLayer = L.layerGroup().addTo(mapRef.current);

        data.forEach((poco) => {
          let { latitude, longitude, nome } = poco;

          // Se as coordenadas já são números, pode tirar isso
          latitude = parseFloat(latitude.toString().replace(",", "."));
          longitude = parseFloat(longitude.toString().replace(",", "."));

          if (isNaN(latitude) || isNaN(longitude)) {
            console.error(
              `Coordenadas inválidas para o poço ${nome}: lat=${latitude}, lon=${longitude}`
            );
            return; // Pula se não for válido
          }

          const marker = L.marker([latitude, longitude]).addTo(markerLayer);
          marker.bindPopup(`<b>Poço:</b> ${nome || "Sem nome"}`);
        });
      }
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

  const selecionarSubFiltro = (filtroSelecionado, subfiltroSelecionado) => {
    // Atualiza os estados no componente pai para passar para o mapa
    setFiltroSelecionado(filtroSelecionado); // Passa o filtro selecionado
    setSubFiltroSelecionado(subfiltroSelecionado); // Passa o subfiltro selecionado
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
        <Filters
          categoria={categoriaSelecionada}
          showFilters={showFilters}
          selecionarSubFiltro={selecionarSubFiltro}
        />
      )}
    </div>
  );
}

Searchbar.propTypes = {
  setFiltroSelecionado: PropTypes.func.isRequired,
  setSubFiltroSelecionado: PropTypes.func.isRequired,
};
export default Searchbar;
