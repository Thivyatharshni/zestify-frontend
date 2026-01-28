import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { ROUTES } from './RouteConstants';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

// Pages
import Home from '../pages/Home';
import Login from '../pages/Auth/Login';
import Signup from '../pages/Auth/Signup';
import Search from '../pages/Search';
import Restaurant from '../pages/Restaurant';
import Cart from '../pages/Cart';
import Checkout from '../pages/Checkout';
import Orders from '../pages/Orders';
import OrderTracking from '../pages/OrderTracking';
import Profile from '../pages/Profile';
import CategoryPage from '../pages/CategoryPage';
import NotFound from '../pages/NotFound';

const Layout = ({ children }) => {
    const location = useLocation();
    const hideHeaderFooter = [ROUTES.LOGIN, ROUTES.SIGNUP].includes(location.pathname);

    return (
        <>
            {!hideHeaderFooter && <Header />}
            <main className="min-h-[calc(100vh-80px-300px)]">
                {children}
            </main>
            {!hideHeaderFooter && <Footer />}
        </>
    );
};

// Wrapper for routes that need the layout
const PageWrapper = ({ component: Component }) => (
    <Layout>
        <Component />
    </Layout>
);

// ... imports
import StaticPage from '../pages/StaticPage';

// ... existing code

const AppRoutes = () => {
    return (
        <Routes>
            <Route path={ROUTES.HOME} element={<PageWrapper component={Home} />} />
            <Route path={ROUTES.LOGIN} element={<Login />} />
            <Route path={ROUTES.SIGNUP} element={<Signup />} />
            <Route path={ROUTES.SEARCH} element={<PageWrapper component={Search} />} />
            <Route path={ROUTES.RESTAURANT} element={<PageWrapper component={Restaurant} />} />
            <Route path={ROUTES.CART} element={<PageWrapper component={Cart} />} />
            <Route path={ROUTES.CHECKOUT} element={<PageWrapper component={Checkout} />} />
            <Route path={ROUTES.ORDERS} element={<PageWrapper component={Orders} />} />
            <Route path={ROUTES.ORDER_TRACKING} element={<PageWrapper component={OrderTracking} />} />
            <Route path={ROUTES.PROFILE} element={<PageWrapper component={Profile} />} />
            <Route path="/category/:categorySlug" element={<PageWrapper component={CategoryPage} />} />

            {/* Static Pages */}
            <Route path="/about" element={<PageWrapper component={StaticPage} />} />
            <Route path="/careers" element={<PageWrapper component={StaticPage} />} />
            <Route path="/team" element={<PageWrapper component={StaticPage} />} />
            <Route path="/help" element={<PageWrapper component={StaticPage} />} />
            <Route path="/partner" element={<PageWrapper component={StaticPage} />} />
            <Route path="/ride" element={<PageWrapper component={StaticPage} />} />
            <Route path="/terms" element={<PageWrapper component={StaticPage} />} />
            <Route path="/refund" element={<PageWrapper component={StaticPage} />} />
            <Route path="/privacy" element={<PageWrapper component={StaticPage} />} />
            <Route path="/cookie" element={<PageWrapper component={StaticPage} />} />

            <Route path="*" element={<PageWrapper component={NotFound} />} />
        </Routes>
    );
};

export default AppRoutes;
