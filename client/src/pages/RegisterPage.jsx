import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout'
import { useAuth } from '../context/AuthContext'

function RegisterPage() {
  const navigate = useNavigate()
  const { register } = useAuth()

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  })

  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target

    setFormData((current) => ({
      ...current,
      [name]: value
    }))

    /*
     * Clear the previous error when the user
     * starts correcting the form.
     */
    if (error) {
      setError('')
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    setError('')

    if (formData.password.length < 6) {
      setError('Password must contain at least 6 characters.')
      return
    }

    setSubmitting(true)

    try {
      await register(formData)
      navigate('/login')
    } catch (error) {
      setError(
        error.message ||
        'Unable to create your account. Please try again.'
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthLayout
      title="Begin your story."
      description="Create your private space for the moments, places, and memories that make you who you are."
      footerText="Already have an account?"
      footerLinkText="Sign in"
      footerLink="/login"
    >

      <form
        onSubmit={handleSubmit}
        className="space-y-3.5"
      >

        {/* =========================
            ERROR
        ========================== */}

        {error && (
          <div
            role="alert"
            className="rounded-2xl border border-red-400/15 bg-red-400/4 px-4 py-3 text-xs leading-5 text-red-300"
          >
            {error}
          </div>
        )}


        {/* =========================
            NAME
        ========================== */}

        <div>

          <label
            htmlFor="name"
            className="mb-1.5 block text-[10px] font-medium uppercase tracking-[0.2em] text-white/40 sm:text-[11px]"
          >
            Name
          </label>

          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your name"
            autoComplete="name"
            required
            disabled={submitting}
            className="w-full rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-3 text-sm text-white outline-none transition duration-300 placeholder:text-white/20 hover:border-white/15 focus:border-amber-300/35 focus:bg-white/5 disabled:cursor-not-allowed disabled:opacity-50"
          />

        </div>


        {/* =========================
            EMAIL
        ========================== */}

        <div>

          <label
            htmlFor="email"
            className="mb-1.5 block text-[10px] font-medium uppercase tracking-[0.2em] text-white/40 sm:text-[11px]"
          >
            Email
          </label>

          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="you@example.com"
            autoComplete="email"
            required
            disabled={submitting}
            className="w-full rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-3 text-sm text-white outline-none transition duration-300 placeholder:text-white/20 hover:border-white/15 focus:border-amber-300/35 focus:bg-white/5 disabled:cursor-not-allowed disabled:opacity-50"
          />

        </div>


        {/* =========================
            PASSWORD
        ========================== */}

        <div>

          <label
            htmlFor="password"
            className="mb-1.5 block text-[10px] font-medium uppercase tracking-[0.2em] text-white/40 sm:text-[11px]"
          >
            Password
          </label>

          <input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="At least 6 characters"
            autoComplete="new-password"
            minLength={6}
            required
            disabled={submitting}
            className="w-full rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-3 text-sm text-white outline-none transition duration-300 placeholder:text-white/20 hover:border-white/15 focus:border-amber-300/35 focus:bg-white/5 disabled:cursor-not-allowed disabled:opacity-50"
          />

          <p className="mt-1.5 text-[10px] text-white/20">
            Use at least 6 characters.
          </p>

        </div>


        {/* =========================
            CREATE ACCOUNT
        ========================== */}

        <button
          type="submit"
          disabled={submitting}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition duration-300 hover:bg-white/90 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
        >

          {submitting && (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-black/15 border-t-black" />
          )}

          {submitting
            ? 'Creating your space...'
            : 'Create my account'}

        </button>

      </form>


      {/* =========================
          PRIVACY NOTE
      ========================== */}

      <div className="mt-4 border-t border-white/6 pt-3.5 text-center">

        <p className="mx-auto max-w-sm text-[10px] leading-4 text-white/20">
          Your memories belong to you. Privacy and security are built into every layer of LifeCaptured.
        </p>

      </div>

    </AuthLayout>
  )
}

export default RegisterPage