import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { formatPrice } from '../../utils/formatPrice';
import { ROUTES } from '../../routes/RouteConstants';
import Button from '../common/Button';
import AddonsModal from './AddonsModal';
import { Loader2 } from 'lucide-react';

const FoodItemCard = ({ item, restaurantId }) => {
    const { state, addItem, updateQuantity, removeItem } = useCart();
    const navigate = useNavigate();
    const location = useLocation();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [adding, setAdding] = useState(false);

    // Find if item is in cart (any variation)
    const cartItems = state.items.filter(i => i.id === item.id);
    const totalQuantity = cartItems.reduce((acc, curr) => acc + curr.quantity, 0);

    const handleAddClick = () => {
        // Check authentication before allowing add to cart
        const token = localStorage.getItem('token');
        if (!token) {
            // Redirect to login with return URL
            navigate(ROUTES.LOGIN, { state: { returnUrl: location.pathname } });
            return;
        }

        // If item has addons (check item from backend or if there are any available for it)
        // For simplicity, let's assume we always try to open the modal if the backend says so
        // OR if the item is already in cart but someone wants another variation
        setIsModalOpen(true);
    };

    const handleAddWithAddons = async (selectedAddons) => {
        setAdding(true);
        try {
            await addItem(restaurantId, item.id, 1, selectedAddons);
            navigate(ROUTES.CART);
        } catch (error) {
            alert("Failed to add item to cart");
        } finally {
            setAdding(false);
        }
    };

    const handleIncrement = async () => {
        if (cartItems.length === 1) {
            setAdding(true);
            try {
                await updateQuantity(cartItems[0].menuItem, cartItems[0].quantity + 1);
                navigate(ROUTES.CART);
            } catch (error) {
                alert("Failed to update quantity");
            } finally {
                setAdding(false);
            }
        } else {
            // If there are multiple variations, we should ideally ask which one to increment
            // or show a toast saying "Customize again". For now, let's open modal.
            setIsModalOpen(true);
        }
    };

    const handleDecrement = async () => {
        if (cartItems.length === 1) {
            setAdding(true);
            try {
                const newQty = cartItems[0].quantity - 1;
                if (newQty > 0) {
                    await updateQuantity(cartItems[0].menuItem, newQty);
                } else {
                    await removeItem(cartItems[0].menuItem);
                }
            } catch (error) {
                alert("Failed to update quantity");
            } finally {
                setAdding(false);
            }
        } else {
            // Multiple variations - we don't know which one to remove easily from this view
            // In a better UX, we'd show a "View Cart Variations" or just remove the last one
            alert("Please manage multiple variations in the cart");
        }
    };

    return (
        <div className="flex justify-between items-start py-6 border-b border-gray-100 last:border-0 hover:bg-gray-50/50 transition-colors p-2 rounded-lg -mx-2">
            <div className="space-y-1 pr-4">
                <div className={`w-4 h-4 border border-2 flex items-center justify-center rounded-sm ${item.isVeg ? 'border-green-600' : 'border-red-600'}`}>
                    <div className={`w-2 h-2 rounded-full ${item.isVeg ? 'bg-green-600' : 'bg-red-600'}`} />
                </div>
                <h3 className="font-bold text-gray-900 text-base">{item.name}</h3>
                <div className="font-medium text-gray-700 text-sm">{formatPrice(item.price)}</div>
                <p className="text-gray-500 text-xs mt-2 line-clamp-2 leading-relaxed">
                    {item.description}
                </p>
            </div>

            <div className="relative flex-shrink-0">
                <div className="w-28 h-24 rounded-xl overflow-hidden bg-gray-100">
                    <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            e.target.onerror = null;
                            const category = item.category || 'default';
                            const fallbackMap = {
                                'Biryani': 'https://images.unsplash.com/photo-1563379091339-03b21bc4a4f8?q=80&w=800&auto=format&fit=crop',
                                'Pizza': 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=800&auto=format&fit=crop',
                                'Burger': 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=800&auto=format&fit=crop',
                                'North Indian': 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?q=80&w=800&auto=format&fit=crop',
                                'South Indian': 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?q=80&w=800&auto=format&fit=crop',
                                'Chinese': 'https://images.unsplash.com/photo-1525755662778-989d052408ec?q=80&w=800&auto=format&fit=crop',
                                'Desserts': 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?q=80&w=800&auto=format&fit=crop'
                            };
                            e.target.src = fallbackMap[category] || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800&auto=format&fit=crop';
                        }}
                    />
                </div>

                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 shadow-lg rounded-lg bg-white min-w-[100px]">
                    {adding ? (
                        <div className="flex justify-center items-center h-9">
                            <Loader2 className="animate-spin text-blue-600 h-5 w-5" />
                        </div>
                    ) : totalQuantity > 0 ? (
                        <div className="flex items-center h-9 border border-gray-200 rounded-lg overflow-hidden">
                            <button onClick={handleDecrement} className="w-8 h-full flex items-center justify-center text-gray-600 hover:bg-gray-100 font-bold">-</button>
                            <span className="w-8 h-full flex items-center justify-center text-blue-600 font-bold text-sm bg-white">{totalQuantity}</span>
                            <button onClick={handleIncrement} className="w-8 h-full flex items-center justify-center text-blue-600 hover:bg-gray-100 font-bold">+</button>
                        </div>
                    ) : (
                        <Button
                            variant="primary"
                            size="sm"
                            disabled={item.isAvailable === false}
                            className={`bg-white text-blue-600 border border-gray-200 hover:bg-gray-50 h-9 w-full px-6 font-bold shadow-sm uppercase text-xs ${item.isAvailable === false ? 'text-gray-400 border-gray-100 cursor-not-allowed' : ''}`}
                            onClick={handleAddClick}
                        >
                            {item.isAvailable === false ? 'Sold Out' : 'Add'}
                        </Button>
                    )}
                </div>
            </div>

            <AddonsModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                menuItem={item}
                onAdd={handleAddWithAddons}
            />
        </div>
    );
};

export default FoodItemCard;
