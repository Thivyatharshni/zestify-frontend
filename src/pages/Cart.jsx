import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ROUTES } from '../routes/RouteConstants';
import CartList from '../components/cart/CartList';
import PriceSummary from '../components/cart/PriceSummary';
import CouponInput from '../components/cart/CouponInput';
import EmptyState from '../components/common/EmptyState';
import Button from '../components/common/Button';
import { restaurantApi } from '../services/restaurantApi';
import { addressApi } from '../services/addressApi';
import { MapPin, User as UserIcon, CreditCard, Loader2 } from 'lucide-react';

const Cart = () => {
    const { state: cartState } = useCart();
    const { user } = useAuth();
    const [restaurant, setRestaurant] = useState(null);
    const [addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);
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
                    setAddresses(userAddresses);
                    if (userAddresses.length > 0) {
                        setSelectedAddress(userAddresses[0]);
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
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">

                {/* Left Section: Account & Address */}
                <div className="flex-1 space-y-6">

                    {/* Account Section */}
                    <div className="bg-white p-6 shadow-sm rounded-xl">
                        <div className="flex justify-between items-start mb-6">
                            <div className="flex gap-4">
                                <div className="p-3 bg-gray-900 rounded-lg text-white">
                                    <UserIcon size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 text-lg">Account</h3>
                                    {!user ? (
                                        <p className="text-gray-500 text-sm mt-1">To place your order now, log in to your account</p>
                                    ) : (
                                        <>
                                            <p className="font-bold text-gray-900 mt-1">{user.name}</p>
                                            <p className="text-gray-500 text-sm">{user.phone}</p>
                                        </>
                                    )}
                                </div>
                            </div>
                            {!user && (
                                <Link to={ROUTES.LOGIN}>
                                    <Button variant="outline" className="text-green-600 border-green-600 hover:bg-green-50 uppercase text-xs font-bold">
                                        Log In
                                    </Button>
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* Address Section */}
                    <div className="bg-white p-6 shadow-sm rounded-xl">
                        <div className="flex gap-4 mb-6">
                            <div className="p-3 bg-gray-900 rounded-lg text-white">
                                <MapPin size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 text-lg">Delivery Address</h3>
                                {selectedAddress ? (
                                    <div className="mt-2 p-4 border-2 border-orange-500 bg-orange-50/30 rounded-xl">
                                        <p className="font-bold text-gray-900">{selectedAddress.type || 'Home'}</p>
                                        <p className="text-gray-500 text-sm">{selectedAddress.address}</p>
                                    </div>
                                ) : (
                                    <p className="text-gray-500 text-sm mt-1">Select a delivery address</p>
                                )}
                            </div>
                        </div>
                        <Button variant="ghost" className="text-violet-600 uppercase text-xs font-bold ml-14">
                            {addresses.length > 0 ? "Change / Add Address" : "Add Address"}
                        </Button>
                    </div>

                    {/* Payment Section */}
                    <div className="bg-white p-6 shadow-sm rounded-xl opacity-50">
                        <div className="flex gap-4">
                            <div className="p-3 bg-gray-400 rounded-lg text-white">
                                <CreditCard size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 text-lg">Payment</h3>
                                <p className="text-gray-500 text-sm mt-1">Select Method on Checkout</p>
                            </div>
                        </div>
                    </div>
                </div>


                {/* Right Section: Cart Summary */}
                <div className="w-full lg:w-[450px]">
                    <div className="bg-white p-6 shadow-sm sticky top-24 rounded-xl">
                        {restaurant && (
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                    <img src={restaurant.image} alt={restaurant.name} className="w-full h-full object-cover" />
                                </div>
                                <div className="overflow-hidden">
                                    <h3 className="font-black text-gray-900 text-xl leading-tight truncate">{restaurant.name}</h3>
                                    <div className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1 truncate">{restaurant.location}</div>
                                </div>
                            </div>
                        )}

                        <div className="mb-4">
                            <CartList items={cartState.items} />
                        </div>

                        <CouponInput />

                        <PriceSummary />

                        {user ? (
                            <Link to={ROUTES.CHECKOUT}>
                                <Button
                                    variant="primary"
                                    fullWidth
                                    disabled={!selectedAddress}
                                    className="mt-8 bg-green-600 hover:bg-green-700 py-5 text-lg font-black uppercase tracking-widest shadow-xl shadow-green-200"
                                >
                                    Proceed to Pay
                                </Button>
                            </Link>
                        ) : (
                            <Link to={ROUTES.LOGIN}>
                                <Button variant="primary" fullWidth className="mt-8 bg-green-600 hover:bg-green-700 py-5 text-lg font-black uppercase tracking-widest">
                                    Login to Pay
                                </Button>
                            </Link>
                        )}
                        {!selectedAddress && user && (
                            <p className="text-center text-red-500 text-xs font-bold mt-3">Please select a delivery address to continue</p>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Cart;
