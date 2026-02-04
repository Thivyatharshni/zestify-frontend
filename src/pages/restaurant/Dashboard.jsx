import React, { useEffect, useState } from 'react';
import {
    ShoppingBag,
    TrendingUp,
    Clock,
    XCircle,
    ArrowUpRight,
    DollarSign,
    Package,
    Calendar
} from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area
} from 'recharts';
import { Card, StatCard, Badge, Table, Loader } from '../../components/ui/DashboardUI';
import { restaurantApi } from '../../services/dashboard/restaurantService';
import toast from 'react-hot-toast';

const RestaurantDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const response = await restaurantApi.getStats();
            if (response.data.success) {
                setStats(response.data.data);
            }
        } catch (error) {
            toast.error('Failed to load dashboard statistics');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <Loader />;
    if (!stats) return null;

    return (
        <div className="space-y-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Performance Overview</h1>
                    <p className="text-slate-500 font-medium italic mt-1">Real-time insights for your restaurant business</p>
                </div>
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl border border-slate-100 shadow-sm">
                    <Calendar size={18} className="text-orange-500" />
                    <span className="text-sm font-black text-slate-700">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Revenue"
                    value={`₹${stats.totalRevenue.toLocaleString()}`}
                    icon={DollarSign}
                    color="green"
                    trend="up"
                    trendValue="12% from last wk"
                />
                <StatCard
                    title="Total Orders"
                    value={stats.totalOrders}
                    icon={ShoppingBag}
                    color="blue"
                />
                <StatCard
                    title="Today's Orders"
                    value={stats.todayOrders}
                    icon={Clock}
                    color="orange"
                />
                <StatCard
                    title="Cancelled"
                    value={stats.cancelledOrders}
                    icon={XCircle}
                    color="purple"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Weekly Revenue Chart */}
                <Card className="lg:col-span-2">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                            <TrendingUp className="text-orange-500" />
                            Revenue Analytics
                        </h3>
                        <Badge variant="primary">Last 7 Days</Badge>
                    </div>
                    <div className="h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={stats.weeklyRevenue}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#f97316" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis
                                    dataKey="date"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }}
                                />
                                <Tooltip
                                    contentStyle={{
                                        borderRadius: '16px',
                                        border: 'none',
                                        boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                                        padding: '12px'
                                    }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="revenue"
                                    stroke="#f97316"
                                    strokeWidth={4}
                                    fillOpacity={1}
                                    fill="url(#colorRevenue)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* Top Selling Items */}
                <Card>
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                            <Package className="text-blue-500" />
                            Top Sellers
                        </h3>
                    </div>
                    <div className="space-y-6">
                        {stats.topSellingItems.map((item, index) => (
                            <div key={index} className="flex items-center justify-between group">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-sm font-black text-slate-400 border border-slate-100 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
                                        #{index + 1}
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-slate-800">{item.name}</h4>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{item.count} Sold</p>
                                    </div>
                                </div>
                                <ArrowUpRight size={18} className="text-slate-200 group-hover:text-blue-500 transition-colors" />
                            </div>
                        ))}
                    </div>
                    <div className="mt-10 p-4 bg-orange-50 rounded-2xl border border-orange-100">
                        <p className="text-xs font-bold text-orange-700 leading-relaxed uppercase tracking-widest text-center">
                            Boost your top items with dynamic offers!
                        </p>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default RestaurantDashboard;
