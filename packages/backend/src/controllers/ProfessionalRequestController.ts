import { Request, Response } from "express";
import { ProfessionalRequestService } from "../services/professional/ProfessionalRequestService";

export class ProfessionalRequestController {
  private service = new ProfessionalRequestService();

  async createRequest(req: Request, res: Response) {
    try {
      const user = req.user; // from auth middleware
      const { requestedId, message } = req.body;
      const newCustomer = await this.service.createRequest(user, requestedId, message);
      res.status(201).json(newCustomer);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async getRequests(req: Request, res: Response) {
   // console.log("user", req.user);
    try {
      const user = req.user;
      const requests = await this.service.getRequests(user);

     // console.log("requests", requests);
      res.json(requests);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async getProfessionals(req: Request, res: Response) {
   // console.log("Hi user getProfessionals in ProfessionalRequestController", req.user);
    try {
      const user = req.user; // from auth middleware

      const professionals = await this.service.getProfessionals(user);
      res.json(professionals);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async updateStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const updated = await this.service.updateStatus(id, status);
      res.json(updated);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
}
