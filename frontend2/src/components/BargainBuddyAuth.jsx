import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
const BargainBuddyAuth = () => {
  const [activeTab, setActiveTab] = useState('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  // Login form state
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  
  // Signup form state
  const [signupData, setSignupData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });
  
  // Handle login form changes
  const handleLoginChange = (e) => {
    const { name, value, type, checked } = e.target;
    setLoginData({
      ...loginData,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  

  
  // Handle signup form changes
  const handleSignupChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSignupData({
      ...signupData,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  // Handle login submission
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      // Example API call
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginData)
      });

      console.log(response);
      

      if(response.ok)
      {
        setLoading(false);
        setSuccess('Login successful! Redirecting to dashboard...');
        navigate("/") 
      }
      else
      {
        setLoading(false);
        setError('Login failed. Please check your credentials and try again.');
      }
      
      // For demo purposes - simulating API response
      // setTimeout(() => {
      //   setLoading(false);
      //   setSuccess('Login successful! Redirecting to dashboard...');
      //   navigate('/')
      //   // Redirect or update app state here
      // }, 1500);

      
      
    } catch (err) {
      setLoading(false);
      setError('Login failed. Please check your credentials and try again.');
      console.error('Login error:', err);
    }
  };
  


  
  // Handle signup submission
  const handleSignup = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (signupData.password !== signupData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      // Example API call
      const response = await fetch('http://localhost:5000/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(signupData)
      });
      
      // For demo purposes - simulating API response
      setTimeout(() => {
        setLoading(false);
        setSuccess('Account created successfully! You can now log in.');
        setActiveTab('login');
      }, 1500);
      
    } catch (err) {
      setLoading(false);
      setError('Signup failed. Please try again later.');
      console.error('Signup error:', err);
    }
  };
  
  // Features list
  const features = [
    'Find the best deals on products you love',
    'Get personalized recommendations',
    'Save with exclusive discount codes',
    'Track price history on your favorite items'
  ];
  
  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gray-900">
      <div className="flex flex-col w-full max-w-6xl overflow-hidden shadow-2xl md:flex-row rounded-xl">
        {/* Left side - Promotional content */}
        <div className="relative p-8 overflow-hidden text-white bg-gradient-to-r from-purple-600 to-blue-500 md:p-12 md:w-1/2">
          <div className="absolute inset-0 opacity-20">
            <svg className="w-full h-full" viewBox="0 0 800 800">
              <path d="M769 229L1037 260.9M927 880L731 737 520 660 309 538 40 599 295 764 126.5 879.5 40 599-197 493 102 382-31 229 126.5 79.5-69-63" stroke="white" strokeWidth="100" fill="none" fillRule="evenodd" strokeLinecap="round"></path>
            </svg>
          </div>
          
          <div className="relative z-10">
            <h2 className="mb-6 text-4xl font-bold">BargainBuddy</h2>
            <p className="mb-8 text-xl">Your personal shopping assistant to find the best deals online!</p>
            
            <ul className="mb-8 space-y-4">
              {features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <span className="flex-shrink-0 h-6 w-6 bg-indigo-300 rounded-full flex items-center justify-center mr-3 mt-0.5">
                    <svg className="w-4 h-4 text-indigo-800" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            
            <div className="mt-8">
              <div className="flex items-center mb-4 space-x-4">
                <div className="w-12 h-12 p-2 overflow-hidden rounded-full bg-white/20">
                  <img src="https://static.vecteezy.com/system/resources/previews/021/548/095/non_2x/default-profile-picture-avatar-user-avatar-icon-person-icon-head-icon-profile-picture-icons-default-anonymous-user-male-and-female-businessman-photo-placeholder-social-network-avatar-portrait-free-vector.jpg" alt="User" className="object-cover w-full h-full rounded-full" />
                </div>
                <div>
                  <p className="font-medium">"I saved over $500 last month using BargainBuddy!"</p>
                  <p className="text-sm text-white/80">— Prantik Sanki</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right side - Auth forms */}
        <div className="p-8 bg-gray-800 md:p-12 md:w-1/2">
          <div className="max-w-md mx-auto">
            <div className="mb-8 text-center">
              <div className="inline-block p-2 mb-4 bg-gray-700 rounded-full">
                <svg className="w-10 h-10 text-blue-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-white">BargainBuddy</h2>
              <p className="text-gray-400">Find deals. Save money. Shop smarter.</p>
            </div>
            
            {/* Tabs */}
            <div className="flex mb-6 border-b border-gray-600">
              <button
                className={`py-2 px-4 font-medium ${activeTab === 'login' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400'}`}
                onClick={() => setActiveTab('login')}
              >
                Login
              </button>
              <button
                className={`py-2 px-4 font-medium ${activeTab === 'signup' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400'}`}
                onClick={() => setActiveTab('signup')}
              >
                Sign Up
              </button>
            </div>
            
            {/* Error and success messages */}
            {error && (
              <div className="p-3 mb-4 text-red-300 border border-red-600 rounded-md bg-red-900/50">
                {error}
              </div>
            )}
            
            {success && (
              <div className="p-3 mb-4 text-green-300 border border-green-600 rounded-md bg-green-900/50">
                {success}
              </div>
            )}
            
            {/* Login Form */}
            {activeTab === 'login' && (
              <form onSubmit={handleLogin}>
                <div className="mb-4">
                  <label htmlFor="email" className="block mb-2 font-medium text-gray-300">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={loginData.email}
                    onChange={handleLoginChange}
                    className="w-full px-4 py-2 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <div className="flex justify-between mb-2">
                    <label htmlFor="password" className="block font-medium text-gray-300">Password</label>
                    <a href="#" className="text-sm text-blue-400 hover:underline">Forgot password?</a>
                  </div>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={loginData.password}
                    onChange={handleLoginChange}
                    className="w-full px-4 py-2 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div className="flex items-center mb-6">
                  <input
                    type="checkbox"
                    id="rememberMe"
                    name="rememberMe"
                    checked={loginData.rememberMe}
                    onChange={handleLoginChange}
                    className="w-4 h-4 text-blue-500 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="rememberMe" className="block ml-2 text-sm text-gray-300">
                    Remember me
                  </label>
                </div>
                
                <button
                  type="submit"
                  disabled={loading}
                  className="flex justify-center w-full px-4 py-2 font-medium text-white transition duration-200 bg-blue-600 rounded-md hover:bg-blue-700"
                >
                  {loading ? (
                    <svg className="w-5 h-5 text-white animate-spin" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    'Sign In'
                  )}
                </button>
                
                <div className="mt-6 text-center">
                  <span className="text-gray-400">Don't have an account?</span>
                  <button 
                    type="button"
                    onClick={() => setActiveTab('signup')}
                    className="ml-1 text-blue-400 hover:underline"
                  >
                    Sign up now
                  </button>
                </div>
              </form>
            )}
            
            {/* Signup Form */}
            {activeTab === 'signup' && (
              <form onSubmit={handleSignup}>
                <div className="mb-4">
                  <label htmlFor="name" className="block mb-2 font-medium text-gray-300">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={signupData.name}
                    onChange={handleSignupChange}
                    className="w-full px-4 py-2 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="signupEmail" className="block mb-2 font-medium text-gray-300">Email</label>
                  <input
                    type="email"
                    id="signupEmail"
                    name="email"
                    value={signupData.email}
                    onChange={handleSignupChange}
                    className="w-full px-4 py-2 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="signupPassword" className="block mb-2 font-medium text-gray-300">Password</label>
                  <input
                    type="password"
                    id="signupPassword"
                    name="password"
                    value={signupData.password}
                    onChange={handleSignupChange}
                    className="w-full px-4 py-2 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div className="mb-6">
                  <label htmlFor="confirmPassword" className="block mb-2 font-medium text-gray-300">Confirm Password</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={signupData.confirmPassword}
                    onChange={handleSignupChange}
                    className="w-full px-4 py-2 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div className="flex items-center mb-6">
                  <input
                    type="checkbox"
                    id="agreeToTerms"
                    name="agreeToTerms"
                    checked={signupData.agreeToTerms}
                    onChange={handleSignupChange}
                    className="w-4 h-4 text-blue-500 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                    required
                  />
                  <label htmlFor="agreeToTerms" className="block ml-2 text-sm text-gray-300">
                    I agree to the <a href="#" className="text-blue-400 hover:underline">Terms of Service</a> and <a href="#" className="text-blue-400 hover:underline">Privacy Policy</a>
                  </label>
                </div>
                
                <button
                  type="submit"
                  disabled={loading}
                  className="flex justify-center w-full px-4 py-2 font-medium text-white transition duration-200 bg-blue-600 rounded-md hover:bg-blue-700"
                >
                  {loading ? (
                    <svg className="w-5 h-5 text-white animate-spin" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    'Create Account'
                  )}
                </button>
                
                <div className="mt-6 text-center">
                  <span className="text-gray-400">Already have an account?</span>
                  <button 
                    type="button"
                    onClick={() => setActiveTab('login')}
                    className="ml-1 text-blue-400 hover:underline"
                  >
                    Sign in
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BargainBuddyAuth;