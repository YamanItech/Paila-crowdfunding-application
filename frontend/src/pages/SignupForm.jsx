import React, { useState, useEffect, useRef } from "react";
import { Mail, Lock, User, UserCog, ArrowRight, Loader2, Upload, X } from "lucide-react";
import {toast} from 'react-toastify';
import postAxios from "../hooks/postAxios";
import { useNavigate } from "react-router-dom";

const SignupForm = ({ onSwitchToLogin }) => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("backer");
  const [profilePicture, setProfilePicture] = useState(null);
  const [profilePreview, setProfilePreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  const { makeRequest, data, isLoading, error: requestError } = postAxios(`${import.meta.env.VITE_BACKEND}/api/v1/users/register`);
  const Navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};

    if (!fullName.trim()) newErrors.fullName = "Full name is required";
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email address is invalid";
    }
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors({...errors, profilePicture: "Image must be less than 5MB"});
        return;
      }

      if (!file.type.match('image.*')) {
        setErrors({...errors, profilePicture: "Please select an image file"});
        return;
      }

      setProfilePicture(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePreview(reader.result);
      };
      reader.readAsDataURL(file);

      const updatedErrors = {...errors};
      delete updatedErrors.profilePicture;
      setErrors(updatedErrors);
    }
  };

  const removeProfilePicture = () => {
    setProfilePicture(null);
    setProfilePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("fullName", fullName);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("role", role);
      if (profilePicture) {
        formData.append("avatar", profilePicture);
      }

      await makeRequest(formData);
    } catch (err) {
      console.error("Error during form submission:", err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }

  };

  useEffect(() => {
    if (data && !requestError) {
      toast.success(data.message || "User registered successfully");
      onSwitchToLogin();
    }
  }, [data, requestError, Navigate]);


  useEffect(() => {
    if (requestError) {
      const errorMsg =
        requestError.response?.data?.message ||
        requestError.message ||
        "An error occurred during registration";
      toast.error(errorMsg);
    }
  }, [requestError]);


  const submitSuccess = message !== "";
  const submitError = error !== "";

  return (
    <div className="w-full max-w-md">
      <h2 className="text-4xl font-bold text-center bg-gradient-to-r from-coral to-coral-600 bg-clip-text text-transparent mb-2">
        Create Account
      </h2>
      <p className="text-center text-gray-600 mb-8">Join our community today</p>

      {submitSuccess && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
          {message}
        </div>
      )}

      {submitError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          {/* Profile Picture Upload */}
          <div className="flex flex-col items-center">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Profile Picture
            </label>
            <div className="relative">
              <div
                className={`w-32 h-32 rounded-full flex items-center justify-center border-2 border-dashed 
                ${profilePreview ? 'border-coral bg-transparent' : 'border-gray-300 bg-gray-50'} 
                hover:border-coral transition-colors cursor-pointer overflow-hidden`}
                onClick={() => fileInputRef.current.click()}
              >
                {profilePreview ? (
                  <img
                    src={profilePreview}
                    alt="Profile preview"
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <Upload className="h-10 w-10 text-gray-400" />
                )}
              </div>

              {profilePreview && (
                <button
                  type="button"
                  className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                  onClick={removeProfilePicture}
                >
                  <X className="h-4 w-4" />
                </button>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleProfilePictureChange}
                className="hidden"
              />
            </div>
            <p className="mt-2 text-xs text-gray-500">
              Click to upload (Max 5MB)
            </p>
            {errors.profilePicture && (
              <p className="mt-1 text-sm text-red-600">{errors.profilePicture}</p>
            )}
          </div>

          {/* Full Name */}
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Full Name</label>
            <div className="mt-1 relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400 group-focus-within:text-coral transition-colors" />
              </div>
              <input
                id="fullName"
                type="text"
                className={`block w-full pl-10 pr-3 py-2.5 border ${errors.fullName ? "border-red-300 ring-1 ring-red-300" : "border-gray-300"} rounded-xl focus:outline-none focus:ring-2 focus:ring-coral focus:border-transparent bg-white/50 backdrop-blur-sm transition-all`}
                placeholder="Enter your full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
            {errors.fullName && (
              <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <div className="mt-1 relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-coral transition-colors" />
              </div>
              <input
                id="email"
                type="email"
                className={`block w-full pl-10 pr-3 py-2.5 border ${errors.email ? "border-red-300 ring-1 ring-red-300" : "border-gray-300"} rounded-xl focus:outline-none focus:ring-2 focus:ring-coral focus:border-transparent bg-white/50 backdrop-blur-sm transition-all`}
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <div className="mt-1 relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-coral transition-colors" />
              </div>
              <input
                id="password"
                type="password"
                className={`block w-full pl-10 pr-3 py-2.5 border ${errors.password ? "border-red-300 ring-1 ring-red-300" : "border-gray-300"} rounded-xl focus:outline-none focus:ring-2 focus:ring-coral focus:border-transparent bg-white/50 backdrop-blur-sm transition-all`}
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {errors.password ? (
              <p className="mt-1 text-sm text-red-600">{errors.password}</p>
            ) : (
              <p className="mt-1 text-sm text-gray-500">Must be at least 8 characters long</p>
            )}
          </div>

          {/* Role */}
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role</label>
            <div className="mt-1 relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <UserCog className="h-5 w-5 text-gray-400 group-focus-within:text-coral transition-colors" />
              </div>
              <select
                id="role"
                className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-coral focus:border-transparent bg-white/50 backdrop-blur-sm transition-all appearance-none"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="backer">Backer</option>
                {/* <option value="admin">Admin</option> */}
                <option value="company">Company</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <ArrowRight className="h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center">
          <input
            id="terms"
            type="checkbox"
            required
            className="h-4 w-4 text-coral focus:ring-coral border-gray-300 rounded transition-colors"
          />
          <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
            I agree to the{" "}
            <a href="#" className="text-coral hover:text-coral-600 transition-colors">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-coral hover:text-coral-600 transition-colors">
              Privacy Policy
            </a>
          </label>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl text-sm font-medium text-white bg-gradient-to-r from-coral to-coral-600 hover:from-coral-600 hover:to-coral-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-coral transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="animate-spin mr-2 h-4 w-4" />
              Creating Account...
            </>
          ) : (
            "Create Account"
          )}
        </button>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="font-medium text-coral hover:text-coral-600 transition-colors"
            >
              Sign in
            </button>
          </p>
        </div>
      </form>
    </div>
  );
};

export default SignupForm;
