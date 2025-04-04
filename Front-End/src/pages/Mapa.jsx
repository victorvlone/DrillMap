import PropTypes from "prop-types";
import Map from "../components/Map/Map";
import PagControl from "../components/PagControl/PagControl";

function Mapa({ mudarPagina, paginaAtual, showPagControl }) {
  return (
    <div>
      <Map />
      {showPagControl && (
        <PagControl mudarPagina={mudarPagina} paginaAtual={paginaAtual} />
      )}
    </div>
  );
}

Mapa.propTypes = {
  mudarPagina: PropTypes.func.isRequired,
  paginaAtual: PropTypes.number.isRequired,
  showPagControl: PropTypes.bool.isRequired,
};

export default Mapa;
