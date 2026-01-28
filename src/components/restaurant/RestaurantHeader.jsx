import React from 'react';
import { Star, Clock, MapPin, Search } from 'lucide-react';

const RestaurantHeader = ({ restaurant }) => {
    if (!restaurant) return null;

    return (
        <div
            className="relative pt-12 pb-20 px-4 sm:px-6 lg:px-8 bg-cover bg-center"
            style={{ backgroundImage: `url(${restaurant.image || '/src/assets/images/restaurant-hero-light.png'})` }}
        >
            {/* White/Light Overlay */}
            <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px]"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-white via-white/50 to-transparent"></div>

            <div className="relative z-10 max-w-4xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                    <div className="space-y-3">
                        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">{restaurant.name}</h1>
                        <p className="text-gray-700 text-base font-medium">
                            {Array.isArray(restaurant.cuisines) ? restaurant.cuisines.join(", ") : (restaurant.cuisines || "")}
                        </p>
                        <div className="flex items-center gap-6 text-sm text-gray-600 font-semibold">
                            <div className="flex items-center gap-2 bg-white/60 px-4 py-1.5 rounded-full backdrop-blur-md border border-white shadow-sm">
                                <MapPin size={16} className="text-orange-500" />
                                {typeof restaurant.location === 'string' ? restaurant.location : (restaurant.area || restaurant.city || "Bangalore")}
                            </div>
                            <div className="flex items-center gap-2 bg-white/60 px-4 py-1.5 rounded-full backdrop-blur-md border border-white shadow-sm">
                                <Clock size={16} className="text-orange-500" />
                                {restaurant.deliveryTime}
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col items-center bg-white/60 rounded-2xl p-4 backdrop-blur-xl border border-white shadow-lg min-w-[100px]">
                        <div className={`text-2xl font-black flex items-center gap-2 ${restaurant.rating >= 4 ? 'text-green-600' : 'text-orange-500'}`}>
                            <Star size={24} fill="currentColor" />
                            <span>{restaurant.rating}</span>
                        </div>
                        <div className="h-[1px] w-full bg-gray-300 my-2" />
                        <div className="text-[10px] font-bold tracking-widest uppercase text-gray-500">
                            1K+ ratings
                        </div>
                    </div>
                </div>

                {restaurant.offers && (
                    <div className="mt-10 inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-linear-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg shadow-violet-200 border border-white/50 text-sm font-bold uppercase tracking-wider transform hover:-translate-y-0.5 transition-transform bg-gray-900 text-white">
                        <span className="bg-white text-gray-900 rounded-full p-0.5 w-5 h-5 flex items-center justify-center text-xs">%</span>
                        {restaurant.offers}
                    </div>
                )}
            </div>
        </div>
    );
};

export default RestaurantHeader;
