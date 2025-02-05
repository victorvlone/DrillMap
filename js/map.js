var map = L.map("map", {
  zoomControl: false,
}).setView([-13.812975, -53.101993], 5);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
}).addTo(map);

fetch("archives/limite_brasil_json.geojson")
  .then((response) => response.json())
  .then((data) => {
    L.geoJSON(data, {
      style: {
        color: "#03A9F4",
        weight: 3,
        fillOpacity: 0,
      },
    }).addTo(map);
  })
  .catch((error) => {
    console.error("Erro ao carregar o arquivo GeoJSON:", error);
  });

const selectCategory = document.getElementById("span");
const dropdownItems = document.querySelectorAll(".dropdown-list-item");

let categoriaSelecionada = "Bacias";

dropdownItems.forEach((item) => {
  item.addEventListener("click", () => {
    categoriaSelecionada = item.textContent;
    selectCategory.textContent = categoriaSelecionada;
  });
});

const search_input = document.getElementById("search-input");

function pesquisar() {
  const nome = search_input.value;
  const categoria = categoriaSelecionada;
  const url = `http://localhost:8080/api/search?nome=${encodeURIComponent(
    nome
  )}&categoria=${encodeURIComponent(categoria)}`;
  return fetch(url, {
    method: "GET",
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Erro ao buscar dados");
      }
      return response.json();
    })
    .then((data) => {
      const failedSearchdiv = document.getElementById("failed-search");
      if(data.length === 0){
        failedSearchdiv.classList.remove("hide");
        failedSearchdiv.classList.add("show");
      }
      else{
        console.log(data);

        failedSearchdiv.classList.remove("show");
        failedSearchdiv.classList.add("hide");
        
        return data;

      }
    })
    .catch((error) => {
      console.error("Erro: ", error);
    });
}

search_input.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      pesquisar().then((data) => {
        marcarEstadosnoMapa(data);
      });
    }
  });

const estadosGeoJSON = {
    "AC": "archives/br_ac.json",
    "AL": "archives/br_al.json",
    "AM": "archives/br_am.json",
    "AP": "archives/br_ap.json",
    "BA": "archives/br_ba.json",
    "CE": "archives/br_ce.json",
    "DF": "archives/br_df.json",
    "ES": "archives/br_es.json",
    "GO": "archives/br_go.json",
    "MA": "archives/br_ma.json",
    "MG": "archives/br_mg.json",
    "MS": "archives/br_ms.json",
    "MT": "archives/br_mt.json",
    "PA": "archives/br_pa.json",
    "PB": "archives/br_pb.json",
    "PE": "archives/br_pe.json",
    "PI": "archives/br_pi.json",
    "PR": "archives/br_pr.json",
    "RJ": "archives/br_rj.json",
    "RN": "archives/br_rn.json",
    "RO": "archives/br_ro.json",
    "RR": "archives/br_rr.json",
    "RS": "archives/br_rs.json",
    "SC": "archives/br_sc.json",
    "SE": "archives/br_se.json",
    "SP": "archives/br_sp.json",
    "TO": "archives/br_to.json"
}

function marcarEstadosnoMapa(estadosRetornados){
    const estados = estadosRetornados.map((item) => item.estado);

    estados.forEach((estado) =>{

        if(estadosGeoJSON[estado]){
            const geojsonPath = estadosGeoJSON[estado];

            fetch(geojsonPath)
                .then((response) => {
                    if(!response.ok){
                        throw new Error(`Erro ao carregar geoJSON para o estado ${estado}`);
                    }
                    return response.json();
                })
                .then((geojsonData) => {
                    const layer = L.geoJSON(geojsonData, {
                        style: {
                            color: `#03A9F4`,
                            weight: 2,
                            fillOpacity: 0.5,
                        },
                    }).addTo(map);

                    const bounds = layer.getBounds();

                    if (bounds.isValid()) {
                        map.fitBounds(bounds, { padding: [20, 20] });
                    } else {
                        console.warn(`Não foi possível calcular os limites do estado ${estado}`);
                    }
                })
                .catch((error) => {
                    console.error(`Erro ao carregar o GeoJSON do estado ${estado}:`, error);
                });
        } else {
            console.warn(`Estado ${estado} nao encontrado no mapeamento de geoJSON.`);
        }
    });
}

document.addEventListener("DOMContentLoaded", () => {
  const toggleButton = document.querySelector(".toggle-details");
  const itemsContainers = document.querySelectorAll(".items__container");

  toggleButton.addEventListener("click", () => {
    itemsContainers.forEach((container) => {
      container.classList.toggle("show");
    });

    if (itemsContainers[0].classList.contains("show")) {
      toggleButton.textContent = "Ver menos";
    } else {
      toggleButton.textContent = "Ver mais";
    }
  });
});

const filtersDiv = document.querySelector(".filters");
const filterIcon = document.getElementById("filter-icon");

filterIcon.addEventListener("click", () => {
  if (filtersDiv.classList.contains("show")){
    filtersDiv.classList.remove("show");
    setTimeout(() => {
      filtersDiv.style.display = "none";
    }, 300);
  } else {
    filtersDiv.style.display = "flex";
    setTimeout(() => {
      filtersDiv.classList.add("show");
    }, 10);
  }
});

document.addEventListener("click", (event) => {
  const filtersDiv = document.querySelector(".filters");
  const subFiltersDiv = document.querySelector(".subFilters");
  
  const isClickInsideFilters = filtersDiv.contains(event.target);
  const isClickInsideSubFilters = subFiltersDiv.contains(event.target);
  const isClickFilterIcon = filterIcon.contains(event.target);

  if (!isClickInsideFilters && !isClickInsideSubFilters && !isClickFilterIcon) {
    if (filtersDiv.classList.contains("show")) {
      filtersDiv.classList.remove("show");
      setTimeout(() => {
        filtersDiv.style.display = "none";
      }, 300);
    }

    if (subFiltersDiv.classList.contains("show")) {
      subFiltersDiv.classList.remove("show");
      setTimeout(() => {
        subFiltersDiv.style.display = "none";
      }, 300);
    }
  }
});

filterIcon.addEventListener("click", (event) => {
  event.stopPropagation(); 
  if (filtersDiv.classList.contains("show")) {
    filtersDiv.classList.remove("show");
    setTimeout(() => {
      filtersDiv.style.display = "none";
    }, 300);
  } else {
    filtersDiv.style.display = "flex";
    setTimeout(() => {
      filtersDiv.classList.add("show");
    }, 10);
  }
});

const opcoesFiltros = {
  Bacias: ["Nome", "Estado"],
  Blocos: ["Nome", "Estado"],
  Campos: ["Nome", "Estado"],
  Poços: ["Nome", "Estado", "Inicio", "Termino", "Conclusão", "Reclassificação", "Tipo de poço", "Categoria", "Situação", "Poço operador"],
};


function carregarFiltros(categoria) {
  filtersDiv.innerHTML = "";

  if(opcoesFiltros[categoria]){
    opcoesFiltros[categoria].forEach((filtro) => {
      const p = document.createElement("p");
      p.textContent = filtro;
      p.addEventListener("click", () => {
        console.log(`filtro selecionado: ${filtro}`);
        buscarComFiltros(categoria, filtro);

        const subFiltersDiv = document.querySelector(".subFilters");

        subFiltersDiv.classList.toggle("show");
      });
      filtersDiv.appendChild(p);
    });
  } else {
    filtersDiv.innerHTML = "<p>Nenhum filtro disponivel</p>";
  }
}

function buscarComFiltros(categoria, filtroSelecionado){

  if(categoria == "Bacias"){
    categoria = "bacia";
  }
  if(categoria == "Blocos"){
    categoria = "bloco_exploratorio";
  }
  if(categoria == "Campos"){
    categoria = "campo";
  }
  if(categoria == "Poços"){
    categoria = "poco";
  }

  console.log(categoria);
  const url = `http://localhost:8080/api/filtros?tabela=${encodeURIComponent(categoria)}&campo=${encodeURIComponent(filtroSelecionado)}`;
  console.log(url);

  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Erro ao buscar dados");
      }
      return response.json();
    })
    .then((data) => {
      mostrarFiltrosAdicionais(data, filtroSelecionado);
    })
    .catch((error) => {
      console.error("Erro ao buscar filtros:", error);
    });
}

function mostrarFiltrosAdicionais(filtros, filtroSelecionado) {
  const subFiltersDiv = document.querySelector(".subFilters");
  subFiltersDiv.innerHTML = "";

  const filtrosUnicos = Array.from(new Set(filtros.map(filtro => filtro[filtroSelecionado])));
  
  filtrosUnicos.forEach((filtroValor) => {
    const p = document.createElement("p");
    p.textContent = filtroValor;
    subFiltersDiv.appendChild(p);
  });

  subFiltersDiv.style.display = "flex"; // Garante que reapareça
  setTimeout(() => {
    subFiltersDiv.classList.add("show");
  }, 10);
}

window.addEventListener("categoriaSelecionada", (event) => {
  const categoriaSelecionada = event.detail;
  carregarFiltros(categoriaSelecionada);
});

(function inicializarFiltros() {
  const eventoInicial = new CustomEvent("categoriaSelecionada", {
    detail: "Bacias",
  });
  window.dispatchEvent(eventoInicial);
})();

filterIcon.addEventListener("click", () => {
  filtersDiv.classList.toggle("hidden"); 
});