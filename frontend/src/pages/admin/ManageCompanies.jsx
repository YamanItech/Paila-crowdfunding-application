import React, { useEffect, useState } from "react";
import axios from "axios";

const ManageCompanies = () => {
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchCompanies = async () => {
        try {
            const res = await axios.get("http://localhost:8000/api/v1/users/getAllCompanies", { withCredentials: true });
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

    useEffect(() => {
        fetchCompanies();
    }, []);

    return (
        <div className=" max-w-full bg-gradient-to-b from-gray-50 to-gray-100 p-8">
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
                                    <th className="py-4 px-6 text-left text-sm font-medium uppercase tracking-wider">Status</th>
                                    <th className="py-4 px-6 text-left text-sm font-medium uppercase tracking-wider">Actions</th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                {companies.map((company, index) => (
                                    <tr key={company._id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                                        <td className="py-4 px-6 text-gray-800 font-medium">{company.fullName}</td>
                                        <td className="py-4 px-6 text-gray-600">{company.email}</td>
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
                                                onClick={() => toggleVerification(company._id, company.verified)}
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
            </div>
        </div>
    );
};

export default ManageCompanies;