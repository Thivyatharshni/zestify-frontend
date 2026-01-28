import api from './api';

export const authApi = {
    sendOtp: async (phone) => {
        try {
            const response = await api.post('/auth/send-otp', { phone });
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || 'Failed to send OTP';
        }
    },

    verifyOtp: async (phone, otp) => {
        try {
            const response = await api.post('/auth/verify-otp', { phone, otp });
            return response.data; // { user, token }
        } catch (error) {
            throw error.response?.data?.message || 'Invalid OTP';
        }
    },

    getProfile: async () => {
        try {
            const response = await api.get('/user/profile');
            return response.data;
        } catch (error) {
            console.error('Error fetching profile:', error);
            throw error;
        }
    },

    logout: () => {
        // We can add a logout endpoint if needed
    }
};
export default authApi;
