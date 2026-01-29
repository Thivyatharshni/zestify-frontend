import api from './api';

export const orderApi = {
    placeOrder: async ({ addressId, paymentMethod, couponCode, orderData }) => {
        try {
            const response = await api.post('/orders', {
                addressId,
                paymentMethod,
                couponCode
            });
            return response.data;
        } catch (error) {
            console.warn('Backend order placement failed, using local storage for demo');
            // For demo purposes, return the provided orderData if backend fails
            if (orderData) {
                // Store in localStorage
                const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
                existingOrders.unshift(orderData); // Add to beginning
                localStorage.setItem('orders', JSON.stringify(existingOrders));
                return orderData;
            }
            throw error;
        }
    },

    getOrders: async () => {
        try {
            const response = await api.get('/orders');
            return response.data;
        } catch (error) {
            console.warn('Backend fetch failed, using local storage');
            // Return local orders for demo
            const localOrders = JSON.parse(localStorage.getItem('orders') || '[]');
            return localOrders;
        }
    },

    getOrderById: async (orderId) => {
        try {
            const response = await api.get(`/orders/${orderId}`);
            // Store in localStorage for demo
            const localOrders = JSON.parse(localStorage.getItem('orders') || '[]');
            const existingIndex = localOrders.findIndex(o => o.id === orderId);
            if (existingIndex > -1) {
                localOrders[existingIndex] = response.data;
            } else {
                localOrders.unshift(response.data);
            }
            localStorage.setItem('orders', JSON.stringify(localOrders));
            return response.data;
        } catch (error) {
            console.warn('Backend fetch failed, checking local storage');
            // Check localStorage for demo
            const localOrders = JSON.parse(localStorage.getItem('orders') || '[]');
            const order = localOrders.find(o => o.id === orderId);
            if (order) {
                return order;
            }
            throw error;
        }
    },

    cancelOrder: async (orderId) => {
        try {
            // Handle mock orders for demo purposes
            if (orderId?.startsWith('MOCK-')) {
                // Simulate successful cancellation for demo
                localStorage.setItem(`cancelled-${orderId}`, 'true');
                return { success: true, message: 'Order cancelled successfully' };
            }

            const response = await api.patch(`/orders/${orderId}/cancel`);
            // Always set localStorage for demo, even if API succeeds
            localStorage.setItem(`cancelled-${orderId}`, 'true');
            return response.data;
        } catch (error) {
            console.warn('Backend cancel failed, marking locally for demo');
            // For demo, mark as cancelled locally even if API fails
            localStorage.setItem(`cancelled-${orderId}`, 'true');
            return { success: true, message: 'Order cancelled successfully (local demo)' };
        }
    }
};
