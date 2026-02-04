import React, { useState, useEffect } from 'react';
import {
    Settings,
    Store,
    MapPin,
    Clock,
    UtensilsCrossed,
    Save,
    Power,
    Image as ImageIcon,
    Camera
} from 'lucide-react';
import {
    Card,
    Button,
    Input,
    Loader,
    Badge
} from '../../components/ui/DashboardUI';
import { restaurantApi } from '../../services/dashboard/restaurantService';
import toast from 'react-hot-toast';

const RestaurantProfile = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        cuisines: '',
        deliveryTime: '',
        avgPriceForTwo: '',
        isPureVeg: false,
        image: '',
        location: {
            address: '',
            lat: 0,
            lng: 0
        }
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await restaurantApi.getProfile();
            if (response.data.success) {
                const data = response.data.data;
                setProfile(data);
                setFormData({
                    name: data.name,
                    cuisines: data.cuisines.join(', '),
                    deliveryTime: data.deliveryTime,
                    avgPriceForTwo: data.avgPriceForTwo,
                    isPureVeg: data.isPureVeg,
                    image: data.image,
                    location: data.location
                });
            }
        } catch (error) {
            toast.error('Failed to load profile');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            setSaving(true);
            const cuisinesArray = formData.cuisines.split(',').map(c => c.trim()).filter(c => c !== '');
            const response = await restaurantApi.updateProfile({
                ...formData,
                cuisines: cuisinesArray
            });
            if (response.data.success) {
                toast.success('Profile updated successfully');
                setProfile(response.data.data);
            }
        } catch (error) {
            toast.error('Update failed');
        } finally {
            setSaving(false);
        }
    };

    const toggleOpenStatus = async () => {
        try {
            const response = await restaurantApi.toggleStatus();
            if (response.data.success) {
                setProfile({ ...profile, isOpen: response.data.data.isOpen });
                toast.success(`Restaurant is now ${response.data.data.isOpen ? 'OPEN' : 'CLOSED'}`);
            }
        } catch (error) {
            toast.error('Failed to toggle status');
        }
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const dummyFormData = new FormData();
        dummyFormData.append('image', file);

        try {
            const response = await restaurantApi.uploadImage(dummyFormData);
            if (response.data.success) {
                setFormData({ ...formData, image: response.data.imageUrl });
                toast.success('Logo updated');
            }
        } catch (error) {
            toast.error('Image upload failed');
        }
    };

    if (loading) return <Loader />;

    return (
        <div className="space-y-8 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Shop Settings</h1>
                    <p className="text-slate-500 font-medium italic mt-1">Configure your public restaurant identity</p>
                </div>
                <div
                    onClick={toggleOpenStatus}
                    className={`group flex items-center gap-4 px-6 py-4 rounded-3xl cursor-pointer transition-all border-2 ${profile?.isOpen
                            ? 'bg-green-500 text-white border-green-400 shadow-xl shadow-green-200'
                            : 'bg-white text-slate-400 border-slate-100'
                        }`}
                >
                    <div className="flex flex-col items-end">
                        <span className="text-[10px] font-black uppercase tracking-widest opacity-70">Current Status</span>
                        <span className="text-lg font-black tracking-tighter underline decoration-white/30 decoration-4">
                            {profile?.isOpen ? 'NOW OPEN' : 'CLOSED NOW'}
                        </span>
                    </div>
                    <div className={`p-3 rounded-2xl transition-all ${profile?.isOpen ? 'bg-white text-green-500 rotate-12' : 'bg-slate-50 text-slate-300'}`}>
                        <Power size={24} />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Profile Card */}
                <Card className="lg:col-span-1 h-fit">
                    <div className="relative group overflow-hidden rounded-3xl mb-8">
                        <img
                            src={formData.image || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=1000'}
                            className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700"
                            alt="Restaurant"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-80" />
                        <div className="absolute top-4 left-4">
                            <Badge variant={profile?.isOpen ? 'success' : 'neutral'}>{profile?.isOpen ? 'Online' : 'Offline'}</Badge>
                        </div>
                        <label className="absolute bottom-6 right-6 cursor-pointer">
                            <div className="p-4 bg-white rounded-2xl shadow-2xl text-orange-500 hover:scale-110 active:scale-95 transition-all">
                                <Camera size={24} />
                            </div>
                            <input type="file" className="hidden" onChange={handleImageUpload} />
                        </label>
                        <div className="absolute bottom-6 left-6 text-white">
                            <h3 className="text-2xl font-black tracking-tighter">{profile?.name}</h3>
                            <p className="text-xs font-bold uppercase tracking-widest text-orange-400 mt-1 italic">Authorized Merchant</p>
                        </div>
                    </div>

                    <div className="space-y-6 px-2">
                        <div className="flex items-center gap-4 text-slate-600 group">
                            <div className="p-3 bg-slate-50 rounded-2xl group-hover:bg-orange-50 group-hover:text-orange-500 transition-colors"><MapPin size={18} /></div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Location</p>
                                <p className="text-sm font-bold truncate max-w-[180px] italic">{profile?.location?.address || 'Set your address'}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 text-slate-600 group">
                            <div className="p-3 bg-slate-50 rounded-2xl group-hover:bg-orange-50 group-hover:text-orange-500 transition-colors"><Clock size={18} /></div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Prep Time</p>
                                <p className="text-sm font-bold italic">{profile?.deliveryTime} Minutes</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 text-slate-600 group">
                            <div className="p-3 bg-slate-50 rounded-2xl group-hover:bg-orange-50 group-hover:text-orange-500 transition-colors"><UtensilsCrossed size={18} /></div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Specialty</p>
                                <p className="text-sm font-bold truncate max-w-[180px] italic">{profile?.cuisines.join(', ')}</p>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Edit Form */}
                <Card className="lg:col-span-2">
                    <form onSubmit={handleUpdate} className="space-y-8">
                        <div className="flex items-center justify-between border-b border-slate-50 pb-6 mb-6">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-orange-50 text-orange-500 rounded-2xl shadow-sm"><Store size={24} /></div>
                                <h3 className="text-xl font-black text-slate-900 tracking-tight">Basic Information</h3>
                            </div>
                            <Button type="submit" disabled={saving} className="gap-2 px-8">
                                {saving ? 'Saving...' : (
                                    <>
                                        <Save size={20} />
                                        Save Everything
                                    </>
                                )}
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <Input
                                label="Restaurant Name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Delicious Diner"
                            />
                            <Input
                                label="Cuisines (Comma separated)"
                                value={formData.cuisines}
                                onChange={(e) => setFormData({ ...formData, cuisines: e.target.value })}
                                placeholder="Indian, Chinese, Continental"
                            />
                            <Input
                                label="Delivery Time (Mins)"
                                type="number"
                                value={formData.deliveryTime}
                                onChange={(e) => setFormData({ ...formData, deliveryTime: e.target.value })}
                                placeholder="25"
                            />
                            <Input
                                label="Avg Price for Two (₹)"
                                type="number"
                                value={formData.avgPriceForTwo}
                                onChange={(e) => setFormData({ ...formData, avgPriceForTwo: e.target.value })}
                                placeholder="400"
                            />
                        </div>

                        <div className="space-y-8 pt-4">
                            <div className="flex items-center gap-3 border-b border-slate-50 pb-6">
                                <div className="p-3 bg-blue-50 text-blue-500 rounded-2xl shadow-sm"><MapPin size={24} /></div>
                                <h3 className="text-xl font-black text-slate-900 tracking-tight">Store Location</h3>
                            </div>
                            <Input
                                label="Full Commercial Address"
                                value={formData.location.address}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    location: { ...formData.location, address: e.target.value }
                                })}
                                placeholder="123, Food Street, Bangalore"
                            />
                        </div>

                        <div className="flex items-center gap-4 bg-orange-50/50 p-6 rounded-3xl border border-orange-100">
                            <input
                                type="checkbox"
                                checked={formData.isPureVeg}
                                onChange={(e) => setFormData({ ...formData, isPureVeg: e.target.checked })}
                                className="w-6 h-6 rounded-lg border-orange-200 text-orange-500 focus:ring-orange-500/20"
                            />
                            <div>
                                <p className="text-sm font-black text-slate-900 italic">This is a Pure Vegetarian Outlet</p>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-0.5">Show vegetarian badge to customers</p>
                            </div>
                        </div>
                    </form>
                </Card>
            </div>

            <div className="mt-8 p-6 bg-slate-900 rounded-[2.5rem] flex items-center justify-between shadow-2xl overflow-hidden relative group">
                <div className="absolute -right-20 -top-20 w-64 h-64 bg-orange-500 rounded-full blur-[100px] opacity-10 group-hover:opacity-20 transition-opacity duration-700" />
                <div className="flex items-center gap-6 z-10">
                    <div className="p-5 bg-orange-500 rounded-3xl shadow-xl shadow-orange-500/20 text-white"><Settings size={32} /></div>
                    <div>
                        <h2 className="text-2xl font-black text-white tracking-tighter">Account Security</h2>
                        <p className="text-slate-400 font-medium italic">Manage your merchant access and billing preferences</p>
                    </div>
                </div>
                <Button variant="outline" className="text-white border-slate-800 hover:bg-slate-800 hover:border-slate-700 h-14 px-8 z-10 transition-all font-black uppercase tracking-widest text-xs">
                    Manage Password
                </Button>
            </div>
        </div>
    );
};

export default RestaurantProfile;
