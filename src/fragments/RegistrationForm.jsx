import { useState } from 'react'
import InputField from '../components/atoms/InputField'
import Button from '../components/atoms/Button'
import LogoIcon from '../components/atoms/LogoIcon'
import {
  isValidEmail,
  isValidPassword,
  isValidPhone,
  isNotEmpty,
  sanitizeInput
} from '../utils/validators'

const FIELD_CONFIG = [
  { name: 'name', label: 'Nama', placeholder: 'Nama Lengkap' },
  { name: 'email', label: 'Email', placeholder: 'Email', type: 'email' },
  { name: 'whatsapp', label: 'Nomor WhatsApp', placeholder: '08xxxxxxxxxx' },
  { name: 'address', label: 'Alamat', placeholder: 'Alamat domisili' },
  {
    name: 'password',
    label: 'Password',
    placeholder: 'Masukkan password',
    type: 'password',
    allowToggle: true
  },
  {
    name: 'confirmPassword',
    label: 'Konfirmasi Password',
    placeholder: 'Ulangi password',
    type: 'password',
    allowToggle: true
  }
]

const INITIAL_FORM = FIELD_CONFIG.reduce(
  (acc, field) => ({ ...acc, [field.name]: '' }),
  {}
)

const RegistrationForm = () => {
  const [formValues, setFormValues] = useState(INITIAL_FORM)
  const [statusMessage, setStatusMessage] = useState('')

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormValues((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    // Clear previous status
    setStatusMessage('')

    // Basic Empty Checks
    for (const field of FIELD_CONFIG) {
      if (!isNotEmpty(formValues[field.name])) {
        setStatusMessage(`${field.label} wajib diisi.`)
        return
      }
    }

    // Specific Format Checks
    if (!isValidEmail(formValues.email)) {
      setStatusMessage('Format email tidak valid.')
      return
    }

    if (!isValidPhone(formValues.whatsapp)) {
      setStatusMessage('Nomor WhatsApp tidak valid (min 10 digit).')
      return
    }

    // Password Strength
    if (!isValidPassword(formValues.password)) {
      setStatusMessage('Password harus memiliki minimal 8 karakter, 1 huruf besar, 1 huruf kecil, dan 1 angka.')
      return
    }

    if (formValues.password !== formValues.confirmPassword) {
      setStatusMessage('Password dan konfirmasi password harus sama.')
      return
    }

    // Sanitize data before sending (mocking sending)
    const cleanData = {
      ...formValues,
      name: sanitizeInput(formValues.name),
      address: sanitizeInput(formValues.address)
    }

    console.log("Clean Data Submitted:", cleanData)

    setStatusMessage('Registrasi berhasil! (Data aman dan tervalidasi)')
  }

  return (
    <section className="flex w-full max-w-4xl flex-col gap-6 rounded-[24px] bg-white px-8 py-12 shadow-card lg:px-14">
      <div className="flex flex-col items-center text-center">
        <LogoIcon size={84} className="mb-3" />
        <div className="text-[34px] font-semibold">mische</div>
        <p className="text-xs font-semibold tracking-[0.4em] text-brand/60">
          AESTHETIC CLINIC
        </p>
      </div>

      <div className="text-center lg:text-left">
        <h1 className="text-3xl font-semibold text-brand">Registrasi</h1>
        <p className="text-brand/70">
          Daftar akun dengan data diri anda yang benar
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 gap-5 md:grid-cols-2"
      >
        {FIELD_CONFIG.map((field) => (
          <InputField
            key={field.name}
            label={field.label}
            placeholder={field.placeholder}
            type={field.type}
            name={field.name}
            value={formValues[field.name]}
            onChange={handleChange}
            allowToggle={field.allowToggle}
          />
        ))}

        {statusMessage && (
          <span className="col-span-full text-sm text-amber-600">
            {statusMessage}
          </span>
        )}

        <div className="col-span-full">
          <Button type="submit" className="w-full md:w-fit">
            Registrasi
          </Button>
        </div>
      </form>
    </section>
  )
}

export default RegistrationForm
