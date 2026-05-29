import { Navigate } from 'react-router-dom';
import { useAuth } from '../features/auth/context/AuthContext';

const ProtectedRoute = ({ children }) => {
  //traigo del contexto (o información global) los datos del usuario, si está autenticado, sus datos, etc.
  // const { isAuthenticated, loading } = useAuth();

  // if (loading) {
  //   return <div>Cargando...</div>;
  // }

  //hardcodeado provisoriamente, luego mediante jwt en java veremos si están logueado
  //para ver un ejemplo AuthContext, 
  const isAuthenticated = true;

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;