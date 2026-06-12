import { createSlice } from '@reduxjs/toolkit';

// Definimos el estado inicial. Por defecto, el e-commerce arranca en claro ('light')
const initialState = {
  mode: 'light', 
};

export const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    // Esta función va a ser la encargada de alternar el estado
    toggleTheme: (state) => {
      state.mode = state.mode === 'light' ? 'dark' : 'light';
    },
  },
});

// Exportamos la acción para poder dispararla desde el botón después
export const { toggleTheme } = themeSlice.actions;

// Exportamos el reducer que es lo que necesita el index.js del store
export default themeSlice.reducer;