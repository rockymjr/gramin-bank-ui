import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../../services/adminService';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/dateFormatter';
import { Plus, RotateCcw, Edit, ChevronLeft, ChevronRight } from 'lucide-react';
import Loader from '../common/Loader';
import DepositForm from './DepositForm';
import DepositReturn from './DepositReturn';

const DepositManagement = ({ readOnly }) => {
  const [deposits, setDeposits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [editingDeposit, setEditingDeposit] = useState(null);
  const [returningDeposit, setReturningDeposit] = useState(null);
  const [statusFilter, setStatusFilter] = useState('ACTIVE');
  const [sortedDeposits, setSortedDeposits] = useState([]);

  useEffect(() => {
    fetchDeposits();
  }, [page, statusFilter]);

  const fetchDeposits = async () => {
    try {
      setLoading(true);
      const data = await adminService.getAllDeposits(statusFilter, page, 10);
      // Sort by deposit date in descending order (newest first)
      const sorted = [...data.content].sort((a, b) => {
        const dateA = new Date(b.depositDate);
        const dateB = new Date(a.depositDate);
        return dateA.getTime() - dateB.getTime();
      });
      setSortedDeposits(sorted);
      setDeposits(sorted);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('Error fetching deposits:', error);
      alert('Failed to load deposits');
    } finally {
      setLoading(false);
    }
  };

  const handleFormClose = (shouldRefresh) => {
    setShowForm(false);
    setEditingDeposit(null);
    if (shouldRefresh) {
      fetchDeposits();
    }
  };

  const handleReturnComplete = (shouldRefresh) => {
    setReturningDeposit(null);
    if (shouldRefresh) {
      fetchDeposits();
    }
  };

  const handleEdit = (deposit) => {
    setEditingDeposit(deposit);
    setShowForm(true);
  };

  const handleAddNew = () => {
    setEditingDeposit(null);
    setShowForm(true);
  };

  if (loading) return <Loader message="Loading deposits..." />;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Deposit Management</h2>
        {!readOnly && (
          <button
            onClick={handleAddNew}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition"
          >
            <Plus size={20} />
            <span>Add Deposit</span>
          </button>
        )}
      </div>

      {/* Status Filter */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-700">Filter by Status:</label>
          <div className="flex space-x-2">
            <button
              onClick={() => {
                setStatusFilter('ALL');
                setPage(0);
              }}
              className={`px-4 py-2 rounded-lg transition ${statusFilter === 'ALL'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
            >
              All Deposits
            </button>
            <button
              onClick={() => {
                setStatusFilter('ACTIVE');
                setPage(0);
              }}
              className={`px-4 py-2 rounded-lg transition ${statusFilter === 'ACTIVE'
                ? 'bg-green-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
            >
              Active
            </button>
            <button
              onClick={() => {
                setStatusFilter('RETURNED');
                setPage(0);
              }}
              className={`px-4 py-2 rounded-lg transition ${statusFilter === 'RETURNED'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
            >
              Returned
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Return Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Duration
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                 Interest Rate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Monthly Interest
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {statusFilter === 'ACTIVE' ? 'Current Interest' : 'Interest Earned'}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {statusFilter === 'ACTIVE' ? 'Current Total' : 'Total Amount'}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Notes
                </th>
                {(statusFilter === 'ACTIVE' || statusFilter === 'ALL') && !readOnly && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {deposits.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                    No deposits found
                  </td>
                </tr>
              ) : (
                deposits.map((deposit) => (
                  <tr key={deposit.id} className="odd:bg-white even:bg-gray-50 hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      <Link
                        to={`/admin/statements?memberId=${deposit.memberId}`}
                        className="text-blue-600 hover:underline"
                      >
                        {deposit.memberName}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(deposit.amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(deposit.depositDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {deposit.returnDate ? formatDate(deposit.returnDate) : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {deposit.durationDays ? `${deposit.durationMonths} months ${deposit.durationDays} days` : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                      {deposit.interestRate}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                      {formatCurrency((deposit.amount * deposit.interestRate) / 100)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                      {formatCurrency(deposit.currentInterest || deposit.interestEarned)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatCurrency(deposit.currentTotal || deposit.totalAmount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${deposit.status === 'ACTIVE'
                        ? 'bg-green-100 text-green-800'
                        : deposit.status === 'RETURNED'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                        }`}>
                        {deposit.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {deposit.notes ? deposit.notes.substring(0, 50) + (deposit.notes.length > 50 ? '...' : '') : '-'}
                    </td>
                    {(statusFilter === 'ACTIVE' || statusFilter === 'ALL') && !readOnly && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          {(deposit.status === 'ACTIVE' || statusFilter === 'ALL') && (
                            <>
                              <button
                                onClick={() => handleEdit(deposit)}
                                className="text-blue-600 hover:text-blue-900"
                                title="Edit"
                              >
                                <Edit size={18} />
                              </button>
                              <button
                                onClick={() => setReturningDeposit(deposit)}
                                className="text-green-600 hover:text-green-900"
                                title="Return"
                              >
                                <RotateCcw size={18} />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="bg-gray-50 px-4 py-3 flex items-center justify-between border-t border-gray-200">
          <div className="flex-1 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Page <span className="font-medium">{page + 1}</span> of{' '}
                <span className="font-medium">{totalPages}</span>
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button
                  onClick={() => setPage(page - 1)}
                  disabled={page === 0}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={() => setPage(page + 1)}
                  disabled={page >= totalPages - 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  <ChevronRight size={20} />
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {!readOnly && showForm && <DepositForm deposit={editingDeposit} onClose={handleFormClose} />}
      {!readOnly && returningDeposit && <DepositReturn deposit={returningDeposit} onClose={handleReturnComplete} />}
    </div>
  );
};

export default DepositManagement;