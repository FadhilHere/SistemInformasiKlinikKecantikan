import React, { useState, useEffect } from 'react';
import { apiFetch } from '../lib/api';
import { useNavigate } from 'react-router-dom';
import LogoIcon from '../components/atoms/LogoIcon';
import EditProfileModal from './EditProfileModal';
import LogoutConfirmModal from './LogoutConfirmModal';
import {
    DashboardIcon, ProductIcon, PromoIcon, EventIcon, SalesIcon,
    UserIcon, UserGroupIcon, ReservationIcon, ScheduleIcon,
    CategoryIcon, MessageIcon, LogoutIcon
} from '../components/atoms/icons/SidebarIcons';

const SidebarItem = ({ icon, label, active = false, onClick }) => (
    <div
        onClick={onClick}
        className={`flex items-center gap-3 px-4 py-3 rounded-md cursor-pointer transition-colors ${active ? 'bg-primary text-white font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
    >
        <div className="w-5 h-5">
            {icon}
        </div>
        <span className="text-sm">{label}</span>
    </div>
);


const DashboardSidebar = ({ onLogout, activeMenu = 'dashboard', onNavigate }) => {
    const navigate = useNavigate();
    const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
    const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await apiFetch('/api/me');
                setUser(res.data || res);
            } catch (err) {
                console.error('Failed to fetch user info:', err);
            }
        };
        fetchUser();
    }, []);

    const handleNavigation = (path) => {
        navigate(`/${path}`);
    };

    const handleLogoutClick = () => {
        setIsLogoutConfirmOpen(true);
    };

    const handleLogoutConfirm = () => {
        setIsLogoutConfirmOpen(false);
        onLogout && onLogout();
        navigate('/');
    };

    const handleLogoutCancel = () => {
        setIsLogoutConfirmOpen(false);
    };

    return (
        <aside className="w-64 bg-white h-full border-r border-gray-100 flex flex-col overflow-y-auto shrink-0 transition-all duration-300">
            {/* Logo Section */}
            <div className="p-6 flex flex-col items-center border-b border-gray-50">
                <div className="w-40 mb-4 text-center">
                    <div className="text-2xl font-bold flex items-center justify-center gap-2">
                        <span className="text-primary">🍃</span>
                        <span className="text-brand">mische</span>
                    </div>
                    <div className="text-[10px] tracking-widest text-gray-400 mt-1">AESTHETIC CLINIC</div>
                </div>

                <div className="text-center">
                    {user ? (
                        <>
                            <h3 className="font-bold text-gray-800 uppercase">{user?.nama || 'USER'}</h3>
                            <p className="text-[10px] text-gray-500">{user?.email || 'email@example.com'}</p>
                        </>
                    ) : (
                        <p className="text-xs text-gray-400">loading...</p>
                    )}
                </div>
            </div>

            {/* Menu Items */}
            <nav className="flex-1 p-4 space-y-1">
                <SidebarItem
                    icon={<DashboardIcon />}
                    label="Dashboard"
                    active={activeMenu === 'dashboard'}
                    onClick={() => handleNavigation('dashboard')}
                />
                <SidebarItem
                    icon={<ProductIcon />}
                    label="Kelola Produk"
                    active={activeMenu === 'products'}
                    onClick={() => handleNavigation('products')}
                />
                <SidebarItem
                    icon={<PromoIcon />}
                    label="Kelola Promo"
                    active={activeMenu === 'promos'}
                    onClick={() => handleNavigation('promos')}
                />
                <SidebarItem
                    icon={<EventIcon />}
                    label="Kelola Event"
                    active={activeMenu === 'events'}
                    onClick={() => handleNavigation('events')}
                />
                <SidebarItem
                    icon={<SalesIcon />}
                    label="Data Penjualan"
                    active={activeMenu === 'sales'}
                    onClick={() => handleNavigation('sales')}
                />

                <SidebarItem
                    icon={<UserIcon />}
                    label="Kelola Profil Dokter"
                    active={activeMenu === 'doctor'}
                    onClick={() => handleNavigation('doctor')}
                />
                <SidebarItem
                    icon={<UserGroupIcon />}
                    label="Kelola User"
                    active={activeMenu === 'users'}
                    onClick={() => handleNavigation('users')}
                />
                <SidebarItem
                    icon={<ReservationIcon />}
                    label="Kelola Reservasi Treatment"
                    active={activeMenu === 'reservations'}
                    onClick={() => handleNavigation('reservations')}
                />
                <SidebarItem
                    icon={<ScheduleIcon />}
                    label="Kelola Jadwal Reservasi Treatment"
                    active={activeMenu === 'schedules'}
                    onClick={() => handleNavigation('schedules')}
                />
                <SidebarItem
                    icon={<CategoryIcon />}
                    label="Kelola Kategori Produk"
                    active={activeMenu === 'categories'}
                    onClick={() => handleNavigation('categories')}
                />
                <SidebarItem
                    icon={<MessageIcon />}
                    label="Testimoni Customer"
                    active={activeMenu === 'testimonials'}
                    onClick={() => handleNavigation('testimonials')}
                />
                <SidebarItem
                    icon={<CategoryIcon />}
                    label="Profil Klinik"
                    active={activeMenu === 'clinic-profile'}
                    onClick={() => handleNavigation('clinic-profile')}
                />
                <SidebarItem
                    icon={<MessageIcon />}
                    label="Audit Log"
                    active={activeMenu === 'audit-logs'}
                    onClick={() => handleNavigation('audit-logs')}
                />
            </nav>


            <div className="p-4 border-t border-gray-50 mt-auto">
                <div onClick={handleLogoutClick} className="flex items-center gap-3 px-4 py-3 rounded-md cursor-pointer text-gray-600 hover:bg-red-50 hover:text-red-500 transition-colors">
                    <LogoutIcon />
                    <span className="text-sm">Logout</span>
                </div>
            </div>

            {/* Modals */}
            <EditProfileModal
                isOpen={isEditProfileOpen}
                onClose={() => setIsEditProfileOpen(false)}
            />
            <LogoutConfirmModal
                isOpen={isLogoutConfirmOpen}
                onConfirm={handleLogoutConfirm}
                onCancel={handleLogoutCancel}
            />
        </aside>
    );
};

export default DashboardSidebar;
