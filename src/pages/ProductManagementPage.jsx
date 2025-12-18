import React from 'react';
import DashboardSidebar from '../fragments/DashboardSidebar';
import ProductTable from '../fragments/ProductTable';

const ProductManagementPage = ({ onLogout, onNavigate }) => {
    return (
        <div className="h-screen bg-background flex overflow-hidden">
            {/* Sidebar */}
            <DashboardSidebar
                onLogout={onLogout}
                activeMenu="products"
                onNavigate={onNavigate}
            />

            {/* Main Content */}
            <main className="flex-1 p-8 h-full overflow-y-auto w-full">
                {/* Header Section */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Produk Yang Terdaftar Pada Sistem</h1>
                    <p className="text-gray-500 text-sm">
                        Halaman Ini Menampilkan Informasi Produk, Termasuk Detail Produk. Anda Dapat Menambah, Memperbarui, Atau Menghapus Produk Melalui Halaman Ini.
                    </p>
                </div>

                {/* Table Section */}
                <ProductTable />
            </main>
        </div>
    );
};

export default ProductManagementPage;
