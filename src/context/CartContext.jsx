import { createContext, useContext, useEffect, useReducer, useCallback } from 'react';
import toast from 'react-hot-toast';
import { fetchCart, addToCartAPI, updateCartItemAPI, removeCartItemAPI } from '../services/api';

const CartContext = createContext();

const initialState = {
  cartItems: [],
  cartCount: 0,
  cartTotal: 0,
  loading: true,
};

function cartReducer(state, action) {
  switch (action.type) {
    case 'SET_CART':
      return {
        ...state,
        cartItems: action.payload.items,
        cartTotal: action.payload.subtotal,
        cartCount: action.payload.item_count,
        loading: false,
      };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Sync cart from server
  const refreshCart = useCallback(async () => {
    try {
      const data = await fetchCart();
      dispatch({ type: 'SET_CART', payload: data });
    } catch (err) {
      console.error('Failed to fetch cart:', err);
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  // Load cart on mount
  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const addToCart = useCallback(async (product, quantity = 1) => {
    try {
      await addToCartAPI(product.id || product.product_id, quantity);
      await refreshCart();
      toast.success('Added to cart!');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to add to cart');
    }
  }, [refreshCart]);

  const updateQty = useCallback(async (cartItemId, quantity) => {
    try {
      if (quantity < 1) {
        await removeCartItemAPI(cartItemId);
        toast.error('Removed from cart');
      } else {
        await updateCartItemAPI(cartItemId, quantity);
      }
      await refreshCart();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update cart');
    }
  }, [refreshCart]);

  const removeFromCart = useCallback(async (cartItemId) => {
    try {
      await removeCartItemAPI(cartItemId);
      await refreshCart();
      toast.error('Removed from cart');
    } catch (err) {
      toast.error('Failed to remove item');
    }
  }, [refreshCart]);

  const clearCart = useCallback(() => {
    // After placing an order, the server clears the cart
    // We just need to refresh the local state
    dispatch({ type: 'SET_CART', payload: { items: [], subtotal: 0, item_count: 0 } });
  }, []);

  return (
    <CartContext.Provider
      value={{
        cartItems: state.cartItems,
        cartCount: state.cartCount,
        cartTotal: state.cartTotal,
        loading: state.loading,
        addToCart,
        updateQty,
        removeFromCart,
        clearCart,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
