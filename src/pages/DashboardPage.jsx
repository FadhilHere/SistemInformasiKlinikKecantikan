import React, { useEffect, useMemo, useState } from 'react';
import DashboardSidebar from '../fragments/DashboardSidebar';
import DashboardHeader from '../fragments/DashboardHeader';
import DashboardCharts from '../fragments/DashboardCharts';
import StatCard from '../components/molecules/StatCard';
import { UserIcon, SalesIcon, ReservationIcon } from '../components/atoms/icons/SidebarIcons';
import { apiFetch } from '../lib/api';

const DashboardPage = ({ onLogout, onNavigate }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [customerCount, setCustomerCount] = useState(0);
    const [salesMonthTotal, setSalesMonthTotal] = useState(0);
    const [reservationMonthCount, setReservationMonthCount] = useState(0);
    const [customerMonthly, setCustomerMonthly] = useState(Array(12).fill(0));
    const [salesMonthly, setSalesMonthly] = useState(Array(12).fill(0));
    const [reservationByTreatment, setReservationByTreatment] = useState([]);
    const [topProducts, setTopProducts] = useState([]);

    const normalizeListResponse = (res) => {
        if (Array.isArray(res)) return res;
        if (Array.isArray(res?.data)) return res.data;
        if (Array.isArray(res?.data?.data)) return res.data.data;
        return [];
    };

    const parseDate = (value) => {
        if (!value) return null;
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) return null;
        return date;
    };

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                setIsLoading(true);
                const [usersRes, salesRes, reservationsRes, productsRes] = await Promise.all([
                    apiFetch('/api/users'),
                    apiFetch('/api/penjualan'),
                    apiFetch('/api/reservasi'),
                    apiFetch('/api/produk-klinik')
                ]);

                const users = normalizeListResponse(usersRes);
                const sales = normalizeListResponse(salesRes);
                const reservations = normalizeListResponse(reservationsRes);
                const products = normalizeListResponse(productsRes);

                const now = new Date();
                const currentYear = now.getFullYear();
                const currentMonth = now.getMonth();

                setCustomerCount(users.length);

                const customerMonthlyCounts = Array(12).fill(0);
                users.forEach((user) => {
                    const date = parseDate(user.created_at || user.createdAt);
                    if (!date || date.getFullYear() !== currentYear) return;
                    customerMonthlyCounts[date.getMonth()] += 1;
                });
                setCustomerMonthly(customerMonthlyCounts);

                const salesMonthlyTotals = Array(12).fill(0);
                let monthSalesTotal = 0;
                sales.forEach((sale) => {
                    const date = parseDate(sale.tanggal || sale.date || sale.created_at);
                    const totalValue = Number(sale.totalHarga || sale.total_price || 0);
                    if (!date || date.getFullYear() !== currentYear) return;
                    salesMonthlyTotals[date.getMonth()] += totalValue;
                    if (date.getMonth() === currentMonth) {
                        monthSalesTotal += totalValue;
                    }
                });
                setSalesMonthly(salesMonthlyTotals);
                setSalesMonthTotal(monthSalesTotal);

                let monthReservationCount = 0;
                const treatmentMap = new Map();
                reservations.forEach((reservation) => {
                    const date = parseDate(reservation.tanggalReservasi || reservation.tanggal || reservation.created_at);
                    if (date && date.getFullYear() === currentYear && date.getMonth() === currentMonth) {
                        monthReservationCount += 1;
                    }
                    const treatmentName = reservation.jenisTreatment || reservation.treatment?.namaTreatment;
                    if (treatmentName) {
                        treatmentMap.set(treatmentName, (treatmentMap.get(treatmentName) || 0) + 1);
                    }
                });
                setReservationMonthCount(monthReservationCount);
                setReservationByTreatment(
                    Array.from(treatmentMap.entries()).map(([label, value]) => ({ label, value }))
                );

                const productMap = new Map(
                    products.map((product) => [String(product.idProduk || product.id), product.nama || product.name])
                );
                const productSalesMap = new Map();
                sales.forEach((sale) => {
                    const detailList =
                        sale.detailpenjualan ||
                        sale.detailPenjualan ||
                        sale.details ||
                        sale.detail ||
                        [];
                    if (!Array.isArray(detailList)) return;
                    detailList.forEach((detail) => {
                        const idProduk = detail.idProduk || detail.produk?.idProduk || detail.product?.id;
                        const name =
                            detail.produk?.nama ||
                            detail.product?.nama ||
                            (idProduk ? productMap.get(String(idProduk)) : null) ||
                            'Produk';
                        const qty = Number(detail.jumlahProduk || detail.quantity || detail.qty || 0);
                        if (!qty) return;
                        productSalesMap.set(name, (productSalesMap.get(name) || 0) + qty);
                    });
                });
                const topProductList = Array.from(productSalesMap.entries())
                    .map(([name, value]) => ({ name, value }))
                    .sort((a, b) => b.value - a.value)
                    .slice(0, 5);
                setTopProducts(topProductList);
            } catch (err) {
                console.error('Failed to fetch dashboard data:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboard();
    }, []);

    const formatCurrency = (value) => {
        return `Rp ${Number(value || 0).toLocaleString('id-ID')}`;
    };

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
                        description={isLoading ? 'loading...' : `${customerCount} Customer`}
                    />
                    <StatCard
                        icon={<SalesIcon />}
                        title="Total Penjualan Bulan Ini"
                        description={isLoading ? 'loading...' : formatCurrency(salesMonthTotal)}
                    />
                    <StatCard
                        icon={<ReservationIcon />}
                        title="Reservasi Bulan Ini"
                        description={isLoading ? 'loading...' : `${reservationMonthCount} Reservasi`}
                    />
                </div>

                {/* Charts Area */}
                <DashboardCharts
                    isLoading={isLoading}
                    customerMonthly={customerMonthly}
                    topProducts={topProducts}
                    reservationByTreatment={reservationByTreatment}
                    salesMonthly={salesMonthly}
                />
            </main>
        </div>
    );
};

export default DashboardPage;
