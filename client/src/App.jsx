import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { FavoriteProvider } from './hooks/useContext/FavoriteProvider';
import Landing from './pages/Landing';
import ProductDetail from './pages/ProductDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import AdminPanel from './pages/AdminPanel';
import FavoritesList from './pages/FavoritesList';
import Cart from './pages/Cart';
import Search from './pages/Search';
import NavBar from './components/NavBar';
import { isAuthenticated, isAdminUser } from './utils/auth';

function AdminRoute({ children }) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdminUser()) {
    return <Navigate to="/productos" replace />;
  }

  return children;
}

function AppContent() {
  const location = useLocation();
  const hideNavBarRoutes = ['/login', '/register'];
  const shouldHideNavBar = hideNavBarRoutes.includes(location.pathname);

  return (
    <>
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
        <Route path="/search" element={<Search />} />
        <Route path="*" element={<Navigate to="/productos" replace />} />
      </Routes>
    </>
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