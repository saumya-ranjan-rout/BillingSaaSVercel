import React, { createContext, useContext, useEffect, useState } from 'react';
import { Tenant } from '../types';
import { tenantService } from '../services/tenantService';
import { useAuth } from './AuthContext';

interface TenantContextType {
  tenant: Tenant | null;
  loading: boolean;
  updateTenant: (data: Partial<Tenant>) => Promise<void>;
}

export const TenantContext = createContext<TenantContextType | undefined>(undefined);


export const TenantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadTenant();
    } else {
      setLoading(false);
    }
  }, [user]);

  const loadTenant = async () => {
    try {
      const tenantData = await tenantService.getCurrentTenant();
      setTenant(tenantData);
    } catch (error) {
      console.error('Failed to load tenant:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateTenant = async (data: Partial<Tenant>) => {
    try {
      const updatedTenant = await tenantService.updateTenant(data);
      setTenant(updatedTenant);
    } catch (error) {
      throw error;
    }
  };

  return (
    <TenantContext.Provider value={{ tenant, loading, updateTenant }}>
      {children}
    </TenantContext.Provider>
  );
};

export const useTenant = () => {
  const context = useContext(TenantContext);
  if (context === undefined) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
};
