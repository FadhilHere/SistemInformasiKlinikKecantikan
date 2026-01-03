import React from 'react';

const DeleteModal = ({ isOpen, onClose, onConfirm, itemType = 'produk' }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden m-4 p-8 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4 text-gray-400">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="8" x2="12" y2="12"></line>
                        <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                </div>

                <h3 className="text-lg font-medium text-gray-600 mb-8">Apakah Anda yakin ingin menghapus {itemType} ini?</h3>

                <div className="flex gap-4 w-full">
                    <button
                        onClick={onConfirm}
                        className="flex-1 bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary-dark transition-colors"
                    >
                        Ya, Hapus
                    </button>
                    <button
                        onClick={onClose}
                        className="flex-1 bg-white border border-gray-200 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                    >
                        Tidak, Batalkan
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteModal;
