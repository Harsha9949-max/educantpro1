
import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Role } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import Spinner from '../../components/ui/Spinner';
import { ROLE_DASHBOARD_PATHS, PATHS } from '../../constants';

const LoginPage: React.FC = () => {
    const { role } = useParams<{ role: Role }>();
    const navigate = useNavigate();
    const { login } = useAuth();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [connectionCode, setConnectionCode] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    if (!role || !Object.values(Role).includes(role)) {
        return <div className="text-center p-8">Invalid role specified.</div>;
    }

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        const success = await login(role, username, password, connectionCode);

        if (success) {
            navigate(ROLE_DASHBOARD_PATHS[role]);
        } else {
            let errorMessage = 'Login failed. Please check your credentials.';
            if (role === Role.Parent) {
                errorMessage += ' and the connection code.';
            }
            setError(errorMessage);
        }
        setIsLoading(false);
    };

    const roleName = role.charAt(0).toUpperCase() + role.slice(1);
    const usernamePlaceholder = role === Role.Admin ? 'admin' : `e.g., ${role.toLowerCase()}`;
    
    // Suggesting credentials for demo purposes
    const demoCredentials: { [key in Role]?: string } = {
        [Role.Student]: "Username: alice, Password: student123",
        [Role.Lecturer]: "Username: robert, Password: lecturer123",
        [Role.Parent]: "Username: john, Password: parent123, Code: CHILD-ALICE-123",
        [Role.Principal]: "Username: carol, Password: principal123",
        [Role.Admin]: "Username: admin, Password: password123",
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
            <Link to={PATHS.LANDING} className="flex items-center mb-6">
              <span className="self-center text-3xl font-semibold whitespace-nowrap text-primary-600">EDUCANTPRO</span>
            </Link>
            <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
                <h1 className="text-2xl font-bold text-center text-gray-900 mb-6">{roleName} Login</h1>
                <form onSubmit={handleLogin} className="space-y-4">
                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-900">Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5"
                            placeholder={usernamePlaceholder}
                            required
                        />
                    </div>
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-900">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5"
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    {role === Role.Parent && (
                        <div>
                            <label className="block mb-2 text-sm font-medium text-gray-900">Parent Connection Code</label>
                             <input
                                type="text"
                                value={connectionCode}
                                onChange={(e) => setConnectionCode(e.target.value)}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5"
                                placeholder="Enter code to link to your child"
                                required
                            />
                        </div>
                    )}
                    {role !== Role.Admin && (
                        <div className="text-xs text-gray-500 bg-gray-100 p-2 rounded-md">
                            <p className="font-bold">For Demo:</p>
                            <p>{demoCredentials[role]}</p>
                        </div>
                    )}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center disabled:opacity-50"
                    >
                        {isLoading ? <Spinner size="sm" /> : 'Login'}
                    </button>
                     <p className="text-sm text-center text-gray-500">
                        Not a {roleName}? <Link to={PATHS.LANDING} className="font-medium text-primary-600 hover:underline">Return to portals</Link>.
                    </p>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
