import { useCallback, useEffect, useState, useMemo } from "react";
// importação do css do SearchBar
import "./Searchbar.css";
import {
  marcarEstadosnoMapa,
  desmarcarEstadosnoMapa,
} from "../../utils/mapUtils.js";
import Filters from "../Filters/Filters";
import L from "leaflet";
import FailedSearch from "../FailedSearch/FailedSearch";
import SelectedFilters from "../SelectedFilters/SelectedFilters";
import { mapRef } from "../Map/Map.jsx";

function Searchbar() {
  const [categoriaSelecionada, setCategoriaSelecionada] = useState("Bacias");
  const [dropdownAberto, setDropdownAberto] = useState(false);
  const [showError, setShowError] = useState(false);
  const [filtrosSelecionados, setFiltroSelecionadoInterno] = useState([]);
  const [categoriasBloqueadas, setCategoriasBloqueadas] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [filtros, setFiltros] = useState({});

  const [filtroSelecionado, setFiltroSelecionado] = useState([]);
  const [subFiltroSelecionado, setSubFiltroSelecionado] = useState([]);

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

  const acumularFiltrosERealizarBusca = async (filtro, subfiltro) => {
    // Cria um novo filtro baseado no que foi passado
    const novosFiltros = {
      ...filtros,
      [categoriaSelecionada]: {
        ...(filtros[categoriaSelecionada] || {}),
        [filtro]: subfiltro,
      },
    };

    setFiltros(novosFiltros); // Atualiza o estado com os filtros acumulados

    // Faz a requisição
    const url = `http://localhost:8080/api/search`;

    console.log("Filtros que vão pro backend:", novosFiltros);

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(novosFiltros),
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
      setFiltroSelecionadoInterno((prev) => [...prev, subfiltro]);
      setCategoriasBloqueadas((prev) => [...prev, categoriaSelecionada]);

      // Se a categoria for Poços, marca no mapa
      if (categoriaSelecionada === "Poços") {
        let markerLayer = L.layerGroup().addTo(mapRef.current);

        data.forEach((poco) => {
          let { latitude, longitude, nome } = poco;
          latitude = parseFloat(latitude.toString().replace(",", "."));
          longitude = parseFloat(longitude.toString().replace(",", "."));

          if (isNaN(latitude) || isNaN(longitude)) {
            console.error(
              `Coordenadas inválidas para o poço ${nome}: lat=${latitude}, lon=${longitude}`
            );
            return;
          }

          const marker = L.marker([latitude, longitude]).addTo(markerLayer);
          marker.bindPopup(`<b>Poço:</b> ${nome || "Sem nome"}`);
        });
      }

      // Marca os estados no mapa
      const estadosUnicos = [...new Set(data.map((item) => item.estado))];
      marcarEstadosnoMapa(estadosUnicos);
    } catch (error) {
      console.error("Error: ", error);
    }
  };

  const pesquisar = async () => {
    const input = document.getElementById("search-input");
    const filtro = input.value;

    if (!filtro) return;

    await acumularFiltrosERealizarBusca("nome", filtro);
    input.value = "";
  };

  const removerFiltro = (filtro) => {
    // Remove o filtro da lista de selecionados
    const novosFiltrosSelecionados = filtrosSelecionados.filter(
      (f) => f !== filtro
    );
    setFiltroSelecionadoInterno(novosFiltrosSelecionados);

    // Se não houver mais filtros ativos, limpa completamente categoriasBloqueadas
    if (novosFiltrosSelecionados.length === 0) {
      setCategoriasBloqueadas([]); // Limpa todas as categorias bloqueadas
    }

    desmarcarEstadosnoMapa();
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const selecionarSubFiltro = async (
    filtroSelecionado,
    subfiltroSelecionado
  ) => {
    const filtroNormalizado = filtroSelecionado.toLowerCase();
    const subfiltroNormalizado = subfiltroSelecionado.toLowerCase();

    console.log("Filtro normalizado no Searchbar:", filtroNormalizado);
    console.log("Subfiltro normalizado no Searchbar:", subfiltroNormalizado);

    setFiltroSelecionado(filtroNormalizado);
    setSubFiltroSelecionado(subfiltroNormalizado);

    await acumularFiltrosERealizarBusca(
      filtroNormalizado,
      subfiltroNormalizado
    );
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
export default Searchbar;
