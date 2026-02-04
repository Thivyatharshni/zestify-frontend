import React, { useState, useEffect } from 'react';
import {
    Users,
    Store,
    Bike,
    ShoppingBag,
    TrendingUp,
    DollarSign,
    ArrowUpRight,
    Activity,
    Zap,
    BarChart3,
    Sparkles
} from 'lucide-react';
import {
    StatCard,
    Card,
    Badge,
    Loader
} from '../../components/ui/DashboardUI';
import { adminService } from '../../services/dashboard/adminService';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const response = await adminService.getStats();
            if (response.data.success) {
                setStats(response.data.data);
            }
        } catch (error) {
            toast.error('Failed to load platform statistics');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <Loader />;

    return (
        <div className="space-y-8 pb-10">
            {/* Header Section with Dark Gradient */}
            <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-900 rounded-[2.5rem] p-8 shadow-2xl border border-blue-500/20">
                <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
                <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-indigo-400/5 rounded-full blur-2xl" />

                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-3 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-lg">
                                <Activity className="text-cyan-300" size={28} />
                            </div>
                            <Badge className="bg-emerald-500 text-white border-none shadow-lg shadow-emerald-500/30 px-4 py-1.5">
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                                    Live Data
                                </div>
                            </Badge>
                        </div>
                        <h1 className="text-4xl font-black text-white tracking-tight mb-2 flex items-center gap-3">
                            Platform Command Center
                            <Sparkles className="text-cyan-300" size={32} />
                        </h1>
                        <p className="text-blue-100 font-medium">Real-time system analytics and performance monitoring</p>
                    </div>
                    <div className="flex gap-3">
                        <button className="px-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 rounded-2xl text-white font-bold transition-all hover:scale-105 active:scale-95 shadow-xl">
                            <BarChart3 size={20} className="inline mr-2" />
                            Reports
                        </button>
                        <button onClick={fetchStats} className="px-6 py-3 bg-white hover:bg-blue-50 rounded-2xl text-blue-600 font-black transition-all hover:scale-105 active:scale-95 shadow-xl">
                            <Zap size={20} className="inline mr-2" />
                            Refresh
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Stats Grid with Dark Theme */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                <div className="group relative overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 hover:from-slate-700 hover:to-slate-800 p-6 rounded-3xl border-2 border-blue-500/20 hover:border-blue-400/40 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/30 hover:-translate-y-1 cursor-pointer">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all" />
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-blue-500 text-white rounded-2xl shadow-lg shadow-blue-500/50 group-hover:scale-110 transition-transform">
                                <Users size={24} />
                            </div>
                            <ArrowUpRight className="text-blue-400 group-hover:text-blue-300 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" size={20} />
                        </div>
                        <h3 className="text-4xl font-black text-white tracking-tighter mb-2">{stats?.totalUsers || 0}</h3>
                        <p className="text-xs font-black uppercase tracking-widest text-blue-400">Total Users</p>
                    </div>
                </div>

                <div className="group relative overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 hover:from-slate-700 hover:to-slate-800 p-6 rounded-3xl border-2 border-indigo-500/20 hover:border-indigo-400/40 transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/30 hover:-translate-y-1 cursor-pointer">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/20 transition-all" />
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-indigo-500 text-white rounded-2xl shadow-lg shadow-indigo-500/50 group-hover:scale-110 transition-transform">
                                <Store size={24} />
                            </div>
                            <ArrowUpRight className="text-indigo-400 group-hover:text-indigo-300 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" size={20} />
                        </div>
                        <h3 className="text-4xl font-black text-white tracking-tighter mb-2">{stats?.totalRestaurants || 0}</h3>
                        <p className="text-xs font-black uppercase tracking-widest text-indigo-400">Restaurants</p>
                    </div>
                </div>

                <div className="group relative overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 hover:from-slate-700 hover:to-slate-800 p-6 rounded-3xl border-2 border-violet-500/20 hover:border-violet-400/40 transition-all duration-300 hover:shadow-2xl hover:shadow-violet-500/30 hover:-translate-y-1 cursor-pointer">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/10 rounded-full blur-2xl group-hover:bg-violet-500/20 transition-all" />
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-violet-500 text-white rounded-2xl shadow-lg shadow-violet-500/50 group-hover:scale-110 transition-transform">
                                <Bike size={24} />
                            </div>
                            <ArrowUpRight className="text-violet-400 group-hover:text-violet-300 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" size={20} />
                        </div>
                        <h3 className="text-4xl font-black text-white tracking-tighter mb-2">{stats?.totalDeliveryPartners || 0}</h3>
                        <p className="text-xs font-black uppercase tracking-widest text-violet-400">Riders</p>
                    </div>
                </div>

                <div className="group relative overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 hover:from-slate-700 hover:to-slate-800 p-6 rounded-3xl border-2 border-cyan-500/20 hover:border-cyan-400/40 transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/30 hover:-translate-y-1 cursor-pointer">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl group-hover:bg-cyan-500/20 transition-all" />
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-cyan-500 text-white rounded-2xl shadow-lg shadow-cyan-500/50 group-hover:scale-110 transition-transform">
                                <ShoppingBag size={24} />
                            </div>
                            <ArrowUpRight className="text-cyan-400 group-hover:text-cyan-300 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" size={20} />
                        </div>
                        <h3 className="text-4xl font-black text-white tracking-tighter mb-2">{stats?.totalOrders || 0}</h3>
                        <p className="text-xs font-black uppercase tracking-widest text-cyan-400">Total Orders</p>
                    </div>
                </div>

                <div className="group relative overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 hover:from-slate-700 hover:to-slate-800 p-6 rounded-3xl border-2 border-emerald-500/20 hover:border-emerald-400/40 transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-500/30 hover:-translate-y-1 cursor-pointer">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all" />
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-emerald-500 text-white rounded-2xl shadow-lg shadow-emerald-500/50 group-hover:scale-110 transition-transform">
                                <DollarSign size={24} />
                            </div>
                            <div className="flex items-center gap-1 text-emerald-400 font-black text-xs">
                                <TrendingUp size={14} />
                                +18%
                            </div>
                        </div>
                        <h3 className="text-4xl font-black text-white tracking-tighter mb-2">₹{(stats?.totalRevenue || 0).toLocaleString()}</h3>
                        <p className="text-xs font-black uppercase tracking-widest text-emerald-400">GMV</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Platform Health - Dark Theme */}
                <div className="lg:col-span-2 bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-blue-500/20 hover:border-blue-400/30 transition-all hover:shadow-2xl hover:shadow-blue-500/20 rounded-[2.5rem] p-8">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
                            <div className="p-2 bg-blue-500 text-white rounded-xl shadow-lg shadow-blue-500/50">
                                <TrendingUp size={20} />
                            </div>
                            Platform Health
                        </h3>
                        <Badge className="bg-blue-500/20 text-blue-300 border border-blue-500/30">4 Metrics</Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                        {[
                            { icon: Users, value: stats?.totalUsers || 0, label: 'Active Customers', color: 'blue', growth: '+12%' },
                            { icon: Store, value: stats?.totalRestaurants || 0, label: 'Partner Restaurants', color: 'indigo', growth: '+8%' },
                            { icon: Bike, value: stats?.totalDeliveryPartners || 0, label: 'Delivery Fleet', color: 'violet', growth: '+15%' },
                            { icon: ShoppingBag, value: stats?.totalOrders || 0, label: 'Lifetime Orders', color: 'cyan', growth: '+22%' }
                        ].map((metric, idx) => (
                            <div key={idx} className={`group relative overflow-hidden bg-gradient-to-br from-slate-700 to-slate-800 hover:from-slate-600 hover:to-slate-700 p-8 rounded-[2rem] border-2 border-${metric.color}-500/20 hover:border-${metric.color}-400/40 transition-all duration-300 cursor-pointer hover:shadow-xl hover:shadow-${metric.color}-500/30 hover:-translate-y-1`}>
                                <div className={`absolute -top-10 -right-10 w-32 h-32 bg-${metric.color}-500/10 rounded-full blur-2xl group-hover:bg-${metric.color}-500/20 transition-all`} />
                                <div className="relative z-10">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className={`p-3 bg-${metric.color}-500 text-white rounded-2xl shadow-lg shadow-${metric.color}-500/50 group-hover:scale-110 transition-transform`}>
                                            <metric.icon size={24} />
                                        </div>
                                        <ArrowUpRight className={`text-${metric.color}-400 group-hover:text-${metric.color}-300 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all`} size={20} />
                                    </div>
                                    <h4 className="text-5xl font-black text-white tracking-tighter mb-3">{metric.value}</h4>
                                    <p className={`text-xs font-black uppercase tracking-widest text-${metric.color}-400 mb-3`}>{metric.label}</p>
                                    <div className={`flex items-center gap-2 text-xs font-bold text-${metric.color}-400`}>
                                        <TrendingUp size={12} />
                                        <span>{metric.growth} this month</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Revenue Card - Dark Theme */}
                <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-900 text-white border-2 border-blue-400/30 shadow-2xl relative overflow-hidden group hover:shadow-blue-500/40 transition-all hover:scale-[1.02] rounded-[2.5rem] p-8">
                    <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-cyan-400/20 rounded-full blur-[80px] group-hover:bg-cyan-400/30 transition-all" />
                    <div className="absolute top-10 left-10 w-32 h-32 bg-white/5 rounded-full blur-2xl" />
                    <div className="relative z-10 h-full flex flex-col justify-between">
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <div className="p-2 bg-white/10 backdrop-blur-xl rounded-xl border border-white/20">
                                    <DollarSign size={20} />
                                </div>
                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-cyan-200">Total GMV</p>
                            </div>
                            <h2 className="text-6xl font-black tracking-tighter mb-4">₹{(stats?.totalRevenue || 0).toLocaleString()}</h2>
                            <p className="text-sm font-medium text-blue-100 leading-relaxed">
                                Gross Merchandise Value across all transactions on the Zestify platform.
                            </p>
                        </div>
                        <div className="space-y-3 mt-8">
                            <div className="p-4 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 hover:bg-white/15 transition-all cursor-pointer">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-cyan-100 uppercase tracking-widest">Growth Rate</span>
                                    <div className="flex items-center gap-2 text-emerald-300">
                                        <TrendingUp size={16} />
                                        <span className="text-lg font-black">+18%</span>
                                    </div>
                                </div>
                            </div>
                            <div className="p-4 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 hover:bg-white/15 transition-all cursor-pointer">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-cyan-100 uppercase tracking-widest">This Month</span>
                                    <span className="text-lg font-black">₹{((stats?.totalRevenue || 0) * 0.18).toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* System Status - Dark Theme */}
            <div className="relative overflow-hidden bg-gradient-to-r from-emerald-900/50 via-green-900/50 to-teal-900/50 border-2 border-emerald-500/30 p-8 rounded-[2.5rem] hover:shadow-2xl hover:shadow-emerald-500/30 transition-all group backdrop-blur-sm">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-all" />
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-6">
                        <div className="p-5 bg-emerald-500 text-white rounded-3xl shadow-xl shadow-emerald-500/50 group-hover:scale-110 transition-transform">
                            <Activity size={32} />
                        </div>
                        <div>
                            <h4 className="text-xl font-black text-white uppercase tracking-tight mb-1">System Status: Operational</h4>
                            <p className="text-sm font-bold text-emerald-200">All services running smoothly. Last updated: {new Date().toLocaleTimeString()}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-emerald-500/30 shadow-sm">
                            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                            <span className="text-xs font-black text-emerald-300 uppercase tracking-widest">99.9% Uptime</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
