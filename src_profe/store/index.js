// Importa la función configureStore para crear la tienda Redux
import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './slices/counterSlice';
import cartReducer from './slices/cartSlice';
import favoriteReducer from './slices/favoriteSlice';
import authReducer from './slices/authSlice';


// este es el store donde va a estar toda la info global que necesitan los todos componentes de la app
// Crea el store global, agrupa todos los reducers (contextos o estados globales) en un solo objeto
export const store = configureStore({
  reducer: { 
    counter: counterReducer, // Gestiona el estado del contador
    // cartReducer cumple la función de CartProvider en useContext
    cart: cartReducer, // Gestiona el estado del carrito
    favorite: favoriteReducer, // Gestiona el estado de los favoritos (si lo tienes)
    auth: authReducer, // Gestiona el estado de autenticación y token
    // user: userReducer, // Gestiona el estado del usuario (si lo tienes)
    // favoritos: favoritesReducer, // Gestiona el estado de los favoritos (si lo tienes)
  },
});

