import React from 'react';
import DashboardSidebar from '../fragments/DashboardSidebar';
import ClinicProfileForm from '../fragments/ClinicProfileForm';
import ActivityGallery from '../fragments/ActivityGallery';

const ClinicProfilePage = ({ onLogout, onNavigate }) => {
    return (
        <div className="h-screen bg-background flex overflow-hidden">
            {/* Sidebar */}
            <DashboardSidebar
                onLogout={onLogout}
                activeMenu="clinic-profile"
                onNavigate={onNavigate}
            />

            {/* Main Content */}
            <main className="flex-1 p-8 h-full overflow-y-auto w-full">
                <div className="space-y-8">
                    {/* Clinic Profile Form Section */}
                    <ClinicProfileForm />

                    {/* Activity Gallery Section */}
                    <ActivityGallery />
                </div>
            </main>
        </div>
    );
};

export default ClinicProfilePage;
