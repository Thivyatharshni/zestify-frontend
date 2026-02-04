import React, { useState, useEffect } from 'react';
import {
    History as HistoryIcon,
    MapPin,
    CheckCircle,
    Calendar,
    Store,
    User
} from 'lucide-react';
import {
    Card,
    Badge,
    Table,
    Pagination,
    Loader,
    EmptyState
} from '../../components/ui/DashboardUI';
import { deliveryService } from '../../services/dashboard/deliveryService';
import toast from 'react-hot-toast';

const DeliveryHistory = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchHistory();
    }, [page]);

    const fetchHistory = async () => {
        try {
            setLoading(true);
            const response = await deliveryService.getHistory({ page, limit: 10 });
            if (response.data.success) {
                setHistory(response.data.data);
                setTotalPages(response.data.totalPages);
            }
        } catch (error) {
            toast.error('Failed to load delivery history');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <Loader />;

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Trip History</h1>
                    <p className="text-slate-500 font-medium italic mt-1">Complete record of all your successful deliveries</p>
                </div>
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl border border-slate-100 shadow-sm">
                    <Calendar size={18} className="text-orange-500" />
                    <span className="text-sm font-black text-slate-700">{new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                </div>
            </div>

            {history.length > 0 ? (
                <>
                    <Table headers={['Order ID', 'Restaurant', 'Customer', 'Delivered At', 'Payout', 'Status']}>
                        {history.map((order) => (
                            <tr key={order._id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-6 py-5">
                                    <span className="text-xs font-black text-slate-900 uppercase tracking-tighter">#{order._id.slice(-6)}</span>
                                </td>
                                <td className="px-6 py-5">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-blue-50 text-blue-500 rounded-xl">
                                            <Store size={16} />
                                        </div>
                                        <span className="text-sm font-bold text-slate-800">{order.restaurant?.name}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-5">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-orange-50 text-orange-500 rounded-xl">
                                            <User size={16} />
                                        </div>
                                        <div>
                                            <span className="text-sm font-bold text-slate-800 block">{order.user?.name}</span>
                                            <span className="text-xs font-bold text-slate-400 italic">{order.deliveryAddress?.area}</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-5">
                                    <span className="text-xs font-bold text-slate-600">
                                        {new Date(order.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                    </span>
                                </td>
                                <td className="px-6 py-5">
                                    <span className="text-sm font-black text-slate-900">₹{order.bill?.deliveryFee || 40}</span>
                                </td>
                                <td className="px-6 py-5">
                                    <Badge variant="success">
                                        <CheckCircle size={12} className="inline mr-1" />
                                        Completed
                                    </Badge>
                                </td>
                            </tr>
                        ))}
                    </Table>
                    <Pagination
                        currentPage={page}
                        totalPages={totalPages}
                        onPageChange={setPage}
                    />
                </>
            ) : (
                <EmptyState
                    title="No History Yet"
                    message="Your completed deliveries will appear here once you finish your first mission."
                    icon={HistoryIcon}
                />
            )}
        </div>
    );
};

export default DeliveryHistory;
