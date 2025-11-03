
import React, { createContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { User, Role } from '../types';
import { authService } from '../services/authService';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (role: Role, username: string, password?: string, connectionCode?: string) => Promise<boolean>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('educantpro_user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      localStorage.removeItem('educantpro_user');
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (role: Role, username: string, password?: string, connectionCode?: string): Promise<boolean> => {
    setLoading(true);
    const loggedInUser = await authService.login(role, username, password, connectionCode);
    if (loggedInUser) {
      setUser(loggedInUser);
      localStorage.setItem('educantpro_user', JSON.stringify(loggedInUser));
      setLoading(false);
      return true;
    }
    setLoading(false);
    return false;
  }, []);

  const logout = useCallback(async () => {
    setLoading(true);
    await authService.logout();
    setUser(null);
    localStorage.removeItem('educantpro_user');
    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
