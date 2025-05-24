import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import postAxios from '../../hooks/postAxios';
import { toast } from "react-toastify";
const AddProject = () => {
    const navigate = useNavigate();
    const { makeRequest, data, isLoading } = postAxios('http://localhost:8000/api/v1/company/add-project');

    const today = new Date().toISOString().split('T')[0];

    const addDays = (dateStr, days) => {
        const date = new Date(dateStr);
        date.setDate(date.getDate() + days);
        return date.toISOString().split('T')[0];
    };

    const [formData, setFormData] = useState({
        CompanyId: localStorage.getItem('id'),
        Category: 'Technology',
        project_name: '',
        project_description: '',
        fund_amount: '',
        Images: [],
        start_date: today,
        end_date: addDays(today, 1),
    });

    const [imagePreviewUrls, setImagePreviewUrls] = useState([]);

    useEffect(() => {
        if (data) {
            console.log('POST response:', data);
            if (data.statusCode === 200 || data.statusCode === 201) {
                localStorage.setItem('projectId', data.data._id);
                toast.success("Project added successfully!");
                navigate('/company/addPerk');
            } else {
                toast.error('Something went wrong. Try again.');
            }
        }
    }, [data, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => {
            if (name === 'start_date') {
                const newStartDate = value;
                const currentEndDate = prev.end_date;
                const minEndDate = addDays(newStartDate, 1);
                const maxEndDate = addDays(newStartDate, 60);
                let adjustedEndDate = currentEndDate;

                if (!currentEndDate || currentEndDate < minEndDate) {
                    adjustedEndDate = minEndDate;
                } else if (currentEndDate > maxEndDate) {
                    adjustedEndDate = maxEndDate;
                }

                return {
                    ...prev,
                    start_date: newStartDate,
                    end_date: adjustedEndDate,
                };
            }

            if (name === 'end_date') {
                const minEndDate = addDays(prev.start_date, 1);
                const maxEndDate = addDays(prev.start_date, 60);

                if (value >= minEndDate && value <= maxEndDate) {
                    return { ...prev, end_date: value };
                } else {
                    return prev;
                }
            }

            return {
                ...prev,
                [name]: value,
            };
        });
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length + formData.Images.length > 3) {
            return toast.error('You can only upload up to 3 images!');
        }

        const validFiles = files.filter(
          (file) => file.type.startsWith('image/') && file.size <= 3 * 1024 * 1024
        );

        if (validFiles.length !== files.length) {
            toast.error('Some files were invalid! Only image files under 3MB are allowed.');
        }

        const newPreviews = validFiles.map((file) => URL.createObjectURL(file));
        setImagePreviewUrls((prev) => [...prev, ...newPreviews]);
        setFormData((prev) => ({
            ...prev,
            Images: [...prev.Images, ...validFiles],
        }));
    };

    const removeImage = (index) => {
        setImagePreviewUrls((prev) => prev.filter((_, i) => i !== index));
        setFormData((prev) => ({
            ...prev,
            Images: prev.Images.filter((_, i) => i !== index),
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isLoading) return;

        const { project_name, project_description, fund_amount, start_date, end_date } = formData;

        const wordCount = project_description.trim().split(/\s+/).filter(Boolean).length;

        if (!project_name.trim() || !project_description.trim()) {
            return toast.error('Project name and description are required!');
        }

        if (wordCount < 25 || wordCount > 40) {
            return toast.error('Project description must be between 25 and 40 words!');
        }

        if (!fund_amount || fund_amount <= 0) {
            return toast.error('Funding amount must be greater than zero!');
        }

        if (!start_date || !end_date) {
            return toast.error('Both start and end dates are required!');
        }

        if (new Date(start_date) >= new Date(end_date)) {
            return toast.error('Start date must be before end date!');
        }

        if (formData.Images.length !== 3) {
            return toast.error('Please upload exactly 3 images.');
        }

        const formDataToSend = new FormData();
        for (const key in formData) {
            if (key === 'Images') {
                formData.Images.forEach((img) => formDataToSend.append('Image', img));
            } else {
                formDataToSend.append(key, formData[key]);
            }
        }

        try {
            await makeRequest(formDataToSend);
        } catch (error) {
            console.error('Submission error:', error);
        }
    };

    return (
      <div className=" min-h-screen p-6">
          <div className="max-w-2xl mx-auto bg-header-bg rounded-lg shadow-md p-8">
              <h1 className="text-3xl font-bold text-coral-700 mb-6">Add New Project</h1>

              <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                      <label htmlFor="Category" className="block text-lg font-medium text-coral-800">
                          Category
                      </label>
                      <select
                        id="Category"
                        name="Category"
                        value={formData.Category}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-card-bg border border-card-alt-bg rounded-md focus:ring-2 focus:ring-coral-500 focus:outline-none"
                      >
                          <option value="Art">Art</option>
                          <option value="Technology">Technology</option>
                          <option value="Musics">Musics</option>
                          <option value="Publishing">Publishing</option>
                          <option value="Games">Games</option>
                          <option value="Food">Food</option>
                      </select>
                  </div>

                  <div className="space-y-2">
                      <label htmlFor="project_name" className="block text-lg font-medium text-coral-800">
                          Project Name
                      </label>
                      <input
                        type="text"
                        id="project_name"
                        name="project_name"
                        value={formData.project_name}
                        onChange={handleChange}
                        placeholder="AI-Powered Smart Assistant"
                        className="w-full px-4 py-3 bg-card-bg border border-card-alt-bg rounded-md focus:ring-2 focus:ring-coral-500 focus:outline-none"
                        required
                      />
                  </div>

                  <div className="space-y-2">
                      <label htmlFor="project_description" className="block text-lg font-medium text-coral-800">
                          Project Description
                      </label>
                      <textarea
                        id="project_description"
                        name="project_description"
                        minLength={20}
                        value={formData.project_description}
                        onChange={handleChange}
                        placeholder="An AI-driven virtual assistant..."
                        rows="4"
                        className="w-full px-4 py-3 bg-card-bg border border-card-alt-bg rounded-md focus:ring-2 focus:ring-coral-500 focus:outline-none"
                        required
                      />
                  </div>

                  <div className="space-y-2">
                      <label htmlFor="fund_amount" className="block text-lg font-medium text-coral-800">
                          Funding Amount
                      </label>
                      <input
                        type="number"
                        id="fund_amount"
                        name="fund_amount"
                        value={formData.fund_amount}
                        onChange={handleChange}
                        placeholder="50000"
                        className="w-full px-4 py-3 bg-card-bg border border-card-alt-bg rounded-md focus:ring-2 focus:ring-coral-500 focus:outline-none"
                        min={10000}
                        required
                      />
                  </div>

                  <div className="space-y-2">
                      <label className="block text-lg font-medium text-coral-800">Project Images</label>
                      <label
                        htmlFor="Images"
                        className="cursor-pointer inline-flex items-center px-4 py-3 bg-coral text-white rounded-md hover:bg-coral-600 transition"
                      >
                          Upload Images
                          <input
                            type="file"
                            id="Images"
                            name="Images"
                            accept="image/*"
                            multiple
                            onChange={handleImageChange}
                            className="hidden"
                          />
                      </label>

                      {imagePreviewUrls.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                            {imagePreviewUrls.map((url, index) => (
                              <div key={index} className="relative group">
                                  <img src={url} alt={`Preview ${index}`} className="h-48 w-full object-cover rounded-md" />
                                  <button
                                    type="button"
                                    onClick={() => removeImage(index)}
                                    className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                                  >
                                      ✕
                                  </button>
                              </div>
                            ))}
                        </div>
                      )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                          <label htmlFor="start_date" className="block text-lg font-medium text-coral-800">
                              Start Date
                          </label>
                          <input
                            type="date"
                            id="start_date"
                            name="start_date"
                            value={formData.start_date}
                            onChange={handleChange}
                            min={today}
                            className="w-full px-4 py-3 bg-card-bg border border-card-alt-bg rounded-md focus:ring-2 focus:ring-coral-500 focus:outline-none"
                            required
                          />
                      </div>

                      <div className="space-y-2">
                          <label htmlFor="end_date" className="block text-lg font-medium text-coral-800">
                              End Date
                          </label>
                          <input
                            type="date"
                            id="end_date"
                            name="end_date"
                            value={formData.end_date}
                            onChange={handleChange}
                            min={addDays(formData.start_date, 1)}
                            max={addDays(formData.start_date, 60)}
                            className="w-full px-4 py-3 bg-card-bg border border-card-alt-bg rounded-md focus:ring-2 focus:ring-coral-500 focus:outline-none"
                            required
                          />
                      </div>
                  </div>

                  <div className="pt-4">
                      <button
                        type="submit"
                        className="w-full bg-coral hover:bg-coral-600 text-white font-bold py-3 px-6 rounded-md"
                        disabled={isLoading}
                      >
                          {isLoading ? 'Submitting...' : 'Next'}
                      </button>
                  </div>
              </form>
          </div>
      </div>
    );
};

export default AddProject;
