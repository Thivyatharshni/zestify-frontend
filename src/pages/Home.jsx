import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../routes/RouteConstants';
import LocationModal from '../components/home/LocationModal';
import CategorySlider from '../components/home/CategorySlider';
import FoodLanes from '../components/home/FoodLanes';
import ExclusiveOffers from '../components/home/OfferCarousel';
import FilterBar from '../components/home/FilterBar';
import RestaurantGrid from '../components/home/RestaurantGrid';
import HeroVideoSection from '../components/home/HeroVideoSection';

const Home = () => {
  const [searchText, setSearchText] = useState('');
  const [activeFilters, setActiveFilters] = useState([]);
  const navigate = useNavigate();

  const handleSearch = () => {
    if (searchText.trim()) {
      navigate(`${ROUTES.SEARCH}?q=${encodeURIComponent(searchText)}`);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  const toggleFilter = (filter) => {
    if (activeFilters.includes(filter)) {
      setActiveFilters(activeFilters.filter(f => f !== filter));
    } else {
      setActiveFilters([...activeFilters, filter]);
    }
  };

  return (
    <div className="min-h-screen bg-white pb-24 overflow-x-hidden">
      <LocationModal />

      <HeroVideoSection
        searchText={searchText}
        setSearchText={setSearchText}
        handleSearch={handleSearch}
        handleKeyDown={handleKeyDown}
      />

      {/* Expansive Category Section */}
      <div className="relative z-20 mb-4">
        <CategorySlider />
      </div>

      {/* Immersive Food Lanes Section */}
      <div className="relative z-10 mb-4">
        <FoodLanes />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <section className="mb-4">
          <ExclusiveOffers />
        </section>

        <section className="mb-24">
          <div className="sticky top-20 z-40 bg-white/90 backdrop-blur-md py-4 mb-12 border-b border-gray-100">
            <FilterBar activeFilters={activeFilters} onToggle={toggleFilter} />
          </div>
          <RestaurantGrid activeFilters={activeFilters} />
        </section>
      </div>
    </div>
  );
};

export default Home;
