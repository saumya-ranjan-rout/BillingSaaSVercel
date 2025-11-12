import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { permissionService } from '@/services/permissionService';
import { ToastContainer, toast } from 'react-toastify';

interface PermissionManagerProps {
  resourceType: string;
  resourceId: string;
}

export const PermissionManager: React.FC<PermissionManagerProps> = ({
  resourceType,
  resourceId,
}) => {
  const { tenantId } = useAuth();
  const [permissions, setPermissions] = useState<any[]>([]);
  const [availableUsers, setAvailableUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedRole, setSelectedRole] = useState('viewer');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPermissions();
    loadAvailableUsers();
  }, []);

const loadPermissions = async () => {
  if (!tenantId) {
    console.warn('Tenant ID missing — cannot load permissions');
    return;
  }

  try {
    const perms = await permissionService.getResourcePermissions(
      tenantId,
      resourceType,
      resourceId
    );
    setPermissions(perms);
  } catch (error) {
    console.error('Failed to load permissions:', error);
    toast.error('Failed to load permissions');
  } finally {
    setLoading(false);
  }
};

const loadAvailableUsers = async () => {
  if (!tenantId) {
    console.warn('Tenant ID missing — cannot load available users');
    return;
  }

  try {
    const users = await permissionService.getAvailableUsers(tenantId);
    setAvailableUsers(users);
  } catch (error) {
    console.error('Failed to load available users:', error);
  }
};

const addPermission = async () => {
  if (!tenantId) {
    toast.error('Tenant ID missing');
    return;
  }
  if (!selectedUser) return;

  try {
    await permissionService.addPermission(tenantId, {
      resourceType,
      resourceId,
      userId: selectedUser,
      role: selectedRole,
    });
    toast.success('Permission added successfully');
    loadPermissions();
    setSelectedUser('');
    setSelectedRole('viewer');
  } catch (error) {
    console.error('Failed to add permission:', error);
    toast.error('Failed to add permission');
  }
};

 
const removePermission = async (permissionId: string) => {
  if (!tenantId) {
    toast.error('Tenant ID missing');
    return;
  }

  try {
    await permissionService.removePermission(tenantId, permissionId);
    toast.success('Permission removed successfully');
    loadPermissions();
  } catch (error) {
    console.error('Failed to remove permission:', error);
    toast.error('Failed to remove permission');
  }
};

const updatePermission = async (permissionId: string, role: string) => {
  if (!tenantId) {
    toast.error('Tenant ID missing');
    return;
  }

  try {
    await permissionService.updatePermission(tenantId, permissionId, { role });
    toast.success('Permission updated successfully');
    loadPermissions();
  } catch (error) {
    console.error('Failed to update permission:', error);
    toast.error('Failed to update permission');
  }
};

  if (loading) {
    return (
      <div className="flex justify-center py-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-800">Manage Permissions</h3>

      <div className="flex space-x-2">
        <select
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
          className="p-2 border border-gray-300 rounded-md"
        >
          <option value="">Select User</option>
          {availableUsers.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name} ({user.email})
            </option>
          ))}
        </select>

        <select
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
          className="p-2 border border-gray-300 rounded-md"
        >
          <option value="viewer">Viewer</option>
          <option value="editor">Editor</option>
          <option value="owner">Owner</option>
        </select>

        <button
          onClick={addPermission}
          disabled={!selectedUser}
          className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          Add Permission
        </button>
      </div>

      <div className="mt-4">
        <h4 className="font-medium text-gray-700 mb-2">Current Permissions</h4>
        {permissions.length === 0 ? (
          <p className="text-gray-500">No permissions set for this resource.</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {permissions.map((permission) => (
              <li key={permission.id} className="py-3 flex justify-between items-center">
                <div>
                  <p className="font-medium">{permission.user.name}</p>
                  <p className="text-sm text-gray-500">{permission.user.email}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <select
                    value={permission.role}
                    onChange={(e) => updatePermission(permission.id, e.target.value)}
                    className="p-1 border border-gray-300 rounded-md text-sm"
                  >     <option value="viewer">Viewer</option>
                    <option value="editor">Editor</option>
                    <option value="owner">Owner</option>
                  </select>
                  <button
                    onClick={() => removePermission(permission.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      <ToastContainer position="bottom-right" />
    </div>
  );
};
