import api from './api';

export const cartApi = {
    getCart: async () => {
        try {
            const response = await api.get('/cart');
            return response.data;
        } catch (error) {
            console.error('Error fetching cart:', error);
            throw error;
        }
    },

    addToCart: async (restaurantId, menuItemId, quantity, addons = []) => {
        try {
            const response = await api.post('/cart/add', {
                restaurantId,
                menuItemId,
                quantity,
                addons
            });
            return response.data;
        } catch (error) {
            console.error('Error adding item to cart:', error);
            throw error;
        }
    },

    updateCartItem: async (menuItemId, quantity) => {
        try {
            const response = await api.patch('/cart/update', {
                menuItemId,
                quantity
            });
            return response.data;
        } catch (error) {
            console.error('Error updating cart item:', error);
            throw error;
        }
    },

    removeFromCart: async (menuItemId) => {
        try {
            const response = await api.delete(`/cart/remove/${menuItemId}`);
            return response.data;
        } catch (error) {
            console.error('Error removing cart item:', error);
            throw error;
        }
    },

    clearCart: async () => {
        try {
            const response = await api.delete('/cart/clear');
            return response.data;
        } catch (error) {
            console.error('Error clearing cart:', error);
            throw error;
        }
    }
};
