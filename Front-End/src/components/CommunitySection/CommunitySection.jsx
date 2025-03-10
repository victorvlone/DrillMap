import "./CommunitySection.css";

function CommunitySection() {
  return (
    <section className="community container">
      <div className="community-text">
        <h3>Faça parte da nossa comunidade e mantenha-se sempre informado</h3>
        <p>
          Nossa plataforma garante que você esteja sempre um passo à frente, com
          acesso a ferramentas avançadas e um suporte contínuo. Não perca a
          oportunidade de fazer parte de uma rede que valoriza o conhecimento e
          a atualização constante.
        </p>
      </div>
      <div className="community-benefits">
        <div className="benefits-container">
          <div className="community-img">
            <img src="assets/images/icon-notifications.png" alt="" />
          </div>
          <div className="benefits-container-text">
            <h4>notificação</h4>
            <p>
              Receba notificações automáticas sempre que um poço que você
              favoritou for atualizado.
            </p>
          </div>
        </div>
        <div className="benefits-container">
          <div className="community-img">
            <img src="assets/images/icon-Bookmark.png" alt="" />
          </div>
          <div className="benefits-container-text">
            <h4>favorito</h4>
            <p>
              Após realizar o cadastro, você pode favoritar os poços de
              interesse.
            </p>
          </div>
        </div>
        <div className="benefits-container">
          <div className="community-img">
            <img src="assets/images/Icon-details.png" alt="" />
          </div>
          <div className="benefits-container-text">
            <h4>detalhes</h4>
            <p>
              Você tem acesso a uma plataforma que permite explorar informações
              detalhadas sobre cada poço.
            </p>
          </div>
        </div>
      </div>
      <button className="community-btn">cadastre-se</button>
    </section>
  );
}

export default CommunitySection;
