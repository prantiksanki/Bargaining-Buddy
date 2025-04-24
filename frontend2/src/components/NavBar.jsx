import React, { useState } from "react";
import { Bell, Menu, X, User, Clock, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import AlertDropdown from "./AlertDropdown";

const NavBar = () => {
  const [showAlerts, setShowAlerts] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex items-center flex-shrink-0">
              <Link to="/" className="flex items-center">
                <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 4L10.25 9H5L9 12.5L7.5 18L12 15L16.5 18L15 12.5L19 9H13.75L12 4Z" />
                </svg>
                <span className="ml-2 text-xl font-bold text-gray-900">BargainBuddy</span>
              </Link>
            </div>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-8">
            <Link to="/deals" className="px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-900">
              Deals
            </Link>
            
            <div className="relative">
              <button 
                onClick={() => setShowAlerts(!showAlerts)}
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-900"
              >
                <span>Price Alerts</span>
                <Bell className="w-4 h-4 ml-1" />
              </button>
              
              {showAlerts && (
                <div className="absolute right-0 mt-2 origin-top-right bg-white rounded-md shadow-lg w-80 ring-1 ring-black ring-opacity-5">
                  <AlertDropdown />
                </div>
              )}
            </div>
            
            <Link to="/history" className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-900">
              <span>History</span>
              <Clock className="w-4 h-4 ml-1" />
            </Link>
            
            <Link to="/account" className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-900">
              <User className="w-5 h-5 ml-1" />
            </Link>
          </div>
          
          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 text-gray-400 rounded-md hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              {mobileMenuOpen ? (
                <X className="block w-6 h-6" />
              ) : (
                <Menu className="block w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <Link to="/deals" className="block px-3 py-2 text-base font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-50">
              Deals
            </Link>
            <button
              onClick={() => setShowAlerts(!showAlerts)}
              className="flex items-center justify-between w-full px-3 py-2 text-base font-medium text-left text-gray-500 hover:text-gray-900 hover:bg-gray-50"
            >
              <span>Price Alerts</span>
              <Bell className="w-5 h-5" />
            </button>
            <Link to="/history" className="block px-3 py-2 text-base font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-50">
              History
            </Link>
            <Link to="/account" className="block px-3 py-2 text-base font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-50">
              Account
            </Link>
          </div>
        </div>
      )}
      
      {/* Mobile alerts dropdown */}
      {mobileMenuOpen && showAlerts && (
        <div className="px-4 py-2 border-t border-gray-200">
          <AlertDropdown />
        </div>
      )}
    </nav>
  );
};

export default NavBar;