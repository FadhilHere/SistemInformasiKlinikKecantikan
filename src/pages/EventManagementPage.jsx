import React from 'react';
import DashboardSidebar from '../fragments/DashboardSidebar';
import EventTable from '../fragments/EventTable';

const EventManagementPage = ({ onLogout, onNavigate }) => {
    return (
        <div className="h-screen bg-background flex overflow-hidden">
            {/* Sidebar */}
            <DashboardSidebar
                onLogout={onLogout}
                activeMenu="events"
                onNavigate={onNavigate}
            />

            {/* Main Content */}
            <main className="flex-1 p-8 h-full overflow-y-auto w-full">
                {/* Header Section */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Event Yang Terdaftar Pada Sistem</h1>
                    <p className="text-gray-500 text-sm">
                        Halaman Ini Menampilkan Informasi mengenai Event yang ada dan Anda Dapat Menambah, Memperbarui, Atau Menghapus Event Melalui Halaman Ini.
                    </p>
                </div>

                {/* Table Section */}
                <EventTable />
            </main>
        </div>
    );
};

export default EventManagementPage;
