import React from 'react';
import { useCart } from '../../context/CartContext';
import { formatPrice } from '../../utils/formatPrice';

const CartItem = ({ item }) => {
    const { updateQuantity, removeItem } = useCart();

    const handleUpdateQuantity = async (newQty) => {
        try {
            if (newQty === 0) {
                await removeItem(item.menuItem);
            } else {
                await updateQuantity(item.menuItem, newQty);
            }
        } catch (error) {
            console.error("Cart update failed:", error);
        }
    };

    const basePrice = item.price || 0;
    const addonsPrice = (item.addons || []).reduce((sum, a) => sum + (a.price || 0), 0);
    const unitPriceWithAddons = basePrice + addonsPrice;

    return (
        <div className="group py-4 px-2 mb-1 transition-all duration-300 border-b border-gray-50 last:border-0 hover:bg-slate-50 rounded-xl">
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-start gap-4 flex-1 min-w-0">
                    <div className={`mt-1.5 w-3 h-3 border flex items-center justify-center rounded-sm flex-shrink-0 ${item.isVeg ? 'border-green-600' : 'border-red-600'}`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${item.isVeg ? 'bg-green-600' : 'bg-red-600'}`} />
                    </div>
                    <div className="min-w-0">
                        <h4 className="text-base md:text-lg font-bold text-slate-900 truncate tracking-tight">{item.name}</h4>
                        <p className="text-xs md:text-sm text-slate-600 font-semibold mt-1">
                            {formatPrice(unitPriceWithAddons)} per unit
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-4 md:gap-8 flex-shrink-0">
                    <div className="flex items-center h-8 border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm transition-all hover:border-green-200">
                        <button
                            className="w-8 h-full flex items-center justify-center text-slate-400 hover:text-green-600 transition-colors font-semibold text-base"
                            onClick={() => handleUpdateQuantity(item.quantity - 1)}
                        >
                            -
                        </button>
                        <span className="w-8 h-full flex items-center justify-center text-slate-900 font-bold text-sm bg-slate-50/50">{item.quantity}</span>
                        <button
                            className="w-8 h-full flex items-center justify-center text-slate-900 hover:text-green-600 transition-colors font-semibold text-lg"
                            onClick={() => handleUpdateQuantity(item.quantity + 1)}
                        >
                            +
                        </button>
                    </div>
                    <div className="text-base font-bold text-slate-900 min-w-[80px] text-right">
                        {formatPrice(unitPriceWithAddons * item.quantity)}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartItem;
