import { useState } from 'react'
import InputField from '../components/atoms/InputField'
import Button from '../components/atoms/Button'
import LogoIcon from '../components/atoms/LogoIcon'
import { apiFetch } from '../lib/api'

const FIELD_CONFIG = [
  { name: 'nama', label: 'Nama', placeholder: 'Nama Lengkap' },
  { name: 'email', label: 'Email', placeholder: 'Email', type: 'email' },
  { name: 'nomorWa', label: 'Nomor WhatsApp', placeholder: '08xxxxxxxxxx' },
  { name: 'alamat', label: 'Alamat', placeholder: 'Alamat domisili' },
  { name: 'jenisKelamin', label: 'Jenis Kelamin', placeholder: 'Pria/Wanita' },
  { name: 'tanggalLahir', label: 'Tanggal Lahir', type: 'date' },
  // { name: 'role', label: 'Role', placeholder: 'user' },
  {
    name: 'password',
    label: 'Password',
    placeholder: 'Masukkan password',
    type: 'password',
    allowToggle: true
  },
  // {
  //   name: 'confirmPassword',
  //   label: 'Konfirmasi Password',
  //   placeholder: 'Ulangi password',
  //   type: 'password',
  //   allowToggle: true
  // }
]

const INITIAL_FORM = {
  ...FIELD_CONFIG.reduce(
    (acc, field) => ({ ...acc, [field.name]: '' }),
    {}
  ),
  role: 'pelanggan'
}

const RegistrationForm = () => {
  const [formValues, setFormValues] = useState(INITIAL_FORM)
  const [statusMessage, setStatusMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormValues((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    // if (formValues.password !== formValues.confirmPassword) {
    //   setStatusMessage('Password dan konfirmasi password harus sama.')
    //   return
    // }

    try {
      setIsSubmitting(true)
      setStatusMessage('')

      await apiFetch('/api/register', {
        method: 'POST',
        body: JSON.stringify({
          nama: formValues.nama,
          alamat: formValues.alamat,
          jenisKelamin: formValues.jenisKelamin,
          tanggalLahir: formValues.tanggalLahir,
          role: formValues.role,
          email: formValues.email,
          nomorWa: formValues.nomorWa,
          password: formValues.password,
          // password_confirmation: formValues.confirmPassword
        })
      })

      setStatusMessage('Registrasi berhasil. Silakan login.')
      setFormValues(INITIAL_FORM)
    } catch (error) {
      const message =
        error?.data?.message || 'Registrasi gagal. Periksa data Anda.'
      setStatusMessage(message)
    } finally {
      setIsSubmitting(false)
    }
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
          <Button type="submit" className="w-full md:w-fit" disabled={isSubmitting}>
            {isSubmitting ? 'Memproses...' : 'Registrasi'}
          </Button>
        </div>
      </form>
    </section>
  )
}

export default RegistrationForm
