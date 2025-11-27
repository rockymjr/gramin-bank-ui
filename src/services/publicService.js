import api from './api';

export const publicService = {
  getSummary: async () => {
    const response = await api.get('/public/summary');
    return response.data;
  },

  getDeposits: async (status = 'ACTIVE', page = 0, size = 10) => {
    const response = await api.get(`/public/deposits?status=${status}&page=${page}&size=${size}`);
    return response.data;
  },

  getLoans: async (status = 'ACTIVE', page = 0, size = 10) => {
    const response = await api.get(`/public/loans?status=${status}&page=${page}&size=${size}`);
    return response.data;
  }
};