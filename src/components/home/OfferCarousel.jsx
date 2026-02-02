import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { couponApi } from '../../services/couponApi';
import { COUPONS } from '../../mocks/coupons.mock';
import offerVideo1 from '../../assets/videos/offer1.mp4';
import offerVideo2 from '../../assets/videos/offer2.mp4';
import offerVideo3 from '../../assets/videos/offer3.mp4';

const OfferCarousel = () => {
  const [lanes, setLanes] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);


  const videos = [offerVideo1, offerVideo2, offerVideo3];

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

        setLanes(
          merged.map(c => ({
            id: c.code,
            image: c.image,
            title: c.title || 'Exclusive Offer',
            description: c.description || `Get ${c.discount || c.value}% off!`
          }))
        );
      } catch {
        setLanes(
          COUPONS.map(c => ({
            id: c.code,
            image: c.image,
            title: c.title || 'Exclusive Offer',
            description: c.description || `Get ${c.discount}% off!`
          }))
        );
      } finally {
        setLoading(false);
      }
    };
    fetchOffers();
  }, []);

  // Visibility Check (Intersection Observer)
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.3 } // Trigger when 30% visible
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  // Auto rotation (desktop) - Slower (6s)
  useEffect(() => {
    if (lanes.length < 2) return;
    const interval = setInterval(
      () => setActiveIndex(prev => (prev + 1) % lanes.length),
      6000 // Reduced speed (Slower: 4s + 2s = 6s)
    );
    return () => clearInterval(interval);
  }, [lanes.length]);

  const triggerJackpotAnimation = () => {
    const center = { x: 0.5, y: 0.5 };

    // Burst 1: Central Paper Explosion
    confetti({
      particleCount: 160,
      spread: 110,
      origin: center,
      colors: ['#FFD700', '#FF4500', '#FF0055', '#00E5FF', '#76FF03'],
      shapes: ['square', 'circle'],
      scalar: 1,
      startVelocity: 50,
      disableForReducedMotion: true,
      zIndex: 200,
    });

    // Burst 2: Side Cannons
    setTimeout(() => {
      confetti({
        particleCount: 60,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.8 },
        colors: ['#FFD700', '#FF0055'],
        shapes: ['square'],
        zIndex: 200,
      });
      confetti({
        particleCount: 60,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.8 },
        colors: ['#00E5FF', '#76FF03'],
        shapes: ['square'],
        zIndex: 200,
      });
    }, 200);

    // Burst 3: Rain
    setTimeout(() => {
      confetti({
        particleCount: 100,
        spread: 160,
        origin: { x: 0.5, y: 0.4 },
        colors: ['#FFFFFF', '#FFD700'],
        shapes: ['circle'],
        scalar: 0.6,
        gravity: 0.8,
        ticks: 400,
        startVelocity: 20,
        zIndex: 200,
      });
    }, 400);
  };

  // Auto-Trigger Animation on Slide Change
  useEffect(() => {
    if (loading || lanes.length === 0 || !isVisible) return; // Only if visible

    // Trigger Jackpot Animation
    triggerJackpotAnimation();
  }, [activeIndex, loading, lanes.length, isVisible]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="h-64 bg-gray-100 animate-pulse rounded-3xl" />
      </div>
    );
  }

  if (!lanes.length) return null;

  return (
    <section ref={sectionRef} className="py-14 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* 🔥 HEADING */}
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-4xl font-extrabold tracking-tight text-gray-900 flex items-center gap-3">
            🔥 Best offers for you ✨
          </h2>

          <div className="flex gap-3">
            <button
              onClick={() =>
                setActiveIndex(prev => (prev - 1 + lanes.length) % lanes.length)
              }
              className="p-3 rounded-full bg-white shadow-lg border hover:bg-orange-500 hover:text-white transition"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={() =>
                setActiveIndex(prev => (prev + 1) % lanes.length)
              }
              className="p-3 rounded-full bg-white shadow-lg border hover:bg-orange-500 hover:text-white transition"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>

        {/* ================= DESKTOP STACK (UI ENHANCED) ================= */}
        <div className="hidden lg:block relative max-w-6xl mx-auto">
          <div className="relative h-[420px] flex items-center justify-center">
            {[0, 1, 2].map(pos => {
              const index = (activeIndex + pos) % lanes.length;
              const videoSrc = videos[index % videos.length];

              const styles = [
                'z-30 scale-110 opacity-100',
                'z-20 scale-90 -translate-x-[360px] opacity-60',
                'z-10 scale-90 translate-x-[360px] opacity-60'
              ];

              return (
                <div
                  key={lanes[index].id}
                  className={`absolute transition-all duration-700 ease-out ${styles[pos]}`}
                >
                  {/* WRAPPER CONTAINER - Allows badges to overflow */}
                  <div className="relative w-[520px] h-[380px]">

                    {/* 🔥 PLAYFUL FLOATING BADGES - Like stickers casually placed */}


                    {/* CARD - Clipped content (No click effect) */}
                    <div
                      className="relative w-full h-full rounded-[2.5rem] overflow-hidden shadow-2xl ring-4 ring-orange-400/20 group animate-pop"
                    >

                      {/* 🎥 VIDEO */}
                      <video
                        src={videoSrc}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover"
                      />

                      {/* GRADIENT */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                      {/* TEXT */}
                      <div className="absolute bottom-0 left-0 p-8 text-white">
                        <h3 className="text-3xl font-extrabold tracking-tight uppercase drop-shadow-lg">
                          {lanes[index].title}
                        </h3>
                        <p className="mt-1 text-lg font-semibold text-white/90">
                          {lanes[index].description} 😍
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ================= MOBILE / TABLET (UNCHANGED) ================= */}
        <div
          ref={scrollRef}
          className="lg:hidden flex overflow-x-auto gap-6 no-scrollbar snap-x snap-mandatory scroll-smooth pb-4"
        >
          {lanes.map((lane, index) => {
            const videoSrc =
              index === 0 ? offerVideo1 : index === 1 ? offerVideo2 : offerVideo3;

            return (
              <div
                key={lane.id}
                className="flex-shrink-0 w-full md:w-[480px] h-[260px] md:h-[280px] snap-start relative rounded-[2rem] overflow-hidden shadow-xl"
              >
                <video
                  src={videoSrc}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 p-8 text-white">
                  <h3 className="text-3xl font-black mb-2 uppercase">
                    {lane.title}
                  </h3>
                  <p className="text-white/80 font-bold">
                    {lane.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ANIMATIONS */}
      <style jsx="true">{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          scrollbar-width: none;
        }
        @keyframes pop {
          0% { transform: scale(0.95); }
          100% { transform: scale(1); }
        }
        .animate-pop {
          animation: pop 0.6s ease-out;
        }
        
        /* Floating badge animations - subtle, playful movement */
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }
        @keyframes float-medium {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        @keyframes float-fast {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }
        .animate-float-slow {
          animation: float-slow 3s ease-in-out infinite;
        }
        .animate-float-medium {
          animation: float-medium 2.5s ease-in-out infinite;
        }
        .animate-float-fast {
          animation: float-fast 2s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};

export default OfferCarousel;
