// src/config/database.ts
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });

import { DataSource } from 'typeorm';
import { Pool } from 'pg';
import Redis from 'ioredis';
import logger from '../utils/logger';

// Entities ...
import { User } from '../entities/User';
import { Tenant } from '../entities/Tenant';
import { Invoice } from '../entities/Invoice';
import { Notification } from '../entities/Notification';
import { SyncLog } from '../entities/SyncLog';
import { Customer } from '../entities/Customer';
import { GSTIN } from '../entities/GSTIN';
import { InvoiceItem } from '../entities/InvoiceItem';
import { HSN } from '../entities/HSN';
import { Product } from '../entities/Product';
import { Subscription } from '../entities/Subscription';
import { Client } from '../entities/Client';
import { TaxRate } from '../entities/TaxRate';
import { Role } from '../entities/Role';
import { TenantSubscription } from '../entities/TenantSubscription';
import { Permission } from '../entities/Permission';
import { Plan } from '../entities/Plan';
import { PlanFeature } from '../entities/PlanFeature';
import { ProfessionalUser } from '../entities/ProfessionalUser';
import { ProfessionalTenant } from '../entities/ProfessionalTenant';
import { PurchaseOrder } from '../entities/PurchaseOrder';
import { PurchaseItem } from '../entities/PurchaseItem';
import { SubscriptionChange } from '../entities/SubscriptionChange';
import { SubscriptionPlan } from '../entities/SubscriptionPlan';
import { SuperAdmin } from '../entities/SuperAdmin';
import { Vendor } from '../entities/Vendor';
import { Category } from '../entities/Category';
import { PaymentInvoice } from '../entities/PaymentInvoice';
import { Payment } from '../entities/Payment';
import { Setting } from '../entities/Setting';
import { Report } from '../entities/Report';
import { Expense } from '../entities/Expense';
import { TaxDetail } from '../entities/TaxDetail';
import { AuditLog } from '../entities/AuditLog';
import { LoyaltyProgram } from '../entities/LoyaltyProgram';
import { LoyaltyTransaction } from '../entities/LoyaltyTransaction';
import { CustomerLoyalty } from '../entities/CustomerLoyalty';

// ✅ pgPool for raw queries / health checks
export const pgPool = new Pool({
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

// ✅ Shared Redis client
export const redisClient = new Redis({
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD || undefined,
  maxRetriesPerRequest: null,
});

redisClient.on('connect', () => logger.info('✅ Redis connected'));
redisClient.on('error', (err) => logger.error('❌ Redis error:', err));

// ✅ Main ORM datasource
export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || '123456',
  database: process.env.DB_NAME || 'billing_saas',
  entities: [
    User, Tenant, Customer, Invoice, InvoiceItem, Notification, SyncLog,
    GSTIN, HSN, Product, Subscription, Client, TaxRate, Role,
    TenantSubscription, Permission, Plan, PlanFeature,
    ProfessionalUser, ProfessionalTenant, PurchaseOrder, PurchaseItem,
    SubscriptionPlan, SubscriptionChange, SuperAdmin, Vendor, Category,
    PaymentInvoice, Payment, Setting, Report, Expense, TaxDetail, AuditLog,
    LoyaltyProgram, LoyaltyTransaction, CustomerLoyalty,
  ],
   synchronize: process.env.NODE_ENV !== 'production',
  // synchronize: false,
  logging: false,

  // ✅ Native Redis cache support (no custom class needed)
  cache: {
    type: 'ioredis',
    options: {
      host: process.env.REDIS_HOST || '127.0.0.1',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      password: process.env.REDIS_PASSWORD || undefined,
    },
    duration: 30000, // ms
  },

  extra: {
    max: parseInt(process.env.DB_POOL_MAX || '20'),
    statement_timeout: 10000,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
  },
});

// ✅ Call this at app startup
export const initializeDatabase = async () => {
  try {
    if (AppDataSource.isInitialized) return AppDataSource;
    await AppDataSource.initialize();
    logger.info("✅ Database connection established");
    return AppDataSource;
  } catch (error) {
    logger.error("❌ Database connection failed:", error);
    throw error;
  }
};

// ✅ Health check
export const checkDatabaseHealth = async (): Promise<boolean> => {
  try {
    await pgPool.query('SELECT 1');
    await redisClient.ping();
    return true;
  } catch (error) {
    logger.error('❌ Health check failed:', error);
    return false;
  }
};

