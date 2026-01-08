import { useState, useEffect, useRef } from 'react'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'
import DatePicker, { registerLocale } from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import Navbar from '../fragments/Navbar'
import Footer from '../fragments/Footer'
import AlertModal from '../fragments/AlertModal'
import { apiFetch } from '../lib/api'

registerLocale('id', id)

const CustomSelect = ({ label, value, options, onChange }) => {
    const [isOpen, setIsOpen] = useState(false)
    const containerRef = useRef(null)

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    return (
        <div className="relative w-full" ref={containerRef}>
            <div
                onClick={() => setIsOpen(!isOpen)}
                className="flex w-full cursor-pointer items-center justify-between rounded-full bg-white px-4 py-2 shadow-sm transition hover:bg-gray-50"
            >
                <span className="text-sm font-medium text-gray-600">{label} :</span>
                <div className="flex items-center gap-2">
                    <span className="text-right text-sm font-bold text-black">{options.find(o => o.value === value)?.label || value}</span>
                    <svg
                        className={`h-4 w-4 text-[#4aa731] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                    >
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                </div>
            </div>

            {isOpen && (
                <div className="absolute left-0 top-full z-50 mt-2 max-h-60 w-full overflow-auto rounded-2xl bg-white py-2 shadow-xl ring-1 ring-black ring-opacity-5">
                    {options.map((option) => (
                        <div
                            key={option.value}
                            onClick={() => {
                                onChange(option.value)
                                setIsOpen(false)
                            }}
                            className={`cursor-pointer px-4 py-2 text-sm font-medium transition-colors hover:bg-green-50 hover:text-[#4aa731] ${value === option.value ? 'bg-green-50 text-[#4aa731]' : 'text-gray-700'
                                }`}
                        >
                            {option.label}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

const ConfirmationModal = ({ isOpen, onClose, onConfirm }) => {
    if (!isOpen) return null
    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-md rounded-[40px] bg-white p-8 text-center shadow-2xl">
                <div className="mb-6 flex justify-center">
                    <div className="flex h-24 w-24 items-center justify-center rounded-full border-[6px] border-gray-400 text-gray-400">
                        <span className="text-6xl font-bold">!</span>
                    </div>
                </div>
                <h3 className="mb-8 text-xl font-medium text-gray-600">
                    Apakah Anda yakin ingin Reservasi Sekarang ?
                </h3>
                <div className="flex justify-center gap-4">
                    <button onClick={onConfirm} className="min-w-[120px] rounded-xl bg-[#53c41a] px-6 py-3 font-bold text-white transition hover:bg-[#4aa731]">
                        Ya
                    </button>
                    <button onClick={onClose} className="min-w-[160px] rounded-xl border border-gray-300 bg-white px-6 py-3 font-bold text-black transition hover:bg-gray-50">
                        Tidak, Batalkan
                    </button>
                </div>
            </div>
        </div>
    )
}

const SuccessModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null
    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-md rounded-[40px] bg-white p-8 text-center shadow-2xl">
                <div className="mb-6 flex justify-center">
                    <div className="flex h-24 w-24 items-center justify-center rounded-full bg-green-100 text-[#53c41a]">
                        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"></path></svg>
                    </div>
                </div>
                <h3 className="mb-4 text-2xl font-bold text-gray-800">
                    Reservasi Berhasil!
                </h3>
                <p className="mb-8 text-gray-600">
                    Terima kasih telah melakukan reservasi. Kami menantikan kehadiran Anda.
                </p>
                <div className="flex justify-center">
                    <button onClick={onClose} className="min-w-[120px] rounded-xl bg-[#53c41a] px-6 py-3 font-bold text-white transition hover:bg-[#4aa731]">
                        OK
                    </button>
                </div>
            </div>
        </div>
    )
}

const ReservationPage = ({ isLoggedIn }) => {
    const [bookingStep, setBookingStep] = useState('schedule') // 'schedule' | 'detail'
    const [selectedSlot, setSelectedSlot] = useState(null)
    const [showModal, setShowModal] = useState(false)
    const [showSuccessModal, setShowSuccessModal] = useState(false)
    const [alertConfig, setAlertConfig] = useState({
        isOpen: false,
        title: '',
        message: '',
        variant: 'info'
    })

    // Data from API
    const [doctors, setDoctors] = useState([])
    const [schedules, setSchedules] = useState([])
    const [userProfile, setUserProfile] = useState({ nama: '', nomorWa: '' })

    // Form Selection
    const [selectedTreatment, setSelectedTreatment] = useState('Acne Treatment')
    const [selectedDoctorId, setSelectedDoctorId] = useState('') // ID
    const [selectedDate, setSelectedDate] = useState(new Date())

    // Form Input (for detail step)
    const [customerName, setCustomerName] = useState('')
    const [customerWa, setCustomerWa] = useState('')

    const currentDayName = format(selectedDate, 'EEEE', { locale: id })
    const formattedDate = format(selectedDate, 'd MMMM yyyy', { locale: id })

    // Fetch Data
    useEffect(() => {
        const initData = async () => {
            // Fetch Doctors
            try {
                const docRes = await apiFetch('/api/profil-dokter')
                const docData = docRes.data || docRes
                if (Array.isArray(docData)) {
                    setDoctors(docData.map(d => ({ value: d.idDokter, label: d.nama })))
                    if (docData.length > 0) setSelectedDoctorId(docData[0].idDokter)
                }
            } catch (e) {
                console.error("Err fetch doctors", e)
            }

            // Fetch Schedules
            try {
                const schedRes = await apiFetch('/api/jadwal-reservasi')
                const schedData = schedRes.data || schedRes
                if (Array.isArray(schedData)) {
                    // Sort by time using jamMulai
                    const sorted = schedData.sort((a, b) => (a.jamMulai || '').localeCompare(b.jamMulai || ''))
                    setSchedules(sorted)
                }
            } catch (e) {
                console.error("Err fetch schedules", e)
            }

            // Fetch User Profile
            if (isLoggedIn) {
                try {
                    const me = await apiFetch('/api/me')
                    setUserProfile(me)
                    setCustomerName(me.nama || me.name || '')
                    setCustomerWa(me.nomorWa || me.nomor_wa || '')
                } catch (e) {
                    console.error("Err fetch me", e)
                }
            }
        }
        initData()
    }, [isLoggedIn])

    const treatments = [
        { value: 'Acne Treatment', label: 'Acne Treatment' },
        { value: 'Whitening Treatment', label: 'Whitening Treatment' },
        { value: 'Anti Aging', label: 'Anti Aging' }
    ]

    const isDoctorAvailable = doctors.length > 0 && selectedDoctorId

    const handleSlotClick = (slot) => {
        // Assuming all fetched slots are 'available' for booking proposal since we lack availability check endpoint
        // You might want to filter this based on real availability if backend supports it later
        setSelectedSlot(slot)
        setBookingStep('detail')
        window.scrollTo(0, 0)
    }

    const handleConfirmReservation = async () => {
        if (!customerName || !customerWa) {
            setAlertConfig({
                isOpen: true,
                title: 'Data belum lengkap',
                message: 'Mohon lengkapi Nama dan Nomor WhatsApp.',
                variant: 'warning'
            })
            return
        }

        try {
            const payload = {
                namaCustomer: customerName,
                nomorWa: customerWa,
                jenisTreatment: selectedTreatment, // string
                tanggalReservasi: format(selectedDate, 'yyyy-MM-dd'),
                idDokter: selectedDoctorId,
                idJadwal: selectedSlot.idJadwal
            }

            console.log("Sending Reservation:", payload)

            const response = await apiFetch('/api/reservasi', {
                method: 'POST',
                body: JSON.stringify(payload)
            })

            console.log("Success:", response)
            setShowModal(false)
            // alert('Reservasi Berhasil Dibuat!')
            setShowSuccessModal(true)

            // Reset
            setBookingStep('schedule')
            setSelectedSlot(null)

        } catch (error) {
            console.error("Reservation failed", error)
            setAlertConfig({
                isOpen: true,
                title: 'Reservasi gagal',
                message: `Gagal membuat reservasi: ${error.message || 'Error'}`,
                variant: 'error'
            })
            setShowModal(false)
        }
    }

    return (
        <div className="min-h-screen bg-[#f9f9f9] font-sans">
            <Navbar isLoggedIn={isLoggedIn} />

            <main className="mx-auto max-w-6xl px-4 py-12">
                {bookingStep === 'schedule' ? (
                    <>
                        {/* Banner Schedule */}
                        <div className="relative mb-8 overflow-hidden rounded-3xl bg-gradient-to-r from-[#4aa731] to-[#65ce4d] p-8 text-white shadow-lg md:p-12">
                            <div className="relative z-10 max-w-2xl">
                                <h1 className="text-3xl font-bold leading-tight md:text-4xl">
                                    Jadwal Reservasi Treatment <br /> Di Klinik Kecantikan Mische
                                </h1>
                            </div>
                            <div className="absolute right-0 top-0 h-full w-1/3 opacity-20">
                                <svg viewBox="0 0 200 200" className="h-full w-full" fill="currentColor">
                                    <path d="M100 0C44.8 0 0 44.8 0 100s44.8 100 100 100 100-44.8 100-100S155.2 0 100 0zm0 180c-44.1 0-80-35.9-80-80s35.9-80 80-80 80 35.9 80 80-35.9 80-80 80z" />
                                </svg>
                            </div>
                        </div>

                        {/* Filters */}
                        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                            <CustomSelect
                                label="Jenis Treatment"
                                value={selectedTreatment}
                                options={treatments}
                                onChange={setSelectedTreatment}
                            />
                            <CustomSelect
                                label="Dokter Yang Menghandle"
                                value={selectedDoctorId}
                                options={doctors}
                                onChange={setSelectedDoctorId}
                            />
                        </div>

                        {/* Date Filter */}
                        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-4">
                            <div className="relative flex w-full items-center justify-between rounded-full bg-white px-4 py-2 shadow-sm">
                                <span className="text-sm font-medium text-gray-600">Tanggal :</span>
                                <div className="flex items-center gap-2">
                                    <DatePicker
                                        selected={selectedDate}
                                        onChange={(date) => setSelectedDate(date)}
                                        dateFormat="d MMMM yyyy"
                                        locale="id"
                                        minDate={new Date()}
                                        className="cursor-pointer bg-transparent text-right text-sm font-bold text-black focus:outline-none w-32"
                                        autoComplete="off"
                                    />
                                    <svg className="h-4 w-4 text-[#4aa731]" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            </div>

                            <div className="flex w-full items-center justify-center rounded-full bg-white px-4 py-2 font-bold shadow-sm">
                                <span className="mr-2 text-sm font-medium text-gray-600">Hari :</span> <span className="text-sm">{currentDayName}</span>
                            </div>
                            <div className="flex w-full items-center justify-center rounded-full bg-white px-4 py-2 font-bold shadow-sm">
                                <span className="mr-2 text-sm font-medium text-gray-600">Total Slot :</span> <span className="text-sm">{schedules.length}</span>
                            </div>
                        </div>

                        {/* Schedule Grid */}
                        <div className="min-h-[400px] rounded-[40px] bg-white p-8 shadow-xl">
                            {isDoctorAvailable && schedules.length > 0 ? (
                                <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4">
                                    {schedules.map((slot, index) => (
                                        <div
                                            key={index}
                                            onClick={() => handleSlotClick(slot)}
                                            className={`flex flex-col items-center justify-center rounded-xl p-4 text-center transition bg-[#4aa731] text-white shadow-md hover:scale-105 cursor-pointer`}
                                        >
                                            <span className="text-xl font-bold">{slot.jamMulai ? slot.jamMulai.slice(0, 5) : slot.start} WIB</span>
                                            <div className="mt-2 rounded-full px-4 py-1 text-xs font-bold bg-white text-[#4aa731]">
                                                Tersedia
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex h-full flex-col items-center justify-center py-20">
                                    <h2 className="text-2xl font-bold text-black">Jadwal atau Dokter Tidak Tersedia</h2>
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <>
                        {/* Detail Step */}
                        <div className="relative mb-8 overflow-hidden rounded-3xl bg-gradient-to-r from-[#4aa731] to-[#65ce4d] p-8 text-white shadow-lg md:p-12">
                            <h1 className="text-3xl font-bold leading-tight md:text-4xl">Konfirmasi Data Reservasi</h1>
                            <button onClick={() => setBookingStep('schedule')} className="mt-4 rounded-full bg-white/20 px-6 py-2 hover:bg-white/30">
                                Kembali ke Jadwal
                            </button>
                        </div>

                        <div className="rounded-[40px] bg-white p-8 shadow-xl md:p-12">
                            <div className="grid gap-x-8 gap-y-8 md:grid-cols-2">
                                {/* Read Only Info */}
                                <div className="md:col-span-2 grid md:grid-cols-2 gap-8 border-b pb-8">
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Waktu</label>
                                        <div className="text-xl font-bold text-black">
                                            {selectedSlot?.jamMulai?.slice(0, 5)} - {selectedSlot?.jamSelesai?.slice(0, 5)} WIB
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Tanggal</label>
                                        <div className="text-xl font-bold text-black">{formattedDate}</div>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Dokter</label>
                                        <div className="text-xl font-bold text-black">
                                            {doctors.find(d => d.value === selectedDoctorId)?.label}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Treatment</label>
                                        <div className="text-xl font-bold text-black">{selectedTreatment}</div>
                                    </div>
                                </div>

                                {/* Inputs for Required API Fields */}
                                <div className="md:col-span-2 space-y-4">
                                    <h3 className="font-bold text-lg">Data Diri (Dapat disesuaikan)</h3>
                                    <div>
                                        <label className="mb-2 block font-medium">Nama Lengkap</label>
                                        <input
                                            type="text"
                                            value={customerName}
                                            onChange={e => setCustomerName(e.target.value)}
                                            className="w-full rounded-xl border p-3 focus:outline-[#4aa731]"
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-2 block font-medium">Nomor WhatsApp</label>
                                        <input
                                            type="text"
                                            value={customerWa}
                                            onChange={e => setCustomerWa(e.target.value)}
                                            className="w-full rounded-xl border p-3 focus:outline-[#4aa731]"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="mt-12 flex justify-center">
                                <button
                                    onClick={() => setShowModal(true)}
                                    className="w-full max-w-md rounded-full bg-[#53c41a] py-4 text-lg font-bold text-white shadow-lg transition hover:bg-[#4aa731]"
                                >
                                    Buat Reservasi
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </main>

            <ConfirmationModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                onConfirm={handleConfirmReservation}
            />

            <SuccessModal
                isOpen={showSuccessModal}
                onClose={() => setShowSuccessModal(false)}
            />

            <AlertModal
                isOpen={alertConfig.isOpen}
                title={alertConfig.title}
                message={alertConfig.message}
                variant={alertConfig.variant}
                onClose={() => setAlertConfig((prev) => ({ ...prev, isOpen: false }))}
            />

            <Footer />
        </div>
    )
}

export default ReservationPage
