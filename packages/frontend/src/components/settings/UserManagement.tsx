import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/hooks/useAuth';
import { userService } from '@/services/userService';
import { ToastContainer, toast } from 'react-toastify';
import { UserInviteModal } from '@/components/users/UserInviteModal';
import { UserPermissionsModal } from '@/components/users/UserPermissionsModal';
import { ActivityLog } from '@/components/users/ActivityLog';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/Card';


const userSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  role: z.enum(['admin', 'manager', 'accountant', 'viewer']),
  isActive: z.boolean().default(true),
});

type UserFormData = z.infer<typeof userSchema>;

export const UserManagement: React.FC = () => {
  const { tenantId, user: currentUser } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);
  const [activityLogs, setActivityLogs] = useState<any[]>([]);

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
  });

  useEffect(() => {
    loadUsers();
    loadActivityLogs();
  }, []);

  const loadUsers = async () => {
    try {
      if (!tenantId) {
  console.warn("Tenant ID is missing, skipping user load.");
  return;
}
      const usersData = await userService.getUsers(tenantId);
      setUsers(usersData);
    } catch (error) {
      console.error('Failed to load users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const loadActivityLogs = async () => {
    try {
      if (!tenantId) {
  console.warn("Tenant ID is missing, skipping user load.");
  return;
}
      const logs = await userService.getActivityLogs(tenantId);
      setActivityLogs(logs);
    } catch (error) {
      console.error('Failed to load activity logs:', error);
    }
  };

  const onSubmit = async (data: UserFormData) => {
    try {
      if (!tenantId) {
  console.warn("Tenant ID is missing, skipping user load.");
  return;
}
      if (selectedUser) {
        await userService.updateUser(tenantId, selectedUser.id, data);
        toast.success('User updated successfully');
      } else {
        await userService.createUser(tenantId, data);
        toast.success('User created successfully');
      }
      reset();
      setSelectedUser(null);
      loadUsers();
    } catch (error) {
      console.error('Failed to save user:', error);
      toast.error('Failed to save user');
    }
  };

  const deleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    
    try {
      if (!tenantId) {
  console.warn("Tenant ID is missing, skipping user load.");
  return;
}
      await userService.deleteUser(tenantId, userId);
      toast.success('User deleted successfully');
      loadUsers();
    } catch (error) {
      console.error('Failed to delete user:', error);
      toast.error('Failed to delete user');
    }
  };

  const resendInvitation = async (userId: string) => {
    try {
      if (!tenantId) {
  console.warn("Tenant ID is missing, skipping user load.");
  return;
}
      await userService.resendInvitation(tenantId, userId);
      toast.success('Invitation sent successfully');
    } catch (error) {
      console.error('Failed to resend invitation:', error);
      toast.error('Failed to resend invitation');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-800">User Management</h2>
        <button
          onClick={() => setShowInviteModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Invite User
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Users</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          User
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Role
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users.map((user) => (
                        <tr key={user.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                  {user.name.charAt(0).toUpperCase()}
                                </div>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                <div className="text-sm text-gray-500">{user.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                              user.role === 'manager' ? 'bg-blue-100 text-blue-800' :
                              user.role === 'accountant' ? 'bg-green-100 text-green-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {user.isActive ? 'Active' : 'Inactive'}
                            </span>
                            {!user.hasAcceptedInvitation && (
                              <span className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                Pending
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => {
                                  setSelectedUser(user);
                                  setShowPermissionsModal(true);
                                }}
                                className="text-blue-600 hover:text-blue-900"
                              >
                                Permissions
                              </button>
                              {!user.hasAcceptedInvitation && (
                                <button
                                  onClick={() => resendInvitation(user.id)}
                                  className="text-yellow-600 hover:text-yellow-900"
                                >
                                  Resend
                                </button>
                              )}
                              {user.id !== currentUser?.id && (
                                <button
                                  onClick={() => deleteUser(user.id)}
                                  className="text-red-600 hover:text-red-900"
                                >
                                  Delete
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <ActivityLog logs={activityLogs.slice(0, 10)} />
            </CardContent>
          </Card>
        </div>
      </div>

      {showInviteModal && (
        <UserInviteModal
          onClose={() => setShowInviteModal(false)}
          onSuccess={() => {
            setShowInviteModal(false);
            loadUsers();
          }}
        />
      )}

      {showPermissionsModal && selectedUser && (
        <UserPermissionsModal
          user={selectedUser}
          onClose={() => {
            setShowPermissionsModal(false);
            setSelectedUser(null);
          }}
          onSuccess={() => {
            setShowPermissionsModal(false);
            setSelectedUser(null);
            loadUsers();
          }}
        />
      )}

      <ToastContainer position="bottom-right" />
    </div>
  );
};
