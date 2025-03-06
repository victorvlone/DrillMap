import "./PlansSection.css";

function PlansSection() {
  return (
    <section className="plans container">
      <div className="plans-description">
        <h3>planos</h3>
        <ul>
          <li>Acesso ao mapa por tempo ilimitado</li>
          <li>Dados sempre atualizados</li>
        </ul>
      </div>
      <div className="plans-section">
        <div className="plans-option mensal">
          <div className="plans-title">
            <h3>mensal</h3>
            <hr />
          </div>
          <h1>
            R$<span>XX,</span>XX
          </h1>
          <div className="plans-button">
            <hr />
            <button>assinar</button>
          </div>
        </div>
        <div className="plans-option anual">
          <div className="plans-title">
            <h4>recomendado</h4>
            <h3>anual</h3>
            <hr />
          </div>
          <h1>
            R$<span>XXX,</span>XX
          </h1>
          <div className="plans-button">
            <hr />
            <button>assinar</button>
          </div>
        </div>
      </div>
    </section>
  );
}
export default PlansSection;
