import React from 'react';

const StatCard = ({ icon, title, description }) => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-start gap-4 hover:shadow-md transition-shadow">
            <div className="p-3 bg-gray-50 rounded-full">
                {icon}
            </div>
            <div>
                <h3 className="text-gray-900 font-bold text-lg">{title}</h3>
                <p className="text-gray-500 text-sm mt-1">{description}</p>
            </div>
        </div>
    );
};

export default StatCard;
