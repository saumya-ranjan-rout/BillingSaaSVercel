import React, { useState } from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';

interface TenantFormProps {
  onSubmit: (data: any) => void;
}

export const TenantForm: React.FC<TenantFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    tenantName: '',
    adminEmail: '',
    contactNumber: '',
    address: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        maxWidth: 500,
        mx: 'auto',
      }}
    >
      <Typography variant="h6" gutterBottom>
        Tenant Details
      </Typography>

      <TextField
        label="Tenant Name"
        name="tenantName"
        value={formData.tenantName}
        onChange={handleChange}
        required
      />
      <TextField
        label="Admin Email"
        name="adminEmail"
        type="email"
        value={formData.adminEmail}
        onChange={handleChange}
        required
      />
      <TextField
        label="Contact Number"
        name="contactNumber"
        value={formData.contactNumber}
        onChange={handleChange}
      />
      <TextField
        label="Address"
        name="address"
        value={formData.address}
        onChange={handleChange}
        multiline
        rows={3}
      />

      <Button
        type="submit"
        variant="contained"
        color="primary"
        sx={{ mt: 2 }}
      >
        Continue
      </Button>
    </Box>
  );
};
