import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/dateFormatter';
import { Search, FileText, Download } from 'lucide-react';
import Loader from '../common/Loader';

const MemberStatement = () => {
  const [members, setMembers] = useState([]);
  const [selectedMemberId, setSelectedMemberId] = useState('');
  const [year, setYear] = useState(null);
  const [statement, setStatement] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingMembers, setLoadingMembers] = useState(true);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      setLoadingMembers(true);
      const data = await adminService.getAllMembers();
      setMembers(data);
    } catch (error) {
      console.error('Error fetching members:', error);
      alert('Failed to load members');
    } finally {
      setLoadingMembers(false);
    }
  };

  const handleFetchStatement = async (e) => {
    e.preventDefault();

    if (!selectedMemberId) {
      alert('Please select a member');
      return;
    }

    setLoading(true);

    try {
      const data = await adminService.getMemberStatement(selectedMemberId, year);
      setStatement(data);
    } catch (error) {
      console.error('Error fetching statement:', error);
      alert('Failed to fetch statement');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <FileText size={32} className="text-green-600" />
          <h2 className="text-2xl font-bold text-gray-800">Member Statement</h2>
        </div>
      </div>

      {/* Search Form */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <form onSubmit={handleFetchStatement} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Member <span className="text-red-500">*</span>
              </label>
              {loadingMembers ? (
                <p className="text-sm text-gray-500">Loading members...</p>
              ) : (
                <select
                  value={selectedMemberId}
                  onChange={(e) => setSelectedMemberId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                >
                  <option value="">-- Select Member --</option>
                  {members.map((member) => (
                    <option key={member.id} value={member.id}>
                      {member.firstName} {member.lastName} - {member.phone}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Year
              </label>
              <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                {["2025-26", "2024-25"].map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || loadingMembers}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg flex items-center space-x-2 transition disabled:opacity-50"
          >
            <Search size={20} />
            <span>{loading ? 'Loading...' : 'Fetch Statement'}</span>
          </button>
        </form>
      </div>

      {/* Statement Display */}
      {statement && (
        <div className="bg-white rounded-lg shadow p-6 print:shadow-none">
          {/* Header */}
          <div className="border-b pb-4 mb-6 print:border-black">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-2xl font-bold text-gray-800">Member Statement</h3>
                <p className="text-gray-600 mt-1">Financial Year: {year}</p>
              </div>
              <button
                onClick={handlePrint}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition print:hidden"
              >
                <Download size={20} />
                <span>Print</span>
              </button>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 print:bg-white print:border">
              <h4 className="font-semibold text-gray-700 mb-2">Member Information</h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-gray-600">Name:</span>
                  <span className="font-medium ml-2">{statement.memberName}</span>
                </div>
                <div>
                  <span className="text-gray-600">Phone:</span>
                  <span className="font-medium ml-2">{statement.phone}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Deposits Section */}
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-gray-800 mb-3">Deposits</h4>
            {statement.deposits && statement.deposits.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Interest Earned</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {statement.deposits.map((deposit) => (
                      <tr key={deposit.id}>
                        <td className="px-4 py-2 text-sm">{formatDate(deposit.depositDate)}</td>
                        <td className="px-4 py-2 text-sm">{formatCurrency(deposit.amount)}</td>
                        <td className="px-4 py-2 text-sm text-green-600">{formatCurrency(deposit.interestEarned)}</td>
                        <td className="px-4 py-2 text-sm font-medium">{formatCurrency(deposit.totalAmount)}</td>
                        <td className="px-4 py-2 text-sm">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            deposit.status === 'ACTIVE' 
                              ? 'bg-green-100 text-green-800' 
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
            ) : (
              <p className="text-gray-500 text-sm">No deposits found</p>
            )}
          </div>

          {/* Loans Section */}
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-gray-800 mb-3">Loans</h4>
            {statement.loans && statement.loans.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Loan Date</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Return Date</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Interest</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Total Repayment</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {statement.loans.map((loan) => (
                      <tr key={loan.id}>
                        <td className="px-4 py-2 text-sm">{formatDate(loan.loanDate)}</td>
                        <td className="px-4 py-2 text-sm">{formatCurrency(loan.loanAmount)}</td>
                        <td className="px-4 py-2 text-sm">{loan.returnDate ? formatDate(loan.returnDate) : '-'}</td>
                        <td className="px-4 py-2 text-sm text-red-600">{formatCurrency(loan.interestAmount)}</td>
                        <td className="px-4 py-2 text-sm font-medium">{formatCurrency(loan.totalRepayment)}</td>
                        <td className="px-4 py-2 text-sm">
                          <span className={`px-2 py-1 text-xs rounded-full ${
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
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No loans found</p>
            )}
          </div>

          {/* Summary */}
          <div className="bg-blue-50 rounded-lg p-4 border-t-4 border-blue-500 print:border print:border-black">
            <h4 className="font-semibold text-gray-800 mb-3">Summary</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-600">Total Deposits</p>
                <p className="text-xl font-bold text-green-600">{formatCurrency(statement.totalDeposits)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Loans</p>
                <p className="text-xl font-bold text-red-600">{formatCurrency(statement.totalLoans)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Net Position</p>
                <p className={`text-xl font-bold ${
                  statement.netPosition >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {formatCurrency(statement.netPosition)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemberStatement;