import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ROUTES } from '../../routes/RouteConstants';
import Button from '../common/Button';

const SignupForm = () => {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('');
    const [referralCode, setReferralCode] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        // Call API to register
        setTimeout(async () => {
            try {
                const { authApi } = await import('../../services/authApi');
                const newUser = await authApi.signup({ name, email, phone: phoneNumber, referralCode });

                login(newUser);
                setLoading(false);
                navigate(ROUTES.HOME);
            } catch (error) {
                console.error(error);
                setLoading(false);
                alert("Signup failed. Please try again.");
            }
        }, 1000);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Phone Number</label>
                <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-200 bg-gray-50 text-gray-500 text-sm">
                        +91
                    </span>
                    <input
                        type="tel"
                        required
                        pattern="[0-9]{10}"
                        maxLength={10}
                        className="flex-1 w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                        placeholder="9876543210"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Full Name</label>
                <input
                    type="text"
                    required
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Email Address</label>
                <input
                    type="email"
                    required
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Referral Code (Optional)</label>
                <input
                    type="text"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all uppercase placeholder:normal-case"
                    placeholder="ABCD12"
                    value={referralCode}
                    onChange={(e) => setReferralCode(e.target.value)}
                />
            </div>

            <Button type="submit" variant="primary" className="w-full h-12 text-base bg-violet-600 hover:bg-violet-700" isLoading={loading}>
                Create Account
            </Button>

            <div className="text-center text-sm text-gray-600 mt-6">
                Already have an account? <a href={ROUTES.LOGIN} className="text-violet-600 font-bold hover:underline">Log in</a>
            </div>
        </form>
    );
};

export default SignupForm;
