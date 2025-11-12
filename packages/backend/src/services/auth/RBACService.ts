import { UserRole } from '../../entities/User';

export interface Permission {
  resource: string;
  action: string;
}

export class RBACService {
  private rolePermissions: Map<UserRole, Permission[]> = new Map();

  constructor() {
    this.initializePermissions();
  }

  private initializePermissions(): void {
    // Admin has all permissions
    this.rolePermissions.set(UserRole.ADMIN, [
      { resource: '*', action: '*' },
    ]);

    // Finance role permissions
    this.rolePermissions.set(UserRole.FINANCE, [
      { resource: 'invoices', action: '*' },
      { resource: 'customers', action: 'read' },
      { resource: 'reports', action: '*' },
      { resource: 'products', action: 'read' },
    ]);

    // Sales role permissions
    this.rolePermissions.set(UserRole.SALES, [
      { resource: 'customers', action: '*' },
      { resource: 'invoices', action: 'create' },
      { resource: 'products', action: 'read' },
      { resource: 'quotes', action: '*' },
    ]);

    // Support role permissions
    this.rolePermissions.set(UserRole.SUPPORT, [
      { resource: 'customers', action: 'read' },
      { resource: 'invoices', action: 'read' },
    ]);

    // Member role permissions (basic access)
    this.rolePermissions.set(UserRole.MEMBER, [
      { resource: 'profile', action: '*' },
      { resource: 'invoices', action: 'read' },
    ]);
  }

  hasPermission(role: UserRole, resource: string, action: string): boolean {
    const permissions = this.rolePermissions.get(role) || [];
    
    // Check for wildcard permission
    if (permissions.some(p => p.resource === '*' && p.action === '*')) {
      return true;
    }

    // Check for specific permission
    return permissions.some(
      p => 
        (p.resource === resource || p.resource === '*') && 
        (p.action === action || p.action === '*')
    );
  }

  getPermissionsForRole(role: UserRole): Permission[] {
    return this.rolePermissions.get(role) || [];
  }
}
