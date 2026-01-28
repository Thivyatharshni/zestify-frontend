import React from 'react';
import { Star, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatPrice } from '../../utils/formatPrice';

const RestaurantCard = ({ restaurant }) => {
    return (
        <Link to={`/restaurant/${restaurant.id}`} className="block group">
            <div className="relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 h-64">
                {/* Full Image Background */}
                <img
                    src={restaurant.image}
                    alt={restaurant.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />

                {/* Rating Badge - Top Right */}
                <div className="absolute top-3 right-3 flex items-center gap-1 bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-bold shrink-0">
                    <Star size={12} fill="currentColor" />
                    <span>{restaurant.rating}</span>
                </div>

                {/* Offers Badge - if present */}
                {restaurant.offers && (
                    <div className="absolute bottom-3 left-3 bg-gradient-to-r from-orange-600 to-orange-500 text-white px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider shadow-lg">
                        {restaurant.offers}
                    </div>
                )}

                {/* Bottom Text Overlay with Gradient */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent p-4">
                    <h3 className="font-bold text-white text-lg line-clamp-1 mb-1">
                        {restaurant.name}
                    </h3>
                    <p className="text-gray-200 text-sm mb-2 line-clamp-1 font-medium">
                        {restaurant.cuisines?.join(', ')}
                    </p>
                    <div className="flex items-center justify-between text-xs font-bold text-white uppercase tracking-widest">
                        <div className="flex items-center gap-1.5">
                            <Clock size={14} className="text-orange-300" />
                            <span>{restaurant.deliveryTime}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className="text-orange-300">200 for two</span>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default RestaurantCard;
