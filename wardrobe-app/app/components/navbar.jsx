import React from 'react';

const Navbar = () => {
  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-gray-100 shadow-lg">
      {/* Logo */}
      <div className="flex items-center">
        <img src="/path-to-your-logo.png" alt="Logo" className="h-8 mr-4" />
        <span className="text-lg font-bold">Verruube</span>
      </div>

      {/* Center Tabs */}
      <div className="flex space-x-6 text-lg font-medium">
        <a href="#home" className="hover:text-blue-600">
          HOME
        </a>
        <a href="#explore" className="hover:text-blue-600">
          EXPLORE
        </a>
      </div>

      {/* Right Side Buttons */}
      <div className="flex items-center space-x-4">
        <button className="px-4 py-2 text-white bg-blue-600 rounded-full hover:bg-blue-700">
          Home
        </button>
        <button className="px-4 py-2 bg-white border rounded-full hover:shadow-md">
          My Wardrobe
        </button>
        <button className="px-4 py-2 text-white bg-teal-500 rounded-full hover:bg-teal-600">
          Help
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
