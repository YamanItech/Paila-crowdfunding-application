import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import {
    User,
    Users,
    LayoutDashboard,
    MoreHorizontal,
    Settings,
    LogOut,
    X, Home, FilePlus, Files
} from 'lucide-react';
import getAxios from "../../hooks/getAxios.jsx";

function BackerDashboard() {
    const { data, error, loading } = getAxios(`${import.meta.env.VITE_BACKEND}/api/v1/users/getUserProfile`);
    const navigate = useNavigate();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
    const name=localStorage.getItem('Name');
    const role=localStorage.getItem('userRole');
    const email=localStorage.getItem('email');
    const user = {
        name: name,
        role: role,
        profilePhoto: '',
    };

    const handleLogout = () => {
        localStorage.clear();
        setIsLogoutModalOpen(false);
        setIsDropdownOpen(false);
        navigate('/login');
    };

    const handleNavigate = (path) => {
        setIsDropdownOpen(false);
        navigate(path);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex relative">
            {/* Sidebar */}
            <aside className="w-64 bg-white shadow-lg flex flex-col justify-between">
                <div>
                    {/* AdminProfile Section */}
                    <div className="flex flex-col items-center p-4">
                        <div className="mb-2 relative">
                            {user.profilePhoto ? (
                                <img
                                    src={user.profilePhoto}
                                    alt="Backer Profile"
                                    className="w-20 h-20 rounded-full object-cover border-4 border-gray-200"
                                />
                            ) : (
                                <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center border-4 border-gray-200">
                                    {data && data.data && data.data.avatar ? (
                                      <img
                                        src={data.data.avatar}
                                        alt="User Avatar"
                                        className="w-full h-full rounded-full object-cover"
                                      />
                                    ) : (
                                    <User size={40} className="text-gray-400" />
                                      )}
                                </div>
                            )}
                        </div>
                        <p className="font-semibold text-gray-800">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.role}</p>
                    </div>

                    {/* Navigation */}
                    <nav className="mt-6">
                        <NavLink
                            to="/backer"
                            end
                            className={({ isActive }) =>
                                `flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100 ${
                                    isActive ? 'bg-gray-100 border-r-4 border-blue-500' : ''
                                }`
                            }
                        >
                            <LayoutDashboard className="w-5 h-5 mr-3" />
                            Dashboard
                        </NavLink>
                        <NavLink
                            to="/backer/profile"
                            className={({ isActive }) =>
                                `flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100 ${
                                    isActive ? 'bg-gray-100 border-r-4 border-blue-500' : ''
                                }`
                            }
                        >
                            <User className="w-5 h-5 mr-3" />
                            Profile
                        </NavLink>





                    </nav>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 relative">
                {/* Settings Icon */}
                <div className="absolute top-4 right-4">
                    <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="text-gray-600 hover:text-gray-900"
                    >
                        <Settings className="w-6 h-6" />
                    </button>
                </div>

                {/* Settings Dropdown */}
                {isDropdownOpen && (
                    <div className="absolute top-16 right-8 z-50 bg-white rounded-xl shadow-lg w-64 p-4 space-y-3">
                        <div className="flex justify-between items-center mb-2">
                            <h2 className="text-lg font-semibold text-gray-800">Account Menu</h2>
                            <button onClick={() => setIsDropdownOpen(false)}>
                                <X className="w-5 h-5 text-gray-500 hover:text-gray-700" />
                            </button>
                        </div>

                        <button
                            onClick={() => handleNavigate('/backer')}
                            className="flex items-center gap-2 text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-lg w-full text-left"
                        >
                            <LayoutDashboard className="w-5 h-5" />
                            Dashboard
                        </button>

                        <button
                            onClick={() => handleNavigate('/backer/profile')}
                            className="flex items-center gap-2 text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-lg w-full text-left"
                        >
                            <User className="w-5 h-5" />
                            Profile
                        </button>
                        <button
                            onClick={() => handleNavigate('/')}
                            className="flex items-center gap-2 text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-lg w-full text-left"
                        >
                            <Home className="w-5 h-5"/>
                            Homepage
                        </button>
                        <button
                            onClick={() => {
                                setIsDropdownOpen(false);
                                setIsLogoutModalOpen(true);
                            }}
                            className="flex items-center gap-2 text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg w-full text-left"
                        >
                            <LogOut className="w-5 h-5"  />

                            Logout
                        </button>


                    </div>
                )}

                <Outlet />
            </main>

            {/* Logout Confirmation Modal */}
            {isLogoutModalOpen && (
                <>
                    <div
                        className="fixed inset-0 bg-black bg-opacity-40 z-40"
                        onClick={() => setIsLogoutModalOpen(false)}
                    />
                    <div className="fixed top-1/2 left-1/2 z-50 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-lg p-6 w-80 space-y-4">
                        <div className="flex justify-between items-center mb-2">
                            <h2 className="text-lg font-semibold text-gray-800">Logout Confirmation</h2>
                            <button onClick={() => setIsLogoutModalOpen(false)}>
                                <X className="w-5 h-5 text-gray-500 hover:text-gray-700" />
                            </button>
                        </div>
                        <p className="text-sm text-gray-600">Are you sure you want to log out?</p>
                        <button
                            onClick={handleLogout}
                            className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg font-medium transition"
                        >
                            <LogOut className="inline-block w-4 h-4 mr-2" />
                            Confirm Logout
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}

export default BackerDashboard;
