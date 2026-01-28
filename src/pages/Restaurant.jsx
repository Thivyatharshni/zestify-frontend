import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import RestaurantHeader from '../components/restaurant/RestaurantHeader';
import MenuCategory from '../components/restaurant/MenuCategory';
import MenuSearch from '../components/restaurant/MenuSearch';
import StickyCartPreview from '../components/restaurant/StickyCartPreview';
import { restaurantApi } from '../services/restaurantApi';
import { Loader2 } from 'lucide-react';

const Restaurant = () => {
    const { id } = useParams();
    const [restaurant, setRestaurant] = useState(null);
    const [groupedMenu, setGroupedMenu] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    const fetchMenu = useCallback(async (query = '') => {
        try {
            const flatMenu = await restaurantApi.getMenu(id, query);

            // Group flat menu by item.category
            const groups = flatMenu.reduce((acc, item) => {
                const categoryName = item.category || 'Other';
                if (!acc[categoryName]) {
                    acc[categoryName] = [];
                }
                acc[categoryName].push(item);
                return acc;
            }, {});

            const sortedGroups = Object.keys(groups).map(name => ({
                categoryName: name,
                items: groups[name]
            }));

            setGroupedMenu(sortedGroups);
        } catch (error) {
            console.error("Failed to fetch menu:", error);
        }
    }, [id]);

    useEffect(() => {
        const fetchRestaurantData = async () => {
            setLoading(true);
            try {
                const rest = await restaurantApi.getRestaurantById(id);
                setRestaurant(rest);
                await fetchMenu();
            } catch (error) {
                console.error("Failed to fetch restaurant data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchRestaurantData();
    }, [id, fetchMenu]);

    // Handle debounced menu search
    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchTerm !== undefined) {
                fetchMenu(searchTerm);
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm, fetchMenu]);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <Loader2 className="w-12 h-12 animate-spin text-orange-500" />
        </div>
    );

    if (!restaurant) return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="text-gray-500 text-xl font-bold">Restaurant not found</div>
        </div>
    );

    return (
        <div className="min-h-screen bg-white">
            <RestaurantHeader restaurant={restaurant} />

            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
                <div className="bg-white rounded-t-xl min-h-screen">
                    <div className="pt-4 text-center text-xs text-gray-500 tracking-widest uppercase mb-4">M E N U</div>

                    <MenuSearch value={searchTerm} onChange={setSearchTerm} />

                    <div className="h-[1px] bg-gray-200 my-4" />

                    {groupedMenu.length > 0 ? (
                        groupedMenu.map((category, idx) => (
                            <MenuCategory
                                key={category.categoryName || idx}
                                category={category}
                                restaurantId={restaurant.id}
                            />
                        ))
                    ) : (
                        <div className="py-20 text-center text-gray-400">
                            No menu items found
                        </div>
                    )}
                </div>
            </div>

            <StickyCartPreview />
        </div>
    );
};

export default Restaurant;
