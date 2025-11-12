'use client';
import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Paper, CircularProgress, Alert } from '@mui/material';
import { useApi } from '../../hooks/useApi';
import { DataTable } from './DataTable';

interface Subscription {
  id: string;
  tenant: { id: string; name: string };
  user: { id: string; firstName: string; lastName: string };
  status: string;
  startDate: string;
  endDate: string;
}

export const SubscriptionDashboard: React.FC = () => {
  const { get, patch } = useApi<any>();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await get('/api/super-admin/subscriptions');
      console.log('Subscriptions:', result.data);
      setSubscriptions(result.data || []);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleStatusChange = async (subscription: Subscription) => {
    try {
      const newStatus = subscription.status === 'active' ? 'inactive' : 'active'; // Toggle status
      await patch(`/api/super-admin/subscriptions/${subscription.id}/status`, { status: newStatus });
      fetchData(); // Re-fetch subscriptions after status change
    } catch (err: any) {
      alert(err.message || 'Failed to change status');
    }
  };

  return (
    <Box component={Paper} sx={{ p: 3, borderRadius: 2 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h6">Subscription Management</Typography>
        <Button variant="contained" onClick={fetchData}>Refresh</Button>
      </Box>

      {loading && <Box textAlign="center" py={5}><CircularProgress /><Typography mt={2}>Loading...</Typography></Box>}
      {error && <Alert severity="error">{error}</Alert>}

 {!loading && subscriptions.length > 0 && (
  <DataTable
    title="Subscriptions"
    resource="subscriptions"
    data={subscriptions}
    columns={[
      { id: 'tenant_businessName', label: 'Tenant', format: (row) => row.tenant_businessName || '-' },  // Updated column name
      { id: 'userfirstname', label: 'User', format: (row) => `${row.userfirstname} ${row.userlastname}` },  // Updated column names
      { id: 'subscription_status', label: 'Status' },  // Updated column name
      { id: 'subscription_startDate', label: 'Start Date', format: (row) => new Date(row.subscription_startDate).toLocaleDateString() },  // Updated column name
      { id: 'subscription_endDate', label: 'End Date', format: (row) => new Date(row.subscription_endDate).toLocaleDateString() },  // Updated column name
      { id: 'planname', label: 'Plan', format: (row) => row.planname },  // Plan name column
      { id: 'plantype', label: 'Plan Type', format: (row) => row.plantype },  // Plan type column
      { id: 'planprice', label: 'Price', format: (row) => row.planprice },  // Plan price column
      { id: 'planbillingcycle', label: 'Billing Cycle', format: (row) => row.planbillingcycle },  // Plan billing cycle column
    ]}
//     onEdit={(id) => {
//       // Add your edit logic here, similar to users
//       alert(`Edit subscription with ID: ${id}`);
//     }}
// onStatusChange={(id) => {
//   const selected = subscriptions.find((s) => s.id === id); // Corrected property name
//   if (selected) handleStatusChange(selected);
// }}

  />
)}

{!loading && subscriptions.length === 0 && <Typography>No subscriptions found.</Typography>}

    </Box>
  );
};
