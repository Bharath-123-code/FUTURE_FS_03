import React, { createContext, useState, useContext, useEffect } from 'react';
import { fetchMenuItems } from '../api';

const SearchContext = createContext();

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};

export const SearchProvider = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const updateSearchQuery = (query) => {
    console.log('SearchContext: updateSearchQuery called with:', query);
    console.log('SearchContext: Setting searchQuery to:', query);
    setSearchQuery(query);
    console.log('SearchContext: searchQuery state updated');
  };

  useEffect(() => {
    console.log('SearchContext: useEffect triggered with searchQuery:', searchQuery);
    if (!searchQuery.trim()) {
      console.log('SearchContext: Empty query, clearing results');
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    console.log('SearchContext: Starting search for:', searchQuery);
    setIsSearching(true);
    console.log('SearchContext: isSearching set to true');
    const timeoutId = setTimeout(async () => {
      try {
        console.log('SearchContext: Making API call for:', searchQuery);
        const data = await fetchMenuItems(null, searchQuery);
        console.log('SearchContext: API response received:', data);
        console.log('SearchContext: API response type:', typeof data);
        console.log('SearchContext: API response length:', data?.length);
        console.log('SearchContext: Setting searchResults');
        setSearchResults(data);
        console.log('SearchContext: searchResults state updated');
      } catch (error) {
        console.error('Search failed:', error);
        console.log('SearchContext: Setting empty results due to error');
        setSearchResults([]);
      } finally {
        console.log('SearchContext: Setting isSearching to false');
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const performSearch = async (query) => {
    // This function is kept for compatibility but not used with debouncing
    try {
      const data = await fetchMenuItems(null, query);
      setSearchResults(data);
    } catch (error) {
      console.error('Search failed:', error);
      setSearchResults([]);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
  };

  return (
    <SearchContext.Provider value={{
      searchQuery,
      searchResults,
      isSearching,
      updateSearchQuery,
      performSearch,
      clearSearch
    }}>
      {children}
    </SearchContext.Provider>
  );
};