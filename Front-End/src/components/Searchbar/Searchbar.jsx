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
import { auth } from "../../utils/firebaseConfig.js";

const customIcon = new L.Icon({
  iconUrl: "/assets/images/pin-amarelo.png", // Caminho relativo à public/
  iconSize: [20, 29], // Tamanho do ícone
  iconAnchor: [16, 32], // Centro da base do ícone
  popupAnchor: [0, -32], // Onde a popup aparece
});

const iconFavorito = L.icon({
  iconUrl: "/assets/images/pin-verde.png",
  iconSize: [20, 29],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

function Searchbar({
  mudarPagina,
  setShowPagControl,
  paginaAtual,
  setPocoSelecionado,
  setDadosPaginados,
}) {
  const [categoriaSelecionada, setCategoriaSelecionada] = useState("Bacias");
  const [dropdownAberto, setDropdownAberto] = useState(false);
  const [showError, setShowError] = useState(false);
  const [filtrosSelecionados, setFiltroSelecionadoInterno] = useState([]);
  const [categoriasBloqueadas, setCategoriasBloqueadas] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [filtros, setFiltros] = useState({});
  const markerLayerRef = useRef(null); // <--  ref para guardar o layer de markers.
  const [podeRemoverFiltro, setPodeRemoverFiltro] = useState(true);

  const categorias = useMemo(() => ["Bacias", "Blocos", "Campos", "Poços"], []);

  useEffect(() => {
    console.log("teste:", Object.keys(filtros));
    if (Object.keys(filtros).length > 0) {
      acumularFiltrosERealizarBusca(null, null, paginaAtual);
    }
  }, [paginaAtual]);

  useEffect(() => {
    mudarCategoria();
  }, [categoriasBloqueadas]);

  const mudarCategoria = useCallback(() => {
    console.log("categorias para serem marcadas: ", categorias);
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

  // função para buscra os poços que já foram favoritados pelo usuario
  const buscarPocosFavoritados = async (idUsuario) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/favoritos/listar/${idUsuario}`
      );
      if (!res.ok) throw new Error("Erro ao buscar favoritos");
      const data = await res.json();
      return data.map((p) => p.poco.id.toString());
    } catch (err) {
      console.error("Erro ao buscar favoritos:", err);
      return [];
    }
  };

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
    const url = `${
      import.meta.env.VITE_API_URL
    }/api/search?page=${novaPagina}&size=100`;

    console.log("Filtros que vão pro backend:", filtrosAtuais);

    const filtrosLimpos = Object.fromEntries(
      Object.entries(filtrosAtuais).filter(
        ([, valor]) => valor && Object.keys(valor).length > 0
      )
    );
    console.log("Filtros limpos que vão pro backend:", filtrosLimpos);
    console.log("Chaves de filtros limpos:", Object.keys(filtrosLimpos));

    if (Object.keys(filtrosLimpos).length === 0) {
      console.log("Nenhum filtro aplicado. Requisição cancelada.");
      return;
    }

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

        // Só mostra erro se for a primeira página
        if (novaPagina === 0) {
          setShowError(true);
        }

        return;
      }

      setShowError(false);
      setDadosPaginados(data);

      if (filtro !== null) {
        setFiltroSelecionadoInterno((prev) => [...prev, subfiltro]);
        if (categoriaSelecionada !== "Poços") {
          setCategoriasBloqueadas((prev) => [...prev, categoriaSelecionada]);
        }
      }
      if (markerLayerRef.current) {
        markerLayerRef.current.clearLayers();
        mapRef.current.removeLayer(markerLayerRef.current);
      }

      // Cria novo layer
      let markerLayer = L.layerGroup().addTo(mapRef.current);
      markerLayerRef.current = markerLayer;

      let favoritosIds = [];
      const user = auth.currentUser;
      if (user) {
        favoritosIds = await buscarPocosFavoritados(user.uid);
      }

      content.forEach((poco) => {
        let { latitude, longitude, nome, id } = poco;
        latitude = parseFloat(latitude.toString().replace(",", "."));
        longitude = parseFloat(longitude.toString().replace(",", "."));

        if (isNaN(latitude) || isNaN(longitude)) {
          console.error(
            `Coordenadas inválidas para o poço ${nome}: lat=${latitude}, lon=${longitude}`
          );
          return;
        }

        const icon = favoritosIds.includes(id.toString())
          ? iconFavorito
          : customIcon;

        const marker = L.marker([latitude, longitude], {
          icon: icon,
        }).addTo(markerLayer);

        marker.bindPopup(`
          <b>Poço:</b> ${poco.nomePoco || "Sem nome"}<br>
        `);
        marker.on("click", () => {
          setPocoSelecionado(poco);
        });
      });

      // Marca os estados no mapa
      const estadosUnicos = [...new Set(content.map((item) => item.estado))];
      console.log("estado para ser maarcado: ", estadosUnicos);
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
    if (!podeRemoverFiltro) return; // se não pode remover ainda, ignora

    setPodeRemoverFiltro(false); // trava a remoção

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

    const novasCategoriasBloqueadas = categorias.filter((categoria) => {
      if (categoria === "Poços") return false;
      return (
        novosFiltros[categoria] &&
        Object.keys(novosFiltros[categoria]).length > 0
      );
    });
    setCategoriasBloqueadas(novasCategoriasBloqueadas);

    // Atualiza visualmente
    if (novosFiltrosSelecionados.length > 0) {
      acumularFiltrosERealizarBusca(null, null);
    } else {
      desmarcarEstadosnoMapa();
      setShowPagControl(false);
      if (markerLayerRef.current) {
        markerLayerRef.current.clearLayers();
        mapRef.current.removeLayer(markerLayerRef.current);
      }
    }

    // Espera 2 segundos antes de liberar nova remoção
    setTimeout(() => {
      setPodeRemoverFiltro(true);
    }, 1000); // 2000ms = 2 segundos
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

    if (filtrosSelecionados.includes(subfiltroNormalizado)) {
      console.warn("Subfiltro já selecionado:", subfiltroNormalizado);
      return; // Não faz nada se for repetido
    }

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
  setDadosPaginados: PropTypes.func.isRequired,
};

export default Searchbar;
