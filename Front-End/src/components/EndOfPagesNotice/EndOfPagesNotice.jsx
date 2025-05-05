import { useEffect, useState } from "react";
import "./EndOfPagesNotice.css";
import PropTypes from "prop-types";

function EndOfPagesNotice({ onClose }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setShow(false);
    setTimeout(onClose, 300);
  };
  return (
    <div className={`endPages-container ${show ? "show" : ""}`}>
      <p>Não há mais resultados para sua busca.</p>
      <button onClick={handleClose}>OK!</button>
    </div>
  );
}

EndOfPagesNotice.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default EndOfPagesNotice;
