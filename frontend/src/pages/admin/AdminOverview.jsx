import React, { useEffect, useState } from 'react';
import { Users, Folder, HandCoins } from 'lucide-react';

const AdminOverview = () => {
  // State to store the data fetched from API
  const [stats, setStats] = useState({
    backercount: 1,
    projectscount: 13,
    pledgecount: 14698,
  });

  // Simulate fetching data from API
  useEffect(() => {
    // Replace this with your API call
    const fetchData = async () => {
      try {
        const response = await fetch('/api/statistics'); // Your API endpoint
        const data = await response.json(); // Assuming response is in JSON format
        setStats({
          backercount: data.backercount,
          projectscount: data.projectscount,
          pledgecount: data.pledgecount,
        });
      } catch (error) {
        console.error('Error fetching data', error);
      }
    };

    fetchData();
  }, []);

  return (
      <div className="space-y-8 px-4 sm:px-8 lg:px-16">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6">Overview</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {/* Backers */}
          <div
              className="bg-white rounded-xl shadow-lg p-6 flex items-center gap-6 transition-all duration-300"
          >
            <div className="p-4 rounded-full bg-blue-500 shadow-md">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-700">Backers</h2>
              <p className="text-3xl font-bold text-gray-900">{stats.backercount}</p>
            </div>
          </div>

          {/* Projects */}
          <div
              className="bg-white rounded-xl shadow-lg p-6 flex items-center gap-6 transition-all duration-300 "
          >
            <div className="p-4 rounded-full bg-green-500 shadow-md">
              <Folder className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-700">Projects</h2>
              <p className="text-3xl font-bold text-gray-900">{stats.projectscount}</p>
            </div>
          </div>

          {/* Pledges */}
          <div
              className="bg-white rounded-xl shadow-lg p-6 flex items-center gap-6 transition-all duration-300 "
          >
            <div className="p-4 rounded-full bg-purple-500 shadow-md">
              <HandCoins className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-700">Pledges</h2>
              <p className="text-3xl font-bold text-gray-900">{stats.pledgecount}</p>
            </div>
          </div>
        </div>
      </div>
  );
};

export default AdminOverview;
