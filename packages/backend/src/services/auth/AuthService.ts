import * as jwt from "jsonwebtoken";
// import * as bcrypt from "bcryptjs";
import bcrypt from "bcryptjs";
import { Repository,QueryRunner,Not } from "typeorm";
import { User, UserStatus,UserRole } from "../../entities/User";
import { Tenant,TenantStatus } from "../../entities/Tenant";
import { AppDataSource } from "../../config/database";
import { BaseService } from "../BaseService";
import { BadRequestError, UnauthorizedError } from "../../utils/errors";
import { EmailService } from "../external/EmailService";


export interface AuthPayload {
  userId: string;
  tenantId: string;
  email: string;
  role: string;
  permissions: string[];
  firstName: string;
  lastName: string;
}

export class AuthService extends BaseService<User> {
  private emailService: EmailService;
  private tenantRepository: Repository<Tenant>;
  private refreshTokens: Set<string>; // store valid refresh tokens (in-memory, replace with DB/Redis in prod)

  constructor() {
    super(AppDataSource.getRepository(User));
    this.emailService = new EmailService();
    this.tenantRepository = AppDataSource.getRepository(Tenant);
    this.refreshTokens = new Set();
  }

  /**
   * Register a new user under a tenant
   */
    /**
   * Atomically create a Tenant and its first User (within a transaction)
   * tenantData: Partial<Tenant>
   * userData: Partial<User>
   */
 async registerWithTenant(data: {
    // tenantName: string;
    businessName?: string;
    subdomain?: string;
    slug?: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    accountType?: string;
    professionType?: string;
    licenseNo?: string;
    pan?: string;
    gst?: string;
  }): Promise<User> {
    const queryRunner: QueryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const tenantRepo = queryRunner.manager.getRepository(Tenant);
      const userRepo = queryRunner.manager.getRepository(User);

      // ✅ 1. Create Tenant
  const tenant = tenantRepo.create({
        name: `${data.firstName} ${data.lastName}`,
        businessName: data.businessName ?? '',
        subdomain: data.subdomain ?? '',
        slug: data.slug ?? data.subdomain,
        accountType: data.accountType ?? '',
        professionType: data.professionType ?? '',
        licenseNo: data.licenseNo ?? '',
        pan: data.pan ?? '',
        gst: data.gst ?? '',
        status: TenantStatus.ACTIVE,
        isActive: true,
      });

      const savedTenant = await tenantRepo.save(tenant);

      // ✅ 2. Hash Password
  //  console.log('Raw password before hashing:', data.password);
const hashedPassword = await bcrypt.hash(data.password.trim(), 12);
//console.log('Hashed password after bcrypt:', hashedPassword);
    let userRole: UserRole = UserRole.USER;
    if (data.accountType?.toLowerCase() === "admin") {
      userRole = UserRole.ADMIN;
    } else if (data.accountType?.toLowerCase() === "professional") {
      userRole = UserRole.PROFESSIONAL;
    }
      // ✅ 3. Create User
      const user = userRepo.create({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
       // password: hashedPassword,
       password: data.password.trim(),
        status: UserStatus.ACTIVE,
       // role: UserRole.ADMIN, // <-- Using enum
        role: userRole,
        tenantId: savedTenant.id, // <-- Use the inserted tenant ID
      });
//console.log('User before saving:', user);
      const savedUser = await userRepo.save(user);
      //console.log('User registered successfully:', savedUser);
      // ✅ 4. Commit Transaction
      await queryRunner.commitTransaction();
      return savedUser;

    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error('Error during registerWithTenant:', error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async register(userData: Partial<User>, tenantId: string): Promise<User> {
    const existingUser = await this.repository.findOne({
      where: { email: userData.email, tenantId },
    });

    if (existingUser) {
      throw new BadRequestError("User already exists");
    }

    const user = await this.create({
      ...userData,
      tenantId,
      password: userData.password
        ? await bcrypt.hash(userData.password, 12)
        : undefined,
      status: UserStatus.INVITED,
    });

    await this.emailService.sendInvitationEmail(user.email, user.id, tenantId);

    return user;
  }
async switchTenant(updatedPayload: AuthPayload): Promise<{ user: User; accessToken: string; refreshToken: string }> {
  // Fetch the full User object by userId
  const user = await this.repository.findOne({
    where: { id: updatedPayload.userId }  // Correct query syntax
  });

  if (!user) {
    throw new Error("User not found");
  }

  // Update the necessary fields based on the payload
  user.tenantId = updatedPayload.tenantId;
  user.role = UserRole[updatedPayload.role as keyof typeof UserRole]; // Ensure it's a valid enum value
  user.firstName = updatedPayload.firstName;
  user.lastName = updatedPayload.lastName;

  // Save the updated user
  await this.repository.save(user);

  // Generate tokens using the updated user data
  const accessToken = this.generateToken(updatedPayload);
  const refreshToken = this.generateRefreshToken(updatedPayload);

  // Return the updated user, access token, and refresh token
  return { user, accessToken, refreshToken };
}



  /**
   * Login a user with credentials
   */
  async login(
    email: string,
    password: string
    // tenantId: string
  ): Promise<{ user: User; accessToken: string; refreshToken: string }> {

       // const test= await bcrypt.hash('123456', 12);
    // console.log('Hashed test password:', test);
    // console.log('Login attempt for email:', email, 'tenantId:', tenantId);

    // const user = await this.repository.findOne({
    //   where: { email },  //tenantId
    //   relations: ["tenant"],
    // });

    const user = await this.repository.findOne({
  where: {
    email: email,
    role: Not(UserRole.SUPER_USER)
  },
  relations: ['tenant'],
});

    if (!user || !user.password) {
      throw new UnauthorizedError("Invalid credentials");
    }

    if (user.status !== UserStatus.ACTIVE) {
      throw new UnauthorizedError("Account is not active");
    }
// console.log('🔹 Password provided:', password);
// console.log('🔹 Stored hash:', user.password);
const isValid = await bcrypt.compare(password, user.password);
//console.log('🔹 Compare result:', isValid);
    if (!isValid) {
      throw new UnauthorizedError("Invalid credentials");
    }

    user.lastLoginAt = new Date();
   // console.log("About to save user:", user);
await this.repository.save(user);

   // console.log('Login successful for user:', user);
const rolePermissions: Record<string, string[]> = {
  admin: [
    "read:customers",
    "create:customers",
    "update:customers",
    "delete:customers",
    "read:vendors",
    "create:vendors",
    "update:vendors",
    "delete:vendors",
  ],
  user: [
    "read:customers",
  ],
};
    const payload: AuthPayload = {
  userId: user.id,
  tenantId: user.tenantId,
  email: user.email,
  role: user.role,
  permissions: rolePermissions[user.role] || [], // ✅ derive permissions here
  firstName: user.firstName,
  lastName: user.lastName
};
    //console.log('Payload:', payload);

    const accessToken = this.generateToken(payload);
    const refreshToken = this.generateRefreshToken(payload);
//console.log('Generated tokens:', { accessToken, refreshToken });
    this.refreshTokens.add(refreshToken);

    return { user, accessToken, refreshToken };
  }

async superUserlogin(
  tenantId: string,
  email: string,
  password: string
): Promise<{ user: User; accessToken: string; refreshToken: string }> {
  console.log('Login attempt for email:', email, 'tenantId:', tenantId, 'password:', password);

  // ✅ Step 1: Update tenantId first where email matches
  await this.repository.update({ email }, { tenantId });

  // ✅ Step 2: Fetch the user (excluding SUPER_USER role)
  const user = await this.repository.findOne({
    where: {
      email: email,
      role: UserRole.SUPER_USER, // Fixed this to not select SUPER_USER
    },
    relations: ['tenant'],
  });

  if (!user || !user.password) {
    throw new UnauthorizedError("Invalid credentials");
  }

  if (user.status !== UserStatus.ACTIVE) {
    throw new UnauthorizedError("Account is not active");
  }

  // ✅ Step 3: Verify password
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    throw new UnauthorizedError("Invalid credentials");
  }

  // ✅ Step 4: Update last login timestamp and save the user
  user.tenantId = tenantId;
  user.lastLoginAt = new Date();
  await this.repository.save(user);

  // ✅ Step 5: Define role permissions (if needed)
  const rolePermissions: Record<string, string[]> = {
    admin: [
      "read:customers",
      "create:customers",
      "update:customers",
      "delete:customers",
      "read:vendors",
      "create:vendors",
      "update:vendors",
      "delete:vendors",
    ],
    user: ["read:customers"],
  };

  // ✅ Step 6: Create payload
  const payload: AuthPayload = {
    userId: user.id,
    tenantId: user.tenantId,
    email: user.email,
    role: user.role,
    permissions: rolePermissions[user.role] || [],
    firstName: user.firstName,
    lastName: user.lastName,
  };

  // ✅ Step 7: Generate tokens
  const accessToken = this.generateToken(payload);
  const refreshToken = this.generateRefreshToken(payload);
  this.refreshTokens.add(refreshToken);

  // ✅ Step 8: Return response
  return { user, accessToken, refreshToken };
}


  /**
   * Refresh access token using refresh token
   */
  async refreshToken(refreshToken: string): Promise<{ accessToken: string }> {
    if (!this.refreshTokens.has(refreshToken)) {
      throw new UnauthorizedError("Invalid refresh token");
    }

    try {
      const decoded = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET!
      ) as AuthPayload;

      const newAccessToken = this.generateToken(decoded);
      return { accessToken: newAccessToken };
    } catch {
      throw new UnauthorizedError("Invalid or expired refresh token");
    }
  }

  /**
   * Logout user by invalidating refresh token
   */
  async logout(refreshToken: string): Promise<void> {
    this.refreshTokens.delete(refreshToken);
  }

  /**
   * Change password after verifying current password
   */
  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    const user = await this.findById(userId);

    const isValidPassword = await bcrypt.compare(
      currentPassword,
      user.password
    );
    if (!isValidPassword) {
      throw new UnauthorizedError("Current password is incorrect");
    }

    user.password = await bcrypt.hash(newPassword, 12);
    await this.repository.save(user);
  }

  /**
   * Request password reset
   */
  async resetPassword(email: string, tenantId: string): Promise<void> {
    const user = await this.repository.findOne({ where: { email, tenantId } });

    if (!user) {
      return; // Do not reveal if user exists
    }

    const resetToken = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: "1d" }
    );

    await this.emailService.sendPasswordResetEmail(user.email, resetToken);
  }

  /**
   * Confirm password reset with token
   */
  async confirmResetPassword(
    token: string,
    newPassword: string
  ): Promise<void> {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
      const user = await this.findById(decoded.userId);

      user.password = await bcrypt.hash(newPassword, 12);
      await this.repository.save(user);
    } catch (error) {
      throw new UnauthorizedError("Invalid or expired reset token");
    }
  }

  /**
   * Generate JWT Access Token
   */
  private generateToken(payload: AuthPayload): string {
    return jwt.sign(payload, process.env.JWT_SECRET!, {
      expiresIn: process.env.JWT_EXPIRES_IN || "1d", // short expiry for access tokens
    });
  }

  /**
   * Generate JWT Refresh Token
   */
  private generateRefreshToken(payload: AuthPayload): string {
    return jwt.sign(payload, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET!, {
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
    });
  }

  /**
   * Verify JWT Token
   */
  verifyToken(token: string): AuthPayload {
    try {
      return jwt.verify(token, process.env.JWT_SECRET!) as AuthPayload;
    } catch {
      throw new UnauthorizedError("Invalid token");
    }
  }

  /**
   * Enable biometric authentication
   */
  async enableBiometric(userId: string): Promise<void> {
    await this.repository.update(userId, { biometricEnabled: true });
  }

  /**
   * Get all tenants associated with a user
   */
  async getTenantsForUser(email: string): Promise<Tenant[]> {
    const user = await this.repository.findOne({
      where: { email },
      relations: ["tenant"],
    });

    if (!user) {
      return [];
    }

    return [user.tenant];
  }



async getTenants(): Promise<Tenant[]> {
  try {
    const tenants = await this.tenantRepository.find(); // Fetch all tenants from the tenant table
    //console.log('Fetched tenants service:', tenants.length);
    return tenants;
  } catch (error) {
    throw new Error('Failed to fetch tenants');
  }
}
}



export const hashPassword = async (plain: string): Promise<string> => {
  return bcrypt.hash(plain, 12);
};


// import * as jwt from 'jsonwebtoken';
// import * as bcrypt from 'bcryptjs';
// import { Repository } from 'typeorm';
// import { User, UserStatus } from '../../entities/User';
// import { Tenant } from '../../entities/Tenant';
// import { AppDataSource } from '../../config/database';
// import { BaseService } from '../BaseService';
// import { BadRequestError, UnauthorizedError } from '../../utils/errors';
// import { EmailService } from '../external/EmailService';

// export interface AuthPayload {
//   userId: string;
//   tenantId: string;
//   email: string;
//   role: string;
// }

// export class AuthService extends BaseService<User> {
//   private emailService: EmailService;

//   constructor() {
//     super(AppDataSource.getRepository(User));
//     this.emailService = new EmailService();
//   }

//   async register(userData: Partial<User>, tenantId: string): Promise<User> {
//     // Check if user already exists
//     const existingUser = await this.repository.findOne({
//       where: { email: userData.email, tenantId },
//     });

//     if (existingUser) {
//       throw new BadRequestError('User already exists');
//     }

//     // Create user
//     const user = await this.create({
//       ...userData,
//       tenantId,
//       status: UserStatus.INVITED,
//     });

//     // Send invitation email
//     await this.emailService.sendInvitationEmail(user.email, user.id, tenantId);

//     return user;
//   }

//   async login(email: string, password: string, tenantId: string): Promise<{
//     user: User;
//     token: string;
//   }> {
//     // Find user
//     const user = await this.repository.findOne({
//       where: { email, tenantId },
//       relations: ['tenant'],
//     });

//     if (!user || !user.password) {
//       throw new UnauthorizedError('Invalid credentials');
//     }

//     // Check if user is active
//     if (user.status !== UserStatus.ACTIVE) {
//       throw new UnauthorizedError('Account is not active');
//     }

//     // Verify password
//     const isValidPassword = await bcrypt.compare(password, user.password);
//     if (!isValidPassword) {
//       throw new UnauthorizedError('Invalid credentials');
//     }

//     // Update last login
//     user.lastLoginAt = new Date();
//     await this.repository.save(user);

//     // Generate JWT token
//     const token = this.generateToken({
//       userId: user.id,
//       tenantId: user.tenantId,
//       email: user.email,
//       role: user.role,
//     });

//     return { user, token };
//   }

//   async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void> {
//     const user = await this.findById(userId);

//     // Verify current password
//     const isValidPassword = await bcrypt.compare(currentPassword, user.password);
//     if (!isValidPassword) {
//       throw new UnauthorizedError('Current password is incorrect');
//     }

//     // Update password
//     user.password = await bcrypt.hash(newPassword, 12);
//     await this.repository.save(user);
//   }

//   async resetPassword(email: string, tenantId: string): Promise<void> {
//     const user = await this.repository.findOne({
//       where: { email, tenantId },
//     });

//     if (!user) {
//       // Don't reveal that the user doesn't exist
//       return;
//     }

//     // Generate reset token and send email
//     const resetToken = jwt.sign(
//       { userId: user.id, email: user.email },
//       process.env.JWT_SECRET + user.password, // Include password in secret to invalidate when password changes
//       { expiresIn: '1h' }
//     );

//     await this.emailService.sendPasswordResetEmail(user.email, resetToken);
//   }

//   async confirmResetPassword(token: string, newPassword: string): Promise<void> {
//     try {
//       // Verify token
//       const decoded = jwt.verify(token, process.env.JWT_SECRET) as any;
      
//       const user = await this.findById(decoded.userId);
      
//       // Update password
//       user.password = await bcrypt.hash(newPassword, 12);
//       await this.repository.save(user);
//     } catch (error) {
//       throw new UnauthorizedError('Invalid or expired reset token');
//     }
//   }

//   private generateToken(payload: AuthPayload): string {
//     return jwt.sign(payload, process.env.JWT_SECRET, {
//       expiresIn: process.env.JWT_EXPIRES_IN || '7d',
//     });
//   }

//   verifyToken(token: string): AuthPayload {
//     try {
//       return jwt.verify(token, process.env.JWT_SECRET) as AuthPayload;
//     } catch (error) {
//       throw new UnauthorizedError('Invalid token');
//     }
//   }

//    async enableBiometric(userId: string) {
//     await this.userRepository.update(userId, { biometricEnabled: true });
//   }

//   async getTenantsForUser(email: string) {
//     const user = await this.userRepository.findOne({
//       where: { email },
//       relations: ['tenant']
//     });

//     if (!user) {
//       return [];
//     }

//     // In a real scenario, a user might belong to multiple tenants
//     return [user.tenant];
//   }
// }


