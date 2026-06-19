import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import { AuthProvider } from './features/auth/context/AuthContext'
import LoginJWTContext from './components/LoginJWTContext'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './components/Home'
import ProductList from './components/ProductList'
import ProductDetail from './components/ProductDetail'
import ProductDetailRedux from './components/ProductDetailRedux'
import Cart from './components/Cart'
import CartRedux from './components/CartRedux'
import Checkout from './components/Checkout'
import FormularioValidado from './formularios/FormularioValidado'
import FormularioPago from './formularios/FormularioPago'
import FormularioPagoReactForm from './formularios/FormularioPagoReactForm'
import { CartProvider } from './hooks/useContext/CartProvider'
import Card from './ejemplos/Card'
import Counter from './components/Counter'
import Favorite from './components/Favorite'
import LoginJWT from './components/LoginJWT'
import { DebugAuth } from './components/DebugAuth'

function App() {
  return (
    // <AuthProvider>
      <CartProvider>  
        <BrowserRouter>
          {/* aquí se definen todas las rutas o links de la app, que luego serán usadas en diferentes componentes */}
          <Routes>
            <Route path="/" element={<LoginJWT />} />
            <Route path="/home" element={<Home />} />
            <Route path="/debug-auth" element={<DebugAuth />} />

            {/* <a href="/ProductList.html">Link a productos</a> */}
            <Route path="/products" element={<ProductList />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/products-redux/:id" element={<ProductDetailRedux />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/cart-redux" element={<CartRedux />} />
            <Route path="/counter" element={<Counter />} />
            <Route path="/login" element={<LoginJWTContext />} />
            <Route path="/favorite" element={<Favorite />} />
            <Route path="/checkout" 
              element={
                // protected route es un componente que verifica si el usuario está autenticado antes de permitir el acceso a la ruta. Si no está autenticado, redirige al login.
                <ProtectedRoute>
                  <Checkout />  
                </ProtectedRoute>
              } 
            />
            <Route path="/formValido" element={<FormularioValidado />} />
            <Route path="/formPago" element={<FormularioPago />} />
            <Route path="/formReact" element={<FormularioPagoReactForm />} />
          </Routes>
        </BrowserRouter>
      </CartProvider>  
      // </AuthProvider>


      
  )
}

export default App
