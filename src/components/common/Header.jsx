import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation as useRouterLocation } from 'react-router-dom';
import { Search, ShoppingBag, User, MapPin, Menu, X } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useLocation } from '../../context/LocationContext';
import { ROUTES } from '../../routes/RouteConstants';
import Button from './Button';

const Header = () => {
    const { state: cartState } = useCart() || { state: { items: [] } };
    const { user, logout } = useAuth();
    const { location, setIsModalOpen } = useLocation();
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const navigate = useNavigate();
    const routerLocation = useRouterLocation();

    const isHome = routerLocation.pathname === ROUTES.HOME;

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const cartItemCount = (cartState?.items || []).reduce((acc, item) => acc + item.quantity, 0);

    const navBgClass = isHome
        ? (scrolled ? 'bg-white shadow-md border-b border-gray-100 py-4' : 'bg-transparent py-6')
        : 'bg-white shadow-sm border-b border-gray-100 py-4';

    const textColorClass = (isHome && !scrolled) ? 'text-white' : 'text-gray-900';
    const logoBgClass = (isHome && !scrolled) ? 'bg-white/20 backdrop-blur-md' : 'bg-violet-500';
    const logoTextClass = (isHome && !scrolled) ? 'text-white' : 'text-white';

    return (
        <header className={`fixed top-0 z-50 w-full transition-all duration-500 ease-in-out ${navBgClass}`}>
            <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 lg:px-12">
                <div className="flex justify-between items-center">


                    {/* Logo & Location */}
                    <div className="flex items-center gap-8">
                        <Link to={ROUTES.HOME} className="flex items-center gap-2">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors duration-500 ${logoBgClass}`}>
                                <span className={`font-bold text-2xl ${logoTextClass}`}>Z</span>
                            </div>
                            <span className={`font-bold text-2xl tracking-tight hidden sm:block transition-colors duration-500 ${textColorClass}`}>
                                Zestify
                            </span>
                        </Link>

                        <button
                            onClick={() => setIsModalOpen(true)}
                            className={`hidden md:flex items-center gap-2 text-base transition-colors duration-500 group ${isHome && !scrolled ? 'text-white/80 hover:text-white' : 'text-gray-600 hover:text-violet-500'}`}
                        >
                            <MapPin size={20} className={`transition-colors duration-500 ${isHome && !scrolled ? 'text-white/60 group-hover:text-white' : 'text-gray-400 group-hover:text-violet-500'}`} />
                            <span className="max-w-[200px] truncate underline decoration-dotted underline-offset-4 font-medium">
                                {location}
                            </span>
                        </button>
                    </div>

                    {/* Desktop Nav */}
                    <nav className={`hidden md:flex items-center gap-8 transition-colors duration-500 ${textColorClass}`}>
                        <Link to={ROUTES.SEARCH} className={`flex items-center gap-2 text-lg font-semibold transition-colors duration-500 ${isHome && !scrolled ? 'hover:text-orange-400' : 'hover:text-violet-500'}`}>
                            <Search size={22} />
                            <span>Search</span>
                        </Link>

                        <Link to={ROUTES.CART} className={`flex items-center gap-2 text-lg font-semibold transition-colors duration-500 relative ${isHome && !scrolled ? 'hover:text-orange-400' : 'hover:text-violet-500'}`}>
                            <ShoppingBag size={22} />
                            <span>Cart</span>
                            {cartItemCount > 0 && (
                                <span className="absolute -top-1 -right-2 bg-orange-500 text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full shadow-lg">
                                    {cartItemCount}
                                </span>
                            )}
                        </Link>

                        {user ? (
                            <div className="flex items-center gap-4">
                                <Link to={ROUTES.PROFILE} className={`flex items-center gap-2 text-lg font-semibold transition-colors duration-500 ${isHome && !scrolled ? 'hover:text-orange-400' : 'hover:text-violet-500'}`}>
                                    <User size={22} />
                                    <span>{user.name}</span>
                                </Link>
                                <Button variant="ghost" onClick={logout} className={`text-lg font-semibold ${isHome && !scrolled ? 'text-white hover:bg-white/10' : ''}`}>
                                    Logout
                                </Button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-4">
                                <Link to={ROUTES.LOGIN} className={`text-lg font-semibold transition-colors duration-500 ${isHome && !scrolled ? 'hover:text-orange-400 text-white' : 'hover:text-violet-500 text-gray-700'}`}>
                                    Log in
                                </Link>
                                <Link to={ROUTES.SIGNUP}>
                                    <Button variant="primary" size="sm" className={`font-bold transition-all duration-300 ${isHome && !scrolled ? 'bg-white text-black hover:bg-orange-500 hover:text-white' : 'bg-black text-white hover:bg-gray-800'}`}>
                                        Sign up
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </nav>

                    {/* Mobile Menu Button */}
                    <button
                        className={`md:hidden p-2 transition-colors duration-500 ${textColorClass}`}
                        onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-white border-t border-gray-100 absolute w-full shadow-lg">
                    <div className="px-4 py-6 space-y-4">
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="flex items-center gap-3 text-gray-700 w-full p-2 hover:bg-gray-50 rounded"
                        >
                            <MapPin size={20} />
                            <span className="truncate">{location}</span>
                        </button>
                        <Link to={ROUTES.SEARCH} className="flex items-center gap-3 text-gray-700 p-2 hover:bg-gray-50 rounded">
                            <Search size={20} />
                            Search
                        </Link>
                        <Link to={ROUTES.CART} className="flex items-center gap-3 text-gray-700 p-2 hover:bg-gray-50 rounded justify-between">
                            <div className="flex items-center gap-3">
                                <ShoppingBag size={20} />
                                Cart
                            </div>
                            {cartItemCount > 0 && (
                                <span className="bg-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                                    {cartItemCount} items
                                </span>
                            )}
                        </Link>
                        <div className="border-t border-gray-100 pt-4">
                            {user ? (
                                <>
                                    <Link to={ROUTES.PROFILE} className="flex items-center gap-3 text-gray-700 p-2 hover:bg-gray-50 rounded">
                                        <User size={20} />
                                        Profile
                                    </Link>
                                    <Button variant="ghost" className="w-full justify-start text-red-600 hover:text-red-700 mt-2" onClick={logout}>
                                        Logout
                                    </Button>
                                </>
                            ) : (
                                <div className="grid grid-cols-2 gap-4">
                                    <Link to={ROUTES.LOGIN}>
                                        <Button variant="ghost" className="w-full justify-center">Log in</Button>
                                    </Link>
                                    <Link to={ROUTES.SIGNUP}>
                                        <Button variant="primary" className="w-full justify-center">Sign up</Button>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;
