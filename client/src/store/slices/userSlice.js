import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export const checkSession = createAsyncThunk('auth/checkSession', async (_, { rejectWithValue }) => {
  try {
    const response = await fetch('http://localhost:8080/api/auth/me', {
      credentials: 'include',
    });

    if (!response.ok) {
      return rejectWithValue('No hay sesion activa');
    }

    const data = await response.json();
    const userData = data.usuario || data.user || data;

    if (data.idCarrito && !userData.idCarrito) {
      userData.idCarrito = data.idCarrito;
    }

    return userData;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

const userSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: null,
    isAuthenticated: false,
    authChecked: false,
  },

  reducers: {
    // Se ejecuta cuando el usuario hace login exitosamente
    login: (state, action) => {
      const { user } = action.payload;

      // Actualizamos el estado de Redux
      state.user = user;
      state.token = null;
      state.isAuthenticated = true;
      state.authChecked = true;

      localStorage.setItem('user', JSON.stringify(user));
      localStorage.removeItem('token');
    },

    // Se ejecuta cuando el usuario cierra sesión
    logout: (state) => {
      // Limpiamos el estado de Redux
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.authChecked = true;

      // Borramos los datos del navegador
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkSession.fulfilled, (state, action) => {
        state.user = action.payload;
        state.token = null;
        state.isAuthenticated = true;
        state.authChecked = true;
        localStorage.setItem('user', JSON.stringify(action.payload));
        localStorage.removeItem('token');
      })
      .addCase(checkSession.rejected, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.authChecked = true;
        localStorage.removeItem('token');
      });
  }
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;
