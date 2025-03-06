import L from "leaflet";
import { mapRef } from "../components/Map/Map";

const estadosGeoJSON = {
  AC: "public/br_ac.json",
  AL: "public/br_al.json",
  AM: "public/br_am.json",
  AP: "public/br_ap.json",
  BA: "public/br_ba.json",
  CE: "public/br_ce.json",
  DF: "public/br_df.json",
  ES: "public/br_es.json",
  GO: "public/br_go.json",
  MA: "public/br_ma.json",
  MG: "public/br_mg.json",
  MS: "public/br_ms.json",
  MT: "public/br_mt.json",
  PA: "public/br_pa.json",
  PB: "public/br_pb.json",
  PE: "public/br_pe.json",
  PI: "public/br_pi.json",
  PR: "public/br_pr.json",
  RJ: "public/br_rj.json",
  RN: "public/br_rn.json",
  RO: "public/br_ro.json",
  RR: "public/br_rr.json",
  RS: "public/br_rs.json",
  SC: "public/br_sc.json",
  SE: "public/br_se.json",
  SP: "public/br_sp.json",
  TO: "public/br_to.json",
};

export function marcarEstadosnoMapa(estadosRetornados) {
  const map = mapRef.current; // 🔹 Pegando o mapa

  if (!map) {
    console.error("O mapa ainda não foi inicializado.");
    return;
  }

  const estados = estadosRetornados.map((item) => item.estado);

  estados.forEach((estado) => {
    if (estadosGeoJSON[estado]) {
      const geojsonPath = estadosGeoJSON[estado];

      fetch(geojsonPath)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Erro ao carregar geoJSON para o estado ${estado}`);
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
        })
        .catch((error) => {
          console.error(
            `Erro ao carregar o GeoJSON do estado ${estado}:`,
            error
          );
        });
    } else {
      console.warn(`Estado ${estado} não encontrado no mapeamento de geoJSON.`);
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

  console.log(`Estado ${estado} removido do mapa.`);
}
