import { useNavigate } from 'react-router-dom'

const Footer = () => {
  const navigate = useNavigate()

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  return (
    <footer className="overflow-hidden border-t border-white/10 bg-[#030303]">

      <div className="mx-auto max-w-7xl px-6 py-10 lg:px-10">

        <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">

          {/* Brand */}

          <div>

            <button
              type="button"
              onClick={scrollToTop}
              className="text-sm font-semibold tracking-[0.22em] text-white transition hover:text-white/70"
            >
              LIFECAPTURED
            </button>

            <p className="mt-3 max-w-xs text-xs leading-6 text-white/25">
              A visual archive for the moments that make
              your life yours.
            </p>

          </div>


          {/* Links */}

          <nav className="flex flex-wrap gap-x-6 gap-y-3">

            <button
              type="button"
              onClick={() => navigate('/login')}
              className="text-xs text-white/30 transition hover:text-white"
            >
              Sign in
            </button>

            <button
              type="button"
              onClick={() => navigate('/register')}
              className="text-xs text-white/30 transition hover:text-white"
            >
              Start Capturing
            </button>

            <button
              type="button"
              onClick={scrollToTop}
              className="text-xs text-white/30 transition hover:text-white"
            >
              Back to top
            </button>

          </nav>

        </div>


        {/* Bottom */}

        <div className="mt-9 flex flex-col gap-2 border-t border-white/8 pt-5 sm:flex-row sm:items-center sm:justify-between">

          <p className="text-[9px] uppercase tracking-[0.2em] text-white/15">
            © {new Date().getFullYear()} LifeCaptured
          </p>

          <p className="text-[9px] uppercase tracking-[0.2em] text-white/15">
            Your moments. Your story.
          </p>

        </div>

      </div>

    </footer>
  )
}

export default Footer