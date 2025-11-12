import React, { useState } from 'react';
import {
  Button,
  Menu,
  MenuItem,
  Chip,
  Box,
  Typography
} from '@mui/material';
import { Business, ArrowDropDown } from '@mui/icons-material';

interface ProfessionalTenantSwitcherProps {
  tenants: any[];
  selectedTenant: string | 'all';
  onTenantChange: (tenantId: string | 'all') => void;
}

export const ProfessionalTenantSwitcher: React.FC<ProfessionalTenantSwitcherProps> = ({
  tenants,
  selectedTenant,
  onTenantChange
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleTenantSelect = (tenantId: string | 'all') => {
    onTenantChange(tenantId);
    handleClose();
  };

  const getSelectedTenantName = () => {
    if (selectedTenant === 'all') return 'All Tenants';
    const tenant = tenants.find(t => t.id === selectedTenant);
    return tenant ? tenant.name : 'Select Tenant';
  };

  return (
    <Box>
      <Button
        variant="outlined"
        startIcon={<Business />}
        endIcon={<ArrowDropDown />}
        onClick={handleClick}
        sx={{ minWidth: 200, justifyContent: 'space-between' }}
      >
        <Typography noWrap sx={{ maxWidth: 120 }}>
          {getSelectedTenantName()}
        </Typography>
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{ sx: { maxHeight: 300 } }}
      >
        <MenuItem
          selected={selectedTenant === 'all'}
          onClick={() => handleTenantSelect('all')}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Business />
            <Typography>All Tenants</Typography>
            <Chip label={tenants.length} size="small" />
          </Box>
        </MenuItem>
        {tenants.map((tenant) => (
          <MenuItem
            key={tenant.id}
            selected={selectedTenant === tenant.id}
            onClick={() => handleTenantSelect(tenant.id)}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Business />
              <Typography noWrap sx={{ maxWidth: 160 }}>
                {tenant.name}
              </Typography>
              <Chip
                label={tenant.complianceStatus}
                size="small"
                color={tenant.complianceStatus === 'compliant' ? 'success' : 'error'}
              />
            </Box>
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};
