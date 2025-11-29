import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useMemberAuth } from '../../context/MemberAuthContext';

const DebugBar = () => {
  const { isAuthenticated: isAdmin, username } = useAuth();
  const { isAuthenticated: isMember, memberName } = useMemberAuth();

  const handleClearAuth = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('username');
    localStorage.removeItem('memberToken');
    localStorage.removeItem('memberId');
    localStorage.removeItem('memberName');
    window.location.reload();
  };

  // Only show in development
  if (import.meta.env.MODE !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-800 text-white p-2 text-xs z-40">
      <div className="container mx-auto flex justify-between items-center">
        <div>
          isAdmin: {String(isAdmin)} | username: {username} | isMember: {String(isMember)} | memberName: {memberName}
        </div>
        <button
          onClick={handleClearAuth}
          className="bg-red-600 hover:bg-red-700 px-2 py-1 rounded text-xs"
        >
          Clear Auth
        </button>
      </div>
    </div>
  );
};

export default DebugBar;
