import React, { useState } from 'react';
import { 
  CheckCircleIcon, 
  XCircleIcon, 
  EyeIcon,
  DocumentTextIcon,
  UserIcon
} from '@heroicons/react/24/outline';

const UserVerification = () => {
  const [filter, setFilter] = useState('pending');
  
  const users = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      type: 'seller',
      status: 'pending',
      documents: ['ID Card', 'Business License'],
      joinDate: '2024-01-15',
      avatar: '👤'
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@example.com',
      type: 'buyer',
      status: 'verified',
      documents: ['ID Card'],
      joinDate: '2024-01-10',
      avatar: '👩'
    },
    {
      id: 3,
      name: 'Mike Johnson',
      email: 'mike@example.com',
      type: 'seller',
      status: 'rejected',
      documents: ['ID Card', 'Tax Certificate'],
      joinDate: '2024-01-08',
      avatar: '👨'
    }
  ];

  const filteredUsers = users.filter(user => 
    filter === 'all' || user.status === filter
  );

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'bg-yellow-100 text-yellow-800',
      verified: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };
    return badges[status] || badges.pending;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">User Verification</h1>
        
      </div>

      {/* Filters */}
      <div className="flex space-x-4">
        {['all', 'pending', 'verified', 'rejected'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg font-medium capitalize ${
              filter === status
                ? 'bg-teal-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* User List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Documents</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Join Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                        <span className="text-lg">{user.avatar}</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                      {user.type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(user.status)} capitalize`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <DocumentTextIcon className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{user.documents.length} files</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(user.joinDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button className="p-1 text-blue-600 hover:bg-blue-100 rounded">
                        <EyeIcon className="w-4 h-4" />
                      </button>
                      {user.status === 'pending' && (
                        <>
                          <button className="p-1 text-green-600 hover:bg-green-100 rounded">
                            <CheckCircleIcon className="w-4 h-4" />
                          </button>
                          <button className="p-1 text-red-600 hover:bg-red-100 rounded">
                            <XCircleIcon className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserVerification;
