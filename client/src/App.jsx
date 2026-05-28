import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Landing from './pages/Landing/Landing';
import ProductDetail from './pages/ProductDetail/ProductDetail';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Profile from './pages/Profile/Profile';
import AdminPanel from './pages/AdminPanel/AdminPanel';
import NavBar from './components/NavBar/NavBar';

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