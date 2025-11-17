// src/middleware/rbac.ts

import { Request, Response, NextFunction } from "express";

const rolePermissions: Record<string, string[]> = {
  admin: [
    "read:customers",
    "create:customers",
    "update:customers",
    "delete:customers",
    "read:vendors",
    "create:vendors",
    "update:vendors",
    "delete:vendors",
    "read:products",
    "create:products",
    "update:products",
    "delete:products",
        "read:purchases",
    "create:purchases",
    "update:purchases",
    "delete:purchases",
    "read:invoices",
    "create:invoices",
    "update:invoices",
    "delete:invoices",
        "read:reports",
        "generate:reports",

        "read:users",
        "create:users",
        "update:users",
        "delete:users",
        "read:subscription",
        "manage:subscription",
        "read:professional-requests",
        "create:professional-requests",
        "update:professional-requests",
        "delete:professional-requests",

  ],
  user: [
"read:customers",
    "create:customers",
    "update:customers",
    "delete:customers",
    "read:vendors",
    "create:vendors",
    "update:vendors",
    "delete:vendors",
    "read:products",
    "create:products",
    "update:products",
    "delete:products",
        "read:purchases",
    "create:purchases",
    "update:purchases",
    "delete:purchases",
    "read:invoices",
    "create:invoices",
    "update:invoices",
    "delete:invoices",
        "read:reports",
        "generate:reports",

        "read:users",
        // "create:users",
        // "update:users",
        // "delete:users",
        "read:subscription",
        // "manage:subscription",
  ],
    super_user: [
"read:customers",
    "create:customers",
    "update:customers",
    "delete:customers",
    "read:vendors",
    "create:vendors",
    "update:vendors",
    "delete:vendors",
    "read:products",
    "create:products",
    "update:products",
    "delete:products",
        "read:purchases",
    "create:purchases",
    "update:purchases",
    "delete:purchases",
    "read:invoices",
    "create:invoices",
    "update:invoices",
    "delete:invoices",
        "read:reports",
        "generate:reports",

        "read:users",
        "create:users",
        "update:users",
        "delete:users",
        "read:subscription",
        "manage:subscription",
        "read:professional-requests",
        "create:professional-requests",
        "update:professional-requests",
        "delete:professional-requests",
  ],
  professional: [
"read:customers",
    "create:customers",
    "update:customers",
    "delete:customers",
    "read:vendors",
    "create:vendors",
    "update:vendors",
    "delete:vendors",
    "read:products",
    "create:products",
    "update:products",
    "delete:products",
        "read:purchases",
    "create:purchases",
    "update:purchases",
    "delete:purchases",
    "read:invoices",
    "create:invoices",
    "update:invoices",
    "delete:invoices",
        "read:reports",
        "generate:reports",

        "read:users",
        "create:users",
        "update:users",
        "delete:users",
        "read:subscription",
         "manage:subscription",
         "read:professional-requests",
        "create:professional-requests",
        "update:professional-requests",
        "delete:professional-requests",
  ],
   professional_user: [
"read:customers",
    // "create:customers",
    // "update:customers",
    // "delete:customers",
    "read:vendors",
    // "create:vendors",
    // "update:vendors",
    // "delete:vendors",
    "read:products",
    // "create:products",
    // "update:products",
    // "delete:products",
        "read:purchases",
    // "create:purchases",
    // "update:purchases",
    // "delete:purchases",
    "read:invoices",
    "create:invoices",
    "update:invoices",
    "delete:invoices",
        "read:reports",
        "generate:reports",

        "read:users",
        // "create:users",
        // "update:users",
        // "delete:users",
        "read:subscription",
        //  "manage:subscription",
        //  "read:professional-requests",
        // "create:professional-requests",
        // "update:professional-requests",
        // "delete:professional-requests",
  ]
};

export const rbacMiddleware = (permissions: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    //console.log("User in RBAC:", user);

    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // If no explicit permissions, derive from role
    const effectivePermissions = user.permissions || rolePermissions[user.role] || [];

    if (!permissions.some((p) => effectivePermissions.includes(p))) {
      return res.status(403).json({ error: "Forbidden: insufficient permissions" });
    }

    next();
  };
};

// import { Request, Response, NextFunction } from 'express';

// export const rbacMiddleware = (permissions: string[]) => {
//   return (req: Request, res: Response, next: NextFunction) => {
//     const user = (req as any).user;
//     if (!user || !permissions.some(p => user.permissions?.includes(p))) {
//       return res.status(403).json({ error: 'Forbidden: insufficient permissions' });
//     }
//     next();
//   };
// };
