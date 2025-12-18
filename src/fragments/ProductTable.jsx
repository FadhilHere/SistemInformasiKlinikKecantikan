import React, { useState } from 'react';
import ProductModal from './ProductModal';
import DeleteModal from './DeleteModal';

// Mock Data
const INITIAL_PRODUCTS = Array(2).fill({
    name: 'Acne',
    description: 'Description',
    category: 'Serum',
    price: 'Rp. 15.000',
    stock: 10
}).map((p, i) => ({ ...p, id: i + 1 }));

const ProductTable = () => {
    const [products, setProducts] = useState(INITIAL_PRODUCTS);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    // Handlers
    const handleAdd = (newProduct) => {
        const productWithId = { ...newProduct, id: products.length + 1 }; // Simple ID gen
        setProducts([...products, productWithId]);
        setIsAddModalOpen(false);
    };

    const handleEdit = (updatedProduct) => {
        setProducts(products.map(p => p.id === updatedProduct.id ? updatedProduct : p));
        setIsEditModalOpen(false);
        setSelectedProduct(null);
    };

    const handleDelete = () => {
        setProducts(products.filter(p => p.id !== selectedProduct.id));
        setIsDeleteModalOpen(false);
        setSelectedProduct(null);
    };

    const openEditModal = (product) => {
        setSelectedProduct(product);
        setIsEditModalOpen(true);
    };

    const openDeleteModal = (product) => {
        setSelectedProduct(product);
        setIsDeleteModalOpen(true);
    };

    const updateStock = (id, change) => {
        setProducts(products.map(p => {
            if (p.id === id) {
                const newStock = p.stock + change;
                return { ...p, stock: newStock >= 0 ? newStock : 0 };
            }
            return p;
        }));
    };

    return (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            {/* Table Header Controls */}
            <div className="p-4 flex items-center border-b border-gray-100">
                <div className="flex gap-2 ml-auto">
                    {/* Filter Dropdown */}
                    <div className="relative">
                        <select className="appearance-none bg-gray-100 text-sm pl-4 pr-8 py-2 rounded-md border-none focus:ring-1 focus:ring-primary cursor-pointer text-gray-600">
                            <option>All Product</option>
                            <option>Serum</option>
                            <option>Cream</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                            <svg className="fill-current h-4 w-4" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                        </div>
                    </div>

                    {/* Search Bar */}
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search Produk"
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
                            <th className="py-4 px-6 font-medium">Deskripsi</th>
                            <th className="py-4 px-6 font-medium">Kategori</th>
                            <th className="py-4 px-6 font-medium">Harga</th>
                            <th className="py-4 px-6 font-medium text-center">Stock</th>
                            <th className="py-4 px-6 font-medium text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product, index) => (
                            <tr key={product.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                <td className="py-4 px-6 text-gray-400">{index + 1}</td>
                                <td className="py-4 px-6 font-medium text-gray-900">{product.name}</td>
                                <td className="py-4 px-6 text-gray-500 max-w-xs truncate">{product.description}</td>
                                <td className="py-4 px-6 text-gray-500">{product.category}</td>
                                <td className="py-4 px-6 text-gray-900 font-medium">{product.price}</td>
                                <td className="py-4 px-6">
                                    <div className="flex items-center justify-center gap-3">
                                        <button
                                            onClick={() => updateStock(product.id, 1)}
                                            className="text-gray-400 hover:text-black font-bold text-lg"
                                        >+</button>
                                        <span className="w-6 text-center text-gray-600">{product.stock}</span>
                                        <button
                                            onClick={() => updateStock(product.id, -1)}
                                            className="text-gray-400 hover:text-black font-bold text-lg"
                                        >-</button>
                                    </div>
                                </td>
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
                        {products.length === 0 && (
                            <tr>
                                <td colSpan="7" className="py-8 text-center text-gray-500">Belum ada produk yang terdaftar.</td>
                            </tr>
                        )}
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
            <ProductModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                mode="add"
                onSubmit={handleAdd}
            />

            <ProductModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                mode="edit"
                initialData={selectedProduct}
                onSubmit={handleEdit}
            />

            <DeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDelete}
            />
        </div>
    );
};

export default ProductTable;
