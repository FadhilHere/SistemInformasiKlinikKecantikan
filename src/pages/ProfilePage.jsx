import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../fragments/Navbar'
import Footer from '../fragments/Footer'
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import {
    isValidPhone,
    isNotEmpty,
    sanitizeInput
} from '../utils/validators'
import { apiFetch } from '../lib/api'


const ProfilePage = ({ isLoggedIn, onLogout, initialTab = 'profile' }) => {
    const navigate = useNavigate()
    const [activeTab, setActiveTab] = useState(initialTab) // 'profile' | 'reservation_history' | 'product_history'

    // Update activeTab when initialTab prop changes (e.g. routing)
    useEffect(() => {
        setActiveTab(initialTab)
    }, [initialTab])

    // Form States
    const [name, setName] = useState("")
    const [address, setAddress] = useState("")
    const [birthDate, setBirthDate] = useState(null)
    const [gender, setGender] = useState("Perempuan")
    const [whatsapp, setWhatsapp] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [oldPassword, setOldPassword] = useState("") // New state
    const [statusMessage, setStatusMessage] = useState({ type: '', text: '' })
    const [userId, setUserId] = useState(null) // New state

    useEffect(() => {
        if (isLoggedIn) {
            const fetchProfile = async () => {
                try {
                    const user = await apiFetch('/api/me');
                    if (user.id) setUserId(user.id);
                    setName(user.nama || '');
                    setAddress(user.alamat || '');
                    setBirthDate(user.tanggalLahir || user.tanggal_lahir ? new Date(user.tanggalLahir || user.tanggal_lahir) : null);
                    setGender(user.jenisKelamin || user.jenis_kelamin || 'Perempuan');
                    setWhatsapp(user.nomorWa || user.nomor_wa || '');
                    setEmail(user.email || '');
                } catch (error) {
                    console.error("Failed to fetch profile", error);
                    if (error.status === 401) {
                         onLogout();
                    }
                }
            };
            fetchProfile();
        }
    }, [isLoggedIn, onLogout]);

    const handleSave = () => {
        // Basic Empty Checks
        if (!isNotEmpty(name) || !isNotEmpty(address) || !birthDate || !isNotEmpty(whatsapp) || !isNotEmpty(email)) {
            setStatusMessage({ type: 'error', text: 'Semua data diri wajib diisi.' })
            return
        }

        // Specific Format Checks
        if (!isValidEmail(email)) {
            setStatusMessage({ type: 'error', text: 'Format email tidak valid.' })
            return
        }

        if (!isValidPhone(whatsapp)) {
            setStatusMessage({ type: 'error', text: 'Nomor WhatsApp tidak valid.' })
            return
        }

        // If password is changed (length > 0), validate it. 
        // Assuming if it's the default "12345" we might skip strict check OR enforce update? 
        // Let's enforce strictness if they try to save.

        // Check if password fields are empty? No, they have defaults.
        // If strict validation is required:
        // "12345" is weak. 
        // Ideally we shouldn't prepopulate password in plain text, but this is a mock.

        if (password !== confirmPassword) {
            setStatusMessage({ type: 'error', text: 'Password dan konfirmasi tidak sama.' })
            return
        }

        // Sanitize
        const cleanData = {
            name: sanitizeInput(name),
            address: sanitizeInput(address),
            gender: sanitizeInput(gender), // Select, but good to be safe
            whatsapp: sanitizeInput(whatsapp),
            email: sanitizeInput(email),
            // Password usually hashed server side, we don't sanitize characters as they are effectively secrets
        }

        console.log("Saving clean data:", cleanData)
        setStatusMessage({ type: 'success', text: 'Profil berhasil diperbarui!' })
    }

    // (Removed duplicate reservationHistory)

    // Product History State
    const [productHistory, setProductHistory] = useState([])
    const [loadingProductHistory, setLoadingProductHistory] = useState(false)

    useEffect(() => {
        if (activeTab === 'product_history' && isLoggedIn) {
            const fetchProductHistory = async () => {
                setLoadingProductHistory(true)
                try {
                    const response = await apiFetch('/api/penjualan')
                    if (response.success && Array.isArray(response.data)) {
                        setProductHistory(response.data)
                    }
                } catch (error) {
                    console.error("Failed to fetch product history", error)
                } finally {
                    setLoadingProductHistory(false)
                }
            }
            fetchProductHistory()
        }
    }, [activeTab, isLoggedIn])

    // Helper functions for formatting
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(value)
    }

    const formatDate = (dateString) => {
        if (!dateString) return '-'
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric', month: 'long', year: 'numeric'
        })
    }

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'bg-yellow-500'
            case 'paid': return 'bg-blue-500'
            case 'shipped': return 'bg-indigo-500'
            case 'completed': return 'bg-[#53c41a]'
            case 'cancelled': return 'bg-red-500'
            default: return 'bg-gray-400'
        }
    }

    // Reservation State
    const [reservations, setReservations] = useState([])
    const [isLoadingReservations, setIsLoadingReservations] = useState(false)
    const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false)
    const [selectedReservation, setSelectedReservation] = useState(null)
    const [newDate, setNewDate] = useState(new Date())
    const [selectedSlotId, setSelectedSlotId] = useState('')
    const [availableSlots, setAvailableSlots] = useState([])

    // Fetch Reservations
    useEffect(() => {
        if (activeTab === 'reservation_history' && isLoggedIn) {
            const fetchReservations = async () => {
                setIsLoadingReservations(true)
                try {
                    const response = await apiFetch('/api/reservasi')
                    console.log('Raw Reservation Response:', response) // DEBUG

                    // Flexible extraction
                    let data = []
                    if (Array.isArray(response)) {
                        data = response
                    } else if (response.data && Array.isArray(response.data)) {
                        data = response.data
                    } else if (response.reservasi && Array.isArray(response.reservasi)) {
                         data = response.reservasi
                    }

                    console.log('Extracted Reservation Data:', data) // DEBUG
                    setReservations(data)
                    
                } catch (error) {
                    console.error("Failed to fetch reservations", error)
                } finally {
                    setIsLoadingReservations(false)
                }
            }
            fetchReservations()
        }
    }, [activeTab, isLoggedIn])

    // Fetch Available Slots for Rescheduling
    useEffect(() => {
        const fetchSlots = async () => {
            try {
                const response = await apiFetch('/api/jadwal-reservasi')
                const data = response.data || response
                if (Array.isArray(data)) {
                    setAvailableSlots(data)
                }
            } catch (error) {
                console.error("Failed to fetch slots", error)
            }
        }
        if (isLoggedIn) fetchSlots()
    }, [isLoggedIn])

    const handleEditClick = (reservation) => {
        setSelectedReservation(reservation)
        setNewDate(reservation.tanggal ? new Date(reservation.tanggal) : new Date())
        setSelectedSlotId(reservation.idJadwal || '')
        setIsRescheduleModalOpen(true)
    }

    const handleSaveReschedule = async () => {
        if (!selectedReservation || !newDate || !selectedSlotId) {
             setStatusMessage({ type: 'error', text: 'Mohon lengkapi tanggal dan jam baru.' })
             return
        }

        try {
            const formattedDate = newDate.toISOString().split('T')[0]
            
            await apiFetch(`/api/reservasi/${selectedReservation.idReservasi}`, {
                method: 'PUT',
                body: JSON.stringify({
                    tanggalReservasi: formattedDate,
                    idJadwal: selectedSlotId,
                    // Preserve other fields if backend requires them, but usually PUT accepts partial or we send what we change
                    idDokter: selectedReservation.idDokter, 
                    idTreatment: selectedReservation.idTreatment
                })
            })

            setStatusMessage({ type: 'success', text: 'Jadwal reservasi berhasil diubah.' })
            setIsRescheduleModalOpen(false)
            
            // Refresh List
            const response = await apiFetch('/api/reservasi')
            const data = response.data || response
            if (Array.isArray(data)) {
                 setReservations(data)
            }

        } catch (error) {
            console.error("Reschedule error:", error)
            setStatusMessage({ type: 'error', text: 'Gagal mengubah jadwal.' })
        }
    }

    return (
        <div className="min-h-screen bg-[#f9f9f9] font-sans">
            <Navbar isLoggedIn={isLoggedIn} />

            <main className="mx-auto max-w-6xl px-4 py-8 md:px-8">
                {/* Banner */}
                <div className="relative mb-8 overflow-hidden rounded-[30px] bg-gradient-to-r from-[#4aa731] to-[#65ce4d] px-8 py-10 text-white shadow-lg md:px-12 md:py-14">
                    <div className="relative z-10 max-w-2xl">
                        <h1 className="mb-2 text-3xl font-bold md:text-4xl">
                            {activeTab === 'profile' && 'Profil Saya'}
                            {activeTab === 'reservation_history' && 'Riwayat Pemesanan Reservasi'}
                            {activeTab === 'product_history' && 'Riwayat Pemesanan Produk'}
                        </h1>
                        <p className="max-w-lg text-sm md:text-base opacity-90">
                            {activeTab === 'profile' && 'Kelola Informasi Profil Anda Untuk Mengontrol, Melindungi Dan Mengamankan Akun'}
                            {activeTab === 'reservation_history' && 'Anda Dapat Melihat Keseluruhan Dari Riwayat Pemesanan Reservasi Anda'}
                            {activeTab === 'product_history' && 'Anda Dapat Melihat Keseluruhan Dari Riwayat Pembelian Produk Anda'}
                        </p>
                    </div>
                    {/* Decorative Silhouette */}
                    <div className="absolute right-0 top-0 h-full w-1/3 opacity-30 mix-blend-overlay">
                        <svg viewBox="0 0 200 200" className="h-full w-full" preserveAspectRatio="none" fill="currentColor">
                            <path d="M100 0C44.8 0 0 44.8 0 100s44.8 100 100 100 100-44.8 100-100S155.2 0 100 0zm0 180c-44.1 0-80-35.9-80-80s35.9-80 80-80 80 35.9 80 80-35.9 80-80 80z" transform="scale(1.5) translate(-20, 0)" />
                        </svg>
                    </div>
                </div>

                {/* Navigation Cards */}
                {activeTab === 'profile' && (
                    <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
                        <button
                            onClick={() => navigate('/riwayat-pembelian')}
                            className="flex items-center justify-center gap-4 rounded-[20px] bg-white p-6 shadow-md transition hover:shadow-lg"
                        >
                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#4aa731]/10">
                                <svg className="h-8 w-8 text-[#4aa731]" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M16 6V4a4 4 0 00-8 0v2H5a1 1 0 00-1 1v12a3 3 0 003 3h10a3 3 0 003-3V7a1 1 0 00-1-1h-3zm-6-2a2 2 0 012 2v2h-4V4a2 2 0 012-2zm8 14a1 1 0 01-1 1H7a1 1 0 01-1-1V8h12v10z" />
                                </svg>
                            </div>
                            <div className="text-left">
                                <h3 className="text-lg font-bold text-black">Riwayat Pembelian</h3>
                                <h3 className="text-lg font-bold text-black">Produk</h3>
                            </div>
                        </button>

                        <button
                            onClick={() => navigate('/riwayat-reservasi')}
                            className="flex items-center justify-center gap-4 rounded-[20px] bg-white p-6 shadow-md transition hover:shadow-lg"
                        >
                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-[#4aa731] bg-white">
                                <svg className="h-8 w-8 text-[#4aa731]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                                </svg>
                            </div>
                            <div className="text-left">
                                <h3 className="text-lg font-bold text-black">Riwayat Melakukan</h3>
                                <h3 className="text-lg font-bold text-black">Reservasi</h3>
                            </div>
                        </button>
                    </div>
                )}

                {/* Content Area */}
                <div className="rounded-[40px] bg-white p-8 shadow-xl md:p-12">
                    {activeTab === 'profile' && (
                        <div className="flex flex-col-reverse gap-12 lg:flex-row lg:gap-16">

                            {/* Form Fields */}
                            <div className="flex-1 space-y-6">
                                {/* Name */}
                                <div className="grid grid-cols-1 items-center gap-4 md:grid-cols-4">
                                    <label className="font-bold text-black md:col-span-1">Nama <span className="float-right hidden md:inline">:</span></label>
                                    <div className="md:col-span-3">
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="w-full rounded-xl border border-gray-200 bg-white px-6 py-3 shadow-inner focus:border-[#4aa731] focus:outline-none"
                                        />
                                    </div>
                                </div>

                                {/* Alamat */}
                                <div className="grid grid-cols-1 items-center gap-4 md:grid-cols-4">
                                    <label className="font-bold text-black md:col-span-1">Alamat <span className="float-right hidden md:inline">:</span></label>
                                    <div className="md:col-span-3">
                                        <input
                                            type="text"
                                            value={address}
                                            onChange={(e) => setAddress(e.target.value)}
                                            className="w-full rounded-xl border border-gray-200 bg-white px-6 py-3 shadow-inner focus:border-[#4aa731] focus:outline-none"
                                        />
                                    </div>
                                </div>

                                {/* Tanggal Lahir */}
                                <div className="grid grid-cols-1 items-center gap-4 md:grid-cols-4">
                                    <label className="font-bold text-black md:col-span-1">Tanggal Lahir <span className="float-right hidden md:inline">:</span></label>
                                    <div className="md:col-span-3">
                                        <div className="relative">
                                            <DatePicker
                                                selected={birthDate}
                                                onChange={(date) => setBirthDate(date)}
                                                dateFormat="dd/MM/yyyy"
                                                placeholderText="dd/mm/yyyy"
                                                className="w-full rounded-xl border border-gray-200 bg-white px-6 py-3 shadow-inner focus:border-[#4aa731] focus:outline-none"
                                            />
                                            <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-black">
                                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Jenis Kelamin */}
                                <div className="grid grid-cols-1 items-center gap-4 md:grid-cols-4">
                                    <label className="font-bold text-black md:col-span-1">Jenis Kelamin <span className="float-right hidden md:inline">:</span></label>
                                    <div className="md:col-span-3">
                                        <div className="relative">
                                            <select
                                                value={gender}
                                                onChange={(e) => setGender(e.target.value)}
                                                className="w-full appearance-none rounded-xl border border-gray-200 bg-white px-6 py-3 shadow-inner focus:border-[#4aa731] focus:outline-none"
                                            >
                                                <option>Perempuan</option>
                                                <option>Laki-laki</option>
                                            </select>
                                            <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#4aa731]">
                                                <svg className="h-5 w-5 fill-current" viewBox="0 0 20 20">
                                                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* WhatsApp */}
                                <div className="grid grid-cols-1 items-center gap-4 md:grid-cols-4">
                                    <label className="font-bold text-black md:col-span-1">Nomor WhatsApp <span className="float-right hidden md:inline">:</span></label>
                                    <div className="md:col-span-3">
                                        <input
                                            type="text"
                                            value={whatsapp}
                                            onChange={(e) => setWhatsapp(e.target.value)}
                                            className="w-full rounded-xl border border-gray-200 bg-white px-6 py-3 shadow-inner focus:border-[#4aa731] focus:outline-none"
                                        />
                                    </div>
                                </div>

                                {/* Email */}
                                <div className="grid grid-cols-1 items-center gap-4 md:grid-cols-4">
                                    <label className="font-bold text-black md:col-span-1">Email <span className="float-right hidden md:inline">:</span></label>
                                    <div className="md:col-span-3">
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full rounded-xl border border-gray-200 bg-white px-6 py-3 shadow-inner focus:border-[#4aa731] focus:outline-none underline"
                                        />
                                    </div>
                                </div>

                                {/* Change Password Section */}
                                <div className="mt-6 border-t pt-6">
                                    <h3 className="mb-4 text-lg font-bold text-gray-700">Ubah Password (Opsional)</h3>
                                    
                                    {/* Old Password */}
                                    <div className="mb-4 grid grid-cols-1 items-center gap-4 md:grid-cols-4">
                                        <label className="font-bold text-black md:col-span-1">Password Lama <span className="float-right hidden md:inline">:</span></label>
                                        <div className="md:col-span-3">
                                            <input
                                                type="password"
                                                value={oldPassword}
                                                onChange={(e) => setOldPassword(e.target.value)}
                                                placeholder="Masukkan password lama jika ingin mengubah"
                                                className="w-full rounded-xl border border-gray-200 bg-white px-6 py-3 shadow-inner focus:border-[#4aa731] focus:outline-none"
                                            />
                                        </div>
                                    </div>

                                    {/* New Password */}
                                    <div className="mb-4 grid grid-cols-1 items-center gap-4 md:grid-cols-4">
                                        <label className="font-bold text-black md:col-span-1">Password Baru <span className="float-right hidden md:inline">:</span></label>
                                        <div className="md:col-span-3">
                                            <input
                                                type="password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                placeholder="Password baru"
                                                className="w-full rounded-xl border border-gray-200 bg-white px-6 py-3 shadow-inner focus:border-[#4aa731] focus:outline-none"
                                            />
                                        </div>
                                    </div>

                                    {/* Confirm New Password */}
                                    <div className="grid grid-cols-1 items-center gap-4 md:grid-cols-4">
                                        <label className="font-bold text-black md:col-span-1">Konfirmasi Baru <span className="float-right hidden md:inline">:</span></label>
                                        <div className="md:col-span-3">
                                            <input
                                                type="password"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                placeholder="Ulangi password baru"
                                                className="w-full rounded-xl border border-gray-200 bg-white px-6 py-3 shadow-inner focus:border-[#4aa731] focus:outline-none"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <div className="mt-8">
                                    {statusMessage.text && (
                                        <div className={`mb-4 rounded-lg p-3 text-sm font-semibold ${statusMessage.type === 'error' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                                            {statusMessage.text}
                                        </div>
                                    )}
                                    <button
                                        onClick={handleSave}
                                        className="w-full rounded-full bg-[#4aa731] py-3 text-lg font-bold text-white shadow-lg transition hover:bg-[#3d8c29]"
                                    >
                                        Simpan
                                    </button>
                                </div>

                            </div>

                            {/* Profile Picture Section */}
                            <div className="flex flex-col items-center justify-start py-4">
                                <div className="relative mb-6 h-48 w-48 overflow-hidden rounded-full border-4 border-white bg-pink-100 shadow-lg">
                                    <img
                                        src="https://img.freepik.com/premium-vector/avatar-profile-icon-flat-style-female-user-profile-vector-illustration-isolated-background-women-profile-sign-business-concept_157943-38866.jpg?w=740"
                                        alt="Profile"
                                        className="h-full w-full object-cover"
                                    />
                                </div>
                                <button className="rounded-full bg-white px-8 py-2 font-bold text-black shadow-md ring-1 ring-gray-200 hover:bg-gray-50">
                                    Pilih Gambar
                                </button>
                                <button
                                    onClick={onLogout}
                                    className="mt-6 rounded-full bg-red-500 px-10 py-2 font-bold text-white shadow-md transition hover:bg-red-600"
                                >
                                    Keluar
                                </button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'reservation_history' && (
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[800px] border-collapse text-center">
                                <thead>
                                    <tr className="text-lg font-bold text-black">
                                        <th className="p-4">Kode</th>
                                        <th className="p-4">Tanggal</th>
                                        <th className="p-4">Jam</th>
                                        <th className="p-4">Jenis Treatment</th>
                                        <th className="p-4">Status</th>
                                        <th className="p-4">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="text-base font-medium text-black">
                                    {isLoadingReservations ? (
                                        <tr><td colSpan="6" className="p-8 text-center text-gray-500">Memuat reservasi...</td></tr>
                                    ) : reservations.length > 0 ? (
                                        reservations.map((item, index) => (
                                            <tr key={index} className="hover:bg-gray-50">
                                                <td className="p-4">R-{item.idReservasi}</td>
                                                <td className="p-4">{formatDate(item.tanggalReservasi)}</td>
                                                <td className="p-4">{item.schedule?.waktuMulai ? `${item.schedule.waktuMulai.slice(0,5)} - ${item.schedule.waktuSelesai.slice(0,5)}` : '-'}</td>
                                                <td className="p-4">{item.treatment?.namaTreatment || '-'}</td>
                                                <td className="p-4">
                                                    <div className="flex justify-center">
                                                        <span className={`rounded-full px-6 py-2 text-white shadow-md ${getStatusColor(item.status)} max-w-[200px] leading-tight capitalize`}>
                                                            {item.status}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex justify-center">
                                                        {item.status === 'pending' || item.status === 'confirmed' ? ( // Example logic
                                                            <button 
                                                                onClick={() => handleEditClick(item)}
                                                                className="rounded-full bg-[#c93a3a] px-6 py-2 text-white shadow-md transition hover:bg-[#a83030]"
                                                            >
                                                                Ubah Jadwal
                                                            </button>
                                                        ) : (
                                                            <button disabled className="cursor-not-allowed rounded-full bg-[#cfcfcf] px-6 py-2 text-white shadow-md">
                                                                Ubah Jadwal
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr><td colSpan="6" className="p-8 text-center text-gray-500">Belum ada reservasi.</td></tr>
                                    )}
                                </tbody>
                            </table>

                            <div className="mt-8 flex justify-start">
                                <button
                                    onClick={() => navigate('/profile')}
                                    className="flex items-center gap-2 font-bold text-[#4aa731] hover:underline"
                                >
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                    </svg>
                                    Kembali ke Profil
                                </button>
                            </div>
                        </div>
                    )}
                    
                    {/* Reschedule Modal */}
                    {isRescheduleModalOpen && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
                            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
                                <h3 className="mb-4 text-xl font-bold text-gray-800">Ubah Jadwal Reservasi</h3>
                                
                                <div className="mb-4 space-y-4">
                                    <div>
                                        <label className="mb-1 block text-sm font-semibold text-gray-700">Tanggal Baru</label>
                                        <DatePicker
                                            selected={newDate}
                                            onChange={(date) => setNewDate(date)}
                                            dateFormat="dd/MM/yyyy"
                                            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2 text-gray-700 shadow-inner focus:border-[#4aa731]"
                                        />
                                    </div>
                                    
                                    <div>
                                        <label className="mb-1 block text-sm font-semibold text-gray-700">Waktu (Slot)</label>
                                        <select
                                            value={selectedSlotId}
                                            onChange={(e) => setSelectedSlotId(e.target.value)}
                                            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2 text-gray-700 shadow-inner focus:border-[#4aa731]"
                                        >
                                            <option value="">Pilih Slot Waktu</option>
                                            {availableSlots.map(slot => (
                                                <option key={slot.idJadwal} value={slot.idJadwal}>
                                                    {slot.waktuMulai ? slot.waktuMulai.slice(0, 5) : slot.start_time} - {slot.waktuSelesai ? slot.waktuSelesai.slice(0, 5) : slot.end_time}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="flex justify-end gap-3">
                                    <button
                                        onClick={() => setIsRescheduleModalOpen(false)}
                                        className="rounded-full bg-gray-200 px-6 py-2 font-bold text-gray-700 hover:bg-gray-300"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        onClick={handleSaveReschedule}
                                        className="rounded-full bg-[#4aa731] px-6 py-2 font-bold text-white shadow-md hover:bg-[#3d8c29]"
                                    >
                                        Simpan
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'product_history' && (
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[800px] border-collapse text-center">
                                <thead>
                                    <tr className="text-lg font-bold text-black">
                                        <th className="p-4">Kode Pemesanan</th>
                                        <th className="p-4">Tanggal Pemesanan</th>
                                        <th className="p-4">Total Pemesanan</th>
                                        <th className="p-4">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="text-base font-medium text-black">
                                    {loadingProductHistory ? (
                                        <tr>
                                            <td colSpan="4" className="p-8 text-center text-gray-500">Memuat riwayat pemesanan...</td>
                                        </tr>
                                    ) : productHistory.length > 0 ? (
                                        productHistory.map((item, index) => (
                                            <tr key={index} className="hover:bg-gray-50">
                                                <td className="p-4">{item.idPenjualan || item.id}</td>
                                                <td className="p-4">{formatDate(item.tanggal)}</td>
                                                <td className="p-4">{formatCurrency(item.totalHarga)}</td>
                                                <td className="p-4">
                                                    <div className="flex justify-center">
                                                        <span className={`rounded-full px-6 py-2 text-white shadow-md ${getStatusColor(item.status)} min-w-[150px] leading-tight capitalize`}>
                                                            {item.status}
                                                        </span>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4" className="p-8 text-center text-gray-500">Belum ada riwayat pemesanan produk.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>

                            <div className="mt-8 flex justify-start">
                                <button
                                    onClick={() => navigate('/profile')}
                                    className="flex items-center gap-2 font-bold text-[#4aa731] hover:underline"
                                >
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                    </svg>
                                    Kembali ke Profil
                                </button>
                            </div>
                        </div>
                    )}
                </div>

            </main>

            <Footer />
        </div>
    )
}

export default ProfilePage