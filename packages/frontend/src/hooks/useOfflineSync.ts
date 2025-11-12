import { useState, useEffect, useCallback } from 'react';
import  apiClient  from '../services/apiClient';

interface SyncQueueItem {
  type: 'create' | 'update' | 'delete';
  endpoint: string;
  data: any;
  id?: string;
}

export const useOfflineSync = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [queue, setQueue] = useState<SyncQueueItem[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Load queue from localStorage
    const savedQueue = localStorage.getItem('syncQueue');
    if (savedQueue) {
      setQueue(JSON.parse(savedQueue));
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    // Save queue to localStorage whenever it changes
    localStorage.setItem('syncQueue', JSON.stringify(queue));
    
    // Sync when coming online
    if (isOnline && queue.length > 0) {
      processQueue();
    }
  }, [queue, isOnline]);

  const addToQueue = useCallback((item: SyncQueueItem) => {
    setQueue(prevQueue => [...prevQueue, item]);
  }, []);

  const processQueue = async () => {
    if (isSyncing || queue.length === 0) return;

    setIsSyncing(true);
    const currentQueue = [...queue];

    try {
      for (const item of currentQueue) {
        try {
          switch (item.type) {
            case 'create':
              await apiClient.post(item.endpoint, item.data);
              break;
            case 'update':
              await apiClient.put(`${item.endpoint}/${item.id}`, item.data);
              break;
            case 'delete':
              await apiClient.delete(`${item.endpoint}/${item.id}`);
              break;
          }

          // Remove successfully processed item from queue
          setQueue(prevQueue => prevQueue.filter(q => q !== item));
        } catch (error) {
          console.error('Failed to sync item:', item, error);
          // Keep failed items in queue for retry
        }
      }
    } finally {
      setIsSyncing(false);
    }
  };

  const clearQueue = () => {
    setQueue([]);
    localStorage.removeItem('syncQueue');
  };

  return {
    isOnline,
    queue,
    isSyncing,
    addToQueue,
    processQueue,
    clearQueue
  };
};
