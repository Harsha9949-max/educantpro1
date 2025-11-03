import React, { ReactNode } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useSystemStatus } from '../../hooks/useSystemStatus';

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const { isMaintenanceMode } = useSystemStatus();

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
                <span className="font-bold text-xl text-primary-600">EDUCANTPRO</span>
                <span className="ml-4 text-sm font-medium text-gray-500 border-l pl-4 border-gray-300">
                    {user?.role.charAt(0).toUpperCase() + user!.role.slice(1)} Panel
                </span>
            </div>
            <div className="flex items-center">
                <span className="mr-4">Welcome, <span className="font-semibold">{user?.name}</span></span>
                <button
                    onClick={logout}
                    className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg text-sm"
                >
                    Logout
                </button>
            </div>
          </div>
        </div>
      </header>
      
      {isMaintenanceMode && user?.role !== 'admin' && (
        <div className="bg-yellow-400 text-yellow-900 text-center p-2 font-semibold">
          The system is currently in maintenance mode. Some features may be limited.
        </div>
      )}

      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;