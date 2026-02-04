import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Utensils,
    Bike,
    Users,
    Settings,
    LogOut,
    Menu as MenuIcon,
    X,
    ChevronRight,
    Bell,
    Search,
    User as UserIcon,
    ShoppingBag,
    TrendingUp,
    History,
    Wallet,
    Shield,
    Zap
} from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import { cn } from '../components/ui/DashboardUI';

const DashboardLayout = ({ role }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const menuItems = {
        super_admin: [
            { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
            { name: 'Users', path: '/admin/users', icon: Users },
            { name: 'Restaurants', path: '/admin/restaurants', icon: Utensils },
            { name: 'Delivery Partners', path: '/admin/delivery', icon: Bike },
            { name: 'Global Orders', path: '/admin/orders', icon: ShoppingBag },
        ],
        restaurant_admin: [
            { name: 'Overview', path: '/restaurant/dashboard', icon: LayoutDashboard },
            { name: 'Menu Items', path: '/restaurant/menu', icon: Utensils },
            { name: 'Orders', path: '/restaurant/orders', icon: ShoppingBag },
            { name: 'Analytics', path: '/restaurant/stats', icon: TrendingUp },
            { name: 'Shop Profile', path: '/restaurant/profile', icon: Settings },
        ],
        delivery_partner: [
            { name: 'Dashboard', path: '/delivery/dashboard', icon: LayoutDashboard },
            { name: 'Active Orders', path: '/delivery/orders', icon: Bike },
            { name: 'Earnings', path: '/delivery/earnings', icon: Wallet },
            { name: 'Trip History', path: '/delivery/history', icon: History },
            { name: 'Profile', path: '/delivery/profile', icon: UserIcon },
        ],
    };

    const currentMenuItems = menuItems[role] || [];
    const isSuperAdmin = role === 'super_admin';

    // Dark blue theme for super admin
    const sidebarBg = isSuperAdmin ? 'bg-gradient-to-b from-slate-900 via-blue-950 to-slate-900' : 'bg-slate-900';
    const sidebarBorder = isSuperAdmin ? 'border-blue-900/30' : 'border-slate-800';
    const brandColor = isSuperAdmin ? 'text-blue-400' : 'text-orange-500';
    const brandBg = isSuperAdmin ? 'bg-blue-500' : 'bg-orange-500';
    const activeItemBg = isSuperAdmin ? 'bg-gradient-to-r from-blue-600 to-blue-500' : 'bg-orange-500';
    const activeItemShadow = isSuperAdmin ? 'shadow-blue-500/30' : 'shadow-orange-500/20';
    const hoverBg = isSuperAdmin ? 'hover:bg-blue-950/50' : 'hover:bg-slate-800/50';
    const mainBg = isSuperAdmin ? 'bg-slate-900' : 'bg-slate-50';
    const contentBg = isSuperAdmin ? 'bg-slate-950' : 'bg-[#f8fbff]';
    const headerBg = isSuperAdmin ? 'bg-slate-900 border-blue-900/30' : 'bg-white border-slate-200';
    const headerText = isSuperAdmin ? 'text-slate-200' : 'text-slate-900';

    return (
        <div className={cn("min-h-screen flex font-sans", mainBg)}>
            <Toaster position="top-right" />

            {/* Desktop Sidebar */}
            <aside
                className={cn(
                    "hidden md:flex flex-col text-white transition-all duration-300 ease-in-out border-r relative overflow-hidden",
                    sidebarBg,
                    sidebarBorder,
                    isSidebarOpen ? "w-72" : "w-20"
                )}
            >
                {/* Animated background for super admin */}
                {isSuperAdmin && (
                    <>
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl animate-pulse" />
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-cyan-500/5 rounded-full blur-3xl animate-pulse delay-1000" />
                    </>
                )}

                <div className={cn("p-6 flex items-center justify-between border-b mb-4 relative z-10", sidebarBorder)}>
                    {isSidebarOpen ? (
                        <div className="flex items-center gap-2">
                            {isSuperAdmin && (
                                <div className="p-2 bg-blue-500/10 rounded-xl border border-blue-500/20">
                                    <Shield className="text-blue-400" size={20} />
                                </div>
                            )}
                            <h1 className={cn("text-2xl font-black tracking-tighter uppercase", brandColor)}>
                                {isSuperAdmin ? 'Admin' : 'Zestify'}
                            </h1>
                        </div>
                    ) : (
                        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shadow-lg", brandBg)}>
                            {isSuperAdmin ? <Shield size={20} /> : 'Z'}
                        </div>
                    )}
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className={cn("p-1.5 rounded-lg transition-colors", hoverBg)}
                    >
                        {isSidebarOpen ? <X size={20} /> : <MenuIcon size={20} />}
                    </button>
                </div>

                <nav className="flex-1 px-3 space-y-1 relative z-10">
                    {currentMenuItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) => cn(
                                "flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all group relative overflow-hidden",
                                isActive
                                    ? cn(activeItemBg, "text-white shadow-lg", activeItemShadow)
                                    : cn("text-slate-400 hover:text-white", hoverBg)
                            )}
                        >
                            {({ isActive }) => (
                                <>
                                    {isActive && isSuperAdmin && (
                                        <div className="absolute inset-0 bg-gradient-to-r from-blue-400/0 via-blue-400/10 to-blue-400/0 animate-pulse" />
                                    )}
                                    <item.icon size={22} className={cn("flex-shrink-0 transition-transform group-hover:scale-110 relative z-10")} />
                                    {isSidebarOpen && <span className="font-semibold relative z-10">{item.name}</span>}
                                </>
                            )}
                        </NavLink>
                    ))}
                </nav>

                <div className={cn("p-4 border-t relative z-10", sidebarBorder)}>
                    <button
                        onClick={handleLogout}
                        className={cn(
                            "flex items-center gap-3 w-full px-4 py-3.5 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-colors",
                            !isSidebarOpen && "justify-center"
                        )}
                    >
                        <LogOut size={22} />
                        {isSidebarOpen && <span className="font-semibold">Logout</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                {/* Top Navbar */}
                <header className={cn("h-16 border-b flex items-center justify-between px-6 z-10", headerBg)}>
                    <div className="flex items-center gap-4">
                        <button
                            className="md:hidden p-2 text-slate-600"
                            onClick={() => setIsMobileMenuOpen(true)}
                        >
                            <MenuIcon size={24} />
                        </button>
                        <div className={cn("hidden sm:flex items-center gap-2 text-sm font-medium", isSuperAdmin ? "text-slate-400" : "text-slate-400")}>
                            <span className={cn("hover:text-slate-600 transition-colors cursor-pointer capitalize", isSuperAdmin && "hover:text-slate-300")}>
                                {role.replace('_', ' ')}
                            </span>
                            <ChevronRight size={14} />
                            <span className={cn("font-bold capitalize", headerText)}>
                                {location.pathname.split('/').pop().replace('-', ' ')}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        {isSuperAdmin && (
                            <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                                <Zap className="text-blue-400" size={16} />
                                <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">Super Admin</span>
                            </div>
                        )}
                        <div className={cn(
                            "hidden lg:flex items-center px-3 py-2 rounded-xl w-64 border transition-all",
                            isSuperAdmin
                                ? "bg-slate-800 border-blue-900/30 text-slate-400 focus-within:border-blue-500/50 focus-within:bg-slate-800/50"
                                : "bg-slate-100 border-transparent text-slate-500 focus-within:border-orange-200 focus-within:bg-white"
                        )}>
                            <Search size={18} />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="bg-transparent border-none focus:ring-0 text-sm ml-2 w-full placeholder:text-slate-500"
                            />
                        </div>
                        <button className={cn(
                            "p-2 rounded-xl relative transition-colors",
                            isSuperAdmin ? "text-slate-400 hover:bg-slate-800" : "text-slate-500 hover:bg-slate-100"
                        )}>
                            <Bell size={20} />
                            <span className={cn("absolute top-2 right-2 w-2 h-2 rounded-full border-2",
                                isSuperAdmin ? "bg-blue-500 border-slate-900" : "bg-orange-500 border-white"
                            )}></span>
                        </button>
                        <div className={cn(
                            "h-9 w-9 rounded-xl flex items-center justify-center font-bold",
                            isSuperAdmin ? "bg-blue-500/20 text-blue-400 border border-blue-500/30" : "bg-orange-100 text-orange-600"
                        )}>
                            <UserIcon size={20} />
                        </div>
                    </div>
                </header>

                {/* Dynamic Content */}
                <main className={cn("flex-1 overflow-y-auto p-6", contentBg)}>
                    <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <Outlet />
                    </div>
                </main>
            </div>

            {/* Mobile Sidebar Overlay */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-50 md:hidden bg-slate-900/60 backdrop-blur-sm">
                    <div className={cn("w-72 h-full text-white p-6 shadow-2xl animate-in slide-in-from-left duration-300", sidebarBg)}>
                        <div className="flex items-center justify-between mb-8">
                            <h1 className={cn("text-2xl font-black", brandColor)}>
                                {isSuperAdmin ? 'ADMIN' : 'ZESTIFY'}
                            </h1>
                            <button onClick={() => setIsMobileMenuOpen(false)} className={cn("p-2 rounded-lg", hoverBg)}>
                                <X size={24} />
                            </button>
                        </div>
                        <nav className="space-y-2">
                            {currentMenuItems.map((item) => (
                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={({ isActive }) => cn(
                                        "flex items-center gap-4 px-4 py-4 rounded-2xl font-semibold transition-all",
                                        isActive ? cn(activeItemBg, "text-white") : cn("text-slate-400", hoverBg)
                                    )}
                                >
                                    <item.icon size={22} />
                                    {item.name}
                                </NavLink>
                            ))}
                        </nav>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DashboardLayout;
