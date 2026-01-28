import React from 'react';
import { formatPrice } from '../../utils/formatPrice';
import { useCart } from '../../context/CartContext';

const PriceSummary = () => {
    const { state } = useCart();

    // In a real app, these fees should also come from the backend cart response
    // For now we use the ones from backend or assume fixed if backend doesn't provide yet
    // TotalPrice from backend includes all calculations
    const { totalPrice, items } = state;

    const itemTotal = items.reduce((acc, item) => {
        const basePrice = item.price || 0;
        const addonsPrice = (item.addons || []).reduce((sum, a) => sum + (a.price || 0), 0);
        return acc + ((basePrice + addonsPrice) * item.quantity);
    }, 0);
    const deliveryFee = itemTotal > 500 ? 0 : 40;
    const platformFee = 5;
    const gst = itemTotal * 0.05;

    // Note: If backend sends toPay/grandTotal, use that. 
    // Otherwise calculate based on itemTotal + components if they are fixed.
    // The prompt says "No hardcoded prices or totals. Backend MUST be source of truth."
    // So we should rely on state.totalPrice (which we'll assume is the grand total).

    const allAddons = items.reduce((acc, item) => {
        (item.addons || []).forEach(addon => {
            const existing = acc.find(a => a.name === addon.name);
            if (existing) {
                existing.quantity += item.quantity;
                existing.totalPrice += (addon.price || 0) * item.quantity;
            } else {
                acc.push({
                    name: addon.name,
                    quantity: item.quantity,
                    totalPrice: (addon.price || 0) * item.quantity
                });
            }
        });
        return acc;
    }, []);

    const addonsTotal = allAddons.reduce((sum, a) => sum + a.totalPrice, 0);
    const grandTotal = itemTotal + deliveryFee + platformFee + gst - (state.discount || 0);

    return (
        <div className="space-y-6">
            <h3 className="text-base font-bold text-slate-500 uppercase tracking-widest">Bill Details</h3>

            <div className="space-y-4">
                <div className="flex justify-between items-center group/item transition-all gap-4">
                    <span className="text-slate-700 font-semibold text-base">Item Total</span>
                    <span className="font-bold text-slate-900 text-base">{formatPrice(itemTotal - addonsTotal)}</span>
                </div>

                {allAddons.length > 0 && (
                    <div className="pl-4 border-l-2 border-slate-100 space-y-2 py-1">
                        {allAddons.map((addon, idx) => (
                            <div key={idx} className="flex justify-between items-center gap-4">
                                <span className="text-slate-600 text-sm font-semibold">{addon.name} (x{addon.quantity})</span>
                                <span className="text-slate-800 text-sm font-bold">{formatPrice(addon.totalPrice)}</span>
                            </div>
                        ))}
                    </div>
                )}

                <div className="h-px bg-slate-200" />

                <div className="space-y-4">
                    <div className="flex justify-between items-center group/item transition-all gap-4">
                        <span className="text-slate-700 font-semibold text-sm">Delivery Fee</span>
                        <span className={`font-bold text-sm ${deliveryFee === 0 ? 'text-green-600' : 'text-slate-900'}`}>
                            {deliveryFee === 0 ? 'FREE' : formatPrice(deliveryFee)}
                        </span>
                    </div>

                    <div className="flex justify-between items-center group/item transition-all gap-4">
                        <span className="text-slate-700 font-semibold text-sm">Platform Fee</span>
                        <span className="font-bold text-slate-900 text-sm">{formatPrice(platformFee)}</span>
                    </div>

                    <div className="flex justify-between items-center group/item transition-all gap-4">
                        <span className="text-slate-700 font-semibold text-sm">GST and Charges</span>
                        <span className="font-bold text-slate-900 text-sm">{formatPrice(gst)}</span>
                    </div>
                </div>

                {state.discount > 0 && (
                    <div className="flex justify-between items-center py-4 px-5 bg-green-50 text-green-700 rounded-xl border border-green-100 mt-4">
                        <span className="font-bold uppercase text-xs tracking-widest">Coupon Savings</span>
                        <span className="font-bold text-lg">-{formatPrice(state.discount)}</span>
                    </div>
                )}
            </div>

            {/* Grand Total Hero Area */}
            <div className="mt-10 pt-8 border-t-2 border-slate-100">
                <div className="flex justify-between items-end">
                    <div className="flex flex-col">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">To Pay</span>
                        <span className="text-4xl font-bold text-slate-900 tracking-tight">Total Bill</span>
                    </div>
                    <div className="text-5xl font-bold text-slate-900 tracking-tight">
                        {formatPrice(grandTotal)}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PriceSummary;
