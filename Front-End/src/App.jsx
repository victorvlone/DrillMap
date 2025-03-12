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

  const [filtroSelecionado, setFiltroSelecionado] = useState(null);
  const [subFiltroSelecionado, setSubFiltroSelecionado] = useState(null);

  return (
    <>
      <Header
        isMapPage={isMapPage}
        setFiltroSelecionado={setFiltroSelecionado}
        setSubFiltroSelecionado={setSubFiltroSelecionado}
      />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route
          path="/mapa"
          element={
            <Mapa
              filtro={filtroSelecionado}
              subFiltroSelecionado={subFiltroSelecionado}
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
