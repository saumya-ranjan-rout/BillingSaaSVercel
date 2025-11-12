// src/middleware/tenant.middleware.ts
 
import { Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';
import { Tenant } from '../entities/Tenant';
import { User } from '../entities/User';
import logger from '../utils/logger';
 
// Helper function to safely access user properties
const getUserId = (req: Request): string | null => {
  return (req as any).user?.id || null;
};
 
const getUserTenantId = (req: Request): string | null => {
  return (req as any).user?.tenantId || null;
};
 
/**
 * Middleware to validate tenant access and attach tenant to request
 */
export const validateTenantAccess = async (
  req: Request, 
  res: Response, 
  next: NextFunction
): Promise<void> => {
  try {
    const userId = getUserId(req);
    const tenantId = getUserTenantId(req);
    
    if (!userId || !tenantId) {
      res.status(401).json({ 
        success: false, 
        message: 'Authentication required' 
      });
      return;
    }
 
    // Verify tenant exists and is active
    const tenantRepository = getRepository(Tenant);
    const tenant = await tenantRepository.findOne({
      where: { id: tenantId }
    });
 
    if (!tenant) {
      logger.error('User tenant not found', {
        userId,
        tenantId
      });
      res.status(403).json({ 
        success: false, 
        message: 'Tenant not found' 
      });
      return;
    }
 
    if (!tenant.isActive) {
      logger.warn('User attempted to access inactive tenant', {
        userId,
        tenantId
      });
      res.status(403).json({ 
        success: false, 
        message: 'Tenant account is inactive' 
      });
      return;
    }
 
    // Attach tenant to request
    (req as any).tenant = tenant;
 
    logger.debug('Tenant access validated', {
      userId,
      tenantId,
      tenantName: tenant.name
    });
 
    next();
  } catch (error: any) {
    logger.error('Tenant validation error', {
      error: error.message,
      stack: error.stack
    });
    res.status(500).json({ 
      success: false, 
      message: 'Tenant validation failed' 
    });
  }
};
 
/**
 * Middleware to extract tenant from subdomain
 */
export const extractTenantFromSubdomain = (
  req: Request, 
  res: Response, 
  next: NextFunction
): void => {
  try {
    const host = req.get('host');
    const subdomain = host?.split('.')[0];
    
    if (subdomain && subdomain !== 'www' && subdomain !== 'api') {
      (req as any).tenantSubdomain = subdomain;
      logger.debug('Extracted tenant subdomain', { subdomain });
    }
    
    next();
  } catch (error: any) {
    logger.error('Subdomain extraction error', {
      error: error.message,
      stack: error.stack
    });
    next(); // Continue even if extraction fails
  }
};
 
/**
 * Middleware to resolve tenant from subdomain
 * This is useful for authentication before the user is logged in
 */
export const resolveTenantFromSubdomain = async (
  req: Request, 
  res: Response, 
  next: NextFunction
): Promise<void> => {
  try {
    const tenantSubdomain = (req as any).tenantSubdomain;
    if (!tenantSubdomain) {
      next();
      return;
    }
 
    const tenantRepository = getRepository(Tenant);
    const tenant = await tenantRepository.findOne({
      where: { subdomain: tenantSubdomain }
    });
 
    if (tenant && tenant.isActive) {
      (req as any).tenant = tenant;
      logger.debug('Resolved tenant from subdomain', {
        subdomain: tenantSubdomain,
        tenantId: tenant.id
      });
    } else {
      logger.warn('Invalid or inactive tenant subdomain', {
        subdomain: tenantSubdomain
      });
    }
 
    next();
  } catch (error: any) {
    logger.error('Tenant resolution error', {
      error: error.message,
      stack: error.stack
    });
    next(); // Continue even if resolution fails
  }
};
 
/**
 * Middleware to require tenant admin role
 */
export const requireTenantAdmin = (
  req: Request, 
  res: Response, 
  next: NextFunction
): void => {
  const userId = getUserId(req);
  const userRole = (req as any).user?.role;
  
  if (!userId) {
    res.status(401).json({ 
      success: false, 
      message: 'Authentication required' 
    });
    return;
  }
 
  if (userRole !== 'admin') {
    logger.warn('Non-admin user attempted tenant admin operation', {
      userId,
      userRole,
      path: req.path
    });
    
    res.status(403).json({ 
      success: false, 
      message: 'Tenant admin role required' 
    });
    return;
  }
 
  next();
};
 
/**
 * Middleware to validate resource belongs to tenant
 * This is a factory function that creates a middleware for a specific resource type
 */
export const validateTenantResource = (resourceType: string, idParam: string = 'id') => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = getUserId(req);
      const tenantId = getUserTenantId(req);
      
      if (!userId || !tenantId) {
        res.status(401).json({ 
          success: false, 
          message: 'Authentication required' 
        });
        return;
      }
 
      const resourceId = req.params[idParam];
      if (!resourceId) {
        res.status(400).json({ 
          success: false, 
          message: 'Resource ID is required' 
        });
        return;
      }
 
      // Get the repository for the resource type
      const repository = getRepository(resourceType as any);
      
      // Find the resource with tenant relation
      const resource = await repository.findOne({
        where: { id: resourceId },
        relations: ['tenant']
      });
 
      if (!resource) {
        res.status(404).json({ 
          success: false, 
          message: 'Resource not found' 
        });
        return;
      }
 
      // Check if resource belongs to the user's tenant
      if ((resource as any).tenant.id !== tenantId) {
        logger.warn('User attempted to access resource from another tenant', {
          userId,
          userTenantId: tenantId,
          resourceTenantId: (resource as any).tenant.id,
          resourceId,
          resourceType,
          path: req.path
        });
        
        res.status(403).json({ 
          success: false, 
          message: 'Access to resource denied' 
        });
        return;
      }
 
      // Attach resource to request for use in subsequent middleware/controllers
      (req as any)[resourceType] = resource;
 
      next();
    } catch (error: any) {
      logger.error('Tenant resource validation error', {
        error: error.message,
        stack: error.stack,
        resourceType
      });
      res.status(500).json({ 
        success: false, 
        message: 'Resource validation failed' 
      });
    }
  };
};
 
/**
 * Middleware to validate that a user belongs to the current tenant
 * Useful for operations on other users within the same tenant
 */
export const validateTenantUser = async (
  req: Request, 
  res: Response, 
  next: NextFunction
): Promise<void> => {
  try {
    const userId = getUserId(req);
    const tenantId = getUserTenantId(req);
    
    if (!userId || !tenantId) {
      res.status(401).json({ 
        success: false, 
        message: 'Authentication required' 
      });
      return;
    }
 
    const targetUserId = req.params.userId;
    if (!targetUserId) {
      next(); // No user ID specified, proceed
      return;
    }
 
    // For operations on the current user, always allow
    if (targetUserId === userId) {
      next();
      return;
    }
 
    // For operations on other users, verify they belong to the same tenant
    const userRepository = getRepository(User);
    
    const targetUser = await userRepository.findOne({
      where: { id: targetUserId },
      relations: ['tenant']
    });
 
    if (!targetUser) {
      res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
      return;
    }
 
    if (targetUser.tenant.id !== tenantId) {
      logger.warn('User attempted to access user from another tenant', {
        userId,
        userTenantId: tenantId,
        targetUserId,
        targetUserTenantId: targetUser.tenant.id,
        path: req.path
      });
      
      res.status(403).json({ 
        success: false, 
        message: 'Access to user denied' 
      });
      return;
    }
 
    next();
  } catch (error: any) {
    logger.error('Tenant user validation error', {
      error: error.message,
      stack: error.stack
    });
    res.status(500).json({ 
      success: false, 
      message: 'User validation failed' 
    });
  }
};
 