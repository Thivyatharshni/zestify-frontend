import React, { useState, useEffect } from 'react';
import {
    Bike,
    MapPin,
    Power,
    TrendingUp,
    Package,
    CheckCircle2,
    Navigation,
    Clock,
    ExternalLink
} from 'lucide-react';
import {
    StatCard,
    Card,
    Button,
    Badge,
    Loader,
    EmptyState
} from '../../components/ui/DashboardUI';
import { deliveryService } from '../../services/dashboard/deliveryService';
import toast from 'react-hot-toast';

const DeliveryDashboard = () => {
    const [profile, setProfile] = useState(null);
    const [earnings, setEarnings] = useState(null);
    const [activeOrders, setActiveOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
        // Set up location tracking simulation
        const interval = setInterval(updateLocation, 30000);
        return () => clearInterval(interval);
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const [profileRes, earningsRes, ordersRes] = await Promise.all([
                deliveryService.getProfile(),
                deliveryService.getEarnings(),
                deliveryService.getOrders({ status: 'ACCEPTED' })
            ]);

            if (profileRes.data.success) setProfile(profileRes.data.data);
            if (earningsRes.data.success) setEarnings(earningsRes.data.data);
            if (ordersRes.data.success) setActiveOrders(ordersRes.data.data);
        } catch (error) {
            toast.error('Failed to load rider dashboard');
        } finally {
            setLoading(false);
        }
    };

    const toggleOnline = async () => {
        try {
            const response = await deliveryService.toggleOnline();
            if (response.data.success) {
                setProfile({ ...profile, isOnline: response.data.isOnline });
                toast.success(`You are now ${response.data.isOnline ? 'ONLINE' : 'OFFLINE'}`);
            }
        } catch (error) {
            toast.error('Failed to change status');
        }
    };

    const updateLocation = async () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async (position) => {
                try {
                    await deliveryService.updateLocation(position.coords.latitude, position.coords.longitude);
                } catch (error) {
                    console.error('Location update failed');
                }
            });
        }
    };

    if (loading) return <Loader />;

    return (
        <div className="space-y-8">
            {/* Rider Status Bar */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
                <div className="absolute -right-16 -top-16 w-64 h-64 bg-orange-500 rounded-full blur-[80px] opacity-10" />
                <div className="flex items-center gap-6 z-10">
                    <div className="relative">
                        <div className="p-5 bg-white/5 rounded-3xl border border-white/10 text-white">
                            <Bike size={32} />
                        </div>
                        <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-4 border-slate-900 ${profile?.isOnline ? 'bg-green-500' : 'bg-red-500 animate-pulse'}`} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-white tracking-tighter">Welcome back, {profile?.name}!</h1>
                        <p className="text-slate-400 font-medium italic mt-1">
                            {profile?.isOnline ? 'Hunting for new orders...' : 'Go online to start earning'}
                        </p>
                    </div>
                </div>

                <button
                    onClick={toggleOnline}
                    className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all z-10 ${profile?.isOnline
                            ? 'bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white'
                            : 'bg-green-500 text-white shadow-xl shadow-green-500/20 hover:scale-105 active:scale-95'
                        }`}
                >
                    <Power size={18} />
                    {profile?.isOnline ? 'Go Offline' : 'Go Online'}
                </button>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Today's Earnings" value={`₹${earnings?.todayEarnings || 0}`} icon={TrendingUp} color="orange" />
                <StatCard title="Deliveries Done" value={earnings?.totalDeliveries || 0} icon={CheckCircle2} color="green" />
                <StatCard title="Wallet Balance" value={`₹${earnings?.totalEarnings || 0}`} icon={Package} color="blue" />
                <StatCard title="Vehicle Reg" value={profile?.vehicleNumber || 'N/A'} icon={Navigation} color="purple" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Active Task */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                            <Clock className="text-orange-500" />
                            Current Mission
                        </h3>
                        {activeOrders.length > 0 && <Badge variant="primary">Active</Badge>}
                    </div>

                    {activeOrders.length > 0 ? (
                        activeOrders.map(order => (
                            <Card key={order._id} className="p-0 overflow-hidden border-2 border-orange-500/10 hover:border-orange-500/30 transition-all">
                                <div className="p-6 flex flex-col md:flex-row justify-between gap-6">
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Order ID:</span>
                                            <span className="text-sm font-black text-slate-900">#{order._id.slice(-6)}</span>
                                        </div>
                                        <div className="flex gap-4">
                                            <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl h-fit shadow-sm">
                                                <MapPin size={24} />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Pick up at</p>
                                                <h4 className="text-lg font-black text-slate-900 tracking-tight">{order.restaurant?.name}</h4>
                                                <p className="text-xs font-bold text-slate-500 italic mt-1 underline decoration-blue-100 decoration-4">{order.restaurant?.location?.address}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-4 pt-2">
                                            <div className="p-3 bg-orange-50 text-orange-600 rounded-2xl h-fit shadow-sm">
                                                <Navigation size={24} />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Deliver to</p>
                                                <h4 className="text-lg font-black text-slate-900 tracking-tight">{order.user?.name}</h4>
                                                <p className="text-xs font-bold text-slate-500 italic mt-1 underline decoration-orange-100 decoration-4">{order.deliveryAddress?.area}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col justify-between items-end gap-6 bg-slate-50/50 p-6 md:w-64 rounded-[2rem]">
                                        <div className="text-right">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Payout</p>
                                            <h3 className="text-3xl font-black text-slate-900 italic tracking-tighter">₹{order.bill?.deliveryFee || 40}</h3>
                                        </div>
                                        <Button className="w-full flex items-center justify-center gap-2 shadow-xl shadow-orange-500/20 py-4">
                                            Update Task
                                            <ChevronRight size={18} />
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        ))
                    ) : (
                        <EmptyState
                            title="Resting Mode"
                            message={profile?.isOnline ? "No active orders assigned to you yet. Stay online!" : "You are currently offline. Go online to see available orders."}
                            icon={Bike}
                        />
                    )}
                </div>

                {/* Quick Actions */}
                <div className="space-y-6">
                    <h3 className="text-xl font-black text-slate-900 tracking-tight">Quick Actions</h3>
                    <Card className="p-2 border-dashed">
                        <div className="space-y-2">
                            <button className="w-full flex items-center justify-between p-4 hover:bg-slate-50 rounded-2xl transition-all group">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-blue-50 text-blue-500 rounded-xl group-hover:bg-blue-500 group-hover:text-white transition-all">
                                        <Package size={20} />
                                    </div>
                                    <span className="text-sm font-black text-slate-700">Scan Package</span>
                                </div>
                                <ChevronRight size={18} className="text-slate-300" />
                            </button>
                            <button className="w-full flex items-center justify-between p-4 hover:bg-slate-50 rounded-2xl transition-all group">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-orange-50 text-orange-500 rounded-xl group-hover:bg-orange-500 group-hover:text-white transition-all">
                                        <ExternalLink size={20} />
                                    </div>
                                    <span className="text-sm font-black text-slate-700">Open Maps</span>
                                </div>
                                <ChevronRight size={18} className="text-slate-300" />
                            </button>
                            <button className="w-full flex items-center justify-between p-4 hover:bg-slate-50 rounded-2xl transition-all group">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-purple-50 text-purple-500 rounded-xl group-hover:bg-purple-500 group-hover:text-white transition-all">
                                        <User size={20} />
                                    </div>
                                    <span className="text-sm font-black text-slate-700">Contact Support</span>
                                </div>
                                <ChevronRight size={18} className="text-slate-300" />
                            </button>
                        </div>
                    </Card>

                    {/* Safety Banner */}
                    <div className="bg-orange-500 p-6 rounded-[2rem] text-white shadow-xl shadow-orange-500/20 relative overflow-hidden">
                        <div className="relative z-10">
                            <h4 className="text-lg font-black tracking-tight leading-tight">Safety First!</h4>
                            <p className="text-xs font-bold text-orange-200 mt-2 leading-relaxed italic">Always wear your helmet and follow speed limits during delivery missions.</p>
                        </div>
                        <Bike className="absolute -bottom-6 -right-6 text-white/10" size={100} />
                    </div>
                </div>
            </div>
        </div>
    );
};

const User = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
);

const ChevronRight = ({ className, size = 24 }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m9 18 6-6-6-6" /></svg>
);

export default DeliveryDashboard;
