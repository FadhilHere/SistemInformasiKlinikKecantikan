import React from 'react';
import DashboardSidebar from '../fragments/DashboardSidebar';
import ScheduleReservationTable from '../fragments/ScheduleReservationTable';

const ScheduleReservationPage = ({ onLogout, onNavigate }) => {
    return (
        <div className="h-screen bg-background flex overflow-hidden">
            {/* Sidebar */}
            <DashboardSidebar
                onLogout={onLogout}
                activeMenu="schedules"
                onNavigate={onNavigate}
            />

            {/* Main Content */}
            <main className="flex-1 p-8 h-full overflow-y-auto w-full">
                {/* Header Section */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Data Jadwal Reservasi Treatment</h1>
                    <p className="text-gray-500 text-sm">
                        Menampilkan data jadwal reservasi treatment lengkap dengan jadwal dan informasi pengunjung. Admin dapat melakukan pencarian, edit, dan hapus data.
                    </p>
                </div>

                {/* Table Section */}
                <ScheduleReservationTable />
            </main>
        </div>
    );
};

export default ScheduleReservationPage;
