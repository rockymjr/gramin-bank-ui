import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { MemberAuthProvider } from './context/MemberAuthContext';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ProtectedRoute from './components/common/ProtectedRoute';
import MemberProtectedRoute from './components/common/MemberProtectedRoute';

// Public Pages
import Summary from './components/public/Summary';
import DepositList from './components/public/DepositList';
import LoanList from './components/public/LoanList';

// Admin Pages
import Login from './components/admin/Login';
import Dashboard from './components/admin/Dashboard';
import MemberManagement from './components/admin/MemberManagement';
import DepositManagement from './components/admin/DepositManagement';
import LoanManagement from './components/admin/LoanManagement';
import MemberStatement from './components/admin/MemberStatement';
import YearlyReport from './components/admin/YearlyReport';

// Member Pages
import MemberLogin from './components/member/MemberLogin';
import MemberDashboard from './components/member/MemberDashboard';

// Home Page Component
const HomePage = () => {
  return (
    <div>
      <Summary />
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            to="/deposits"
            className="block bg-white rounded-lg shadow-lg hover:shadow-xl transition p-6 border-t-4 border-green-500"
          >
            <h3 className="text-xl font-bold text-gray-800 mb-2">View Deposits</h3>
            <p className="text-gray-600">See all deposits with masked member names</p>
          </Link>

          <Link
            to="/loans"
            className="block bg-white rounded-lg shadow-lg hover:shadow-xl transition p-6 border-t-4 border-red-500"
          >
            <h3 className="text-xl font-bold text-gray-800 mb-2">View Loans</h3>
            <p className="text-gray-600">See all loans with masked member names</p>
          </Link>

          <Link
            to="/member/login"
            className="block bg-white rounded-lg shadow-lg hover:shadow-xl transition p-6 border-t-4 border-blue-500"
          >
            <h3 className="text-xl font-bold text-gray-800 mb-2">Member Login</h3>
            <p className="text-gray-600">Access your account with phone & PIN</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <MemberAuthProvider>
        <Router>
          <div className="flex flex-col min-h-screen bg-gray-50">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/deposits" element={<DepositList />} />
                <Route path="/loans" element={<LoanList />} />

                {/* Admin Routes */}
                <Route path="/admin/login" element={<Login />} />
                <Route
                  path="/admin/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/members"
                  element={
                    <ProtectedRoute>
                      <MemberManagement />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/deposits"
                  element={
                    <ProtectedRoute>
                      <DepositManagement />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/loans"
                  element={
                    <ProtectedRoute>
                      <LoanManagement />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/statements"
                  element={
                    <ProtectedRoute>
                      <MemberStatement />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/reports"
                  element={
                    <ProtectedRoute>
                      <YearlyReport />
                    </ProtectedRoute>
                  }
                />

                {/* Member Routes */}
                <Route path="/member/login" element={<MemberLogin />} />
                <Route
                  path="/member/dashboard"
                  element={
                    <MemberProtectedRoute>
                      <MemberDashboard />
                    </MemberProtectedRoute>
                  }
                />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </MemberAuthProvider>
    </AuthProvider>
  );
}

export default App;