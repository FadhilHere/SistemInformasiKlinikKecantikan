import React, { useState } from 'react';
import ActivityModal from './ActivityModal';

const INITIAL_ACTIVITIES = [
    { id: 1, photo: 'https://via.placeholder.com/400x300', name: 'Workshop Perawatan Kulit', description: 'Deskripsi foto' },
    { id: 2, photo: 'https://via.placeholder.com/400x300', name: 'Seminar Kecantikan', description: 'Deskripsi foto' },
    { id: 3, photo: 'https://via.placeholder.com/400x300', name: 'Event Customer Gathering', description: 'Deskripsi foto' },
    { id: 4, photo: 'https://via.placeholder.com/400x300', name: 'Pelatihan Staff', description: 'Deskripsi foto' },
    { id: 5, photo: 'https://via.placeholder.com/400x300', name: 'Grand Opening Branch', description: 'Deskripsi foto' },
    { id: 6, photo: 'https://via.placeholder.com/400x300', name: 'Beauty Class', description: 'Deskripsi foto' }
];

const ActivityGallery = () => {
    const [activities, setActivities] = useState(INITIAL_ACTIVITIES);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedActivity, setSelectedActivity] = useState(null);

    const handleAdd = (newActivity) => {
        const activityWithId = { ...newActivity, id: activities.length + 1 };
        setActivities([...activities, activityWithId]);
        setIsAddModalOpen(false);
    };

    const handleEdit = (updatedActivity) => {
        setActivities(activities.map(a => a.id === updatedActivity.id ? updatedActivity : a));
        setIsEditModalOpen(false);
        setSelectedActivity(null);
    };

    const handleDelete = (activity) => {
        if (window.confirm('Apakah Anda yakin ingin menghapus Foto ini?')) {
            setActivities(activities.filter(a => a.id !== activity.id));
        }
    };

    const openEditModal = (activity) => {
        setSelectedActivity(activity);
        setIsEditModalOpen(true);
    };

    return (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-1">Galeri Kegiatan</h2>
                    <p className="text-gray-500 text-sm">
                        Kegiatan dan dokumentasi dari berbagai acara kami.
                    </p>
                </div>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors text-sm font-medium"
                >
                    Tambah
                </button>
            </div>

            {/* Gallery Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activities.map((activity) => (
                    <div key={activity.id} className="border border-gray-200 rounded-lg overflow-hidden">
                        {/* Photo */}
                        <div className="relative bg-gray-100 h-48 flex items-center justify-center">
                            {activity.photo ? (
                                <img src={activity.photo} alt={activity.name} className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-gray-400 text-sm">Foto</span>
                            )}
                        </div>

                        {/* Description */}
                        <div className="p-4">
                            <div className="mb-3">
                                <span className="px-3 py-1 bg-gray-800 text-white text-xs rounded">
                                    Deskripsi foto
                                </span>
                            </div>
                            <p className="text-sm text-gray-600 mb-4">{activity.description}</p>

                            {/* Actions */}
                            <div className="flex gap-2">
                                <button
                                    onClick={() => openEditModal(activity)}
                                    className="flex-1 px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors text-sm font-medium"
                                >
                                    Perbarui
                                </button>
                                <button
                                    onClick={() => handleDelete(activity)}
                                    className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm font-medium"
                                >
                                    Hapus
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modals */}
            <ActivityModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                mode="add"
                onSubmit={handleAdd}
            />

            <ActivityModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                mode="edit"
                initialData={selectedActivity}
                onSubmit={handleEdit}
            />
        </div>
    );
};

export default ActivityGallery;
