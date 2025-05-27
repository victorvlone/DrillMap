import PropTypes from "prop-types";
import BannerSection from "../components/BannerSection/BannerSection";
import CommunitySection from "../components/CommunitySection/CommunitySection";
import MapUsageSection from "../components/MapUsageSection/MapUsageSection";

function Home({ setAuthPopUp, setIsRegistering }) {
  return (
    <div>
      <BannerSection />
      <CommunitySection
        setAuthPopUp={setAuthPopUp}
        setIsRegistering={setIsRegistering}
      />
      <MapUsageSection />
    </div>
  );
}

Home.propTypes = {
  setAuthPopUp: PropTypes.func.isRequired,
  setIsRegistering: PropTypes.func,
};

export default Home;
