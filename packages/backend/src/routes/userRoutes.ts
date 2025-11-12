// packages/backend/src/routes/userRoutes.ts
import { Router } from "express";
import { UserController } from "../controllers/UserController";
import { UserService } from "../services/user/UserService";
import { CacheService } from "../services/cache/CacheService";
import { authMiddleware } from "../middleware/auth";
import { tenantMiddleware } from "../middleware/tenant";
import { rbacMiddleware } from "../middleware/rbac";
import { validationMiddleware } from "../middleware/validation";
import { createUserSchema, updateUserSchema } from "../utils/validators";
import { cacheMiddleware } from "../middleware/cache"; // ✅ Added caching support
import { checkSubscription } from "../middleware/checkSubscription";  // ✅ added

const router = Router();
const userService = new UserService();
const cacheService = new CacheService();
const userController = new UserController(userService, cacheService);

// ✅ All routes require authentication and tenant context
router.use(authMiddleware, tenantMiddleware, checkSubscription);

// ----------------- Create -----------------
router.post(
  "/",
  rbacMiddleware(["create:users"]),
  validationMiddleware(createUserSchema),
  userController.createUser.bind(userController)
);

// ----------------- Read (cached) -----------------
router.get(
  "/",
  rbacMiddleware(["read:users"]),
  cacheMiddleware("5 minutes"),
  userController.getUsers.bind(userController)
);

router.get(
  "/:id",
  rbacMiddleware(["read:users"]),
  cacheMiddleware("10 minutes"),
  userController.getUser.bind(userController)
);

// ----------------- Update -----------------
router.put(
  "/:id",
  rbacMiddleware(["update:users"]),
  validationMiddleware(updateUserSchema),
  userController.updateUser.bind(userController)
);

// ----------------- Delete -----------------
router.delete(
  "/:id",
  rbacMiddleware(["delete:users"]),
  userController.deleteUser.bind(userController)
);

// ----------------- Admin-only Password Reset -----------------
router.post(
  "/:id/reset-password",
  rbacMiddleware(["admin:users"]),
  userController.resetPassword.bind(userController)
);

export default router;
