import PropTypes from "prop-types";
import Map from "../components/Map/Map";
import PagControl from "../components/PagControl/PagControl";
import PocoInfoCard from "../components/PocoInfoCard/PocoInfoCard";
import HelpTour from "../components/HelpTour/HelpTour";
import EndOfPagesNotice from "../components/EndOfPagesNotice/EndOfPagesNotice";
import { useState } from "react";

function Mapa({
  mudarPagina,
  paginaAtual,
  showPagControl,
  pocoSelecionado,
  setPocoSelecionado,
  startHelpTour,
  setStartHelpTour,
  dadosPaginados,
  markerLayerRef,
  darkMode,
}) {
  const [showEndNotice, setShowEndNotice] = useState(false);
  return (
    <div>
      <Map darkMode={darkMode} />
      {pocoSelecionado && (
        <PocoInfoCard
          poco={pocoSelecionado}
          markerLayerRef={markerLayerRef}
          darkMode={darkMode}
          onClose={() => setPocoSelecionado(null)}
        />
      )}

      {showEndNotice && (
        <EndOfPagesNotice onClose={() => setShowEndNotice(false)} />
      )}

      {showPagControl && dadosPaginados && (
        <>
          <p className="pages-text">
            Página {dadosPaginados.number + 1} de {dadosPaginados.totalPages}
          </p>
          <PagControl
            mudarPagina={mudarPagina}
            paginaAtual={paginaAtual}
            totalPages={dadosPaginados.totalPages}
            onAttemptNext={() => setShowEndNotice(true)}
          />
        </>
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
  dadosPaginados: PropTypes.object,
  markerLayerRef: PropTypes.object,
  darkMode: PropTypes.bool,
};

export default Mapa;
