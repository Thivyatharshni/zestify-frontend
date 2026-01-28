import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ROUTES } from '../routes/RouteConstants';
import Button from '../components/common/Button';
import { orderApi } from '../services/orderApi';
import { CreditCard, CheckCircle, AlertCircle } from 'lucide-react';

const Checkout = () => {
    const { state, clearCart } = useCart();
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState(null);

    if (state.items.length === 0 && !isProcessing) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white px-4">
                <div className="text-center">
                    <AlertCircle size={48} className="mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500 font-bold">Your cart is empty.</p>
                    <Button
                        variant="primary"
                        className="mt-4"
                        onClick={() => navigate(ROUTES.HOME)}
                    >
                        Go Shopping
                    </Button>
                </div>
            </div>
        );
    }

    const handlePayment = async () => {
        setIsProcessing(true);
        setError(null);
        try {
            // TODO: Get addressId from selected address in Cart or Checkout state
            // TODO: Get paymentMethod from user selection (COD or ONLINE)
            const addressId = 'selected_address_id'; // Replace with actual selected address ID
            const paymentMethod = 'COD'; // or 'ONLINE' based on selection

            const orderData = {
                addressId,
                paymentMethod,
                couponCode: state.couponCode || undefined
            };

            await orderApi.placeOrder(orderData);
            await clearCart();
            setIsProcessing(false);
            navigate(ROUTES.ORDERS);
        } catch (error) {
            console.error("Order placement failed:", error);
            setError("Failed to place order. Please try again.");
            setIsProcessing(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <div className="bg-white p-8 rounded-3xl shadow-2xl text-center max-w-md w-full border border-gray-100">
                <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8 text-green-600">
                    <CreditCard size={36} />
                </div>
                <h2 className="text-3xl font-black text-gray-900 mb-4 tracking-tighter">Secure Checkout</h2>
                <p className="text-gray-500 mb-10 leading-relaxed font-medium">
                    You are about to authorize a payment of <span className="text-gray-900 font-black">{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(state.totalPrice)}</span> for your delicious meal.
                </p>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm font-bold animate-shake">
                        {error}
                    </div>
                )}

                <Button
                    variant="primary"
                    fullWidth
                    className="py-5 bg-gray-900 hover:bg-black text-white text-lg font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-gray-200 transition-all hover:scale-[1.02] active:scale-[0.98]"
                    onClick={handlePayment}
                    isLoading={isProcessing}
                >
                    {isProcessing ? 'Processing Securely...' : 'Pay & Place Order'}
                </Button>

                <p className="mt-6 text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em]">
                    Encrypted & Secure Payment
                </p>
            </div>
        </div>
    );
};

export default Checkout;
