import React from 'react';
import { Search } from 'lucide-react';
import heroVideo from '@/assets/videos/hero-background.mp4';

const HeroVideoSection = ({ searchText, setSearchText, handleSearch, handleKeyDown }) => {
    return (
        <section className="relative w-full h-screen min-h-[600px] overflow-hidden flex items-center justify-center bg-gray-900">

            {/* Background Video Layer */}
            <video
                autoPlay
                loop
                muted
                playsInline
                className="absolute top-0 left-0 w-full h-full object-cover"
                style={{ zIndex: 0 }}
            >
                <source
                    src={heroVideo}
                    type="video/mp4"
                />
            </video>

            {/* Dark Gradient Overlay */}
            <div
                className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/25 to-black/70"
                style={{ zIndex: 1 }}
            ></div>

            {/* Content Layer */}
            <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
                <div className="space-y-6 md:space-y-10">
                    <div className="space-y-4">
                        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white leading-[1.1] tracking-tight">
                            Taste the <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-200 to-yellow-600">
                                Extraordinary
                            </span>
                        </h1>
                        <p className="text-base sm:text-lg md:text-2xl text-white/80 max-w-2xl mx-auto leading-relaxed drop-shadow-lg">
                            Discover the finest culinary experiences delivered with precision and passion to your doorstep.
                        </p>
                    </div>

                    {/* Search Bar */}
                    <div className="pt-4 md:pt-8 max-w-3xl mx-auto">
                        <div className="group relative">
                            {/* Animated Glow Border */}
                            <div className="absolute -inset-1 bg-gradient-to-r from-orange-600 via-yellow-500 to-orange-400 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-focus-within:opacity-50"></div>

                            <div className="relative flex flex-col md:flex-row items-center bg-white/10 backdrop-blur-3xl border border-white/20 rounded-2xl overflow-hidden shadow-2xl transition-all duration-500 group-focus-within:bg-white/15 group-focus-within:border-white/30">
                                <div className="flex-1 w-full flex items-center px-6 py-1 md:py-0 border-b md:border-b-0 md:border-r border-white/10">
                                    <Search className="text-white/50 mr-4 shrink-0" size={24} />
                                    <input
                                        type="text"
                                        placeholder="Search for your next craving..."
                                        className="w-full py-4 md:py-6 bg-transparent text-white placeholder:text-white/40 focus:outline-none text-lg md:text-xl font-light"
                                        value={searchText}
                                        onChange={(e) => setSearchText(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                    />
                                </div>

                                <button
                                    onClick={handleSearch}
                                    className="w-full md:w-auto bg-white text-black px-12 py-4 md:py-6 font-bold text-lg hover:bg-orange-500 hover:text-white transition-all duration-300 active:scale-95 whitespace-nowrap"
                                >
                                    EXPLORE NOW
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Scroll Indicator */}
                    <div className="pt-8 md:pt-16 flex flex-col items-center gap-4 opacity-70">
                        <div className="w-[1px] h-12 bg-gradient-to-b from-white/0 via-white/50 to-white/0"></div>
                        <span className="text-[10px] uppercase tracking-[0.4em] text-white font-medium">
                            Scroll to browse
                        </span>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroVideoSection;
