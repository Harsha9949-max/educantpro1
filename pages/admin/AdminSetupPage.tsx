import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PATHS } from '../../constants';
import Card from '../../components/ui/Card';
import Spinner from '../../components/ui/Spinner';

const AdminSetupPage: React.FC = () => {
    const navigate = useNavigate();
    const isAdminConfigured = localStorage.getItem('educantpro_admin_configured') === 'true';
    
    const [config, setConfig] = useState({
        instituteName: '',
        motto: '',
        primaryColor: '#3b82f6', // Default to primary-500
    });
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isAdminConfigured) {
            navigate(PATHS.ADMIN, { replace: true });
        }
    }, [isAdminConfigured, navigate]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setConfig(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate saving config
        setTimeout(() => {
            console.log('Configuration saved:', config);
            localStorage.setItem('educantpro_admin_configured', 'true');
            localStorage.setItem('educantpro_config', JSON.stringify(config));
            setIsLoading(false);
            navigate(PATHS.ADMIN, { replace: true });
        }, 1500);
    };
    
    if (isAdminConfigured) {
        return <div className="flex items-center justify-center h-screen"><Spinner size="lg" /></div>;
    }

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="w-full max-w-2xl">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-primary-600">EDUCANTPRO Initial Setup</h1>
                    <p className="text-gray-600">Welcome, Admin! Let's get your institute configured.</p>
                </div>
                <Card>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Institute Name</label>
                            <input
                                type="text"
                                name="instituteName"
                                value={config.instituteName}
                                onChange={handleInputChange}
                                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                                required
                                placeholder="e.g., Vanguard Academy of Innovation"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Institute Motto or Tagline</label>
                            <input
                                type="text"
                                name="motto"
                                value={config.motto}
                                onChange={handleInputChange}
                                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                                placeholder="e.g., Igniting Minds, Shaping Futures"
                            />
                        </div>
                        <div className="flex items-center space-x-4">
                            <label className="block text-sm font-medium text-gray-700">Primary Brand Color</label>
                            <input
                                type="color"
                                name="primaryColor"
                                value={config.primaryColor}
                                onChange={handleInputChange}
                                className="h-10 w-10 p-1 border border-gray-300 rounded-md cursor-pointer"
                            />
                            <span style={{ color: config.primaryColor }} className="font-semibold">{config.primaryColor.toUpperCase()}</span>
                        </div>
                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                            >
                                {isLoading ? <Spinner size="sm" /> : 'Save Configuration and Continue'}
                            </button>
                        </div>
                    </form>
                </Card>
            </div>
        </div>
    );
};

export default AdminSetupPage;
