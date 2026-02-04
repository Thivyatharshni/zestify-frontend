import React, { useState, useEffect } from 'react';
import {
    ShoppingBag,
    Search,
    MapPin,
    Store,
    User,
    Calendar,
    Sparkles,
    TrendingUp
} from 'lucide-react';
import {
    Card,
    Badge,
    Table,
    Loader,
    EmptyState
} from '../../components/ui/DashboardUI';
import { adminService } from '../../services/dashboard/adminService';
import toast from 'react-hot-toast';

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await adminService.getOrders();
            if (response.data.success) {
                setOrders(response.data.data);
            }
        } catch (error) {
            toast.error('Failed to load orders');
        } finally {
            setLoading(false);
        }
    };

    const statusVariants = {
        PLACED: 'neutral',
        CONFIRMED: 'primary',
        PREPARING: 'warning',
        OUT_FOR_DELIVERY: 'primary',
        DELIVERED: 'success',
        CANCELLED: 'danger'
    };

    const filteredOrders = orders.filter(order =>
        order._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.restaurant?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalRevenue = orders.reduce((sum, order) => sum + (order.bill?.grandTotal || 0), 0);
    const todayOrders = orders.filter(o => new Date(o.createdAt).toDateString() === new Date().toDateString()).length;

    if (loading) return <Loader dark />;

    return (
        <div className="space-y-8 pb-10">
            {/* Dark Header */}
            <div className="relative overflow-hidden bg-gradient-to-br from-cyan-600 via-cyan-700 to-blue-900 rounded-[2.5rem] p-8 shadow-2xl border border-cyan-500/20">
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
                <div className="relative z-10">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
                        <div>
                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-3 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-lg">
                                    <ShoppingBag className="text-cyan-300" size={28} />
                                </div>
                                <h1 className="text-4xl font-black text-white tracking-tight flex items-center gap-3">
                                    Global Order Monitor
                                    <Sparkles className="text-cyan-300" size={28} />
                                </h1>
                            </div>
                            <p className="text-cyan-100 font-medium">Real-time view of all platform orders</p>
                        </div>
                        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-xl border border-white/20 px-4 py-2 rounded-2xl shadow-lg">
                            <Calendar size={18} className="text-cyan-300" />
                            <span className="text-sm font-black text-white">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 hover:bg-white/15 transition-all cursor-pointer group">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-bold text-cyan-200 uppercase tracking-widest mb-1">Total Orders</p>
                                    <h3 className="text-3xl font-black text-white">{orders.length}</h3>
                                </div>
                                <div className="p-3 bg-white/10 rounded-xl group-hover:scale-110 transition-transform">
                                    <ShoppingBag className="text-white" size={24} />
                                </div>
                            </div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 hover:bg-white/15 transition-all cursor-pointer group">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-bold text-cyan-200 uppercase tracking-widest mb-1">Today's Orders</p>
                                    <h3 className="text-3xl font-black text-white">{todayOrders}</h3>
                                </div>
                                <div className="p-3 bg-emerald-500/20 rounded-xl group-hover:scale-110 transition-transform">
                                    <TrendingUp className="text-emerald-300" size={24} />
                                </div>
                            </div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 hover:bg-white/15 transition-all cursor-pointer group">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-bold text-cyan-200 uppercase tracking-widest mb-1">Total Revenue</p>
                                    <h3 className="text-3xl font-black text-white">₹{totalRevenue.toLocaleString()}</h3>
                                </div>
                                <div className="p-3 bg-yellow-500/20 rounded-xl group-hover:scale-110 transition-transform">
                                    <TrendingUp className="text-yellow-300" size={24} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Dark Search Bar */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-cyan-500/20 hover:border-cyan-400/30 transition-all hover:shadow-xl hover:shadow-cyan-500/20 rounded-[2rem] p-6">
                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-cyan-400 transition-colors" size={22} />
                    <input
                        type="text"
                        placeholder="Search by order ID, customer, or restaurant..."
                        className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-700/50 border-2 border-slate-600/50 focus:bg-slate-700 focus:border-cyan-500/50 focus:ring-4 focus:ring-cyan-500/20 transition-all text-base font-bold text-white placeholder:text-slate-300"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {filteredOrders.length > 0 ? (
                <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl border-2 border-cyan-500/20 overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-cyan-500/20 transition-all">
                    <Table headers={['Order ID', 'Customer', 'Restaurant', 'Amount', 'Time', 'Status']} dark>
                        {filteredOrders.map((order) => (
                            <tr key={order._id} className="hover:bg-slate-700/50 transition-all border-b border-slate-700/50 last:border-0">
                                <td className="px-6 py-5">
                                    <span className="text-sm font-black text-cyan-300 uppercase tracking-tighter">#{order._id.slice(-6)}</span>
                                </td>
                                <td className="px-6 py-5">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-blue-500/20 text-blue-400 rounded-xl border border-blue-500/30">
                                            <User size={18} />
                                        </div>
                                        <div>
                                            <span className="text-base font-bold text-white block">{order.user?.name}</span>
                                            <span className="text-sm font-bold text-slate-300">+{order.user?.phone}</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-5">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-xl border border-indigo-500/30">
                                            <Store size={18} />
                                        </div>
                                        <span className="text-base font-bold text-white">{order.restaurant?.name}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-5">
                                    <span className="text-base font-black text-white">₹{order.bill?.grandTotal}</span>
                                </td>
                                <td className="px-6 py-5">
                                    <span className="text-sm font-bold text-slate-200">
                                        {new Date(order.createdAt).toLocaleString('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </span>
                                </td>
                                <td className="px-6 py-5">
                                    <Badge variant={statusVariants[order.orderStatus]} dark>
                                        {order.orderStatus.replace(/_/g, ' ')}
                                    </Badge>
                                </td>
                            </tr>
                        ))}
                    </Table>
                </div>
            ) : (
                <div className="bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-cyan-500/20 rounded-3xl p-12">
                    <EmptyState title="No Orders" message="No orders match your search criteria." icon={ShoppingBag} dark />
                </div>
            )}
        </div>
    );
};

export default AdminOrders;
