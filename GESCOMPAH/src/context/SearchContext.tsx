import React, { createContext, useContext, useState, ReactNode } from 'react';
import { FilterValues } from '../components/SearchFilterModal';
import { Establishment } from '../api/types/establishment';

interface SearchContextType {
  appliedFilters: FilterValues | null;
  setAppliedFilters: (filters: FilterValues | null) => void;
  navigateToDetails?: (establishment: Establishment) => void;
  setNavigateToDetails: (fn: (establishment: Establishment) => void) => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};

interface SearchProviderProps {
  children: ReactNode;
}

export const SearchProvider: React.FC<SearchProviderProps> = ({ children }) => {
  const [appliedFilters, setAppliedFilters] = useState<FilterValues | null>(null);
  const [navigateToDetails, setNavigateToDetails] = useState<((establishment: Establishment) => void) | undefined>();

  return (
    <SearchContext.Provider value={{
      appliedFilters,
      setAppliedFilters,
      navigateToDetails,
      setNavigateToDetails
    }}>
      {children}
    </SearchContext.Provider>
  );
};