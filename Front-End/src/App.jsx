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
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./utils/firebaseConfig.js";
import DeleteConfirm from "./components/DeleteConfirm/DeleteConfirm.jsx";

function AppContent() {
  const location = useLocation();
  const isMapPage = location.pathname === "/mapa";

  // Estado global para paginação
  const [paginaAtual, setPaginaAtual] = useState(0);
  const [showPagControl, setShowPagControl] = useState(false);
  const [pocoSelecionado, setPocoSelecionado] = useState(null);
  const [startHelpTour, setStartHelpTour] = useState(false);
  const [dadosPaginados, setDadosPaginados] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [usuarioLogado, setUsuarioLogado] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUsuarioLogado(user);
        console.log("Usuário logado:", user.email);
      } else {
        setUsuarioLogado(null);
        console.log("Usuário deslogado");
      }
    });

    return () => unsubscribe();
  }, []);
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
        setPocoSelecionado={setPocoSelecionado}
        setStartHelpTour={setStartHelpTour}
        setDadosPaginados={setDadosPaginados}
        usuarioLogado={usuarioLogado}
        setUsuarioLogado={setUsuarioLogado}
        setShowDeleteConfirm={setShowDeleteConfirm}
      />
      {showDeleteConfirm && (
        <DeleteConfirm
          showDeleteConfirm={showDeleteConfirm}
          setShowDeleteConfirm={setShowDeleteConfirm}
        />
      )}
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
              pocoSelecionado={pocoSelecionado}
              setPocoSelecionado={setPocoSelecionado}
              startHelpTour={startHelpTour} // <-- novo
              setStartHelpTour={setStartHelpTour} // <-- novo
              dadosPaginados={dadosPaginados}
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
