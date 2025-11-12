import { Repository, ILike, IsNull } from "typeorm";
import { AppDataSource } from "../../config/database";
import { User,UserStatus } from "../../entities/User";
import logger from "../../utils/logger";
import * as bcrypt from "bcryptjs";
import { PaginatedResponse } from "../../types/customTypes";

export class UserService {
  private userRepository: Repository<User>;

  constructor() {
    this.userRepository = AppDataSource.getRepository(User);
  }

  // ✅ Create new user
  async createUser(tenantId: string, userData: Partial<User>): Promise<User> {
    try {
      const existingUser = await this.userRepository.findOne({
        where: { email: userData.email, tenantId },
      });

      if (existingUser) throw new Error("User with this email already exists");

      const user = this.userRepository.create({ ...userData, tenantId });
      const savedUser = await this.userRepository.save(user);

      return await this.userRepository.findOneOrFail({
        where: { id: savedUser.id },
        relations: ["tenant"],
      });
    } catch (error) {
      logger.error("Error creating user:", error);
      throw error;
    }
  }

  // ✅ Get single user
  async getUser(tenantId: string, userId: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: userId, tenantId },
      relations: ["tenant"],
    });
    if (!user) throw new Error("User not found");
    return user;
  }

  // ✅ Get paginated users
  async getUsers(tenantId: string, options: { page: number; limit: number; search?: string }): Promise<PaginatedResponse<User>> {
    const { page, limit, search } = options;
    const skip = (page - 1) * limit;

    const whereConditions = search
      ? [
          { tenantId, firstName: ILike(`%${search}%`) },
          { tenantId, lastName: ILike(`%${search}%`) },
          { tenantId, email: ILike(`%${search}%`) },
        ]
      : { tenantId };

    const [users, total] = await this.userRepository.findAndCount({
      where: whereConditions,
      skip,
      take: limit,
      order: { createdAt: "DESC" },
    });

    return {
      data: users,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    };
  }

  // ✅ Update user
  async updateUser(tenantId: string, userId: string, updates: Partial<User>): Promise<User> {
    const user = await this.getUser(tenantId, userId);
    Object.assign(user, updates);
    await this.userRepository.save(user);

    return this.userRepository.findOneOrFail({ where: { id: userId }, relations: ["tenant"] });
  }

  // ✅ Soft delete user
  async deleteUser(tenantId: string, userId: string): Promise<void> {
    const user = await this.getUser(tenantId, userId);
 user.status = UserStatus.SUSPENDED;
    await this.userRepository.save(user);
  }

  // ✅ Admin password reset
  async resetPassword(tenantId: string, userId: string, newPassword: string): Promise<User> {
    const user = await this.getUser(tenantId, userId);
    user.password = await bcrypt.hash(newPassword, 12);
    await this.userRepository.save(user);
    return user;
  }
}
