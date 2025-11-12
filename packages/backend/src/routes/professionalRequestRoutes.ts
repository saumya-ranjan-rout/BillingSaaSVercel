import { Router } from "express";
import { ProfessionalRequestController } from "../controllers/ProfessionalRequestController";
import { authMiddleware } from '../middleware/auth';
import { tenantMiddleware } from '../middleware/tenant';
import { rbacMiddleware } from '../middleware/rbac';
import { checkSubscription } from '../middleware/checkSubscription';

const router = Router();
const controller = new ProfessionalRequestController();
router.use(authMiddleware, tenantMiddleware, checkSubscription);
// Create a new professional request
router.post("/",  rbacMiddleware(['create:professional-requests']), (req, res) => controller.createRequest(req, res));

// Get all requests of logged-in user
router.get("/",  rbacMiddleware(['read:professional-requests']),  (req, res) => controller.getRequests(req, res));

// Get available professionals for dropdown
router.get("/professionals", rbacMiddleware(['read:professional-requests']), (req, res) => controller.getProfessionals(req, res));

// Update status (for admin/professional)
router.patch("/:id/status", rbacMiddleware(['update:professional-requests']),  (req, res) => controller.updateStatus(req, res));

export default router;
