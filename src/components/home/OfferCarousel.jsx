import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { couponApi } from '../../services/couponApi';
import { COUPONS } from '../../mocks/coupons.mock';

const OfferCarousel = () => {
    const [lanes, setLanes] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const scrollRef = useRef(null);

    useEffect(() => {
        const fetchOffers = async () => {
            try {
                const coupons = await couponApi.getApplicableCoupons();
                const backendCoupons = Array.isArray(coupons) ? coupons : [];
                const merged = [...backendCoupons];

                COUPONS.forEach(mockC => {
                    if (!merged.find(c => c.code === mockC.code)) {
                        merged.push(mockC);
                    }
                });

                setLanes(merged.map(c => ({
                    id: c.code,
                    image: c.image || "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1600&q=95",
                    title: c.title || "Exclusive Offer",
                    description: c.description || `Get ${c.discount || c.value}% off!`
                })));
            } catch (error) {
                console.error("Failed to fetch offers:", error);
                setLanes(COUPONS.map(c => ({
                    id: c.code,
                    image: c.image || "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1600&q=95",
                    title: c.title || "Exclusive Offer",
                    description: c.description || `Get ${c.discount}% off!`
                })));
            } finally {
                setLoading(false);
            }
        };
        fetchOffers();
    }, []);

    const scroll = (direction) => {
        if (scrollRef.current) {
            const { scrollLeft, clientWidth } = scrollRef.current;
            const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
            scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
        }
    };

    if (loading) return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="h-64 bg-gray-100 animate-pulse rounded-3xl"></div>
        </div>
    );

    if (lanes.length === 0) return null;

    return (
        <section className="py-12 bg-white group/carousel">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-3xl font-black text-gray-900 tracking-tight">Best offers for you</h2>
                    <div className="flex gap-3">
                        <button
                            onClick={() => scroll('left')}
                            className="p-3 rounded-full bg-white shadow-lg border border-gray-100 hover:bg-orange-500 hover:text-white transition-all transform active:scale-95"
                        >
                            <ChevronLeft size={24} />
                        </button>
                        <button
                            onClick={() => scroll('right')}
                            className="p-3 rounded-full bg-white shadow-lg border border-gray-100 hover:bg-orange-500 hover:text-white transition-all transform active:scale-95"
                        >
                            <ChevronRight size={24} />
                        </button>
                    </div>
                </div>

                <div
                    ref={scrollRef}
                    className="flex overflow-x-auto gap-6 no-scrollbar snap-x snap-mandatory scroll-smooth pb-4"
                >
                    {lanes.map((lane) => (
                        <div
                            key={lane.id}
                            className="flex-shrink-0 w-full md:w-[480px] h-[260px] md:h-[280px] snap-start relative rounded-[2rem] overflow-hidden shadow-xl hover:shadow-2xl transition-all group cursor-pointer"
                        >
                            <img
                                src={lane.image}
                                alt={lane.title}
                                loading="lazy"
                                onError={(e) => e.target.src = "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1600&q=95"}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                            <div className="absolute bottom-0 left-0 p-8 text-white">
                                <h3 className="text-3xl font-black mb-2 tracking-tighter uppercase drop-shadow-lg">
                                    {lane.title}
                                </h3>
                                <p className="text-white/80 font-bold drop-shadow">
                                    {lane.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <style jsx="true">{`
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </section>
    );
};

export default OfferCarousel;