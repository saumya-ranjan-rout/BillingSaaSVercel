'use client';
import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, CircularProgress, Alert } from '@mui/material';
import { useApi } from '../../hooks/useApi';
import { DataTable } from './DataTable';

interface AuditLog {
  id: string;
  performedById?: string;
  action: string;
  timestamp: string;
  ipAddress?: string;
}

export const AuditLogsDashboard: React.FC = () => {
  const { get } = useApi<any>();
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAuditLogs = async () => {
    setLoading(true);
    try {
      const res = await get('/api/super-admin/audit-logs');
      setAuditLogs(res.data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch audit logs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuditLogs();
  }, []);

  return (
    <Box component={Paper} sx={{ p: 3, borderRadius: 2 }}>
      <Typography variant="h6" fontWeight={600} mb={3}>
        Audit Logs
      </Typography>

      {loading && (
        <Box textAlign="center" py={5}>
          <CircularProgress />
          <Typography mt={2}>Loading audit logs...</Typography>
        </Box>
      )}

      {error && <Alert severity="error">{error}</Alert>}

      {!loading && auditLogs.length > 0 && (
<DataTable
  title="Audit Logs"
  resource="auditLogs"
  data={auditLogs}
  columns={[
    { id: 'performedByName', label: 'Performed By' },
    { id: 'action', label: 'Action' },
    { id: 'timestamp', label: 'Timestamp' },
    { id: 'ipAddress', label: 'IP Address' },
  ]}
/>

      )}

      {!loading && auditLogs.length === 0 && (
        <Typography>No audit logs found.</Typography>
      )}
    </Box>
  );
};
