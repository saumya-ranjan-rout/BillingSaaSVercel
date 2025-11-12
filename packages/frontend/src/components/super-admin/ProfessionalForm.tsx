import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  Box,
  MenuItem,
  Switch,
  FormControlLabel,
} from '@mui/material';
import { useState, useEffect } from 'react';
import { Professional } from '../../types/Professional';
interface ProfessionalFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Professional) => void;
  professional?: Professional | null;
}

export const ProfessionalForm: React.FC<ProfessionalFormProps> = ({
  open,
  onClose,
  onSubmit,
  professional,
}) => {
  const [form, setForm] = useState<Professional>({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    professionalType: 'chartered_accountant',
    firmName: '',
    professionalLicenseNumber: '',
    address: '',
    phone: '',
    isActive: true,
    tenants: [],
    permissions: {
      canFileGST: false,
      canViewAllInvoices: false,
      canManageVendors: false,
      canApproveInvoices: false,
      canAccessReports: false,
      canManageUsers: false,
    },
  });

  useEffect(() => {
    if (professional) setForm(professional);
    else
      setForm({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        professionalType: 'chartered_accountant',
        firmName: '',
        professionalLicenseNumber: '',
        address: '',
        phone: '',
        isActive: true,
        tenants: [],
        permissions: {
          canFileGST: false,
          canViewAllInvoices: false,
          canManageVendors: false,
          canApproveInvoices: false,
          canAccessReports: false,
          canManageUsers: false,
        },
      });
  }, [professional]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (!form.email || !form.firstName || !form.lastName) {
      alert('Email, First Name, and Last Name are required');
      return;
    }
    onSubmit(form);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        {professional ? 'Edit Professional' : 'Add Professional'}
      </DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" gap={2} mt={1}>
          <TextField
            label="Email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            fullWidth
          />
          {!professional && (
            <TextField
              label="Password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              required
              fullWidth
            />
          )}
          <TextField
            label="First Name"
            name="firstName"
            value={form.firstName}
            onChange={handleChange}
            required
            fullWidth
          />
          <TextField
            label="Last Name"
            name="lastName"
            value={form.lastName}
            onChange={handleChange}
            required
            fullWidth
          />
  <TextField
  select
  label="Professional Type"
  name="professionalType"
  value={form.professionalType}
  onChange={handleChange}
  fullWidth
>
  <MenuItem value="ca">Chartered Accountant</MenuItem>
  <MenuItem value="accountant">Accountant</MenuItem>
  <MenuItem value="consultant">Tax Consultant</MenuItem>
  <MenuItem value="other">Other</MenuItem>
</TextField>
          <TextField
            label="Firm Name"
            name="firmName"
            value={form.firmName || ''}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="License Number"
            name="professionalLicenseNumber"
            value={form.professionalLicenseNumber || ''}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Phone"
            name="phone"
            value={form.phone || ''}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Address"
            name="address"
            value={form.address || ''}
            onChange={handleChange}
            fullWidth
          />
          <FormControlLabel
            control={
              <Switch
                checked={form.isActive}
                onChange={(e) =>
                  setForm({ ...form, isActive: e.target.checked })
                }
              />
            }
            label="Active"
          />
          <Button variant="contained" onClick={handleSubmit}>
            {professional ? 'Update Professional' : 'Add Professional'}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};
