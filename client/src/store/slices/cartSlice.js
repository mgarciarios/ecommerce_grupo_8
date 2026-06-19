import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_BASE = 'http://localhost:8080/api/carrito';

const getCarritoId = (state) => state.user?.user?.idCarrito;
const isAuth = (state) => state.user?.isAuthenticated;
export const fetchCartItems = createAsyncThunk(
  'cart/fetchCartItems',
  async (_, { getState, rejectWithValue }) => {
    const state = getState();
    if (!isAuth(state)) return [];

    const cartId = getCarritoId(state);
    if (!cartId) return [];

    try {
      const response = await fetch(`${API_BASE}/${cartId}`, {
        credentials: "include",
      });
      

      if (!response.ok) throw new Error('Error al cargar el carrito');

      const data = await response.json();
      const productos = data.productos || [];

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
            stock: p.stock ?? 99,
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
        await fetch(`${API_BASE}/${cartId}/productos`, {
          method: 'POST',
          credentials: "include",
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            productoId: product.id,
            cantidad: product.cantidad, // <-- ENVÍA EL DELTA, NO EL TOTAL
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
  async (productId, { getState, rejectWithValue }) => {
    const state = getState();

    if (!isAuth(state)) {
      return rejectWithValue('Debe iniciar sesión');
    }

    const cartId = getCarritoId(state);
    if (cartId) {
      try {
        await fetch(`${API_BASE}/${cartId}/productos/${productId}`, {
          method: 'DELETE',
          credentials: "include",
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
          await fetch(
            `${API_BASE}/${cartId}/productos/${id}/reduce?cantidad=${cantidadAReducir}`,
            {
              method: 'PUT',
              credentials: "include",
            }
          );
        } else {
          await fetch(`${API_BASE}/${cartId}/productos`, {
            method: 'POST',
            credentials: "include",
            headers: {
              'Content-Type': 'application/json',
            },
          body: JSON.stringify({ productoId: id, cantidad: delta }), // <-- ENVÍA EL DELTA
          });
        }
      } catch (err) {
        return rejectWithValue(err.message);
      }
    }

    return { id, delta }; // Devolvemos el delta para sumarlo de forma segura
  }
);

export const checkoutCart = createAsyncThunk(
  'cart/checkoutCart',
  async (_, { getState, rejectWithValue }) => {
    const state = getState();
    console.log('checkoutCart - state:', state);

    if (!isAuth(state)) {
      return rejectWithValue('Debe iniciar sesión para finalizar la compra');
    }

    const carritoId = getCarritoId(state);

    if (!carritoId) {
      return rejectWithValue('No se encontró el carrito');
    }

    try {
      const response = await fetch(`${API_BASE}/${carritoId}/checkout`, {
        method: 'POST',
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.log('checkoutCart - errorData:', errorData);
        return rejectWithValue(errorData.mensaje || errorData.message || 'Error al finalizar la compra');
      }

      return await response.json();
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
        await fetch(`${API_BASE}/${cartId}/productos`, {
          method: 'DELETE',
          credentials: "include",
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
        if (action.payload) {
          const item = state.items.find((i) => i.id === action.payload.id);
          if (item) {
            item.cantidad += action.payload.delta; // Sumamos el delta de forma segura e independiente
            if (item.cantidad <= 0) {
              state.items = state.items.filter((i) => i.id !== action.payload.id); // Si llega a 0, se elimina
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
