import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, RefreshCw } from 'lucide-react';
import { formatPrice } from '../../utils/formatPrice';
import OrderStatusBadge from './OrderStatusBadge';
import Button from '../common/Button';

const OrderCard = ({ order }) => {
    // Backend properties: order.restaurant, order.items, order.totalPrice, order.status, order.createdAt, order.id / order._id
    const restaurant = order.restaurant || {};
    const orderId = order.id || order._id; // ✅ Optional defensive fallback

    return (
        <div className="bg-white border border-gray-100 rounded-3xl p-6 hover:shadow-xl transition-all duration-300 group">
            <div className="flex justify-between items-start mb-6">
                <div className="flex gap-5">
                    <div className="w-20 h-20 bg-gray-100 rounded-2xl overflow-hidden shadow-sm">
                        <img
                            src={restaurant.image}
                            alt={restaurant.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                    </div>
                    <div>
                        <h3 className="font-black text-gray-900 text-lg leading-tight mb-1">
                            {restaurant.name}
                        </h3>
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-2">
                            {restaurant.location}
                        </p>
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] bg-gray-100 text-gray-500 font-black px-2 py-0.5 rounded uppercase tracking-tighter">
                                ORDER #{orderId.slice(-6)}
                            </span>
                            <span className="w-1 h-1 rounded-full bg-gray-300" />
                            <div className="text-[10px] text-gray-400 font-bold uppercase">
                                {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                    day: 'numeric',
                                    month: 'short'
                                })}{' '}
                                •{' '}
                                {new Date(order.createdAt).toLocaleTimeString('en-IN', {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </div>
                        </div>
                    </div>
                </div>
                <OrderStatusBadge status={order.status} />
            </div>

            <div className="border-t border-dashed border-gray-100 py-4 space-y-2">
                {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                        <span className="text-gray-500 font-bold">
                            <span className="text-orange-500">{item.quantity}</span> x {item.name}
                        </span>
                    </div>
                ))}
            </div>

            <div className="border-t border-dashed border-gray-100 pt-4 flex justify-between items-center">
                <div className="flex flex-col">
                    <span className="text-[10px] text-gray-400 uppercase font-black tracking-widest leading-none mb-1">
                        Total Paid
                    </span>
                    <span className="font-black text-gray-900 text-lg leading-none">
                        {formatPrice(order.totalPrice)}
                    </span>
                </div>
                <div className="flex gap-3">
                    {['PLACED', 'CONFIRMED', 'PREPARING', 'OUT_FOR_DELIVERY'].includes(order.status) ? (
                        <Link to={`/orders/${orderId}`}>
                            <Button
                                variant="primary"
                                className="bg-orange-600 hover:bg-orange-700 font-black uppercase text-[10px] tracking-widest px-6 shadow-lg shadow-orange-100"
                            >
                                Track Live
                            </Button>
                        </Link>
                    ) : (
                        <Button
                            variant="outline"
                            className="text-gray-900 border-gray-200 hover:bg-gray-50 font-black uppercase text-[10px] tracking-widest px-6 shadow-sm"
                        >
                            <RefreshCw size={12} className="mr-2" /> Reorder
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OrderCard;
