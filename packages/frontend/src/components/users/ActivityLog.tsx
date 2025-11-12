import React from 'react';

export const ActivityLog: React.FC<{ logs: any[] }> = ({ logs }) => {
  if (!logs.length) return <p className="text-gray-500 text-sm">No recent activity.</p>;

  return (
    <ul className="divide-y divide-gray-200">
      {logs.map((log, index) => (
        <li key={index} className="py-2 text-sm text-gray-700">
          {log.message || 'User activity recorded'}
        </li>
      ))}
    </ul>
  );
};
