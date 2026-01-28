import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import FoodItemCard from './FoodItemCard';

const MenuCategory = ({ category, restaurantId, defaultOpen = true }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="border-b-[10px] border-gray-100 last:border-0">
            <div
                className="flex justify-between items-center py-6 cursor-pointer px-4 sm:px-0"
                onClick={() => setIsOpen(!isOpen)}
            >
                <h2 className="font-extrabold text-lg text-gray-900">
                    {category.categoryName} ({category.items.length})
                </h2>
                {isOpen ? <ChevronUp className="text-gray-500" /> : <ChevronDown className="text-gray-500" />}
            </div>

            {isOpen && (
                <div className="px-4 sm:px-0 pb-8">
                    {category.items.map((item) => (
                        <FoodItemCard key={item.id} item={item} restaurantId={restaurantId} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default MenuCategory;
