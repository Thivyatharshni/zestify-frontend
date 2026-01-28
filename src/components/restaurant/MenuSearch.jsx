import React from 'react';
import { Search } from 'lucide-react';

const MenuSearch = ({ value, onChange }) => {
    return (
        <div className="py-4">
            <div className="relative">
                <input
                    type="text"
                    placeholder="Search within menu..."
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-100 text-gray-900 rounded-lg text-sm border-none focus:ring-0 placeholder:text-gray-500 text-center"
                />
                <div className="absolute left-1/2 -ml-[90px] top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                    <Search size={16} />
                </div>
            </div>
        </div>
    );
};

export default MenuSearch;
