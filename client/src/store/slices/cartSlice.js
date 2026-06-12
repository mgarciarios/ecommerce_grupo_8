import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { isAuthenticated, getToken } from '../../utils/auth';

const CART_ID_KEY = 'cartId';

const getStoredCartId = () => {
  try {
    return JSON.parse(localStorage.getItem(CART_ID_KEY));
  } catch {
    return null;
  }
};

const setStoredCartId = (id) => {
  localStorage.setItem(CART_ID_KEY, JSON.stringify(id));
};

const API_BASE = 'http://localhost:8080/api/carrito';

export const fetchCartItems = createAsyncThunk(
  'cart/fetchCartItems',
  async (_, { rejectWithValue }) => {
    if (!isAuthenticated()) return [];

    const cartId = getStoredCartId();
    if (!cartId) return [];

    try {
      const response = await fetch(`${API_BASE}/${cartId}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });

      if (!response.ok) throw new Error('Error al cargar el carrito');

      const data = await response.json();
      const productos = data.productos || [];

      return productos.map((p) => ({
        id: p.productoId,
        nombre: p.nombreProducto,
        precio: p.precioUnitario,
        cantidad: p.cantidad,
        foto: p.foto || null,
        stock: p.stock ?? 99,
      }));
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const addItemToCart = createAsyncThunk(
  'cart/addItemToCart',
  async (product, { getState, rejectWithValue }) => {
    if (!isAuthenticated()) {
      return rejectWithValue('Debe iniciar sesión para agregar productos al carrito');
    }

    const state = getState();
    const existing = state.cart.items.find((item) => item.id === product.id);
    const nuevaCantidad = existing
      ? existing.cantidad + product.cantidad
      : product.cantidad;

    const cartId = getStoredCartId();
    if (cartId) {
      try {
        await fetch(`${API_BASE}/${cartId}/productos`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getToken()}`,
          },
          body: JSON.stringify({
            productoId: product.id,
            cantidad: nuevaCantidad,
          }),
        });
      } catch (err) {
        return rejectWithValue(err.message);
      }
    }

    return { ...product, cantidad: product.cantidad };
  }
);

export const removeItemFromCart = createAsyncThunk(
  'cart/removeItemFromCart',
  async (productId, { rejectWithValue }) => {
    if (!isAuthenticated()) {
      return rejectWithValue('Debe iniciar sesión');
    }

    const cartId = getStoredCartId();
    if (cartId) {
      try {
        await fetch(`${API_BASE}/${cartId}/productos/${productId}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${getToken()}` },
        });
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
    if (!isAuthenticated()) {
      return rejectWithValue('Debe iniciar sesión');
    }

    const state = getState();
    const item = state.cart.items.find((i) => i.id === id);
    if (!item) return rejectWithValue('Producto no encontrado en el carrito');

    const nuevaCantidad = item.cantidad + delta;
    if (nuevaCantidad < 1) {
      return { remove: true, id };
    }

    const cartId = getStoredCartId();
    if (cartId) {
      try {
        const cantidadAReducir = delta < 0 ? Math.abs(delta) : 0;
        if (cantidadAReducir > 0) {
          await fetch(
            `${API_BASE}/${cartId}/productos/${id}/reduce?cantidad=${cantidadAReducir}`,
            {
              method: 'PUT',
              headers: { Authorization: `Bearer ${getToken()}` },
            }
          );
        } else {
          await fetch(`${API_BASE}/${cartId}/productos`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${getToken()}`,
            },
            body: JSON.stringify({ productoId: id, cantidad: nuevaCantidad }),
          });
        }
      } catch (err) {
        return rejectWithValue(err.message);
      }
    }

    return { id, cantidad: nuevaCantidad };
  }
);

export const clearUserCart = createAsyncThunk(
  'cart/clearUserCart',
  async (_, { rejectWithValue }) => {
    if (!isAuthenticated()) {
      return rejectWithValue('Debe iniciar sesión');
    }

    const cartId = getStoredCartId();
    if (cartId) {
      try {
        await fetch(`${API_BASE}/${cartId}/productos`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${getToken()}` },
        });
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
        if (action.payload?.remove) {
          state.items = state.items.filter((item) => item.id !== action.payload.id);
        } else if (action.payload) {
          const item = state.items.find((i) => i.id === action.payload.id);
          if (item) {
            item.cantidad = action.payload.cantidad;
          }
        }
      })
      .addCase(updateCartItemQuantity.rejected, (state, action) => {
        state.error = action.payload || 'Error al actualizar cantidad';
      })
      // clearUserCart
      .addCase(clearUserCart.fulfilled, (state) => {
        state.items = [];
      })
      .addCase(clearUserCart.rejected, (state, action) => {
        state.error = action.payload || 'Error al vaciar el carrito';
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
