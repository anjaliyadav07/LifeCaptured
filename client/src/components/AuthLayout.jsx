import { Link } from 'react-router-dom'

function AuthLayout({
  title,
  description,
  children,
  footerText,
  footerLinkText,
  footerLink
}) {
  return (
    <main className="min-h-screen bg-black text-white md:h-screen md:overflow-hidden">

      <div className="relative flex min-h-screen flex-col md:h-full md:min-h-0">

        {/* =========================
            ATMOSPHERIC BACKGROUND
        ========================== */}

        <div className="pointer-events-none absolute inset-0">

          <div className="absolute left-1/2 top-[18%] h-112 w-md -translate-x-1/2 rounded-full bg-amber-400/[0.035] blur-[140px]" />

          <div className="absolute inset-0 bg-linear-to-b from-black via-black to-black" />

        </div>


        {/* =========================
            HEADER
        ========================== */}

        <header className="relative z-10 shrink-0">

          <div className="mx-auto flex h-16 max-w-7xl items-center px-6 sm:px-8 lg:px-12">

            <Link
              to="/"
              className="text-sm font-medium tracking-[0.2em] text-white transition-opacity duration-300 hover:opacity-70"
            >
              LIFECAPTURED
            </Link>

          </div>

        </header>


        {/* =========================
            CONTENT
        ========================== */}

        <div className="relative z-10 flex flex-1 items-center justify-center px-5 py-6 sm:px-6 md:min-h-0 md:py-4">

          <div className="w-full max-w-md">

            {/* =========================
                INTRO
            ========================== */}

            <div className="mb-5 text-center sm:mb-6">

              <p className="mb-2.5 text-[10px] font-medium uppercase tracking-[0.3em] text-amber-300/80 sm:text-[11px]">
                Your moments. Your story.
              </p>

              <h1 className="text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl">
                {title}
              </h1>

              <p className="mx-auto mt-2.5 max-w-sm text-xs leading-5 text-white/40 sm:text-sm">
                {description}
              </p>

            </div>


            {/* =========================
                FORM CARD
            ========================== */}

            <div className="rounded-[1.6rem] border border-white/10 bg-white/2.5 p-5 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-6">

              {children}

            </div>


            {/* =========================
                FOOTER
            ========================== */}

            <p className="mt-3.5 text-center text-xs text-white/30 sm:mt-4 sm:text-sm">

              {footerText}{' '}

              <Link
                to={footerLink}
                className="text-white/70 transition-colors duration-300 hover:text-white"
              >
                {footerLinkText}
              </Link>

            </p>

          </div>

        </div>

      </div>

    </main>
  )
}

export default AuthLayout