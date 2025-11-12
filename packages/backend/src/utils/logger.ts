import Joi from 'joi';
import { GST_STATES } from './constants';
import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import path from 'path';

// ------------------- VALIDATORS -------------------
export const validateEmail = (email: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const validateGSTIN = (gstin: string): boolean => {
  const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/;
  if (!gstinRegex.test(gstin)) return false;
  const stateCode = parseInt(gstin.substring(0, 2));
  return stateCode in GST_STATES;
};

export const validatePhone = (phone: string): boolean =>
  /^[6-9]\d{9}$/.test(phone.replace(/\D/g, ''));

// ------------------- SCHEMAS -------------------
export const invoiceSchema = Joi.object({
  customerId: Joi.string().required(),
  issueDate: Joi.date().required(),
  dueDate: Joi.date().min(Joi.ref('issueDate')).required(),
  items: Joi.array().items(
    Joi.object({
      description: Joi.string().required(),
      quantity: Joi.number().min(0.01).required(),
      unitPrice: Joi.number().min(0).required(),
      taxRate: Joi.number().min(0).max(100).required(),
    })
  ).min(1).required(),
  notes: Joi.string().allow('').optional(),
});

export const customerSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().pattern(/^[6-9]\d{9}$/).optional(),
  address: Joi.object({
    street: Joi.string().required(),
    city: Joi.string().required(),
    state: Joi.string().valid(...Object.values(GST_STATES)).required(),
    pincode: Joi.string().pattern(/^\d{6}$/).required(),
    country: Joi.string().default('India'),
  }).required(),
  gstin: Joi.string().pattern(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/).optional(),
});

export const userSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  role: Joi.string().valid('admin', 'user', 'viewer').default('user'),
});

// ------------------- LOGGER CONFIG -------------------
const logLevels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
  audit: 5,
};

const logColors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'blue',
  audit: 'cyan',
};
winston.addColors(logColors);

const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

const consoleFormat = winston.format.combine(
  winston.format.colorize({ all: true }),
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.printf(
    ({ timestamp, level, message, stack }) =>
      `${timestamp} ${level}: ${message}${stack ? `\n${stack}` : ''}`
  )
);

const logsDir = path.join(process.cwd(), 'logs');

const buildTransports = () => [
  new winston.transports.Console({
    format: consoleFormat,
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  }),
  new DailyRotateFile({
    filename: path.join(logsDir, 'error-%DATE%.log'),
    datePattern: 'YYYY-MM-DD',
    level: 'error',
    maxSize: '20m',
    maxFiles: '14d',
    format: logFormat,
  }),
  new DailyRotateFile({
    filename: path.join(logsDir, 'combined-%DATE%.log'),
    datePattern: 'YYYY-MM-DD',
    maxSize: '20m',
    maxFiles: '14d',
    format: logFormat,
  }),
  new DailyRotateFile({
    filename: path.join(logsDir, 'audit-%DATE%.log'),
    datePattern: 'YYYY-MM-DD',
    level: 'audit',
    maxSize: '20m',
    maxFiles: '30d',
    format: logFormat,
  }),
];

const logger = winston.createLogger({
  levels: logLevels,
  level: process.env.LOG_LEVEL || 'info',
  transports: buildTransports(),
  defaultMeta: { service: 'billing-saas-api' },
  exitOnError: false,
});

// ------------------- HELPERS -------------------
export const stream = {
  write: (message: string) => logger.http(message.trim()),
};

export const auditLog = (message: string, meta?: any) =>
  logger.log('audit', message, meta);

export const apiLog = (req: any, res: any, responseTime: number) => {
  const logData = {
    method: req.method,
    url: req.url,
    query: req.query,
    params: req.params,
    statusCode: res.statusCode,
    responseTime: `${responseTime}ms`,
    userAgent: req.get('User-Agent'),
    userId: req.user?.id || 'anonymous',
    tenantId: req.user?.tenantId || 'unknown',
  };

  res.statusCode >= 400
    ? logger.warn('API Request', logData)
    : logger.info('API Request', logData);
};

export const dbQueryLog = (
  query: string,
  parameters: any[] = [],
  executionTime: number
) => {
  logger.debug('Database Query', {
    query,
    parameters,
    executionTime: `${executionTime}ms`,
  });
};

export const errorWithContext = (error: Error, context: any = {}) => {
  logger.error(error.message, { stack: error.stack, ...context });
};

// ------------------- PROCESS SAFETY -------------------
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception', { message: error.message, stack: error.stack });
  if (process.env.NODE_ENV === 'production') process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection', { reason, promise });
  if (process.env.NODE_ENV === 'production') process.exit(1);
});

export default logger;



// import Joi from 'joi';
// import { GST_STATES } from './constants';
// import winston from 'winston';
// import DailyRotateFile from 'winston-daily-rotate-file';
// import path from 'path';
// export const validateEmail = (email: string): boolean => {
//   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//   return emailRegex.test(email);
// };

// export const validateGSTIN = (gstin: string): boolean => {
//   const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
//   if (!gstinRegex.test(gstin)) return false;
  
//   // Validate state code (first two digits)
//   const stateCode = parseInt(gstin.substring(0, 2));
//   return stateCode in GST_STATES;
// };

// export const validatePhone = (phone: string): boolean => {
//   const phoneRegex = /^[6-9]\d{9}$/;
//   return phoneRegex.test(phone.replace(/\D/g, ''));
// };

// export const invoiceSchema = Joi.object({
//   customerId: Joi.string().required(),
//   issueDate: Joi.date().required(),
//   dueDate: Joi.date().min(Joi.ref('issueDate')).required(),
//   items: Joi.array().items(
//     Joi.object({
//       description: Joi.string().required(),
//       quantity: Joi.number().min(0.01).required(),
//       unitPrice: Joi.number().min(0).required(),
//       taxRate: Joi.number().min(0).max(100).required(),
//     })
//   ).min(1).required(),
//   notes: Joi.string().allow('').optional(),
// });

// export const customerSchema = Joi.object({
//   name: Joi.string().min(2).max(100).required(),
//   email: Joi.string().email().required(),
//   phone: Joi.string().pattern(/^[6-9]\d{9}$/).optional(),
//   address: Joi.object({
//     street: Joi.string().required(),
//     city: Joi.string().required(),
//     state: Joi.string().valid(...Object.values(GST_STATES)).required(),
//     pincode: Joi.string().pattern(/^\d{6}$/).required(),
//     country: Joi.string().default('India'),
//   }).required(),
//   gstin: Joi.string().pattern(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/).optional(),
// });

// export const userSchema = Joi.object({
//   name: Joi.string().min(2).max(100).required(),
//   email: Joi.string().email().required(),
//   password: Joi.string().min(8).required(),
//   role: Joi.string().valid('admin', 'user', 'viewer').default('user'),
// });


// const logLevels = {
//   error: 0,
//   warn: 1,
//   info: 2,
//   http: 3,
//   debug: 4,
//   audit: 5
// };
 
// // Define log colors
// const logColors = {
//   error: 'red',
//   warn: 'yellow',
//   info: 'green',
//   http: 'magenta',
//   debug: 'blue',
//   audit: 'cyan'
// };
 
// // Register colors
// winston.addColors(logColors);
 
// // Define log format
// const logFormat = winston.format.combine(
//   winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
//   winston.format.errors({ stack: true }),
//   winston.format.json()
// );
 
// // Custom format for console logging
// const consoleFormat = winston.format.combine(
//   winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
//   winston.format.colorize({ all: true }),
//   winston.format.printf(
//     (info) => `${info.timestamp} ${info.level}: ${info.message} ${info.stack ? `\n${info.stack}` : ''}`
//   )
// );
 
// // Create the logs directory path
// const logsDir = path.join(process.cwd(), 'logs');
 
// // Define transports
// const transports = [
//   // Console transport
//   new winston.transports.Console({
//     format: consoleFormat,
//     level: process.env.NODE_ENV === 'production' ? 'info' : 'debug'
//   }),
  
//   // Daily rotate file for errors
//   new DailyRotateFile({
//     filename: path.join(logsDir, 'error-%DATE%.log'),
//     datePattern: 'YYYY-MM-DD',
//     level: 'error',
//     maxSize: '20m',
//     maxFiles: '14d',
//     format: logFormat
//   }),
  
//   // Daily rotate file for all logs
//   new DailyRotateFile({
//     filename: path.join(logsDir, 'combined-%DATE%.log'),
//     datePattern: 'YYYY-MM-DD',
//     maxSize: '20m',
//     maxFiles: '14d',
//     format: logFormat
//   }),
  
//   // Daily rotate file for audit logs
//   new DailyRotateFile({
//     filename: path.join(logsDir, 'audit-%DATE%.log'),
//     datePattern: 'YYYY-MM-DD',
//     level: 'audit',
//     maxSize: '20m',
//     maxFiles: '30d', // Keep audit logs longer
//     format: logFormat
//   })
// ];
 
// // Create the logger
// const logger = winston.createLogger({
//   levels: logLevels,
//   format: logFormat,
//   transports,
//   defaultMeta: { service: 'billing-saas-api' },
//   exitOnError: false
// });
 
// // Create a stream for Morgan (HTTP logging)
// export const stream = {
//   write: (message: string) => {
//     logger.http(message.trim());
//   }
// };
 
// // Custom audit log function
// export const auditLog = (message: string, meta?: any) => {
//   logger.log('audit', message, meta);
// };
 
// // Custom API request log function
// export const apiLog = (req: any, res: any, responseTime: number) => {
//   const logData = {
//     method: req.method,
//     url: req.url,
//     query: req.query,
//     params: req.params,
//     statusCode: res.statusCode,
//     responseTime: `${responseTime}ms`,
//     userAgent: req.get('User-Agent'),
//     userId: req.user?.id || 'anonymous',
//     tenantId: req.user?.tenantId || 'unknown'
//   };
  
//   if (res.statusCode >= 400) {
//     logger.warn('API Request', logData);
//   } else {
//     logger.info('API Request', logData);
//   }
// };
 
// // Database query logger
// export const dbQueryLog = (query: string, parameters: any[] = [], executionTime: number) => {
//   logger.debug('Database Query', {
//     query,
//     parameters,
//     executionTime: `${executionTime}ms`
//   });
// };
 
// // Error logger with context
// export const errorWithContext = (error: Error, context: any = {}) => {
//   logger.error(error.message, {
//     stack: error.stack,
//     ...context
//   });
// };
 
// // Log uncaught exceptions
// process.on('uncaughtException', (error) => {
//   logger.error('Uncaught Exception', {
//     message: error.message,
//     stack: error.stack
//   });
//   process.exit(1);
// });
 
// // Log unhandled rejections
// process.on('unhandledRejection', (reason, promise) => {
//   logger.error('Unhandled Rejection', {
//     reason,
//     promise
//   });
//   process.exit(1);
// });

// export default logger;