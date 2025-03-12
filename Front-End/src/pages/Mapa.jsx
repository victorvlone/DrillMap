import PropTypes from "prop-types";
import Map from "../components/Map/Map";

function Mapa({ filtro, subFiltroSelecionado }) {
  return (
    <div>
      <Map filtro={filtro} subFiltroSelecionado={subFiltroSelecionado} />
    </div>
  );
}

Mapa.propTypes = {
  filtro: PropTypes.string.isRequired, // Definindo o tipo de 'filtro'
  subFiltroSelecionado: PropTypes.string.isRequired, // Definindo o tipo de 'subFiltroSelecionado'
};

export default Mapa;
