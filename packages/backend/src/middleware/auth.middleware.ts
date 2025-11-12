import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { getRepository } from 'typeorm';
import { User } from '../entities/User';
import logger from '../utils/logger';
 
// Extend Express's Request to include user property
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: string;
        tenantId: string;
        firstName: string;
        lastName: string;
      };
    }
  }
}
 
// Type guard for JWT errors
function isJwtError(error: any): error is { name: string; message: string } {
  return error && typeof error.name === 'string' && typeof error.message === 'string';
}
 
// Type guard for standard errors
function isError(error: any): error is Error {
  return error instanceof Error;
}
 
/**
 * Middleware to authenticate JWT tokens
 */
export const authenticateToken = async (
  req: Request, 
  res: Response, 
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
 
    if (!token) {
      logger.warn('Authentication attempt without token', {
        ip: req.ip,
        path: req.path,
        userAgent: req.get('User-Agent')
      });
      res.status(401).json({ 
        success: false, 
        message: 'Access token required' 
      });
      return;
    }
 
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    
    // Check if user still exists and is active
    const userRepository = getRepository(User);
    const user = await userRepository.findOne({
      where: { id: decoded.id },
      relations: ['tenant']
    });
 
    if (!user) {
      logger.warn('Token valid but user not found', {
        userId: decoded.id,
        ip: req.ip
      });
      res.status(403).json({ 
        success: false, 
        message: 'User no longer exists' 
      });
      return;
    }
 
    // Check if user's tenant is active
    if (!user.tenant.isActive) {
      logger.warn('User attempted to access inactive tenant', {
        userId: user.id,
        tenantId: user.tenant.id
      });
      res.status(403).json({ 
        success: false, 
        message: 'Tenant account is inactive' 
      });
      return;
    }
 
    // Attach user to request with all required properties
    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
      tenantId: user.tenant.id,
      firstName: user.firstName,
      lastName: user.lastName
    };
 
    logger.debug('User authenticated successfully', {
      userId: user.id,
      email: user.email,
      path: req.path
    });
 
    next();
  } catch (error) {
    if (isJwtError(error)) {
      if (error.name === 'TokenExpiredError') {
        logger.warn('Expired token attempted', {
          ip: req.ip,
          path: req.path
        });
        res.status(403).json({ 
          success: false, 
          message: 'Token expired' 
        });
        return;
      } else if (error.name === 'JsonWebTokenError') {
        logger.warn('Invalid token attempted', {
          ip: req.ip,
          path: req.path,
          error: error.message
        });
        res.status(403).json({ 
          success: false, 
          message: 'Invalid token' 
        });
        return;
      }
    }
    
    // Handle other errors
    logger.error('Authentication error', {
      error: isError(error) ? error.message : 'Unknown error',
      stack: isError(error) ? error.stack : undefined
    });
    res.status(500).json({ 
      success: false, 
      message: 'Authentication failed' 
    });
  }
};
 
/**
 * Middleware to require specific user roles
 */
export const requireRole = (roles: string | string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      res.status(401).json({ 
        success: false, 
        message: 'Authentication required' 
      });
      return;
    }
 
    const userRole = req.user.role;
    const allowedRoles = Array.isArray(roles) ? roles : [roles];
    
    if (!allowedRoles.includes(userRole)) {
      logger.warn('User attempted to access restricted resource', {
        userId: req.user.id,
        userRole,
        requiredRoles: allowedRoles,
        path: req.path
      });
      
      res.status(403).json({ 
        success: false, 
        message: 'Insufficient permissions' 
      });
      return;
    }
 
    next();
  };
};
 
/**
 * Middleware to require ownership of resource or admin role
 */
export const requireOwnershipOrRole = (
  resourceOwnerIdPath: string, 
  roles: string | string[] = []
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      res.status(401).json({ 
        success: false, 
        message: 'Authentication required' 
      });
      return;
    }
 
    // Allow if user has one of the required roles
    const allowedRoles = Array.isArray(roles) ? roles : [roles];
    if (allowedRoles.length > 0 && allowedRoles.includes(req.user.role)) {
      next();
      return;
    }
 
    // Allow if user owns the resource
    try {
      // Simple path traversal (e.g., 'params.userId')
      const pathParts = resourceOwnerIdPath.split('.');
      let value: any = req;
      
      for (const part of pathParts) {
        value = value[part];
        if (value === undefined) break;
      }
      
      const resourceOwnerId = value;
      
      if (resourceOwnerId && resourceOwnerId === req.user.id) {
        next();
        return;
      }
    } catch (error) {
      logger.error('Error checking resource ownership', {
        error: isError(error) ? error.message : 'Unknown error',
        path: resourceOwnerIdPath
      });
    }
 
    logger.warn('User attempted to access resource without ownership or proper role', {
      userId: req.user.id,
      userRole: req.user.role,
      requiredRoles: allowedRoles,
      path: req.path
    });
    
    res.status(403).json({ 
      success: false, 
      message: 'Insufficient permissions' 
    });
  };
};
 
/**
 * Middleware to extract user from token without failing (for optional auth)
 */
export const optionalAuth = async (
  req: Request, 
  res: Response, 
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
 
    if (!token) {
      next();
      return;
    }
 
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    
    // Check if user still exists
    const userRepository = getRepository(User);
    const user = await userRepository.findOne({
      where: { id: decoded.id },
      relations: ['tenant']
    });
 
    if (user && user.tenant.isActive) {
      req.user = {
        id: user.id,
        email: user.email,
        role: user.role,
        tenantId: user.tenant.id,
        firstName: user.firstName,
        lastName: user.lastName
      };
    }
 
    next();
  } catch (error) {
    // Don't fail for optional auth, just continue without user
    next();
  }
};
 
/**
 * Generate JWT token for a user
 */
export const generateToken = (user: any): string => {
  return jwt.sign(
    { 
      id: user.id, 
      email: user.email, 
      tenantId: user.tenant.id,
      role: user.role, 
        permissions: user.permissions, 
    },
    process.env.JWT_SECRET!,
    { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
  );
};
 
/**
 * Middleware to refresh JWT tokens
 */
export const refreshToken = async (
  req: Request, 
  res: Response, 
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ 
        success: false, 
        message: 'Authentication required' 
      });
      return;
    }
 
    // Get fresh user data
    const userRepository = getRepository(User);
    const user = await userRepository.findOne({
      where: { id: req.user.id },
      relations: ['tenant']
    });
 
    if (!user) {
      res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
      return;
    }
 
    // Generate new token
    const token = generateToken(user);
 
    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;
 
    res.json({
      success: true,
      token,
      user: userWithoutPassword
    });
  } catch (error) {
    logger.error('Token refresh error', {
      error: isError(error) ? error.message : 'Unknown error',
      stack: isError(error) ? error.stack : undefined
    });
    res.status(500).json({ 
      success: false, 
      message: 'Token refresh failed' 
    });
  }
};

 