import React, { useState, useEffect } from 'react';
import {
    Wallet,
    TrendingUp,
    TrendingDown,
    Calendar,
    ArrowUpRight,
    Download,
    CreditCard,
    DollarSign
} from 'lucide-react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
import {
    Card,
    StatCard,
    Badge,
    Loader,
    Button
} from '../../components/ui/DashboardUI';
import { deliveryService } from '../../services/dashboard/deliveryService';
import toast from 'react-hot-toast';

const RiderEarnings = () => {
    const [earnings, setEarnings] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchEarnings();
    }, []);

    const fetchEarnings = async () => {
        try {
            const response = await deliveryService.getEarnings();
            if (response.data.success) {
                setEarnings(response.data.data);
            }
        } catch (error) {
            toast.error('Failed to load earnings data');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <Loader />;

    return (
        <div className="space-y-8 pb-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Earnings Reports</h1>
                    <p className="text-slate-500 font-medium italic mt-1">Detailed breakdown of your delivery revenue</p>
                </div>
                <Button variant="outline" className="gap-2 px-6 h-12 shadow-sm italic">
                    <Download size={18} />
                    Statement PDF
                </Button>
            </div>

            {/* Main Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    title="Today's Earnings"
                    value={`₹${earnings?.todayEarnings || 0}`}
                    icon={TrendingUp}
                    color="orange"
                    trend="up"
                    trendValue="8% vs yesterday"
                />
                <StatCard
                    title="Total Deliveries"
                    value={earnings?.totalDeliveries || 0}
                    icon={Calendar}
                    color="blue"
                />
                <StatCard
                    title="Wallet Balance"
                    value={`₹${earnings?.totalEarnings || 0}`}
                    icon={Wallet}
                    color="green"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Earnings Chart */}
                <Card className="lg:col-span-2">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                            <TrendingUp className="text-orange-500" />
                            Weekly Performance
                        </h3>
                        <Badge variant="primary">Last 7 Days</Badge>
                    </div>
                    <div className="h-[400px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={earnings?.weeklyEarningsChart || []}>
                                <defs>
                                    <linearGradient id="payoutGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#f97316" stopOpacity={0.15} />
                                        <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis
                                    dataKey="date"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 900 }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 900 }}
                                />
                                <Tooltip
                                    contentStyle={{
                                        borderRadius: '24px',
                                        border: 'none',
                                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
                                        padding: '20px',
                                        fontWeight: 900
                                    }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="earnings"
                                    stroke="#f97316"
                                    strokeWidth={4}
                                    fillOpacity={1}
                                    fill="url(#payoutGradient)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* Payout Summary */}
                <div className="space-y-6">
                    <Card className="bg-slate-900 text-white border-none shadow-2xl relative overflow-hidden group">
                        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-orange-500 rounded-full blur-[60px] opacity-20 group-hover:opacity-40 transition-opacity" />
                        <div className="relative z-10">
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-400">Next Payout</p>
                            <h2 className="text-4xl font-black mt-2 tracking-tighter italic">₹{earnings?.totalEarnings > 500 ? (earnings.totalEarnings * 0.9).toFixed(0) : 0}</h2>
                            <p className="text-xs font-medium text-slate-400 mt-4 leading-relaxed group-hover:text-slate-200 transition-colors">
                                Your earnings are automatically transferred to your bank account every Monday.
                            </p>
                            <Button className="w-full mt-8 bg-white text-slate-900 hover:bg-orange-50 gap-2 h-14 rounded-2xl group/btn">
                                <CreditCard size={20} />
                                <span className="font-black uppercase tracking-widest text-[10px]">Withdraw Now</span>
                            </Button>
                        </div>
                    </Card>

                    <Card className="border-dashed">
                        <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 border-b border-slate-50 pb-4">Revenue Breakdown</h4>
                        <div className="space-y-5">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-slate-50 rounded-xl text-slate-400"><DollarSign size={16} /></div>
                                    <span className="text-sm font-bold text-slate-600">Base Pay</span>
                                </div>
                                <span className="text-sm font-black text-slate-900">₹{(earnings?.totalEarnings * 0.7).toFixed(0)}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-orange-50 text-orange-500 rounded-xl"><ArrowUpRight size={16} /></div>
                                    <span className="text-sm font-bold text-slate-600">Incentives</span>
                                </div>
                                <span className="text-sm font-black text-slate-900">₹{(earnings?.totalEarnings * 0.2).toFixed(0)}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-50 text-blue-500 rounded-xl"><CreditCard size={16} /></div>
                                    <span className="text-sm font-bold text-slate-600">Tips Received</span>
                                </div>
                                <span className="text-sm font-black text-slate-900">₹{(earnings?.totalEarnings * 0.1).toFixed(0)}</span>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default RiderEarnings;
