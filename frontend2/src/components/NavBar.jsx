import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ShoppingBag, Bell, Menu, X, User, Home } from 'lucide-react';

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center flex-shrink-0">
            <Link 
              to="/home" 
              className="flex items-center space-x-2"
            >
              <ShoppingBag className="w-8 h-8 text-emerald-500" />
              <span className="text-xl font-bold text-gray-900">
                BargainBuddy
              </span>
            </Link>
          </div>

          {/* Search Bar - Desktop
          <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-center lg:ml-6">
            <div className="relative w-full max-w-lg">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search for the best deals..."
                className="w-full py-2 pl-10 pr-4 text-gray-900 placeholder-gray-500 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
          </div> */}

          {/* Desktop Navigation */}
          <div className="hidden sm:flex sm:items-center sm:space-x-6">
            <Link 
              to="/home" 
              className="p-2 text-gray-600 transition-colors rounded-lg hover:text-emerald-500 hover:bg-gray-50"
            >
              <Home className="w-5 h-5" />
            </Link>
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 text-gray-600 transition-colors rounded-lg hover:text-emerald-500 hover:bg-gray-50"
            >
              <Bell className="w-5 h-5" />
            </button>
            <Link 
              to="/profile" 
              className="p-2 text-gray-600 transition-colors rounded-lg hover:text-emerald-500 hover:bg-gray-50"
            >
              <User className="w-5 h-5" />
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 text-gray-400 rounded-md hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-emerald-500"
            >
              {isOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Search Bar - Mobile */}
        <div className="pt-2 pb-3 sm:hidden">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search deals..."
              className="w-full py-2 pl-10 pr-4 text-gray-900 placeholder-gray-500 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isOpen && (
        <div className="sm:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              to="/home"
              className="flex items-center px-3 py-2 text-base font-medium text-gray-600 rounded-md hover:text-emerald-500 hover:bg-gray-50"
            >
              <Home className="w-5 h-5 mr-3" />
              Home
            </Link>

            
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="flex items-center w-full px-3 py-2 text-base font-medium text-gray-600 rounded-md hover:text-emerald-500 hover:bg-gray-50"
            >
              <Bell className="w-5 h-5 mr-3" />
              Notifications
            </button>

            
            <Link
              to="/profile"
              className="flex items-center px-3 py-2 text-base font-medium text-gray-600 rounded-md hover:text-emerald-500 hover:bg-gray-50"
            >
              <User className="w-5 h-5 mr-3" />
              Profile
            </Link>
          </div>
        </div>
      )}

      {/* Notifications Dropdown */}
      {showNotifications && (
        <div className="absolute right-0 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg w-80 ring-1 ring-black ring-opacity-5">
          <div className="px-4 py-3">
            <p className="text-sm font-medium text-gray-900">Notifications</p>
          </div>
          <div className="py-1">
            <div className="px-4 py-2 text-sm text-gray-700">
              No new notifications
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;