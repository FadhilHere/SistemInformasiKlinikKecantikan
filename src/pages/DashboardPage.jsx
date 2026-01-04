import React from 'react';
import DashboardSidebar from '../fragments/DashboardSidebar';
import DashboardHeader from '../fragments/DashboardHeader';
import DashboardCharts from '../fragments/DashboardCharts';
import StatCard from '../components/molecules/StatCard';
import { UserIcon, SalesIcon, ReservationIcon } from '../components/atoms/icons/SidebarIcons';

const DashboardPage = ({ onLogout, onNavigate }) => {
    return (
        <div className="h-screen bg-background flex overflow-hidden">
            {/* Fixed Sidebar */}
            <DashboardSidebar
                onLogout={onLogout}
                activeMenu="dashboard"
                onNavigate={onNavigate}
            />

            {/* Main Content Area */}
            <main className="flex-1 p-8 h-full overflow-y-auto">
                <DashboardHeader />

                {/* Stat Cards Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <StatCard
                        icon={<UserIcon />}
                        title="Jumlah Customer"
                        description="Description"
                    />
                    <StatCard
                        icon={<SalesIcon />}
                        title="Total Penjualan Bulan Ini"
                        description="Description"
                    />
                    <StatCard
                        icon={<ReservationIcon />}
                        title="Reservasi Bulan Ini"
                        description="Description"
                    />
                </div>

                {/* Charts Area */}
                <DashboardCharts />
            </main>
        </div>
    );
};

export default DashboardPage;
