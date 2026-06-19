import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'; 
import { FavoriteProvider } from './hooks/useContext/FavoriteProvider';
import Landing from './pages/Landing';
import ProductDetail from './pages/ProductDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import AdminPanel from './pages/AdminPanel';
import FavoritesList from './pages/FavoritesList';
import Cart from './pages/Cart';
import Purchases from './pages/Purchases';
import Search from './pages/Search';
import NavBar from './components/NavBar';
import { checkSession } from './store/slices/userSlice';
import { isAdminUser } from './utils/auth';
import './App.css';

function AdminRoute({ children }) {
  const { user, isAuthenticated, authChecked } = useSelector((state) => state.user);

  if (!authChecked) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdminUser(user)) {
    return <Navigate to="/productos" replace />;
  }

  return children;
}

function AppContent() {
  const location = useLocation();
  const dispatch = useDispatch();
  const hideNavBarRoutes = ['/login', '/register'];
  const shouldHideNavBar = hideNavBarRoutes.includes(location.pathname);

  // 1. Escuchamos el modo actual ('light' o 'dark') desde Redux
  const currentMode = useSelector((state) => state.theme.mode);

  useEffect(() => {
    dispatch(checkSession());
  }, [dispatch]);

  // Sincronizamos la clase en el body general del HTML
  useEffect(() => {
    if (currentMode === 'dark') {
      document.body.classList.add('dark');
      document.body.classList.remove('light');
    } else {
      document.body.classList.add('light');
      document.body.classList.remove('dark');
    }
  }, [currentMode]);

  return (
    // 2. Envolvemos todo el contenido en este contenedor con la clase dinámica
    <div className={`app-container ${currentMode}`}>
      {!shouldHideNavBar && <NavBar />}
      <Routes>
        <Route path="/productos" element={<Landing />} />
        <Route path="/producto/:id" element={<ProductDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route
          path="/AdminPanel"
          element={
            <AdminRoute>
              <AdminPanel />
            </AdminRoute>
          }
        />
        <Route path="/favorites/:categoria" element={<FavoritesList />} />
        <Route path="/favorites" element={<FavoritesList />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/purchases" element={<Purchases />} />
        <Route path="/search" element={<Search />} />
        <Route path="*" element={<Navigate to="/productos" replace />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <FavoriteProvider>
      <Router>
        <AppContent />
      </Router>
    </FavoriteProvider>
  );
}

export default App;
