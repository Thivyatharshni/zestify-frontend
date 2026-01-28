import React, { createContext, useContext, useState } from 'react';

const LocationContext = createContext(null);

export const LocationProvider = ({ children }) => {
    const [location, setLocation] = useState('New York, NY'); // Default-ish
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <LocationContext.Provider value={{ location, setLocation, isModalOpen, setIsModalOpen }}>
            {children}
        </LocationContext.Provider>
    );
};

export const useLocation = () => useContext(LocationContext);
