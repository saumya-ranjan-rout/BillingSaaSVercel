interface OfflineAction {
  id: string;
  type: string;
  payload: any;
  timestamp?: number;
}

interface OfflineDB {
  getPendingActions: () => Promise<OfflineAction[]>;
  addPendingAction: (action: OfflineAction) => Promise<OfflineAction>;
  removePendingAction: (id: string) => Promise<void>;
  clearPendingActions: () => Promise<void>;
}
// Simple IndexedDB implementation for offline storage
export const offlineDB: OfflineDB = {
  async getPendingActions(): Promise<OfflineAction[]> {
    if (!window.indexedDB) return [];
    
    return new Promise((resolve) => {
      const request = indexedDB.open('BillingSaaS', 1);
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains('pendingActions')) {
          db.createObjectStore('pendingActions', { keyPath: 'id' });
        }
      };
      
      request.onsuccess = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        const transaction = db.transaction(['pendingActions'], 'readonly');
        const store = transaction.objectStore('pendingActions');
        const actionsRequest = store.getAll();
        
        actionsRequest.onsuccess = () => {
          resolve(actionsRequest.result || []);
        };
        
        actionsRequest.onerror = () => {
          resolve([]);
        };
      };
      
      request.onerror = () => {
        resolve([]);
      };
    });
  },
  
  async addPendingAction(action: OfflineAction): Promise<OfflineAction> {
    if (!window.indexedDB) return action;
    
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('BillingSaaS', 1);
      
      request.onsuccess = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        const transaction = db.transaction(['pendingActions'], 'readwrite');
        const store = transaction.objectStore('pendingActions');
        
        const addRequest = store.add(action);
        
        addRequest.onsuccess = () => {
          resolve(action);
        };
        
        addRequest.onerror = () => {
          reject(new Error('Failed to add action to offline DB'));
        };
      };
      
      request.onerror = () => {
        reject(new Error('Failed to open offline DB'));
      };
    });
  },
  
  async removePendingAction(id: string): Promise<void> {
    if (!window.indexedDB) return;
    
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('BillingSaaS', 1);
      
      request.onsuccess = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        const transaction = db.transaction(['pendingActions'], 'readwrite');
        const store = transaction.objectStore('pendingActions');
        
        const deleteRequest = store.delete(id);
        
        deleteRequest.onsuccess = () => {
          resolve();
        };
        
        deleteRequest.onerror = () => {
          reject(new Error('Failed to remove action from offline DB'));
        };
      };
      
      request.onerror = () => {
        reject(new Error('Failed to open offline DB'));
      };
    });
  },
  
  async clearPendingActions(): Promise<void> {
    if (!window.indexedDB) return;
    
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('BillingSaaS', 1);
      
      request.onsuccess = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        const transaction = db.transaction(['pendingActions'], 'readwrite');
        const store = transaction.objectStore('pendingActions');
        
        const clearRequest = store.clear();
        
        clearRequest.onsuccess = () => {
          resolve();
        };
        
        clearRequest.onerror = () => {
          reject(new Error('Failed to clear offline DB'));
        };
      };
      
      request.onerror = () => {
        reject(new Error('Failed to open offline DB'));
      };
    });
  },
};
