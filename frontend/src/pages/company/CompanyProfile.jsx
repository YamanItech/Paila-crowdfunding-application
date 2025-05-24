import React, { useState, useEffect, useRef } from 'react';
import { User, Camera } from 'lucide-react';
import getAxios from "../../hooks/getAxios.jsx";
import { useNavigate } from "react-router-dom";

const CompanyProfile = () => {
    const nav = useNavigate();
    const [kycModal, setKycModal] = useState(null);
    const { data, error, loading } = getAxios(`${import.meta.env.VITE_BACKEND}/api/v1/users/getUserProfile`);
    const [user, setUser] = useState({
        fullName: '',
        email: '',
        profilePhoto: null,
    });

    const [isEditMode, setIsEditMode] = useState(false);
    const [originalUser, setOriginalUser] = useState(null);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const fileInputRef = useRef(null);

    useEffect(() => {
        if (data && data.data) {
            const newUser = {
                fullName: data.data.fullName || localStorage.getItem('Name') || '',
                email: data.data.email || localStorage.getItem('email') || '',
                profilePhoto: data.data.avatar || null,
            };
            setUser(newUser);
            setOriginalUser(newUser);
        }
    }, [data]);

    const showToast = (type, text) => {
        setMessage({ type, text });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    };

    // Function to check if KYC is valid
    const hasValidKyc = (kycData) => {
        return kycData && kycData.data && Object.keys(kycData.data).length > 0;
    };

    // Function to open KYC modal
    const openKycModal = (kycData) => {
        setKycModal(kycData);
    };

    // Function to handle KYC button click
    const handleKycButtonClick = () => {
        if (data?.data?.kyc && hasValidKyc(data.data.kyc)) {
            openKycModal(data.data.kyc);
        } else {
            nav('/company/kyc');
        }
    };

    const updateAccountDetails = async () => {
        if (!user.fullName || !user.email) {
            showToast('error', 'Full Name and Email are required.');
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND}/api/v1/users/update-account`, {
                method: 'PATCH',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fullName: user.fullName, email: user.email }),
            });

            const result = await response.json();
            if (!response.ok) throw new Error(result.message || 'Failed to update account details.');

            setUser(prev => ({
                ...prev,
                fullName: result.data.fullName,
                email: result.data.email,
            }));
            setOriginalUser({ fullName: result.data.fullName, email: result.data.email, profilePhoto: user.profilePhoto });
            showToast('success', 'Account details updated successfully!');
        } catch (error) {
            showToast('error', error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const updatePassword = async () => {
        if (newPassword !== confirmPassword) {
            showToast('error', 'New passwords do not match.');
            return;
        }

        setIsLoading(true);

        try {
            const userId = localStorage.getItem('id');
            const response = await fetch(`http://localhost:8000/api/v1/users/change-password`, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: userId,
                    oldPassword: currentPassword,
                    newPassword: newPassword,
                }),
            });

            const result = await response.json();
            if (!response.ok) throw new Error(result.message || 'Something went wrong.');

            showToast('success', 'Password updated successfully!');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
            setIsPasswordModalOpen(false);
        } catch (error) {
            showToast('error', error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleAvatarChange = async (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            showToast('error', 'Please select an image file.');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            showToast('error', 'File size should be less than 5MB.');
            return;
        }

        setIsUploadingAvatar(true);

        try {
            const formData = new FormData();
            formData.append('avatar', file);

            const response = await fetch(`${import.meta.env.VITE_BACKEND}/api/v1/users/avatar`, {
                method: 'PATCH',
                credentials: 'include',
                body: formData,
            });

            const result = await response.json();
            if (!response.ok) throw new Error(result.message || 'Failed to upload avatar.');

            setUser(prev => ({
                ...prev,
                profilePhoto: result.data.avatar,
            }));

            showToast('success', 'Profile photo updated successfully!');
        } catch (error) {
            showToast('error', error.message || 'Failed to upload avatar.');
        } finally {
            setIsUploadingAvatar(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    // Function to format dates
    const formatDate = (date) => {
        if (!date) return 'N/A';
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    // Function to get KYC image URL
    const getKycImageUrl = (kycData) => {
        return kycData?.url || 'https://via.placeholder.com/300';
    };

    return (
      <div className="bg-gray-50 min-h-screen p-6">
          {message.text && (
            <div className={`fixed top-4 right-4 z-50 px-4 py-2 rounded-md text-white ${message.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
                {message.text}
            </div>
          )}

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

                          <button
                            onClick={handleAvatarClick}
                            disabled={isUploadingAvatar}
                            className="absolute bottom-2 right-2 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full shadow-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Change profile photo"
                          >
                              {isUploadingAvatar ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              ) : (
                                <Camera size={20} />
                              )}
                          </button>
                      </div>

                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        className="hidden"
                      />

                      <p className="text-sm text-gray-500 text-center">Click the camera icon to change your profile photo</p>
                  </div>

                  <div className="md:w-2/3 md:pl-6">
                      <div className="mb-6">
                          <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">Account Information</h2>

                          <div className="mb-4">
                              <label className="block text-sm font-medium text-gray-600 mb-1">Full Name</label>
                              <input
                                type="text"
                                value={user.fullName}
                                onChange={(e) => setUser({ ...user, fullName: e.target.value })}
                                disabled={!isEditMode}
                                className={`w-full px-3 py-2 border ${isEditMode ? 'border-gray-300' : 'bg-gray-100'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed`}
                              />
                          </div>

                          <div className="mb-4">
                              <label className="block text-sm font-medium text-gray-600 mb-1">Email Address</label>
                              <input
                                type="email"
                                value={user.email}
                                onChange={(e) => setUser({ ...user, email: e.target.value })}
                                disabled={!isEditMode}
                                className={`w-full px-3 py-2 border ${isEditMode ? 'border-gray-300' : 'bg-gray-100'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed`}
                              />
                          </div>

                          <div className="flex space-x-4 mt-8">
                              {!isEditMode ? (
                                <button
                                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors"
                                  onClick={() => setIsEditMode(true)}
                                >
                                    Edit Details
                                </button>
                              ) : (
                                <>
                                    <button
                                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition-colors"
                                      onClick={async () => {
                                          await updateAccountDetails();
                                          setIsEditMode(false);
                                      }}
                                      disabled={isLoading}
                                    >
                                        {isLoading ? 'Updating...' : 'Update'}
                                    </button>
                                    <button
                                      className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded transition-colors"
                                      onClick={() => {
                                          setUser(originalUser);
                                          setIsEditMode(false);
                                      }}
                                    >
                                        Cancel
                                    </button>
                                </>
                              )}

                              <button
                                className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded transition-colors"
                                onClick={() => setIsPasswordModalOpen(true)}
                              >
                                  Change Password
                              </button>

                              <button
                                className={`px-4 py-2 rounded transition-colors ${hasValidKyc(data?.data?.kyc) ? 'bg-coral-500 hover:bg-coral-600 text-white' : 'bg-gray-500 text-white hover:bg-gray-600'}`}
                                onClick={handleKycButtonClick}
                              >
                                  {hasValidKyc(data?.data?.kyc) ? 'View KYC' : 'Complete KYC'}
                              </button>
                          </div>
                      </div>
                  </div>
              </div>
          </div>

          {/* KYC Modal */}
          {kycModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full max-h-screen p-6 relative">
                    <button
                      className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-2xl z-10"
                      onClick={() => setKycModal(null)}
                      aria-label="Close modal"
                    >
                        ×
                    </button>
                    <h2 className="text-2xl font-semibold mb-4 text-coral-700 border-b pb-2">KYC Information</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="overflow-auto max-h-96 bg-gray-50 p-4 rounded-lg">
                            <h3 className="text-lg font-medium mb-2 text-gray-700">Identity Document</h3>
                            <img
                              src={getKycImageUrl(kycModal)}
                              alt="KYC Document"
                              className="w-full h-auto rounded border border-gray-300"
                            />
                        </div>

                        <div className="overflow-auto max-h-96">
                            <h3 className="text-lg font-medium mb-2 text-gray-700">Personal Information</h3>
                            <div className="space-y-3">
                                {kycModal?.data ? (
                                  <>
                                      <div className="grid grid-cols-2 gap-2">
                                          <div className="text-gray-600">Full Name:</div>
                                          <div className="font-medium">{kycModal.data.fullName || 'N/A'}</div>
                                          <div className="text-gray-600">Gender:</div>
                                          <div className="font-medium capitalize">{kycModal.data.gender || 'N/A'}</div>
                                          <div className="text-gray-600">Date of Birth:</div>
                                          <div className="font-medium">{formatDate(kycModal.data.dob)}</div>
                                          <div className="text-gray-600">Citizenship #:</div>
                                          <div className="font-medium">{kycModal.data.citizenshipNumber || 'N/A'}</div>
                                          <div className="text-gray-600">Issue District:</div>
                                          <div className="font-medium">{kycModal.data.citizenshipIssueDistrict || 'N/A'}</div>
                                          <div className="text-gray-600">Issue Date:</div>
                                          <div className="font-medium">{formatDate(kycModal.data.citizenshipIssueDate)}</div>
                                      </div>
                                      <h3 className="text-lg font-medium my-2 text-gray-700 border-t pt-2">Address</h3>
                                      <div className="grid grid-cols-2 gap-2">
                                          <div className="text-gray-600">Province:</div>
                                          <div className="font-medium">{kycModal.data.province || 'N/A'}</div>
                                          <div className="text-gray-600">District:</div>
                                          <div className="font-medium">{kycModal.data.district || 'N/A'}</div>
                                          <div className="text-gray-600">Address:</div>
                                          <div className="font-medium">{kycModal.data.address || 'N/A'}</div>
                                      </div>
                                      <h3 className="text-lg font-medium my-2 text-gray-700 border-t pt-2">Contact</h3>
                                      <div className="grid grid-cols-2 gap-2">
                                          <div className="text-gray-600">Mobile:</div>
                                          <div className="font-medium">{kycModal.data.mobileNumber || 'N/A'}</div>
                                          <div className="text-gray-600">Email:</div>
                                          <div className="font-medium">{kycModal.data.email || 'N/A'}</div>
                                          <div className="text-gray-600">Occupation:</div>
                                          <div className="font-medium capitalize">{kycModal.data.occupation || 'N/A'}</div>
                                      </div>
                                  </>
                                ) : (
                                  <div className="text-gray-500 italic">
                                      Detailed KYC information not available.
                                  </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
          )}

          {/* Password Modal */}
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

export default CompanyProfile;