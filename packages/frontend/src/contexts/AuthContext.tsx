import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '../types/user';
import { authService } from '../services/authService';

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;  // add this
  loading: boolean;
  login: (email: string, password: string, tenantId: string) => Promise<void>;
  logout: () => void;
  register: (userData: any) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on app load
    const token = localStorage.getItem('authToken');
    if (token) {
      authService
        .getCurrentUser()
        .then((userData) => {
          setUser(userData);
        })
        .catch(() => {
          localStorage.removeItem('authToken');
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string, tenantId: string) => {
    try {
      const response = await authService.login(email, password, tenantId);
      setUser(response.user);
      localStorage.setItem('authToken', response.token);
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('authToken');
  };

  const register = async (userData: any) => {
    try {
      const response = await authService.register(userData);
      setUser(response.user);
      localStorage.setItem('authToken', response.token);
    } catch (error) {
      throw error;
    }
  };

  return (
<AuthContext.Provider value={{ user, setUser, loading, login, logout, register }}>
  {!loading && children}
</AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
