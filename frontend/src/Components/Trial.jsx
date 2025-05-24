  import React, { useState } from 'react';
  import { Upload, CheckCircle, AlertCircle } from 'lucide-react';

  export default function Trial() {
    const id=localStorage.getItem('id');
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
      fullName: '',
      gender: '',
      dob: '',
      citizenshipNumber: '',
      citizenshipIssueDistrict: '',
      citizenshipIssueDate: '',
      province: '',
      district: '',
      address: '',
      mobileNumber: '',
      email: '',
      occupation: '',
      citizenshipPhoto: null,
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const provinces = [
      { value: 'province1', label: 'Province 1' },
      { value: 'madhesh', label: 'Madhesh Province' },
      { value: 'bagmati', label: 'Bagmati Province' },
      { value: 'gandaki', label: 'Gandaki Province' },
      { value: 'lumbini', label: 'Lumbini Province' },
      { value: 'karnali', label: 'Karnali Province' },
      { value: 'sudurpaschim', label: 'Sudurpaschim Province' }
    ];

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
      setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const handleFileChange = (name) => (e) => {
      const file = e.target.files?.[0];
      if (file) {
        if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
          setErrors(prev => ({ ...prev, [name]: 'Only JPG and PNG files are allowed.' }));
          setFormData(prev => ({ ...prev, [name]: null }));
          return;
        }
        if (file.size > 2 * 1024 * 1024) {
          setErrors(prev => ({ ...prev, [name]: 'File size must be less than 2MB.' }));
          setFormData(prev => ({ ...prev, [name]: null }));
          return;
        }
        setFormData(prev => ({ ...prev, [name]: file }));
        setErrors(prev => ({ ...prev, [name]: '' }));
      }
    };

    // Validation per step
    const validateStep = () => {
      let currentErrors = {};
      if (step === 1) {
        if (!formData.fullName.trim()) currentErrors.fullName = 'Full Name is required.';
        if (!formData.gender) currentErrors.gender = 'Gender is required.';
        if (!formData.dob) currentErrors.dob = 'Date of Birth is required.';
        if (!formData.citizenshipNumber.trim()) currentErrors.citizenshipNumber = 'Citizenship Number is required.';
        if (!formData.citizenshipIssueDistrict.trim()) currentErrors.citizenshipIssueDistrict = 'Issue District is required.';
        if (!formData.citizenshipIssueDate) currentErrors.citizenshipIssueDate = 'Issue Date is required.';
      } else if (step === 2) {
        if (!formData.province) currentErrors.province = 'Province is required.';
        if (!formData.district.trim()) currentErrors.district = 'District is required.';
        if (!formData.address.trim()) currentErrors.address = 'Address is required.';
        if (!formData.mobileNumber.trim()) currentErrors.mobileNumber = 'Mobile Number is required.';
        if (!formData.email.trim()) currentErrors.email = 'Email is required.';
        if (!formData.occupation) currentErrors.occupation = 'Occupation is required.';
      } else if (step === 3) {
        if (!formData.citizenshipPhoto) currentErrors.citizenshipPhoto = 'Citizenship photo is required.';
      }

      setErrors(currentErrors);
      return Object.keys(currentErrors).length === 0;
    };

    const nextStep = () => {
      if (validateStep()) {
        setStep(prev => prev + 1);
      }
    };

    const prevStep = () => {
      setStep(prev => prev - 1);
      setErrors({});
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      if (!validateStep()) return;

      setIsSubmitting(true);

      // Prepare form data for POST request
      const data = new FormData();
      data.append('fullName', formData.fullName);
      data.append('gender', formData.gender);
      data.append('dob', formData.dob);
      data.append('citizenshipNumber', formData.citizenshipNumber);
      data.append('citizenshipIssueDistrict', formData.citizenshipIssueDistrict);
      data.append('citizenshipIssueDate', formData.citizenshipIssueDate);
      data.append('province', formData.province);
      data.append('district', formData.district);
      data.append('address', formData.address);
      data.append('mobileNumber', formData.mobileNumber);
      data.append('email', formData.email);
      data.append('occupation', formData.occupation);
      if (formData.citizenshipPhoto) {
        data.append('kycImage', formData.citizenshipPhoto);
      }

      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND}/api/v1/users/${id}/updatekyc`, {
          method: 'POST',
          body: data,
          // Note: Do NOT set 'Content-Type' header to multipart/form-data manually; browser handles it.
        });

        if (!response.ok) {
          throw new Error('Failed to submit form');
        }

        setIsSubmitting(false);
        setSubmitted(true);
      } catch (error) {
        setIsSubmitting(false);
        alert(error.message);
      }
    };


    if (submitted) {
      return (
        <div className="max-w-md mx-auto px-4 py-6 bg-white rounded-lg shadow">
          <div className="flex flex-col items-center justify-center py-6">
            <CheckCircle className="text-green-500 w-12 h-12 mb-4" />
            <h2 className="text-xl font-bold text-gray-800 mb-2">KYC Submitted Successfully!</h2>
            <p className="text-gray-600 text-center mb-4">Your KYC information is under review.</p>
            <p className="text-gray-500 text-sm">Ref: KYC-{Math.random().toString(36).substring(2, 8).toUpperCase()}</p>
          </div>
        </div>
      );
    }

    return (
      <div className="max-w-md mx-auto px-4 bg-white rounded-lg shadow">
        <div className="py-4 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-800 text-center">KYC Form</h1>
          <p className="text-sm text-gray-600 text-center mt-1">Know Your Customer Verification</p>
        </div>

        {/* Progress Bar */}
        <div className="py-2">
          <div className="flex justify-between mb-1">
            <span className="text-xs font-medium text-blue-700">Step {step} of 3</span>
            <span className="text-xs font-medium text-blue-700">{Math.round((step / 3) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: `${(step / 3) * 100}%` }}></div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="pb-4">
          {step === 1 && (
            <div className="py-4 space-y-4">
              <h2 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-1">Personal Information</h2>

              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="As per citizenship document"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 ${
                      errors.fullName ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                    }`}
                  />
                  {errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName}</p>}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Gender <span className="text-red-500">*</span></label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 ${
                        errors.gender ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                      }`}
                    >
                      <option value="">Select</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                    {errors.gender && <p className="text-xs text-red-500 mt-1">{errors.gender}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth <span className="text-red-500">*</span></label>
                    <input
                      type="date"
                      name="dob"
                      value={formData.dob}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 ${
                        errors.dob ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                      }`}
                    />
                    {errors.dob && <p className="text-xs text-red-500 mt-1">{errors.dob}</p>}
                  </div>
                </div>
              </div>

              <h2 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-1 mt-4">Citizenship Details</h2>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Citizenship Number <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    name="citizenshipNumber"
                    value={formData.citizenshipNumber}
                    onChange={handleChange}
                    placeholder="Enter citizenship number"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 ${
                      errors.citizenshipNumber ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                    }`}
                  />
                  {errors.citizenshipNumber && <p className="text-xs text-red-500 mt-1">{errors.citizenshipNumber}</p>}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Issue District <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      name="citizenshipIssueDistrict"
                      value={formData.citizenshipIssueDistrict}
                      onChange={handleChange}
                      placeholder="District of issue"
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 ${
                        errors.citizenshipIssueDistrict ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                      }`}
                    />
                    {errors.citizenshipIssueDistrict && <p className="text-xs text-red-500 mt-1">{errors.citizenshipIssueDistrict}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Issue Date <span className="text-red-500">*</span></label>
                    <input
                      type="date"
                      name="citizenshipIssueDate"
                      value={formData.citizenshipIssueDate}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 ${
                        errors.citizenshipIssueDate ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                      }`}
                    />
                    {errors.citizenshipIssueDate && <p className="text-xs text-red-500 mt-1">{errors.citizenshipIssueDate}</p>}
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="py-4 space-y-4">
              <h2 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-1">Address and Contact</h2>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Province <span className="text-red-500">*</span></label>
                  <select
                    name="province"
                    value={formData.province}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 ${
                      errors.province ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                    }`}
                  >
                    <option value="">Select Province</option>
                    {provinces.map(p => (
                      <option key={p.value} value={p.value}>{p.label}</option>
                    ))}
                  </select>
                  {errors.province && <p className="text-xs text-red-500 mt-1">{errors.province}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">District <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    name="district"
                    value={formData.district}
                    onChange={handleChange}
                    placeholder="District"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 ${
                      errors.district ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                    }`}
                  />
                  {errors.district && <p className="text-xs text-red-500 mt-1">{errors.district}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address <span className="text-red-500">*</span></label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Full address"
                    rows={3}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 ${
                      errors.address ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                    }`}
                  />
                  {errors.address && <p className="text-xs text-red-500 mt-1">{errors.address}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number <span className="text-red-500">*</span></label>
                  <input
                    type="tel"
                    name="mobileNumber"
                    value={formData.mobileNumber}
                    onChange={handleChange}
                    placeholder="e.g. +977-9800000000"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 ${
                      errors.mobileNumber ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                    }`}
                  />
                  {errors.mobileNumber && <p className="text-xs text-red-500 mt-1">{errors.mobileNumber}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email <span className="text-red-500">*</span></label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="email@example.com"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 ${
                      errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                    }`}
                  />
                  {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Occupation <span className="text-red-500">*</span></label>
                  <select
                    name="occupation"
                    value={formData.occupation}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 ${
                      errors.occupation ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                    }`}
                  >
                    <option value="">Select Occupation</option>
                    <option value="business">Business</option>
                    <option value="job">Job</option>
                    <option value="student">Student</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.occupation && <p className="text-xs text-red-500 mt-1">{errors.occupation}</p>}
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="py-4 space-y-4">
              <h2 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-1">Upload Citizenship Photo</h2>
              <p className="text-sm text-gray-600">Allowed file types: JPG, PNG. Max size: 2MB.</p>

              <div>
                <label
                  htmlFor="citizenshipPhoto"
                  className="flex items-center justify-center border-2 border-dashed border-gray-400 rounded-md cursor-pointer py-10 text-gray-400 hover:text-gray-700"
                >
                  <Upload className="w-6 h-6 mr-2" />
                  {formData.citizenshipPhoto ? formData.citizenshipPhoto.name : 'Click to upload your citizenship photo'}
                </label>
                <input
                  type="file"
                  id="citizenshipPhoto"
                  name="citizenshipPhoto"
                  accept=".jpg,.jpeg,.png"
                  onChange={handleFileChange('citizenshipPhoto')}
                  className="hidden"
                />
                {errors.citizenshipPhoto && <p className="text-xs text-red-500 mt-1">{errors.citizenshipPhoto}</p>}

                {formData.citizenshipPhoto && (
                  <img
                    src={URL.createObjectURL(formData.citizenshipPhoto)}
                    alt="Citizenship Preview"
                    className="mt-4 w-full rounded-md border"
                  />
                )}
              </div>
            </div>
          )}

          {/* Navigation buttons */}
          <div className="flex justify-between mt-6">
            {step > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
              >
                Previous
              </button>
            )}

            {step < 3 && (
              <button
                type="button"
                onClick={nextStep}
                className="ml-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Next
              </button>
            )}

            {step === 3 && (
              <button
                type="submit"
                disabled={isSubmitting}
                className={`ml-auto px-4 py-2 rounded-md text-white ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
              >
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </button>
            )}
          </div>
        </form>
      </div>
    );
  }
