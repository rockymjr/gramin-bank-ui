// src/components/public/Summary.jsx
import React, { useEffect, useState } from 'react';
import { publicService } from '../../services/publicService';
import { formatCurrency } from '../../utils/formatCurrency';
import { useLanguage } from '../../context/LanguageContext';
import Loader from '../common/Loader';
import { Wallet, TrendingUp, TrendingDown } from 'lucide-react';

const Summary = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { t } = useLanguage();

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    try {
      setLoading(true);
      const data = await publicService.getSummary();
      setSummary(data);
    } catch (error) {
      setError('Failed to load summary data');
      console.error('Error fetching summary:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader message={t('loading')} />;
  if (error) return <div className="text-red-500 text-center py-8 px-4">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Total Deposits Card */}
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg p-4 sm:p-6 text-white">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <TrendingUp size={28} className="sm:w-8 sm:h-8" />
            <span className="text-xs sm:text-sm bg-white bg-opacity-20 px-2 sm:px-3 py-1 rounded-full">
              {summary?.activeDepositsCount} {t('active')}
            </span>
          </div>
          <h3 className="text-sm sm:text-lg font-medium opacity-90">{t('totalDeposits')}</h3>
          <p className="text-2xl sm:text-3xl font-bold mt-2 break-words">
            {formatCurrency(summary?.totalDeposits)}
          </p>
        </div>

        {/* Total Loans Card */}
        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-lg shadow-lg p-4 sm:p-6 text-white">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <TrendingDown size={28} className="sm:w-8 sm:h-8" />
            <span className="text-xs sm:text-sm bg-white bg-opacity-20 px-2 sm:px-3 py-1 rounded-full">
              {summary?.activeLoansCount} {t('active')}
            </span>
          </div>
          <h3 className="text-sm sm:text-lg font-medium opacity-90">{t('totalLoans')}</h3>
          <p className="text-2xl sm:text-3xl font-bold mt-2 break-words">
            {formatCurrency(summary?.totalLoans)}
          </p>
        </div>

        {/* Available Balance Card */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-4 sm:p-6 text-white sm:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <Wallet size={28} className="sm:w-8 sm:h-8" />
          </div>
          <h3 className="text-sm sm:text-lg font-medium opacity-90">{t('availableBalance')}</h3>
          <p className="text-2xl sm:text-3xl font-bold mt-2 break-words">
            {formatCurrency(summary?.availableBalance)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Summary;