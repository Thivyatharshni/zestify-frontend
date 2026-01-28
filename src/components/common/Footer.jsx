import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-black text-white pt-24 pb-16">
            <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 lg:px-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-20">

                    <div className="space-y-8">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                                <span className="text-white font-black text-2xl">Z</span>
                            </div>
                            <span className="text-4xl font-black tracking-tighter">Zestify</span>
                        </div>
                        <p className="text-gray-400 text-xl font-medium">
                            © 2024 Zestify Technologies Pvt. Ltd
                        </p>
                    </div>

                    <div>
                        <h3 className="font-black text-white mb-8 uppercase tracking-widest text-xl border-b border-white/10 pb-2">Company</h3>
                        <ul className="space-y-5 text-gray-400 text-xl font-medium">
                            <li><Link to="/about" className="hover:text-white transition-colors">About</Link></li>
                            <li><Link to="/careers" className="hover:text-white transition-colors">Careers</Link></li>
                            <li><Link to="/team" className="hover:text-white transition-colors">Team</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-black text-white mb-8 uppercase tracking-widest text-xl border-b border-white/10 pb-2">Contact</h3>
                        <ul className="space-y-5 text-gray-400 text-xl font-medium">
                            <li><Link to="/help" className="hover:text-white transition-colors">Help & Support</Link></li>
                            <li><Link to="/partner" className="hover:text-white transition-colors">Partner with us</Link></li>
                            <li><Link to="/ride" className="hover:text-white transition-colors">Ride with us</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-black text-white mb-8 uppercase tracking-widest text-xl border-b border-white/10 pb-2">Legal</h3>
                        <ul className="space-y-5 text-gray-400 text-xl font-medium">
                            <li><Link to="/terms" className="hover:text-white transition-colors">Terms & Conditions</Link></li>
                            <li><Link to="/refund" className="hover:text-white transition-colors">Refund & Cancellation</Link></li>
                            <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                            <li><Link to="/cookie" className="hover:text-white transition-colors">Cookie Policy</Link></li>
                        </ul>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
