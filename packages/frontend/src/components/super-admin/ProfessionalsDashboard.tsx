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
import { ProfessionalForm } from './ProfessionalForm';
import { toast } from 'sonner'; 
import { Professional } from '../../types/Professional';
import { DataTable } from './DataTable';

export const ProfessionalsDashboard: React.FC = () => {
  const { get, post, put, patch } = useApi<any>();
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [professionalModalOpen, setProfessionalModalOpen] = useState(false);
  const [selectedProfessional, setSelectedProfessional] = useState<Professional | null>(null);

  const fetchProfessionals = async () => {
    setLoading(true);
    try {
      const res = await get('/api/super-admin/professionals');
      setProfessionals(res.data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch professionals');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfessionals();
  }, []);

  const handleAdd = () => {
    setSelectedProfessional(null);
    setProfessionalModalOpen(true);
  };

const handleEdit = (professional: any) => {
  const mergedProfessional = {
    ...professional,
    email: professional.user?.email || '',
    firstName: professional.user?.firstName || '',
    lastName: professional.user?.lastName || '',
  };
  setSelectedProfessional(mergedProfessional);
  setProfessionalModalOpen(true);
};

const handleStatusChange = async (professional: Professional) => {
  try {
    const updatedIsActive = !professional.isActive;

    // Send the status and userId as well
    await patch(`/api/super-admin/professionals/${professional.id}/${professional.userId}/status`, {
      isActive: updatedIsActive,
    });

    toast.success('Status updated successfully');
    fetchProfessionals();
  } catch (err: any) {
    alert(err.message || 'Failed to change status');
  }
};

  const handleSubmit = async (data: any) => {
    try {
      if (selectedProfessional) {
        await put(`/api/super-admin/professionals/${selectedProfessional.id}`, data);
         toast.success('Professional user updated successfully'); 
      } else {
        await post('/api/super-admin/professionals', data);
         toast.success('Professional user created successfully');
      }
      setProfessionalModalOpen(false);
      fetchProfessionals();
    } catch (err: any) {
      alert(err.message || 'Failed to save professional');
    }
  };

  return (
    <Box component={Paper} sx={{ p: 3, borderRadius: 2 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h6">Professionals Management</Typography>
        <Button variant="contained" onClick={handleAdd}>Add Professional</Button>
      </Box>

      {loading && (
        <Box textAlign="center" py={5}>
          <CircularProgress />
          <Typography mt={2}>Loading professionals...</Typography>
        </Box>
      )}

      {error && <Alert severity="error">{error}</Alert>}


{!loading && professionals.length > 0 && (
  <DataTable
    title="Professionals"
    resource="professionals"
    data={professionals}
    columns={[
      { id: 'firstName', label: 'First Name' },
      { id: 'lastName', label: 'Last Name' },
      { id: 'email', label: 'Email' },
      { id: 'firmName', label: 'Firm Name' },
      { id: 'professionalType', label: 'Type' },
      { id: 'isActive', label: 'Status', format: (row) => (row.isActive ? 'Active' : 'Inactive') },
    ]}
    onEdit={(id) => {
      const selected = professionals.find((p) => p.id === id);
      if (selected) handleEdit(selected);
    }}
    onStatusChange={(id) => {
      const selected = professionals.find((p) => p.id === id);
      if (selected) handleStatusChange(selected);
    }}
  />
)}



      <ProfessionalForm
        open={professionalModalOpen}
        onClose={() => setProfessionalModalOpen(false)}
        onSubmit={handleSubmit}
        professional={selectedProfessional}
      />
    </Box>
  );
};


      {/* {!loading && professionals.length > 0 && (
        <Box>
          {professionals.map((professional) => (
            <Box
              key={professional.id}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={1}
              p={1}
              border={1}
              borderRadius={1}
            >
              <Box>
                 <strong>{professional.firstName} {professional.lastName}</strong> | {professional.email} | {professional.firmName || '-'} | {professional.professionalType} | {professional.isActive ? 'Active' : 'Inactive'}
              </Box>
              <Box>
                <Button size="small" onClick={() => handleEdit(professional)}>Edit</Button>
                <Button
                  size="small"
                  onClick={() => handleStatusChange(professional)}
                >
                  {professional.isActive ? 'Deactivate' : 'Activate'}
                </Button>
              </Box>
            </Box>
          ))}
        </Box>
      )} */}