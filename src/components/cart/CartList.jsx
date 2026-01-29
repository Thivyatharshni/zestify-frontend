import React from 'react';
import CartItem from './CartItem';

const CartList = ({ items }) => {
    return (
        <div className="space-y-0">
            {items.map((item) => (
                <CartItem key={item.tempId || item.menuItem} item={item} />
            ))}
        </div>
    );
};

export default CartList;
