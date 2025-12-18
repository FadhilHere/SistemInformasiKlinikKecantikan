import React, { useState } from 'react';
import UserModal from './UserModal';
import DeleteModal from './DeleteModal';

// Mock Data
const INITIAL_USERS = [
    {
        id: 1,
        name: 'Ahmad Rizki',
        email: 'ahmad.rizki@example.com',
        gender: 'Laki-laki',
        address: 'Jl. Sudirman No. 123, Jakarta',
        role: 'Admin',
        birthDate: '1990-05-15',
        whatsapp: '081234567890'
    },
    {
        id: 2,
        name: 'Siti Nurhaliza',
        email: 'siti.nur@example.com',
        gender: 'Perempuan',
        address: 'Jl. Thamrin No. 45, Bandung',
        role: 'Staff',
        birthDate: '1992-08-20',
        whatsapp: '082345678901'
    },
    {
        id: 3,
        name: 'Budi Santoso',
        email: 'budi.santoso@example.com',
        gender: 'Laki-laki',
        address: 'Jl. Merdeka No. 78, Surabaya',
        role: 'Customer',
        birthDate: '1988-12-10',
        whatsapp: '083456789012'
    }
];

const UserTable = () => {
    const [users, setUsers] = useState(INITIAL_USERS);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    // Handlers
    const handleAdd = (newUser) => {
        const userWithId = { ...newUser, id: users.length + 1 };
        setUsers([...users, userWithId]);
        setIsAddModalOpen(false);
    };

    const handleEdit = (updatedUser) => {
        setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
        setIsEditModalOpen(false);
        setSelectedUser(null);
    };

    const handleDelete = () => {
        setUsers(users.filter(u => u.id !== selectedUser.id));
        setIsDeleteModalOpen(false);
        setSelectedUser(null);
    };

    const openEditModal = (user) => {
        setSelectedUser(user);
        setIsEditModalOpen(true);
    };

    const openDeleteModal = (user) => {
        setSelectedUser(user);
        setIsDeleteModalOpen(true);
    };

    return (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            {/* Table Header Controls */}
            <div className="p-4 flex items-center border-b border-gray-100">
                <div className="flex gap-2 ml-auto">
                    {/* Search Bar */}
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Cari..."
                            className="bg-gray-100 text-sm pl-4 pr-10 py-2 rounded-md outline-none focus:ring-1 focus:ring-primary w-64"
                        />
                        <button className="absolute right-0 top-0 bottom-0 px-3 bg-primary rounded-r-md text-white flex items-center justify-center hover:bg-primary-dark">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="11" cy="11" r="8"></circle>
                                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                            </svg>
                        </button>
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

            {/* Table */}
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
                            <th className="py-4 px-6 font-medium">Nomor Whatsapp</th>
                            <th className="py-4 px-6 font-medium text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user, index) => (
                            <tr key={user.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                <td className="py-4 px-6 text-gray-400">{index + 1}</td>
                                <td className="py-4 px-6 font-medium text-gray-900">{user.name}</td>
                                <td className="py-4 px-6 text-gray-500 max-w-xs truncate">{user.address}</td>
                                <td className="py-4 px-6 text-gray-500">{user.gender}</td>
                                <td className="py-4 px-6 text-gray-500 whitespace-nowrap">{user.birthDate}</td>
                                <td className="py-4 px-6 text-gray-900">{user.role}</td>
                                <td className="py-4 px-6 text-gray-500">{user.email}</td>
                                <td className="py-4 px-6 text-gray-500">{user.whatsapp}</td>
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
                    </tbody>
                </table>
            </div>

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
                onClose={() => setIsEditModalOpen(false)}
                mode="edit"
                initialData={selectedUser}
                onSubmit={handleEdit}
            />

            <DeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDelete}
                itemType="user"
            />
        </div>
    );
};

export default UserTable;
