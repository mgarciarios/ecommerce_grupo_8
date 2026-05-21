import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ListadoProductos from './pages/listadoProductos';
import Login from './pages/login';
import Registro from './pages/registro';
import Perfil from './pages/perfil';
import AdminPanel from './pages/AdminPanel';

function App() {
  return (
    <Router>
      <Routes>
        {/* Ruta para el listado de productos */}
        <Route path="/productos" element={<ListadoProductos />} />
        
        {/* Ruta para el login */}
        <Route path="/login" element={<Login />} />

        {/* Ruta para el registro */}
        <Route path="/register" element={<Registro />} />

        {/* Ruta para el perfil */}
        <Route path="/profile" element={<Perfil />} />

        <Route path="/AdminPanel" element={<AdminPanel />} />

        {/* Redirección por defecto si entran a la raíz (/) */}
        <Route path="*" element={<Navigate to="/productos" replace />} />
      </Routes>
    </Router>
  );
}

export default App;