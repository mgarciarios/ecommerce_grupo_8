import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_BASE = 'http://localhost:8080/api/pedidos';

export const fetchPurchases = createAsyncThunk(
  'purchases/fetchPurchases',
  async (_, { getState, rejectWithValue }) => {
    const state = getState();
    const userId = state.user?.user?.id;

    if (!state.user?.isAuthenticated || !userId) {
      return rejectWithValue('Debe iniciar sesión');
    }

    try {
      const response = await fetch(`${API_BASE}/usuario/${userId}`, {
        credentials: "include",
      });

      if (!response.ok) {
        return rejectWithValue('Error al cargar las compras');
      }

      return await response.json();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const purchaseSlice = createSlice({
  name: 'purchases',
  initialState: {
    pedidos: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPurchases.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchPurchases.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.pedidos = action.payload;
      })
      .addCase(fetchPurchases.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Error al cargar las compras';
      });
  },
});

export const selectPurchases = (state) => state.purchases?.pedidos || [];
export const selectPurchasesStatus = (state) => state.purchases?.status || 'idle';
export const selectPurchasesError = (state) => state.purchases?.error || null;

export default purchaseSlice.reducer;
