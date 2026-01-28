import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { restaurantApi } from '../services/restaurantApi';
import RestaurantCard from '../components/home/RestaurantCard';
import { RESTAURANTS } from '../mocks/restaurants.mock';
import { Loader2 } from 'lucide-react';

/**
 * CategoryPage
 * Route: /category/:categorySlug
 *
 * Backend-ready:
 * GET /api/restaurants?cuisine=North Indian
 */

const CategoryPage = () => {
    const { categorySlug } = useParams();

    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Convert slug → readable name
    const categoryName = categorySlug
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

    useEffect(() => {
        const fetchRestaurantsByCategory = async () => {
            setLoading(true);
            setError(null);

            try {
                const data = await restaurantApi.getRestaurants({
                    cuisine: categoryName
                });

                if (data?.restaurants?.length > 0) {
                    setRestaurants(data.restaurants);
                } else {
                    const filteredMock = RESTAURANTS.filter(rest =>
                        rest.cuisines?.includes(categoryName)
                    );
                    setRestaurants(filteredMock);
                }
            } catch (err) {
                console.error('Failed to fetch category restaurants:', err);

                const filteredMock = RESTAURANTS.filter(rest =>
                    rest.cuisines?.includes(categoryName)
                );
                setRestaurants(filteredMock);

                if (filteredMock.length === 0) {
                    setError('No restaurants found for this category');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchRestaurantsByCategory();
    }, [categoryName]);

    if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center bg-gray-50">
                <Loader2 className="w-10 h-10 animate-spin text-orange-500" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">
                        {categoryName}
                    </h1>
                    <p className="text-gray-500 mt-1">
                        Restaurants serving {categoryName} cuisine
                    </p>
                </div>

                {error && restaurants.length === 0 && (
                    <div className="text-center py-16 text-gray-500 font-medium">
                        {error}
                    </div>
                )}

                {restaurants.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {restaurants.map((restaurant) => (
                            <RestaurantCard
                                key={restaurant.id}
                                restaurant={restaurant}
                            />
                        ))}
                    </div>
                ) : (
                    !error && (
                        <div className="text-center py-16 text-gray-500 font-medium">
                            No restaurants available in this category
                        </div>
                    )
                )}
            </div>
        </div>
    );
};

export default CategoryPage;