import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useMemberAuth } from '../../context/MemberAuthContext';
import { Home, User, LogOut, Menu, X, Users as UsersIcon, TrendingUp, TrendingDown, FileText, Calendar, Lock } from 'lucide-react';

const Navbar = () => {
  const { isAuthenticated: isAdmin, username: adminUsername, logout: adminLogout } = useAuth();
  const { isAuthenticated: isMember, memberName, isOperator, logout: memberLogout } = useMemberAuth();
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
  const isAdminRoute = location.pathname.startsWith('/admin');

  // Admin menu items
  const adminMenuItems = [
    { title: 'Members', icon: UsersIcon, link: '/admin/members' },
    { title: 'Deposits', icon: TrendingUp, link: '/admin/deposits' },
    { title: 'Loans', icon: TrendingDown, link: '/admin/loans' },
    { title: 'Statements', icon: FileText, link: '/admin/statements' },
    { title: 'Reports', icon: Calendar, link: '/admin/reports' }
  ];

  // Operator menu items (read-only, admin pages)
  const operatorMenuItems = [
    { title: 'Deposits', icon: TrendingUp, link: '/admin/deposits' },
    { title: 'Loans', icon: TrendingDown, link: '/admin/loans' },
    { title: 'Statements', icon: FileText, link: '/admin/statements' }
  ];

  // Determine what to show in navbar
  const showLoginButtons = !isAdmin && !isMember;
  const showAdminMenu = isAdmin;
  const showMemberMenu = isMember && !isOperator;
  const showOperatorMenu = isMember && isOperator;
  
  // Debug: Log the authentication state
  React.useEffect(() => {
    console.log('Navbar updated - isAdmin:', isAdmin, 'isMember:', isMember, 'isOperator:', isOperator);
    console.log('localStorage.authToken:', localStorage.getItem('authToken'));
    console.log('localStorage.memberToken:', localStorage.getItem('memberToken'));
    console.log('localStorage.isOperator:', localStorage.getItem('isOperator'));
    console.log('showLoginButtons:', showLoginButtons, 'showOperatorMenu:', showOperatorMenu);
  }, [isAdmin, isMember, isOperator, location.pathname]);

  return (
    <nav className="bg-green-600 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo and User Info */}
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-2" onClick={() => setMobileMenuOpen(false)}>
              <Home size={24} />
              <span className="text-lg sm:text-xl font-bold">Dhuripara Gramin Bank</span>
            </Link>
            
            {/* Show admin or member name on left */}
            {isAdmin && (
              <span className="text-green-200 text-sm border-l border-green-400 pl-4">Admin: {adminUsername}</span>
            )}
            {isMember && (
              <span className="text-green-200 text-sm border-l border-green-400 pl-4">
                {isOperator ? `${memberName} (Operator)` : memberName}
              </span>
            )}
          </div>

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
                {adminMenuItems.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <Link 
                      key={index}
                      to={item.link} 
                      className="flex items-center space-x-1 hover:text-green-200 transition"
                    >
                      <Icon size={18} />
                      <span>{item.title}</span>
                    </Link>
                  );
                })}
                <div className="border-l border-green-400 h-6 mx-2"></div>
                <button
                  onClick={handleAdminLogout}
                  className="flex items-center space-x-1 bg-red-500 hover:bg-red-600 px-4 py-2 rounded transition"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
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
                <button
                  onClick={handleMemberLogout}
                  className="flex items-center space-x-1 bg-red-500 hover:bg-red-600 px-4 py-2 rounded transition"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </div>
            )}

            {showOperatorMenu && (
              <div className="flex items-center space-x-4">
                {operatorMenuItems.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={index}
                      to={item.link}
                      className="flex items-center space-x-1 text-green-200 opacity-80 cursor-pointer hover:text-green-100"
                      title="Read-only access"
                    >
                      <Icon size={18} />
                      <span>{item.title}</span>
                    </Link>
                  );
                })}
                <div className="border-l border-green-400 h-6 mx-2"></div>
                <button
                  onClick={handleMemberLogout}
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
                <button
                  onClick={handleAdminLogout}
                  className="flex items-center space-x-2 w-full bg-red-500 hover:bg-red-600 px-4 py-3 rounded transition"
                >
                  <LogOut size={20} />
                  <span>Logout</span>
                </button>
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
                <button
                  onClick={handleMemberLogout}
                  className="flex items-center space-x-2 w-full bg-red-500 hover:bg-red-600 px-4 py-3 rounded transition"
                >
                  <LogOut size={20} />
                  <span>Logout</span>
                </button>
              </>
            )}

            {showOperatorMenu && (
              <>
                {operatorMenuItems.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={index}
                      to={item.link}
                      className="flex items-center space-x-2 px-4 py-3 text-green-200 opacity-80 cursor-pointer hover:text-green-100"
                      title="Read-only access"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Icon size={20} />
                      <span>{item.title}</span>
                    </Link>
                  );
                })}
                <button
                  onClick={handleMemberLogout}
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