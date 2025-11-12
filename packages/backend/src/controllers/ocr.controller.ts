import { Request, Response } from 'express';
import { OCRService } from '../services/ocr.service';

export class OCRController {
  private ocrService: OCRService;

  constructor() {
    this.ocrService = new OCRService();
  }

  processReceipt = async (req: Request, res: Response): Promise<void> => {
    try {
      const { image } = req.body; // Base64 encoded image
      const result = await this.ocrService.processReceipt(image);
      res.json({ success: true, result });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: 'OCR processing failed' 
      });
    }
  };

  processInvoice = async (req: Request, res: Response): Promise<void> => {
    try {
      const { image } = req.body;
      const result = await this.ocrService.processInvoice(image);
      res.json({ success: true, result });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: 'OCR processing failed' 
      });
    }
  };
}
