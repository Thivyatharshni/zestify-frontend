import api from './api';

export const orderApi = {
    placeOrder: async ({ addressId, paymentMethod, couponCode }) => {
        try {
            const response = await api.post('/orders', {
                addressId,
                paymentMethod,
                couponCode
            });
            return response.data;
        } catch (error) {
            console.error('Error placing order:', error);
            throw error;
        }
    },

    getOrders: async () => {
        try {
            const response = await api.get('/orders');
            return response.data;
        } catch (error) {
            console.error('Error fetching orders:', error);
            throw error;
        }
    },

    getOrderById: async (orderId) => {
        try {
            const response = await api.get(`/orders/${orderId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching order details:', error);
            throw error;
        }
    },

    cancelOrder: async (orderId) => {
        try {
            const response = await api.patch(`/orders/${orderId}/cancel`);
            return response.data;
        } catch (error) {
            console.error('Error cancelling order:', error);
            throw error;
        }
    }
};
