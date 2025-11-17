import { DeepPartial,In } from "typeorm";
import { AppDataSource } from '../../config/database';
import { Customer,CustomerType} from "../../entities/Customer";
import { Tenant } from "../../entities/Tenant";
import { User ,UserRole } from "../../entities/User";
import { Subscription } from "../../entities/Subscription";
import { CacheService } from '../../services/cache/CacheService';


export class ProfessionalRequestService {
  private customerRepo = AppDataSource.getRepository(Customer);
  private tenantRepo = AppDataSource.getRepository(Tenant);
  private userRepo = AppDataSource.getRepository(User);
  private subscriptionRepo = AppDataSource.getRepository(Subscription);
  private cacheService = new CacheService();

async createRequest(user: any, requestedId: string, message?: string) {
  // Prevent duplicate requests in either direction
const existingRequest1 = await this.customerRepo.findOne({
  where: {
    requestedBy: { id: user.id },
    requestedTo: { id: requestedId },
  },
});

const existingRequest2 = await this.customerRepo.findOne({
  where: {
    requestedBy: { id: requestedId },
    requestedTo: { id: user.id },
  },
});

  if (existingRequest1 || existingRequest2) {
    throw new Error("Request already exists between these users");
  }

  let newCustomer: Customer;

  // === If Professional User ===
  if (user.role === UserRole.PROFESSIONAL) {
    const requestedUser = await this.userRepo.findOne({ where: { id: requestedId } });
    if (!requestedUser) throw new Error("Requested professional not found");

    const requestedTenant = await this.tenantRepo.findOne({ where: { id: requestedUser.tenantId } });
    if (!requestedTenant) throw new Error("Requested user's tenant not found");

    const requesterTenant = await this.tenantRepo.findOne({ where: { id: user.tenantId } });
    if (!requesterTenant) throw new Error("Requester tenant not found");

    newCustomer = this.customerRepo.create({
      name: requestedTenant.name,
      email: requestedUser.email,
      phone:  null,
      type: CustomerType.BUSINESS,
      tenant: requesterTenant,
      metadata: { requestedBy: user.id, requestedId, message },
      isActive: true,
      creditBalance: 0,
      gstin: requestedTenant.gst || null,
      pan: requestedTenant.pan || null,
      billingAddress: null,
      shippingAddress: null,
      status: "Pending",
      requestedBy: user.id,
      requestedTo: requestedId,
    } as unknown as DeepPartial<Customer>);
  } 
  
  // === If Normal User ===
  else {
    const requesterTenant = await this.tenantRepo.findOne({ where: { id: user.tenantId } });
    if (!requesterTenant) throw new Error("Requester tenant not found");

    const requestedUser = await this.userRepo.findOne({ where: { id: requestedId } });
    if (!requestedUser) throw new Error("Requested user not found");

    const requestedTenant = await this.tenantRepo.findOne({ where: { id: requestedUser.tenantId } });
    if (!requestedTenant) throw new Error("Requested user's tenant not found");

    newCustomer = this.customerRepo.create({
      name: requesterTenant.name,
      email: user.email,
      phone: user.phone || null,
      type: CustomerType.BUSINESS,
      tenant: requestedTenant,
      metadata: { requestedBy: user.id, requestedId, message },
      isActive: true,
      creditBalance: 0,
      gstin: requesterTenant.gst || null,
      pan: requesterTenant.pan || null,
      billingAddress: null,
      shippingAddress: null,
      status: "Pending",
      requestedBy: { id: user.id } as User,
      requestedTo: { id: requestedId } as User,
    } as unknown as DeepPartial<Customer>);
  }

      await Promise.all([
        this.cacheService.invalidatePattern(`customers:${user.tenantId}:*`),
this.cacheService.invalidatePattern(`cache:${user.tenantId}:/api/customers*`),
        this.cacheService.invalidatePattern(`dashboard:${user.tenantId}`)
      ]);
  return await this.customerRepo.save(newCustomer);



}


async getRequests(user: any) {
 // console.log("user", user);
  return this.customerRepo.find({
    where: [
      { status: In(["Pending", "Rejected"]), requestedBy: { id: user.id } },
      { status: In(["Pending", "Rejected"]), requestedTo: { id: user.id } },
    ],
    relations: ["requestedBy", "requestedTo"],
    order: { createdAt: "DESC" },
  });
}


async getProfessionals(user: User) {
  const today = new Date();

  if (user.role === UserRole.PROFESSIONAL) {
    // CASE 1: PROFESSIONAL → get all tenants with active subscriptions
const today = new Date();

const tenants = await this.tenantRepo
  .createQueryBuilder("tenant")
  .innerJoin("tenant.subscriptions", "subscription", "subscription.endDate > :today", { today })
 .where("(tenant.accountType IS NULL OR tenant.accountType != :accountType)", {
  accountType: "professional",
})
  .orderBy("tenant.name", "ASC")
  .getMany();

  //console.log("tenants", tenants);
const result = [];

for (const tenant of tenants) {
  // fetch the first active admin user for each tenant
  const user = await this.userRepo
    .createQueryBuilder("u")
    .where("u.tenantId = :tenantId", { tenantId: tenant.id })
    .andWhere("u.role = :adminRole", { adminRole: UserRole.ADMIN })
    .andWhere("u.status = :status", { status: "active" })
    .orderBy("u.createdAt", "ASC")
    .getOne();
if(user){
  result.push({
    tenantId: tenant.id,
    tenantName: tenant.name,
    id: user?.id || null,
    firstName: user?.firstName || null,
    lastName: user?.lastName || null,
    email: user?.email || null,
  });
  }
}

//console.log("tenantsWithAdmins", result);
return result;
  } else {
    // CASE 2: ADMIN → get PROFESSIONAL users with active tenant subscriptions
    const professionals = await this.userRepo
      .createQueryBuilder("user")
      .leftJoinAndSelect("user.tenant", "tenant")
      .leftJoinAndSelect("tenant.subscriptions", "subscription")
      .where("user.role = :role", { role: UserRole.PROFESSIONAL })
      .andWhere("subscription.endDate > :today", { today })
      .orderBy("user.firstName", "ASC")
      .getMany();

    return professionals.map((p) => ({
      id: p.id,
      firstName: p.firstName,
      lastName: p.lastName,
      email: p.email,
      tenantId: p.tenant?.id,
      tenantName: p.tenant?.name,
    }));
  }
}


// async getProfessionals(user: any) {
//   const today = new Date();

//   if (user.role === UserRole.PROFESSIONAL) {
//    // console.log("CASE 1: PROFESSIONAL → get all tenants with active subscriptions");

//     // Subquery: select the FIRST admin (lowest id or earliest createdAt) per tenant
//     const subQuery = this.userRepo
//       .createQueryBuilder("u")
//       .select("u.id")
//       .where("u.role = :role", { role: "admin" })
//       .andWhere("u.status = :status", { status: "active" })
//       .andWhere("u.tenantId = tenant.id")
//       .orderBy("u.createdAt", "ASC") // ✅ safer than MIN() for UUIDs
//       .limit(1);

//     const tenants = await this.tenantRepo
//       .createQueryBuilder("tenant")
//       // .leftJoin("tenant.subscriptions", "subscription")
//      .leftJoin(Subscription, "subscription", "subscription.tenantId = tenant.id")
//       .leftJoin(
//         User,
//         "user",
//         `user.id = (${subQuery.getQuery()})`
//       )
//       .setParameters(subQuery.getParameters())
//        .where("subscription.endDate > :today", { today })
//      .where("tenant.accountType <> :accountType", { accountType: "professional" })
//       .select([
//         "tenant.id AS tenantId",
//         "tenant.name AS tenantName",
//         "user.id AS id",
//         "user.firstName AS firstName",
//         "user.lastName AS lastName",
//         "user.email AS email",
//       ])
//       .orderBy("tenant.name", "ASC")
//       .getRawMany();

//       console.log("tenants", tenants);

//     return tenants.map((t: any) => ({
//       id: t.id,
//       firstName: t.firstname,
//       lastName: t.lastname,
//       email: t.email,
//       tenantId: t.tenantid,
//       tenantName: t.tenantname,
//     }));
//   } else {
//    // console.log("CASE 2: ADMIN → get PROFESSIONAL users with active tenant subscriptions");

//     const professionals = await this.userRepo
//       .createQueryBuilder("user")
//       .leftJoin("user.tenant", "tenant")
//       .leftJoin("tenant.subscriptions", "subscription")
//       .where("user.role = :role", { role: UserRole.PROFESSIONAL })
//       .andWhere("subscription.endDate > :today", { today })
//       .select([
//         "user.id AS id",
//         "user.firstName AS firstName",
//         "user.lastName AS lastName",
//         "user.email AS email",
//         "tenant.id AS tenantId",
//         "tenant.name AS tenantName",
//       ])
//       .orderBy("user.firstName", "ASC")
//       .getRawMany();

//     return professionals.map((p: any) => ({
//       id: p.id,
//       firstName: p.firstname,
//       lastName: p.lastname,
//       email: p.email,
//       tenantId: p.tenantid,
//       tenantName: p.tenantname,
//     }));
//   }
// }






  async updateStatus(customerId: string, status: string) {
    const customer = await this.customerRepo.findOne({ where: { id: customerId } });
    if (!customer) throw new Error("Customer not found");

    customer.status = status;
    return await this.customerRepo.save(customer);
  }
}
