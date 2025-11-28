import api from './api';

export const memberService = {
  login: async (phone, pin) => {
    const response = await api.post('/member/auth/login', { phone, pin });
    if (response.data.token) {
      localStorage.setItem('memberToken', response.data.token);
      localStorage.setItem('memberId', response.data.memberId);
      localStorage.setItem('memberName', response.data.memberName);
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('memberToken');
    localStorage.removeItem('memberId');
    localStorage.removeItem('memberName');
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('memberToken');
  },

  getMemberName: () => {
    return localStorage.getItem('memberName');
  },

  getDashboard: async () => {
    const token = localStorage.getItem('memberToken');
    const response = await api.get('/member/dashboard', {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  }
};