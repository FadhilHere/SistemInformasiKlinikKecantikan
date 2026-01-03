import React, { useEffect, useState } from 'react';
import UserModal from './UserModal';
import DeleteModal from './DeleteModal';
import { apiFetch } from '../lib/api';

const UserTable = () => {
    const [users, setUsers] = useState([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    const fetchUsers = async () => {
        try {
            setIsLoading(true);
            setError('');
            const res = await apiFetch('/api/users');
            const list = res?.data || res || [];
            setUsers(Array.isArray(list) ? list : []);
        } catch (err) {
            setError(err?.data?.message || 'Gagal memuat data user');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleAdd = async (newUser) => {
        try {
            await apiFetch('/api/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newUser),
            });
            setIsAddModalOpen(false);
            await fetchUsers();
        } catch (err) {
            setError(err?.data?.message || 'Gagal menambah user');
        }
    };

    const handleEdit = async (updatedUser) => {
        if (!selectedUser) return;
        try {
            await apiFetch(`/api/users/${selectedUser.idUser || selectedUser.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedUser),
            });
            closeEditModal();
            await fetchUsers();
        } catch (err) {
            setError(err?.data?.message || 'Gagal memperbarui user');
        }
    };

    const handleDelete = async () => {
        if (!selectedUser) return;
        try {
            await apiFetch(`/api/users/${selectedUser.idUser || selectedUser.id}`, {
                method: 'DELETE',
            });
            setIsDeleteModalOpen(false);
            setSelectedUser(null);
            await fetchUsers();
        } catch (err) {
            setError(err?.data?.message || 'Gagal menghapus user');
        }
    };

    const openEditModal = (user) => {
        setSelectedUser(user);
        setIsEditModalOpen(true);
        // Update URL to show user ID
        window.history.pushState({}, '', `/users/${user.idUser || user.id}`);
    };

    const openDeleteModal = (user) => {
        setSelectedUser(user);
        setIsDeleteModalOpen(true);
        window.history.pushState({}, '', `/api/users/${user.idUser || user.id}`);
    };

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setSelectedUser(null);
        window.history.pushState({}, '', '/users');
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
        setSelectedUser(null);
        // Restore URL to users page
        window.history.pushState({}, '', '/users');
    };

    const getRoleBadgeClass = (role) => {
        const roleLower = (role || '').toLowerCase();
        switch (roleLower) {
            case 'admin':
                return 'bg-green-100 text-green-600';
            case 'pelanggan':
                return 'bg-blue-100 text-blue-600';
            default:
                return 'bg-gray-100 text-gray-600';
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    // Filter users based on search query
    const filteredUsers = users.filter((user) => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        const nama = (user.nama || '').toLowerCase();
        const email = (user.email || '').toLowerCase();
        const nomorWa = (user.nomorWa || '').toLowerCase();
        return nama.includes(query) || email.includes(query) || nomorWa.includes(query);
    });

    return (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            {/* Table Header Controls */}
            <div className="p-4 flex items-center border-b border-gray-100">
                <div className="flex gap-2 ml-auto">
                    {/* Search Bar */}
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Cari user..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 pr-4 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                        <svg
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <circle cx="11" cy="11" r="8"></circle>
                            <path d="m21 21-4.35-4.35"></path>
                        </svg>
                    </div>

                    {/* Add Button */}
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="bg-primary hover:bg-primary-dark text-white p-2 rounded-md transition-colors"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                    </button>
                </div>
            </div>

            {error && <div className="px-4 py-2 text-sm text-red-600">{error}</div>}
            {isLoading ? (
                <div className="py-6 text-center text-sm text-gray-500">Memuat data...</div>
            ) : (
                <div className="overflow-x-auto min-h-[300px]">
                    <table className="w-full text-sm text-left">
                        <thead className="text-gray-500 border-b border-gray-100 bg-white">
                            <tr>
                                <th className="py-4 px-6 font-medium w-16">No</th>
                                <th className="py-4 px-6 font-medium">Nama</th>
                                <th className="py-4 px-6 font-medium">Alamat</th>
                                <th className="py-4 px-6 font-medium">Jenis Kelamin</th>
                                <th className="py-4 px-6 font-medium">Tanggal Lahir</th>
                                <th className="py-4 px-6 font-medium">Role</th>
                                <th className="py-4 px-6 font-medium">Email</th>
                                <th className="py-4 px-6 font-medium">Nomor WA</th>
                                <th className="py-4 px-6 font-medium text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map((user, index) => (
                                <tr key={user.idUser || user.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                    <td className="py-4 px-6 text-gray-400">{index + 1}</td>
                                    <td className="py-4 px-6 font-medium text-gray-900">{user.nama}</td>
                                    <td className="py-4 px-6 text-gray-500 max-w-xs truncate">{user.alamat}</td>
                                    <td className="py-4 px-6 text-gray-500">{user.jenisKelamin}</td>
                                    <td className="py-4 px-6 text-gray-500 whitespace-nowrap">{formatDate(user.tanggalLahir)}</td>
                                    <td className="py-4 px-6">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleBadgeClass(user.role)}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6 text-gray-500">{user.email}</td>
                                    <td className="py-4 px-6 text-gray-500">{user.nomorWa}</td>
                                    <td className="py-4 px-6">
                                        <div className="flex items-center justify-center gap-4">
                                            <button
                                                onClick={() => openEditModal(user)}
                                                className="text-gray-400 hover:text-blue-500"
                                            >
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() => openDeleteModal(user)}
                                                className="text-gray-400 hover:text-red-500"
                                            >
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <polyline points="3 6 5 6 21 6"></polyline>
                                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                                </svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredUsers.length === 0 && (
                                <tr>
                                    <td colSpan="9" className="py-8 text-center text-gray-500">
                                        {searchQuery ? 'Tidak ada user yang sesuai dengan pencarian.' : 'Belum ada user yang terdaftar.'}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
            {/* Pagination */}
            <div className="flex items-center justify-between p-4 border-t border-gray-100">
                <button className="px-4 py-2 text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-2 text-sm">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                    Previous
                </button>

                <div className="flex gap-2">
                    <button className="w-8 h-8 rounded-lg bg-green-100 text-green-600 font-medium flex items-center justify-center text-sm">1</button>
                </div>

                <button className="px-4 py-2 text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-2 text-sm">
                    Next
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                </button>
            </div>

            {/* Modals */}
            <UserModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                mode="add"
                onSubmit={handleAdd}
            />

            <UserModal
                isOpen={isEditModalOpen}
                onClose={closeEditModal}
                mode="edit"
                initialData={selectedUser}
                onSubmit={handleEdit}
            />

            <DeleteModal
                isOpen={isDeleteModalOpen}
                onClose={closeDeleteModal}
                onConfirm={handleDelete}
                itemType="user"
            />
        </div>
    );
};

export default UserTable;
