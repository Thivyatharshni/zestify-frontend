export const authApi = {
    sendOtp: async (phoneNumber) => {
        try {
            const response = await api.post('/auth/send-otp', {
                phone: `+91 ${phoneNumber}`
            });
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || 'Failed to send OTP';
        }
    },

    verifyOtp: async (phoneNumber, otp) => {
        try {
            const response = await api.post('/auth/verify-otp', {
                phone: `+91 ${phoneNumber}`,
                otp
            });
            return response.data; // { user, token }
        } catch (error) {
            throw error.response?.data?.message || 'Invalid OTP';
        }
    },

    signup: async (userData) => {
        try {
            const response = await api.post('/auth/signup', {
                ...userData,
                phone: `+91 ${userData.phone}`
            });
            return response.data; // { user, token }
        } catch (error) {
            throw error.response?.data?.message || 'Signup failed';
        }
    },

    getProfile: async () => {
        const res = await api.get('/user/profile');
        return res.data;
    }
};

export default authApi;
