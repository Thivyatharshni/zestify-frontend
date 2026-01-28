import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { cartApi } from '../services/cartApi';
import { MENU_ITEMS } from '../mocks/menu.mock';

const CartContext = createContext(null);

const cartReducer = (state, action) => {
    switch (action.type) {
        case 'SET_CART':
            const payload = action.payload || {};
            return {
                ...state,
                items: payload.items || [],
                totalPrice: payload.totalPrice || 0,
                totalItems: payload.totalItems || 0,
                restaurantId: payload.restaurantId || null,
                couponCode: payload.couponCode || null,
                discount: payload.discount || 0,
                loading: false
            };
        case 'SET_LOADING':
            return { ...state, loading: action.payload };
        case 'APPLY_COUPON':
            return {
                ...state,
                couponCode: action.payload.couponCode,
                discount: action.payload.discount
            };
        case 'REMOVE_COUPON':
            return {
                ...state,
                couponCode: null,
                discount: 0
            };
        case 'CLEAR_CART':
            return { items: [], totalPrice: 0, totalItems: 0, restaurantId: null, couponCode: null, discount: 0, loading: false };
        default:
            return state;
    }
};

export const CartProvider = ({ children }) => {
    const [state, dispatch] = useReducer(cartReducer, {
        items: [],
        totalPrice: 0,
        totalItems: 0,
        restaurantId: null,
        couponCode: null,
        discount: 0,
        loading: true
    });
    const { user } = useAuth();

    const refreshCart = useCallback(async () => {
        if (!user) {
            dispatch({ type: 'CLEAR_CART' });
            return;
        }
        dispatch({ type: 'SET_LOADING', payload: true });
        try {
            const cartData = await cartApi.getCart();
            dispatch({ type: 'SET_CART', payload: cartData });
        } catch (error) {
            console.error("Failed to refresh cart:", error);
            // Set empty cart on error to prevent crashes
            dispatch({ type: 'SET_CART', payload: { items: [], totalPrice: 0, totalItems: 0 } });
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    }, [user]);

    useEffect(() => {
        if (user) {
            refreshCart();
        } else {
            dispatch({ type: 'CLEAR_CART' });
        }
    }, [user, refreshCart]);

    const addItem = async (restaurantId, menuItemId, quantity, addons = []) => {
        try {
            // Check restaurant lock
            if (state.restaurantId && state.restaurantId !== restaurantId && state.items.length > 0) {
                if (!window.confirm('Adding items from a different restaurant will clear your current cart. Continue?')) {
                    return;
                }
                try { await cartApi.clearCart(); } catch (e) { }
                dispatch({ type: 'CLEAR_CART' });
            }

            try {
                const updatedCart = await cartApi.addToCart(restaurantId, menuItemId, quantity, addons);
                dispatch({ type: 'SET_CART', payload: updatedCart });
                return updatedCart;
            } catch (apiError) {
                console.warn("Backend add failed, using local fallback", apiError);

                // Find item details from mocks or existing state to populate local cart
                const itemDetails = MENU_ITEMS.find(i => i.id === menuItemId);
                if (!itemDetails) {
                    alert("Item details not found. Please try again.");
                    return;
                }

                const newItem = {
                    menuItem: menuItemId,
                    id: menuItemId,
                    name: itemDetails.name,
                    price: itemDetails.price,
                    image: itemDetails.image,
                    quantity: quantity,
                    addons: addons,
                    restaurantId: restaurantId
                };

                const newItems = [...state.items];
                const existingIndex = newItems.findIndex(i => i.menuItem === menuItemId && JSON.stringify(i.addons) === JSON.stringify(addons));

                if (existingIndex > -1) {
                    newItems[existingIndex].quantity += quantity;
                } else {
                    newItems.push(newItem);
                }

                const calculateCartTotals = (items) => {
                    return items.reduce((acc, item) => {
                        const basePrice = item.price || 0;
                        const addonsPrice = (item.addons || []).reduce((sum, a) => sum + (a.price || 0), 0);
                        return acc + ((basePrice + addonsPrice) * item.quantity);
                    }, 0);
                };

                const totalItems = newItems.reduce((acc, i) => acc + i.quantity, 0);
                const totalPrice = calculateCartTotals(newItems);

                dispatch({
                    type: 'SET_CART',
                    payload: {
                        items: newItems,
                        totalPrice,
                        totalItems,
                        restaurantId
                    }
                });
                return { items: newItems, totalPrice, totalItems, restaurantId };
            }
        } catch (error) {
            console.error("Add item failed:", error);
            throw error;
        }
    };

    const updateQuantity = async (menuItemId, quantity) => {
        try {
            const updatedCart = await cartApi.updateCartItem(menuItemId, quantity);
            dispatch({ type: 'SET_CART', payload: updatedCart });
            return updatedCart;
        } catch (error) {
            console.warn("Backend update failed, using local fallback");
            const newItems = state.items.map(item =>
                item.menuItem === menuItemId ? { ...item, quantity } : item
            ).filter(item => item.quantity > 0);

            const calculateCartTotals = (items) => {
                return items.reduce((acc, item) => {
                    const basePrice = item.price || 0;
                    const addonsPrice = (item.addons || []).reduce((sum, a) => sum + (a.price || 0), 0);
                    return acc + ((basePrice + addonsPrice) * item.quantity);
                }, 0);
            };

            const totalItems = newItems.reduce((acc, i) => acc + i.quantity, 0);
            const totalPrice = calculateCartTotals(newItems);

            dispatch({
                type: 'SET_CART',
                payload: { ...state, items: newItems, totalPrice, totalItems }
            });
        }
    };

    const removeItem = async (menuItemId) => {
        try {
            const updatedCart = await cartApi.removeFromCart(menuItemId);
            dispatch({ type: 'SET_CART', payload: updatedCart });
            return updatedCart;
        } catch (error) {
            console.warn("Backend remove failed, using local fallback");
            const newItems = state.items.filter(item => item.menuItem !== menuItemId);

            const calculateCartTotals = (items) => {
                return items.reduce((acc, item) => {
                    const basePrice = item.price || 0;
                    const addonsPrice = (item.addons || []).reduce((sum, a) => sum + (a.price || 0), 0);
                    return acc + ((basePrice + addonsPrice) * item.quantity);
                }, 0);
            };

            const totalItems = newItems.reduce((acc, i) => acc + i.quantity, 0);
            const totalPrice = calculateCartTotals(newItems);

            dispatch({
                type: 'SET_CART',
                payload: { ...state, items: newItems, totalPrice, totalItems, restaurantId: newItems.length > 0 ? state.restaurantId : null }
            });
        }
    };


    const clearCart = async () => {
        try {
            await cartApi.clearCart();
            dispatch({ type: 'CLEAR_CART' });
        } catch (error) {
            console.error("Clear cart failed:", error);
            throw error;
        }
    };

    const applyCoupon = ({ code, discount }) => {
        dispatch({
            type: 'APPLY_COUPON',
            payload: {
                couponCode: code,
                discount
            }
        });
    };


    const removeCoupon = () => {
        dispatch({ type: 'REMOVE_COUPON' });
        // TODO: Call backend to remove coupon from cart
    };

    return (
        <CartContext.Provider value={{ state, dispatch, refreshCart, addItem, updateQuantity, removeItem, clearCart, applyCoupon, removeCoupon }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
