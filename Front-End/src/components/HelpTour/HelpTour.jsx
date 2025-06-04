import { useEffect, useState } from "react";
import "./HelpTour.css";
import PropTypes from "prop-types";

function HelpTour({ startHelpTour, setStartHelpTour }) {
  const [step, setStep] = useState(0);

  const handleNext = () => {
    if (step >= 7) {
      setStep(0);
      setStartHelpTour(false); // reseta o HelpTour quando terminar
    } else {
      setStep((prev) => prev + 1);
    }
  };

  useEffect(() => {
    if (startHelpTour) {
      setStep(0); // garante reset
      const timeout = setTimeout(() => {
        setStep(1); // ativa o primeiro passo com delay
      }, 50); // pequeno delay para CSS pegar a transição

      return () => clearTimeout(timeout);
    }
  }, [startHelpTour]);

  return (
    <div>
      <div className={`container-help ${step === 1 ? "show" : ""}`} id="help-1">
        <img src="/assets/images/helpTour-gif1.gif" alt="" />
        <p>Escolha uma categoria entre Bacias, Blocos, Campos e Poços</p>
        <button onClick={handleNext}>OK!</button>
      </div>
      <div className={`container-help ${step === 2 ? "show" : ""}`} id="help-2">
        <img src="/assets/images/helpTour-gif2.gif" alt="" />
        <p>Pesquise por um nome dentro da categoria que escolheu</p>
        <button onClick={handleNext}>OK!</button>
      </div>
      <div className={`container-help ${step === 3 ? "show" : ""}`} id="help-3">
        <img src="/assets/images/helpTour-gif3.gif" alt="" />
        <p>
          Clique no icone&nbsp;
          <span className="material-symbols-outlined">tune</span>
          &nbsp;para abrir as opções de filtros da categoria.
        </p>
        <button onClick={handleNext}>OK!</button>
      </div>
      <div className={`container-help ${step === 4 ? "show" : ""}`} id="help-4">
        <img src="/assets/images/helpTour-gif4.gif" alt="" />
        <p>Escolha um ou mais filtros.</p>
        <button onClick={handleNext}>OK!</button>
      </div>
      <div className={`container-help ${step === 5 ? "show" : ""}`} id="help-5">
        <img src="/assets/images/helpTour-gif5.gif" alt="" />
        <p>Clique no poço que desejar.</p>
        <button onClick={handleNext}>OK!</button>
      </div>
      <div className={`container-help ${step === 6 ? "show" : ""}`} id="help-6">
        <img src="/assets/images/helpTour-gif6.gif" alt="" />
        <p>Pesquise por um nome dentro da categoria que escolheu</p>
        <button onClick={handleNext}>OK!</button>
      </div>
      <div className={`container-help ${step === 7 ? "show" : ""}`} id="help-7">
        <img src="/assets/images/helpTour-gif6.gif" alt="" />
        <p>Pesquise por um nome dentro da categoria que escolheu</p>
        <button onClick={handleNext}>OK!</button>
      </div>
    </div>
  );
}

HelpTour.propTypes = {
  startHelpTour: PropTypes.bool.isRequired,
  setStartHelpTour: PropTypes.func.isRequired,
};

export default HelpTour;
