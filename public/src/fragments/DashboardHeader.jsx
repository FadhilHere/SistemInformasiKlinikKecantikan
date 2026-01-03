import React, { useEffect, useState } from 'react';
import { apiFetch } from '../lib/api';

const DashboardHeader = () => {
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

    return (
        <div className="w-full bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-8 relative overflow-hidden">
            <div className="relative z-10 max-w-2xl">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome {user?.nama || 'User'}</h1>
                <p className="text-gray-500 text-sm leading-relaxed">
                    Kerja keras kita hari ini adalah fondasi untuk membangun Klinik Kecantikan Mische yang lebih baik.
                </p>
            </div>

            {/* Illustration Placeholder - simplistic CSS representation of the illustration in design */}
            <div className="absolute right-10 top-1/2 -translate-y-1/2 hidden md:block">
                {/* This would ideally be an SVG or Image, assuming placeholder for now */}

            </div>
        </div>
    );
};

export default DashboardHeader;
