import { getRepository, MoreThan } from 'typeorm';
import { Invoice } from '../entities/Invoice';
import { Client } from '../entities/Client';
import { SyncLog } from '../entities/SyncLog';
import { AppDataSource } from '../config/database';


export class SyncService {
//   private invoiceRepository = getRepository(Invoice);
//   private clientRepository = getRepository(Client);
//   private syncLogRepository = getRepository(SyncLog);
private invoiceRepository = AppDataSource.getRepository(Invoice);
private clientRepository = AppDataSource.getRepository(Client);
private syncLogRepository = AppDataSource.getRepository(SyncLog);


  async syncData(tenantId: string, userId: string, entities: any) {
    const results = {
      created: { invoices: 0, clients: 0 },
      updated: { invoices: 0, clients: 0 },
      conflicts: [] as any[]
    };

    // Process invoices
    if (entities.invoices) {
      for (const invoiceData of entities.invoices) {
        try {
          if (invoiceData.id.startsWith('local_')) {
            const { id: localId, ...invoice } = invoiceData;
            const newInvoice = this.invoiceRepository.create({
              ...invoice,
              tenant: { id: tenantId }
            });
            await this.invoiceRepository.save(newInvoice);
            results.created.invoices++;
          } else {
            await this.invoiceRepository.update(
              { id: invoiceData.id, tenant: { id: tenantId } },
              invoiceData
            );
            results.updated.invoices++;
          }
        } catch (err: unknown) {
          const error = err instanceof Error ? err : new Error(String(err));
          results.conflicts.push({
            entity: 'invoice',
            id: invoiceData.id,
            error: error.message
          });
        }
      }
    }

    // Process clients
    if (entities.clients) {
      for (const clientData of entities.clients) {
        try {
          if (clientData.id.startsWith('local_')) {
            const { id: localId, ...client } = clientData;
            const newClient = this.clientRepository.create({
              ...client,
              tenant: { id: tenantId }
            });
            await this.clientRepository.save(newClient);
            results.created.clients++;
          } else {
            await this.clientRepository.update(
              { id: clientData.id, tenant: { id: tenantId } },
              clientData
            );
            results.updated.clients++;
          }
        } catch (err: unknown) {
          const error = err instanceof Error ? err : new Error(String(err));
          results.conflicts.push({
            entity: 'client',
            id: clientData.id,
            error: error.message
          });
        }
      }
    }

    // Log sync operation
    const syncLog = this.syncLogRepository.create({
      tenant: { id: tenantId },
      user: { id: userId },
      results: JSON.stringify(results),
      timestamp: new Date()
    });

    await this.syncLogRepository.save(syncLog);

    return results;
  }

  async getUpdatesSince(tenantId: string, since: Date) {
    const invoices = await this.invoiceRepository.find({
      where: {
        tenant: { id: tenantId },
        updatedAt: MoreThan(since)
      }
    });

    const clients = await this.clientRepository.find({
      where: {
        tenant: { id: tenantId },
        updatedAt: MoreThan(since)
      }
    });

    return { invoices, clients };
  }
}


// import { getRepository } from 'typeorm';
// import { Invoice } from '../entities/Invoice';
// import { Client } from '../entities/Client';
// import { SyncLog } from '../entities/SyncLog';

// export class SyncService {
//   private invoiceRepository = getRepository(Invoice);
//   private clientRepository = getRepository(Client);
//   private syncLogRepository = getRepository(SyncLog);

//   async syncData(tenantId: string, userId: string, entities: any) {
//     const results = {
//       created: { invoices: 0, clients: 0 },
//       updated: { invoices: 0, clients: 0 },
//       conflicts: [] as any[]
//     };

//     // Process invoices
//     if (entities.invoices) {
//       for (const invoiceData of entities.invoices) {
//         try {
//           if (invoiceData.id.startsWith('local_')) {
//             // New invoice created offline
//             const { id: localId, ...invoice } = invoiceData;
//             const newInvoice = this.invoiceRepository.create({
//               ...invoice,
//               tenant: { id: tenantId }
//             });
            
//             await this.invoiceRepository.save(newInvoice);
//             results.created.invoices++;
//           } else {
//             // Update existing invoice
//             await this.invoiceRepository.update(
//               { id: invoiceData.id, tenant: { id: tenantId } },
//               invoiceData
//             );
//             results.updated.invoices++;
//           }
//         } catch (error) {
//           results.conflicts.push({
//             entity: 'invoice',
//             id: invoiceData.id,
//             error: error.message
//           });
//         }
//       }
//     }

//     // Process clients similarly...

//     // Log sync operation
//     const syncLog = this.syncLogRepository.create({
//       tenant: { id: tenantId },
//       user: { id: userId },
//       results: JSON.stringify(results),
//       timestamp: new Date()
//     });

//     await this.syncLogRepository.save(syncLog);

//     return results;
//   }

//   async getUpdatesSince(tenantId: string, since: Date) {
//     const invoices = await this.invoiceRepository.find({
//       where: {
//         tenant: { id: tenantId },
//         updatedAt: { $gte: since }
//       }
//     });

//     const clients = await this.clientRepository.find({
//       where: {
//         tenant: { id: tenantId },
//         updatedAt: { $gte: since }
//       }
//     });

//     return { invoices, clients };
//   }
// }
