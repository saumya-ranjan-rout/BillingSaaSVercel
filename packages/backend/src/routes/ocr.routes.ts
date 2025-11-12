import { Router } from 'express';
import { OCRController } from '../controllers/ocr.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();
const ocrController = new OCRController();

router.post('/receipt', authenticateToken, ocrController.processReceipt);
router.post('/invoice', authenticateToken, ocrController.processInvoice);

export default router;
