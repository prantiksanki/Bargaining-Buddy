import React, { useState } from "react";
import AlertDropdown from "./AlertDropdown"; // Adjust the path as needed

const NavBar = () => {
  const [showAlerts, setShowAlerts] = useState(false);

  return (
    <nav className="bg-[#020617] px-6 py-3 flex justify-between items-center shadow-md rounded-t-md relative">
      {/* Logo or Brand */}
      <div className="text-blue-500 text-lg font-semibold">BargainBuddy</div>

      {/* Navigation Links */}
      <div className="flex space-x-6 text-gray-300 text-sm items-center">
        <a href="#deals" className="hover:text-white">
          Deals
        </a>

        {/* Alerts Button + Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowAlerts(!showAlerts)}
            className="hover:text-white"
          >
            Price Alerts
          </button>
          {showAlerts && (
            <div className="absolute right-0 mt-2">
              <AlertDropdown />
            </div>
          )}
        </div>

        <a href="#history" className="hover:text-white">
          History
        </a>
      </div>
    </nav>
  );
};

export default NavBar;
