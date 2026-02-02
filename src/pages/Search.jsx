import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Search as SearchIcon, Loader2 } from 'lucide-react';
import RestaurantCard from '../components/home/RestaurantCard';
import FoodItemCard from '../components/restaurant/FoodItemCard';
import { restaurantApi } from '../services/restaurantApi';
import { ROUTES } from '../routes/RouteConstants';
import { RESTAURANTS } from '../mocks/restaurants.mock';
import { MENU_ITEMS } from '../mocks/menu.mock';

const Search = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState([]);
    const [dishResults, setDishResults] = useState([]);
    const [loading, setLoading] = useState(false);

    // Initialize search term from URL
    useEffect(() => {
        const query = new URLSearchParams(location.search).get('q') || '';
        setSearchTerm(query);
    }, [location.search]);

    const performSearch = useCallback(async (query) => {
        if (!query.trim()) {
            setResults([]);
            setDishResults([]);
            setLoading(false);
            return;
        }
        setLoading(true);
        try {
            let backendRestaurants = [];
            const data = await restaurantApi.searchRestaurants(query);
            backendRestaurants = Array.isArray(data) ? data : (data?.restaurants || []);

            const lowerQuery = query.toLowerCase();

            // Search mocks for restaurants
            const mockMatches = RESTAURANTS.filter(r =>
                r.name.toLowerCase().includes(lowerQuery) ||
                (Array.isArray(r.cuisines) && r.cuisines.some(c => c.toLowerCase().includes(lowerQuery)))
            );

            // Merge and unique by name
            const merged = [...backendRestaurants];
            mockMatches.forEach(m => {
                if (!merged.find(r => r.name.toLowerCase() === m.name.toLowerCase())) {
                    merged.push(m);
                }
            });

            setResults(merged);

            // Search dishes in mocks
            const dishMatches = MENU_ITEMS.filter(item =>
                item.name.toLowerCase().includes(lowerQuery) ||
                item.category.toLowerCase().includes(lowerQuery) ||
                (item.description && item.description.toLowerCase().includes(lowerQuery))
            );
            setDishResults(dishMatches);
        } catch (error) {
            console.error("Search failed:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    // Debounced search
    useEffect(() => {
        const query = new URLSearchParams(location.search).get('q') || '';
        const timer = setTimeout(() => {
            performSearch(query);
        }, 500);

        return () => clearTimeout(timer);
    }, [location.search, performSearch]);

    const handleSearchInput = (e) => {
        const val = e.target.value;
        setSearchTerm(val);
        // Update URL to trigger the search effect
        const params = new URLSearchParams(location.search);
        if (val.trim()) {
            params.set('q', val);
        } else {
            params.delete('q');
        }
        navigate({ search: params.toString() }, { replace: true });
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            performSearch(searchTerm);
        }
    };

    const query = new URLSearchParams(location.search).get('q') || '';

    return (
        <div className="min-h-screen bg-white">
            <div className="sticky top-[80px] z-30 bg-white px-4 sm:px-6 lg:px-8 py-4 border-b border-gray-100">
                <div className="max-w-4xl mx-auto relative">
                    <input
                        type="text"
                        placeholder="Search for restaurants and food..."
                        value={searchTerm}
                        onChange={handleSearchInput}
                        onKeyDown={handleKeyDown}
                        autoFocus
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all text-lg"
                    />
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                        {loading ? <Loader2 size={24} className="animate-spin text-blue-600" /> : <SearchIcon size={24} />}
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {query && !loading && (
                    <h2 className="text-xl font-bold text-gray-900 mb-6">
                        Results for "{query}"
                        <span className="ml-2 text-sm font-normal text-gray-500">({results.length})</span>
                    </h2>
                )}

                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="h-64 bg-gray-50 animate-pulse rounded-xl"></div>
                        ))}
                    </div>
                ) : (results.length > 0 || dishResults.length > 0) ? (
                    <div className="space-y-12">
                        {results.length > 0 && (
                            <section>
                                <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-6">Restaurants</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                    {results.map((restaurant, index) => {
                                        const restaurantId = restaurant._id?.$oid || restaurant.id || `search-rest-${index}`;
                                        return <RestaurantCard key={restaurantId} restaurant={restaurant} />;
                                    })}
                                </div>
                            </section>
                        )}

                        {dishResults.length > 0 && (
                            <section>
                                <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-6">Dishes</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 bg-gray-50/50 p-6 rounded-3xl border border-gray-100">
                                    {dishResults.map((item, index) => (
                                        <FoodItemCard
                                            key={item.id || index}
                                            item={item}
                                            restaurantId={item.restaurant?.$oid || item.restaurant}
                                        />
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>
                ) : query ? (
                    <div className="text-center py-24">
                        <div className="text-gray-300 mb-4 flex justify-center">
                            <SearchIcon size={64} />
                        </div>
                        <p className="text-xl text-gray-500">No restaurants found matching "{query}"</p>
                        <p className="text-gray-400 mt-2">Try searching for something else</p>
                    </div>
                ) : (
                    <div className="text-center py-24 text-gray-400">
                        Start typing to search for your favorite food...
                    </div>
                )}
            </div>
        </div>
    );
};

export default Search;
