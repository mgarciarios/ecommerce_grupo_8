import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { isAuthenticated, getToken } from '../../utils/auth';

const STORAGE_KEY = 'cart';
const CART_ID_KEY = 'cartId';

// --- localStorage helpers ---

const loadFromStorage = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
};

const saveToStorage = (items) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
};

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

// --- Async thunks (backend API) ---

const API_BASE = 'http://localhost:8080/api/carrito';

export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { rejectWithValue }) => {
    if (!isAuthenticated()) {
      return loadFromStorage();
    }

    const cartId = getStoredCartId();
    if (!cartId) {
      return loadFromStorage();
    }

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
    console.log("hola");
    const state = getState();
    const existing = state.cart.items.find((item) => item.id === product.id);
    const nuevaCantidad = existing
      ? existing.cantidad + product.cantidad
      : product.cantidad;

    if (isAuthenticated()) {
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
    }

    return { ...product, cantidad: product.cantidad };
  }
);

export const removeItemFromCart = createAsyncThunk(
  'cart/removeItemFromCart',
  async (productId, { rejectWithValue }) => {
    if (isAuthenticated()) {
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
    }

    return productId;
  }
);

export const updateCartItemQuantity = createAsyncThunk(
  'cart/updateCartItemQuantity',
  async ({ id, delta }, { getState, rejectWithValue }) => {
    const state = getState();
    const item = state.cart.items.find((i) => i.id === id);
    if (!item) return rejectWithValue('Producto no encontrado en el carrito');

    const nuevaCantidad = item.cantidad + delta;
    if (nuevaCantidad < 1) {
      // Si la cantidad llega a 0, mejor eliminar el producto
      // Redirigimos a removeItemFromCart
      return { remove: true, id };
    }

    if (isAuthenticated()) {
      const cartId = getStoredCartId();
      if (cartId) {
        try {
          // El backend espera la cantidad a reducir
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
            // Si es incremento, hacemos un POST con cantidad 1 (agregar uno más)
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
    }

    return { id, cantidad: nuevaCantidad };
  }
);

export const clearUserCart = createAsyncThunk(
  'cart/clearUserCart',
  async (_, { rejectWithValue }) => {
    if (isAuthenticated()) {
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
    }

    return undefined;
  }
);

// --- Slice ---

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: loadFromStorage(),
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {
    addToCart: (state, action) => {
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

      saveToStorage(state.items);
    },

    removeFromCart: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      saveToStorage(state.items);
    },

    updateQuantity: (state, action) => {
      const { id, cantidad } = action.payload;
      const item = state.items.find((i) => i.id === id);
      if (item) {
        item.cantidad = cantidad;
        if (item.cantidad > item.stock) {
          item.cantidad = item.stock;
        }
      }
      saveToStorage(state.items);
    },

    clearCart: (state) => {
      state.items = [];
      saveToStorage(state.items);
    },

    setCart: (state, action) => {
      state.items = action.payload;
      saveToStorage(state.items);
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchCart
      .addCase(fetchCart.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
        saveToStorage(state.items);
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.status = 'failed';
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
        saveToStorage(state.items);
      })
      .addCase(addItemToCart.rejected, (state, action) => {
        state.error = action.payload || 'Error al agregar producto al carrito';
      })
      // removeItemFromCart
      .addCase(removeItemFromCart.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload);
        saveToStorage(state.items);
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
        saveToStorage(state.items);
      })
      .addCase(updateCartItemQuantity.rejected, (state, action) => {
        state.error = action.payload || 'Error al actualizar cantidad';
      })
      // clearUserCart
      .addCase(clearUserCart.fulfilled, (state) => {
        state.items = [];
        saveToStorage(state.items);
      })
      .addCase(clearUserCart.rejected, (state, action) => {
        state.error = action.payload || 'Error al vaciar el carrito';
      });
  },
});

// --- Selectors ---

export const selectCartItems = (state) => state.cart?.items || [];
export const selectCartTotal = (state) =>
  (state.cart?.items || []).reduce((sum, item) => sum + item.precio * item.cantidad, 0);
export const selectCartCount = (state) =>
  (state.cart?.items || []).reduce((count, item) => count + item.cantidad, 0);
export const selectCartStatus = (state) => state.cart?.status || 'idle';
export const selectCartError = (state) => state.cart?.error || null;

// --- Named actions ---

export const { addToCart, removeFromCart, updateQuantity, clearCart, setCart } =
  cartSlice.actions;

export default cartSlice.reducer;
