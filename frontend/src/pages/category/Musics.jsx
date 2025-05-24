import React, { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import music from "../../assets/music.webp";
import {
    ChevronDown,
    Paintbrush2,
    Cpu,
    Music2,
    BookOpen,
    Gamepad2,
    Utensils,
    Search,
    Loader2
} from "lucide-react";

import Header from "../../Components/Header";
import Footer from "../../Components/Footer";
import Card from "../../Components/Card";

function Musics() {
    const [search, setSearch] = useState("");
    const [data, setData] = useState({ data: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isHovered, setIsHovered] = useState(false);
    const hoverTimeout = useRef(null);
    const dropdownRef = useRef(null);
    useEffect(() => {
        window.scrollTo(0, 0);
    });

    // Fetch data with proper error handling
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await fetch(
                  `http://localhost:8000/api/v1/company/projects/category/Musics?search=${search}`
                );

                if (!response.ok) {
                    throw new Error(`API error: ${response.status}`);
                }

                const result = await response.json();
                setData(result);
                setError(null);
            } catch (err) {
                console.error("Failed to fetch projects:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        // Debounce search requests
        const timeoutId = setTimeout(() => {
            fetchData();
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [search]);

    // Clean up timeout on unmount
    useEffect(() => {
        return () => {
            if (hoverTimeout.current) {
                clearTimeout(hoverTimeout.current);
            }
        };
    }, []);

    // Handle click outside for dropdown
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsHovered(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleMouseEnter = () => {
        clearTimeout(hoverTimeout.current);
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        hoverTimeout.current = setTimeout(() => {
            setIsHovered(false);
        }, 300);
    };

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
    };

    const categories = [
        { name: "Art", icon: <Paintbrush2 size={18} />, path: "/category/art" },
        { name: "Technology", icon: <Cpu size={18} />, path: "/category/technology" },
        { name: "Music", icon: <Music2 size={18} />, path: "/category/music" },
        { name: "Publishing", icon: <BookOpen size={18} />, path: "/category/publishing" },
        { name: "Games", icon: <Gamepad2 size={18} />, path: "/category/games" },
        { name: "Food", icon: <Utensils size={18} />, path: "/category/food" }
    ];

    return (
      <>
          <Header />

          <div className="min-h-screen bg-white">
              {/* Hero section with background image */}
              <div className="relative h-[400px] flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0">
                      <img src={music} alt="All Categories" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black bg-opacity-50" />
                  </div>
                  <h1 className="relative text-white text-7xl font-bold tracking-wider">Musics</h1>
              </div>

              {/* Search and filter bar */}
              <div className="bg-white py-6 border-b">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                      <div className="flex justify-center gap-8 items-center">
                          <div className="relative w-full max-w-lg">
                              {/* Search Input with ARIA attributes */}
                              <input
                                type="text"
                                value={search}
                                onChange={handleSearchChange}
                                placeholder="Search projects..."
                                aria-label="Search projects"
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-coral-400 text-gray-700"
                              />
                              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-coral-400" size={18} />
                          </div>

                          {/* Dropdown menu with accessibility */}
                          <div
                            ref={dropdownRef}
                            className="relative"
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                          >
                              <button
                                className="flex items-center gap-1 text-gray-700 hover:text-coral-500 font-medium transition-colors"
                                aria-expanded={isHovered}
                                aria-haspopup="true"
                              >
                                  Explore
                                  <ChevronDown
                                    className={`h-5 w-5 transition-transform ${isHovered ? "rotate-180" : ""}`}
                                  />
                              </button>

                              {isHovered && (
                                <div className="absolute left-1/2 -translate-x-1/2 top-full z-10 mt-2 w-64 rounded-xl border border-gray-100 bg-white p-4 shadow-xl">
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 w-4 h-4 rotate-45 bg-white border-l border-t border-gray-100"></div>
                                    <ul className="space-y-3" role="menu">
                                        {categories.map((category) => (
                                          <li key={category.name} className="flex items-center gap-2 group" role="menuitem">
                          <span className="text-coral-400 group-hover:text-coral-600">
                            {category.icon}
                          </span>
                                              <Link
                                                to={category.path}
                                                className="flex-1 text-gray-600 group-hover:text-coral-600"
                                              >
                                                  {category.name}
                                              </Link>
                                          </li>
                                        ))}
                                    </ul>
                                </div>
                              )}
                          </div>
                      </div>
                  </div>
              </div>

              {/* Content display with different states */}
              <div className="p-5 bg-main-bg min-h-[300px]">
                  {loading ? (
                    <div className="flex flex-col items-center justify-center p-10">
                        <Loader2 className="h-10 w-10 animate-spin text-coral-500 mb-4" />
                        <p className="text-gray-500">Loading projects...</p>
                    </div>
                  ) : error ? (
                    <div className="text-center p-10">
                        <p className="text-red-500 font-medium">Error: {error}</p>
                        <button
                          onClick={() => window.location.reload()}
                          className="mt-4 px-4 py-2 bg-coral-500 text-white rounded-lg hover:bg-coral-600"
                        >
                            Try Again
                        </button>
                    </div>
                  ) : Array.isArray(data?.data) && data.data.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {data.data.map((projectData) => (
                          <Card key={projectData._id} project={projectData} />
                        ))}
                    </div>
                  ) : (
                    <div className="text-center p-10">
                        <p className="text-gray-500">No projects found. Try a different search term.</p>
                    </div>
                  )}
              </div>
          </div>

          <Footer />
      </>
    );
}

export default Musics;