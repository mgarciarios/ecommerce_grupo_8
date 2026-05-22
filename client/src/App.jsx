import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import ListadoProductos from './pages/listadoProductos';
import ProductoDetalle from './pages/ProductoDetalle'; // Importa el nuevo componente
import Login from './pages/login';
import Registro from './pages/registro';
import Perfil from './pages/perfil';
import AdminPanel from './pages/AdminPanel';
import NavBar from './components/NavBar';

function AppContent() {
  const location = useLocation();
  const hideNavBarRoutes = ['/login', '/register'];
  const shouldHideNavBar = hideNavBarRoutes.includes(location.pathname);

  return (
    <>
      {!shouldHideNavBar && <NavBar />}
      <Routes>
        <Route path="/productos" element={<ListadoProductos />} />
        <Route path="/producto/:id" element={<ProductoDetalle />} /> {/* Nueva ruta */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Registro />} />
        <Route path="/profile" element={<Perfil />} />
        <Route path="/AdminPanel" element={<AdminPanel />} />
        <Route path="*" element={<Navigate to="/productos" replace />} />
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