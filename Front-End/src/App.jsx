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
import { useEffect, useRef, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./utils/firebaseConfig.js";
import DeleteConfirm from "./components/DeleteConfirm/DeleteConfirm.jsx";
import FavoritosList from "./components/FavoritosList/FavoritosList.jsx";
import UserProfile from "./components/UserProfile/UserProfile.jsx";
import AuthWidgets from "./components/AuthWidgets/AuthWidgets.jsx";

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
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [showFavoriteList, setShowFavoriteList] = useState(false);
  const [showUserConfig, setShowUserConfig] = useState(false);
  const [authPopup, setAuthPopUp] = useState(false);
  const [isRegistering, setIsRegistering] = useState("");
  const markerLayerRef = useRef(null);

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
        usuario={usuarioLogado}
        setUsuario={setUsuarioLogado}
        setShowDeleteConfirm={setShowDeleteConfirm}
        setShowFavoriteList={setShowFavoriteList}
        setShowUserProfile={setShowUserProfile}
        showUserConfig={showUserConfig}
        setShowUserConfig={setShowUserConfig}
        markerLayerRef={markerLayerRef}
        setIsRegistering={setIsRegistering}
        setAuthPopUp={setAuthPopUp}
        closeModal={() => setAuthPopUp(false)}
      />
      {showDeleteConfirm && (
        <DeleteConfirm
          showDeleteConfirm={showDeleteConfirm}
          setShowDeleteConfirm={setShowDeleteConfirm}
        />
      )}
      {showFavoriteList && (
        <FavoritosList
          showFavoriteList={showFavoriteList}
          setShowFavoriteList={setShowFavoriteList}
          setShowUserConfig={setShowUserConfig}
          onClose={() => setShowFavoriteList(false)}
        />
      )}
      {showUserProfile && (
        <UserProfile
          showUserProfile={showUserProfile}
          setShowUserProfile={setShowUserProfile}
          onClose={() => setShowUserProfile(false)}
        />
      )}
      <AuthWidgets
        active={authPopup}
        setAuthPopUp={setAuthPopUp}
        isRegistering={isRegistering}
        setIsRegistering={setIsRegistering}
        closeModal={() => setAuthPopUp(false)}
      />
      <Routes>
        <Route
          path="/"
          element={
            <Home
              setAuthPopUp={setAuthPopUp}
              setIsRegistering={setIsRegistering}
            />
          }
        />
        <Route
          path="/home"
          element={
            <Home
              setAuthPopUp={setAuthPopUp}
              setIsRegistering={setIsRegistering}
            />
          }
        />
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
              markerLayerRef={markerLayerRef}
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
