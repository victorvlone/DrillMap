import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./Map.css";

export const mapRef = { current: null };

function Map() {
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

  return <div id="map" ref={mapContainer}></div>;
}

export default Map;
