import PropTypes from "prop-types";
import Map from "../components/Map/Map";
import PagControl from "../components/PagControl/PagControl";
import PocoInfoCard from "../components/PocoInfoCard/PocoInfoCard";
import HelpTour from "../components/HelpTour/HelpTour";

function Mapa({
  mudarPagina,
  paginaAtual,
  showPagControl,
  pocoSelecionado,
  setPocoSelecionado,
  startHelpTour,
  setStartHelpTour,
}) {
  return (
    <div>
      <Map />
      {pocoSelecionado && (
        <PocoInfoCard
          poco={pocoSelecionado}
          onClose={() => setPocoSelecionado(null)}
        />
      )}
      {showPagControl && (
        <PagControl mudarPagina={mudarPagina} paginaAtual={paginaAtual} />
      )}
      {startHelpTour && (
        <HelpTour
          startHelpTour={startHelpTour}
          setStartHelpTour={setStartHelpTour}
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
  startHelpTour: PropTypes.bool.isRequired,
  setStartHelpTour: PropTypes.func.isRequired,
};

export default Mapa;
