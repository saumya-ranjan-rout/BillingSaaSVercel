  
  
  import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { User } from '../entities/User';
import { SuperAdmin } from '../entities/SuperAdmin';
import { AppDataSource } from '../config/database';



export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
 // console.log("Authorization header:", req.headers.authorization);
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
//console.log("Decoded JWT:", decoded);
    // Map decoded JWT → UserPayload
req.user = {
      id: decoded.sub || decoded.userId,  // ✅ support both
      email: decoded.email,
      tenantId: decoded.tenantId,
      role: decoded.role,
      firstName: (decoded as any).firstName || null,
      lastName: (decoded as any).lastName || null,
    };

//console.log("Auth OK:", req.user);
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

  

export const authenticateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    
    if (decoded.superAdmin) {
      // Super admin authentication
      const superAdminRepository = AppDataSource.getRepository(SuperAdmin);
      const superAdmin = await superAdminRepository.findOne({
        where: { id: decoded.id, is_active: true },
      });
      
      if (!superAdmin) {
        return res.status(401).json({ message: 'Invalid token.' });
      }
      
     // req.superAdmin = superAdmin;
           (req as any).superAdmin = superAdmin;
    } else {
      // Regular user authentication
      const userRepository = AppDataSource.getRepository(User);
      const user = await userRepository.findOne({
        where: { id: decoded.id },
        relations: ['tenant', 'roles', 'roles.permissions'],
      });
      
      if (!user) {
        return res.status(401).json({ message: 'Invalid token.' });
      }
      
      // req.user = user;
      // req.tenant = user.tenant;
            (req as any).user = user;
      (req as any).tenant = user.tenant;

    }
    
    next();
  } catch (error) {
    res.status(400).json({ message: 'Invalid token.' });
  }
};










// Extend Express Request type
// declare global {
//   namespace Express {
//     interface Request {
//       user?: User;
//       tenant?: any;
//       superAdmin?: SuperAdmin;
//     }
//   }
// }

  
  
  
  // import { Request, Response, NextFunction } from 'express';

  // export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  //   try {
  //     // In a real app, you'd verify JWT here
  //     const token = req.headers['authorization'];
  //     if (!token) {
  //       return res.status(401).json({ error: 'Unauthorized: No token provided' });
  //     }

  //     // Attach dummy user to request
  //     (req as any).user = { id: '123', tenantId: 'e2cabb80-a8ce-4fe8-947e-5c18d903dae9' };

  //     next();
  //   } catch (error) {
  //     res.status(401).json({ error: 'Unauthorized' });
  //   }
//}


// import { Request, Response, NextFunction } from 'express';
// import jwt from 'jsonwebtoken';
// import { JWTPayload } from '../types/customTypes';
// import logger from '../utils/logger';
 
// export const authMiddleware = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ): Promise<void> => {
//   try {
//     const token = req.header('Authorization')?.replace('Bearer ', '');
 
//     if (!token) {
//       res.status(401).json({ error: 'Access denied. No token provided.' });
//       return;
//     }
 
//     const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as JWTPayload;
    
//     // Set user property on request
//     req.user = decoded;
    
//     next();
//   } catch (error) {
//     logger.error('Authentication error:', error);
//     res.status(401).json({ error: 'Invalid token' });
//   }
// };