import React, { useState, useEffect } from 'react';
import {
    Store as StoreIcon,
    Plus,
    Power,
    Trash2,
    Search,
    MapPin,
    Clock,
    Sparkles
} from 'lucide-react';
import {
    Card,
    Button,
    Table,
    Badge,
    Modal,
    Input,
    Loader,
    EmptyState
} from '../../components/ui/DashboardUI';
import { adminService } from '../../services/dashboard/adminService';
import toast from 'react-hot-toast';

const AdminRestaurants = () => {
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedRestaurant, setSelectedRestaurant] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        adminName: '',
        adminEmail: '',
        adminPassword: '',
        adminPhone: '',
        cuisines: '',
        avgPriceForTwo: '',
        deliveryTime: '',
        image: '',
        location: { address: '', lat: 0, lng: 0 }
    });

    useEffect(() => {
        fetchRestaurants();
    }, []);

    const fetchRestaurants = async () => {
        try {
            setLoading(true);
            const response = await adminService.getRestaurants();
            if (response.data.success) {
                setRestaurants(response.data.data);
            }
        } catch (error) {
            toast.error('Failed to load restaurants');
        } finally {
            setLoading(false);
        }
    };

    const handleToggleStatus = async (id) => {
        try {
            const response = await adminService.toggleRestaurantStatus(id);
            if (response.data.success) {
                toast.success('Restaurant status updated');
                fetchRestaurants();
            }
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            const cuisinesArray = formData.cuisines.split(',').map(c => c.trim()).filter(c => c !== '');
            const response = await adminService.createRestaurant({
                ...formData,
                cuisines: cuisinesArray
            });
            if (response.data.success) {
                toast.success('Restaurant onboarded successfully');
                setIsAddModalOpen(false);
                resetForm();
                fetchRestaurants();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to create restaurant');
        }
    };

    const handleDelete = async () => {
        try {
            const response = await adminService.deleteRestaurant(selectedRestaurant._id);
            if (response.data.success) {
                toast.success('Restaurant deleted');
                setIsDeleteModalOpen(false);
                setSelectedRestaurant(null);
                fetchRestaurants();
            }
        } catch (error) {
            toast.error('Failed to delete restaurant');
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            adminName: '',
            adminEmail: '',
            adminPassword: '',
            adminPhone: '',
            cuisines: '',
            avgPriceForTwo: '',
            deliveryTime: '',
            image: '',
            location: { address: '', lat: 0, lng: 0 }
        });
    };

    const filteredRestaurants = restaurants.filter(r =>
        r.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <Loader dark />;

    return (
        <div className="space-y-8 pb-10">
            {/* Dark Header */}
            <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-900 rounded-[2.5rem] p-8 shadow-2xl border border-indigo-500/20">
                <div className="absolute top-0 right-0 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-3 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-lg">
                                <StoreIcon className="text-purple-300" size={28} />
                            </div>
                            <h1 className="text-4xl font-black text-white tracking-tight flex items-center gap-3">
                                Restaurant Network
                                <Sparkles className="text-purple-300" size={28} />
                            </h1>
                        </div>
                        <p className="text-indigo-100 font-medium">Onboard and manage partner restaurants</p>
                    </div>
                    <Button dark onClick={() => { resetForm(); setIsAddModalOpen(true); }} className="gap-2 px-6">
                        <Plus size={20} />
                        Add Restaurant
                    </Button>
                </div>
            </div>

            {/* Dark Search Bar */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-indigo-500/20 hover:border-indigo-400/30 transition-all hover:shadow-xl hover:shadow-indigo-500/20 rounded-[2rem] p-6">
                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-400 transition-colors" size={22} />
                    <input
                        type="text"
                        placeholder="Search restaurants..."
                        className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-700/50 border-2 border-slate-600/50 focus:bg-slate-700 focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/20 transition-all text-base font-bold text-white placeholder:text-slate-300"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {filteredRestaurants.length > 0 ? (
                <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl border-2 border-indigo-500/20 overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-indigo-500/20 transition-all">
                    <Table headers={['Restaurant', 'Cuisines', 'Delivery Time', 'Avg Price', 'Status', 'Actions']} dark>
                        {filteredRestaurants.map((restaurant) => (
                            <tr key={restaurant._id} className="hover:bg-slate-700/50 transition-all group border-b border-slate-700/50 last:border-0">
                                <td className="px-6 py-5">
                                    <div className="flex items-center gap-3">
                                        {restaurant.image ? (
                                            <img src={restaurant.image} alt={restaurant.name} className="w-12 h-12 rounded-xl object-cover border-2 border-indigo-500/30 shadow-lg shadow-indigo-500/20" />
                                        ) : (
                                            <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 border-2 border-indigo-500/30">
                                                <StoreIcon size={20} />
                                            </div>
                                        )}
                                        <div>
                                            <h4 className="text-base font-black text-white">{restaurant.name}</h4>
                                            <p className="text-sm text-slate-300 font-medium flex items-center gap-1 mt-0.5">
                                                <MapPin size={12} />
                                                {restaurant.location?.address || 'No address'}
                                            </p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-5">
                                    <span className="text-sm font-bold text-slate-200">{restaurant.cuisines?.join(', ')}</span>
                                </td>
                                <td className="px-6 py-5">
                                    <div className="flex items-center gap-1.5 text-slate-200">
                                        <Clock size={16} />
                                        <span className="text-sm font-bold">{restaurant.deliveryTime} mins</span>
                                    </div>
                                </td>
                                <td className="px-6 py-5">
                                    <span className="text-base font-black text-white">₹{restaurant.avgPriceForTwo}</span>
                                </td>
                                <td className="px-6 py-5">
                                    {restaurant.isOpen ? (
                                        <Badge variant="success" dark>Open</Badge>
                                    ) : (
                                        <Badge variant="neutral" dark>Closed</Badge>
                                    )}
                                </td>
                                <td className="px-6 py-5">
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handleToggleStatus(restaurant._id)}
                                            className="p-2.5 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-400 rounded-xl transition-all border border-indigo-500/40"
                                            title="Toggle Status"
                                        >
                                            <Power size={18} />
                                        </button>
                                        <button
                                            onClick={() => { setSelectedRestaurant(restaurant); setIsDeleteModalOpen(true); }}
                                            className="p-2.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-xl transition-all border border-red-500/40"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </Table>
                </div>
            ) : (
                <div className="bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-indigo-500/20 rounded-3xl p-12">
                    <EmptyState title="No Restaurants" message="Start onboarding partner restaurants." icon={StoreIcon} dark />
                </div>
            )}

            {/* Add Restaurant Modal */}
            <Modal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                title="Onboard New Restaurant"
                dark
                footer={(
                    <>
                        <Button variant="ghost" dark onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
                        <Button dark onClick={handleCreate}>Create Restaurant</Button>
                    </>
                )}
            >
                <div className="space-y-6">
                    <div className="bg-indigo-500/10 p-4 rounded-2xl border border-indigo-500/30">
                        <p className="text-xs font-bold text-indigo-300 uppercase tracking-widest">Admin Account</p>
                        <p className="text-xs font-medium text-slate-400 mt-1">A restaurant admin account will be auto-created with these credentials</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Admin Name"
                            placeholder="John Doe"
                            value={formData.adminName}
                            onChange={(e) => setFormData({ ...formData, adminName: e.target.value })}
                            dark
                        />
                        <Input
                            label="Admin Phone"
                            placeholder="9876543210"
                            value={formData.adminPhone}
                            onChange={(e) => setFormData({ ...formData, adminPhone: e.target.value })}
                            dark
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Admin Email"
                            type="email"
                            placeholder="admin@restaurant.com"
                            value={formData.adminEmail}
                            onChange={(e) => setFormData({ ...formData, adminEmail: e.target.value })}
                            dark
                        />
                        <Input
                            label="Admin Password"
                            type="password"
                            placeholder="••••••••"
                            value={formData.adminPassword}
                            onChange={(e) => setFormData({ ...formData, adminPassword: e.target.value })}
                            dark
                        />
                    </div>

                    <div className="border-t border-slate-700 pt-6">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Restaurant Details</p>
                        <div className="space-y-4">
                            <Input
                                label="Restaurant Name"
                                placeholder="Pizza Palace"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                dark
                            />
                            <Input
                                label="Cuisines (comma separated)"
                                placeholder="Italian, Pizza, Pasta"
                                value={formData.cuisines}
                                onChange={(e) => setFormData({ ...formData, cuisines: e.target.value })}
                                dark
                            />
                            <div className="grid grid-cols-2 gap-4">
                                <Input
                                    label="Delivery Time (mins)"
                                    type="number"
                                    placeholder="30"
                                    value={formData.deliveryTime}
                                    onChange={(e) => setFormData({ ...formData, deliveryTime: e.target.value })}
                                    dark
                                />
                                <Input
                                    label="Avg Price for Two (₹)"
                                    type="number"
                                    placeholder="500"
                                    value={formData.avgPriceForTwo}
                                    onChange={(e) => setFormData({ ...formData, avgPriceForTwo: e.target.value })}
                                    dark
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>

            {/* Delete Modal */}
            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                title="Delete Restaurant"
                dark
                footer={(
                    <>
                        <Button variant="ghost" dark onClick={() => setIsDeleteModalOpen(false)}>Cancel</Button>
                        <Button variant="danger" dark onClick={handleDelete}>Delete</Button>
                    </>
                )}
            >
                <div className="text-center py-4">
                    <div className="w-20 h-20 bg-red-500/10 text-red-400 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-red-500/30 border-2 border-red-500/20">
                        <Trash2 size={36} />
                    </div>
                    <p className="text-slate-300 font-medium text-lg">
                        Delete <span className="font-black text-white">"{selectedRestaurant?.name}"</span>?
                    </p>
                    <p className="text-sm text-slate-400 mt-2">
                        This will also remove their admin account.
                    </p>
                </div>
            </Modal>
        </div>
    );
};

export default AdminRestaurants;
