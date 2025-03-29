import React, { useState, useEffect } from "react";
import { Mail, Lock, User, UserCog, ArrowRight, Loader2 } from "lucide-react";
import postAxios from "../hooks/postAxios";

const SignupForm = ({ onSwitchToLogin }) => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("backer");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const { makeRequest, data, isLoading, error: requestError } = postAxios('http://localhost:8000/api/v1/users/register');

  const validateForm = () => {
    const newErrors = {};

    if (!fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    // Validate form
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Prepare data for API
    const userData = {
      fullName,
      email,
      password,
      role,
    };
    
    await makeRequest(userData);
    setIsSubmitting(false);
  };

  // Handle successful login data updates
  useEffect(() => {
    if (data && !requestError) {
      setError("");
      setMessage(data.message || "User registered successfully");
    }
  }, [data, requestError]);

  // Show error from the hook if present
  useEffect(() => {
    if (requestError) {
      setMessage("");
      setError(requestError.response?.data?.message || requestError.message || "An error occurred during registration");
    }
  }, [requestError]);

  // Determine success and error states for UI display
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
          <div>
            <label
              htmlFor="fullName"
              className="block text-sm font-medium text-gray-700"
            >
              Full Name
            </label>
            <div className="mt-1 relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400 group-focus-within:text-coral transition-colors" />
              </div>
              <input
                id="fullName"
                type="text"
                className={`block w-full pl-10 pr-3 py-2.5 border ${
                  errors.fullName
                    ? "border-red-300 ring-1 ring-red-300"
                    : "border-gray-300"
                } rounded-xl focus:outline-none focus:ring-2 focus:ring-coral focus:border-transparent bg-white/50 backdrop-blur-sm transition-all`}
                placeholder="Enter your full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
            {errors.fullName && (
              <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <div className="mt-1 relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-coral transition-colors" />
              </div>
              <input
                id="email"
                type="email"
                className={`block w-full pl-10 pr-3 py-2.5 border ${
                  errors.email
                    ? "border-red-300 ring-1 ring-red-300"
                    : "border-gray-300"
                } rounded-xl focus:outline-none focus:ring-2 focus:ring-coral focus:border-transparent bg-white/50 backdrop-blur-sm transition-all`}
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <div className="mt-1 relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-coral transition-colors" />
              </div>
              <input
                id="password"
                type="password"
                className={`block w-full pl-10 pr-3 py-2.5 border ${
                  errors.password
                    ? "border-red-300 ring-1 ring-red-300"
                    : "border-gray-300"
                } rounded-xl focus:outline-none focus:ring-2 focus:ring-coral focus:border-transparent bg-white/50 backdrop-blur-sm transition-all`}
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {errors.password ? (
              <p className="mt-1 text-sm text-red-600">{errors.password}</p>
            ) : (
              <p className="mt-1 text-sm text-gray-500">
                Must be at least 8 characters long
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="role"
              className="block text-sm font-medium text-gray-700"
            >
              Role
            </label>
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
            <a
              href="#"
              className="text-coral hover:text-coral-600 transition-colors"
            >
              Terms of Service
            </a>{" "}
            and{" "}
            <a
              href="#"
              className="text-coral hover:text-coral-600 transition-colors"
            >
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