
import React, { ReactNode } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './hooks/useAuth';
import { SystemStatusProvider } from './contexts/SystemStatusContext';
import { SocketProvider } from './contexts/SocketContext';
import ProtectedRoute from './components/layout/ProtectedRoute';
import DashboardLayout from './components/layout/DashboardLayout';

import LandingPage from './pages/public/LandingPage';
import PrivacyPolicy from './pages/public/PrivacyPolicy';
import TermsOfService from './pages/public/TermsOfService';
import NotFound from './pages/public/NotFound';
import LoginPage from './pages/public/LoginPage';
import StudentDashboard from './pages/student/StudentDashboard';
import LecturerDashboard from './pages/lecturer/LecturerDashboard';
import ParentDashboard from './pages/parent/ParentDashboard';
import PrincipalDashboard from './pages/principal/PrincipalDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminSetupPage from './pages/admin/AdminSetupPage';
import AdminRouteHandler from './components/layout/AdminRouteHandler';


import { PATHS, ROLES, ROLE_DASHBOARD_PATHS } from './constants';
import Spinner from './components/ui/Spinner';

const AppRoutes: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="flex items-center justify-center h-screen"><Spinner size="lg" /></div>;
  }
  
  if (user) {
    return (
      <Routes>
        <Route path={PATHS.STUDENT} element={<ProtectedRoute allowedRoles={[ROLES.STUDENT]}><DashboardLayout><StudentDashboard /></DashboardLayout></ProtectedRoute>} />
        <Route path={PATHS.LECTURER} element={<ProtectedRoute allowedRoles={[ROLES.LECTURER]}><DashboardLayout><LecturerDashboard /></DashboardLayout></ProtectedRoute>} />
        <Route path={PATHS.PARENT} element={<ProtectedRoute allowedRoles={[ROLES.PARENT]}><DashboardLayout><ParentDashboard /></DashboardLayout></ProtectedRoute>} />
        <Route path={PATHS.PRINCIPAL} element={<ProtectedRoute allowedRoles={[ROLES.PRINCIPAL]}><DashboardLayout><PrincipalDashboard /></DashboardLayout></ProtectedRoute>} />
        
        {/* Updated Admin Routes */}
        <Route path={PATHS.ADMIN} element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]}><AdminRouteHandler /></ProtectedRoute>} />
        <Route path={PATHS.ADMIN_SETUP} element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]}><AdminSetupPage /></ProtectedRoute>} />

        <Route path="*" element={<Navigate to={ROLE_DASHBOARD_PATHS[user.role]} replace />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path={PATHS.LANDING} element={<LandingPage />} />
      <Route path="/login/:role" element={<LoginPage />} />
      <Route path={PATHS.PRIVACY} element={<PrivacyPolicy />} />
      <Route path={PATHS.TERMS} element={<TermsOfService />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <SystemStatusProvider>
      <SocketProvider>
        <AuthProvider>
          <HashRouter>
            <AppRoutes />
          </HashRouter>
        </AuthProvider>
      </SocketProvider>
    </SystemStatusProvider>
  );
};

export default App;
