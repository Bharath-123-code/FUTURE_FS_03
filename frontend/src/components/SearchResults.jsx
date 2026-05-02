import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useSearch } from '../context/SearchContext';
import ProductCard from './ProductCard';
import Skeleton from './Skeleton';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const { searchQuery, searchResults, isSearching, updateSearchQuery } = useSearch();
  const [localQuery, setLocalQuery] = useState('');

  // Get query from URL params on component mount
  React.useEffect(() => {
    const queryFromUrl = searchParams.get('q');
    if (queryFromUrl) {
      setLocalQuery(queryFromUrl);
      updateSearchQuery(queryFromUrl);
    } else if (searchQuery) {
      setLocalQuery(searchQuery);
    }
  }, [searchParams, searchQuery, updateSearchQuery]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (localQuery.trim()) {
      // Update URL with search query
      const newUrl = `/search?q=${encodeURIComponent(localQuery.trim())}`;
      window.history.pushState({}, '', newUrl);
      updateSearchQuery(localQuery.trim());
    }
  };

  const handleInputChange = (e) => {
    setLocalQuery(e.target.value);
  };

  if (!searchQuery && !localQuery) {
    return (
      <div className="min-h-screen bg-transparent py-20 px-6">
        <div className="container mx-auto relative z-10">
          <div className="text-center">
            <h1 className="text-4xl font-serif bg-gradient-to-r from-navy-blue to-primary bg-clip-text text-transparent mb-8">🔍 Search Results</h1>
            <p className="text-gray-600 mb-8 text-lg">Please enter a search query to find dishes.</p>
            
            {/* Search Form */}
            <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto">
              <div className="flex gap-4">
                <input
                  type="text"
                  placeholder="Search for dishes..."
                  value={localQuery}
                  onChange={handleInputChange}
                  className="flex-1 px-6 py-3 rounded-full border-2 border-primary/30 focus:border-primary focus:outline-none text-lg shadow-sm focus:shadow-lg transition-all"
                />
                <button
                  type="submit"
                  className="px-8 py-3 bg-gradient-to-r from-primary to-orange-500 text-white rounded-full hover:shadow-lg transition-all font-semibold"
                >
                  Search
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent py-20 px-6">
      <div className="container mx-auto relative z-10">
        {/* Header with Search */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-serif bg-gradient-to-r from-navy-blue to-primary bg-clip-text text-transparent mb-4">🔍 Search Results</h1>
          
          {/* Search Form */}
          <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto mb-8">
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="Search for dishes..."
                value={localQuery}
                onChange={handleInputChange}
                className="flex-1 px-6 py-3 rounded-full border-2 border-gray-300 focus:border-primary focus:outline-none text-lg"
              />
              <button
                type="submit"
                className="px-8 py-3 bg-primary text-white rounded-full hover:bg-opacity-90 transition-all font-semibold"
              >
                Search
              </button>
            </div>
          </form>

          {searchQuery && (
            <p className="text-gray-600">
              {isSearching ? (
                <span>Searching for <strong>"{searchQuery}"</strong>...</span>
              ) : (
                <span>
                  Found {searchResults.length} results for <strong>"{searchQuery}"</strong>
                </span>
              )}
            </p>
          )}
        </div>

        {/* Loading State */}
        {isSearching && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <div className="p-4">
                  <Skeleton variant="text" className="h-6 w-3/4 mb-2" />
                  <Skeleton variant="text" className="h-4 w-full mb-2" />
                  <Skeleton variant="text" className="h-4 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Search Results */}
        {!isSearching && searchResults.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {searchResults.map((item, index) => (
              <ProductCard key={`${item.id}-${index}`} product={item} />
            ))}
          </div>
        )}

        {/* No Results */}
        {!isSearching && searchQuery && searchResults.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-2xl font-serif-bold text-deep-charcoal mb-4">
              No dishes found
            </h2>
            <div className="bg-yellow-100 border border-yellow-300 rounded p-4 mb-8">
              <p className="text-sm text-yellow-800">
                <strong>DEBUG:</strong> No dishes found for "{searchQuery}"
              </p>
              <p className="text-xs text-yellow-700 mt-2">
                searchQuery: "{searchQuery}" | searchResults.length: {searchResults.length} | isSearching: {isSearching ? 'true' : 'false'}
              </p>
            </div>
            <p className="text-gray-600 mb-8">
              We couldn't find any dishes matching "<strong>{searchQuery}</strong>"
            </p>
            <div className="space-y-2 text-left max-w-md mx-auto">
              <p className="text-sm text-gray-500">Try:</p>
              <ul className="text-sm text-gray-500 list-disc list-inside">
                <li>Checking your spelling</li>
                <li>Using more general keywords</li>
                <li>Searching for ingredients (e.g., "chicken", "pasta")</li>
                <li>Browsing our categories instead</li>
              </ul>
            </div>
            <button
              onClick={() => window.history.pushState({}, '', '/')}
              className="mt-8 px-6 py-3 bg-primary text-white rounded-full hover:bg-opacity-90 transition-all font-semibold"
            >
              Browse Menu
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
