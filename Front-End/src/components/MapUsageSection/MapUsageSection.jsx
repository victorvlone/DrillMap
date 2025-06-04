import "./MapUsageSection.css";

function MapUsageSection() {
  return (
    <section className="mapUsage">
      <div className="mapUsage-content container">
        <h1>
          utilização <br />
          do <span>mapa</span>
        </h1>
        <p>
          Explore nosso mapa interativo para acessar dados de poços e bacias
          petrolíferas sem cadastro, utilizando filtros para refinar sua busca.
        </p>
        <button>
          <Link to="/mapa">
          <a href="mapa.html">mapa</a>
            </Link>
        </button>
      </div>
    </section>
  );
}
export default MapUsageSection;
