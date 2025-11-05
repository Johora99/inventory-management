import React, { useState, useEffect, useRef } from 'react';
import { FaBars, FaTimes, FaUser, FaMoon, FaSun, FaTachometerAlt, FaSignOutAlt } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import useUser from '../Hooks/useUser';
import useAuth from '../Hooks/useAuth';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeLink, setActiveLink] = useState('Home');

  const dropdownRef = useRef(null);
  const { logout } = useAuth();
  const { userData, setUserData } = useUser();
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleDropdown = () => setShowDropdown(!showDropdown);
  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  const handleSignOut = async () => {
    try {
      await logout();
      setUserData(null);
      setShowDropdown(false);
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleNavClick = (linkName) => {
    setActiveLink(linkName);
    setIsOpen(false);
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'All Inventories', path: '/latest' },
    { name: 'Top Inventories', path: '/top' },
  ];

  return (
    <nav className="bg-gradient-to-r from-teal-700 to-teal-600 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-bold tracking-tight">
              InventoryApp
            </Link>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => handleNavClick(link.name)}
                className={`px-3 py-2 rounded-md text-lg font-medium transition-colors ${
                  activeLink === link.name
                    ? 'bg-white text-teal-600'
                    : 'hover:bg-teal-700 hover:text-white'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Right Section - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-md hover:bg-teal-700 transition-colors focus:outline-none"
              aria-label="Toggle theme"
            >
              {isDarkMode ? <FaSun className="text-xl" /> : <FaMoon className="text-xl" />}
            </button>

            {/* User Avatar or Login */}
            {userData?.email ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={toggleDropdown}
                  className="flex items-center focus:outline-none"
                  aria-label="User menu"
                >
                  <img
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                      userData.fullName
                    )}&background=0d9488&color=fff&size=128`}
                    alt={userData.fullName}
                    className="w-10 h-10 rounded-full border-2 border-white hover:border-teal-200 transition-colors"
                  />
                </button>

                {/* Dropdown */}
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    <Link
                      to="/dashboard"
                      onClick={() => setShowDropdown(false)}
                      className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <FaTachometerAlt className="mr-3 text-teal-600" /> Dashboard
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="flex items-center w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <FaSignOutAlt className="mr-3 text-red-600" /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 bg-white text-teal-600 rounded-md font-medium hover:bg-teal-50 flex items-center transition-colors"
              >
                <FaUser className="mr-2" /> Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-white text-2xl focus:outline-none"
              aria-label="Toggle menu"
            >
              {isOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-teal-600">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => handleNavClick(link.name)}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  activeLink === link.name
                    ? 'bg-white text-teal-600'
                    : 'hover:bg-teal-700 hover:text-white'
                }`}
              >
                {link.name}
              </Link>
            ))}

            <div className="border-t border-teal-500 mt-3 pt-3 space-y-2">
              <button
                onClick={toggleTheme}
                className="flex items-center w-full px-3 py-2 rounded-md text-base font-medium hover:bg-teal-700 transition-colors"
              >
                {isDarkMode ? <FaSun className="mr-3" /> : <FaMoon className="mr-3" />}
                {isDarkMode ? 'Light Mode' : 'Dark Mode'}
              </button>

              {userData ? (
                <>
                  <Link
                    to="/dashboard"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center px-3 py-2 rounded-md text-base font-medium hover:bg-teal-700 transition-colors"
                  >
                    <FaTachometerAlt className="mr-3" /> Dashboard
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center w-full text-left px-3 py-2 rounded-md text-base font-medium hover:bg-teal-700 transition-colors"
                  >
                    <FaSignOutAlt className="mr-3" /> Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center w-full px-3 py-2 bg-white text-teal-600 rounded-md text-base font-medium hover:bg-teal-50 transition-colors"
                >
                  <FaUser className="mr-3" /> Login
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}