import { DataSource } from 'typeorm';
import { Pool } from 'pg';
import Redis from 'ioredis';
export declare const pgPool: Pool;
export declare const redisClient: Redis;
export declare const AppDataSource: DataSource;
export declare const initializeDatabase: () => Promise<DataSource>;
export declare const checkDatabaseHealth: () => Promise<boolean>;
//# sourceMappingURL=database.d.ts.map