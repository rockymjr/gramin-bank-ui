import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { MemberAuthProvider } from './context/MemberAuthContext';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ProtectedRoute from './components/common/ProtectedRoute';
import MemberProtectedRoute from './components/common/MemberProtectedRoute';
import UnifiedLogin from './components/common/UnifiedLogin';

// Public Pages
import Summary from './components/public/Summary';
import DepositList from './components/public/DepositList';
import LoanList from './components/public/LoanList';

// Admin Pages
import MemberManagement from './components/admin/MemberManagement';
import DepositManagement from './components/admin/DepositManagement';
import LoanManagement from './components/admin/LoanManagement';
import MemberStatement from './components/admin/MemberStatement';

import YearlyReport from './components/admin/YearlyReport';

// Member Pages
import MemberDashboard from './components/member/MemberDashboard';

// Home Page Component
const HomePage = () => {
  return (
    <div>
      <Summary />
      {/* Quick access available in Navbar for admins/operators - removed duplicate home buttons */}
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
              <AppRoutes />
            </main>
            <Footer />
          </div>
        </Router>
      </MemberAuthProvider>
    </AuthProvider>
  );
}

// AppRoutes is rendered inside MemberAuthProvider, so hooks are safe here
import { useMemberAuth } from './context/MemberAuthContext';
function AppRoutes() {
  const { isOperator } = useMemberAuth() || {};
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/deposits" element={<DepositList />} />
      <Route path="/loans" element={<LoanList />} />

      {/* Unified Login Route */}
      <Route path="/login" element={<UnifiedLogin />} />

      {/* Admin Routes */}
      {/* Removed /admin/dashboard - redirect to members */}
      <Route path="/admin/dashboard" element={<Navigate to="/admin/members" replace />} />
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
          isOperator
            ? <DepositManagement readOnly={true} />
            : <ProtectedRoute><DepositManagement readOnly={false} /></ProtectedRoute>
        }
      />
      <Route
        path="/admin/loans"
        element={
          isOperator
            ? <LoanManagement readOnly={true} />
            : <ProtectedRoute><LoanManagement readOnly={false} /></ProtectedRoute>
        }
      />
      <Route
        path="/admin/statements"
        element={
          isOperator
            ? <MemberStatement readOnly={true} />
            : <ProtectedRoute><MemberStatement readOnly={false} /></ProtectedRoute>
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
  );
}

export default App;