export interface Professional {
  id?: string;
  userId?: string;
  email?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  professionalType: string;
  firmName?: string;
  professionalLicenseNumber?: string;
  phone?: string;
  address?: string;
  isActive: boolean;
  tenants?: string[];
  permissions?: {
    canFileGST: boolean;
    canViewAllInvoices: boolean;
    canManageVendors: boolean;
    canApproveInvoices: boolean;
    canAccessReports: boolean;
    canManageUsers: boolean;
  };
}
