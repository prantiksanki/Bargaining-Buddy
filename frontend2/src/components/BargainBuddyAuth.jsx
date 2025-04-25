import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, ShoppingBag, ArrowRight, Tag, Gift, Star, Sparkles, User, MapPin } from 'lucide-react';

const BargainBuddyAuth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState(''); // New state for name
  const [mail, setMail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [location, setLocation] = useState(''); // New state for location
  const [description, setDescription] = useState(''); // New state for description
  const [error, setError] = useState('');
  const [accountCreated, setAccountCreated] = useState(false); // New state to track account creation
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!mail || !password) {
      setError('Please enter your email and password.');
      return;
    }

    if (!isLogin && (!name || !location || !description)) {
      setError('Please enter your name, location, and description.');
      return;
    }

    if (!isLogin && !confirmPassword) {
      setError('Please confirm your password.');
      return;
    }

    if (!isLogin && password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    const endpoint = isLogin ? 'http://localhost:5000/login' : 'http://localhost:5000/signup';

    try {
      const body = isLogin
        ? JSON.stringify({
          mail: mail,
          password: password,
        })
        : JSON.stringify({
          name: name,
          mail: mail,
          password: password,
          location: location,
          description: description,
        });

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: body,
      });

      const data = await response.json();
      // console.log(response);
      // console.log(data);
      const details = data.user[0];
      console.log(details);



      
      if (!response.ok) {
        setError(data.message || 'Failed to authenticate. Please try again.');
        return;
      }
      else
      {
        localStorage.setItem('email', mail); 
        localStorage.setItem('password', password); 
        localStorage.setItem('name', details.name);
        localStorage.setItem('location', details.location);
        localStorage.setItem('description', details.description);
        localStorage.setItem('accountCreated', details.createdAt);
        
        navigate('/home');
      }

      // Handle successful authentication (e.g., store token, redirect)
      console.log('Success:', data);

      if (!isLogin) {
        setAccountCreated(true);
        setIsLogin(true);
      }


    } catch (error) {
      console.error('Error:', error);
      setError('An unexpected error occurred. Please try again later.');
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-green-50 via-white to-green-50">
      {/* Decorative Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 bg-green-100 rounded-full w-72 h-72 mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 right-0 bg-green-200 rounded-full w-72 h-72 mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute bg-green-300 rounded-full -bottom-8 left-20 w-72 h-72 mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative flex items-center justify-center min-h-screen p-4">
        <div className="container max-w-7xl">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* Left Side - Hero Section */}
            <div className="space-y-8">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-lg shadow-md">
                  <ShoppingBag className="w-8 h-8 text-green-600" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900">Bargain Buddy</h1>
              </div>

              <div className="space-y-4">
                <h2 className="text-5xl font-bold text-gray-900">
                  Smart Shopping, <br />
                  <span className="text-green-600">Smarter Savings</span>
                </h2>
                <p className="max-w-lg text-xl text-gray-600">
                  Join thousands of smart shoppers who save money every day with Bargain Buddy's exclusive deals and personalized recommendations.
                </p>
              </div>

              {/* Feature Cards with Images */}
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="relative p-6 overflow-hidden transition transform bg-white border shadow-sm group rounded-xl border-green-50 hover:scale-105">
                  <div className="absolute inset-0 transition-opacity opacity-10 group-hover:opacity-20">
                    <img
                      src="https://images.pexels.com/photos/3944405/pexels-photo-3944405.jpeg"
                      alt="Shopping Deals"
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="relative">
                    <Tag className="w-8 h-8 mb-3 text-green-600" />
                    <h3 className="mb-2 font-semibold text-gray-900">Smart Deals</h3>
                    <p className="text-gray-600">AI-powered deal finder that matches your preferences.</p>
                  </div>
                </div>
                <div className="relative p-6 overflow-hidden transition transform bg-white border shadow-sm group rounded-xl border-green-50 hover:scale-105">
                  <div className="absolute inset-0 transition-opacity opacity-10 group-hover:opacity-20">
                    <img
                      src="https://images.pexels.com/photos/5650026/pexels-photo-5650026.jpeg"
                      alt="Rewards"
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="relative">
                    <Gift className="w-8 h-8 mb-3 text-green-600" />
                    <h3 className="mb-2 font-semibold text-gray-900">Rewards Program</h3>
                    <p className="text-gray-600">Earn points on every purchase and get exclusive rewards.</p>
                  </div>
                </div>
                <div className="relative p-6 overflow-hidden transition transform bg-white border shadow-sm group rounded-xl border-green-50 hover:scale-105">
                  <div className="absolute inset-0 transition-opacity opacity-10 group-hover:opacity-20">
                    <img
                      src="https://images.pexels.com/photos/5632402/pexels-photo-5632402.jpeg"
                      alt="Price Alerts"
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="relative">
                    <Star className="w-8 h-8 mb-3 text-green-600" />
                    <h3 className="mb-2 font-semibold text-gray-900">Price Alerts</h3>
                    <p className="text-gray-600">Get notified when prices drop on your favorite items.</p>
                  </div>
                </div>
                <div className="relative p-6 overflow-hidden transition transform bg-white border shadow-sm group rounded-xl border-green-50 hover:scale-105">
                  <div className="absolute inset-0 transition-opacity opacity-10 group-hover:opacity-20">
                    <img
                      src="https://images.pexels.com/photos/5632398/pexels-photo-5632398.jpeg"
                      alt="Personalized Experience"
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="relative">
                    <Sparkles className="w-8 h-8 mb-3 text-green-600" />
                    <h3 className="mb-2 font-semibold text-gray-900">Smart Lists</h3>
                    <p className="text-gray-600">Create and share shopping lists with price comparisons.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Auth Form */}
            <div className="w-full max-w-md lg:ml-auto">
              <div className="p-8 border border-green-100 shadow-lg bg-white/80 backdrop-blur-lg rounded-2xl">
                <h2 className="mb-2 text-3xl font-bold text-gray-900">
                  {isLogin ? 'Welcome Back!' : 'Join Bargain Buddy'}
                </h2>
                <p className="mb-8 text-gray-600">
                  {isLogin
                    ? 'Access your personalized shopping dashboard'
                    : 'Start saving on your favorite products today'}
                </p>

                {error && (
                  <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50" role="alert">
                    <span className="font-medium">Error:</span> {error}
                  </div>
                )}

                {accountCreated && (
                  <div className="p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50" role="alert">
                    <span className="font-medium">Account created successfully!</span> Please sign in.
                  </div>
                )}

                <form className="space-y-6" onSubmit={handleSubmit}>
                  {!isLogin && (
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">
                        Full Name
                      </label>
                      <div className="relative">
                        <User className="absolute w-5 h-5 text-gray-400 -translate-y-1/2 left-3 top-1/2" />
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full py-3 pl-10 pr-4 transition-colors border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="Enter your full name"
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute w-5 h-5 text-gray-400 -translate-y-1/2 left-3 top-1/2" />
                      <input
                        type="email"
                        value={mail}
                        onChange={(e) => setMail(e.target.value)}
                        className="w-full py-3 pl-10 pr-4 transition-colors border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute w-5 h-5 text-gray-400 -translate-y-1/2 left-3 top-1/2" />
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full py-3 pl-10 pr-4 transition-colors border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Enter your password"
                      />
                    </div>
                  </div>

                  {!isLogin && (
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute w-5 h-5 text-gray-400 -translate-y-1/2 left-3 top-1/2" />
                        <input
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full py-3 pl-10 pr-4 transition-colors border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="Confirm your password"
                        />
                      </div>
                    </div>
                  )}

                  {!isLogin && (
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">
                        Location
                      </label>
                      <div className="relative">
                        <MapPin className="absolute w-5 h-5 text-gray-400 -translate-y-1/2 left-3 top-1/2" />
                        <input
                          type="text"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          className="w-full py-3 pl-10 pr-4 transition-colors border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="Enter your location"
                        />
                      </div>
                    </div>
                  )}

                  {!isLogin && (
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">
                        Description
                      </label>
                      <div className="relative">
                        {/* No icon for description */}
                        <textarea
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          className="w-full py-3 pl-4 pr-4 transition-colors border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="Enter your description"
                        />
                      </div>
                    </div>
                  )}

                  {isLogin && (
                    <div className="flex items-center justify-between">
                      <label className="flex items-center">
                        <input type="checkbox" className="text-green-600 border-gray-300 rounded focus:ring-green-500" />
                        <span className="ml-2 text-sm text-gray-600">Remember me</span>
                      </label>
                      <a href="#" className="text-sm font-medium text-green-600 hover:text-green-700">
                        Forgot password?
                      </a>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center gap-2 font-medium shadow-md"
                  >
                    {isLogin ? 'Sign In' : 'Create Account'}
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </form>

                <div className="mt-8 text-center">
                  <p className="text-gray-600">
                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                    <button
                      onClick={() => {
                        setIsLogin(!isLogin);
                        setAccountCreated(false); // Reset accountCreated when switching forms
                      }}
                      className="font-medium text-green-600 hover:text-green-700"
                    >
                      {isLogin ? 'Sign Up' : 'Sign In'}
                    </button>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BargainBuddyAuth;