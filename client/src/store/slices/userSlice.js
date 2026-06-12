import { createSlice } from '@reduxjs/toolkit';

// 1. Buscamos si ya hay una sesión guardada en el navegador al cargar la app
let savedUser = null;
let savedToken = null;

try {
  const raw = localStorage.getItem('user');
  savedUser = raw ? JSON.parse(raw) : null;
} catch {
  savedUser = null;
}

try {
  savedToken = localStorage.getItem('token') || null;
} catch {
  localStorage.removeItem('token');
  savedToken = null;
}

const userSlice = createSlice({
  name: 'auth',
  initialState: {
    user: savedUser,                 // Datos del usuario o null
    token: savedToken,               // Token de acceso o null
    isAuthenticated: !!savedToken,   // true si hay token, false si no
  },

  reducers: {
    // Se ejecuta cuando el usuario hace login exitosamente
    login: (state, action) => {
      const { user, token } = action.payload; // Recibimos usuario y token

      // Actualizamos el estado de Redux
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;

      // Guardamos en el navegador para que no se pierda al recargar
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);
    },

    // Se ejecuta cuando el usuario cierra sesión
    logout: (state) => {
      // Limpiamos el estado de Redux
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;

      // Borramos los datos del navegador
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
  }
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;