import { Request, Response } from 'express';
import { SuperAdminService } from '../services/super-admin/SuperAdminService';
import { AuditAction, AuditResource } from '../entities/AuditLog';

const superAdminService = new SuperAdminService();

export class SuperAdminController {
  static async getDashboard(req: Request, res: Response) {
   // console.log('Super admin dashboard:', req.body);
    try {
      const stats = await superAdminService.getDashboardStats();
      
      // Log this action
      await superAdminService.createAuditLog(
       req.superAdmin?.id || 'unknown',
        AuditAction.LOGIN,
        AuditResource.SYSTEM,
        'dashboard',
        { action: 'viewed dashboard' },
        req.ip,
        req.get('User-Agent')
      );
   //   console.log('Dashboard stats:', stats);
      res.json(stats);
    } catch (error: any) {
  res.status(500).json({ error: error?.message || 'Internal server error' });
}
  }

  static async getUsers(req: Request, res: Response) {
    try {
      const filters = {
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 10,
        search: req.query.search as string,
        startDate: req.query.startDate ? new Date(req.query.startDate as string) : undefined,
        endDate: req.query.endDate ? new Date(req.query.endDate as string) : undefined,
        status: req.query.status as string,
        sortBy: req.query.sortBy as string || 'createdAt',
        sortOrder: req.query.sortOrder as 'ASC' | 'DESC' || 'DESC'
      };
      
      const result = await superAdminService.getUsersWithFilters(filters);
    //  console.log('Fetched users:', result);
      
      // Log this action
      await superAdminService.createAuditLog(
    req.superAdmin?.id || 'unknown',
        AuditAction.LOGIN,
        AuditResource.USER,
        'multiple',
        { action: 'viewed users', filters },
        req.ip,
        req.get('User-Agent')
      );
      
      res.json(result);
    } catch (error: any) {
  res.status(500).json({ error: error?.message || 'Internal server error' });
}
  }

  // Add these inside SuperAdminController
static async createUser(req: Request, res: Response) {
  try {
    const { firstName, lastName, email, role, status, password, tenant } = req.body;
    
    console.log('Creating user:', { firstName, lastName, email, role, status, tenant });
    const tenantId = tenant.id;
    // Ensure user is typed as User, not User[]
    const user = await superAdminService.createUser({ firstName, lastName, email, role, status, password, tenantId });

    await superAdminService.createAuditLog(
      req.superAdmin?.id || 'unknown',
      AuditAction.CREATE,
      AuditResource.USER,
      user.id, // ← now TypeScript knows user has an 'id'
      { action: 'created user under tenant', tenantId },
      req.ip,
      req.get('User-Agent')
    );

    res.status(201).json(user);
  } catch (error: any) {
    res.status(500).json({ error: error?.message || 'Internal server error' });
  }
}


static async updateUser(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { firstName, lastName, email, role, status, tenantId } = req.body;

    const updatedUser = await superAdminService.updateUser(id, { firstName, lastName, email, role, status, tenantId });

    await superAdminService.createAuditLog(
      req.superAdmin?.id || 'unknown',
      AuditAction.UPDATE,
      AuditResource.USER,
      id,
      { action: 'updated user under tenant', tenantId },
      req.ip,
      req.get('User-Agent')
    );

    res.json(updatedUser);
  } catch (error: any) {
    res.status(500).json({ error: error?.message || 'Internal server error' });
  }
}

static async createTenant(req: Request, res: Response) {
  try {
    const tenant = await superAdminService.createTenant(req.body);
    res.status(201).json(tenant);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Error creating tenant' });
  }
}

static async updateTenant(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const tenant = await superAdminService.updateTenant(id, req.body);
    res.json(tenant);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Error updating tenant' });
  }
}

static async getUserById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const user = await superAdminService.getUserById(id);
    res.json(user);
  } catch (error: any) {
    res.status(500).json({ error: error?.message || 'Internal server error' });
  }
}


  static async getTenants(req: Request, res: Response) {
    try {
      const filters = {
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 10,
        search: req.query.search as string,
        startDate: req.query.startDate ? new Date(req.query.startDate as string) : undefined,
        endDate: req.query.endDate ? new Date(req.query.endDate as string) : undefined,
        status: req.query.status as string,
        sortBy: req.query.sortBy as string || 'createdAt',
        sortOrder: req.query.sortOrder as 'ASC' | 'DESC' || 'DESC'
      };
      
      const result = await superAdminService.getTenantsWithFilters(filters);
      
      // Log this action
      await superAdminService.createAuditLog(
    req.superAdmin?.id || 'unknown',
        AuditAction.LOGIN,
        AuditResource.TENANT,
        'multiple',
        { action: 'viewed tenants', filters },
        req.ip,
        req.get('User-Agent')
      );
      
      res.json(result);
    } catch (error: any) {
  res.status(500).json({ error: error?.message || 'Internal server error' });
}
  }

  static async getSubscriptions(req: Request, res: Response) {
  try {
    // Call the service to fetch the subscriptions with associated tenant and user
    const subscriptions = await superAdminService.getSubscriptions();

    res.json({ data: subscriptions });
  } catch (error: any) {
    res.status(500).json({ error: error?.message || 'Internal server error' });
  }
}

 // Add the following methods for handling professionals in your SuperAdminController:

static async createProfessional(req: Request, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const tenantId = req.user.tenantId;
    const data = {
      ...req.body,
      tenantId, // inject tenantId here
    };

    const professional = await superAdminService.createProfessional(data);

    await superAdminService.createAuditLog(
      req.superAdmin?.id || 'unknown',
      AuditAction.CREATE,
      AuditResource.PROFESSIONAL,
      professional.id,
      { action: 'created professional' },
      req.ip,
      req.get('User-Agent')
    );

    return res.status(201).json(professional);
  } catch (error: any) {
    return res.status(500).json({ error: error?.message || 'Internal server error' });
  }
}


// Update Professional
static async updateProfessional(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const data = req.body;

    const updatedProfessional = await superAdminService.updateProfessional(id, data);

    await superAdminService.createAuditLog(
      req.superAdmin?.id || 'unknown',
      AuditAction.UPDATE,
      AuditResource.PROFESSIONAL,
      id,
      { action: 'updated professional' },
      req.ip,
      req.get('User-Agent')
    );

    res.json(updatedProfessional);
  } catch (error: any) {
    res.status(500).json({ error: error?.message || 'Internal server error' });
  }
}
static async getProfessionals(req: Request, res: Response) {
  try {
    const filters = {
      page: parseInt(req.query.page as string) || 1,
      limit: parseInt(req.query.limit as string) || 10,
      search: req.query.search as string,
      startDate: req.query.startDate ? new Date(req.query.startDate as string) : undefined,
      endDate: req.query.endDate ? new Date(req.query.endDate as string) : undefined,
      status: req.query.status as string,
      professionalType: req.query.professionalType as string,
      sortBy: req.query.sortBy as string || 'createdAt',
      sortOrder: req.query.sortOrder as 'ASC' | 'DESC' || 'DESC',
    };

    // Modify the service to fetch firstName and lastName from the User entity
    const result = await superAdminService.getProfessionalsWithFilters(filters);

    // Include the firstName and lastName for each professional from the associated User entity
    const professionalsWithNames = result.data.map((professional: any) => {
      const { firstName, lastName , email } = professional.user || {};
      return {
        ...professional,
        firstName,
        lastName,
        email
      };
    });

    res.json({ ...result, data: professionalsWithNames });
  } catch (error: any) {
    res.status(500).json({ error: error?.message || 'Internal server error' });
  }
}

static async updateProfessionalStatus(req: Request, res: Response) {
  try {
    const { id, userId } = req.params; // Get both IDs from URL params
    const { isActive } = req.body; // Whether the professional is active or not
    
   //console.log("controller",id, userId, isActive);
    // Update both the professional_user table and the user table
    await superAdminService.updateProfessionalStatus(id, userId, isActive); // Pass userId to the service layer

    // Log this action
    await superAdminService.createAuditLog(
      req.superAdmin?.id || 'unknown',
      AuditAction.UPDATE,
      AuditResource.PROFESSIONAL,
      id,
      { action: 'updated professional status', isActive },
      req.ip,
      req.get('User-Agent')
    );

    res.json({ message: 'Professional status updated successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error?.message || 'Internal server error' });
  }
}



  static async getAuditLogs(req: Request, res: Response) {
   
    try {

      const filters = {
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 10,
        action: req.query.action as AuditAction,
        resource: req.query.resource as AuditResource,
        performedById: req.query.performedById as string,
        startDate: req.query.startDate ? new Date(req.query.startDate as string) : undefined,
        endDate: req.query.endDate ? new Date(req.query.endDate as string) : undefined,
        sortBy: req.query.sortBy as string || 'timestamp',
        sortOrder: req.query.sortOrder as 'ASC' | 'DESC' || 'DESC'
      };
      
      const result = await superAdminService.getAuditLogs(filters);
      res.json(result);
    } catch (error: any) {
  res.status(500).json({ error: error?.message || 'Internal server error' });
}
  }

  static async exportData(req: Request, res: Response) {
    try {
      const { resource, format } = req.params;
      const filters = req.query;
      
      const data = await superAdminService.exportData(
        resource as 'users' | 'tenants' | 'professionals' | 'auditLogs',
        format as 'csv' | 'json',
        filters
      );
      
      // Log this action
      await superAdminService.createAuditLog(
       req.superAdmin?.id || 'unknown',
        AuditAction.EXPORT,
        resource as AuditResource,
        'multiple',
        { action: 'exported data', resource, format, filters },
        req.ip,
        req.get('User-Agent')
      );
      
      if (format === 'csv') {
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename=${resource}-${new Date().toISOString()}.csv`);
      } else {
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', `attachment; filename=${resource}-${new Date().toISOString()}.json`);
      }
      
      res.send(data);
    } catch (error: any) {
  res.status(500).json({ error: error?.message || 'Internal server error' });
}
  }

  static async updateUserStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { isActive } = req.body;
      
      await superAdminService.updateUserStatus(id, isActive);
      
      // Log this action
      await superAdminService.createAuditLog(
        req.superAdmin?.id || 'unknown',
        AuditAction.UPDATE,
        AuditResource.USER,
        id,
        { action: 'updated user status', isActive },
        req.ip,
        req.get('User-Agent')
      );
      
      res.json({ message: 'User status updated successfully' });
    } catch (error: any) {
  res.status(500).json({ error: error?.message || 'Internal server error' });
}
  }

  static async updateTenantStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { isActive } = req.body;
      
      await superAdminService.updateTenantStatus(id, isActive);
      
      // Log this action
      await superAdminService.createAuditLog(
        req.superAdmin?.id || 'unknown',
        AuditAction.UPDATE,
        AuditResource.TENANT,
        id,
        { action: 'updated tenant status', isActive },
        req.ip,
        req.get('User-Agent')
      );
      
      res.json({ message: 'Tenant status updated successfully' });
    } catch (error: any) {
  res.status(500).json({ error: error?.message || 'Internal server error' });
}
  }

 
}
