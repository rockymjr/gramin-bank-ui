import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useMemberAuth } from '../../context/MemberAuthContext';
import { Home, User, LogOut, Menu, X, Users as UsersIcon, TrendingUp, TrendingDown, FileText, Calendar } from 'lucide-react';

const Navbar = () => {
  const { isAuthenticated: isAdmin, username: adminUsername, logout: adminLogout } = useAuth();
  const { isAuthenticated: isMember, memberName, isOperator, logout: memberLogout } = useMemberAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleAdminLogout = () => {
    adminLogout();
    setMobileMenuOpen(false);
  };

  const handleMemberLogout = () => {
    memberLogout();
    setMobileMenuOpen(false);
  };

  // Admin menu items (Deposits/Loans/Statements now in quick access)
  const adminMenuItems = [];

  // Operator menu items - Deposits/Loans/Statements are in quick access only
  const operatorMenuItems = [];

  // Determine what to show in navbar
  const showLoginButtons = !isAdmin && !isMember;
  const showAdminMenu = isAdmin;
  const showMemberMenu = isMember && !isOperator;
  const showOperatorMenu = isMember && isOperator;

  return (
    <nav className="bg-green-600 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo and User Info */}
          <div className="flex flex-col md:flex-row md:items-center items-start space-y-1 md:space-y-0 md:space-x-4">
            <Link to="/" className="flex items-center space-x-2" onClick={() => setMobileMenuOpen(false)}>
              <Home size={24} />
              <span className="text-sm md:text-lg font-bold">Dhuripara Bank</span>
            </Link>
            <div className="md:block text-green-200 text-sm md:ml-2 md:border-l md:border-green-400 md:pl-4">
              {isAdmin && <div>Admin: {adminUsername}</div>}
              {isMember && <div>{isOperator ? `${memberName} (Operator)` : memberName}</div>}
            </div>
          </div>

          {/* Quick access icons: Deposits, Loans, Dashboard (operator), Members (admin), Logout */}
          {(showAdminMenu || showOperatorMenu || showMemberMenu) && (
            <div className="hidden md:flex items-center space-x-3 mr-4">
              {(showAdminMenu || showOperatorMenu) && (
                <>
                  <Link
                    to="/admin/deposits"
                    className="flex flex-col items-center justify-center w-14 h-14 rounded bg-green-600 hover:bg-green-700 transition px-1"
                    title="Deposits"
                    aria-label="Deposits"
                  >
                    <TrendingUp size={20} />
                    <span className="text-sm text-white mt-1">Deposits</span>
                  </Link>
                  <Link
                    to="/admin/loans"
                    className="flex flex-col items-center justify-center w-14 h-14 rounded bg-red-600 hover:bg-red-700 transition px-1"
                    title="Loans"
                    aria-label="Loans"
                  >
                    <TrendingDown size={20} />
                    <span className="text-sm text-white mt-1">Loans</span>
                  </Link>
                </>
              )}
              {(showOperatorMenu || showMemberMenu) && (
                <Link
                  to="/member/dashboard"
                  className="flex flex-col items-center justify-center w-14 h-14 rounded bg-blue-600 hover:bg-blue-700 transition px-1"
                  title="My Dashboard"
                  aria-label="My Dashboard"
                >
                  <Home size={20} />
                  <span className="text-sm text-white mt-1">Dashboard</span>
                </Link>
              )}
              {showAdminMenu && (
                <Link
                  to="/admin/members"
                  className="flex flex-col items-center justify-center w-14 h-14 rounded bg-indigo-600 hover:bg-indigo-700 transition px-1"
                  title="Members"
                  aria-label="Members"
                >
                  <UsersIcon size={20} />
                  <span className="text-sm text-white mt-1">Members</span>
                </Link>
              )}
              {/* show logout for admin or member */}
              { (isAdmin || isMember) && (
                <button
                  onClick={() => isAdmin ? handleAdminLogout() : handleMemberLogout()}
                  className="flex flex-col items-center justify-center w-14 h-14 rounded bg-red-500 hover:bg-red-600 transition px-1"
                  title="Logout"
                  aria-label="Logout"
                >
                  <LogOut size={20} />
                  <span className="text-sm text-white mt-1">Logout</span>
                </button>
              )}
            </div>
          )}

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {showLoginButtons && (
              <>
                <Link 
                  to="/login" 
                  className="flex items-center space-x-1 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded transition text-white"
                >
                  <User size={18} />
                  <span>Login</span>
                </Link>
              </>
            )}
            
            {showAdminMenu && (
              <>
              </>
            )}
            
            {showMemberMenu && (
              <div className="flex items-center space-x-4">
                <Link 
                  to="/member/dashboard" 
                  className="flex items-center space-x-1 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded transition text-white"
                >
                  <Home size={18} />
                  <span>My Dashboard</span>
                </Link>
              </div>
            )}

            {showOperatorMenu && (
              <div className="flex items-center space-x-4">
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          {/* Mobile Login Button (visible on small screens when not logged in) */}
          {/* Mobile quick-access buttons */}
          {(showAdminMenu || showOperatorMenu || showMemberMenu) && (
            <div className="flex md:hidden items-center space-x-3 mr-2">
              {(showAdminMenu || showOperatorMenu) && (
                <>
                  <Link
                    to="/admin/deposits"
                    className="flex flex-col items-center justify-center w-12 h-12 rounded border border-white/30 bg-green-600 hover:bg-green-700 transition px-1"
                    title="Deposits"
                    aria-label="Deposits"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <TrendingUp size={18} />
                    <span className="text-[11px] text-white mt-1">Deposits</span>
                  </Link>
                  <Link
                    to="/admin/loans"
                    className="flex flex-col items-center justify-center w-12 h-12 rounded border border-white/30 bg-red-600 hover:bg-red-700 transition px-1"
                    title="Loans"
                    aria-label="Loans"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <TrendingDown size={18} />
                    <span className="text-[11px] text-white mt-1">Loans</span>
                  </Link>
                </>
              )}
              {(showOperatorMenu || showMemberMenu) && (
                <Link
                  to="/member/dashboard"
                  className="flex flex-col items-center justify-center w-12 h-12 rounded border border-white/30 bg-blue-600 hover:bg-blue-700 transition px-1"
                  title="My Dashboard"
                  aria-label="My Dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Home size={18} />
                  <span className="text-[11px] text-white mt-1">MyHome</span>
                </Link>
              )}
              {showAdminMenu && (
                <Link
                  to="/admin/members"
                  className="flex flex-col items-center justify-center w-12 h-12 rounded border border-white/30 bg-indigo-600 hover:bg-indigo-700 transition px-1"
                  title="Members"
                  aria-label="Members"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <UsersIcon size={18} />
                  <span className="text-[11px] text-white mt-1">Members</span>
                </Link>
              )}
              <button
                onClick={() => {
                  if (isAdmin) handleAdminLogout();
                  else if (isMember) handleMemberLogout();
                }}
                className="flex flex-col items-center justify-center w-12 h-12 rounded border border-red-400/50 bg-red-500 hover:bg-red-600 transition px-1"
                title="Logout"
                aria-label="Logout"
              >
                <LogOut size={18} />
                <span className="text-[11px] text-white mt-1">Logout</span>
              </button>
            </div>
          )}
          {showLoginButtons && (
            <Link
              to="/login"
              className="flex items-center space-x-1 md:hidden bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded transition text-white mr-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              <User size={18} />
              <span className="text-sm">Login</span>
            </Link>
          )}
         
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            {showLoginButtons && (
              <>
                <Link 
                  to="/login" 
                  className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 px-4 py-3 rounded transition text-white"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <User size={20} />
                  <span>Login</span>
                </Link>
              </>
            )}
            
            {showAdminMenu && (
              <>
                {adminMenuItems.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <Link 
                      key={index}
                      to={item.link} 
                      className="flex items-center space-x-2 px-4 py-3 hover:bg-green-700 rounded transition"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Icon size={20} />
                      <span>{item.title}</span>
                    </Link>
                  );
                })}
              </>
            )}
            
            {showMemberMenu && (
              <>
                <Link 
                  to="/member/dashboard" 
                  className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 px-4 py-3 rounded transition text-white"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Home size={20} />
                  <span>My Dashboard</span>
                </Link>
              </>
            )}

            {showOperatorMenu && (
              <>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;