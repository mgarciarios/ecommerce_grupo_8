import { createSlice } from '@reduxjs/toolkit';

// Intentamos recuperar el modo del localStorage. Si no existe, usamos 'light' por defecto.
const initialState = {
  mode: localStorage.getItem('app-theme') || 'light', 
};

export const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    // Esta función va a ser la encargada de alternar el estado
    toggleTheme: (state) => {
      state.mode = state.mode === 'light' ? 'dark' : 'light';
      localStorage.setItem('app-theme', state.mode); // Guardamos la preferencia en el navegador
    },
  },
});

// Exportamos la acción para poder dispararla desde el botón después
export const { toggleTheme } = themeSlice.actions;

// Exportamos el reducer que es lo que necesita el index.js del store
export default themeSlice.reducer;