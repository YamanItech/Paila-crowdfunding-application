import React, { useState, useEffect } from "react"
import { Mail, Lock } from "lucide-react"
import postAxios from "../hooks/postAxios"

const LoginForm = ({ onSwitchToSignup }) => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState("")  
  const [error, setError] = useState("")      
  const { makeRequest, data, isLoading, error: requestError } = postAxios('http://localhost:8000/api/v1/users/login');

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")  
    setMessage("")
    
    const credentials = {
      "email": email,
      "password": password
    }
    
   await makeRequest(credentials);
    
  }

  // Handle successful login data updates
  useEffect(() => {
    if (data && !requestError) {
      setError("")
      setMessage(data.message || "User logged in successfully");
    }
  }, [data, requestError]);

  // Show error from the hook if present
  useEffect(() => {
    if (requestError) {
      setMessage("")
      setError(requestError.response?.data?.message || requestError.message || "An error occurred during login")
    }
  }, [requestError])

  return (
    <div className="w-full max-w-md">
      <h2 className="text-4xl font-bold text-center bg-gradient-to-r from-coral to-coral-600 bg-clip-text text-transparent mb-2">
        Welcome Back
      </h2>
      <p className="text-center text-gray-600 mb-8">Sign in to your account</p>

      {message && <p className="text-center text-green-600">{message}</p>}
      {error && <p className="text-center text-red-600">{error}</p>}

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

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              type="checkbox"
              className="h-4 w-4 text-coral focus:ring-coral border-gray-300 rounded transition-colors"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
              Remember me
            </label>
          </div>
          <button
            type="button"
            className="text-sm font-medium text-coral hover:text-coral-600 transition-colors"
          >
            Forgot password?
          </button>
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
  )
}

export default LoginForm