// src/types/express.d.ts
// import 'express-serve-static-core';

// import { User } from '../entities/User';
 
// declare global {
//   namespace Express {
//     interface Request {
//       user?: {
//         id: string;
//         email: string;
//         role: string;
//         tenantId: string;
//         firstName: string;
//         lastName: string;
//       };
//     }
  

// src/types/express.d.ts
import { JWTPayload } from './customTypes';
import { SuperAdmin } from '../entities/SuperAdmin';
import { Tenant } from '../entities/Tenant';

declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
      tenant?: Tenant;
      superAdmin?: SuperAdmin;
    }
  }
}

export {};



// declare module 'express-serve-static-core' {
//   interface Request {
//     user?: {
//       id: string;
//       email: string;
//       role: string;
//       tenantId: string;
//       firstName?: string;
//       lastName?: string;
//     };
//    }
// }
