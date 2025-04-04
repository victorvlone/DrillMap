import "./App.css";
import Mapa from "./pages/Mapa";
import Home from "./pages/Home";
import Header from "./components/Header/Header.jsx";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { useState } from "react";

function AppContent() {
  const location = useLocation();
  const isMapPage = location.pathname === "/mapa";

  // Estado global para paginação
  const [paginaAtual, setPaginaAtual] = useState(0);
  const [showPagControl, setShowPagControl] = useState(false);

  // Função que será passada até o Searchbar
  const mudarPagina = (novaPagina) => {
    setPaginaAtual(novaPagina);
  };

  return (
    <>
      <Header
        isMapPage={isMapPage}
        mudarPagina={mudarPagina}
        paginaAtual={paginaAtual}
        setShowPagControl={setShowPagControl}
      />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route
          path="/mapa"
          element={
            <Mapa
              mudarPagina={mudarPagina}
              paginaAtual={paginaAtual}
              showPagControl={showPagControl}
            />
          }
        />
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
