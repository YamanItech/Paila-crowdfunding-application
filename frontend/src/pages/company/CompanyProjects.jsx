import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Perk from '../../Components/perk.jsx'; // Assuming you have the Perk component from your previous code

const CompanyProjects = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showPerkModal, setShowPerkModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedProjectId, setSelectedProjectId] = useState(null);
    const [perkData, setPerkData] = useState(null);
    const [loadingPerk, setLoadingPerk] = useState(false);
    const [editFormData, setEditFormData] = useState({
        project_name: '',
        project_description: ''
    });
    const [updating, setUpdating] = useState(false);
    const companyId = localStorage.getItem('id');

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`http://localhost:8000/api/v1/company/project/${companyId}`);
            setProjects(response.data.data);
        } catch (error) {
            console.error("Error fetching projects", error);
        } finally {
            setLoading(false);
        }
    };

    const handleShowPerks = async (productId) => {
        setSelectedProjectId(productId);
        setLoadingPerk(true);
        setShowPerkModal(true);

        try {
            const response = await axios.get(`http://localhost:8000/api/v1/project/perk/${productId}`);
            setPerkData(response.data);
        } catch (error) {
            console.error("Error fetching perk data", error);
            setPerkData(null);
        } finally {
            setLoadingPerk(false);
        }
    };

    const closePerkModal = () => {
        setShowPerkModal(false);
        setSelectedProjectId(null);
    };

    // New functions for editing project
    const handleEditProject = (project) => {
        setSelectedProjectId(project._id);
        setEditFormData({
            project_name: project.project_name,
            project_description: project.project_description
        });
        setShowEditModal(true);
    };

    const closeEditModal = () => {
        setShowEditModal(false);
        setSelectedProjectId(null);
        setEditFormData({
            project_name: '',
            project_description: ''
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleUpdateProject = async (e) => {
        e.preventDefault();

        // Validate form data
        if (!editFormData.project_name.trim() && !editFormData.project_description.trim()) {
            alert("At least one of project name or description must be provided");
            return;
        }

        try {
            setUpdating(true);
            await axios.patch(

                `http://localhost:8000/api/v1/company/projects/${selectedProjectId}/update`,
                editFormData
            );

            // Refresh projects list
            await fetchProjects();
            closeEditModal();
        } catch (error) {
            console.error("Error updating project", error);
            alert("Failed to update project. Please try again.");
        } finally {
            setUpdating(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl font-bold text-center text-coral-700 mb-10">Projects Management</h1>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-coral-700"></div>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-200">
                        <div className="overflow-x-auto">
                            <table className="min-w-full">
                                <thead>
                                <tr className="bg-gradient-to-r from-coral-600 to-coral-700 text-white">
                                    <th className="py-4 px-6 text-left text-sm font-medium uppercase tracking-wider"></th>
                                    <th className="py-4 px-6 text-left text-sm font-medium uppercase tracking-wider">Project Name</th>
                                    <th className="py-4 px-6 text-left text-sm font-medium uppercase tracking-wider">Description</th>
                                    <th className="py-4 px-6 text-left text-sm font-medium uppercase tracking-wider">Fund Amount</th>
                                    <th className="py-4 px-6 text-left text-sm font-medium uppercase tracking-wider">Status</th>
                                    <th className="py-4 px-6 text-left text-sm font-medium uppercase tracking-wider">Start Date</th>
                                    <th className="py-4 px-6 text-left text-sm font-medium uppercase tracking-wider">End Date</th>
                                    <th className="py-4 px-6 text-left text-sm font-medium uppercase tracking-wider">Actions</th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                {projects.map((project, index) => (
                                    <tr key={project._id} className={index % 2 === 0 ? "bg-white hover:bg-gray-50" : "bg-gray-50 hover:bg-gray-100"}
                                        style={{ transition: "all 0.2s ease-in-out" }}>
                                        <td className="py-4 px-6">
                                            <img
                                                src={project.Images && project.Images.length > 0 ? project.Images[0] : 'https://via.placeholder.com/150'}
                                                alt="Project"
                                                className="h-20 w-32 object-cover rounded-lg shadow-md"
                                            />
                                        </td>
                                        <td className="py-4 px-6 font-semibold text-gray-800">
                                            {project.project_name}
                                            {project.verified && (
                                                <span className="ml-2 text-green-600 text-xs font-semibold bg-green-100 rounded-full px-2 py-0.5">
                                                        Verified
                                                    </span>
                                            )}
                                        </td>
                                        <td className="py-4 px-6 text-gray-600">
                                            {project.project_description.length > 50 ? (
                                                `${project.project_description.slice(0, 50)}...`
                                            ) : project.project_description}
                                        </td>
                                        <td className="py-4 px-6 text-gray-700 font-medium">
                                            ${project.fund_amount.toLocaleString()}
                                        </td>
                                        <td className="py-4 px-6">
                                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                                                    project.status === "Active"
                                                        ? "bg-green-100 text-green-800"
                                                        : "bg-red-100 text-red-800"
                                                }`}>
                                                    {project.status}
                                                </span>
                                        </td>
                                        <td className="py-4 px-6 text-gray-600">
                                            {new Date(project.start_date).toLocaleDateString()}
                                        </td>
                                        <td className="py-4 px-6 text-gray-600">
                                            {new Date(project.end_date).toLocaleDateString()}
                                        </td>
                                        <td className="py-4 px-6 flex space-x-2">
                                            <button
                                                onClick={() => handleShowPerks(project._id)}
                                                className="bg-coral-600 hover:bg-coral-700 text-white text-sm font-medium py-1.5 px-3 rounded-md transition duration-300 focus:outline-none focus:ring-2 focus:ring-coral-500 focus:ring-opacity-50 shadow-sm"
                                            >
                                                View Perks
                                            </button>
                                            <button
                                                onClick={() => handleEditProject(project)}
                                                className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-1.5 px-3 rounded-md transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 shadow-sm"
                                            >
                                                Edit
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>

                        {projects.length === 0 && (
                            <div className="text-center py-10 text-gray-500">
                                <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p className="text-lg">No projects found</p>
                                <p className="text-sm text-gray-400 mt-1">Projects you create will appear here</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Modal for displaying perks */}
            {showPerkModal && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm transition-opacity duration-300">
                    <div className="bg-white rounded-xl max-w-2xl w-full max-h-90 overflow-y-auto m-4 shadow-2xl transform transition-all duration-300 scale-100">
                        <div className="flex justify-between items-center border-b border-gray-200 p-4 bg-gradient-to-r from-coral-50 to-white">
                            <h2 className="text-xl font-bold text-coral-700">Project Perks</h2>
                            <button
                                onClick={closePerkModal}
                                className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full p-1.5 transition duration-300 focus:outline-none"
                            >
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="p-4">
                            {loadingPerk ? (
                                <div className="flex justify-center items-center h-48">
                                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-coral-700"></div>
                                </div>
                            ) : perkData ? (
                                <Perk perkData={perkData} />
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    <svg className="w-12 h-12 mx-auto text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4M12 4v16" />
                                    </svg>
                                    <p className="text-base">No perk data available</p>
                                </div>
                            )}
                        </div>

                        <div className="border-t border-gray-200 p-3 flex justify-end bg-gray-50">
                            <button
                                onClick={closePerkModal}
                                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-1.5 px-4 rounded-md transition duration-300 shadow-sm text-sm"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal for editing project */}
            {showEditModal && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm transition-opacity duration-300">
                    <div className="bg-white rounded-xl max-w-md w-full m-4 shadow-2xl transform transition-all duration-300 scale-100">
                        <div className="flex justify-between items-center border-b border-gray-200 p-4 bg-gradient-to-r from-coral-50 to-white">
                            <h2 className="text-xl font-bold text-coral-700">Edit Project</h2>
                            <button
                                onClick={closeEditModal}
                                className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full p-1.5 transition duration-300 focus:outline-none"
                            >
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <form onSubmit={handleUpdateProject} className="p-4">
                            <div className="mb-4">
                                <label htmlFor="project_name" className="block text-sm font-medium text-gray-700 mb-1">
                                    Project Name
                                </label>
                                <input
                                    type="text"
                                    id="project_name"
                                    name="project_name"
                                    value={editFormData.project_name}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-coral-500 focus:border-transparent"
                                />
                            </div>

                            <div className="mb-4">
                                <label htmlFor="project_description" className="block text-sm font-medium text-gray-700 mb-1">
                                    Project Description
                                </label>
                                <textarea
                                    id="project_description"
                                    name="project_description"
                                    value={editFormData.project_description}
                                    onChange={handleInputChange}
                                    rows={4}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-coral-500 focus:border-transparent"
                                ></textarea>
                            </div>

                            <div className="border-t border-gray-200 pt-4 mt-2 flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={closeEditModal}
                                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-md transition duration-300 shadow-sm text-sm"
                                    disabled={updating}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-coral-600 hover:bg-coral-700 text-white font-medium py-2 px-4 rounded-md transition duration-300 focus:outline-none focus:ring-2 focus:ring-coral-500 focus:ring-opacity-50 shadow-sm text-sm"
                                    disabled={updating}
                                >
                                    {updating ? (
                                        <span className="flex items-center">
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Updating...
                                        </span>
                                    ) : 'Update Project'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CompanyProjects;