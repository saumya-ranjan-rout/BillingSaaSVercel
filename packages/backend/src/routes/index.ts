import { Router } from 'express';
import tenantRoutes from './tenantRoutes';
import authRoutes from './authRoutes';
import invoiceRoutes from './invoiceRoutes';
import subscriptionRoutes from './subscriptionRoutes';
import reportRoutes from './reportRoutes';
import customerRoutes from './customerRoutes'; // Add this import

const router = Router();

// API versioning
router.use('/api/v1/tenants', tenantRoutes);
router.use('/api/v1/auth', authRoutes);
router.use('/api/v1/invoices', invoiceRoutes);
router.use('/api/v1/subscriptions', subscriptionRoutes);
router.use('/api/v1/reports', reportRoutes);
router.use('/api/v1/customers', customerRoutes); // Add this line
// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// 404 handler for API routes
router.use('/api/*', (req, res) => {
  res.status(404).json({ error: 'API endpoint not found' });
});

export default router;
