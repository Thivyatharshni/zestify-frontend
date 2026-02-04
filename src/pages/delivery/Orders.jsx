import React, { useState, useEffect } from 'react';
import {
    Package,
    MapPin,
    ChevronRight,
    CheckCircle,
    XCircle,
    Navigation,
    Clock,
    Phone,
    Store,
    ArrowRight
} from 'lucide-react';
import {
    Card,
    Badge,
    Button,
    Loader,
    EmptyState,
    Modal
} from '../../components/ui/DashboardUI';
import { deliveryService } from '../../services/dashboard/deliveryService';
import toast from 'react-hot-toast';

const DeliveryOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await deliveryService.getOrders();
            if (response.data.success) {
                setOrders(response.data.data);
            }
        } catch (error) {
            toast.error('Failed to load assigned orders');
        } finally {
            setLoading(false);
        }
    };

    const handleAccept = async (id) => {
        try {
            const response = await deliveryService.acceptOrder(id);
            if (response.data.success) {
                toast.success('Order accepted! Head to the restaurant.');
                fetchOrders();
            }
        } catch (error) {
            toast.error('Could not accept order');
        }
    };

    const handleUpdateStatus = async (id, status) => {
        try {
            const response = await deliveryService.updateOrderStatus(id, status);
            if (response.data.success) {
                toast.success(`Order status: ${status}`);
                setIsModalOpen(false);
                fetchOrders();
            }
        } catch (error) {
            toast.error('Status update failed');
        }
    };

    if (loading) return <Loader />;

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Assigned Tasks</h1>
                <p className="text-slate-500 font-medium italic mt-1">Manage your active delivery missions</p>
            </div>

            {orders.length > 0 ? (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                    {orders.map((order) => (
                        <Card key={order._id} className="p-0 overflow-hidden group">
                            <div className="bg-slate-900 p-6 text-white flex justify-between items-center border-b border-white/5">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-orange-500 rounded-xl">
                                        <Package size={20} />
                                    </div>
                                    <span className="text-sm font-black tracking-widest text-orange-200 uppercase italic">Task #{order._id.slice(-6)}</span>
                                </div>
                                <Badge variant={order.orderStatus === 'CONFIRMED' ? 'warning' : 'primary'}>
                                    {order.orderStatus === 'CONFIRMED' ? 'WAITING' : order.orderStatus}
                                </Badge>
                            </div>

                            <div className="p-8 space-y-8">
                                {/* Visual Route */}
                                <div className="relative">
                                    <div className="absolute left-6 top-8 bottom-8 w-1 border-l-2 border-dashed border-slate-200" />

                                    <div className="flex gap-6 relative z-10">
                                        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shrink-0 shadow-sm border border-blue-100">
                                            <Store size={24} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Pick up from</p>
                                            <h4 className="text-lg font-black text-slate-900 tracking-tight">{order.restaurant?.name}</h4>
                                            <p className="text-xs font-bold text-slate-500 italic mt-1">{order.restaurant?.location?.address}</p>
                                        </div>
                                    </div>

                                    <div className="flex gap-6 relative z-10 mt-10">
                                        <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center shrink-0 shadow-sm border border-orange-100">
                                            <MapPin size={24} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Deliver to</p>
                                            <h4 className="text-lg font-black text-slate-900 tracking-tight">{order.user?.name}</h4>
                                            <p className="text-xs font-bold text-slate-500 italic mt-1">{order.deliveryAddress?.area}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-slate-50 p-6 rounded-[2rem] flex items-center justify-between border border-slate-100/50">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-white rounded-xl text-slate-400"><Clock size={16} /></div>
                                        <span className="text-xs font-black text-slate-600 uppercase tracking-widest italic">{new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-white rounded-xl text-slate-400"><Phone size={16} /></div>
                                        <span className="text-xs font-black text-slate-600 uppercase tracking-widest italic">+{order.user?.phone}</span>
                                    </div>
                                </div>

                                <div className="flex gap-4 pt-4">
                                    {order.orderStatus === 'CONFIRMED' ? (
                                        <>
                                            <Button onClick={() => handleAccept(order._id)} className="flex-1 h-14 rounded-2xl shadow-xl shadow-orange-500/20 text-xs font-black uppercase tracking-[0.2em]">Accept Task</Button>
                                            <Button variant="outline" className="px-6 h-14 rounded-2xl border-slate-100 text-slate-300 hover:text-red-500 hover:bg-red-50 hover:border-red-100"><XCircle size={20} /></Button>
                                        </>
                                    ) : (
                                        <Button
                                            onClick={() => { setSelectedOrder(order); setIsModalOpen(true); }}
                                            className="flex-1 h-16 rounded-[2rem] shadow-2xl shadow-orange-500/30 text-sm font-black uppercase tracking-[0.2em] group gap-3"
                                        >
                                            Update Delivery Status
                                            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            ) : (
                <EmptyState title="Quiet Shift" message="No tasks assigned right now. Keep your APP online!" icon={Navigation} />
            )}

            {/* Status Update Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Mission Progress"
                footer={<Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>}
            >
                <div className="space-y-6">
                    <p className="text-sm font-bold text-slate-500 text-center px-4 italic mb-8">
                        Please select the current stage of this delivery mission. Correct status updates help customers track their food.
                    </p>

                    <div className="grid gap-4">
                        <button
                            onClick={() => handleUpdateStatus(selectedOrder._id, 'PICKED_UP')}
                            className="flex items-center justify-between p-6 bg-blue-50/50 border-2 border-blue-100 rounded-3xl hover:bg-blue-50 hover:border-blue-300 transition-all group"
                        >
                            <div className="flex items-center gap-4">
                                <div className="p-4 bg-white rounded-2xl shadow-sm text-blue-500 group-hover:scale-110 transition-transform"><CheckCircle size={24} /></div>
                                <div className="text-left">
                                    <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">Picked Up</h4>
                                    <p className="text-xs font-bold text-slate-400 italic">I have received the food from kitchen</p>
                                </div>
                            </div>
                            <ChevronRight size={20} className="text-blue-200" />
                        </button>

                        <button
                            onClick={() => handleUpdateStatus(selectedOrder._id, 'OUT_FOR_DELIVERY')}
                            className="flex items-center justify-between p-6 bg-orange-50/50 border-2 border-orange-100 rounded-3xl hover:bg-orange-50 hover:border-orange-300 transition-all group"
                        >
                            <div className="flex items-center gap-4">
                                <div className="p-4 bg-white rounded-2xl shadow-sm text-orange-500 group-hover:scale-110 transition-transform"><Navigation size={24} /></div>
                                <div className="text-left">
                                    <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">On My Way</h4>
                                    <p className="text-xs font-bold text-slate-400 italic">Heading towards customer location</p>
                                </div>
                            </div>
                            <ChevronRight size={20} className="text-orange-200" />
                        </button>

                        <button
                            onClick={() => handleUpdateStatus(selectedOrder._id, 'DELIVERED')}
                            className="flex items-center justify-between p-6 bg-green-50/50 border-2 border-green-100 rounded-3xl hover:bg-green-50 hover:border-green-300 transition-all group"
                        >
                            <div className="flex items-center gap-4">
                                <div className="p-4 bg-white rounded-2xl shadow-sm text-green-500 group-hover:scale-110 transition-transform"><CheckCircle size={24} /></div>
                                <div className="text-left">
                                    <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">Mission Complete</h4>
                                    <p className="text-xs font-bold text-slate-400 italic">Food successfully delivered to customer</p>
                                </div>
                            </div>
                            <ChevronRight size={20} className="text-green-200" />
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default DeliveryOrders;
