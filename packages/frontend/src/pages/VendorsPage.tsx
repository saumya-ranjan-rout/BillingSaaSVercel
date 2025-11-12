import React, { useState } from 'react';
import {
  Box,
  Dialog,
  Snackbar,
  Alert,
  Button
} from '@mui/material';
import VendorList from '../components/vendors/VendorList';
import VendorForm from '../components/vendors/VendorForm';
import { Vendor } from '../types';
import { vendorService } from '../services/vendorService';

const VendorsPage: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingVendor, setEditingVendor] = useState<Vendor | undefined>();
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  const handleCreateVendor = () => {
    setEditingVendor(undefined);
    setIsFormOpen(true);
  };

  const handleEditVendor = (vendor: Vendor) => {
    setEditingVendor(vendor);
    setIsFormOpen(true);
  };

  const handleSubmitVendor = async (vendorData: any) => {
    try {
      if (editingVendor) {
        await vendorService.updateVendor(editingVendor.id, vendorData);
        showSnackbar('Vendor updated successfully', 'success');
      } else {
        await vendorService.createVendor(vendorData);
        showSnackbar('Vendor created successfully', 'success');
      }
      setIsFormOpen(false);
    } catch (error) {
      showSnackbar('Error saving vendor', 'error');
    }
  };

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <Box>
      <Box display="flex" justifyContent="flex-end" mb={2}>
        <Button variant="contained" color="primary" onClick={handleCreateVendor}>
          Add Vendor
        </Button>
      </Box>

      {/* ✅ VendorList handles fetching, pagination, and deletion */}
      <VendorList onEditVendor={handleEditVendor} />

      <Dialog
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <VendorForm
          vendor={editingVendor}
          onSuccess={() => setIsFormOpen(false)}
          onCancel={() => setIsFormOpen(false)}
        />
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default VendorsPage;
