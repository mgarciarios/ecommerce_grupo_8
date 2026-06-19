import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const PURCHASES_CACHE_PREFIX = 'purchaseHistory';

const getUserId = (state) =>
  state.user?.user?.id ??
  state.user?.user?.idUsuario ??
  state.user?.user?.usuario?.id ??
  state.user?.user?.usuario?.idUsuario ??
  state.user?.user?.user?.id ??
  null;

const getPurchasesCacheKey = (userId) => `${PURCHASES_CACHE_PREFIX}:${userId}`;

const readPurchaseCache = (userId) => {
  if (!userId) {
    return [];
  }

  try {
    const raw = localStorage.getItem(getPurchasesCacheKey(userId));
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const writePurchaseCache = (userId, pedidos) => {
  if (!userId) {
    return;
  }

  try {
    localStorage.setItem(getPurchasesCacheKey(userId), JSON.stringify(pedidos));
  } catch {
    // No bloqueamos la compra si el almacenamiento no está disponible.
  }
};

export const fetchPurchases = createAsyncThunk(
  'purchases/fetchPurchases',
  async (_, { getState }) => {
    const state = getState();
    const userId = getUserId(state);

    if (!userId) {
      return [];
    }

    return readPurchaseCache(userId);
  }
);

export const addPurchaseToCache = (pedido) => (dispatch, getState) => {
  const state = getState();
  const userId = getUserId(state);

  if (!userId || !pedido) {
    return;
  }

  const current = readPurchaseCache(userId);
  const next = [pedido, ...current.filter((item) => item?.pedidoId !== pedido?.pedidoId)];
  writePurchaseCache(userId, next);

  dispatch(fetchPurchases());
};

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
        state.pedidos = Array.isArray(action.payload) ? action.payload : [];
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
