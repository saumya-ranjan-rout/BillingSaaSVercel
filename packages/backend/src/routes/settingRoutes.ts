// packages/backend/src/routes/settingRoutes.ts
import { Router } from "express";
import { SettingController } from "../controllers/SettingController";
import { authMiddleware } from "../middleware/auth";
import { cacheMiddleware } from "../middleware/cache"; // ✅ added

const router = Router();
const controller = new SettingController();

// ✅ All routes require authentication
router.use(authMiddleware);

// ----------------- Read (cached) -----------------
router.get(
  "/",
  cacheMiddleware("10 minutes"), // settings rarely change
  (req, res) => controller.get(req, res)
);

// ----------------- Update -----------------
router.put("/", (req, res) => controller.update(req, res));

export default router;

// import { Router } from "express";
// import { SettingController } from "../controllers/SettingController";
// import { authMiddleware } from "../middleware/auth";

// const router = Router();
// const controller = new SettingController();

// router.use(authMiddleware);

// router.get("/", (req, res) => controller.get(req, res));
// router.put("/", (req, res) => controller.update(req, res));

// export default router;
