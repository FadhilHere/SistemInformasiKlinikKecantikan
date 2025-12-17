import React from 'react';
import DashboardSidebar from '../fragments/DashboardSidebar';
import ProductCategoryTable from '../fragments/ProductCategoryTable';

const ProductCategoryPage = ({ onLogout, onNavigate }) => {
    return (
        <div className="h-screen bg-background flex overflow-hidden">
            {/* Sidebar */}
            <DashboardSidebar
                onLogout={onLogout}
                activeMenu="categories"
                onNavigate={onNavigate}
            />

            {/* Main Content */}
            <main className="flex-1 p-8 h-full overflow-y-auto w-full">
                {/* Header Section */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Kategori Produk</h1>
                    <p className="text-gray-500 text-sm">
                        Halaman ini menampilkan dan mengatur daftar kategori produk yang tersedia di klinik.
                    </p>
                </div>

                {/* Table Section */}
                <ProductCategoryTable />
            </main>
        </div>
    );
};

export default ProductCategoryPage;
