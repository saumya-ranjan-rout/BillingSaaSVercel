"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkDatabaseHealth = exports.initializeDatabase = exports.AppDataSource = exports.redisClient = exports.pgPool = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../../../../.env') });
const typeorm_1 = require("typeorm");
const pg_1 = require("pg");
const ioredis_1 = __importDefault(require("ioredis"));
const logger_1 = __importDefault(require("../utils/logger"));
const User_1 = require("../entities/User");
const Tenant_1 = require("../entities/Tenant");
const Invoice_1 = require("../entities/Invoice");
const Notification_1 = require("../entities/Notification");
const SyncLog_1 = require("../entities/SyncLog");
const Customer_1 = require("../entities/Customer");
const GSTIN_1 = require("../entities/GSTIN");
const InvoiceItem_1 = require("../entities/InvoiceItem");
const HSN_1 = require("../entities/HSN");
const Product_1 = require("../entities/Product");
const Subscription_1 = require("../entities/Subscription");
const Client_1 = require("../entities/Client");
const TaxRate_1 = require("../entities/TaxRate");
const Role_1 = require("../entities/Role");
const TenantSubscription_1 = require("../entities/TenantSubscription");
const Permission_1 = require("../entities/Permission");
const Plan_1 = require("../entities/Plan");
const PlanFeature_1 = require("../entities/PlanFeature");
const ProfessionalUser_1 = require("../entities/ProfessionalUser");
const ProfessionalTenant_1 = require("../entities/ProfessionalTenant");
const PurchaseOrder_1 = require("../entities/PurchaseOrder");
const PurchaseItem_1 = require("../entities/PurchaseItem");
const SubscriptionChange_1 = require("../entities/SubscriptionChange");
const SubscriptionPlan_1 = require("../entities/SubscriptionPlan");
const SuperAdmin_1 = require("../entities/SuperAdmin");
const Vendor_1 = require("../entities/Vendor");
const Category_1 = require("../entities/Category");
const PaymentInvoice_1 = require("../entities/PaymentInvoice");
const Payment_1 = require("../entities/Payment");
const Setting_1 = require("../entities/Setting");
const Report_1 = require("../entities/Report");
const Expense_1 = require("../entities/Expense");
const TaxDetail_1 = require("../entities/TaxDetail");
const AuditLog_1 = require("../entities/AuditLog");
const LoyaltyProgram_1 = require("../entities/LoyaltyProgram");
const LoyaltyTransaction_1 = require("../entities/LoyaltyTransaction");
const CustomerLoyalty_1 = require("../entities/CustomerLoyalty");
exports.pgPool = new pg_1.Pool({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    user: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || '123456',
    database: process.env.DB_NAME || 'billing_saas',
    max: 5,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
    maxUses: 7500,
});
exports.redisClient = new ioredis_1.default({
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD || undefined,
    maxRetriesPerRequest: null,
});
exports.redisClient.on('connect', () => logger_1.default.info('✅ Redis connected'));
exports.redisClient.on('error', (err) => logger_1.default.error('❌ Redis error:', err));
exports.AppDataSource = new typeorm_1.DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || '123456',
    database: process.env.DB_NAME || 'billing_saas',
    entities: [
        User_1.User, Tenant_1.Tenant, Customer_1.Customer, Invoice_1.Invoice, InvoiceItem_1.InvoiceItem, Notification_1.Notification, SyncLog_1.SyncLog,
        GSTIN_1.GSTIN, HSN_1.HSN, Product_1.Product, Subscription_1.Subscription, Client_1.Client, TaxRate_1.TaxRate, Role_1.Role,
        TenantSubscription_1.TenantSubscription, Permission_1.Permission, Plan_1.Plan, PlanFeature_1.PlanFeature,
        ProfessionalUser_1.ProfessionalUser, ProfessionalTenant_1.ProfessionalTenant, PurchaseOrder_1.PurchaseOrder, PurchaseItem_1.PurchaseItem,
        SubscriptionPlan_1.SubscriptionPlan, SubscriptionChange_1.SubscriptionChange, SuperAdmin_1.SuperAdmin, Vendor_1.Vendor, Category_1.Category,
        PaymentInvoice_1.PaymentInvoice, Payment_1.Payment, Setting_1.Setting, Report_1.Report, Expense_1.Expense, TaxDetail_1.TaxDetail, AuditLog_1.AuditLog,
        LoyaltyProgram_1.LoyaltyProgram, LoyaltyTransaction_1.LoyaltyTransaction, CustomerLoyalty_1.CustomerLoyalty,
    ],
    synchronize: process.env.NODE_ENV !== 'production',
    logging: false,
    cache: {
        type: 'ioredis',
        options: {
            host: process.env.REDIS_HOST || '127.0.0.1',
            port: parseInt(process.env.REDIS_PORT || '6379'),
            password: process.env.REDIS_PASSWORD || undefined,
        },
        duration: 30000,
    },
    extra: {
        max: parseInt(process.env.DB_POOL_MAX || '20'),
        statement_timeout: 10000,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 5000,
    },
});
const initializeDatabase = async () => {
    try {
        if (exports.AppDataSource.isInitialized)
            return exports.AppDataSource;
        await exports.AppDataSource.initialize();
        logger_1.default.info("✅ Database connection established");
        return exports.AppDataSource;
    }
    catch (error) {
        logger_1.default.error("❌ Database connection failed:", error);
        throw error;
    }
};
exports.initializeDatabase = initializeDatabase;
const checkDatabaseHealth = async () => {
    try {
        await exports.pgPool.query('SELECT 1');
        await exports.redisClient.ping();
        return true;
    }
    catch (error) {
        logger_1.default.error('❌ Health check failed:', error);
        return false;
    }
};
exports.checkDatabaseHealth = checkDatabaseHealth;
//# sourceMappingURL=database.js.map