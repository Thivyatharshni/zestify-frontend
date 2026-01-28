import React from 'react';
import CartItem from './CartItem';

const CartList = ({ items }) => {
    return (
        <div className="bg-white p-6 rounded-none sm:rounded-none md:rounded-none lg:rounded-none">
            {/* Intentionally simple container, maybe styled by parent */}
            <div className="space-y-1">
                {items.map((item) => (
                    <CartItem key={item.tempId} item={item} />
                ))}
            </div>
        </div>
    );
};

export default CartList;
