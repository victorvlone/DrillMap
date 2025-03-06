import "./FailedSearch.css";
import PropTypes from "prop-types";

function FailedSearch({ categoria, showError, onClose }) {
  return (
    <div className={`failed-search ${showError ? "show" : "hide"}`}>
      <p>Não há nenhuma {categoria} com esse nome.</p>
      <p>Tente pesquisar em outra categoria.</p>
      <button onClick={onClose}>OK!</button>
    </div>
  );
}

FailedSearch.propTypes = {
  categoria: PropTypes.string.isRequired,
  showError: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default FailedSearch;
