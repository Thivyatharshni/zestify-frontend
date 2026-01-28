import React, { useEffect, useState } from 'react';
import RestaurantCard from './RestaurantCard';
import { restaurantApi } from '../../services/restaurantApi';
import { RESTAURANTS } from '../../mocks/restaurants.mock';

const RestaurantGrid = ({ activeFilters }) => {
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRestaurants = async () => {
            setLoading(true);
            try {
                // Map active filters to API params if necessary
                const params = {
                    filters: activeFilters.join(','),
                };
                const data = await restaurantApi.getRestaurants(params);
                if (data.restaurants && data.restaurants.length > 0) {
                    setRestaurants(data.restaurants);
                } else {
                    setRestaurants(RESTAURANTS);
                }
            } catch (error) {
                console.error("Failed to fetch restaurants:", error);
                setRestaurants(RESTAURANTS);
            } finally {
                setLoading(false);
            }
        };
        fetchRestaurants();
    }, [activeFilters]);

    if (loading) return <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 py-8">
        {[...Array(8)].map((_, i) => (
            <div key={i} className="h-64 bg-gray-100 animate-pulse rounded-xl"></div>
        ))}
    </div>;

    return (
        <div className="py-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6 px-4 sm:px-0">All Restaurants</h2>

            {restaurants.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-4 sm:px-0">
                    {restaurants.map((restaurant) => (
                        <RestaurantCard key={restaurant.id} restaurant={restaurant} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 text-gray-500">
                    No restaurants found matching your criteria.
                </div>
            )}
        </div>
    );
};

export default RestaurantGrid;
