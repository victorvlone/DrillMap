import L from "leaflet";

export const customIcon = new L.Icon({
  iconUrl: "/assets/images/pin-amarelo.png",
  iconSize: [20, 29],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

export const iconFavorito = L.icon({
  iconUrl: "/assets/images/pin-verde.png",
  iconSize: [20, 29],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});
