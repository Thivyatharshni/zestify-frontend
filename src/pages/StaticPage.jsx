import React from 'react';
import { useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../routes/RouteConstants';
import Button from '../components/common/Button';

const STATIC_CONTENT = {
    '/about': { title: 'About Us', content: 'Zestify is a premium food delivery service connecting foodies with the best restaurants in town. Founded in 2024, our mission is to deliver happiness in every bite.' },
    '/careers': { title: 'Careers', content: 'Join our team! We are looking for passionate individuals to help us revolutionize the food delivery industry. Check back later for open positions.' },
    '/team': { title: 'Our Team', content: 'Meet the team behind Zestify. A group of food lovers and tech enthusiasts working together.' },
    '/help': { title: 'Help & Support', content: 'Need help? Contact our support team at support@zestify.com or call us at 1-800-ZESTIFY.' },
    '/partner': { title: 'Partner with us', content: 'Grow your business with Zestify. Reach more customers and increase your sales.' },
    '/ride': { title: 'Ride with us', content: 'Become a delivery partner and earn with every delivery. Flexible hours and great pay.' },
    '/terms': { title: 'Terms & Conditions', content: 'By using Zestify, you agree to our terms of service. Please read them carefully.' },
    '/refund': { title: 'Refund & Cancellation', content: 'We genuinely understand that sometimes things go wrong. Read our policy on refunds and cancellations.' },
    '/privacy': { title: 'Privacy Policy', content: 'Your privacy is important to us. Learn how we handle your data.' },
    '/cookie': { title: 'Cookie Policy', content: 'We use cookies to improve your experience. Learn more about our cookie usage.' },
};

const StaticPage = () => {
    const location = useLocation();
    const page = STATIC_CONTENT[location.pathname] || { title: '404', content: 'Page not found' };

    if (page.title === '404') {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">Page Not Found</h1>
                <Link to={ROUTES.HOME}><Button variant="primary">Go Home</Button></Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm p-8">
                <Link to={ROUTES.HOME} className="inline-flex items-center gap-2 text-gray-500 hover:text-blue-600 mb-6 transition-colors">
                    <ArrowLeft size={20} /> Back to Home
                </Link>

                <h1 className="text-3xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">
                    {page.title}
                </h1>

                <div className="prose prose-blue max-w-none text-gray-600 leading-relaxed">
                    <p>{page.content}</p>
                    <p className="mt-4">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default StaticPage;
