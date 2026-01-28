import api from './api';

export const restaurantApi = {
    getCategories: async () => {
        try {
            const response = await api.get('/categories');
            return response.data;
        } catch (error) {
            console.error('Error fetching categories:', error);
            return [];
        }
    },

    getRestaurants: async (params = {}) => {
        try {
            const response = await api.get('/restaurants', { params });
            return response.data; // { restaurants, total, page, limit }
        } catch (error) {
            console.error('Error fetching restaurants:', error);
            return { restaurants: [], total: 0 };
        }
    },

    getNearbyRestaurants: async (lat, lng) => {
        try {
            const response = await api.get('/restaurants/nearby', { params: { lat, lng } });
            return response.data;
        } catch (error) {
            console.error('Error fetching nearby restaurants:', error);
            return [];
        }
    },

    getRestaurantById: async (id) => {
        try {
            const response = await api.get(`/restaurants/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching restaurant ${id}:`, error);
            throw error;
        }
    },

    getMenu: async (restaurantId, query = '') => {
        try {
            const endpoint = query
                ? `/menu/${restaurantId}/search?q=${query}`
                : `/menu/${restaurantId}`;
            const response = await api.get(endpoint);
            return response.data; // FLAT list
        } catch (error) {
            console.error(`Error fetching menu for ${restaurantId}:`, error);
            return [];
        }
    },



    searchRestaurants: async (query) => {
        try {
            const response = await api.get('/restaurants/search', { params: { q: query } });
            return response.data; // Array of restaurants
        } catch (error) {
            console.error('Error searching restaurants:', error);
            return [];
        }
    },

    getAddons: async (menuItemId) => {
        try {
            const response = await api.get(`/addons/${menuItemId}`);
            return response.data; // { required: [...], optional: [...] }
        } catch (error) {
            console.error('Error fetching addons:', error);
            return { required: [], optional: [] };
        }
    },
};
