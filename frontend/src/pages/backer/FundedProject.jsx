import React, { useState } from "react";
import getAxios from "../../hooks/getAxios.jsx";
import { X, PlusCircle, Award, Loader } from "lucide-react";
import { Link } from "react-router-dom";

const FundedProject = () => {
  const { data, error, loading } = getAxios(`${import.meta.env.VITE_BACKEND}/api/v1/company/backer/funded-projects`);

  const [selectedPerk, setSelectedPerk] = useState(null);
  const [showPerk, setShowPerk] = useState(false);
  const [loadingPerk, setLoadingPerk] = useState(false);

  const handleViewPerk = async (perkNumber, projectId) => {
    setLoadingPerk(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND}/api/v1/project/perk/${projectId}`);
      const responseData = await res.json();
      const perks = responseData.data;

      const benefitKey = `benefit${perkNumber}`;
      const benefitArray = perks[benefitKey];

      if (benefitArray && benefitArray.length > 0) {
        setSelectedPerk(benefitArray[0]);
      } else {
        setSelectedPerk({ name: "N/A", description: "No benefit info", price: 0 });
      }

      setShowPerk(true);
    } catch (err) {
      console.error(err);
      setSelectedPerk({ name: "Error", description: "Failed to load perk", price: 0 });
      setShowPerk(true);
    } finally {
      setLoadingPerk(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex justify-center items-center">
        <div className="flex flex-col items-center">
          <Loader size={40} className="text-coral-600 animate-spin mb-4" />
          <p className="text-gray-700 font-medium">Loading your funded projects...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-8 flex justify-center items-center">
        <div className="bg-white rounded-xl shadow-xl p-8 max-w-md text-center border-l-4 border-red-500">
          <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <X className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">Unable to fetch funded projects data. Please try again later.</p>
          <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!data?.success || !data?.data || data.data.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-8 flex justify-center items-center">
        <div className="bg-white rounded-xl shadow-xl p-8 max-w-md text-center border border-gray-200">
          <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <PlusCircle className="w-8 h-8 text-gray-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">No Projects Yet</h2>
          <p className="text-gray-600 mb-6">You haven't funded any projects yet.</p>
          <button className="bg-coral-600 hover:bg-coral-700 text-white px-6 py-3 rounded-lg transition shadow-md">
            Discover Projects
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-center mb-10">
          <div className="bg-coral-600 rounded-full w-10 h-10 flex items-center justify-center mr-3">
            <Award className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800">My Funded Projects</h1>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
              <tr className="bg-gradient-to-r from-coral-600 to-coral-700 text-white">
                <th className="py-4 px-6 text-left text-sm font-medium uppercase tracking-wider">Project Name</th>
                <th className="py-4 px-6 text-left text-sm font-medium uppercase tracking-wider">Total Funding</th>
                <th className="py-4 px-6 text-left text-sm font-medium uppercase tracking-wider">Current Pledged</th>
                <th className="py-4 px-6 text-left text-sm font-medium uppercase tracking-wider">My Funding</th>
                <th className="py-4 px-6 text-left text-sm font-medium uppercase tracking-wider">Perk Details</th>
              </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
              {data.data.map((project, index) => (
                <tr
                  key={project._id}
                  className={index % 2 === 0 ? "bg-white hover:bg-gray-50" : "bg-gray-50 hover:bg-gray-100"}
                  style={{ transition: "all 0.2s ease-in-out" }}
                >
                  <td className="py-4 px-6 font-semibold text-gray-800">{project.projectName}</td>
                  <td className="py-4 px-6 text-gray-700 font-medium">रु {project.totalFunding.toLocaleString()}</td>
                  <td className="py-4 px-6 text-gray-700">रु {project.currentPledgedAmount.toLocaleString()}</td>
                  <td className="py-4 px-6 text-coral-600 font-medium">रु {project.myFunding.toLocaleString()}</td>
                  <td className="py-4 px-6">
                    <button
                      onClick={() => handleViewPerk(project.perk, project.projectId)}
                      className="px-4 py-2 bg-coral-600 text-white rounded-lg hover:bg-coral-700 transition shadow flex items-center justify-center"
                      disabled={loadingPerk}
                    >
                      {loadingPerk ? (
                        <Loader size={16} className="animate-spin mr-2" />
                      ) : (
                        <Award size={16} className="mr-2" />
                      )}
                      View Perk
                    </button>
                  </td>
                </tr>
              ))}
              </tbody>
            </table>
          </div>
        </div>

        {showPerk && selectedPerk && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 transition-opacity duration-300 ease-in-out">
            <div
              className="bg-white rounded-2xl shadow-2xl p-0 max-w-md w-full transform transition-all duration-300 ease-in-out"
              style={{
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
              }}
            >
              <div className="bg-gradient-to-r from-coral-600 to-coral-700 rounded-t-2xl p-4 flex justify-between items-center">
                <h2 className="text-xl font-bold text-white flex items-center">
                  <Award className="mr-2" />
                  Perk Details
                </h2>
                <button
                  onClick={() => setShowPerk(false)}
                  className="text-white hover:text-gray-100 focus:outline-none"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6">
                <div className="bg-coral-50 rounded-xl p-4 mb-4">
                  <h3 className="text-lg font-semibold mb-1 text-coral-700">{selectedPerk.name}</h3>
                  <div className="text-sm font-bold text-white bg-coral-600 px-3 py-1 rounded-full inline-block">
                    रु {selectedPerk.price}
                  </div>
                </div>

                <div className="mt-4">
                  <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-2">Description</h4>
                  <p className="text-gray-700">{selectedPerk.description}</p>
                </div>

                <div className="mt-8 flex justify-end">
                  <button
                    onClick={() => setShowPerk(false)}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium px-5 py-2 rounded-lg transition mr-3"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FundedProject;
