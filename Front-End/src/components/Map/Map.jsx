import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./Map.css";
import PropTypes from "prop-types";

export const mapRef = { current: null };
let markerLayer = null;

function Map({ filtro, subFiltroSelecionado }) {
  const mapContainer = useRef(null);
  useEffect(() => {
    if (!mapRef.current && mapContainer.current) {
      const map = L.map(mapContainer.current, {
        zoomControl: false,
      }).setView([-13.812975, -53.101993], 5);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
      }).addTo(map);

      fetch("/limite_brasil_json.geojson")
        .then((response) => response.json())
        .then((data) => {
          if (mapRef.current) {
            L.geoJSON(data, {
              style: {
                color: "#2e933d",
                weight: 3,
                fillOpacity: 0,
              },
            }).addTo(mapRef.current);
          } else {
            console.warn("mapRef ainda não está inicializado.");
          }
        })
        .catch((error) => {
          console.error("Erro ao carregar o arquivo GeoJSON:", error);
        });

      mapRef.current = map;
    }

    // Limpeza do mapa
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (filtro && subFiltroSelecionado) {
      console.log("Filtro selecionado:", filtro);
      console.log("Subfiltro selecionado:", subFiltroSelecionado);

      // Faz a chamada para o backend
      fetch(
        `http://localhost:8080/api/pocos?filtro=${filtro.toLowerCase()}&valor=${subFiltroSelecionado}`
      )
        .then((response) => response.json())
        .then((data) => {
          console.log("Poços retornados:", data);

          // Limpa os markers antigos antes de adicionar novos
          if (markerLayer) {
            markerLayer.clearLayers();
          }

          // Cria um novo Layer Group para os markers
          markerLayer = L.layerGroup().addTo(mapRef.current);

          data.forEach((poco) => {
            let { latitude, longitude, nome } = poco;

            // Conversão de string com vírgula para número com ponto
            latitude = parseFloat(latitude.replace(",", "."));
            longitude = parseFloat(longitude.replace(",", "."));

            if (isNaN(latitude) || isNaN(longitude)) {
              console.error(
                `Coordenadas inválidas para o poço ${nome}: lat=${latitude}, lon=${longitude}`
              );
              return; // Pula se não for válido
            }

            const marker = L.marker([latitude, longitude]).addTo(markerLayer);
            marker.bindPopup(`<b>Poço:</b> ${nome || "Sem nome"}`);
          });

          // Dá um zoom no primeiro poço válido
          const primeiroPoco = data.find((p) => {
            const lat = parseFloat(p.latitude.replace(",", "."));
            const lon = parseFloat(p.longitude.replace(",", "."));
            return !isNaN(lat) && !isNaN(lon);
          });

          if (primeiroPoco) {
            const lat = parseFloat(primeiroPoco.latitude.replace(",", "."));
            const lon = parseFloat(primeiroPoco.longitude.replace(",", "."));
            mapRef.current.setView([lat, lon], 8);
          }
        })
        .catch((error) => {
          console.error("Erro ao buscar poços:", error);
        });
    }
  }, [filtro, subFiltroSelecionado]);

  return <div id="map" ref={mapContainer}></div>;
}

Map.propTypes = {
  filtro: PropTypes.string, // Ou o tipo adequado para 'filtro', se for algo diferente de string
  subFiltroSelecionado: PropTypes.string, // Ou o tipo adequado para 'subFiltroSelecionado'
};

export default Map;
