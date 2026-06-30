import React, { createContext, useContext, ReactNode } from 'react';

interface MapContextType {
  available: boolean;
}

const MapContext = createContext<MapContextType>({ available: true });

export const useMap = () => useContext(MapContext);

interface MapProviderProps {
  children: ReactNode;
}

export const MapProvider: React.FC<MapProviderProps> = ({ children }) => {
  return (
    <MapContext.Provider value={{ available: true }}>
      {children}
    </MapContext.Provider>
  );
};
