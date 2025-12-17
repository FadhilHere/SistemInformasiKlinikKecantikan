import { useState, useEffect, useRef } from 'react'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'
import DatePicker, { registerLocale } from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import Navbar from '../fragments/Navbar'
import Footer from '../fragments/Footer'

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
              className={`cursor-pointer px-4 py-2 text-sm font-medium transition-colors hover:bg-green-50 hover:text-[#4aa731] ${
                value === option.value ? 'bg-green-50 text-[#4aa731]' : 'text-gray-700'
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

const ReservationPage = ({ onNavigate, onShowLogin, onShowRegister, onShowLanding }) => {
  const [selectedTreatment, setSelectedTreatment] = useState('Acne Treatment')
  const [selectedDoctor, setSelectedDoctor] = useState('dr. Widya')
  const [selectedDate, setSelectedDate] = useState(new Date())

  const currentDayName = format(selectedDate, 'EEEE', { locale: id })

  const treatments = [
    { value: 'Acne Treatment', label: 'Acne Treatment' },
    { value: 'Whitening Treatment', label: 'Whitening Treatment' },
    { value: 'Anti Aging', label: 'Anti Aging' }
  ]
  
  const doctors = [
    { value: 'dr. Widya', label: 'dr. Widya' },
    { value: 'dr. Budi', label: 'dr. Budi' },
    { value: '-', label: '-' }
  ]

  const schedules = [
    { time: '07:00', status: 'available' },
    { time: '08:00', status: 'booked' },
    { time: '09:00', status: 'available' },
    { time: '10:00', status: 'booked' },
    { time: '11:00', status: 'booked' },
    { time: '12:00', status: 'booked' },
    { time: '13:00', status: 'available' },
    { time: '14:00', status: 'available' },
    { time: '15:00', status: 'booked' },
    { time: '16:00', status: 'available' },
    { time: '17:00', status: 'available' },
    { time: '18:00', status: 'available' },
  ]

  const availableCount = schedules.filter(s => s.status === 'available').length
  const bookedCount = schedules.filter(s => s.status === 'booked').length

  const isDoctorAvailable = selectedDoctor !== '-'

  return (
    <div className="min-h-screen bg-[#f9f9f9] font-sans">
      <Navbar
        onShowLogin={onShowLogin}
        onShowRegister={onShowRegister}
        onShowLanding={onShowLanding}
        activeRoute="reservation"
        onNavigate={onNavigate}
      />

      <main className="mx-auto max-w-6xl px-4 py-12">
        {/* Banner */}
        <div className="relative mb-8 overflow-hidden rounded-3xl bg-gradient-to-r from-[#4aa731] to-[#65ce4d] p-8 text-white shadow-lg md:p-12">
          <div className="relative z-10 max-w-2xl">
            <h1 className="text-3xl font-bold leading-tight md:text-4xl">
              Jadwal Reservasi Treatment <br /> Di Klinik Kecantikan Mische
            </h1>
          </div>
          {/* Decorative Silhouette */}
          <div className="absolute right-0 top-0 h-full w-1/3 opacity-20">
             <svg viewBox="0 0 200 200" className="h-full w-full" fill="currentColor">
                <path d="M100 0C44.8 0 0 44.8 0 100s44.8 100 100 100 100-44.8 100-100S155.2 0 100 0zm0 180c-44.1 0-80-35.9-80-80s35.9-80 80-80 80 35.9 80 80-35.9 80-80 80z"/>
             </svg>
          </div>
        </div>

        {/* Filters Row 1: Treatment & Doctor */}
        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          <CustomSelect 
            label="Jenis Treatment" 
            value={selectedTreatment} 
            options={treatments} 
            onChange={setSelectedTreatment} 
          />
          <CustomSelect 
            label="Dokter Yang Menghandle" 
            value={selectedDoctor} 
            options={doctors} 
            onChange={setSelectedDoctor} 
          />
        </div>

        {/* Filters Row 2: Date & Stats */}
        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-4">
           {/* Date */}
           <div className="relative flex w-full items-center justify-between rounded-full bg-white px-4 py-2 shadow-sm">
            <span className="text-sm font-medium text-gray-600">Tanggal :</span>
            <div className="flex items-center gap-2">
                <DatePicker
                    selected={selectedDate}
                    onChange={(date) => setSelectedDate(date)}
                    dateFormat="d MMMM yyyy"
                    locale="id"
                    className="cursor-pointer bg-transparent text-right text-sm font-bold text-black focus:outline-none w-32"
                    onKeyDown={(e) => e.preventDefault()}
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
            <span className="mr-2 text-sm font-medium text-gray-600">Jadwal Kosong :</span> <span className="text-sm">{isDoctorAvailable ? availableCount : 0}</span>
          </div>
          <div className="flex w-full items-center justify-center rounded-full bg-white px-4 py-2 font-bold shadow-sm">
            <span className="mr-2 text-sm font-medium text-gray-600">Jadwal Terisi :</span> <span className="text-sm">{isDoctorAvailable ? bookedCount : 0}</span>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="min-h-[400px] rounded-[40px] bg-white p-8 shadow-xl">
            {isDoctorAvailable ? (
                <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4">
                    {schedules.map((slot, index) => (
                        <div 
                            key={index}
                            className={`flex flex-col items-center justify-center rounded-xl p-4 text-center transition ${
                                slot.status === 'available' 
                                ? 'bg-[#4aa731] text-white shadow-md hover:scale-105 cursor-pointer' 
                                : 'bg-white text-gray-400 border border-gray-200'
                            }`}
                        >
                            <span className="text-xl font-bold">{slot.time} WIB</span>
                            <div className={`mt-2 rounded-full px-4 py-1 text-xs font-bold ${
                                slot.status === 'available' ? 'bg-white text-[#4aa731]' : 'bg-gray-300 text-white'
                            }`}>
                                {slot.status === 'available' ? 'Kosong' : 'Sudah Terisi'}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex h-full flex-col items-center justify-center py-20">
                    <div className="mb-6 rounded-full border-4 border-[#4aa731] p-4">
                        <span className="text-6xl font-bold text-[#4aa731]">!</span>
                    </div>
                    <h2 className="text-2xl font-bold text-black">Maaf Dokter Tidak Tersedia Hari Ini</h2>
                </div>
            )}
        </div>

      </main>

      <Footer />
    </div>
  )
}

export default ReservationPage
