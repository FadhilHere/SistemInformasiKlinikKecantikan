import React, { useEffect, useState } from 'react';
import { apiFetch } from '../lib/api';
import DashboardSidebar from '../fragments/DashboardSidebar';
import DashboardHeader from '../fragments/DashboardHeader';
import DashboardCharts from '../fragments/DashboardCharts';
import StatCard from '../components/molecules/StatCard';
import { UserIcon, SalesIcon, ReservationIcon } from '../components/atoms/icons/SidebarIcons';

const DashboardPage = ({ onLogout, onNavigate }) => {
    const [stats, setStats] = useState({
        customerCount: 0,
        monthlyRevenue: 0,
        monthlyReservationCount: 0,
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setIsLoading(true);
                const [usersRes, salesRes, reservationsRes] = await Promise.all([
                    apiFetch('/api/users'),
                    apiFetch('/api/penjualan'),
                    apiFetch('/api/reservasi')
                ]);

                const users = usersRes?.data || usersRes || [];
                const sales = salesRes?.data || salesRes || [];
                const reservations = reservationsRes?.data || reservationsRes || [];

                const now = new Date();
                const currentMonth = now.getMonth();
                const currentYear = now.getFullYear();

                // 1. Customer count (role 'pelanggan')
                const customerCount = users.filter(u =>
                    (u.role || '').toLowerCase() === 'pelanggan'
                ).length;

                // 2. Monthly revenue (sum of total_price or totalHarga)
                const monthlyRevenue = sales.filter(s => {
                    const date = new Date(s.created_at || s.updated_at || s.tanggal || s.date);
                    return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
                }).reduce((sum, s) => sum + (Number(s.total_price || s.totalHarga) || 0), 0);

                // 3. Monthly reservation count (based on tanggalReservasi)
                const monthlyReservationCount = reservations.filter(r => {
                    if (!r.tanggalReservasi) return false;
                    const date = new Date(r.tanggalReservasi);
                    return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
                }).length;

                setStats({
                    customerCount,
                    monthlyRevenue,
                    monthlyReservationCount
                });
            } catch (err) {
                console.error('Failed to fetch dashboard stats:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchStats();
    }, []);

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
                        description={`${stats.customerCount} Pelanggan`}
                    />
                    <StatCard
                        icon={<SalesIcon />}
                        title="Total Penjualan Bulan Ini"
                        description={new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(stats.monthlyRevenue)}
                    />
                    <StatCard
                        icon={<ReservationIcon />}
                        title="Reservasi Bulan Ini"
                        description={`${stats.monthlyReservationCount} Reservasi`}
                    />
                </div>

                {/* Charts Area */}
                <DashboardCharts />
            </main>
        </div>
    );
};

export default DashboardPage;
