import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useMemberAuth } from '../../context/MemberAuthContext';
import { Home, User, LogOut, Menu, X, Users } from 'lucide-react';

const Navbar = () => {
  const { isAuthenticated: isAdmin, username: adminUsername, logout: adminLogout } = useAuth();
  const { isAuthenticated: isMember, memberName, logout: memberLogout } = useMemberAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleAdminLogout = () => {
    adminLogout();
    setMobileMenuOpen(false);
    navigate('/');
  };

  const handleMemberLogout = () => {
    memberLogout();
    setMobileMenuOpen(false);
    navigate('/');
  };

  const isMemberRoute = location.pathname.startsWith('/member');

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
            {!isAdmin && !isMember ? (
              <>
                <Link 
                  to="/admin/login" 
                  className="flex items-center space-x-1 bg-green-700 hover:bg-green-800 px-4 py-2 rounded transition"
                >
                  <User size={18} />
                  <span>Admin Login</span>
                </Link>
                <Link 
                  to="/member/login" 
                  className="flex items-center space-x-1 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded transition"
                >
                  <Users size={18} />
                  <span>Member Login</span>
                </Link>
              </>
            ) : isAdmin && !isMemberRoute ? (
              <div className="flex items-center space-x-4">
                <Link 
                  to="/admin/dashboard" 
                  className="hover:text-green-200 transition"
                >
                  Dashboard
                </Link>
                <span className="text-green-200 text-sm">Admin: {adminUsername}</span>
                <button
                  onClick={handleAdminLogout}
                  className="flex items-center space-x-1 bg-red-500 hover:bg-red-600 px-4 py-2 rounded transition"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </div>
            ) : isMember && isMemberRoute ? (
              <div className="flex items-center space-x-4">
                <Link 
                  to="/member/dashboard" 
                  className="hover:text-green-200 transition"
                >
                  My Dashboard
                </Link>
                <span className="text-green-200 text-sm">{memberName}</span>
                <button
                  onClick={handleMemberLogout}
                  className="flex items-center space-x-1 bg-red-500 hover:bg-red-600 px-4 py-2 rounded transition"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </div>
            ) : null}
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
            {!isAdmin && !isMember ? (
              <>
                <Link 
                  to="/admin/login" 
                  className="flex items-center space-x-2 bg-green-700 hover:bg-green-800 px-4 py-3 rounded transition"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <User size={20} />
                  <span>Admin Login</span>
                </Link>
                <Link 
                  to="/member/login" 
                  className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 px-4 py-3 rounded transition"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Users size={20} />
                  <span>Member Login</span>
                </Link>
              </>
            ) : isAdmin && !isMemberRoute ? (
              <>
                <div className="px-4 py-2 text-green-200 text-sm">
                  Admin: {adminUsername}
                </div>
                <Link 
                  to="/admin/dashboard" 
                  className="block px-4 py-3 hover:bg-green-700 rounded transition"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleAdminLogout}
                  className="flex items-center space-x-2 w-full bg-red-500 hover:bg-red-600 px-4 py-3 rounded transition"
                >
                  <LogOut size={20} />
                  <span>Logout</span>
                </button>
              </>
            ) : isMember && isMemberRoute ? (
              <>
                <div className="px-4 py-2 text-green-200 text-sm">
                  {memberName}
                </div>
                <Link 
                  to="/member/dashboard" 
                  className="block px-4 py-3 hover:bg-green-700 rounded transition"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  My Dashboard
                </Link>
                <button
                  onClick={handleMemberLogout}
                  className="flex items-center space-x-2 w-full bg-red-500 hover:bg-red-600 px-4 py-3 rounded transition"
                >
                  <LogOut size={20} />
                  <span>Logout</span>
                </button>
              </>
            ) : null}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;