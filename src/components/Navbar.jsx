import React, { useRef, useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Moon, Sun, ShoppingCart, User, LogOut, Shirt } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

const Navbar = () => {
  const { isDark, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const { getTotalItems } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const navRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // Update active index based on current route
  useEffect(() => {
    const path = location.pathname;
    const navItems = ['/', '/services', '/checkout', '/cart', '/profile', '/login'];
    const index = navItems.findIndex(item => item === path);
    if (index !== -1) {
      setActiveIndex(index);
    }
  }, [location]);

  const handleNavClick = (e, path, index) => {
    e.preventDefault();
    setActiveIndex(index);
    // Add a small delay to allow the animation to complete
    setTimeout(() => {
      navigate(path);
    }, 300);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="relative bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg" ref={navRef}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-8 bg-orange-500 rounded-md flex items-center justify-center">
              <Shirt className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white dark:text-white">
              Vastram
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-4">
            <Link 
              to="/" 
              className={`px-4 py-2 rounded-full transition-colors font-medium ${
                location.pathname === '/' 
                  ? 'bg-white text-blue-600 dark:bg-white/90 dark:text-blue-700' 
                  : 'text-white hover:bg-white/20 dark:hover:bg-white/10'
              }`}
            >
              Home
            </Link>
            <Link 
              to="/services" 
              className={`px-4 py-2 rounded-full transition-colors font-medium ${
                location.pathname === '/services' 
                  ? 'bg-white text-blue-600 dark:bg-white/90 dark:text-blue-700' 
                  : 'text-white hover:bg-white/20 dark:hover:bg-white/10'
              }`}
            >
              Services
            </Link>
            <Link 
              to="/checkout" 
              className={`px-4 py-2 rounded-full transition-colors font-medium ${
                location.pathname === '/checkout'
                  ? 'bg-white text-blue-600 dark:bg-white/90 dark:text-blue-700' 
                  : 'bg-white/10 text-white hover:bg-white/20 dark:bg-white/5 dark:hover:bg-white/10'
              }`}
            >
              Book Now
            </Link>
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-4 z-10">
            {/* Theme Toggle */}
            <button
              onClick={() => {
                toggleTheme();
                // Force a re-render of the theme
                document.documentElement.classList.toggle('dark', !isDark);
              }}
              className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
            >
              {isDark ? (
                <Sun className="w-5 h-5 text-white" />
              ) : (
                <Moon className="w-5 h-5 text-white" />
              )}
            </button>

            {/* Cart */}
            <Link
              to="/cart"
              className="relative p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
            >
              <ShoppingCart className="w-5 h-5 text-white" />
              {getTotalItems() > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {getTotalItems()}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {user ? (
              <div className="flex items-center space-x-2">
                <Link
                  to="/profile"
                  className="flex items-center space-x-2 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                >
                  <User className="w-5 h-5 text-white" />
                  <span className="hidden sm:block text-sm text-white">
                    {user.name}
                  </span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                >
                  <LogOut className="w-5 h-5 text-white" />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 rounded-full bg-white/20 hover:bg-white/30 text-white font-medium transition-colors"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
