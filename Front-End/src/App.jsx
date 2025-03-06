import "./App.css";
import Mapa from "./pages/Mapa";
import Home from "./pages/Home";
import Header from "./components/header/Header.jsx";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

function AppContent() {
  const location = useLocation(); // Agora está dentro do Router
  const isMapPage = location.pathname === "/mapa";

  return (
    <>
      <Header isMapPage={isMapPage} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/mapa" element={<Mapa />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
