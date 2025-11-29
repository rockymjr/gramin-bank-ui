import React, { useEffect, useState } from 'react';
import { adminService } from '../../services/adminService';
import { Search, UserPlus, Edit, Trash2 } from 'lucide-react';
import Loader from '../common/Loader';
import MemberForm from './MemberForm';
import { formatDate } from '../../utils/dateFormatter';

const MemberManagement = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingMember, setEditingMember] = useState(null);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async (search = '') => {
    try {
      setLoading(true);
      const data = await adminService.getAllMembers(search);
      setMembers(data);
    } catch (error) {
      console.error('Error fetching members:', error);
      alert('Failed to load members');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchMembers(searchTerm);
  };

  const handleAddNew = () => {
    setEditingMember(null);
    setShowForm(true);
  };

  const handleEdit = (member) => {
    setEditingMember(member);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to deactivate this member?')) {
      try {
        await adminService.deactivateMember(id);
        alert('Member deactivated successfully');
        fetchMembers();
      } catch (error) {
        console.error('Error deactivating member:', error);
        alert('Failed to deactivate member');
      }
    }
  };

  const handleFormClose = (shouldRefresh) => {
    setShowForm(false);
    setEditingMember(null);
    if (shouldRefresh) {
      fetchMembers();
    }
  };

  if (loading) return <Loader message="Loading members..." />;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Member Management</h2>
        <button
          onClick={handleAddNew}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition"
        >
          <UserPlus size={20} />
          <span>Add Member</span>
        </button>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex space-x-2">
          <div className="flex-1 relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name or phone..."
              className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          </div>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition"
          >
            Search
          </button>
          <button
            type="button"
            onClick={() => {
              setSearchTerm('');
              fetchMembers('');
            }}
            className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition"
          >
            Clear
          </button>
        </div>
      </form>

      {/* Members Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Joining Date
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
              {members.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                    No members found
                  </td>
                </tr>
              ) : (
                members.map((member) => (
                  <tr key={member.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {member.firstName} {member.lastName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {member.phone}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(member.joiningDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        member.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {member.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(member)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(member.id)}
                          className="text-red-600 hover:text-red-900"
                          disabled={!member.isActive}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Member Form Modal */}
      {showForm && (
        <MemberForm
          member={editingMember}
          onClose={handleFormClose}
        />
      )}
    </div>
  );
};

export default MemberManagement;