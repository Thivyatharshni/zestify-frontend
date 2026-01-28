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

    return (
        <div className="flex flex-col py-4 border-b border-gray-100 last:border-0">
            <div className="flex items-center justify-between">
                <div className="flex items-start gap-3">
                    <div className={`mt-1 w-3 h-3 border flex items-center justify-center rounded-sm flex-shrink-0 ${item.isVeg ? 'border-green-600' : 'border-red-600'}`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${item.isVeg ? 'bg-green-600' : 'bg-red-600'}`} />
                    </div>
                    <div className="space-y-1">
                        <div className="text-sm font-bold text-gray-900 line-clamp-2">{item.name}</div>
                        <div className="text-xs text-gray-500">{formatPrice(item.price)}</div>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center h-8 border border-gray-200 rounded text-sm overflow-hidden bg-white shadow-sm">
                        <button
                            className="w-8 h-full flex items-center justify-center text-gray-500 hover:bg-gray-50 font-bold"
                            onClick={() => handleUpdateQuantity(item.quantity - 1)}
                        >
                            -
                        </button>
                        <span className="w-8 h-full flex items-center justify-center text-green-600 font-extrabold">{item.quantity}</span>
                        <button
                            className="w-8 h-full flex items-center justify-center text-green-600 hover:bg-gray-50 font-bold"
                            onClick={() => handleUpdateQuantity(item.quantity + 1)}
                        >
                            +
                        </button>
                    </div>
                    <div className="text-sm font-bold text-gray-900 w-20 text-right">
                        {formatPrice(item.price * item.quantity)}
                    </div>
                </div>
            </div>

            {/* Display Addons */}
            {item.addons && item.addons.length > 0 && (
                <div className="ml-7 mt-1">
                    <p className="text-[10px] text-gray-400 font-medium italic">
                        {item.addons.map(a => a.name).join(', ')}
                    </p>
                </div>
            )}
        </div>
    );
};

export default CartItem;
