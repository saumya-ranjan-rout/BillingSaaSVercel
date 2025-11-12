// UsersDashboard.tsx
'use client';
import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Paper, CircularProgress, Alert } from '@mui/material';
import { useApi } from '../../hooks/useApi';
import { UserForm } from './UserForm';
import { DataTable } from './DataTable';
import { toast } from 'sonner';

// Define interfaces
interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  status: string;
  tenant?: { id: string; name: string };
}
interface Tenant { id: string; name: string }

export const UsersDashboard: React.FC = () => {
  const { get, post, put, patch } = useApi<any>();
  const [users, setUsers] = useState<User[]>([]);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Fetch users and tenants
  const fetchData = async () => {
    setLoading(true);
    try {
      const usersResult = await get('/api/super-admin/users');
      const tenantsResult = await get('/api/super-admin/tenants');
      setUsers(usersResult.data || []);
      setTenants(tenantsResult.data || []);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  // Add / Edit handlers
  const handleAdd = () => { setSelectedUser(null); setUserModalOpen(true); };
  const handleEdit = (user: User) => { setSelectedUser(user); setUserModalOpen(true); };
  const handleView = (user: User) => { alert(JSON.stringify(user, null, 2)); };

  const handleSubmit = async (data: any) => {
    console.log(data);
    try {
      if (selectedUser) {
        await put(`/api/super-admin/users/${selectedUser.id}`, data);
      } else {
        await post('/api/super-admin/users', data);
      }
      setUserModalOpen(false);
      fetchData();
    } catch (err: any) {
      alert(err.message || 'Failed to save user');
    }
  };

  const handleStatusChange = async (user: User) => {
    try {
      await patch(`/api/super-admin/users/${user.id}/status`, { isActive: user.status !== 'active' });
      fetchData();
    } catch (err: any) {
      alert(err.message || 'Failed to change status');
    }
  };

  return (
    <Box component={Paper} sx={{ p: 3, borderRadius: 2 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h6">Users Management</Typography>
        <Button variant="contained" onClick={handleAdd}>Add User</Button>
      </Box>

      {loading && <Box textAlign="center" py={5}><CircularProgress /><Typography mt={2}>Loading...</Typography></Box>}
      {error && <Alert severity="error">{error}</Alert>}



      
      {!loading && users.length > 0 && (
        <DataTable
          title="Users"
          resource="users"
          data={users}
          columns={[
            { id: 'firstName', label: 'First Name' },
            { id: 'lastName', label: 'Last Name' },
            { id: 'email', label: 'Email' },
            { id: 'role', label: 'Role' },
            {
              id: 'tenant',
              label: 'Tenant',
              format: (row) => row.tenant?.name || '-',
            },
            {
              id: 'status',
              label: 'Status',
              format: (row) =>
                row.status === 'active' ? 'Active' : 'Inactive',
            },
            {
              id: 'createdAt',
              label: 'Created At',
              format: (row) =>
                row.createdAt ? new Date(row.createdAt).toLocaleDateString() : '-',
            },
          ]}
          onEdit={(id) => {
            const selected = users.find((u) => u.id === id);
            if (selected) handleEdit(selected);
          }}
          onStatusChange={(id) => {
            const selected = users.find((u) => u.id === id);
            if (selected) handleStatusChange(selected);
          }}
        />
      )}

      {!loading && users.length === 0 && <Typography>No users found.</Typography>}



      <UserForm
        open={userModalOpen}
        onClose={() => setUserModalOpen(false)}
        onSubmit={handleSubmit}
        user={selectedUser}
        tenants={tenants}
      />
    </Box>
  );
};


      {/* {!loading && !error && users.length > 0 && (
        <Box>
          {users.map(user => (
            <Box key={user.id} display="flex" justifyContent="space-between" alignItems="center" mb={1} p={1} border={1} borderRadius={1}>
              <Box>
                <strong>{user.firstName} {user.lastName}</strong> | {user.email} | {user.role} | {user.status} | {user.tenant?.name || '-'}
              </Box>
              <Box>
                <Button size="small" onClick={() => handleView(user)}>View</Button>
                <Button size="small" onClick={() => handleEdit(user)}>Edit</Button>
                <Button size="small" onClick={() => handleStatusChange(user)}>
                  {user.status === 'active' ? 'Deactivate' : 'Activate'}
                </Button>
              </Box>
            </Box>
          ))}
        </Box>
      )} */}