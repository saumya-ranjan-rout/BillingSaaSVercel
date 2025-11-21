import React, { useState } from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import UserList from '../../../components/users/UserList';
import UserForm from '../../../components/users/UserForm';
// import Button from '../../../components/common/Button';
// import Modal from '../../../components/common/Modal';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { User } from '../../../types';

const Users: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [refreshList, setRefreshList] = useState(0);

  const triggerRefresh = () => {
    setRefreshList(prev => prev + 1);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingUser(null);
  };

  const handleSuccess = () => {
    handleCloseForm();
    triggerRefresh(); // ✅ refresh list after add/edit success
  };

  return (
    <DashboardLayout>
      <div className="users-container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="users-page-title">Users</h1>
          <Button onClick={() => setIsFormOpen(true)}>Add User</Button>
        </div>

        <UserList onEditUser={handleEditUser} refreshTrigger={refreshList} />

        <Modal
          isOpen={isFormOpen}
          onClose={handleCloseForm}
          title={editingUser ? 'Edit User' : 'Add User'}
          size="lg"
        >
          <UserForm
            user={editingUser}
            onSuccess={handleSuccess}
            onCancel={handleCloseForm}
            onRefresh={triggerRefresh}
          />
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default Users;
