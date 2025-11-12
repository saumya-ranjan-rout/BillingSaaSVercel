import { useApi } from './useApi';
import { Setting } from '../types';

export function useSetting() {
  const api = useApi();

  return {
    get: async (): Promise<Setting | null> => {
      try {
        const response = await api.get('/settings');
        return response as Setting; // ✅ explicitly cast the type
      } catch (err) {
        console.error("Failed to load settings", err);
        return null;
      }
    },

    update: async (data: Partial<Setting>): Promise<Setting> => {
      const response = await api.put('/settings', data);
      return response as Setting; // ✅ same type assertion for consistency
    },
  };
}
