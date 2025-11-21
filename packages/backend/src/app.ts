import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import path from "path";

import { initializeDatabase } from "./config/database";
import { errorHandler } from "./middleware/error.middleware";
import { extractTenantFromSubdomain } from "./middleware/tenant.middleware";
import logger, { stream } from "./utils/logger";

// Load env automatically (Vercel injects its own)
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

export const createApp = async () => {
  const app = express();

  // Ensure DB is initialized only once
  await initializeDatabase();

  app.set("trust proxy", true);

  app.use(
    cors({
      origin: "*",
      credentials: true,
    })
  );

  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true, limit: "10mb" }));

  app.use(morgan("combined", { stream }));

  app.use(extractTenantFromSubdomain);

  // Routes
  app.get("/health", (req, res) => {
    res.json({
      status: "OK",
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || "1.0.0",
    });
  });

  app.get("/metrics", (req, res) => {
    res.json({
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      version: process.version,
    });
  });

  // Route imports
  app.use("/api/dashboard", require("./routes/dashboardRoutes").default);
  app.use("/api/auth", require("./routes/authRoutes").default);
  app.use("/api/notifications", require("./routes/notification.routes").default);
  app.use("/api/sync", require("./routes/sync.routes").default);
  app.use("/api/invoices", require("./routes/invoiceRoutes").default);
  app.use("/api/customers", require("./routes/customerRoutes").default);
  app.use("/api/products", require("./routes/productRoutes").default);
  app.use("/api/vendors", require("./routes/vendorRoutes").default);
  app.use("/api/purchases", require("./routes/purchaseRoutes").default);
  app.use("/api/settings", require("./routes/settingRoutes").default);
  app.use("/api/reports", require("./routes/reportRoutes").default);
  app.use("/api/loyalty", require("./routes/loyaltyRoutes").default);
  app.use("/api/users", require("./routes/userRoutes").default);
  app.use("/api/subscriptions", require("./routes/subscriptionRoutes").default);
  app.use("/api/super-admin", require("./routes/super-admin").default);
  app.use(
    "/api/professional-requests",
    require("./routes/professionalRequestRoutes").default
  );

  // Not Found
  app.use("*", (req, res) => {
    return res.status(404).json({ success: false, message: "Route not found" });
  });

  app.use(errorHandler);

  return app;
};
