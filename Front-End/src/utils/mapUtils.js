import L from "leaflet";
import { mapRef } from "../components/Map/Map";

const estadosGeoJSON = {
  AC: "/br_ac.json",
  AL: "/br_al.json",
  AM: "/br_am.json",
  AP: "/br_ap.json",
  BA: "/br_ba.json",
  CE: "/br_ce.json",
  DF: "/br_df.json",
  ES: "/br_es.json",
  GO: "/br_go.json",
  MA: "/br_ma.json",
  MG: "/br_mg.json",
  MS: "/br_ms.json",
  MT: "/br_mt.json",
  PA: "/br_pa.json",
  PB: "/br_pb.json",
  PE: "/br_pe.json",
  PI: "/br_pi.json",
  PR: "/br_pr.json",
  RJ: "/br_rj.json",
  RN: "/br_rn.json",
  RO: "/br_ro.json",
  RR: "/br_rr.json",
  RS: "/br_rs.json",
  SC: "/br_sc.json",
  SE: "/br_se.json",
  SP: "/br_sp.json",
  TO: "/br_to.json",
};

let estadosMarcados = [];

export function marcarEstadosnoMapa(estadosRetornados) {
  const map = mapRef.current;

  if (!map) {
    console.error("O mapa ainda não foi inicializado.");
    return;
  }

  estadosRetornados.forEach((estado) => {
    if (!estadosMarcados.includes(estado)) {
      if (estadosGeoJSON[estado]) {
        const geojsonPath = estadosGeoJSON[estado];

        fetch(geojsonPath)
          .then((response) => {
            if (!response.ok) {
              throw new Error(
                `Erro ao carregar geoJSON para o estado ${estado}`
              );
            }
            return response.json();
          })
          .then((geojsonData) => {
            const layer = L.geoJSON(geojsonData, {
              style: {
                color: "#2e933d",
                weight: 2,
                fillOpacity: 0.5,
              },
            });

            layer.customType = "estado";
            layer.addTo(map);

            estadosMarcados.push(estado);

            map.fitBounds(layer.getBounds());
          })
          .catch((error) => {
            console.error(
              `Erro ao carregar o GeoJSON do estado ${estado}:`,
              error
            );
          });
      } else {
        console.warn(
          `Estado ${estado} não encontrado no mapeamento de geoJSON.`
        );
      }
    } else {
      console.log(`Estado ${estado} já foi marcado.`);
    }
  });
}

export function desmarcarEstadosnoMapa(estado) {
  const map = mapRef.current;

  if (!map) {
    console.error("O mapa ainda não foi inicializado.");
    return;
  }

  map.eachLayer((layer) => {
    if (layer instanceof L.GeoJSON && layer.customType === "estado") {
      map.removeLayer(layer);
    }
  });

  estadosMarcados = [];

  console.log(`Estado ${estado} removido do mapa.`);
}
