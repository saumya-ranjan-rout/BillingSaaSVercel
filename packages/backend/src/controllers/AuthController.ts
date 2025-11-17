import { Request, Response } from 'express';
import { AuthService } from '../services/auth/AuthService';
import { Tenant } from "../entities/Tenant";
import { AppDataSource } from "../config/database";
export class AuthController {
  constructor(private authService: AuthService , private tenantRepo = AppDataSource.getRepository(Tenant)) {}


   async registerWithTenant(req: Request, res: Response): Promise<void> {
    try {
      const {
        // tenantName,
        businessName,
        subdomain,
        slug,
        firstName,
        lastName,
        email,
        password,
        accountType,
        professionType,
        licenseNo,
        pan,
        gst

      } = req.body;

      // ✅ Pass everything as one object
      const newUser = await this.authService.registerWithTenant({
        // tenantName,
        businessName,
        subdomain,
        slug,
        firstName,
        lastName,
        email,
        password,
        accountType,
        professionType,
        licenseNo,
        pan,
        gst
      });

      res.status(201).json({
        success: true,
        message: "Tenant and user created successfully",
        user: newUser, // ✅ newUser is a User entity
      });
    } catch (error: any) {
      console.error("Error in register controller:", error);
      res.status(500).json({
        success: false,
        message: error.message || "Registration failed",
      });
    }
  }
async meWithTenant(req: Request, res: Response) {
  try {
    const userData = req.user;
    //console.log('meWithTenant userData:', userData);
    if (!userData) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const tenant = await this.tenantRepo.findOne({
      where: { id: userData.tenantId }
    });

    if (!tenant) {
      return res.status(404).json({ message: "Tenant not found" });
    }

    // const professionals = await this.service.getProfessionals(user);
   //  res.json(user);
      res.json({ success: true, user: userData, tenant });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}
  async login(req: Request, res: Response) {
   // console.log('Login request body:', req.body);

    try {
      const { email, password } = req.body; //
      const result = await this.authService.login(email, password); //, tenantId

      res.json({
        success: true,
        user: result.user,
        //token: result.token,
        accessToken: result.accessToken,
  refreshToken: result.refreshToken,
      });

     // console.log('Login successful for user:', result.user);
    } catch (error: unknown) {
      console.error('Login error:', (error as Error).message);
      res.status(401).json({ error: (error as Error).message });
    }
  }
    async superUserlogin(req: Request, res: Response) {
    //console.log('Login request body:', req.body);

    try {
      const { tenant, email, password } = req.body; 
      //console.log('Login attempt for email:', email, 'tenantId:', tenant, 'password:', password);
      const result = await this.authService.superUserlogin(tenant, email, password); //, tenantId

      res.json({
        success: true,
        user: result.user,
        //token: result.token,
        accessToken: result.accessToken,
  refreshToken: result.refreshToken,
      });

     // console.log('Login successful for user:', result.user);
    } catch (error: unknown) {
      console.error('Login error:', (error as Error).message);
      res.status(401).json({ error: (error as Error).message });
    }
  }

  async register(req: Request, res: Response) {
    try {
      const { email, password,  tenantId } = req.body; //name,
      const user = await this.authService.register(
        { email, password }, //, name
        tenantId
      );
      res.status(201).json(user);
    } catch (error: unknown) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  async refreshToken(req: Request, res: Response) {
    try {
      const { refreshToken } = req.body;
      const tokens = await this.authService.refreshToken(refreshToken);
      res.json(tokens);
    } catch (error: unknown) {
      res.status(401).json({ error: (error as Error).message });
    }
  }

  async logout(req: Request, res: Response) {
    try {
      const { refreshToken } = req.body;
      await this.authService.logout(refreshToken);
      res.status(204).send();
    } catch (error: unknown) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  enableBiometric = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as any).user.id;
      await this.authService.enableBiometric(userId);
      res.json({ success: true, message: 'Biometric authentication enabled' });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to enable biometric authentication',
      });
    }
  };

  getTenantsForUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email } = req.params;
      const tenants = await this.authService.getTenantsForUser(email);
      res.json({ success: true, tenants });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch tenants',
      });
    }
  };

getTenants = async (req: Request, res: Response): Promise<void> => {
  try {
    const tenants = await this.authService.getTenants(); // Fetch all tenants from the service
    //console.log('Fetched tenants controller:', tenants.length);
    res.json(tenants);  // Send the tenants data in the response
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch tenants',
    });
  }
}
}







// import { Request, Response } from 'express';
// import { AuthService } from '../services/auth/AuthService';

// export class AuthController {
//   constructor(private authService: AuthService) {}

//   async login(req: Request, res: Response) {
//     try {
//       const { email, password, tenantId } = req.body;
//       const result = await this.authService.login(email, password, tenantId);
//       // res.json(result);
//             if (result.success) {
//         res.json(result);
//       } else {
//         res.status(401).json(result);
//       }
//     } catch (error) {
//       res.status(401).json({ error: error.message });
//     }
//   }

//   async register(req: Request, res: Response) {
//     try {
//       const { email, password, name, tenantId } = req.body;
//       const user = await this.authService.register({
//         email,
//         password,
//         name,
//         tenantId
//       });
//       res.status(201).json(user);
//     } catch (error) {
//       res.status(400).json({ error: error.message });
//     }
//   }

//   async refreshToken(req: Request, res: Response) {
//     try {
//       const { refreshToken } = req.body;
//       const tokens = await this.authService.refreshToken(refreshToken);
//       res.json(tokens);
//     } catch (error) {
//       res.status(401).json({ error: error.message });
//     }
//   }

//   async logout(req: Request, res: Response) {
//     try {
//       const { refreshToken } = req.body;
//       await this.authService.logout(refreshToken);
//       res.status(204).send();
//     } catch (error) {
//       res.status(400).json({ error: error.message });
//     }
//   }


//     enableBiometric = async (req: Request, res: Response): Promise<void> => {
//     try {
//       const userId = (req as any).user.id;
//       await this.authService.enableBiometric(userId);
//       res.json({ success: true, message: 'Biometric authentication enabled' });
//     } catch (error) {
//       res.status(500).json({ 
//         success: false, 
//         message: 'Failed to enable biometric authentication' 
//       });
//     }
//   };

//   getTenantsForUser = async (req: Request, res: Response): Promise<void> => {
//     try {
//       const { email } = req.params;
//       const tenants = await this.authService.getTenantsForUser(email);
//       res.json({ success: true, tenants });
//     } catch (error) {
//       res.status(500).json({ 
//         success: false, 
//         message: 'Failed to fetch tenants' 
//       });
//     }
//   };
// }
