import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from "react-toastify";
const ManageProjects = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updatingStatusProjectId, setUpdatingStatusProjectId] = useState(null);
    const [updatingFeatureProjectId, setUpdatingFeatureProjectId] = useState(null);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BACKEND}/api/v1/company/allProjects`, {
                    withCredentials: true,
                });
                setProjects(response.data.data);
            } catch (error) {
                console.error("Error fetching projects", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    const handleStatusToggle = async (projectId) => {
        setUpdatingStatusProjectId(projectId);
        try {
            const response = await axios.patch(`${import.meta.env.VITE_BACKEND}/api/v1/company/projects/status/${projectId}`, {}, {
                withCredentials: true,
            });

            setProjects((prevProjects) =>
              prevProjects.map((project) =>
                project._id === projectId
                  ? { ...project, status: project.status === "Active" ? "Inactive" : "Active" }
                  : project
              )
            );

            // Add toast notification with backend message
            toast.success(response.data.message || "Project status updated successfully and email sent.");
        } catch (error) {
            console.error("Error updating project status", error);
            toast.error(error.response?.data?.message || "Failed to update project status");
        } finally {
            setUpdatingStatusProjectId(null);
        }
    };

    const handleFeatureToggle = async (projectId, currentVerified) => {
        setUpdatingFeatureProjectId(projectId);
        try {
            const response = await axios.patch(`${import.meta.env.VITE_BACKEND}/api/v1/company/projects/feature/${projectId}`, {
                verified: !currentVerified
            }, {
                withCredentials: true
            });

            console.log('Feature toggle response:', response.data);
            toast.success(response.data.message || `Project ${!currentVerified ? "featured" : "unfeatured"} successfully and email sent.`);
            setProjects((prevProjects) =>
              prevProjects.map((project) =>
                project._id === projectId
                  ? { ...project, verified: !currentVerified }
                  : project
              )
            );
        } catch (error) {
            console.error("Error toggling featured status", error);
            console.error("Error response:", error.response?.data);
            console.error("Error status:", error.response?.status);
            toast.error(error.response?.data?.message || "Failed to update featured status");
        } finally {
            setUpdatingFeatureProjectId(null);
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
                                <th className="py-4 px-6 text-left text-sm font-medium uppercase tracking-wider">Featured</th>
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
                                        disabled={updatingStatusProjectId === project._id}
                                      >
                                          {updatingStatusProjectId === project._id
                                            ? "Updating..."
                                            : project.status === "Active"
                                              ? "Deactivate"
                                              : "Activate"}
                                      </button>
                                  </td>
                                  <td className="py-4 px-6">
                                      <button
                                        onClick={() => handleFeatureToggle(project._id, project.verified)}
                                        className={`py-2 px-4 rounded-md text-white font-medium focus:outline-none transition duration-200 transform hover:scale-105 hover:shadow-md ${
                                          project.verified
                                            ? "bg-yellow-500 hover:bg-yellow-600"
                                            : "bg-gray-400 hover:bg-gray-500"
                                        }`}
                                        disabled={updatingFeatureProjectId === project._id}
                                      >
                                          {updatingFeatureProjectId === project._id
                                            ? "Updating..."
                                            : project.verified
                                              ? "Unfeature"
                                              : "Feature"}
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