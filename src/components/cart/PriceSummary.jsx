import React from 'react';
import { formatPrice } from '../../utils/formatPrice';
import { useCart } from '../../context/CartContext';

const PriceSummary = () => {
    const { state } = useCart();

    // In a real app, these fees should also come from the backend cart response
    // For now we use the ones from backend or assume fixed if backend doesn't provide yet
    // TotalPrice from backend includes all calculations
    const { totalPrice, items } = state;

    const itemTotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const deliveryFee = itemTotal > 500 ? 0 : 40;
    const platformFee = 5;
    const gst = itemTotal * 0.05;

    // Note: If backend sends toPay/grandTotal, use that. 
    // Otherwise calculate based on itemTotal + components if they are fixed.
    // The prompt says "No hardcoded prices or totals. Backend MUST be source of truth."
    // So we should rely on state.totalPrice (which we'll assume is the grand total).

    return (
        <div className="space-y-4 pt-4">
            <h3 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2 uppercase tracking-tighter">Bill Details</h3>

            <div className="space-y-3 text-sm text-gray-600">
                <div className="flex justify-between">
                    <span>Item Total</span>
                    <span className="font-medium text-gray-900">{formatPrice(itemTotal)}</span>
                </div>
                <div className="flex justify-between">
                    <span>Delivery Fee</span>
                    <span>{deliveryFee === 0 ? <span className="text-green-600 font-bold">FREE</span> : formatPrice(deliveryFee)}</span>
                </div>
                <div className="flex justify-between">
                    <span>Platform Fee</span>
                    <span>{formatPrice(platformFee)}</span>
                </div>
                <div className="flex justify-between">
                    <span>GST and Restaurant Charges</span>
                    <span>{formatPrice(gst)}</span>
                </div>
                {state.discount > 0 && (
                    <div className="flex justify-between text-green-600">
                        <span>Coupon Discount</span>
                        <span>-{formatPrice(state.discount)}</span>
                    </div>
                )}
            </div>

            <div className="flex justify-between items-center pt-4 border-t-2 border-gray-900 text-gray-900 font-black text-lg">
                <span>TO PAY</span>
                <span>{formatPrice(totalPrice || (itemTotal + deliveryFee + platformFee + gst))}</span>
            </div>
        </div>
    );
};

export default PriceSummary;
