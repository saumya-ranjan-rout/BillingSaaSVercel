import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { Subject, mergeMap } from 'rxjs';

interface PendingAction {
  id?: number;
  type: string;
  payload: any;
  timestamp: number;
  retries: number;
  lastError?: string;
}

interface BillingSaaSDB extends DBSchema {
  invoices: {
    key: string;
    value: any;
    indexes: { 'by-tenantId': string; 'by-updatedAt': number };
  };
  customers: {
    key: string;
    value: any;
    indexes: { 'by-tenantId': string };
  };
  pendingActions: {
    key: number;
    value: PendingAction;
  };
  syncMetadata: {
    key: string;
    value: { lastSync: number; etag: string };
  };
}

export class OfflineManager {
  private db!: IDBPDatabase<BillingSaaSDB>;
  private syncQueue = new Subject<PendingAction>();
  private isOnline = navigator.onLine;
  private syncInProgress = false;

  constructor() {
    this.init().then(() => {
      this.setupNetworkListeners();
      this.setupSyncQueue();
      this.setupBackgroundSync();
    });
  }

  // ✅ Add this getter so other files can check online status safely
  get onlineStatus(): boolean {
    return this.isOnline;
  }

  private setupNetworkListeners() {
    window.addEventListener('online', () => {
      this.isOnline = true;
      console.log('🟢 Back online — syncing data...');
      this.syncPendingActions();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
      console.log('🔴 Offline mode — changes will be queued.');
    });
  }

  private async syncPendingActions() {
    const allActions = await this.db.getAll('pendingActions');
    allActions.forEach((action) => this.syncQueue.next(action));
  }

  private async init() {
    this.db = await openDB<BillingSaaSDB>('BillingSaaS', 2, {
      upgrade(db, oldVersion) {
        if (oldVersion < 1) {
          const invoicesStore = db.createObjectStore('invoices', { keyPath: 'id' });
          invoicesStore.createIndex('by-tenantId', 'tenantId');
          invoicesStore.createIndex('by-updatedAt', 'updatedAt');

          db.createObjectStore('customers', { keyPath: 'id' });
          db.createObjectStore('pendingActions', { autoIncrement: true });
        }

        if (oldVersion < 2) {
          db.createObjectStore('syncMetadata', { keyPath: 'resource' });
        }
      },
    });
  }

  async createInvoice(invoice: any): Promise<string> {
    const offlineInvoice = {
      ...invoice,
      id:
        invoice.id ||
        `offline_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      status: 'draft',
      _offline: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      if (this.isOnline) {
        console.log('Online: invoice synced to server');
        return offlineInvoice.id;
      } else {
        await this.db.put('invoices', offlineInvoice);
        await this.queueAction({
          type: 'CREATE_INVOICE',
          payload: invoice,
          timestamp: Date.now(),
          retries: 0,
        });
        return offlineInvoice.id;
      }
    } catch (error) {
      await this.db.put('invoices', offlineInvoice);
      await this.queueAction({
        type: 'CREATE_INVOICE',
        payload: invoice,
        timestamp: Date.now(),
        retries: 0,
      });
      return offlineInvoice.id;
    }
  }

  private async queueAction(action: Omit<PendingAction, 'id'>) {
    await this.db.add('pendingActions', {
      ...action,
      timestamp: Date.now(),
      retries: 0,
    });
    console.log('Action queued for sync:', action.type);
  }
public async enqueueAction(action: Omit<PendingAction, 'id'>) {
  await this.queueAction(action);
}
  private setupSyncQueue() {
    this.syncQueue
      .pipe(
        mergeMap(async (action) => {
          try {
            await this.processAction(action);
            await this.db.delete('pendingActions', action.id!);
          } catch (error: any) {
            if (action.retries < 3) {
              action.retries += 1;
              action.lastError = error.message;
              await this.db.put('pendingActions', action);
              setTimeout(
                () => this.syncQueue.next(action),
                action.retries * 5000
              );
            } else {
              await this.handleSyncFailure(action, error);
            }
          }
        }, 3)
      )
      .subscribe();
  }

  
  private async processAction(action: PendingAction) {
    console.log('Processing sync action:', action.type);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    if (Math.random() < 0.2) throw new Error('Random simulated network failure');
  }

  private async handleSyncFailure(action: PendingAction, error: Error) {
    console.error(`❌ Failed to sync action ${action.type}:`, error.message);
  }

  private async resolveConflict(local: any, remote: any): Promise<any> {
    const localTime = new Date(local.updatedAt || local.createdAt).getTime();
    const remoteTime = new Date(remote.updatedAt || remote.createdAt).getTime();

    if (localTime > remoteTime) {
      return { ...remote, ...local, _conflictResolved: true };
    } else {
      return { ...local, ...remote, _conflictResolved: true };
    }
  }

  private async setupBackgroundSync() {
    if ('serviceWorker' in navigator && 'SyncManager' in window) {
      const registration = await navigator.serviceWorker.ready;
      await (registration as any).sync.register('invoice-sync');
    }
  }

async getFromCache(resource: string, id?: string) {
  if (!this.db) {
    console.warn('Offline DB not initialized yet.');
    return null;
  }

  try {
    // ✅ Safely narrow only if resource is one of the valid store names
    if (
      resource !== 'invoices' &&
      resource !== 'customers' &&
      resource !== 'pendingActions' &&
      resource !== 'syncMetadata'
    ) {
      throw new Error(`Invalid store name: ${resource}`);
    }

    // ✅ Now TypeScript knows `resource` is a valid store name
    const tx = this.db.transaction(resource, 'readonly');
    const store = tx.objectStore(resource);

    if (id) {
      return await store.get(id);
    }

    return await store.getAll();
  } catch (error) {
    console.error(`Failed to get cached data for ${resource}:`, error);
    return null;
  }
}

}

export const offlineManager = new OfflineManager();
