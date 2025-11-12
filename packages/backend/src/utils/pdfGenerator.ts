import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { Invoice, Customer } from '../types/customTypes';
import { formatCurrency, formatDate } from './helpers';

export class PDFGenerator {
  static async generateInvoicePDF(invoice: Invoice, customer: Customer): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({ margin: 50 });
        const buffers: Buffer[] = [];
        
        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => {
          const pdfData = Buffer.concat(buffers);
          resolve(pdfData);
        });
        
        // Add header
        this.addHeader(doc, invoice);
        
        // Add customer information
        this.addCustomerInfo(doc, customer);
        
        // Add invoice details
        this.addInvoiceDetails(doc, invoice);
        
        // Add items table
        this.addItemsTable(doc, invoice);
        
        // Add totals
        this.addTotals(doc, invoice);
        
        // Add footer
        this.addFooter(doc);
        
        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }
  
  private static addHeader(doc: PDFKit.PDFDocument, invoice: Invoice) {
    doc
      .fontSize(20)
      .text('INVOICE', 50, 50)
      .fontSize(10)
      .text(`Invoice #: ${invoice.invoiceNumber}`, 50, 80)
      .text(`Issue Date: ${formatDate(invoice.issueDate)}`, 50, 95)
      .text(`Due Date: ${formatDate(invoice.dueDate)}`, 50, 110);
  }
  
  private static addCustomerInfo(doc: PDFKit.PDFDocument, customer: Customer) {
    doc
      .fontSize(12)
      .text('Bill To:', 350, 80)
      .fontSize(10)
      .text(customer.name, 350, 95)
      .text(customer.email, 350, 110);
    
    if (customer.address) {
      doc.text(customer.address.street, 350, 125);
      doc.text(`${customer.address.city}, ${customer.address.state} ${customer.address.pincode}`, 350, 140);
      doc.text(customer.address.country, 350, 155);
    }
  }
  
  private static addInvoiceDetails(doc: PDFKit.PDFDocument, invoice: Invoice) {
    doc
      .fontSize(10)
      .text(`Status: ${invoice.status.toUpperCase()}`, 50, 140)
      .text(`Payment Terms: ${invoice.paymentTerms} days`, 50, 155);
  }
  
  private static addItemsTable(doc: PDFKit.PDFDocument, invoice: Invoice) {
    const tableTop = 200;
    
    // Table headers
    doc
      .fontSize(10)
      .text('Description', 50, tableTop)
      .text('Quantity', 250, tableTop)
      .text('Unit Price', 350, tableTop)
      .text('Amount', 450, tableTop);
    
    // Table rows
    let y = tableTop + 20;
    invoice.items.forEach(item => {
      doc
        .text(item.description, 50, y)
        .text(item.quantity.toString(), 250, y)
        .text(formatCurrency(item.unitPrice), 350, y)
        .text(formatCurrency(item.quantity * item.unitPrice), 450, y);
      
      y += 15;
    });
  }
  
  private static addTotals(doc: PDFKit.PDFDocument, invoice: Invoice) {
    const totalsY = 400;
    
    doc
      .fontSize(10)
      .text('Subtotal:', 350, totalsY)
      .text(formatCurrency(invoice.subtotal), 450, totalsY)
      .text('Tax:', 350, totalsY + 15)
      .text(formatCurrency(invoice.taxAmount), 450, totalsY + 15)
      .fontSize(12)
      .text('Total:', 350, totalsY + 35)
      .text(formatCurrency(invoice.totalAmount), 450, totalsY + 35);
  }
  
  private static addFooter(doc: PDFKit.PDFDocument) {
    doc
      .fontSize(8)
      .text('Thank you for your business!', 50, 500)
      .text('Terms & Conditions apply', 50, 515);
  }
}
