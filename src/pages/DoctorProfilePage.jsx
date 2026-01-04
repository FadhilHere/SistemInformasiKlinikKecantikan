import React from 'react';
import DashboardSidebar from '../fragments/DashboardSidebar';
import DoctorTable from '../fragments/DoctorTable';

const DoctorProfilePage = ({ onLogout, onNavigate }) => {
    return (
        <div className="h-screen bg-background flex overflow-hidden">
            {/* Sidebar */}
            <DashboardSidebar
                onLogout={onLogout}
                activeMenu="doctor"
                onNavigate={onNavigate}
            />

            {/* Main Content */}
            <main className="flex-1 p-8 h-full overflow-y-auto w-full">
                {/* Header Section */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Profil Dokter</h1>
                    <p className="text-gray-500 text-sm">
                        Halaman Ini Menampilkan Kelola Profil Dokter yang terdaftar pada sistem, Anda Dapat Menambah, Memperbarui, Atau Menghapus Profil Melalui Halaman Ini.
                    </p>
                </div>

                {/* Table Section */}
                <DoctorTable />
            </main>
        </div>
    );
};

export default DoctorProfilePage;
