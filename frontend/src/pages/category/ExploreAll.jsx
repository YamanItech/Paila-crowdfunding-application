import React, { useState } from "react";
import art from "../../assets/background.jpg";
import { Search } from "lucide-react";
import getAxios from "../../hooks/getAxios.jsx";
import Header from "../../Components/Header.jsx";
import Footer from "../../Components/Footer.jsx";
import Card from "../../Components/Card.jsx";
import { useSearch } from "../../router/SearchContext.jsx";

function ExploreAll() {
  // Get search query from context
  const { searchQuery, setSearchQuery } = useSearch();

  // Local state for input value - separate from the context search query
  const [inputValue, setInputValue] = useState(searchQuery);

  // State for tracking loading state separately
  const [isSearching, setIsSearching] = useState(false);

  // Use a separate state to track when to fetch data
  const [fetchTrigger, setFetchTrigger] = useState(0);

  // Custom hook with API endpoint that includes search query
  const { data, loading, error } = getAxios(
    `http://localhost:8000/api/v1/company/allprojects?search=${searchQuery}`,
    [fetchTrigger] // Only depend on fetchTrigger
  );

  // Handle local search input change - updates local state only
  const handleSearchChange = (e) => {
    setInputValue(e.target.value);
  };

  // Handle search form submission - only triggers search on form submit
  const handleSearch = (e) => {
    e.preventDefault();
    setIsSearching(true);
    setSearchQuery(inputValue);
    setFetchTrigger(prev => prev + 1);
  };

  // Handle key press for search input
  const handleKeyDown = (e) => {
    // Only proceed if Enter key is pressed
    if (e.key === 'Enter') {
      handleSearch(e);
    }
  };

  // Show loading indicator while fetching data
  if (loading && !isSearching) return (
    <>
      <Header />
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-coral-500 mb-4"></div>
          <p className="text-gray-600">Loading projects...</p>
        </div>
      </div>
      <Footer />
    </>
  );

  return (
    <>
      <Header />

      <div className="bg-white">
        <div className="relative h-[400px] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0">
            <img src={art} alt="All Categories" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black bg-opacity-50" />
          </div>
          <h1 className="relative text-white text-7xl font-bold tracking-wider">Explore All</h1>
        </div>

        <div className="bg-white py-6 border-b">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-center gap-8 items-center">
              <form onSubmit={handleSearch} className="relative w-full max-w-lg">
                <input
                  type="text"
                  placeholder="Search and press Enter..."
                  value={inputValue}
                  onChange={handleSearchChange}
                  onKeyDown={handleKeyDown}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-coral-400 text-gray-700"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-coral-400" size={18} />
                {isSearching && loading && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-coral-500"></div>
                  </div>
                )}
                {!loading && (
                  <button
                    type="submit"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-coral-500 hover:text-coral-700 focus:outline-none"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                )}
              </form>
            </div>
          </div>
        </div>

        {/* Error message displayed below search box */}
        {error && (
          <div className="w-full max-w-lg mx-auto mt-4">
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-center justify-center">
              <p>Error loading projects. Please try again later.</p>
            </div>
          </div>
        )}

        <div className="p-5 container mx-auto">
          {searchQuery && !error && (
            <div className="mb-6">
              <h2 className="text-xl font-medium text-gray-700">
                Search results for: <span className="text-coral-500">"{searchQuery}"</span>
              </h2>
            </div>
          )}

          {!error && data?.data && data.data.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-lg text-gray-500">No projects found matching your search.</h3>
            </div>
          ) : !error && data?.data ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {data.data.map((projectData) => (
                <div key={projectData._id}>
                  <Card project={projectData} />
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      <Footer />
    </>
  );
}

export default ExploreAll;