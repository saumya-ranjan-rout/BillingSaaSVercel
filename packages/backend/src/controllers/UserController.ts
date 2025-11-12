import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { UserService } from "../services/user/UserService";
import { CacheService } from "../services/cache/CacheService";
import logger from "../utils/logger";

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

export class UserController {
  constructor(private userService: UserService, private cacheService: CacheService) {}

  // ✅ Create new user
  async createUser(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

      if (!req.user) return res.status(401).json({ error: "Unauthorized" });
      const tenantId = req.user.tenantId;

      const userData = req.body;
      const user = await this.userService.createUser(tenantId, userData);

      await this.cacheService.invalidatePattern(`users:${tenantId}:*`);
      res.status(201).json(user);
    } catch (error) {
      logger.error("Error creating user:", error);
      res.status(400).json({ error: getErrorMessage(error) });
    }
  }

  // ✅ Get single user
  async getUser(req: Request, res: Response) {
    try {
      if (!req.user) return res.status(401).json({ error: "Unauthorized" });
      const tenantId = req.user.tenantId;
      const { id } = req.params;

      const cacheKey = `user:${tenantId}:${id}`;
      const user = await this.cacheService.getOrSet(cacheKey, async () => {
        return await this.userService.getUser(tenantId, id);
      }, 300);

      if (!user) return res.status(404).json({ error: "User not found" });
      res.json(user);
    } catch (error) {
      logger.error("Error fetching user:", error);
      res.status(400).json({ error: getErrorMessage(error) });
    }
  }

  // ✅ Get paginated users
  async getUsers(req: Request, res: Response) {
    try {
      if (!req.user) return res.status(401).json({ error: "Unauthorized" });

      const tenantId = req.user.tenantId;
      const { page = 1, limit = 10, search } = req.query;
      const pageNum = Math.max(1, parseInt(page as string));
      const limitNum = Math.min(100, Math.max(1, parseInt(limit as string)));

      const options = { page: pageNum, limit: limitNum, search: search as string };
      const cacheKey = `users:${tenantId}:${JSON.stringify(options)}`;

      const users = await this.cacheService.getOrSet(cacheKey, async () => {
        return await this.userService.getUsers(tenantId, options);
      }, 120);

      res.json(users);
    } catch (error) {
      logger.error("Error fetching users:", error);
      res.status(400).json({ error: getErrorMessage(error) });
    }
  }

  // ✅ Update user details
  async updateUser(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
      if (!req.user) return res.status(401).json({ error: "Unauthorized" });

      const { id } = req.params;
      const tenantId = req.user.tenantId;
      const updates = req.body;

      const updatedUser = await this.userService.updateUser(tenantId, id, updates);
      await this.cacheService.del(`user:${tenantId}:${id}`);
      await this.cacheService.invalidatePattern(`users:${tenantId}:*`);

      res.json(updatedUser);
    } catch (error) {
      logger.error("Error updating user:", error);
      res.status(400).json({ error: getErrorMessage(error) });
    }
  }

  // ✅ Delete user (soft delete)
  async deleteUser(req: Request, res: Response) {
    try {
      if (!req.user) return res.status(401).json({ error: "Unauthorized" });

      const { id } = req.params;
      const tenantId = req.user.tenantId;

      await this.userService.deleteUser(tenantId, id);
      await this.cacheService.del(`user:${tenantId}:${id}`);
      await this.cacheService.invalidatePattern(`users:${tenantId}:*`);

      res.status(204).send();
    } catch (error) {
      logger.error("Error deleting user:", error);
      res.status(400).json({ error: getErrorMessage(error) });
    }
  }

  // ✅ Admin-only password reset route
  async resetPassword(req: Request, res: Response) {
    try {
      if (!req.user || req.user.role !== "admin") {
        return res.status(403).json({ error: "Forbidden. Admin access only." });
      }

      const { id } = req.params;
      const { newPassword } = req.body;
      const tenantId = req.user.tenantId;

      if (!newPassword || newPassword.length < 6) {
        return res.status(400).json({ error: "Password must be at least 6 characters long." });
      }

      const result = await this.userService.resetPassword(tenantId, id, newPassword);
      await this.cacheService.del(`user:${tenantId}:${id}`);
      res.json({ message: "Password updated successfully", userId: result.id });
    } catch (error) {
      logger.error("Error resetting password:", error);
      res.status(400).json({ error: getErrorMessage(error) });
    }
  }
}
