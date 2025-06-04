import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./Map.css";
import PropTypes from "prop-types";

export const mapRef = { current: null };

function Map({ darkMode }) {
  const mapContainer = useRef(null);

  useEffect(() => {
    if (!mapRef.current && mapContainer.current) {
      const map = L.map(mapContainer.current, {
        zoomControl: false,
      }).setView([-13.812975, -53.101993], 5);

      const lightTileLayer = L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
          maxZoom: 19,
        }
      );

      const darkTileLayer = L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
        {
          subdomains: "abcd",
          maxZoom: 19,
        }
      );

      const currentLayer = darkMode ? darkTileLayer : lightTileLayer;
      currentLayer.addTo(map);

      mapRef.current = map;

      // GeoJSON
      fetch("/limite_brasil_json.geojson")
        .then((res) => res.json())
        .then((data) => {
          L.geoJSON(data, {
            style: {
              color: "#2e933d",
              weight: 3,
              fillOpacity: 0,
            },
          }).addTo(map);
        });
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Altera o tile layer dinamicamente quando muda o darkMode
  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.eachLayer((layer) => {
        if (layer instanceof L.TileLayer) {
          mapRef.current.removeLayer(layer);
        }
      });

      const newLayer = darkMode
        ? L.tileLayer(
            "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
            {
              subdomains: "abcd",
              maxZoom: 19,
            }
          )
        : L.tileLayer(
            "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
            {
              maxZoom: 19,
            }
          );

      newLayer.addTo(mapRef.current);
    }
  }, [darkMode]);

  return <div id="map" ref={mapContainer}></div>;
}

Map.propTypes = {
  darkMode: PropTypes.bool,
};
export default Map;
