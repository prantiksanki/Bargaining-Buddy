import React from 'react';

const Footer = () => {
  return (
    <footer className="w-full px-6 py-4 text-gray-600 bg-white border-t border-gray-200">
      <div className="flex flex-col items-center justify-between mx-auto text-sm max-w-7xl sm:flex-row">
        <p>© 2025 BargainBuddy</p>
        <div className="flex gap-4 mt-2 sm:mt-0">
          <a href="#" className="transition hover:text-blue-600">Terms</a>
          <a href="#" className="transition hover:text-blue-600">Privacy</a>
          <a href="#" className="transition hover:text-blue-600">Contact</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;