import React, { createContext, useState, useContext } from 'react';
import { memberService } from '../services/memberService';

const MemberAuthContext = createContext(null);

export const MemberAuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(memberService.isAuthenticated());
  const [memberName, setMemberName] = useState(memberService.getMemberName());

  const login = async (phone, pin) => {
    try {
      const response = await memberService.login(phone, pin);
      setIsAuthenticated(true);
      setMemberName(response.memberName);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  const logout = () => {
    memberService.logout();
    setIsAuthenticated(false);
    setMemberName(null);
  };

  return (
    <MemberAuthContext.Provider value={{ isAuthenticated, memberName, login, logout }}>
      {children}
    </MemberAuthContext.Provider>
  );
};

export const useMemberAuth = () => {
  const context = useContext(MemberAuthContext);
  if (!context) {
    throw new Error('useMemberAuth must be used within MemberAuthProvider');
  }
  return context;
};