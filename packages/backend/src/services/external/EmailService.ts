import nodemailer from "nodemailer";
import { BadRequestError } from "../../utils/errors";

export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendInvitationEmail(to: string, userId: string, tenantId: string): Promise<void> {
    const invitationLink = `${process.env.FRONTEND_URL}/invite?token=${this.generateInvitationToken(
      userId,
      tenantId
    )}`;

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to,
      subject: "Invitation to join BillingSaaS",
      html: `
        <h2>You've been invited to join BillingSaaS</h2>
        <p>Click the link below to accept your invitation and set up your account:</p>
        <a href="${invitationLink}">Accept Invitation</a>
        <p>This link will expire in 24 hours.</p>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      throw new BadRequestError("Failed to send invitation email");
    }
  }

  async sendPasswordResetEmail(to: string, resetToken: string): Promise<void> {
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to,
      subject: "Password Reset Request",
      html: `
        <h2>Password Reset Request</h2>
        <p>Click the link below to reset your password:</p>
        <a href="${resetLink}">Reset Password</a>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this reset, please ignore this email.</p>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      throw new BadRequestError("Failed to send password reset email");
    }
  }

  async sendInvoiceEmail(to: string, invoiceId: string, pdfBuffer: Buffer): Promise<void> {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to,
      subject: "Your Invoice",
      html: `
        <h2>Invoice Attached</h2>
        <p>Please find your invoice attached to this email.</p>
        <p>Thank you for your business!</p>
      `,
      attachments: [
        {
          filename: `invoice-${invoiceId}.pdf`,
          content: pdfBuffer,
          contentType: "application/pdf",
        },
      ],
    };

    try {
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      throw new BadRequestError("Failed to send invoice email");
    }
  }

  private generateInvitationToken(userId: string, tenantId: string): string {
    // TODO: Replace with real JWT generation logic
    return "invitation-token";
  }
}



// // import * as nodemailer from 'nodemailer';
// import nodemailer from "nodemailer";
// import { BadRequestError } from '../../utils/errors';

// export class EmailService {
//   private transporter: nodemailer.Transporter;

//   constructor() {
//     this.transporter = nodemailer.createTransport({
//       host: process.env.SMTP_HOST,
//       port: parseInt(process.env.SMTP_PORT || '587'),
//       secure: false,
//       auth: {
//         user: process.env.SMTP_USER,
//         pass: process.env.SMTP_PASS,
//       },
//     });
//   }

//   async sendInvitationEmail(to: string, userId: string, tenantId: string): Promise<void> {
//     const invitationLink = `${process.env.FRONTEND_URL}/invite?token=${this.generateInvitationToken(userId, tenantId)}`;

//     const mailOptions = {
//       from: process.env.EMAIL_FROM,
//       to,
//       subject: 'Invitation to join BillingSaaS',
//       html: `
//         <h2>You've been invited to join BillingSaaS</h2>
//         <p>Click the link below to accept your invitation and set up your account:</p>
//         <a href="${invitationLink}">Accept Invitation</a>
//         <p>This link will expire in 24 hours.</p>
//       `,
//     };

//     try {
//       await this.transporter.sendMail(mailOptions);
//     } catch (error) {
//       throw new BadRequestError('Failed to send invitation email');
//     }
//   }

//   async sendPasswordResetEmail(to: string, resetToken: string): Promise<void> {
//     const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

//     const mailOptions = {
//       from: process.env.EMAIL_FROM,
//       to,
//       subject: 'Password Reset Request',
//       html: `
//         <h2>Password Reset Request</h2>
//         <p>Click the link below to reset your password:</p>
//         <a href="${resetLink}">Reset Password</a>
//         <p>This link will expire in 1 hour.</p>
//         <p>If you didn't request this reset, please ignore this email.</p>
//       `,
//     };

//     try {
//       await this.transporter.sendMail(mailOptions);
//     } catch (error) {
//       throw new BadRequestError('Failed to send password reset email');
//     }
//   }

//   async sendInvoiceEmail(to: string, invoiceId: string, pdfBuffer: Buffer): Promise<void> {
//     const mailOptions = {
//       from: process.env.EMAIL_FROM,
//       to,
//       subject: 'Your Invoice',
//       html: `
//         <h2>Invoice Attached</h2>
//         <p>Please find your invoice attached to this email.</p>
//         <p>Thank you for your business!</p>
//       `,
//       attachments: [
//         {
//           filename: `invoice-${invoiceId}.pdf`,
//           content: pdfBuffer,
//           contentType: 'application/pdf',
//         },
//       ],
//     };

//     try {
//       await this.transporter.sendMail(mailOptions);
//     } catch (error) {
//       throw new BadRequestError('Failed to send invoice email');
//     }
//   }

//   private generateInvitationToken(userId: string, tenantId: string): string {
//     // Implementation would generate a JWT token for invitation
//     return 'invitation-token'; // Placeholder
//   }
// }
