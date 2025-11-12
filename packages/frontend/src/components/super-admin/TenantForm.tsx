import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  Box,
  MenuItem,
} from '@mui/material';
import { useState, useEffect } from 'react';

interface Tenant {
  id?: string;
  name: string;
  businessName?: string;
  subdomain: string;
  slug?: string;
  isActive: boolean;
}

interface TenantFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Tenant) => void;
  tenant?: Tenant | null;
}

export const TenantForm: React.FC<TenantFormProps> = ({
  open,
  onClose,
  onSubmit,
  tenant,
}) => {
  const [form, setForm] = useState<Tenant>({
    name: '',
    businessName: '',
    subdomain: '',
    slug: '',
    isActive: true,
  });

  useEffect(() => {
    if (tenant) setForm(tenant);
    else
      setForm({
        name: '',
        businessName: '',
        subdomain: '',
        slug: '',
        isActive: true,
      });
  }, [tenant]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (!form.name || !form.subdomain) {
      alert('Name and Subdomain are required');
      return;
    }
    onSubmit(form);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{tenant ? 'Edit Tenant' : 'Add Tenant'}</DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" gap={2} mt={1}>
          <TextField
            label="Tenant Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            fullWidth
          />
          <TextField
            label="Business Name"
            name="businessName"
            value={form.businessName}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Subdomain"
            name="subdomain"
            value={form.subdomain}
            onChange={handleChange}
            required
            fullWidth
          />
          <TextField
            label="Slug"
            name="slug"
            value={form.slug || ''}
            onChange={handleChange}
            fullWidth
          />

          <Button variant="contained" onClick={handleSubmit}>
            {tenant ? 'Update Tenant' : 'Add Tenant'}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};
