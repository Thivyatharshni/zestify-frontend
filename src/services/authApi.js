import api from './api';

export const authApi = {
    sendOtp: async (phoneNumber) => {
        try {
            const response = await api.post('/auth/send-otp', { phoneNumber });
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || 'Failed to send OTP';
        }
    },

    verifyOtp: async (phoneNumber, otp) => {
        try {
            const response = await api.post('/auth/verify-otp', { phoneNumber, otp });
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
