import React from 'react';

export const UserInviteModal: React.FC<{ onClose: () => void; onSuccess: () => void }> = ({ onClose, onSuccess }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white p-6 rounded-lg w-96 shadow-md">
        <h2 className="text-lg font-semibold mb-4">Invite User</h2>
        <p className="text-gray-600 mb-6">Invite user functionality coming soon.</p>
        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-3 py-1 bg-gray-300 rounded">Close</button>
          <button onClick={onSuccess} className="px-3 py-1 bg-blue-600 text-white rounded">Done</button>
        </div>
      </div>
    </div>
  );
};
