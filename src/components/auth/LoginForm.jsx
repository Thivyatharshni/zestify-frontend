import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ROUTES } from '../../routes/RouteConstants';
import { authApi } from '../../services/authApi';
import Button from '../common/Button';

const LoginForm = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [step, setStep] = useState('PHONE'); // PHONE | OTP
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSendOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await authApi.sendOtp(phoneNumber);
            setStep('OTP');
        } catch (err) {
            setError(err.message || 'Failed to send OTP');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const { user, token } = await authApi.verifyOtp(phoneNumber, otp);
            login(user, token);
            navigate(ROUTES.HOME);
        } catch (err) {
            setError(err.message || 'Invalid OTP');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-4">
            {error && (
                <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg">
                    {error}
                </div>
            )}

            {step === 'PHONE' ? (
                <form onSubmit={handleSendOtp} className="space-y-4">
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
                    <Button type="submit" variant="primary" className="w-full h-12 text-base bg-violet-600 hover:bg-violet-700" isLoading={loading}>
                        Get OTP
                    </Button>
                </form>
            ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-4 animate-in fade-in slide-in-from-right-4">
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <label className="text-sm font-medium text-gray-700">Enter OTP</label>
                            <button type="button" onClick={() => setStep('PHONE')} className="text-xs text-violet-600 hover:underline">Change Number</button>
                        </div>
                        <input
    type="text"
    required
    maxLength={6}
    inputMode="numeric"
    pattern="[0-9]*"
    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg
               focus:outline-none focus:ring-2 focus:ring-violet-500
               focus:border-transparent transition-all
               text-center tracking-[0.75em] text-lg font-bold"
    placeholder="••••••"
    value={otp}
    onChange={(e) => {
        if (/^\d*$/.test(e.target.value)) {
            setOtp(e.target.value);
        }
    }}
/>

                    </div>
                    <Button type="submit" variant="primary" className="w-full h-12 text-base bg-violet-600 hover:bg-violet-700" isLoading={loading}>
                        Verify & Login
                    </Button>
                </form>
            )}

            <div className="text-center text-sm text-gray-600 mt-6">
                Don't have an account? <a href={ROUTES.SIGNUP} className="text-violet-600 font-bold hover:underline">Sign up</a>
            </div>
        </div>
    );
};

export default LoginForm;
