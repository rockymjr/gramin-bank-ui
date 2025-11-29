import api from './api';

export const operatorService = {

    login: async (phone, pin) => {
        const response = await api.post('/operator/auth/login', { phone, pin });
        if (response.data.token) {
            localStorage.setItem('operatorToken', response.data.token);
        }
        return response.data;
    },

    getAllMembers: async (search = '') => {
        const response = await api.get(`/admin/members${search ? `?search=${search}` : ''}`);
        return response.data;
    },

    getMemberById: async (id) => {
        const response = await api.get(`/admin/members/${id}`);
        return response.data;
    },


    // Deposits
    getAllDeposits: async (status = 'ACTIVE', page = 0, size = 10) => {
        const response = await api.get(`/admin/deposits?status=${status}&page=${page}&size=${size}`);
        return response.data;
    },

    getDepositById: async (id) => {
        const response = await api.get(`/admin/deposits/${id}`);
        return response.data;
    },

    // Loans
    getAllLoans: async (status = 'ACTIVE', page = 0, size = 10) => {
        const response = await api.get(`/admin/loans?status=${status}&page=${page}&size=${size}`);
        return response.data;
    },

    getLoanById: async (id) => {
        const response = await api.get(`/admin/loans/${id}`);
        return response.data;
    },
 

    getLoanPaymentHistory: async (loanId) => {
        const response = await api.get(`/admin/loans/${loanId}/payments`);
        return response.data;
    },

    // Reports
    getMemberStatement: async (memberId, year) => {
        const response = await api.get(`/admin/reports/members/${memberId}/statement${year ? `?year=${year}` : ''}`);
        return response.data;
    },

    getYearlySettlement: async (year) => {
        const response = await api.get(`/admin/reports/yearly-settlement${year ? `?year=${year}` : ''}`);
        return response.data;
    }
};