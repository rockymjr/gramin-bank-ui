import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/dateFormatter';
import { FileText } from 'lucide-react';
import Loader from '../common/Loader';
import StyledTable from '../common/StyledTable';

const MemberStatement = ({ readOnly }) => {
  const [statement, setStatement] = useState(null);
  const [loading, setLoading] = useState(false);

  // Read optional memberId from query params and fetch members
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const memberIdFromQuery = params.get('memberId');
    if (memberIdFromQuery) {
      // fetch statement for all years (year=null)
      (async () => {
        try {
          setLoading(true);
          const data = await adminService.getMemberStatement(memberIdFromQuery, null);
          setStatement(data);
        } catch (error) {
          console.error('Error fetching statement:', error);
          alert('Failed to fetch statement');
        } finally {
          setLoading(false);
        }
      })();
    }
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <FileText size={32} className="text-green-600" />
          <h2 className="text-2xl font-bold text-gray-800">Member Statement</h2>
        </div>
      </div>

      {loading && <Loader message="Loading statement..." />}

      {/* Statement Display */}
      {statement && (
        <div className="bg-white rounded-lg shadow p-6 print:shadow-none">
          {/* Header */}
          <div className="border-b pb-4 mb-6 print:border-black">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-2xl font-bold text-gray-800">Member Statement</h3>
              </div>
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
              <StyledTable
                renderHeader={() => (
                  <>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-white uppercase tracking-wide">Deposit Date</th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-white uppercase tracking-wide">Return Date</th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-white uppercase tracking-wide">Duration</th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-white uppercase tracking-wide">Amount</th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-white uppercase tracking-wide">Monthly Interest</th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-white uppercase tracking-wide">Interest Earned</th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-white uppercase tracking-wide">Total</th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-white uppercase tracking-wide">Status</th>
                  </>
                )}
              >
                {statement.deposits.map((deposit) => (
                  <tr key={deposit.id} className="odd:bg-white even:bg-gray-50 hover:bg-gray-100">
                    <td className="px-4 py-2 text-sm">{formatDate(deposit.depositDate)}</td>
                    <td className="px-4 py-2 text-sm">{deposit.returnDate ? formatDate(deposit.returnDate) : '-'}</td>
                    <td className="px-4 py-2 text-sm">{deposit.durationMonths ? `${deposit.durationMonths}m ${deposit.durationDays}d` : '-'}</td>
                    <td className="px-4 py-2 text-sm">{formatCurrency(deposit.amount)}</td>
                    <td className="px-4 py-2 text-sm text-green-600">{formatCurrency((deposit.amount * deposit.interestRate) / 100 || 0)}</td>
                    <td className="px-4 py-2 text-sm text-green-600">{formatCurrency(deposit.interestEarned)}</td>
                    <td className="px-4 py-2 text-sm font-medium">{formatCurrency(deposit.totalAmount)}</td>
                    <td className="px-4 py-2 text-sm">
                      <span className={`px-2 py-1 text-xs rounded-full ${deposit.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {deposit.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </StyledTable>
            ) : (
              <p className="text-gray-500 text-sm">No deposits found</p>
            )}
          </div>

          {/* Loans Section */}
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-gray-800 mb-3">Loans</h4>
            {statement.loans && statement.loans.length > 0 ? (
              <StyledTable
                renderHeader={() => (
                  <>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-white uppercase tracking-wide">Loan Date</th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-white uppercase tracking-wide">Return Date</th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-white uppercase tracking-wide">Duration</th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-white uppercase tracking-wide">Amount</th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-white uppercase tracking-wide">Monthly Interest</th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-white uppercase tracking-wide">Total Interest</th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-white uppercase tracking-wide">Total Repayment</th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-white uppercase tracking-wide">Status</th>
                  </>
                )}
              >
                {statement.loans.map((loan) => (
                  <tr key={loan.id} className="odd:bg-white even:bg-gray-50 hover:bg-gray-100">
                    <td className="px-4 py-2 text-sm">{formatDate(loan.loanDate)}</td>
                    <td className="px-4 py-2 text-sm">{loan.returnDate ? formatDate(loan.returnDate) : '-'}</td>
                    <td className="px-4 py-2 text-sm">{loan.durationMonths ? `${loan.durationMonths}m ${loan.durationDays}d` : '-'}</td>
                    <td className="px-4 py-2 text-sm">{formatCurrency(loan.loanAmount)}</td>
                    <td className="px-4 py-2 text-sm text-red-600">{formatCurrency((loan.loanAmount * loan.interestRate) / 100 || 0)}</td>
                    <td className="px-4 py-2 text-sm text-red-600">{formatCurrency(loan.interestAmount)}</td>
                    <td className="px-4 py-2 text-sm font-medium">{formatCurrency(loan.totalRepayment)}</td>
                    <td className="px-4 py-2 text-sm">
                      <span className={`px-2 py-1 text-xs rounded-full ${loan.status === 'ACTIVE' ? 'bg-yellow-100 text-yellow-800' : loan.status === 'CLOSED' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                        {loan.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </StyledTable>
            ) : (
              <p className="text-gray-500 text-sm">No loans found</p>
            )}
          </div>

          {/* Summary */}
          <div className="bg-blue-50 rounded-lg p-4 border-t-4 border-blue-500 print:border print:border-black">
            <h4 className="font-semibold text-gray-800 mb-3">Summary</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Total Deposits</p>
                <p className="text-xl font-bold text-green-600">{formatCurrency(statement.totalDeposits)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Loans</p>
                <p className="text-xl font-bold text-red-600">{formatCurrency(statement.totalLoans)}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemberStatement;