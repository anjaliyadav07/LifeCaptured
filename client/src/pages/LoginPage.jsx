import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout'
import { useAuth } from '../context/AuthContext'

function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [formData, setFormData] = useState({
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
     * Remove the previous error once the user
     * starts correcting the form.
     */
    if (error) {
      setError('')
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    setError('')
    setSubmitting(true)

    try {
      await login(formData)
      navigate('/app')
    } catch (error) {
      setError(
        error.message ||
        'Unable to sign in. Please check your credentials.'
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthLayout
      title="Welcome back."
      description="Return to the moments that matter and continue your story."
      footerText="Don't have an account?"
      footerLinkText="Create one"
      footerLink="/register"
    >

      <form
        onSubmit={handleSubmit}
        className="space-y-4"
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

          <div className="mb-1.5 flex items-center justify-between">

            <label
              htmlFor="password"
              className="block text-[10px] font-medium uppercase tracking-[0.2em] text-white/40 sm:text-[11px]"
            >
              Password
            </label>

            <span className="text-[10px] text-white/20">
              Secure access
            </span>

          </div>

          <input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Your password"
            autoComplete="current-password"
            required
            disabled={submitting}
            className="w-full rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-3 text-sm text-white outline-none transition duration-300 placeholder:text-white/20 hover:border-white/15 focus:border-amber-300/35 focus:bg-white/5 disabled:cursor-not-allowed disabled:opacity-50"
          />

        </div>


        {/* =========================
            SIGN IN
        ========================== */}

        <button
          type="submit"
          disabled={submitting}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition duration-300 hover:bg-white/90 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
        >

          {submitting && (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-black/15 border-t-black" />
          )}

          {submitting ? 'Signing in...' : 'Sign in'}

        </button>

      </form>


      {/* =========================
          BACK LINK
      ========================== */}

      <div className="mt-4 text-center">

        <Link
          to="/"
          className="text-[11px] text-white/25 transition-colors duration-300 hover:text-white/60"
        >
          ← Back to LifeCaptured
        </Link>

      </div>

    </AuthLayout>
  )
}

export default LoginPage