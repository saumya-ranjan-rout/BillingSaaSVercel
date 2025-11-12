'use client';
import dynamic from 'next/dynamic';
import React, { useState } from 'react';
import {
  Box,
  Tabs,
  Tab,
  Typography,
  Snackbar,
  Alert,
  Paper,
  useTheme,
} from '@mui/material';

// Lazy load components
const SuperAdminDashboard = dynamic(
  () => import('../components/super-admin/Dashboard').then((m) => m.SuperAdminDashboard),
  { ssr: false }
);
const UsersDashboard = dynamic(
  () => import('../components/super-admin/UsersDashboard').then((m) => m.UsersDashboard),
  { ssr: false }
);
const TenantsDashboard = dynamic(
  () => import('../components/super-admin/TenantsDashboard').then((m) => m.TenantsDashboard),
  { ssr: false }
);
const ProfessionalsDashboard = dynamic(
  () =>
    import('../components/super-admin/ProfessionalsDashboard').then(
      (m) => m.ProfessionalsDashboard
    ),
  { ssr: false }
);
const AuditLogsDashboard = dynamic(
  () => import('../components/super-admin/AuditLogsDashboard').then((m) => m.AuditLogsDashboard),
  { ssr: false }
);
const SubscriptionDashboard = dynamic(
  () => import('../components/super-admin/SubscriptionDashboard').then((m) => m.SubscriptionDashboard),
  { ssr: false }
)

import DashboardLayout from "../components/layout/DashboardLayout/superadmin";
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = ({ children, value, index }: TabPanelProps) => (
  <div hidden={value !== index}>
    {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
  </div>
);

const SuperAdminPage: React.FC = () => {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  return (
    <DashboardLayout>
    <Box
      sx={{
        p: 3,
        backgroundColor: theme.palette.grey[50],
        minHeight: '100vh',
      }}
    >
      {/* Header */}
      <Paper
        elevation={0}
        sx={{
          mb: 3,
          p: 2.5,
          borderRadius: 2,
          backgroundColor: '#fff',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        }}
      >
        <Typography variant="h5" fontWeight={600} color="primary.main">
          Super Admin Portal
        </Typography>
      </Paper>

      {/* Tabs Section */}
      <Paper
        elevation={0}
        sx={{
          mb: 2,
          p: 1,
          borderRadius: 2,
          backgroundColor: '#fff',
          boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
        }}
      >
        <Tabs
          value={tabValue}
          onChange={(_, newVal) => setTabValue(newVal)}
          variant="scrollable"
          scrollButtons="auto"
          textColor="primary"
          indicatorColor="primary"
        >
          <Tab label="Dashboard" sx={{ textTransform: 'none', fontWeight: 500 }} />
          <Tab label="Users" sx={{ textTransform: 'none', fontWeight: 500 }} />
          <Tab label="Tenants" sx={{ textTransform: 'none', fontWeight: 500 }} />
          <Tab label="Professionals" sx={{ textTransform: 'none', fontWeight: 500 }} />
          <Tab label="Audit Logs" sx={{ textTransform: 'none', fontWeight: 500 }} />
          <Tab label="Subscriptions" sx={{ textTransform: 'none', fontWeight: 500 }} />
        </Tabs>
      </Paper>

      {/* Tab Content */}
      <Box>
        <TabPanel value={tabValue} index={0}>
          <SuperAdminDashboard />
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          <UsersDashboard />
        </TabPanel>
        <TabPanel value={tabValue} index={2}>
          <TenantsDashboard />
        </TabPanel>
        <TabPanel value={tabValue} index={3}>
          <ProfessionalsDashboard />
        </TabPanel>
        <TabPanel value={tabValue} index={4}>
          <AuditLogsDashboard />
        </TabPanel>
        <TabPanel value={tabValue} index={5}>
          <SubscriptionDashboard />
        </TabPanel>
      </Box>

      {/* Snackbar Notification */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
    </DashboardLayout>
  );
};

export default SuperAdminPage;
