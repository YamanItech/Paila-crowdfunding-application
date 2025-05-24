import React, { useEffect, useState } from "react";
import axios from "axios";

const ManageCompanies = () => {
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [kycModal, setKycModal] = useState(null);

    const fetchCompanies = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_BACKEND}api/v1/users/getAllCompanies`, { withCredentials: true });
            setCompanies(res.data.data);
        } catch (err) {
            console.error("Error fetching companies:", err);
        } finally {
            setLoading(false);
        }
    };

    const toggleVerification = async (userId, currentStatus) => {
        try {
            await axios.put(
              "http://localhost:8000/api/v1/users/verify",
              { userId, verified: !currentStatus },
              { withCredentials: true }
            );
            fetchCompanies();
        } catch (err) {
            console.error("Error updating verification:", err);
        }
    };

    const confirmToggle = (userId, currentStatus) => {
        const action = currentStatus ? "unverify" : "verify";
        if (window.confirm(`Are you sure you want to ${action} this company?`)) {
            toggleVerification(userId, currentStatus);
        }
    };

    const openKycModal = (company) => {
        setKycModal(company.kyc);
    };

    useEffect(() => {
        fetchCompanies();
    }, []);

    // Function to check if KYC exists and is in the correct format
    const hasValidKyc = (company) => {
        return company.kyc && (company.kyc.url || typeof company.kyc === 'string');
    };

    // Function to get KYC image URL (handles both old and new formats)
    const getKycImageUrl = (kyc) => {
        if (!kyc) return null;
        if (typeof kyc === 'string') return kyc; // Old format: direct URL string
        return kyc.url; // New format: { url, data, status }
    };

    // Function to format date fields from KYC data
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString();
    };

    return (
      <div className="max-w-full bg-gradient-to-b from-gray-50 to-gray-100 p-8">
          <div className="max-w-5xl mx-auto">
              <h1 className="text-4xl font-bold text-center text-coral-700 mb-10">Company List</h1>

              {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-coral-700"></div>
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead>
                            <tr className="bg-gradient-to-r from-coral-600 to-coral-700 text-white">
                                <th className="py-4 px-6 text-left text-sm font-medium uppercase tracking-wider">Company Name</th>
                                <th className="py-4 px-6 text-left text-sm font-medium uppercase tracking-wider">Email</th>
                                <th className="py-4 px-6 text-left text-sm font-medium uppercase tracking-wider">KYC</th>
                                <th className="py-4 px-6 text-left text-sm font-medium uppercase tracking-wider">Verified</th>
                                <th className="py-4 px-6 text-left text-sm font-medium uppercase tracking-wider">Actions</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                            {companies.map((company, index) => (
                              <tr key={company._id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                                  <td className="py-4 px-6 text-gray-800 font-medium">{company.fullName}</td>
                                  <td className="py-4 px-6 text-gray-600">{company.email}</td>
                                  <td className="py-4 px-6 text-gray-600">
                                      {hasValidKyc(company) ? (
                                        <button
                                          onClick={() => openKycModal(company)}
                                          className="bg-coral-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-coral-600 hover:shadow-lg transition duration-300"
                                        >
                                            View KYC
                                        </button>
                                      ) : (
                                        <span className="text-gray-500 italic">Not submitted</span>
                                      )}
                                  </td>

                                  <td className="py-4 px-6">
                                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                                        company.verified
                                          ? "bg-green-100 text-green-800"
                                          : "bg-red-100 text-red-800"
                                      }`}>
                                          <span className={`w-2 h-2 mr-2 rounded-full ${
                                            company.verified ? "bg-green-500" : "bg-red-500"
                                          }`}></span>
                                          {company.verified ? "Verified" : "Unverified"}
                                      </span>
                                  </td>
                                  <td className="py-4 px-6">
                                      <button
                                        className={`py-2 px-4 rounded-md text-white font-medium focus:outline-none transition duration-200 transform hover:scale-105 hover:shadow-md ${
                                          company.verified
                                            ? "bg-red-500 hover:bg-red-600"
                                            : "bg-green-500 hover:bg-green-600"
                                        }`}
                                        onClick={() => confirmToggle(company._id, company.verified)}
                                        aria-label={company.verified ? "Unverify company" : "Verify company"}
                                      >
                                          {company.verified ? "Unverify" : "Verify"}
                                      </button>
                                  </td>
                              </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                    {companies.length === 0 && (
                      <div className="text-center py-10 text-gray-500">
                          No companies found
                      </div>
                    )}
                </div>
              )}

              {/* KYC Modal */}
              {kycModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full max-h-screen p-6 relative">
                        <button
                          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-2xl z-10"
                          onClick={() => setKycModal(null)}
                          aria-label="Close modal"
                        >
                            &times;
                        </button>
                        <h2 className="text-2xl font-semibold mb-4 text-coral-700 border-b pb-2">KYC Information</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* KYC Image */}
                            <div className="overflow-auto max-h-96 bg-gray-50 p-4 rounded-lg">
                                <h3 className="text-lg font-medium mb-2 text-gray-700">Identity Document</h3>
                                <img
                                  src={getKycImageUrl(kycModal)}
                                  alt="KYC Document"
                                  className="w-full h-auto rounded border border-gray-300"
                                />
                            </div>

                            {/* KYC Details */}
                            <div className="overflow-auto max-h-96">
                                <h3 className="text-lg font-medium mb-2 text-gray-700">Personal Information</h3>
                                <div className="space-y-3">
                                    {kycModal.data ? (
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
                                          Detailed KYC information not available. This may be using an older format.
                                      </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* KYC Status and Actions */}
                        {kycModal.status && (
                          <div className="border-t mt-4 pt-4 flex justify-between items-center">
                              <div className="flex items-center">
                                  <span className="mr-2 text-gray-700">KYC Status:</span>
                                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                                    kycModal.status === 'approved'
                                      ? "bg-green-100 text-green-800"
                                      : kycModal.status === 'rejected'
                                        ? "bg-red-100 text-red-800"
                                        : "bg-yellow-100 text-yellow-800"
                                  }`}>
                                        <span className={`w-2 h-2 mr-2 rounded-full ${
                                          kycModal.status === 'approved'
                                            ? "bg-green-500"
                                            : kycModal.status === 'rejected'
                                              ? "bg-red-500"
                                              : "bg-yellow-500"
                                        }`}></span>
                                      {kycModal.status === 'pending' ? 'Pending Review' :
                                        kycModal.status === 'approved' ? 'Approved' : 'Rejected'}
                                    </span>
                              </div>
                              <div className="space-x-2">
                                  <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded">
                                      Approve KYC
                                  </button>
                                  <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded">
                                      Reject KYC
                                  </button>
                              </div>
                          </div>
                        )}
                    </div>
                </div>
              )}
          </div>
      </div>
    );
};

export default ManageCompanies;