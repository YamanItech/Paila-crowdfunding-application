import React, { useState, useEffect } from 'react';
import { User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
const AdminProfile = () => {
  const [user, setUser] = useState({
    fullName: '',
    email: '',
    profilePhoto: null,
  });

  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const name = localStorage.getItem('Name');
    const email = localStorage.getItem('email');
    setUser({
      fullName: name || '',
      email: email || '',
      profilePhoto: null,
    });
  }, []);

  const updatePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match.');
      return;
    }

    setIsLoading(true);

    try {
      const userId = localStorage.getItem('id');
      if (!userId) throw new Error('User ID not found.');

      const response = await fetch(`${import.meta.env.VITE_BACKEND}/api/v1/users/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId,
          oldPassword: currentPassword,
          newPassword: newPassword,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Something went wrong.');

      toast.success('Password updated successfully!');

      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');

      setTimeout(() => {
        setIsPasswordModalOpen(false);
        navigate('/admin');
      }, 2000);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };


  return (
      <div className="bg-gray-50 min-h-screen p-6">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-blue-600 p-6 text-white">
            <h1 className="text-2xl font-bold">Your Profile</h1>
            <p className="text-blue-100">Manage your personal information</p>
          </div>

          <div className="p-6 md:flex">
            <div className="md:w-1/3 mb-6 md:mb-0 flex flex-col items-center">
              <div className="mb-4 relative">
                {user.profilePhoto ? (
                    <img
                        src={user.profilePhoto}
                        alt="Profile"
                        className="w-40 h-40 rounded-full object-cover border-4 border-gray-200"
                    />
                ) : (
                    <div className="w-40 h-40 rounded-full bg-gray-200 flex items-center justify-center border-4 border-gray-200">
                      <User size={64} className="text-gray-400" />
                    </div>
                )}
              </div>
            </div>

            <div className="md:w-2/3 md:pl-6">
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">
                  Account Information
                </h2>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-600 mb-1">Full Name</label>
                  <div className="text-gray-900 font-medium">{user.fullName}</div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-600 mb-1">Email Address</label>
                  <div className="text-gray-900 font-medium">{user.email}</div>
                </div>

                <div className="flex space-x-4 mt-8">
                  <button
                      className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded transition-colors"
                      onClick={() => setIsPasswordModalOpen(true)}
                  >
                    Change password
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {isPasswordModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative">
                <button
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                    onClick={() => {
                      setIsPasswordModalOpen(false);
                      setMessage({ type: '', text: '' });
                      setCurrentPassword('');
                      setNewPassword('');
                      setConfirmPassword('');
                    }}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                <h2 className="text-xl font-bold mb-6 text-gray-800">Change Password</h2>

                <div className="mb-4">
                  <label htmlFor="currentPassword" className="block mb-2 text-sm font-medium text-gray-700">
                    Current Password
                  </label>
                  <input
                      id="currentPassword"
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="newPassword" className="block mb-2 text-sm font-medium text-gray-700">
                    New Password
                  </label>
                  <input
                      id="newPassword"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                  />
                </div>

                <div className="mb-6">
                  <label htmlFor="confirmPassword" className="block mb-2 text-sm font-medium text-gray-700">
                    Confirm New Password
                  </label>
                  <input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                  />
                  {confirmPassword && newPassword !== confirmPassword && (
                      <p className="mt-1 text-sm text-red-600">Passwords do not match</p>
                  )}
                </div>

                <div className="flex justify-end">
                  <button
                      type="button"
                      className="mr-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                      onClick={() => setIsPasswordModalOpen(false)}
                      disabled={isLoading}
                  >
                    Cancel
                  </button>
                  <button
                      type="button"
                      onClick={updatePassword}
                      disabled={isLoading}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {isLoading ? 'Updating...' : 'Update Password'}
                  </button>
                </div>
              </div>
            </div>
        )}
      </div>
  );
};

export default AdminProfile;
