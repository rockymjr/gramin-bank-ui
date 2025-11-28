import React, { useEffect, useState } from 'react';
import { memberService } from '../../services/memberService';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/dateFormatter';
import Loader from '../common/Loader';
import { Wallet, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

const MemberDashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const data = await memberService.getDashboard();
      setDashboard(data);
    } catch (error) {
      console.error('Error fetching dashboard:', error);
      alert('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader message="Loading your account..." />;
  if (!dashboard) return <div className="text-center py-8">No data available</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Welcome, {dashboard.memberName}</h1>
        <p className="text-gray-600 mt-2">Phone: {dashboard.phone}</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Deposited (All Time) */}
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-3">
            <TrendingUp size={28} />
            <span className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded">All Time</span>
          </div>
          <h3 className="text-sm font-medium opacity-90">Total Deposited</h3>
          <p className="text-2xl font-bold mt-2">{formatCurrency(dashboard.totalDeposited)}</p>
          <p className="text-xs mt-1 opacity-80">
            Interest Earned: {formatCurrency(dashboard.totalDepositInterestEarned)}
          </p>
        </div>

        {/* Current Deposits */}
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-3">
            <Wallet size={28} />
            <span className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded">Active</span>
          </div>
          <h3 className="text-sm font-medium opacity-90">Current Deposits</h3>
          <p className="text-2xl font-bold mt-2">{formatCurrency(dashboard.currentDeposits)}</p>
          <p className="text-xs mt-1 opacity-80">
            Current Interest: {formatCurrency(dashboard.currentDepositInterest)}
          </p>
        </div>

        {/* Total Borrowed (All Time) */}
        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-3">
            <TrendingDown size={28} />
            <span className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded">All Time</span>
          </div>
          <h3 className="text-sm font-medium opacity-90">Total Borrowed</h3>
          <p className="text-2xl font-bold mt-2">{formatCurrency(dashboard.totalBorrowed)}</p>
          <p className="text-xs mt-1 opacity-80">
            Interest Paid: {formatCurrency(dashboard.totalLoanInterestPaid)}
          </p>
        </div>

        {/* Current Loans */}
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-3">
            <DollarSign size={28} />
            <span className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded">Active</span>
          </div>
          <h3 className="text-sm font-medium opacity-90">Current Loans</h3>
          <p className="text-2xl font-bold mt-2">{formatCurrency(dashboard.currentLoans)}</p>
          <p className="text-xs mt-1 opacity-80">
            Current Interest: {formatCurrency(dashboard.currentLoanInterest)}
          </p>
        </div>
      </div>

      {/* Deposits Table */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Deposits</h2>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Deposit Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Interest Earned
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Current Interest
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {dashboard.deposits.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                      No deposits found
                    </td>
                  </tr>
                ) : (
                  dashboard.deposits.map((deposit, idx) => (
                    <tr key={idx}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {formatDate(deposit.depositDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {formatCurrency(deposit.amount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                        {formatCurrency(deposit.interestEarned)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-green-700 font-medium">
                        {deposit.currentInterest ? formatCurrency(deposit.currentInterest) : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          deposit.status === 'ACTIVE'
                            ? 'bg-green-100 text-green-800'
                            : deposit.status === 'RETURNED'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {deposit.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Loans Table */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Loans</h2>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Loan Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Paid
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Interest
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Current Interest
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Remaining
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {dashboard.loans.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                      No loans found
                    </td>
                  </tr>
                ) : (
                  dashboard.loans.map((loan, idx) => (
                    <tr key={idx}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {formatDate(loan.loanDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {formatCurrency(loan.amount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                        {formatCurrency(loan.paidAmount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                        {formatCurrency(loan.interestPaid)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-red-700 font-medium">
                        {loan.currentInterest ? formatCurrency(loan.currentInterest) : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-orange-600">
                        {formatCurrency(loan.remainingAmount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          loan.status === 'ACTIVE'
                            ? 'bg-yellow-100 text-yellow-800'
                            : loan.status === 'CLOSED'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {loan.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberDashboard;