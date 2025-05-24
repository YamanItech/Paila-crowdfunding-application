import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ManageProjects = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updatingProjectId, setUpdatingProjectId] = useState(null); // Track which project is being updated

    // Fetch projects data from your API
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BACKEND}/api/v1/company/allProjects`);
                setProjects(response.data.data);
            } catch (error) {
                console.error("Error fetching projects", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    // Handle toggle for status field
    const handleStatusToggle = async (projectId) => {
        setUpdatingProjectId(projectId);
        try {
            await axios.patch(`http://localhost:8000/api/v1/company/projects/status/${projectId}`);
            // Update the project status locally after the toggle
            setProjects((prevProjects) =>
              prevProjects.map((project) =>
                project._id === projectId
                  ? { ...project, status: project.status === "Active" ? "Inactive" : "Active" }
                  : project
              )
            );
        } catch (error) {
            console.error("Error updating project status", error);
        } finally {
            setUpdatingProjectId(null);
        }
    };

    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-8">
          <div className="max-w-6xl mx-auto">
              <h1 className="text-4xl font-bold text-center text-coral-700 mb-10">Projects Management</h1>

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
                                <th className="py-4 px-6 text-left text-sm font-medium uppercase tracking-wider"></th>
                                <th className="py-4 px-6 text-left text-sm font-medium uppercase tracking-wider">Project Name</th>
                                <th className="py-4 px-6 text-left text-sm font-medium uppercase tracking-wider">Category</th>
                                <th className="py-4 px-6 text-left text-sm font-medium uppercase tracking-wider">Fund Amount</th>
                                <th className="py-4 px-6 text-left text-sm font-medium uppercase tracking-wider">Status</th>
                                <th className="py-4 px-6 text-left text-sm font-medium uppercase tracking-wider">Actions</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                            {projects.map((project, index) => (
                              <tr key={project._id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                                  <td className="py-4 px-6">
                                      <img
                                        src={project.Images && project.Images.length > 0 ? project.Images[0] : 'https://via.placeholder.com/80'}
                                        alt="Project"
                                        className="h-16 w-16 object-cover rounded-md"
                                      />
                                  </td>
                                  <td className="py-4 px-6 text-gray-800 font-medium">{project.project_name}</td>
                                  <td className="py-4 px-6 text-gray-600">{project.Category}</td>
                                  <td className="py-4 px-6 text-gray-700">${project.fund_amount.toLocaleString()}</td>
                                  <td className="py-4 px-6">
                                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                                                  project.status === "Active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                                                }`}>
                                                    <span className={`w-2 h-2 mr-2 rounded-full ${project.status === "Active" ? "bg-green-500" : "bg-red-500"}`}></span>
                                                    {project.status}
                                                </span>
                                  </td>
                                  <td className="py-4 px-6">
                                      <button
                                        className={`py-2 px-4 rounded-md text-white font-medium focus:outline-none transition duration-200 transform hover:scale-105 hover:shadow-md ${
                                          project.status === "Active"
                                            ? "bg-red-500 hover:bg-red-600"
                                            : "bg-green-500 hover:bg-green-600"
                                        }`}
                                        onClick={() => handleStatusToggle(project._id)}
                                        disabled={updatingProjectId === project._id}
                                      >
                                          {updatingProjectId === project._id
                                            ? "Updating..."
                                            : project.status === "Active"
                                              ? "Deactivate"
                                              : "Activate"}
                                      </button>
                                  </td>
                              </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>

                    {projects.length === 0 && (
                      <div className="text-center py-10 text-gray-500">
                          No projects found
                      </div>
                    )}
                </div>
              )}
          </div>
      </div>
    );
};

export default ManageProjects;
