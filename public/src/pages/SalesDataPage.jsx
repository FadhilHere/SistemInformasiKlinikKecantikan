import React from 'react';
import DashboardSidebar from '../fragments/DashboardSidebar';
import SalesTable from '../fragments/SalesTable';

const SalesManagementPage = ({ onLogout, onNavigate }) => {
    return (
        <div className="h-screen bg-background flex overflow-hidden">
            {/* Sidebar */}
            <DashboardSidebar
                onLogout={onLogout}
                activeMenu="sales"
                onNavigate={onNavigate}
            />

            {/* Main Content */}
            <main className="flex-1 p-8 h-full overflow-y-auto w-full">
                {/* Header Section */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Data Penjualan</h1>
                    <p className="text-gray-500 text-sm">
                        Halaman Ini Menampilkan Data Penjualan pada sistem, termasuk hal yang berkaitan.
                    </p>
                </div>

                {/* Table Section */}
                <SalesTable />
            </main>
        </div>
    );
};

export default SalesManagementPage;
