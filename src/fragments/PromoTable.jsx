import React, { useState } from 'react';
import PromoModal from './PromoModal';
import DeleteModal from './DeleteModal';

// Mock Data
const INITIAL_PROMOS = Array(3).fill({
    name: 'Diskon Akhir Tahun',
    type: 'Discount',
    code: 'DAT2023',
    discount: '10%',
    description: 'Diskon spesial akhir tahun untuk treatmen...',
    startDate: '2023-12-01',
    endDate: '2023-12-31',
    minTransaction: 'Rp 200.000',
    status: 'Active'
}).map((p, i) => ({ ...p, id: i + 1 }));

const PromoTable = () => {
    const [promos, setPromos] = useState(INITIAL_PROMOS);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedPromo, setSelectedPromo] = useState(null);

    // Handlers
    const handleAdd = (newPromo) => {
        const promoWithId = { ...newPromo, id: promos.length + 1, status: 'Active' };
        setPromos([...promos, promoWithId]);
        setIsAddModalOpen(false);
    };

    const handleEdit = (updatedPromo) => {
        setPromos(promos.map(p => p.id === updatedPromo.id ? updatedPromo : p));
        setIsEditModalOpen(false);
        setSelectedPromo(null);
    };

    const handleDelete = () => {
        setPromos(promos.filter(p => p.id !== selectedPromo.id));
        setIsDeleteModalOpen(false);
        setSelectedPromo(null);
    };

    const openEditModal = (promo) => {
        setSelectedPromo(promo);
        setIsEditModalOpen(true);
    };

    const openDeleteModal = (promo) => {
        setSelectedPromo(promo);
        setIsDeleteModalOpen(true);
    };

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'Active':
                return 'bg-green-100 text-green-600';
            case 'Inactive':
                return 'bg-gray-100 text-gray-600';
            default:
                return 'bg-gray-100 text-gray-600';
        }
    };

    return (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            {/* Table Header Controls */}
            <div className="p-4 flex items-center border-b border-gray-100">
                <div className="flex gap-2 ml-auto">
                    {/* Filter Dropdown */}
                    <div className="relative">
                        <select className="appearance-none bg-gray-100 text-sm pl-4 pr-8 py-2 rounded-md border-none focus:ring-1 focus:ring-primary cursor-pointer text-gray-600">
                            <option>All Promo</option>
                            <option>Active</option>
                            <option>Inactive</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                            <svg className="fill-current h-4 w-4" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                        </div>
                    </div>

                    {/* Search Bar */}
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search Promo"
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
                            <th className="py-4 px-6 font-medium">Jenis Promo</th>
                            <th className="py-4 px-6 font-medium">Kode Promo</th>
                            <th className="py-4 px-6 font-medium">Diskon</th>
                            <th className="py-4 px-6 font-medium">Deskripsi</th>
                            <th className="py-4 px-6 font-medium">Tanggal Mulai</th>
                            <th className="py-4 px-6 font-medium">Tanggal Selesai</th>
                            <th className="py-4 px-6 font-medium">Minimal Transaksi</th>
                            <th className="py-4 px-6 font-medium text-center">Status</th>
                            <th className="py-4 px-6 font-medium text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {promos.map((promo, index) => (
                            <tr key={promo.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                <td className="py-4 px-6 text-gray-400">{index + 1}</td>
                                <td className="py-4 px-6 font-medium text-gray-900">{promo.name}</td>
                                <td className="py-4 px-6 text-gray-500">{promo.type}</td>
                                <td className="py-4 px-6 text-gray-900 font-mono">{promo.code}</td>
                                <td className="py-4 px-6 text-green-600 font-medium">{promo.discount}</td>
                                <td className="py-4 px-6 text-gray-500 max-w-xs truncate">{promo.description}</td>
                                <td className="py-4 px-6 text-gray-500 whitespace-nowrap">{promo.startDate}</td>
                                <td className="py-4 px-6 text-gray-500 whitespace-nowrap">{promo.endDate}</td>
                                <td className="py-4 px-6 text-gray-900">{promo.minTransaction}</td>
                                <td className="py-4 px-6 text-center">
                                    <div className="flex items-center justify-center gap-2">
                                        <select
                                            value={promo.status}
                                            onChange={(e) => {
                                                const newStatus = e.target.value;
                                                setPromos(promos.map(p =>
                                                    p.id === promo.id ? { ...p, status: newStatus } : p
                                                ));
                                            }}
                                            className={`px-3 py-1 rounded-full text-xs font-medium border-0 cursor-pointer ${getStatusBadgeClass(promo.status)}`}
                                        >
                                            <option value="Active">Active</option>
                                            <option value="Inactive">Inactive</option>
                                        </select>
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M7 10l5 5 5-5z" />
                                        </svg>
                                    </div>
                                </td>
                                <td className="py-4 px-6">
                                    <div className="flex items-center justify-center gap-4">
                                        <button
                                            onClick={() => openEditModal(promo)}
                                            className="text-gray-400 hover:text-blue-500"
                                        >
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                            </svg>
                                        </button>
                                        <button
                                            onClick={() => openDeleteModal(promo)}
                                            className="text-gray-400 hover:text-red-500"
                                        >
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <polyline points="3 6 5 6 21 6"></polyline>
                                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                            </svg>
                                        </button>
                                        <button className="text-gray-400 hover:text-primary">
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <line x1="22" y1="2" x2="11" y2="13"></line>
                                                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
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
            <PromoModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                mode="add"
                onSubmit={handleAdd}
            />

            <PromoModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                mode="edit"
                initialData={selectedPromo}
                onSubmit={handleEdit}
            />

            <DeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDelete}
                itemType="promo"
            />
        </div>
    );
};

export default PromoTable;
