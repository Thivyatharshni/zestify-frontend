import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Search as SearchIcon, Loader2 } from 'lucide-react';
import RestaurantCard from '../components/home/RestaurantCard';
import { restaurantApi } from '../services/restaurantApi';
import { ROUTES } from '../routes/RouteConstants';

const Search = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    // Initialize search term from URL
    useEffect(() => {
        const query = new URLSearchParams(location.search).get('q') || '';
        setSearchTerm(query);
    }, [location.search]);

    const performSearch = useCallback(async (query) => {
        if (!query.trim()) {
            setResults([]);
            setLoading(false);
            return;
        }
        setLoading(true);
        try {
            const data = await restaurantApi.searchRestaurants(query);
            setResults(data);
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
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all text-lg"
                    />
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                        {loading ? <Loader2 size={24} className="animate-spin text-violet-500" /> : <SearchIcon size={24} />}
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
                ) : results.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {results.map((restaurant) => (
                            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
                        ))}
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
