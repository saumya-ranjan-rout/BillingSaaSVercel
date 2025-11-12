import * as tf from '@tensorflow/tfjs';
import { createWorker } from 'tesseract.js';




export class OCRService {
//   private worker: Worker;
private worker: any;

  constructor() {
    this.initializeWorker();
  }

  private async initializeWorker() {
    this.worker = createWorker();
    await this.worker.load();
    await this.worker.loadLanguage('eng');
    await this.worker.initialize('eng');
  }

  async processReceipt(imageBase64: string) {
    try {
      const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');
      const imageBuffer = Buffer.from(base64Data, 'base64');

      const { data: { text } } = await this.worker.recognize(imageBuffer);

      const totalAmount = this.extractTotalAmount(text);
      const date = this.extractDate(text);
      const vendor = this.extractVendor(text);

      return {
        text,
        extractedData: { totalAmount, date, vendor }
      };
    } catch (error) {
      throw new Error('Failed to process receipt image');
    }
  }

  async processInvoice(imageBase64: string) {
    const result = await this.processReceipt(imageBase64);
    const invoiceNumber = this.extractInvoiceNumber(result.text);

    return {
      ...result,
      extractedData: {
        ...result.extractedData,
        invoiceNumber
      }
    };
  }

  private extractTotalAmount(text: string): number | null {
    const patterns = [/total.*?(\d+\.\d{2})/i, /amount.*?(\d+\.\d{2})/i, /(\d+\.\d{2}).*?total/i];
    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match && match[1]) return parseFloat(match[1]);
    }
    return null;
  }

  private extractDate(text: string): string | null {
    const patterns = [/\d{2}\/\d{2}\/\d{4}/, /\d{4}-\d{2}-\d{2}/, /\d{2}-\d{2}-\d{4}/];
    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) return match[0];
    }
    return null;
  }

  private extractVendor(text: string): string | null {
    const vendors = ['Walmart', 'Amazon', 'Starbucks', 'Target'];
    for (const vendor of vendors) {
      if (text.includes(vendor)) return vendor;
    }
    return null;
  }

  private extractInvoiceNumber(text: string): string | null {
    const patterns = [/invoice.*?(\d+)/i, /inv.*?(\d+)/i, /#\s*(\d+)/];
    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match && match[1]) return match[1];
    }
    return null;
  }
}



// import * as Tesseract from 'tesseract.js';
// import * as tf from '@tensorflow/tfjs-node';
// import { createWorker } from 'tesseract.js';

// export class OCRService {
//   private worker: Tesseract.Worker;

//   constructor() {
//     this.initializeWorker();
//   }

//   private async initializeWorker() {
//     this.worker = await createWorker('eng');
//   }

//   async processReceipt(imageBase64: string) {
//     try {
//       // Remove data URL prefix if present
//       const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');
//       const imageBuffer = Buffer.from(base64Data, 'base64');

//       // Perform OCR
//       const { data: { text } } = await this.worker.recognize(imageBuffer);

//       // Extract relevant information using regex patterns
//       const totalAmount = this.extractTotalAmount(text);
//       const date = this.extractDate(text);
//       const vendor = this.extractVendor(text);

//       return {
//         text,
//         extractedData: {
//           totalAmount,
//           date,
//           vendor
//         }
//       };
//     } catch (error) {
//       throw new Error('Failed to process receipt image');
//     }
//   }

//   async processInvoice(imageBase64: string) {
//     // Similar implementation but with invoice-specific patterns
//     const result = await this.processReceipt(imageBase64);
    
//     // Additional invoice-specific processing
//     const invoiceNumber = this.extractInvoiceNumber(result.text);
    
//     return {
//       ...result,
//       extractedData: {
//         ...result.extractedData,
//         invoiceNumber
//       }
//     };
//   }

//   private extractTotalAmount(text: string): number | null {
//     const patterns = [
//       /total.*?(\d+\.\d{2})/i,
//       /amount.*?(\d+\.\d{2})/i,
//       /(\d+\.\d{2}).*?total/i
//     ];

//     for (const pattern of patterns) {
//       const match = text.match(pattern);
//       if (match && match[1]) {
//         return parseFloat(match[1]);
//       }
//     }

//     return null;
//   }

//   private extractDate(text: string): string | null {
//     const datePatterns = [
//       /\d{2}\/\d{2}\/\d{4}/,
//       /\d{4}-\d{2}-\d{2}/,
//       /\d{2}-\d{2}-\d{4}/
//     ];

//     for (const pattern of datePatterns) {
//       const match = text.match(pattern);
//       if (match) {
//         return match[0];
//       }
//     }

//     return null;
//   }

//   private extractVendor(text: string): string | null {
//     // Simple implementation - look for known vendor patterns
//     const vendors = ['Walmart', 'Amazon', 'Starbucks', 'Target'];
    
//     for (const vendor of vendors) {
//       if (text.includes(vendor)) {
//         return vendor;
//       }
//     }

//     return null;
//   }

//   private extractInvoiceNumber(text: string): string | null {
//     const patterns = [
//       /invoice.*?(\d+)/i,
//       /inv.*?(\d+)/i,
//       /#\s*(\d+)/
//     ];

//     for (const pattern of patterns) {
//       const match = text.match(pattern);
//       if (match && match[1]) {
//         return match[1];
//       }
//     }

//     return null;
//   }
// }
