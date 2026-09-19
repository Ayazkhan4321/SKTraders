import React, { createContext, useContext, useState, useEffect } from 'react';
import { AdminUser, loginAdmin, logoutAdmin, checkIsAuthenticated } from '../services/adminAuth';

interface AdminAuthContextType {
  isAuthenticated: boolean;
  adminUser: AdminUser | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function verify() {
      setLoading(true);
      const res = await checkIsAuthenticated();
      setIsAuthenticated(res.authenticated);
      setAdminUser(res.user);
      setLoading(false);
    }
    verify();
  }, []);

  const handleLogin = async (email: string, pass: string) => {
    setLoading(true);
    const result = await loginAdmin(email, pass);
    if (result.success && result.user) {
      setIsAuthenticated(true);
      setAdminUser(result.user);
      setLoading(false);
      return { success: true };
    } else {
      setIsAuthenticated(false);
      setAdminUser(null);
      setLoading(false);
      return { success: false, error: result.error || 'Authentication failed' };
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    await logoutAdmin();
    setIsAuthenticated(false);
    setAdminUser(null);
    setLoading(false);
  };

  return (
    <AdminAuthContext.Provider
      value={{
        isAuthenticated,
        adminUser,
        loading,
        login: handleLogin,
        logout: handleLogout,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};
