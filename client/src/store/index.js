// Importa la función configureStore para crear la tienda Redux
import { configureStore } from '@reduxjs/toolkit';
import favoriteReducer from './slices/favoriteSlice';
import cartReducer from './slices/cartSlice';
import purchaseReducer from './slices/purchaseSlice';
import userReducer from './slices/userSlice';

// este es el store donde va a estar toda la info global que necesitan los todos componentes de la app
// Crea el store global, agrupa todos los reducers (contextos o estados globales) en un solo objeto
export const store = configureStore({
  reducer: { 
    // cartReducer cumple la función de CartProvider en useContext
    cart: cartReducer,
    favorite: favoriteReducer,
    purchases: purchaseReducer,
    user: userReducer,
  },
});
