import React, { useEffect, useState } from 'react';
import SalesModal from './SalesModal';
import DeleteModal from './DeleteModal';
import { apiFetch } from '../lib/api';

const SalesTable = () => {
    const [sales, setSales] = useState([]);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedSale, setSelectedSale] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [customers, setCustomers] = useState([]);

    // Export state
    const [showExportFilter, setShowExportFilter] = useState(false);
    const [exportFilterStartDate, setExportFilterStartDate] = useState('');
    const [exportFilterEndDate, setExportFilterEndDate] = useState('');

    const fetchSales = async () => {
        try {
            setIsLoading(true);
            setError('');
            const res = await apiFetch('/api/penjualan');
            const list = res?.data || res || [];
            setSales(Array.isArray(list) ? list : []);
        } catch (err) {
            setError(err?.data?.message || 'Gagal memuat data penjualan');
        } finally {
            setIsLoading(false);
        }
    };

    const fetchCustomers = async () => {
        try {
            const res = await apiFetch('/api/users');
            const list = res?.data || res || [];
            setCustomers(Array.isArray(list) ? list : []);
        } catch (err) {
            console.error('Failed to fetch customers:', err);
        }
    };

    useEffect(() => {
        fetchSales();
        fetchCustomers();
    }, []);

    const handleUpdateStatus = async (formData) => {
        if (!selectedSale) return;
        try {
            await apiFetch(`/api/penjualan/${selectedSale.idPenjualan || selectedSale.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: formData.status }),
            });
            setIsEditModalOpen(false);
            setSelectedSale(null);
            await fetchSales();
        } catch (err) {
            setError(err?.data?.message || 'Gagal update status penjualan');
        }
    };

    const handleDelete = async () => {
        if (!selectedSale) return;
        try {
            await apiFetch(`/api/penjualan/${selectedSale.idPenjualan || selectedSale.id}`, {
                method: 'DELETE',
            });
            setIsDeleteModalOpen(false);
            setSelectedSale(null);
            await fetchSales();
        } catch (err) {
            setError(err?.data?.message || 'Gagal menghapus data penjualan');
        }
    };

    const openStatusModal = (sale) => {
        setSelectedSale(sale);
        setIsEditModalOpen(true);
    };

    const openDeleteModal = (sale) => {
        setSelectedSale(sale);
        setIsDeleteModalOpen(true);
        window.history.pushState({}, '', `/api/penjualan/${sale.idPenjualan || sale.id}`);
    };

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setSelectedSale(null);
        window.history.pushState({}, '', '/sales');
    };

    const formatCurrency = (value) => {
        if (!value) return '-';
        return `Rp ${parseInt(value).toLocaleString('id-ID')}`;
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric', month: 'long', year: 'numeric'
        });
    };

    const getPromoName = (promo) => {
        if (!promo) return '-';
        if (typeof promo === 'object') return promo.namaPromo || '-';
        return promo;
    };

    const getCustomerName = (idUser) => {
        if (!idUser) return '-';
        const customer = customers.find(c => String(c.idUser || c.id) === String(idUser));
        return customer ? customer.nama : '-';
    };

    // Filter sales based on search query
    const filteredSales = sales.filter((sale) => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        const name = getCustomerName(sale.idUser || sale.user?.idUser || sale.user?.id).toLowerCase();
        const product = (sale.product || sale.namaProduk || '').toLowerCase();
        const promo = getPromoName(sale.promo || sale.namaPromo).toLowerCase();
        return name.includes(query) || product.includes(query) || promo.includes(query);
    });

    const handleExportCSV = () => {
        let dataToExport = sales;

        // Apply export filters
        if (exportFilterStartDate) {
            const startDate = new Date(exportFilterStartDate);
            dataToExport = dataToExport.filter(sale => new Date(sale.date || sale.tanggal) >= startDate);
        }

        if (exportFilterEndDate) {
            const endDate = new Date(exportFilterEndDate);
            dataToExport = dataToExport.filter(sale => new Date(sale.date || sale.tanggal) <= endDate);
        }

        const headers = ['No', 'Nama', 'Tanggal', 'Promo', 'Produk', 'Jumlah', 'Total Harga', 'Status'];
        const data = dataToExport.map((sale, index) => [
            index + 1,
            getCustomerName(sale.idUser || sale.user?.idUser || sale.user?.id),
            formatDate(sale.date || sale.tanggal),
            getPromoName(sale.promo || sale.namaPromo),
            sale.product || sale.namaProduk || '-',
            sale.quantity || sale.jumlah || 0,
            sale.total_price || sale.totalHarga || 0,
            sale.status || '-'
        ]);

        const csvContent = [
            headers.join(','),
            ...data.map(row => row.map(cell => `"${cell}"`).join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `Penjualan_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const getStatusBadgeClass = (status) => {
        const statusLower = (status || '').toLowerCase();
        switch (statusLower) {
            case 'completed':
            case 'selesai': return 'bg-green-100 text-green-600';
            case 'pending':
            case 'menunggu': return 'bg-yellow-100 text-yellow-600';
            case 'cancelled':
            case 'batal': return 'bg-red-100 text-red-600';
            default: return 'bg-gray-100 text-gray-600';
        }
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
                            placeholder="Cari penjualan..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 pr-4 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent w-64"
                        />
                        <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                    </div>

                    {/* CSV Export Button */}
                    <button
                        onClick={() => setShowExportFilter(!showExportFilter)}
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-md transition-colors flex items-center gap-2 text-sm"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                            <polyline points="14 2 14 8 20 8"></polyline>
                        </svg>
                        Export CSV
                    </button>
                </div>
            </div>

            {/* Export Filter Form (Collapsible) */}
            {showExportFilter && (
                <div className="p-4 bg-blue-50 border-b border-blue-200">
                    <h3 className="text-sm font-semibold text-gray-700 mb-4">Filter Data Export</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-gray-700">Tanggal Mulai</label>
                            <input
                                type="date"
                                value={exportFilterStartDate}
                                onChange={(e) => setExportFilterStartDate(e.target.value)}
                                className="px-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-gray-700">Tanggal Selesai</label>
                            <input
                                type="date"
                                value={exportFilterEndDate}
                                onChange={(e) => setExportFilterEndDate(e.target.value)}
                                className="px-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                            />
                        </div>
                    </div>
                    <div className="flex justify-end gap-2">
                        <button
                            onClick={() => {
                                setExportFilterStartDate('');
                                setExportFilterEndDate('');
                            }}
                            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
                        >
                            Reset Filter
                        </button>
                        <button
                            onClick={() => {
                                handleExportCSV();
                                setShowExportFilter(false);
                            }}
                            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm"
                        >
                            Download CSV
                        </button>
                    </div>
                </div>
            )}

            {error && <div className="px-4 py-2 text-sm text-red-600">{error}</div>}

            {/* Table */}
            <div className="overflow-x-auto min-h-[300px]">
                {isLoading ? (
                    <div className="py-8 text-center text-gray-500">Memuat data penjualan...</div>
                ) : (
                    <table className="w-full text-sm text-left">
                        <thead className="text-gray-500 border-b border-gray-100 bg-white">
                            <tr>
                                <th className="py-4 px-6 font-medium w-16">No</th>
                                <th className="py-4 px-6 font-medium">Nama</th>
                                <th className="py-4 px-6 font-medium">Tanggal</th>
                                <th className="py-4 px-6 font-medium">Promo</th>
                                <th className="py-4 px-6 font-medium">Produk</th>
                                <th className="py-4 px-6 font-medium">Jumlah</th>
                                <th className="py-4 px-6 font-medium">Total Harga</th>
                                <th className="py-4 px-6 font-medium">Status</th>
                                <th className="py-4 px-6 font-medium text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredSales.map((sale, index) => (
                                <tr key={sale.id || sale.idPenjualan} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                    <td className="py-4 px-6 text-gray-400">{index + 1}</td>
                                    <td className="py-4 px-6 font-medium text-gray-900">{getCustomerName(sale.idUser || sale.user?.idUser || sale.user?.id)}</td>
                                    <td className="py-4 px-6 text-gray-500 max-w-xs truncate">{formatDate(sale.date || sale.tanggal)}</td>
                                    <td className="py-4 px-6 text-gray-500 whitespace-nowrap">{getPromoName(sale.promo || sale.namaPromo)}</td>
                                    <td className="py-4 px-6 text-gray-500 whitespace-nowrap">{sale.product || sale.namaProduk}</td>
                                    <td className="py-4 px-6 text-gray-500 whitespace-nowrap">{sale.quantity || sale.jumlah}</td>
                                    <td className="py-4 px-6 text-gray-500 whitespace-nowrap">{formatCurrency(sale.total_price || sale.totalHarga)}</td>
                                    <td className="py-4 px-6 text-gray-500 whitespace-nowrap">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(sale.status)}`}>
                                            {sale.status}
                                            <button
                                                onClick={() => openStatusModal(sale)}
                                                className="text-blue-500 hover:text-blue-700 text-xs font-semibold px-2 py-1 border border-blue-200 rounded hover:bg-blue-50 transition-colors"
                                            >
                                                Set Status
                                            </button>
                                        </span>
                                    </td>
                                    <td className="py-4 px-6 text-center">
                                        <div className="flex items-center justify-center gap-2">

                                            <button
                                                onClick={() => openDeleteModal(sale)}
                                                className="text-red-500 hover:text-red-700"
                                                title="Hapus"
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
                            {filteredSales.length === 0 && (
                                <tr>
                                    <td colSpan="9" className="py-8 text-center text-gray-500">
                                        {searchQuery ? 'Tidak ada data pencarian.' : 'Belum ada data penjualan.'}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>

            <SalesModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                mode="edit"
                initialData={selectedSale}
                onSubmit={handleUpdateStatus}
            />

            <DeleteModal
                isOpen={isDeleteModalOpen}
                onClose={closeDeleteModal}
                onConfirm={handleDelete}
                itemType="penjualan"
            />
        </div>
    );
};

export default SalesTable;
