import { useCallback, useEffect, useState, useMemo, useRef } from "react";
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
import PropTypes from "prop-types";

function Searchbar({
  mudarPagina,
  setShowPagControl,
  paginaAtual,
  setPocoSelecionado,
}) {
  const [categoriaSelecionada, setCategoriaSelecionada] = useState("Bacias");
  const [dropdownAberto, setDropdownAberto] = useState(false);
  const [showError, setShowError] = useState(false);
  const [filtrosSelecionados, setFiltroSelecionadoInterno] = useState([]);
  const [categoriasBloqueadas, setCategoriasBloqueadas] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [filtros, setFiltros] = useState({});
  const markerLayerRef = useRef(null); // <--  ref para guardar o layer de markers.

  const categorias = useMemo(() => ["Bacias", "Blocos", "Campos", "Poços"], []);

  useEffect(() => {
    // Só chama se já tiver filtros aplicados
    if (Object.keys(filtros).length > 0) {
      acumularFiltrosERealizarBusca(null, null, paginaAtual);
    }
  }, [paginaAtual]);

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

  const camposEspeciais = {
    "Tipo de poço": "tipo_de_poco",
    "Poço operador": "poco_operador",
  };

  function removerAcentos(texto) {
    return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  const acumularFiltrosERealizarBusca = async (
    filtro,
    subfiltro,
    novaPagina = 0
  ) => {
    let filtrosAtuais = filtros;

    if (filtro !== null) {
      const filtroNormalizado =
        camposEspeciais[filtro] ||
        removerAcentos(filtro).replace(/\s+/g, "").toLowerCase();

      filtrosAtuais = {
        ...filtros,
        [categoriaSelecionada]: {
          ...(filtros[categoriaSelecionada] || {}),
          [filtroNormalizado]: subfiltro,
        },
      };
      mudarPagina(0);
    } else {
      mudarPagina(novaPagina);
    }
    // Cria um novo filtro baseado no que foi passado
    setFiltros(filtrosAtuais); // Atualiza o estado com os filtros acumulados
    console.log("Página enviada para o backend:", novaPagina);

    // Faz a requisição
    const url = `http://localhost:8080/api/search?page=${novaPagina}&size=500`;

    console.log("Filtros que vão pro backend:", filtrosAtuais);

    const filtrosLimpos = Object.fromEntries(
      Object.entries(filtrosAtuais).filter(
        ([, valor]) => valor && Object.keys(valor).length > 0
      )
    );
    console.log("Filtros limpos que vão pro backend:", filtrosLimpos);

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(filtrosLimpos),
      });
      console.log("Response status:", response.status);
      if (!response.ok) throw new Error("Erro ao buscar dados");

      const data = await response.json();
      console.log("Dados retornados da API:", data);

      if (!data || !Array.isArray(data.content)) {
        console.error("Erro: 'data.content' não é um array!", data);
        setShowError(true);
        return;
      }

      const content = data.content; // Acessando os dados dentro de "content"

      if (content.length === 0) {
        console.warn("Nenhum dado retornado da API");
        setShowError(true);
        return;
      }

      setShowError(false);
      if (filtro !== null) {
        setFiltroSelecionadoInterno((prev) => [...prev, subfiltro]);
        setCategoriasBloqueadas((prev) => [...prev, categoriaSelecionada]);
      }
      if (markerLayerRef.current) {
        markerLayerRef.current.clearLayers();
        mapRef.current.removeLayer(markerLayerRef.current);
      }

      // Cria novo layer
      let markerLayer = L.layerGroup().addTo(mapRef.current);
      markerLayerRef.current = markerLayer;

      content.forEach((poco) => {
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
        marker.bindPopup(`
          <b>Poço:</b> ${poco.nomePoco || "Sem nome"}<br>
        `);
        marker.on("click", () => {
          setPocoSelecionado(poco);
        });
      });

      // Marca os estados no mapa
      const estadosUnicos = [...new Set(content.map((item) => item.estado))];
      marcarEstadosnoMapa(estadosUnicos);

      setShowPagControl(true);
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

  const removerFiltro = (subfiltroParaRemover) => {
    // Remove o filtro da lista de selecionados
    const novosFiltrosSelecionados = filtrosSelecionados.filter(
      (f) => f !== subfiltroParaRemover
    );
    setFiltroSelecionadoInterno(novosFiltrosSelecionados);

    // Cria uma cópia do objeto filtros
    const novosFiltros = { ...filtros };

    // Percorre as categorias e remove o subfiltro
    for (const categoria in novosFiltros) {
      for (const filtro in novosFiltros[categoria]) {
        if (novosFiltros[categoria][filtro] === subfiltroParaRemover) {
          delete novosFiltros[categoria][filtro];

          // Se a categoria ficar vazia, remove também
          if (Object.keys(novosFiltros[categoria]).length === 0) {
            delete novosFiltros[categoria];
          }
          break;
        }
      }
    }

    // Atualiza os filtros e categorias bloqueadas
    setFiltros(novosFiltros);

    const novasCategoriasBloqueadas = categorias.filter(
      (categoria) => novosFiltros[categoria]
    );
    setCategoriasBloqueadas(novasCategoriasBloqueadas);

    // Atualiza visualmente
    if (novosFiltrosSelecionados.length > 0) {
      acumularFiltrosERealizarBusca(null, null); // Recarrega com os filtros atualizados
    } else {
      desmarcarEstadosnoMapa();
      if (markerLayerRef.current) {
        markerLayerRef.current.clearLayers();
        mapRef.current.removeLayer(markerLayerRef.current);
      }
    }
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

    await acumularFiltrosERealizarBusca(
      filtroNormalizado,
      subfiltroNormalizado
    );

    setShowFilters(false);
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
          onClose={() => setShowFilters(false)}
        />
      )}
    </div>
  );
}

Searchbar.propTypes = {
  mudarPagina: PropTypes.func.isRequired,
  setShowPagControl: PropTypes.func.isRequired,
  paginaAtual: PropTypes.number.isRequired,
  setPocoSelecionado: PropTypes.func.isRequired,
};

export default Searchbar;
