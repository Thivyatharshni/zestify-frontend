import React, { useState, useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import { couponApi } from '../../services/couponApi';
import { TicketPercent, X } from 'lucide-react';

const CouponInput = () => {
    const { state, applyCoupon, removeCoupon } = useCart();
    const [coupons, setCoupons] = useState([]);
    const [couponCode, setCouponCode] = useState('');
    const [showInput, setShowInput] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchCoupons = async () => {
            try {
                if (!state.restaurantId) return;
                const applicableCoupons = await couponApi.getApplicableCoupons(
                    state.restaurantId
                );
                // Filter for active and unexpired coupons
                const activeCoupons = (applicableCoupons || []).filter(c => {
                    const isActive = c.isActive !== false;
                    const isNotExpired = !c.expiresAt || new Date(c.expiresAt) > new Date();
                    return isActive && isNotExpired;
                });
                setCoupons(activeCoupons);
            } catch (error) {
                console.error('Failed to fetch coupons:', error);
            }
        };
        fetchCoupons();
    }, [state.restaurantId]);

    const handleApplyCoupon = async () => {
        if (!couponCode.trim()) return;

        setLoading(true);
        setError('');

        try {
            const res = await couponApi.validateCoupon(
                couponCode.trim(),
                state.bill?.itemTotal || state.totalPrice
            );

            if (!res.valid) {
                setError(res.message || 'Invalid coupon');
                return;
            }

            // IMPORTANT: store backend-calculated discount
            applyCoupon({
                code: couponCode.trim(),
                discount: res.discount
            });

            setCouponCode('');
            setShowInput(false);
        } catch (error) {
            setError(
                error.response?.data?.message || 'Failed to apply coupon'
            );
        } finally {
            setLoading(false);
        }
    };

    const handleSelectCoupon = async (code) => {
        setCouponCode(code);
        setShowInput(true);
    };

    if (state.couponCode) {
        return (
            <div className="py-4 border-y border-gray-100 my-4 border-dashed">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <TicketPercent size={20} className="text-green-500" />
                        <div>
                            <span className="font-medium text-gray-900">
                                {state.couponCode}
                            </span>
                            {state.discount > 0 && (
                                <span className="text-green-600 ml-2">
                                    -₹{state.discount}
                                </span>
                            )}
                        </div>
                    </div>
                    <button
                        onClick={removeCoupon}
                        className="text-gray-400 hover:text-red-500"
                    >
                        <X size={16} />
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="py-4 border-y border-gray-100 my-4 border-dashed">
            {!showInput ? (
                <button
                    onClick={() => setShowInput(true)}
                    className="w-full flex items-center justify-between text-gray-700 hover:text-gray-900 font-medium group"
                >
                    <div className="flex items-center gap-3">
                        <TicketPercent size={20} className="text-gray-500 group-hover:text-gray-900" />
                        <span>Apply Coupon</span>
                    </div>
                    <span className="text-gray-400 group-hover:text-gray-600 text-xl">›</span>
                </button>
            ) : (
                <div className="space-y-3">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value)}
                            placeholder="Enter coupon code"
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        />
                        <button
                            onClick={handleApplyCoupon}
                            disabled={loading || !couponCode.trim()}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium disabled:opacity-50"
                        >
                            {loading ? 'Applying...' : 'Apply'}
                        </button>
                    </div>

                    {error && (
                        <p className="text-red-500 text-sm">{error}</p>
                    )}

                    {coupons.length > 0 && (
                        <div className="space-y-2">
                            <p className="text-sm text-gray-600">
                                Available offers:
                            </p>
                            {coupons.map((coupon) => (
                                <button
                                    key={coupon.code}
                                    onClick={() => handleSelectCoupon(coupon.code)}
                                    className="w-full text-left p-2 border border-dashed border-gray-300 rounded-lg hover:border-gray-400 text-sm"
                                >
                                    <div className="font-medium">
                                        {coupon.code}
                                    </div>
                                    <div className="text-gray-500 text-xs">
                                        {coupon.description}
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default CouponInput;
