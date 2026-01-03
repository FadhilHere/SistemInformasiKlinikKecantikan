import React, { useEffect, useState } from 'react';
import ProductModal from './ProductModal';
import DeleteModal from './DeleteModal';
import { apiFetch } from '../lib/api';

const ProductTable = () => {
    const [products, setProducts] = useState([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [categories, setCategories] = useState([]);

    const fetchProducts = async () => {
        try {
            setIsLoading(true);
            setError('');
            const res = await apiFetch('/api/produk-klinik');
            const list = res?.data || res || [];
            setProducts(Array.isArray(list) ? list : []);
        } catch (err) {
            setError(err?.data?.message || 'Gagal memuat data produk');
        } finally {
            setIsLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const res = await apiFetch('/api/kategori-produk');
            const list = res?.data || res || [];
            setCategories(Array.isArray(list) ? list : []);
        } catch (err) {
            console.error('Failed to fetch categories:', err);
        }
    };

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    const handleAdd = async (newProduct) => {
        try {
            await apiFetch('/api/produk-klinik', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newProduct),
            });
            setIsAddModalOpen(false);
            await fetchProducts();
        } catch (err) {
            setError(err?.data?.message || 'Gagal menambah produk');
        }
    };

    const handleEdit = async (updatedProduct) => {
        if (!selectedProduct) return;
        try {
            await apiFetch(`/api/produk-klinik/${selectedProduct.idProduk || selectedProduct.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedProduct),
            });
            closeEditModal();
            await fetchProducts();
        } catch (err) {
            setError(err?.data?.message || 'Gagal memperbarui produk');
        }
    };

    const handleDelete = async () => {
        if (!selectedProduct) return;
        try {
            await apiFetch(`/api/produk-klinik/${selectedProduct.idProduk || selectedProduct.id}`, {
                method: 'DELETE',
            });
            setIsDeleteModalOpen(false);
            setSelectedProduct(null);
            await fetchProducts();
        } catch (err) {
            setError(err?.data?.message || 'Gagal menghapus produk');
        }
    };

    const openEditModal = (product) => {
        setSelectedProduct(product);
        setIsEditModalOpen(true);
        // Update URL to show product ID
        window.history.pushState({}, '', `/products/${product.idProduk || product.id}`);
    };

    const openDeleteModal = (product) => {
        setSelectedProduct(product);
        setIsDeleteModalOpen(true);
        window.history.pushState({}, '', `/api/produk-klinik/${product.idProduk || product.id}`);
    };

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setSelectedProduct(null);
        window.history.pushState({}, '', '/products');
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
        setSelectedProduct(null);
        // Restore URL to products page
        window.history.pushState({}, '', '/products');
    };

    const updateStock = async (product, change) => {
        try {
            const currentStock = product.stok || product.stock || 0;
            const newStock = currentStock + change;
            if (newStock < 0) {
                setError('Stok tidak boleh negatif');
                return;
            }

            const payload = {
                nama: product.nama,
                harga: product.harga,
                stok: newStock,
                idKategori: product.idKategori,
                deskripsi: product.deskripsi
            };

            await apiFetch(`/api/produk-klinik/${product.idProduk || product.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            await fetchProducts();
        } catch (err) {
            setError(err?.data?.message || 'Gagal memperbarui stok');
        }
    };

    const getCategoryName = (idKategori) => {
        if (!categories || categories.length === 0) return '-';
        const category = categories.find(cat => (cat.idKategori || cat.id) === idKategori);
        return category ? (category.namaKategori || category.nama || category.name || '-') : '-';
    };

    const formatPrice = (price) => {
        if (!price) return 'Rp 0';
        return `Rp ${parseInt(price).toLocaleString('id-ID')}`;
    };

    // Filter products based on search query and category
    const filteredProducts = products.filter((product) => {
        // Category filter - handle both string and number comparison
        if (categoryFilter) {
            const productCategoryId = String(product.idKategori);
            const filterCategoryId = String(categoryFilter);
            if (productCategoryId !== filterCategoryId) {
                return false;
            }
        }

        // Search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            const nama = (product.nama || '').toLowerCase();
            const deskripsi = (product.deskripsi || '').toLowerCase();

            // Only search in category name if categories are loaded
            let matchesCategory = false;
            if (categories && categories.length > 0) {
                const kategori = getCategoryName(product.idKategori).toLowerCase();
                matchesCategory = kategori.includes(query);
            }

            const matchesSearch = nama.includes(query) || deskripsi.includes(query) || matchesCategory;
            if (!matchesSearch) {
                return false;
            }
        }

        return true;
    });

    return (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            {/* Table Header Controls */}
            <div className="p-4 flex items-center border-b border-gray-100">
                <div className="flex gap-2 ml-auto">
                    {/* Category Filter Dropdown */}
                    <div className="relative">
                        <select
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            className="appearance-none bg-gray-100 text-sm pl-4 pr-8 py-2 rounded-md border-none focus:ring-1 focus:ring-primary cursor-pointer text-gray-600"
                        >
                            <option value="">All Product</option>
                            {categories.map((category) => (
                                <option key={category.idKategori || category.id} value={category.idKategori || category.id}>
                                    {category.namaKategori || category.nama || category.name}
                                </option>
                            ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                            <svg className="fill-current h-4 w-4" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                        </div>
                    </div>

                    {/* Search Bar */}
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Cari produk..."
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
                                <th className="py-4 px-6 font-medium">Deskripsi</th>
                                <th className="py-4 px-6 font-medium">Kategori</th>
                                <th className="py-4 px-6 font-medium">Harga</th>
                                <th className="py-4 px-6 font-medium text-center">Stok</th>
                                <th className="py-4 px-6 font-medium text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProducts.map((product, index) => (
                                <tr key={product.idProduk || product.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                    <td className="py-4 px-6 text-gray-400">{index + 1}</td>
                                    <td className="py-4 px-6 font-medium text-gray-900">{product.nama}</td>
                                    <td className="py-4 px-6 text-gray-500 max-w-xs truncate">{product.deskripsi}</td>
                                    <td className="py-4 px-6 text-gray-500">{getCategoryName(product.idKategori)}</td>
                                    <td className="py-4 px-6 text-gray-900 font-medium">{formatPrice(product.harga)}</td>
                                    <td className="py-4 px-6 text-center text-gray-600">{product.stok || product.stock}</td>
                                    <td className="py-4 px-6">
                                        <div className="flex items-center justify-center gap-4">
                                            <button
                                                onClick={() => openEditModal(product)}
                                                className="text-gray-400 hover:text-blue-500"
                                            >
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() => openDeleteModal(product)}
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
                            {filteredProducts.length === 0 && (
                                <tr>
                                    <td colSpan="7" className="py-8 text-center text-gray-500">
                                        {searchQuery || categoryFilter ? 'Tidak ada produk yang sesuai dengan filter.' : 'Belum ada produk yang terdaftar.'}
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
            <ProductModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                mode="add"
                onSubmit={handleAdd}
            />

            <ProductModal
                isOpen={isEditModalOpen}
                onClose={closeEditModal}
                mode="edit"
                initialData={selectedProduct}
                onSubmit={handleEdit}
            />

            <DeleteModal
                isOpen={isDeleteModalOpen}
                onClose={closeDeleteModal}
                onConfirm={handleDelete}
                itemType="product"
            />
        </div>
    );
};

export default ProductTable;
