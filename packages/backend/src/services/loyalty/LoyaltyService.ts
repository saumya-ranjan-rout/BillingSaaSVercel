import { Repository } from 'typeorm'; 
import { AppDataSource } from '../../config/database'; 
import { LoyaltyProgram, RewardType, LoyaltyProgramStatus} from '../../entities/LoyaltyProgram'; 
import { CustomerLoyalty, LoyaltyTier } from '../../entities/CustomerLoyalty'; 
import { LoyaltyTransaction, TransactionType, TransactionStatus } from '../../entities/LoyaltyTransaction'; 
import { Customer } from '../../entities/Customer'; 
import { Invoice } from '../../entities/Invoice'; 
import logger from '../../utils/logger'; 


export class LoyaltyService { 
    private programRepository: Repository<LoyaltyProgram>; 
    private customerLoyaltyRepository: Repository<CustomerLoyalty>; 
    private transactionRepository: Repository<LoyaltyTransaction>; 
    private customerRepository: Repository<Customer>; 
    private invoiceRepository: Repository<Invoice>; 


    constructor() { 
        this.programRepository = AppDataSource.getRepository(LoyaltyProgram); 
        this.customerLoyaltyRepository = AppDataSource.getRepository(CustomerLoyalty); 
        this.transactionRepository = AppDataSource.getRepository(LoyaltyTransaction);
        this.customerRepository = AppDataSource.getRepository(Customer); 
        this.invoiceRepository = AppDataSource.getRepository(Invoice); 

    } 
        private safeNumber(value: any, defaultValue = 0): number {
        if (value === null || value === undefined || value === '') {
            return defaultValue;
        }
        
        // Handle string concatenation issues
        if (typeof value === 'string' && value.includes('.') && value.split('.').length > 2) {
            logger.warn(`Detected invalid numeric string: ${value}, using default: ${defaultValue}`);
            return defaultValue;
        }
        
        const num = Number(value);
        if (isNaN(num) || !isFinite(num)) {
            logger.warn(`Invalid number value: ${value}, using default: ${defaultValue}`);
            return defaultValue;
        }
        return num;
    }
            private roundToTwoDecimals(value: number): number {
        const num = this.safeNumber(value);
        return Math.round((num + Number.EPSILON) * 100) / 100;
    }

    private safeAdd(a: any, b: any): number {
        const numA = this.safeNumber(a);
        const numB = this.safeNumber(b);
        return this.roundToTwoDecimals(numA + numB);
    }

     async initializeDefaultProgram(tenantId: string): Promise<LoyaltyProgram> { 
        const existingProgram = await this.programRepository.findOne({ 
            where: { tenantId, isDefault: true } 
        }); 

        if (existingProgram) { 
            return existingProgram; 
        } 

        const defaultProgram = this.programRepository.create({ 
            name: 'Default Cashback Program', 
            description: '5% cashback on purchases above ₹10,000', 
            rewardType: RewardType.CASHBACK, 
            cashbackPercentage: 5.0, 
            minimumPurchaseAmount: 10000.0, 
            maximumCashbackAmount: 5000.0,
            eligibilityCriteria: { minimumOrderValue: 10000.0 }, 
            isDefault: true, 
            tenantId 
        }); 

        return await this.programRepository.save(defaultProgram); 
    } 


      async calculateCashback( 
        tenantId: string, 
        customerId: string, 
        invoiceAmount: any // Accept any type but validate
    ): Promise<{ cashbackAmount: number; percentage: number }> { 
        try { 
            // Get active loyalty program for tenant 
            const program = await this.programRepository.findOne({ 
                where: { tenantId, status: LoyaltyProgramStatus.ACTIVE } 
            }) || await this.initializeDefaultProgram(tenantId); 

            // Validate and sanitize invoice amount
            const safeInvoiceAmount = this.safeNumber(invoiceAmount);
            
            // Check if invoice amount meets minimum threshold 
            if (safeInvoiceAmount < program.minimumPurchaseAmount) { 
                return { cashbackAmount: 0, percentage: 0 }; 
            } 

            // Calculate cashback amount 
            let cashbackAmount = (safeInvoiceAmount * program.cashbackPercentage) / 100; 

            // Apply maximum cashback limit if set 
            if (program.maximumCashbackAmount && cashbackAmount > program.maximumCashbackAmount) { 
                cashbackAmount = program.maximumCashbackAmount; 
            } 

            const roundedCashback = this.roundToTwoDecimals(cashbackAmount);
            
            logger.info(`Cashback calculation: amount=${safeInvoiceAmount}, percentage=${program.cashbackPercentage}, cashback=${roundedCashback}`);

            return { 
                cashbackAmount: roundedCashback,
                percentage: program.cashbackPercentage 
            }; 
        } catch (error) { 
            logger.error('Cashback calculation error:', error); 
            return { cashbackAmount: 0, percentage: 0 }; 
        } 
    } 


  async processInvoiceForLoyalty(invoiceId: string): Promise<void> { 
        const queryRunner = AppDataSource.createQueryRunner(); 
        await queryRunner.connect(); 
        await queryRunner.startTransaction(); 

        try { 
            const invoice = await this.invoiceRepository.findOne({ 
                where: { id: invoiceId }, 
                relations: ['customer'] 
            }); 

            if (!invoice || !invoice.customer) { 
                throw new Error('Invoice or customer not found'); 
            }

            // Validate invoice amount with detailed logging
            logger.info(`Processing loyalty for invoice: ${invoiceId}, totalAmount: ${invoice.totalAmount}, type: ${typeof invoice.totalAmount}`);

            const { cashbackAmount, percentage } = await this.calculateCashback( 
                invoice.tenantId, 
                invoice.customer.id, 
                invoice.totalAmount 
            ); 

            if (cashbackAmount > 0) { 
                // Create loyalty transaction 
                const transaction = this.transactionRepository.create({ 
                    customerId: invoice.customer.id, 
                    invoiceId: invoice.id, 
                    type: TransactionType.EARN, 
                    status: TransactionStatus.COMPLETED, 
                    cashbackAmount: cashbackAmount,
                    orderAmount: this.safeNumber(invoice.totalAmount),
                    effectivePercentage: percentage, 
                    description: `Cashback earned on invoice ${invoice.invoiceNumber}`, 
                    tenantId: invoice.tenantId 
                }); 

                await queryRunner.manager.save(transaction); 

                // Update customer loyalty record 
                let customerLoyalty = await this.customerLoyaltyRepository.findOne({ 
                    where: { customerId: invoice.customer.id, tenantId: invoice.tenantId } 
                }); 

                if (!customerLoyalty) { 
                    customerLoyalty = this.customerLoyaltyRepository.create({ 
                        customerId: invoice.customer.id, 
                        tenantId: invoice.tenantId, 
                        totalAmountSpent: 0, 
                        totalOrders: 0,
                        availableCashback: 0,
                        totalCashbackEarned: 0,
                        currentTier: LoyaltyTier.BRONZE,
                        tierBenefits: {},
                        lastActivityDate: new Date()
                    }); 
                } 

                // Use safe addition for all numeric operations
                const currentTotalSpent = this.safeNumber(customerLoyalty.totalAmountSpent);
                const currentTotalOrders = this.safeNumber(customerLoyalty.totalOrders);
                const currentAvailableCashback = this.safeNumber(customerLoyalty.availableCashback);
                const currentTotalCashbackEarned = this.safeNumber(customerLoyalty.totalCashbackEarned);

                customerLoyalty.totalAmountSpent = this.safeAdd(currentTotalSpent, invoice.totalAmount);
                customerLoyalty.totalOrders = currentTotalOrders + 1;
                customerLoyalty.availableCashback = this.safeAdd(currentAvailableCashback, cashbackAmount);
                customerLoyalty.totalCashbackEarned = this.safeAdd(currentTotalCashbackEarned, cashbackAmount);
                customerLoyalty.lastActivityDate = new Date(); 

                // Log the values before saving
                logger.info(`Customer loyalty update - totalSpent: ${customerLoyalty.totalAmountSpent}, availableCashback: ${customerLoyalty.availableCashback}, totalCashbackEarned: ${customerLoyalty.totalCashbackEarned}`);

                // Update tier based on spending 
                await this.updateCustomerTier(customerLoyalty); 
                await queryRunner.manager.save(customerLoyalty); 

                logger.info(`Processed cashback of ₹${cashbackAmount} for customer ${invoice.customer.id}`); 
            } else {
                logger.info(`No cashback earned for invoice ${invoiceId} - amount below threshold`);
            }

            await queryRunner.commitTransaction(); 
        } catch (error) { 
            await queryRunner.rollbackTransaction(); 
            logger.error('Invoice loyalty processing error:', error); 
            throw error; 
        } finally { 
            await queryRunner.release(); 
        } 
    } 

       async updateCustomerTier(customerLoyalty: CustomerLoyalty): Promise<void> { 
        const tiers = [ 
            { threshold: 50000, tier: LoyaltyTier.SILVER, benefits: { cashbackBonus: 1 } }, 
            { threshold: 100000, tier: LoyaltyTier.GOLD, benefits: { cashbackBonus: 2, prioritySupport: true } }, 
            { threshold: 250000, tier: LoyaltyTier.PLATINUM, benefits: { cashbackBonus: 3, dedicatedAccountManager: true } } 
        ]; 

        let newTier = LoyaltyTier.BRONZE; 
        let tierBenefits = {}; 

        // Use safe number for comparison
        const totalSpent = this.safeNumber(customerLoyalty.totalAmountSpent);

        // Find the highest tier customer qualifies for 
        for (const tier of tiers.reverse()) { 
            if (totalSpent >= tier.threshold) { 
                newTier = tier.tier; 
                tierBenefits = tier.benefits; 
                break; 
            } 
        } 

        if (newTier !== customerLoyalty.currentTier) { 
            customerLoyalty.currentTier = newTier; 
            customerLoyalty.tierBenefits = tierBenefits; 
            customerLoyalty.tierExpiryDate = new Date(); 
            customerLoyalty.tierExpiryDate.setFullYear(customerLoyalty.tierExpiryDate.getFullYear() + 1);
        } 
    } 

       async redeemCashback( 
        tenantId: string, 
        customerId: string, 
        redeemAmount: number, 
        invoiceId?: string 
    ): Promise<LoyaltyTransaction> { 
        const queryRunner = AppDataSource.createQueryRunner(); 
        await queryRunner.connect(); 
        await queryRunner.startTransaction(); 

        try { 
            const customerLoyalty = await this.customerLoyaltyRepository.findOne({ 
                where: { customerId, tenantId } 
            }); 

            if (!customerLoyalty || customerLoyalty.availableCashback < redeemAmount) { 
                throw new Error('Insufficient cashback balance'); 
            } 

            // Create redemption transaction 
            const transaction = this.transactionRepository.create({ 
                customerId, 
                invoiceId, 
                type: TransactionType.REDEEM, 
                status: TransactionStatus.COMPLETED, 
                cashbackAmount: -redeemAmount,
                description: `Cashback redemption${invoiceId ? ` for invoice ${invoiceId}` : ''}`, 
                tenantId 
            }); 

            await queryRunner.manager.save(transaction); 

            // Update customer loyalty balance 
            customerLoyalty.availableCashback = this.safeAdd(customerLoyalty.availableCashback, -redeemAmount);
            customerLoyalty.lastActivityDate = new Date(); 
            await queryRunner.manager.save(customerLoyalty); 

            await queryRunner.commitTransaction(); 
            return transaction; 
        } catch (error) { 
            await queryRunner.rollbackTransaction(); 
            logger.error('Cashback redemption error:', error); 
            throw error; 
        } finally { 
            await queryRunner.release(); 
        } 
    } 


        async getCustomerLoyaltySummary(tenantId: string, customerId: string): Promise<any> { 
        const customerLoyalty = await this.customerLoyaltyRepository.findOne({ 
            where: { customerId, tenantId } 
        }); 

        const transactions = await this.transactionRepository.find({ 
            where: { customerId, tenantId }, 
            order: { createdAt: 'DESC' }, 
            take: 10 
        }); 

        const program = await this.programRepository.findOne({ 
            where: { tenantId, status: LoyaltyProgramStatus.ACTIVE } 
        }); 

        return { 
            summary: customerLoyalty, 
            recentTransactions: transactions, 
            program: program 
        }; 
    } 


      async updateLoyaltyProgram( 
        tenantId: string, 
        programId: string, 
        updates: Partial<LoyaltyProgram> 
    ): Promise<LoyaltyProgram> { 
        const program = await this.programRepository.findOne({ 
            where: { id: programId, tenantId } 
        }); 

        if (!program) { 
            throw new Error('Loyalty program not found'); 
        } 

        Object.assign(program, updates); 
        return await this.programRepository.save(program); 
    } 



      async getProgramStatistics(tenantId: string, programId: string): Promise<any> { 
        const program = await this.programRepository.findOne({ 
            where: { id: programId, tenantId } 
        }); 

        const totalCustomers = await this.customerLoyaltyRepository.count({ 
            where: { tenantId } 
        }); 

        const totalCashback = await this.transactionRepository 
            .createQueryBuilder('transaction') 
            .select('SUM(transaction.cashbackAmount)', 'totalCashback') 
            .where('transaction.tenantId = :tenantId', { tenantId }) 
            .andWhere('transaction.type = :type', { type: TransactionType.EARN }) 
            .andWhere('transaction.status = :status', { status: TransactionStatus.COMPLETED }) 
            .getRawOne(); 

        const redemptionRate = await this.transactionRepository 
            .createQueryBuilder('transaction') 
            .select('COUNT(DISTINCT transaction.customerId)', 'redeemingCustomers') 
            .where('transaction.tenantId = :tenantId', { tenantId }) 
            .andWhere('transaction.type = :type', { type: TransactionType.REDEEM }) 
            .getRawOne(); 

        return { 
            program, 
            statistics: { 
                totalCustomers, 
                totalCashback: this.safeNumber(totalCashback.totalCashback), 
                redemptionRate: totalCustomers > 0 ? (redemptionRate.redeemingCustomers / totalCustomers) * 100 : 0 
            } 
        }; 
    } 


       async getActiveProgram(tenantId: string): Promise<LoyaltyProgram> { 
        // Try to find an active program for the tenant 
        let program = await this.programRepository.findOne({ 
            where: { tenantId, status: LoyaltyProgramStatus.ACTIVE } 
        }); 

        // If none, initialize and return default program 
        if (!program) { 
            program = await this.initializeDefaultProgram(tenantId); 
        } 

        return program; 
    }



    /**
     * Round to 2 decimal places to avoid floating point precision issues
     */
    // private roundToTwoDecimals(value: number): number {
    //     if (isNaN(value) || !isFinite(value)) {
    //         logger.warn(`Attempted to round invalid value: ${value}`);
    //         return 0;
    //     }
    //     return Math.round((value + Number.EPSILON) * 100) / 100;
    // }


    /**
     * Safe number conversion with validation
     */
    // private safeNumber(value: any): number {
    //     const num = Number(value);
    //     if (isNaN(num) || !isFinite(num)) {
    //         logger.warn(`Invalid number value: ${value}`);
    //         return 0;
    //     }
    //     return num;
    // }



}




























































// import { Repository } from 'typeorm';
// import { AppDataSource } from '../../config/database';
// import { LoyaltyProgram, RewardType, LoyaltyProgramStatus} from '../../entities/LoyaltyProgram';
// import { CustomerLoyalty, LoyaltyTier } from '../../entities/CustomerLoyalty';
// import { LoyaltyTransaction, TransactionType, TransactionStatus } from '../../entities/LoyaltyTransaction';
// import { Customer } from '../../entities/Customer';
// import { Invoice } from '../../entities/Invoice';
// import logger from '../../utils/logger';

// export class LoyaltyService {
//   private programRepository: Repository<LoyaltyProgram>;
//   private customerLoyaltyRepository: Repository<CustomerLoyalty>;
//   private transactionRepository: Repository<LoyaltyTransaction>;
//   private customerRepository: Repository<Customer>;
//   private invoiceRepository: Repository<Invoice>;

//   constructor() {
//     this.programRepository = AppDataSource.getRepository(LoyaltyProgram);
//     this.customerLoyaltyRepository = AppDataSource.getRepository(CustomerLoyalty);
//   this.transactionRepository = AppDataSource.getRepository(LoyaltyTransaction); // fixed
//     this.customerRepository = AppDataSource.getRepository(Customer);
//     this.invoiceRepository = AppDataSource.getRepository(Invoice);
//   }

//   async initializeDefaultProgram(tenantId: string): Promise<LoyaltyProgram> {
//     const existingProgram = await this.programRepository.findOne({
//       where: { tenantId, isDefault: true }
//     });

//     if (existingProgram) {
//       return existingProgram;
//     }

//     const defaultProgram = this.programRepository.create({
//       name: 'Default Cashback Program',
//       description: '5% cashback on purchases above ₹10,000',
//       rewardType: RewardType.CASHBACK,
//       cashbackPercentage: 5.0,
//       minimumPurchaseAmount: 10000.0,
//       maximumCashbackAmount: 5000.0, // Max ₹5000 cashback
//       eligibilityCriteria: {
//         minimumOrderValue: 10000.0
//       },
//       isDefault: true,
//       tenantId
//     });

//     return await this.programRepository.save(defaultProgram);
//   }

//   async calculateCashback(
//     tenantId: string,
//     customerId: string,
//     invoiceAmount: number
//   ): Promise<{ cashbackAmount: number; percentage: number }> {
//     try {
//       // Get active loyalty program for tenant
//       const program = await this.programRepository.findOne({
//          where: { tenantId, status: LoyaltyProgramStatus.ACTIVE }
//       }) || await this.initializeDefaultProgram(tenantId);

//       // Check if invoice amount meets minimum threshold
//       if (invoiceAmount < program.minimumPurchaseAmount) {
//         return { cashbackAmount: 0, percentage: 0 };
//       }

//       // Calculate cashback amount
//       let cashbackAmount = (invoiceAmount * program.cashbackPercentage) / 100;

//       // Apply maximum cashback limit if set
//       if (program.maximumCashbackAmount && cashbackAmount > program.maximumCashbackAmount) {
//         cashbackAmount = program.maximumCashbackAmount;
//       }

//       return { 
//         cashbackAmount: Math.round(cashbackAmount * 100) / 100, // Round to 2 decimal places
//         percentage: program.cashbackPercentage 
//       };
//     } catch (error) {
//       logger.error('Cashback calculation error:', error);
//       return { cashbackAmount: 0, percentage: 0 };
//     }
//   }

//   async processInvoiceForLoyalty(invoiceId: string): Promise<void> {
//     const queryRunner = AppDataSource.createQueryRunner();
//     await queryRunner.connect();
//     await queryRunner.startTransaction();

//     try {
//       const invoice = await this.invoiceRepository.findOne({
//         where: { id: invoiceId },
//         relations: ['customer']
//       });

//       if (!invoice || !invoice.customer) {
//         throw new Error('Invoice or customer not found');
//       }

//       const { cashbackAmount, percentage } = await this.calculateCashback(
//         invoice.tenantId,
//         invoice.customer.id,
//         invoice.totalAmount
//       );

//       if (cashbackAmount > 0) {
//         // Create loyalty transaction
//         const transaction = this.transactionRepository.create({
//           customerId: invoice.customer.id,
//           invoiceId: invoice.id,
//           type: TransactionType.EARN,
//           status: TransactionStatus.COMPLETED,
//           cashbackAmount,
//           orderAmount: invoice.totalAmount,
//           effectivePercentage: percentage,
//           description: `Cashback earned on invoice ${invoice.invoiceNumber}`,
//           tenantId: invoice.tenantId
//         });

//         await queryRunner.manager.save(transaction);

//         // Update customer loyalty record
//         let customerLoyalty = await this.customerLoyaltyRepository.findOne({
//           where: { customerId: invoice.customer.id, tenantId: invoice.tenantId }
//         });

//         if (!customerLoyalty) {
//           customerLoyalty = this.customerLoyaltyRepository.create({
//             customerId: invoice.customer.id,
//             tenantId: invoice.tenantId,
//             totalAmountSpent: 0,
//             totalOrders: 0
//           });
//         }

//         customerLoyalty.totalAmountSpent += invoice.totalAmount;
//         customerLoyalty.totalOrders += 1;
//         customerLoyalty.availableCashback += cashbackAmount;
//         customerLoyalty.totalCashbackEarned += cashbackAmount;
//         customerLoyalty.lastActivityDate = new Date();

//         // Update tier based on spending
//         await this.updateCustomerTier(customerLoyalty);

//         await queryRunner.manager.save(customerLoyalty);

//         logger.info(`Processed cashback of ₹${cashbackAmount} for customer ${invoice.customer.id}`);
//       }

//       await queryRunner.commitTransaction();
//     } catch (error) {
//       await queryRunner.rollbackTransaction();
//       logger.error('Invoice loyalty processing error:', error);
//       throw error;
//     } finally {
//       await queryRunner.release();
//     }
//   }

//   async updateCustomerTier(customerLoyalty: CustomerLoyalty): Promise<void> {
//     const tiers = [
//       { threshold: 50000, tier: LoyaltyTier.SILVER, benefits: { cashbackBonus: 1 } },
//       { threshold: 100000, tier: LoyaltyTier.GOLD, benefits: { cashbackBonus: 2, prioritySupport: true } },
//       { threshold: 250000, tier: LoyaltyTier.PLATINUM, benefits: { cashbackBonus: 3, dedicatedAccountManager: true } }
//     ];

//     let newTier = LoyaltyTier.BRONZE;
//     let tierBenefits = {};

//     // Find the highest tier customer qualifies for
//     for (const tier of tiers.reverse()) {
//       if (customerLoyalty.totalAmountSpent >= tier.threshold) {
//         newTier = tier.tier;
//         tierBenefits = tier.benefits;
//         break;
//       }
//     }

//     if (newTier !== customerLoyalty.currentTier) {
//       customerLoyalty.currentTier = newTier;
//       customerLoyalty.tierBenefits = tierBenefits;
//       customerLoyalty.tierExpiryDate = new Date();
//       customerLoyalty.tierExpiryDate.setFullYear(customerLoyalty.tierExpiryDate.getFullYear() + 1); // 1 year validity
//     }
//   }

//   async redeemCashback(
//     tenantId: string,
//     customerId: string,
//     redeemAmount: number,
//     invoiceId?: string
//   ): Promise<LoyaltyTransaction> {
//     const queryRunner = AppDataSource.createQueryRunner();
//     await queryRunner.connect();
//     await queryRunner.startTransaction();

//     try {
//       const customerLoyalty = await this.customerLoyaltyRepository.findOne({
//         where: { customerId, tenantId }
//       });

//       if (!customerLoyalty || customerLoyalty.availableCashback < redeemAmount) {
//         throw new Error('Insufficient cashback balance');
//       }

//       // Create redemption transaction
//       const transaction = this.transactionRepository.create({
//         customerId,
//         invoiceId,
//         type: TransactionType.REDEEM,
//         status: TransactionStatus.COMPLETED,
//         cashbackAmount: -redeemAmount,
//         description: `Cashback redemption${invoiceId ? ` for invoice ${invoiceId}` : ''}`,
//         tenantId
//       });

//       await queryRunner.manager.save(transaction);

//       // Update customer loyalty balance
//       customerLoyalty.availableCashback -= redeemAmount;
//       customerLoyalty.lastActivityDate = new Date();

//       await queryRunner.manager.save(customerLoyalty);
//       await queryRunner.commitTransaction();

//       return transaction;
//     } catch (error) {
//       await queryRunner.rollbackTransaction();
//       logger.error('Cashback redemption error:', error);
//       throw error;
//     } finally {
//       await queryRunner.release();
//     }
//   }

//   async getCustomerLoyaltySummary(tenantId: string, customerId: string): Promise<any> {
//     const customerLoyalty = await this.customerLoyaltyRepository.findOne({
//       where: { customerId, tenantId }
//     });

//     const transactions = await this.transactionRepository.find({
//       where: { customerId, tenantId },
//       order: { createdAt: 'DESC' },
//       take: 10
//     });

//     const program = await this.programRepository.findOne({
//     where: { tenantId, status: LoyaltyProgramStatus.ACTIVE }
//     });

//     return {
//       summary: customerLoyalty,
//       recentTransactions: transactions,
//       program: program
//     };
//   }

//   async updateLoyaltyProgram(
//     tenantId: string,
//     programId: string,
//     updates: Partial<LoyaltyProgram>
//   ): Promise<LoyaltyProgram> {
//     const program = await this.programRepository.findOne({
//       where: { id: programId, tenantId }
//     });

//     if (!program) {
//       throw new Error('Loyalty program not found');
//     }

//     Object.assign(program, updates);
//     return await this.programRepository.save(program);
//   }

//   async getProgramStatistics(tenantId: string, programId: string): Promise<any> {
//     const program = await this.programRepository.findOne({
//       where: { id: programId, tenantId }
//     });

//     const totalCustomers = await this.customerLoyaltyRepository.count({
//       where: { tenantId }
//     });

//     const totalCashback = await this.transactionRepository
//       .createQueryBuilder('transaction')
//       .select('SUM(transaction.cashbackAmount)', 'totalCashback')
//       .where('transaction.tenantId = :tenantId', { tenantId })
//       .andWhere('transaction.type = :type', { type: TransactionType.EARN })
//       .andWhere('transaction.status = :status', { status: TransactionStatus.COMPLETED })
//       .getRawOne();

//     const redemptionRate = await this.transactionRepository
//       .createQueryBuilder('transaction')
//       .select('COUNT(DISTINCT transaction.customerId)', 'redeemingCustomers')
//       .where('transaction.tenantId = :tenantId', { tenantId })
//       .andWhere('transaction.type = :type', { type: TransactionType.REDEEM })
//       .getRawOne();

//     return {
//       program,
//       statistics: {
//         totalCustomers,
//         totalCashback: totalCashback.totalCashback || 0,
//         redemptionRate: totalCustomers > 0 ? (redemptionRate.redeemingCustomers / totalCustomers) * 100 : 0
//       }
//     };
//   }

//     async getActiveProgram(tenantId: string): Promise<LoyaltyProgram> {
//     // Try to find an active program for the tenant
//     let program = await this.programRepository.findOne({
//       where: { tenantId, status: LoyaltyProgramStatus.ACTIVE }
//     });

//     // If none, initialize and return default program
//     if (!program) {
//       program = await this.initializeDefaultProgram(tenantId);
//     }

//     return program;
//   }
// }
