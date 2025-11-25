"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const path_1 = __importDefault(require("path"));
const database_1 = require("./config/database");
const error_middleware_1 = require("./middleware/error.middleware");
const tenant_middleware_1 = require("./middleware/tenant.middleware");
const logger_1 = require("./utils/logger");
dotenv_1.default.config({ path: path_1.default.resolve(process.cwd(), ".env") });
const createApp = async () => {
    const app = (0, express_1.default)();
    await (0, database_1.initializeDatabase)();
    app.set("trust proxy", true);
    app.use((0, cors_1.default)({
        origin: "*",
        credentials: true,
    }));
    app.use(express_1.default.json({ limit: "10mb" }));
    app.use(express_1.default.urlencoded({ extended: true, limit: "10mb" }));
    app.use((0, morgan_1.default)("combined", { stream: logger_1.stream }));
    app.use(tenant_middleware_1.extractTenantFromSubdomain);
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
    app.use("/api/professional-requests", require("./routes/professionalRequestRoutes").default);
    app.use("*", (req, res) => {
        return res.status(404).json({ success: false, message: "Route not found" });
    });
    app.use(error_middleware_1.errorHandler);
    return app;
};
exports.createApp = createApp;
//# sourceMappingURL=app.js.map