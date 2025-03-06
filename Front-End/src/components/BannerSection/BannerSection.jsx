import "./BannerSection.css";

function BannerSection() {
  return (
    <div className="banner">
      <section className="banner-content container">
        <h1>Bem-vindo ao DrillMap.</h1>
        <p className="bannerText-mobile">
          Acesse o mapa sem cadastro ou cadastre-se para receber beneficios
          limitados.
        </p>
        <p className="bannerText-desktop">
          Explore mapas interativos de bacias sedimentares, poços, campos e
          blocos exploratórios com o DrillMap. Utilize nossos filtros intuitivos
          para visualizar áreas específicas e obter informações detalhadas sobre
          cada local. Navegue facilmente entre diferentes camadas geográficas e
          descubra os recursos energéticos com precisão.
        </p>
      </section>
    </div>
  );
}
export default BannerSection;
