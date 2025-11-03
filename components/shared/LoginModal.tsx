import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Role } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import Modal from '../ui/Modal';
import Spinner from '../ui/Spinner';
import { ROLE_DASHBOARD_PATHS } from '../../constants';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  role: Role;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, role }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    // For admin, default credentials if empty
    const finalUsername = role === Role.Admin && username === '' ? 'admin' : username;
    const finalPassword = role === Role.Admin && password === '' ? 'password123' : password;

    const success = await login(role, finalUsername, finalPassword);

    if (success) {
      navigate(ROLE_DASHBOARD_PATHS[role]);
      onClose();
    } else {
      setError('Login failed. Please check your credentials.');
    }
    setIsLoading(false);
  };

  const roleName = role.charAt(0).toUpperCase() + role.slice(1);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`${roleName} Login`}>
      <form onSubmit={handleLogin} className="space-y-4">
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5"
            placeholder={role === Role.Admin ? 'admin' : `${roleName.toLowerCase()}@example.com`}
            required={role !== Role.Admin}
          />
        </div>
        {role === Role.Admin && (
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
        )}
        <p className="text-xs text-gray-500">
          For demo purposes, non-admin roles do not require credentials.
        </p>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center disabled:opacity-50"
        >
          {isLoading ? <Spinner size="sm" /> : 'Login'}
        </button>
      </form>
    </Modal>
  );
};

export default LoginModal;