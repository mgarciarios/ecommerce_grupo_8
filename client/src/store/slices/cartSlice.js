import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { carritoApi } from '../../api/carritoApi';
import { logout } from './userSlice';

const PURCHASES_CACHE_PREFIX = 'purchaseHistory';

const getCarritoId = (state) => state.user?.user?.idCarrito;
const isAuth = (state) => state.user?.isAuthenticated;
// NUEVO: Eliminamos la función getAuthToken porque ya no usamos token estático
const getUserId = (state) => state.user?.user?.id ?? state.user?.user?.idUsuario ?? null;

const getPurchasesCacheKey = (userId) => `${PURCHASES_CACHE_PREFIX}:${userId}`;

const cachePurchase = (userId, pedido) => {
  if (!userId || !pedido) {
    return;
  }

  try {
    const raw = localStorage.getItem(getPurchasesCacheKey(userId));
    const cached = raw ? JSON.parse(raw) : [];
    const purchases = Array.isArray(cached) ? cached : [];
    const next = [pedido, ...purchases.filter((item) => item?.pedidoId !== pedido?.pedidoId)];
    localStorage.setItem(getPurchasesCacheKey(userId), JSON.stringify(next));
  } catch {
    // Si el storage no está disponible, no bloqueamos el checkout.
  }
};

const buildLocalPurchase = (state) => {
  const items = state.cart?.items || [];
  const total = items.reduce((sum, item) => sum + item.precio * item.cantidad, 0);

  return {
    pedidoId: `local-${Date.now()}`,
    fechaPedido: new Date().toISOString(),
    fechaRecepcion: null,
    estado: 'CONFIRMADO',
    total,
    items: items.map((item, index) => ({
      pedidoProductoId: `local-${Date.now()}-${index}`,
      productoId: item.id,
      nombreProducto: item.nombre,
      cantidad: item.cantidad,
      precioUnitario: item.precio,
    })),
  };
};

export const fetchCartItems = createAsyncThunk(
  'cart/fetchCartItems',
  async (_, { getState, rejectWithValue }) => {
    const state = getState();
    if (!isAuth(state)) return [];

    const cartId = getCarritoId(state);
    if (!cartId) return [];

    try {
      const data = await carritoApi.getCart(cartId);
      const productos = data.productos || [];
      console.log("👉 PRODUCTOS CRUDOS DEL BACKEND:", productos);

      // Agrupar productos para unificar visualmente cualquier duplicado en la base de datos
      const agrupados = productos.reduce((acc, p) => {
        // Agrupamos por nombre para que sea 100% a prueba de fallos, 
        // sin importar qué ID devuelva la base de datos.
        const claveUnica = p.nombreProducto || p.productoId;
        if (acc[claveUnica]) {
          acc[claveUnica].cantidad += p.cantidad;
        } else {
          acc[claveUnica] = {
            id: p.productoId,
            nombre: p.nombreProducto,
            precio: p.precioUnitario,
            cantidad: p.cantidad,
            foto: p.foto || null,
            stock: p.stock,
          };
        }
        return acc;
      }, {});

      return Object.values(agrupados);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const addItemToCart = createAsyncThunk(
  'cart/addItemToCart',
  async (product, { getState, rejectWithValue }) => {
    const state = getState();

    if (!isAuth(state)) {
      return rejectWithValue('Debe iniciar sesión para agregar productos al carrito');
    }

    const cartId = getCarritoId(state);
    if (cartId) {
      try {
        await carritoApi.addItem(cartId, product.id, product.cantidad);
      } catch (err) {
        return rejectWithValue(err.message);
      }
    }

    return { ...product, cantidad: product.cantidad };
  }
);

export const removeItemFromCart = createAsyncThunk(
  'cart/removeItemFromCart',
  async (productId, { getState, rejectWithValue }) => {
    const state = getState();

    if (!isAuth(state)) {
      return rejectWithValue('Debe iniciar sesión');
    }

    const cartId = getCarritoId(state);
    if (cartId) {
      try {
        await carritoApi.removeItem(cartId, productId);
      } catch (err) {
        return rejectWithValue(err.message);
      }
    }

    return productId;
  }
);

export const updateCartItemQuantity = createAsyncThunk(
  'cart/updateCartItemQuantity',
  async ({ id, delta }, { getState, rejectWithValue }) => {
    const state = getState();

    if (!isAuth(state)) {
      return rejectWithValue('Debe iniciar sesión');
    }

    const item = state.cart.items.find((i) => i.id === id);
    if (!item) return rejectWithValue('Producto no encontrado en el carrito');

    const cartId = getCarritoId(state);
    if (cartId) {
      try {
        const cantidadAReducir = delta < 0 ? Math.abs(delta) : 0;
        if (cantidadAReducir > 0) {
          await carritoApi.reduceItem(cartId, id, cantidadAReducir);
        } else {
          await carritoApi.addOrIncrement(cartId, id, delta);
        }
      } catch (err) {
        return rejectWithValue(err.message);
      }
    }

    return { id, delta };
  }
);

export const checkoutCart = createAsyncThunk(
  'cart/checkoutCart',
  async (_, { getState, rejectWithValue }) => {
    const state = getState();

    if (!isAuth(state)) {
      return rejectWithValue('Debe iniciar sesión para finalizar la compra');
    }

    const carritoId = getCarritoId(state);

    if (!carritoId) {
      return rejectWithValue('No se encontró el carrito');
    }

    try {
      return await carritoApi.checkout(carritoId);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const clearUserCart = createAsyncThunk(
  'cart/clearUserCart',
  async (_, { getState, rejectWithValue }) => {
    const state = getState();

    if (!isAuth(state)) {
      return rejectWithValue('Debe iniciar sesión');
    }

    const cartId = getCarritoId(state);
    if (cartId) {
      try {
        await carritoApi.clear(cartId);
      } catch (err) {
        return rejectWithValue(err.message);
      }
    }

    return undefined;
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    setCartItems: (state, action) => {
      state.items = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // fetchCartItems
      .addCase(fetchCartItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCartItems.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.error = null;
      })
      .addCase(fetchCartItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Error al cargar el carrito';
      })
      // addItemToCart
      .addCase(addItemToCart.fulfilled, (state, action) => {
        const product = action.payload;
        const existing = state.items.find((item) => item.id === product.id);
        if (existing) {
          existing.cantidad += product.cantidad || 1;
          if (product.stock && existing.cantidad > product.stock) {
            existing.cantidad = product.stock;
          }
        } else {
          state.items.push({
            id: product.id,
            nombre: product.nombre,
            precio: product.precio,
            foto: product.foto || null,
            cantidad: product.cantidad || 1,
            stock: product.stock ?? 99,
          });
        }
      })
      .addCase(addItemToCart.rejected, (state, action) => {
        state.error = action.payload || 'Error al agregar producto al carrito';
      })
      // removeItemFromCart
      .addCase(removeItemFromCart.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload);
      })
      .addCase(removeItemFromCart.rejected, (state, action) => {
        state.error = action.payload || 'Error al eliminar producto del carrito';
      })
      // updateCartItemQuantity
      .addCase(updateCartItemQuantity.fulfilled, (state, action) => {
        if (action.payload) {
          const item = state.items.find((i) => i.id === action.payload.id);
          if (item) {
            //El freno definitivo por si mandan un click extra:
            if (action.payload.delta > 0 && item.cantidad >= item.stock) {
              return; 
            }
            item.cantidad += action.payload.delta;
            if (item.cantidad <= 0) {
              state.items = state.items.filter((i) => i.id !== action.payload.id);
            }
          }
        }
      })
      .addCase(updateCartItemQuantity.rejected, (state, action) => {
        state.error = action.payload || 'Error al actualizar cantidad';
      })
      // checkoutCart
      .addCase(checkoutCart.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(checkoutCart.fulfilled, (state) => {
        state.status = 'succeeded';
        state.items = [];
      })
      .addCase(checkoutCart.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Error al finalizar la compra';
      })
      // clearUserCart
      .addCase(clearUserCart.fulfilled, (state) => {
        state.items = [];
      })
      .addCase(clearUserCart.rejected, (state, action) => {
        state.error = action.payload || 'Error al vaciar el carrito';
      })
      // logout
      .addCase(logout, (state) => {
        state.items = [];
        state.error = null;
      });
  },
});

export const { setCartItems } = cartSlice.actions;

export const selectCartItems = (state) => state.cart?.items || [];
export const selectCartTotal = (state) =>
  (state.cart?.items || []).reduce((sum, item) => sum + item.precio * item.cantidad, 0);
export const selectCartCount = (state) =>
  (state.cart?.items || []).reduce((count, item) => count + item.cantidad, 0);
export const selectCartLoading = (state) => state.cart?.loading || false;
export const selectCartError = (state) => state.cart?.error || null;

export default cartSlice.reducer;