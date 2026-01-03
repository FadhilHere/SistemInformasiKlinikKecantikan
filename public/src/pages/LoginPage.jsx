import { useState } from 'react'
import InputField from '../components/atoms/InputField'
import Button from '../components/atoms/Button'
import LogoIcon from '../components/atoms/LogoIcon'
import Navbar from '../fragments/Navbar'
import { apiFetch } from '../lib/api'

const INITIAL_FORM = {
  email: '',
  password: ''
}

const LoginPage = ({ onLoginSuccess }) => {
  const [formValues, setFormValues] = useState(INITIAL_FORM)
  const [statusMessage, setStatusMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormValues((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!formValues.email || !formValues.password) {
      setStatusMessage('Email dan password wajib diisi.')
      return
    }

    try {
      setIsSubmitting(true)
      setStatusMessage('')

      const data = await apiFetch('/api/login', {
        method: 'POST',
        body: JSON.stringify({
          email: formValues.email,
          password: formValues.password
        })
      })

      if (data?.token) {
        localStorage.setItem('token', data.token)
      }
      if (data?.user?.id) {
        localStorage.setItem('userId', String(data.user.id))
      }

      setStatusMessage('Login berhasil.')
      if (onLoginSuccess) onLoginSuccess()
    } catch (error) {
      const message =
        error?.data?.message || 'Email atau password salah.'
      setStatusMessage(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="flex justify-center px-4 py-14">
        <section className="flex w-full max-w-xl flex-col gap-6 rounded-[24px] bg-white px-8 py-12 shadow-card">
      <div className="flex flex-col items-center text-center">
        <LogoIcon size={72} className="mb-3" />
        <div className="text-[32px] font-semibold">mische</div>
        <p className="text-xs font-semibold tracking-[0.4em] text-brand/60">
          AESTHETIC CLINIC
        </p>
      </div>

      <div>
        <h1 className="text-3xl font-semibold text-brand">Login</h1>
        <p className="text-brand/70">
          Masukkan email dan password yang terdaftar
        </p>
      </div>

      <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
        <InputField
          label="Email"
          type="email"
          placeholder="Email"
          name="email"
          value={formValues.email}
          onChange={handleChange}
        />
        <InputField
          label="Password"
          type="password"
          placeholder="Password"
          name="password"
          value={formValues.password}
          onChange={handleChange}
          allowToggle
        />

        {statusMessage && (
          <span className="text-sm text-amber-600">{statusMessage}</span>
        )}

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Memproses...' : 'Login'}
        </Button>
      </form>
        </section>
      </main>
    </div>
  )
}

export default LoginPage
