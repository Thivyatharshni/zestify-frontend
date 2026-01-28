import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ROUTES } from '../routes/RouteConstants';
import CartList from '../components/cart/CartList';
import PriceSummary from '../components/cart/PriceSummary';
import CouponInput from '../components/cart/CouponInput';
import AddressModal from '../components/cart/AddressModal';
import EmptyState from '../components/common/EmptyState';
import Button from '../components/common/Button';
import { restaurantApi } from '../services/restaurantApi';
import { addressApi } from '../services/addressApi';
import { USER } from '../mocks/user.mock';
import { MapPin, User as UserIcon, CreditCard, Loader2 } from 'lucide-react';

const Cart = () => {
    const { state: cartState } = useCart();
    const { user } = useAuth();
    const [restaurant, setRestaurant] = useState(null);
    const [addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCartDetails = async () => {
            setLoading(true);
            try {
                if (cartState.restaurantId) {
                    const rest = await restaurantApi.getRestaurantById(cartState.restaurantId);
                    setRestaurant(rest);
                }
                if (user) {
                    const userAddresses = await addressApi.getAddresses();
                    const finalAddresses = (userAddresses && userAddresses.length > 0)
                        ? userAddresses
                        : (USER.savedAddresses || []);
                    setAddresses(finalAddresses);
                    if (finalAddresses.length > 0) {
                        const defaultAddr = finalAddresses.find(a => a.isDefault) || finalAddresses[0];
                        setSelectedAddress(defaultAddr);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch cart details:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCartDetails();
    }, [cartState.restaurantId, user]);

    if (cartState.items.length === 0) {
        return (
            <div className="min-h-screen bg-white">
                <EmptyState
                    title="Your cart is empty"
                    description="You can go to home page to view more restaurants"
                    action={
                        <Link to={ROUTES.HOME}>
                            <Button variant="primary" className="uppercase font-bold tracking-wide">
                                See Restaurants Near You
                            </Button>
                        </Link>
                    }
                />
            </div>
        );
    }

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <Loader2 className="w-12 h-12 animate-spin text-orange-500" />
        </div>
    );

    return (
        <div className="min-h-screen bg-[#F9FAFB] py-8 md:py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8 items-start">

                {/* Left Section: Checkout Steps */}
                <div className="w-full lg:flex-1 space-y-6 relative">

                    {/* Progress Indicator - Subtle Line */}
                    <div className="absolute left-7 top-10 bottom-10 w-0.5 bg-gray-100 -z-0 hidden md:block" />

                    {/* Account Section - Profile Preview Style */}
                    <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 relative z-10 transition-shadow hover:shadow-md group">
                        <div className="flex justify-between items-center">
                            <div className="flex gap-4 items-center">
                                <div className="w-12 h-12 bg-slate-900 rounded-xl text-white flex items-center justify-center flex-shrink-0">
                                    <UserIcon size={20} />
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-slate-500 uppercase tracking-widest mb-1">Account</h3>
                                    {!user ? (
                                        <p className="text-slate-700 font-medium text-lg">Log in to place your order</p>
                                    ) : (
                                        <div className="flex flex-col">
                                            <span className="font-semibold text-slate-900 text-xl">{user.name}</span>
                                            <span className="text-slate-600 text-base font-medium">{user.phone}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                            {!user && (
                                <Link to={ROUTES.LOGIN}>
                                    <Button variant="outline" className="text-green-600 border-green-600 hover:bg-green-50 px-6 py-2 rounded-xl text-sm font-semibold transition-all">
                                        Log In
                                    </Button>
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* Delivery Address - Highlight Card */}
                    <div className="bg-orange-50/30 p-6 md:p-8 rounded-2xl shadow-sm border border-orange-100 relative z-10 transition-shadow hover:shadow-md group">
                        <div className="flex gap-4 items-start mb-6">
                            <div className="w-12 h-12 bg-white rounded-xl text-orange-500 border border-orange-100 shadow-sm flex items-center justify-center flex-shrink-0">
                                <MapPin size={20} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start">
                                    <h3 className="text-base font-bold text-orange-600 uppercase tracking-widest mt-1">Delivery Address</h3>
                                    <Button
                                        variant="ghost"
                                        className="text-orange-600 hover:bg-orange-100/50 p-2 -mr-2 rounded-lg flex items-center gap-2 text-base font-bold transition-all"
                                        onClick={() => setIsAddressModalOpen(true)}
                                    >
                                        <span className="hidden sm:inline">{addresses.length > 0 ? "Change" : "Add New"}</span>
                                        <span className="sm:hidden">{addresses.length > 0 ? "Edit" : "Add"}</span>
                                    </Button>
                                </div>

                                {selectedAddress ? (
                                    <div className="mt-5">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="w-2.5 h-2.5 bg-orange-500 rounded-full" />
                                            <p className="font-bold text-slate-900 text-sm uppercase tracking-wider">{selectedAddress.label || selectedAddress.type || 'Home'}</p>
                                        </div>
                                        <p className="text-slate-800 text-lg md:text-xl leading-relaxed font-semibold">
                                            {selectedAddress.address ||
                                                `${selectedAddress.street || ''}, ${selectedAddress.area || ''}, ${selectedAddress.city || ''} - ${selectedAddress.pincode || ''}`
                                            }
                                        </p>
                                    </div>
                                ) : (
                                    <p className="text-slate-600 text-lg font-medium mt-3">Select address to proceed with checkout</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <AddressModal
                        isOpen={isAddressModalOpen}
                        onClose={() => setIsAddressModalOpen(false)}
                        addresses={addresses} // Using state addresses which are merged
                        onSelect={setSelectedAddress}
                        onAddressAdded={(newAddr) => {
                            setAddresses(prev => [newAddr, ...prev]);
                            setSelectedAddress(newAddr);
                        }}
                    />

                    {/* Payment - Minimal Accordion Style */}
                    <div className={`bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 relative z-10 transition-all ${!selectedAddress ? 'opacity-50 grayscale' : 'hover:shadow-md cursor-pointer'}`}>
                        <div className="flex justify-between items-center">
                            <div className="flex gap-4 items-center">
                                <div className="w-12 h-12 bg-gray-50 rounded-xl text-slate-400 flex items-center justify-center flex-shrink-0">
                                    <CreditCard size={20} />
                                </div>
                                <div className="flex flex-col">
                                    <h3 className="text-base font-bold text-slate-500 uppercase tracking-widest">Payment</h3>
                                    <p className="text-slate-700 text-base font-semibold">Select method on next step</p>
                                </div>
                            </div>
                            {selectedAddress && (
                                <div className="text-slate-300">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            )}
                        </div>
                    </div>
                </div>


                {/* Right Section: Cart Summary */}
                <div className="w-full lg:w-[420px] xl:w-[480px] lg:sticky lg:top-8">
                    <div className="bg-white p-6 md:p-10 shadow-sm rounded-2xl border border-gray-100 relative transition-all">
                        {/* Restaurant Header - Reduced Height */}
                        {restaurant && (
                            <div className="flex items-center gap-4 mb-8 pb-8 border-b border-gray-50">
                                <div className="w-16 h-16 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0 border border-gray-100">
                                    <img src={restaurant.image} alt={restaurant.name} className="w-full h-full object-cover" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <h3 className="font-bold text-slate-900 text-2xl tracking-tight leading-tight truncate">{restaurant.name}</h3>
                                    <div className="flex items-center gap-2 mt-2">
                                        <MapPin size={14} className="text-slate-500" />
                                        <span className="text-sm text-slate-600 font-semibold truncate">
                                            {typeof restaurant.location === 'string'
                                                ? restaurant.location
                                                : (restaurant.area || restaurant.city || "Bangalore")}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="mb-8 max-h-[40vh] md:max-h-[50vh] overflow-y-auto pr-3 custom-scrollbar">
                            <CartList items={cartState.items} />
                        </div>

                        <div className="space-y-6">
                            <CouponInput />
                            <PriceSummary />
                        </div>

                        {user ? (
                            <Link to={ROUTES.CHECKOUT} state={{ addressId: selectedAddress?._id?.$oid || selectedAddress?._id || selectedAddress?.id }} className="block mt-8">
                                <div className="space-y-4">
                                    <Button
                                        variant="primary"
                                        fullWidth
                                        disabled={!selectedAddress}
                                        className="bg-green-600 hover:bg-green-700 py-5 text-xl font-bold uppercase tracking-widest rounded-full shadow-lg shadow-green-100 transition-all active:scale-[0.98] disabled:bg-slate-100 disabled:text-slate-400 disabled:shadow-none"
                                    >
                                        Proceed to Pay
                                    </Button>
                                    {!selectedAddress && (
                                        <p className="text-xs text-center text-red-500 font-bold uppercase tracking-[0.2em] animate-pulse">
                                            Select Delivery Address to Continue
                                        </p>
                                    )}
                                </div>
                            </Link>
                        ) : (
                            <Link to={ROUTES.LOGIN} className="block mt-8">
                                <Button variant="primary" fullWidth className="bg-slate-900 hover:bg-black py-4 text-base font-bold uppercase tracking-widest rounded-full transition-all active:scale-95">
                                    Login to Pay
                                </Button>
                            </Link>
                        )}
                    </div>

                    {/* Safety Badge */}
                    <div className="mt-8 flex items-center justify-center gap-4 text-slate-500 uppercase tracking-widest font-bold text-xs">
                        <CreditCard size={16} />
                        <span>100% Secure Checkout</span>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Cart;
