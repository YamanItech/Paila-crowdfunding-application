import React, { useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
    LayoutDashboard,
    LogOut,
    User,
    X,
    Search,
    ChevronDown,
    Paintbrush2,
    Cpu,
    Music2,
    BookOpen,
    Gamepad2,
    Utensils,
} from "lucide-react";
import logo from "../assets/paila-logo-dark.svg";

const Header = () => {
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

    const navigate = useNavigate();
    const userRole = localStorage.getItem("userRole");
    const email = localStorage.getItem("email");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem("userRole");
        localStorage.removeItem("email");
        navigate("/login");
    };

    return (
        <header className="bg-white py-4 px-6 shadow-md flex items-center justify-between relative z-50">
            {/* Left: Logo + Explore */}
            <div className="flex items-center space-x-6">
                <Link to="/" className="text-xl font-bold flex items-center">
                    <img src={logo} alt="Paila Logo" className="w-32" />
                </Link>

                <div
                    className="relative"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                >
                    <button className="flex items-center gap-1 text-gray-700 hover:text-coral-500 font-medium transition-colors">
                        Explore
                        <ChevronDown className={`h-5 w-5 transition-transform ${isHovered ? 'rotate-180' : ''}`} />
                    </button>

                    {isHovered && (
                        <div className="absolute left-1/2 transform -translate-x-1/2 top-full z-10 mt-2 w-64 rounded-xl border border-gray-100 bg-white p-4 shadow-xl transition-all duration-300">
                            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2 w-4 h-4 rotate-45 bg-white border-l border-t border-gray-100"></div>
                            <ul className="space-y-3">
                                <li className="flex items-center gap-2 group">
                                    <span className="text-coral-400 group-hover:text-coral-600"><Paintbrush2 size={18} /></span>
                                    <Link to="/category/art" className="flex-1 text-gray-600 group-hover:text-coral-600">Art</Link>
                                </li>
                                <li className="flex items-center gap-2 group">
                                    <span className="text-coral-400 group-hover:text-coral-600"><Cpu size={18} /></span>
                                    <Link to="/category/technology" className="flex-1 text-gray-600 group-hover:text-coral-600">Technology</Link>
                                </li>
                                <li className="flex items-center gap-2 group">
                                    <span className="text-coral-400 group-hover:text-coral-600"><Music2 size={18} /></span>
                                    <Link to="/category/music" className="flex-1 text-gray-600 group-hover:text-coral-600">Music</Link>
                                </li>
                                <li className="flex items-center gap-2 group">
                                    <span className="text-coral-400 group-hover:text-coral-600"><BookOpen size={18} /></span>
                                    <Link to="/category/publishing" className="flex-1 text-gray-600 group-hover:text-coral-600">Publishing</Link>
                                </li>
                                <li className="flex items-center gap-2 group">
                                    <span className="text-coral-400 group-hover:text-coral-600"><Gamepad2 size={18} /></span>
                                    <Link to="/category/games" className="flex-1 text-gray-600 group-hover:text-coral-600">Games</Link>
                                </li>
                                <li className="flex items-center gap-2 group">
                                    <span className="text-coral-400 group-hover:text-coral-600"><Utensils size={18} /></span>
                                    <Link to="/category/food" className="flex-1 text-gray-600 group-hover:text-coral-600">Food</Link>
                                </li>
                            </ul>
                        </div>
                    )}

                </div>
            </div>

            {/* Center: Search Bar */}
            <div className="flex-1 max-w-xl mx-auto">
                <div className="relative">
                    <div className="flex h-10 items-center overflow-hidden rounded-full border border-gray-200 bg-gray-50 px-3 focus-within:border-coral-400 focus-within:ring-2 focus-within:ring-coral-100 transition-all duration-200">
                        <Search className="h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search projects..."
                            className="ml-2 h-full w-full bg-transparent border-none outline-none text-gray-700 placeholder-gray-400"
                        />
                    </div>
                </div>
            </div>

            {/* Right: User account or login */}
            {userRole ? (
                <div className="relative">
                    <button
                        className="flex items-center gap-2 focus:outline-none group"
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    >
                        <div className="w-10 h-10 rounded-full bg-coral-100 flex items-center justify-center text-coral-600 border-2 border-transparent group-hover:border-coral-300 transition-all duration-200">
                            <User className="w-5 h-5" />
                        </div>
                    </button>

                    {isDropdownOpen && (
                        <div className="absolute top-12 right-0 z-50 bg-white rounded-xl shadow-lg w-64 p-4 space-y-2 border border-gray-100">
                            <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-800">My Account</h2>
                                    <p className="text-sm text-gray-500 truncate">{email}</p>
                                </div>
                                <button
                                    onClick={() => setIsDropdownOpen(false)}
                                    className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            <button
                                onClick={() => navigate(`/${userRole}`)}
                                className="flex items-center gap-3 text-gray-700 hover:bg-coral-50 px-3 py-2 rounded-lg w-full text-left transition-colors"
                            >
                                <LayoutDashboard className="w-5 h-5 text-coral-500" />
                                <span>Dashboard</span>
                            </button>

                            <button
                                onClick={() => navigate(`/${userRole}/profile`)}
                                className="flex items-center gap-3 text-gray-700 hover:bg-coral-50 px-3 py-2 rounded-lg w-full text-left transition-colors"
                            >
                                <User className="w-5 h-5 text-coral-500" />
                                <span>Profile</span>
                            </button>

                            <div className="pt-2 border-t border-gray-100">
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-3 text-coral-600 hover:bg-coral-50 px-3 py-2 rounded-lg w-full text-left transition-colors"
                                >
                                    <LogOut className="w-5 h-5" />
                                    <span>Logout</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <button
                    className="bg-coral-500 hover:bg-coral-600 py-2 px-6 rounded-full font-medium text-white shadow-md hover:shadow-lg transition duration-200 focus:ring-2 focus:ring-coral-200 focus:outline-none"
                    onClick={() => navigate("/login")}
                >
                    Login
                </button>
            )}
        </header>
    );
};

export default Header;
