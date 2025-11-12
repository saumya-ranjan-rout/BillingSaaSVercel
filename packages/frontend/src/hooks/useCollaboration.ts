import { useState, useEffect } from 'react';
import { useTenant } from './useTenant';
import apiClient from '../services/apiClient';

interface Collaborator {
  id: string;
  email: string;
  role: string;
  status: 'active' | 'pending';
}

export const useCollaboration = () => {
  const tenantContext = useTenant();
  const tenant = tenantContext?.tenant ?? null;

  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (tenant) {
      loadCollaborators();
    }
  }, [tenant]);

  const loadCollaborators = async () => {
    try {
      const response = await apiClient.get('/collaborators');
      setCollaborators(response.data);
    } catch (error) {
      console.error('Failed to load collaborators:', error);
    } finally {
      setLoading(false);
    }
  };

  const inviteCollaborator = async (email: string, role: string) => {
    try {
      const response = await apiClient.post('/collaborators/invite', { email, role });
      setCollaborators([...collaborators, response.data]);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const updateCollaborator = async (id: string, role: string) => {
    try {
      const response = await apiClient.put(`/collaborators/${id}`, { role });
      setCollaborators(collaborators.map(collab => 
        collab.id === id ? response.data : collab
      ));
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const removeCollaborator = async (id: string) => {
    try {
      await apiClient.delete(`/collaborators/${id}`);
      setCollaborators(collaborators.filter(collab => collab.id !== id));
    } catch (error) {
      throw error;
    }
  };

  return {
    collaborators,
    loading,
    inviteCollaborator,
    updateCollaborator,
    removeCollaborator,
    refreshCollaborators: loadCollaborators,
  };
};
