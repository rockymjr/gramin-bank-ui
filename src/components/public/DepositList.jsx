import React, { useEffect, useState } from 'react';
import { publicService } from '../../services/publicService';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/dateFormatter';
import Loader from '../common/Loader';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const DepositList = () => {
  const [deposits, setDeposits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [statusFilter, setStatusFilter] = useState('ACTIVE');

  useEffect(() => {
    fetchDeposits();
  }, [page, statusFilter]);

  const fetchDeposits = async () => {
    try {
      setLoading(true);
      const data = await publicService.getDeposits(statusFilter, page, 10);
      setDeposits(data.content);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('Error fetching deposits:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader message="Loading deposits..." />;

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">Deposits</h2>

      {/* Status Filter */}
      <div className="bg-white rounded-lg shadow p-3 sm:p-4 mb-4 sm:mb-6 overflow-x-auto">
        <div className="flex items-center space-x-2 sm:space-x-4 min-w-max">
          <label className="text-xs sm:text-sm font-medium text-gray-700 whitespace-nowrap">Filter:</label>
          <div className="flex space-x-2">
            {['ACTIVE', 'RETURNED', 'SETTLED'].map((status) => (
              <button
                key={status}
                onClick={() => {
                  setStatusFilter(status);
                  setPage(0);
                }}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm transition whitespace-nowrap ${
                  statusFilter === status
                    ? status === 'ACTIVE'
                      ? 'bg-green-600 text-white'
                      : status === 'RETURNED'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="block sm:hidden space-y-4">
        {deposits.map((deposit) => (
          <div key={deposit.id} className="bg-white rounded-lg shadow p-4">
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 text-sm">{deposit.memberName}</h3>
                <p className="text-xs text-gray-500 mt-1">{formatDate(deposit.depositDate)}</p>
              </div>
              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                deposit.status === 'ACTIVE'
                  ? 'bg-green-100 text-green-800'
                  : deposit.status === 'RETURNED'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {deposit.status}
              </span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Amount:</span>
                <span className="font-semibold">{formatCurrency(deposit.amount)}</span>
              </div>
              {statusFilter === 'ACTIVE' && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Current Interest:</span>
                  <span className="font-semibold text-green-600">
                    {formatCurrency(deposit.currentInterest || 0)}
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden sm:block bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Member Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Deposit Date
                </th>
                {statusFilter === 'ACTIVE' && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Current Interest
                  </th>
                )}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {deposits.map((deposit) => (
                <tr key={deposit.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {deposit.memberName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(deposit.amount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(deposit.depositDate)}
                  </td>
                  {statusFilter === 'ACTIVE' && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">
                      {formatCurrency(deposit.currentInterest || 0)}
                    </td>
                  )}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
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
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="mt-4 sm:mt-6 flex items-center justify-between">
        <p className="text-xs sm:text-sm text-gray-700">
          Page <span className="font-medium">{page + 1}</span> of{' '}
          <span className="font-medium">{totalPages}</span>
        </p>
        <div className="flex space-x-2">
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 0}
            className="p-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => setPage(page + 1)}
            disabled={page >= totalPages - 1}
            className="p-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DepositList;