import React, { useState, useEffect } from "react";
import { Mail, Lock } from "lucide-react";
import postAxios from "../hooks/postAxios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const LoginForm = ({ onSwitchToSignup }) => {
  const Navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { makeRequest, data, isLoading, error: requestError } = postAxios(
    `${import.meta.env.VITE_BACKEND}/api/v1/users/login`
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    const credentials = { email, password };
    await makeRequest(credentials);
  };

  useEffect(() => {
    if (data && !requestError) {
      toast.success("Welcome back!");
      localStorage.setItem("userRole", data.data.user.role);
      localStorage.setItem("email", data.data.user.email);
      localStorage.setItem("Name", data.data.user.fullName);
      localStorage.setItem("id", data.data.user._id);
      Navigate("/");
    }
  }, [data, requestError]);

  useEffect(() => {
    if (requestError) {
      toast.error(
        requestError.response?.data?.message ||
        requestError.message ||
        "An error occurred during login"
      );
    }
  }, [requestError]);

  return (
    <div className="w-full max-w-md">
      <h2 className="text-4xl font-bold text-center bg-gradient-to-r from-coral to-coral-600 bg-clip-text text-transparent mb-2">
        Welcome Back
      </h2>
      <p className="text-center text-gray-600 mb-8">Sign in to your account</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <div className="mt-1 relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-coral transition-colors" />
              </div>
              <input
                id="email"
                type="email"
                required
                className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-coral focus:border-transparent bg-white/50 backdrop-blur-sm transition-all"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="mt-1 relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-coral transition-colors" />
              </div>
              <input
                id="password"
                type="password"
                required
                className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-coral focus:border-transparent bg-white/50 backdrop-blur-sm transition-all"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl text-sm font-medium text-white bg-gradient-to-r from-coral to-coral-600 hover:from-coral-600 hover:to-coral-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-coral transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg"
          disabled={isLoading}
        >
          {isLoading ? "Signing in..." : "Sign in"}
        </button>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <button
              type="button"
              onClick={onSwitchToSignup}
              className="font-medium text-coral hover:text-coral-600 transition-colors"
            >
              Sign up
            </button>
          </p>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
