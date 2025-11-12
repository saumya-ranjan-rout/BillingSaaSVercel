//Add permissions middleware
import { Request, Response, NextFunction } from 'express';
import { AuthorizationError } from '../errors/ApplicationError';

// Define role types
export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  USER = 'user',
  VIEWER = 'viewer'
}



export const requireRole = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required.' });
    }

    // ✅ Fix: check single `role` string instead of `roles` array
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Insufficient permissions.' });
    }

    next();
  };
};


export const requirePermission = (permissions: string | string[]) => {
  const permsArray = Array.isArray(permissions) ? permissions : [permissions];

  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = (req as any).user;

      if (!user) {
        throw new AuthorizationError('Authentication required');
      }

      if (!user.permissions || !Array.isArray(user.permissions)) {
        throw new AuthorizationError('User permissions not defined');
      }

      const hasPermission = permsArray.some((p) => user.permissions.includes(p));

      if (!hasPermission) {
        throw new AuthorizationError('Insufficient permissions');
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

// export const requirePermission = (permissions: string[]) => {
//   return (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const user = (req as any).user;

//       if (!user) {
//         throw new AuthorizationError('Authentication required');
//       }

//       if (!user.permissions || !Array.isArray(user.permissions)) {
//         throw new AuthorizationError('User permissions not defined');
//       }

//       const hasPermission = permissions.some((p) => user.permissions.includes(p));

//       if (!hasPermission) {
//         throw new AuthorizationError('Insufficient permissions');
//       }

//       next();
//     } catch (error) {
//       next(error);
//     }
//   };
// };





// // Middleware to check if user has required roles
// export const requireRole = (allowedRoles: UserRole[]) => {
//   return (req: Request, res: Response, next: NextFunction) => {
//     try {
//       // Assuming user is attached to request by authentication middleware
//       const user = (req as any).user;
      
//       if (!user) {
//         throw new AuthorizationError('Authentication required');
//       }

//       if (!user.roles || !Array.isArray(user.roles)) {
//         throw new AuthorizationError('User roles not defined');
//       }

//       // Check if user has at least one of the required roles
//       const hasRequiredRole = user.roles.some((role: UserRole) => 
//         allowedRoles.includes(role)
//       );

//       if (!hasRequiredRole) {
//         throw new AuthorizationError('Insufficient permissions');
//       }

//       next();
//     } catch (error) {
//       next(error);
//     }
//   };
// };

// // Convenience functions for common role checks
// export const requireSuperAdmin = requireRole([UserRole.SUPER_ADMIN]);
// export const requireAdmin = requireRole([UserRole.ADMIN, UserRole.SUPER_ADMIN]);
// export const requireUser = requireRole([UserRole.USER, UserRole.ADMIN, UserRole.SUPER_ADMIN]);
