'use client';
import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useApi } from '../../hooks/useApi';
import { TenantForm } from './TenantForm';
import { toast } from 'sonner';
import { DataTable } from './DataTable';

interface Tenant {
  id: string;
  name: string;
  businessName?: string;
  subdomain: string;
  slug?: string;
  isActive: boolean;
}

export const TenantsDashboard: React.FC = () => {
  const { get, post, put, patch } = useApi<any>();
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tenantModalOpen, setTenantModalOpen] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);

  const fetchTenants = async () => {
    setLoading(true);
    try {
      const res = await get('/api/super-admin/tenants');
      setTenants(res.data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch tenants');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTenants(); }, []);

  const handleAdd = () => {
    setSelectedTenant(null);
    setTenantModalOpen(true);
  };

  const handleEdit = (tenant: Tenant) => {
    setSelectedTenant(tenant);
    setTenantModalOpen(true);
  };

  const handleStatusChange = async (tenant: Tenant) => {
    try {
      await patch(`/api/super-admin/tenants/${tenant.id}/status`, {
        isActive: !tenant.isActive,
      });
      fetchTenants();
    } catch (err: any) {
      alert(err.message || 'Failed to change status');
    }
  };

  const handleSubmit = async (data: any) => {
    try {
      if (selectedTenant) {
        await put(`/api/super-admin/tenants/${selectedTenant.id}`, data);
        toast.success('Tenant updated successfully');
      } else {
        await post('/api/super-admin/tenants', data);
        toast.success('Tenant created successfully');
      }
      setTenantModalOpen(false);
      fetchTenants();
    } catch (err: any) {
      alert(err.message || 'Failed to save tenant');
    }
  };

  return (
    <Box component={Paper} sx={{ p: 3, borderRadius: 2 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h6">Tenants Management</Typography>
        <Button variant="contained" onClick={handleAdd}>Add Tenant</Button>
      </Box>

      {loading && (
        <Box textAlign="center" py={5}>
          <CircularProgress />
          <Typography mt={2}>Loading tenants...</Typography>
        </Box>
      )}

      {error && <Alert severity="error">{error}</Alert>}

     {/* Data Table */}
      {!loading && tenants.length > 0 && (
        <DataTable
          title="Tenants"
          resource="tenants"
          data={tenants}
          columns={[
            { id: 'name', label: 'Tenant Name' },
            { id: 'businessName', label: 'Business Name' },
            { id: 'subdomain', label: 'Subdomain' },
            { id: 'isActive', label: 'Status', format: (row) => (row.isActive ? 'Active' : 'Inactive') },
            { id: 'createdAt', label: 'Created At', format: (row) => row.createdAt ? new Date(row.createdAt).toLocaleDateString() : '-' },
          ]}
          onEdit={(id) => {
            const selected = tenants.find((t) => t.id === id);
            if (selected) handleEdit(selected);
          }}
          onStatusChange={(id) => {
            const selected = tenants.find((t) => t.id === id);
            if (selected) handleStatusChange(selected);
          }}
        />
      )}

      {!loading && tenants.length === 0 && (
        <Typography>No tenants found.</Typography>
      )}

      <TenantForm
        open={tenantModalOpen}
        onClose={() => setTenantModalOpen(false)}
        onSubmit={handleSubmit}
        tenant={selectedTenant}
      />
    </Box>
  );
};



// 
      // {!loading && tenants.length > 0 && (
      //   <Box>
      //     {tenants.map((tenant) => (
      //       <Box
      //         key={tenant.id}
      //         display="flex"
      //         justifyContent="space-between"
      //         alignItems="center"
      //         mb={1}
      //         p={1}
      //         border={1}
      //         borderRadius={1}
      //       >
      //         <Box>
      //           <strong>{tenant.name}</strong> | {tenant.businessName || '-'} | {tenant.subdomain} | {tenant.status.toUpperCase()}
      //           {/* {tenant.trialEndsAt && (
      //             <> | Trial ends: {new Date(tenant.trialEndsAt).toLocaleDateString()}</>
      //           )} */}
      //         </Box>
      //         <Box>
      //           <Button size="small" onClick={() => handleEdit(tenant)}>Edit</Button>
      //           <Button
      //             size="small"
      //             onClick={() => handleStatusChange(tenant)}
      //           >
      //             {tenant.isActive ? 'Deactivate' : 'Activate'}
      //           </Button>
      //         </Box>
      //       </Box>
      //     ))}
      //   </Box>
      // )}