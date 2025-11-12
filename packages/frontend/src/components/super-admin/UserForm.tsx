// UserForm.tsx
import { Dialog, DialogTitle, DialogContent, TextField, Button, MenuItem, Box } from '@mui/material';
import { useState, useEffect } from 'react';

interface Tenant { id: string; name: string }
interface User {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  status: string;
  tenant?: { id: string; name: string };
  password?: string;
}

interface UserFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: User) => void;
  user?: User | null;
  tenants: Tenant[];
}

export const UserForm: React.FC<UserFormProps> = ({ open, onClose, onSubmit, user, tenants }) => {
  const [form, setForm] = useState<User>({
    firstName: '',
    lastName: '',
    email: '',
    role: 'user',
    status: 'active',
    tenant: undefined,
    password: '',
  });

  useEffect(() => {
    if (user) {
      setForm({
        ...user,
        tenant: user.tenant ? { id: user.tenant.id, name: user.tenant.name } : undefined,
        password: '',
      });
    } else {
      setForm({
        firstName: '',
        lastName: '',
        email: '',
        role: 'user',
        status: 'active',
        tenant: undefined,
        password: '',
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'tenantId') {
      const selectedTenant = tenants.find(t => t.id === value);
      setForm({ ...form, tenant: selectedTenant });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = () => {
    if (!form.firstName || !form.lastName || !form.email || !form.role || !form.status || !form.tenant) {
      alert('Please fill all required fields');
      return;
    }
    onSubmit(form);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{user ? 'Edit User' : 'Add User'}</DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" gap={2} mt={1}>
          <TextField
            label="First Name"
            name="firstName"
            value={form.firstName}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            label="Last Name"
            name="lastName"
            value={form.lastName}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            label="Email"
            name="email"
            value={form.email}
            onChange={handleChange}
            fullWidth
            required
          />
          {!user && (
            <TextField
              label="Password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              fullWidth
              required
            />
          )}
          <TextField
            select
            label="Tenant"
            name="tenantId"
            value={form.tenant?.id || ''}
            onChange={handleChange}
            fullWidth
            required
          >
            {tenants.map(t => (
              <MenuItem key={t.id} value={t.id}>
                {t.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label="Status"
            name="status"
            value={form.status}
            onChange={handleChange}
            fullWidth
          >
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="suspended">Suspended</MenuItem>
          </TextField>
          <TextField
            select
            label="Role"
            name="role"
            value={form.role}
            onChange={handleChange}
            fullWidth
          >
            <MenuItem value="user">User</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
          </TextField>

          <Button variant="contained" onClick={handleSubmit}>
            {user ? 'Update' : 'Add'}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};
