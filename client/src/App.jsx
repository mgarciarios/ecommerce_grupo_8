import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ListadoProductos from './listadoProductos';
import Login from './usuarios/login';
import Registro from './usuarios/registro';
import Perfil from './usuarios/perfil';

function App() {
  return (
    <Router>
      <Routes>
        {/* Ruta para el listado de productos */}
        <Route path="/productos" element={<ListadoProductos />} />
        
        {/* Ruta para el login */}
        <Route path="/login" element={<Login />} />

        {/* Ruta para el registro */}
        <Route path="/registro" element={<Registro />} />

        {/* Ruta para el perfil */}
        <Route path="/perfil" element={<Perfil />} />

        {/* Redirección por defecto si entran a la raíz (/) */}
        <Route path="*" element={<Navigate to="/productos" replace />} />
      </Routes>
    </Router>
  );
}

export default App;