import React from 'react';
import { Navigate } from 'react-router-dom';
import DashboardLayout from './DashboardLayout';
import AdminDashboard from '../../pages/admin/AdminDashboard';
import { PATHS } from '../../constants';

const AdminRouteHandler: React.FC = () => {
    // This check assumes we are already inside a ProtectedRoute for Admins.
    const isAdminConfigured = localStorage.getItem('educantpro_admin_configured') === 'true';

    if (!isAdminConfigured) {
        return <Navigate to={PATHS.ADMIN_SETUP} replace />;
    }

    return (
        <DashboardLayout>
            <AdminDashboard />
        </DashboardLayout>
    );
};

export default AdminRouteHandler;
