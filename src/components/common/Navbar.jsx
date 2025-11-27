import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Home, User, LogOut, Menu, X } from 'lucide-react';

const Navbar = () => {
  const { isAuthenticated, username, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate('/');
  };

  return (
    <nav className="bg-green-600 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2" onClick={() => setMobileMenuOpen(false)}>
            <Home size={24} />
            <span className="text-lg sm:text-xl font-bold">Dhuripara Gramin Bank</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {!isAuthenticated ? (
              <Link 
                to="/admin/login" 
                className="flex items-center space-x-1 bg-green-700 hover:bg-green-800 px-4 py-2 rounded transition"
              >
                <User size={18} />
                <span>Admin Login</span>
              </Link>
            ) : (
              <div className="flex items-center space-x-4">
                <Link 
                  to="/admin/dashboard" 
                  className="hover:text-green-200 transition"
                >
                  Dashboard
                </Link>
                <span className="text-green-200 text-sm">Welcome, {username}</span>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 bg-red-500 hover:bg-red-600 px-4 py-2 rounded transition"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-green-700 transition"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            {!isAuthenticated ? (
              <Link 
                to="/admin/login" 
                className="flex items-center space-x-2 bg-green-700 hover:bg-green-800 px-4 py-3 rounded transition"
                onClick={() => setMobileMenuOpen(false)}
              >
                <User size={20} />
                <span>Admin Login</span>
              </Link>
            ) : (
              <>
                <div className="px-4 py-2 text-green-200 text-sm">
                  Welcome, {username}
                </div>
                <Link 
                  to="/admin/dashboard" 
                  className="block px-4 py-3 hover:bg-green-700 rounded transition"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 w-full bg-red-500 hover:bg-red-600 px-4 py-3 rounded transition"
                >
                  <LogOut size={20} />
                  <span>Logout</span>
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;