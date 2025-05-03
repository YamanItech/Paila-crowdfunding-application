import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import technology from "../../assets/tech.jpeg"
import {
    ChevronDown,
    Paintbrush2,
    Cpu,
    Music2,
    BookOpen,
    Gamepad2,
    Utensils,
    Search,
} from "lucide-react";
import getAxios from "../../hooks/getAxios.jsx";
import Header from "../../Components/Header.jsx";
import Footer from "../../Components/Footer.jsx";
import Card from "../../Components/Card.jsx";

function Technology() {
    const { data, loading } = getAxios("http://localhost:8000/api/v1/company/projects/category/Technology");
    const [isHovered, setIsHovered] = useState(false);
    const hoverTimeout = useRef(null);

    const handleMouseEnter = () => {
        clearTimeout(hoverTimeout.current);
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        hoverTimeout.current = setTimeout(() => {
            setIsHovered(false);
        }, 300);
    };

    if (loading) return <div>Loading...</div>;
    if (!Array.isArray(data?.data)) return <div>Error loading projects.</div>;

    return (
        <>
            <Header />

            <div className="min-h-screen bg-white">
                <div className="relative h-[400px] flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0">
                        <img src={technology} alt="All Categories" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black bg-opacity-50" />
                    </div>
                    <h1 className="relative text-white text-7xl font-bold tracking-wider">Technology</h1>
                </div>

                <div className="bg-white py-6 border-b">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-center gap-8 items-center">
                            <div className="relative w-full max-w-lg">
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-coral-400 text-gray-700"
                                />
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-coral-400" size={18} />
                            </div>

                            <div
                                className="relative"
                                onMouseEnter={handleMouseEnter}
                                onMouseLeave={handleMouseLeave}
                            >
                                <button className="flex items-center gap-1 text-gray-700 hover:text-coral-500 font-medium transition-colors">
                                    Explore
                                    <ChevronDown className={`h-5 w-5 transition-transform ${isHovered ? "rotate-180" : ""}`} />
                                </button>

                                {isHovered && (
                                    <div className="absolute left-[50%] -translate-x-1/2 top-full z-10 mt-2 w-64 rounded-xl border border-gray-100 bg-white p-4 shadow-xl">
                                        <div className="absolute top-0 left-[50%] -translate-x-1/2 -translate-y-2 w-4 h-4 rotate-45 bg-white border-l border-t border-gray-100"></div>
                                        <ul className="space-y-3">
                                            <li className="flex items-center gap-2 group">
        <span className="text-coral-400 group-hover:text-coral-600">
          <Paintbrush2 size={18} />
        </span>
                                                <Link to="/category/art" className="flex-1 text-gray-600 group-hover:text-coral-600">
                                                    Art
                                                </Link>
                                            </li>
                                            <li className="flex items-center gap-2 group">
        <span className="text-coral-400 group-hover:text-coral-600">
          <Cpu size={18} />
        </span>
                                                <Link to="/category/technology" className="flex-1 text-gray-600 group-hover:text-coral-600">
                                                    Technology
                                                </Link>
                                            </li>
                                            <li className="flex items-center gap-2 group">
        <span className="text-coral-400 group-hover:text-coral-600">
          <Music2 size={18} />
        </span>
                                                <Link to="/category/music" className="flex-1 text-gray-600 group-hover:text-coral-600">
                                                    Music
                                                </Link>
                                            </li>
                                            <li className="flex items-center gap-2 group">
        <span className="text-coral-400 group-hover:text-coral-600">
          <BookOpen size={18} />
        </span>
                                                <Link to="/category/publishing" className="flex-1 text-gray-600 group-hover:text-coral-600">
                                                    Publishing
                                                </Link>
                                            </li>
                                            <li className="flex items-center gap-2 group">
        <span className="text-coral-400 group-hover:text-coral-600">
          <Gamepad2 size={18} />
        </span>
                                                <Link to="/category/games" className="flex-1 text-gray-600 group-hover:text-coral-600">
                                                    Games
                                                </Link>
                                            </li>
                                            <li className="flex items-center gap-2 group">
        <span className="text-coral-400 group-hover:text-coral-600">
          <Utensils size={18} />
        </span>
                                                <Link to="/category/food" className="flex-1 text-gray-600 group-hover:text-coral-600">
                                                    Food
                                                </Link>
                                            </li>
                                        </ul>
                                    </div>
                                )}

                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-5 bg-main-bg">
                    {data.data.map((projectData) => (
                        <Card key={projectData._id} project={projectData} />
                    ))}
                </div>
            </div>

            <Footer />
        </>
    );
}

export default Technology;
