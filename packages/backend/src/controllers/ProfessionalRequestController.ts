import { Request, Response } from "express";
import { ProfessionalRequestService } from "../services/professional/ProfessionalRequestService";
import { User ,UserRole } from "../entities/User";
import { AppDataSource } from "../config/database";

export class ProfessionalRequestController {
  private service = new ProfessionalRequestService();
  private userRepo = AppDataSource.getRepository(User);

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
  try {
    const userData = req.user;
    if (!userData) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await this.userRepo.findOne({
      where: { id: userData.id },
      relations: ["tenant"],
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

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
