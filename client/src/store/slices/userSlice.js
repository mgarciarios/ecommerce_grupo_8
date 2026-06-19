import { createSlice } from '@reduxjs/toolkit';

// 1. Buscamos si ya hay una sesión guardada en el navegador al cargar la app
let savedUser = null;
// NUEVO: Eliminamos toda la lógica de savedToken

try {
  const raw = localStorage.getItem('user');
  savedUser = raw ? JSON.parse(raw) : null;
} catch {
  savedUser = null;
}

// NUEVO: Ya no intentamos leer el token de localStorage

const userSlice = createSlice({
  name: 'auth',
  initialState: {
    user: savedUser,                 // Datos del usuario o null
    // NUEVO: Eliminamos la propiedad token
    isAuthenticated: !!savedUser,    // NUEVO: true si hay usuario, false si no
  },

  reducers: {
    // Se ejecuta cuando el usuario hace login exitosamente
    login: (state, action) => {
      // NUEVO: Solo recibimos el user, ignoramos el token
      const { user } = action.payload; 

      // Actualizamos el estado de Redux
      state.user = user;
      state.isAuthenticated = true;

      // Guardamos en el navegador para que no se pierda al recargar
      localStorage.setItem('user', JSON.stringify(user));
      // NUEVO: Eliminamos localStorage.setItem('token', ...)
    },

    // Se ejecuta cuando el usuario cierra sesión
    logout: (state) => {
      // Limpiamos el estado de Redux
      state.user = null;
      state.isAuthenticated = false;

      // Borramos los datos del navegador
      localStorage.removeItem('user');
      // NUEVO: Eliminamos localStorage.removeItem('token')
    }
  }
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;