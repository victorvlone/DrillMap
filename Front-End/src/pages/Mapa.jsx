import PropTypes from "prop-types";
import Map from "../components/Map/Map";
import PagControl from "../components/PagControl/PagControl";
import PocoInfoCard from "../components/PocoInfoCard/PocoInfoCard";

function Mapa({
  mudarPagina,
  paginaAtual,
  showPagControl,
  pocoSelecionado,
  setPocoSelecionado,
}) {
  return (
    <div>
      <Map />
      {showPagControl && (
        <PagControl mudarPagina={mudarPagina} paginaAtual={paginaAtual} />
      )}
      {pocoSelecionado && (
        <PocoInfoCard
          poco={pocoSelecionado}
          onClose={() => setPocoSelecionado(null)}
        />
      )}
    </div>
  );
}

Mapa.propTypes = {
  mudarPagina: PropTypes.func.isRequired,
  paginaAtual: PropTypes.number.isRequired,
  showPagControl: PropTypes.bool.isRequired,
  pocoSelecionado: PropTypes.any,
  setPocoSelecionado: PropTypes.func,
};

export default Mapa;
