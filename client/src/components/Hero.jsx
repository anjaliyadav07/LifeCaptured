import { Link } from 'react-router-dom'
import heroImage from '../assets/hero.png'

function Hero() {
  const scrollToFeatures = (event) => {
    event.preventDefault()

    const featuresSection = document.getElementById('features')

    if (featuresSection) {
      featuresSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      })
    }
  }

  return (
    <section className="relative min-h-screen overflow-hidden bg-black">

      {/* =====================================================
          BACKGROUND
      ====================================================== */}

      <div className="absolute inset-0">

        <img
          src={heroImage}
          alt=""
          aria-hidden="true"
          className="hero-image h-full w-full object-cover object-[68%_center]"
        />

        {/* Base darkness */}

        <div
          className="absolute inset-0 bg-black/35"
          aria-hidden="true"
        />

        {/* Text protection */}

        <div
          className="absolute inset-0 bg-linear-to-r from-black via-black/60 to-transparent"
          aria-hidden="true"
        />

        {/* Atmospheric glow */}

        <div
          className="absolute left-[35%] top-1/2 h-125 w-125 -translate-y-1/2 rounded-full bg-amber-500/5 blur-[120px]"
          aria-hidden="true"
        />

        {/* Bottom fade */}

        <div
          className="absolute inset-x-0 bottom-0 h-48 bg-linear-to-t from-black via-black/50 to-transparent"
          aria-hidden="true"
        />

      </div>


      {/* =====================================================
          CONTENT
      ====================================================== */}

      <div className="relative z-10 flex min-h-screen items-center">

        <div className="mx-auto w-full max-w-7xl px-6 py-28 sm:px-8 sm:py-32 lg:px-12">

          <div className="max-w-4xl">

            {/* Eyebrow */}

            <div className="hero-reveal">

              <p className="mb-6 text-[11px] font-medium uppercase tracking-[0.32em] text-amber-300/90 sm:text-xs">
                Your life, beautifully remembered
              </p>

            </div>


            {/* Heading */}

            <div className="hero-reveal hero-reveal-delay-1">

              <h1 className="max-w-4xl text-5xl font-semibold leading-[0.94] tracking-[-0.045em] text-white sm:text-6xl lg:text-8xl">

                Your moments.

                <br />

                <span className="text-white/60">
                  Your story.
                </span>

              </h1>

            </div>


            {/* Description */}

            <div className="hero-reveal hero-reveal-delay-2">

              <p className="mt-7 max-w-2xl text-sm leading-7 text-white/65 sm:mt-8 sm:text-base sm:leading-8 lg:text-lg">
                Capture photos, thoughts, places, and little
                moments — and transform them into a living
                visual story of your life.
              </p>

            </div>


            {/* =================================================
                ACTIONS
            ================================================== */}

            <div className="hero-reveal hero-reveal-delay-3 mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">

              {/* Start Capturing */}

              <Link
                to="/register"
                className="group inline-flex w-fit items-center justify-center rounded-full bg-white px-7 py-3.5 text-sm font-medium text-black transition duration-300 hover:scale-[1.02] hover:bg-white/90 active:scale-[0.99]"
              >
                Start Capturing

                <span
                  className="ml-2 transition-transform duration-300 group-hover:translate-x-1"
                  aria-hidden="true"
                >
                  →
                </span>

              </Link>


              {/* Explore */}

              <a
                href="#features"
                onClick={scrollToFeatures}
                className="group inline-flex w-fit items-center justify-center px-2 py-3.5 text-sm font-medium text-white/70 transition duration-300 hover:text-white"
              >
                Explore LifeCaptured

                <span
                  className="ml-2 transition-transform duration-300 group-hover:translate-x-1"
                  aria-hidden="true"
                >
                  →
                </span>

              </a>

            </div>


            {/* =================================================
                SUPPORTING STATEMENT
            ================================================== */}

            <div className="hero-reveal hero-reveal-delay-4 mt-14 flex items-center gap-4 sm:mt-16">

              <span
                className="h-px w-10 bg-white/25 sm:w-12"
                aria-hidden="true"
              />

              <p className="text-[9px] uppercase tracking-[0.28em] text-white/40 sm:text-[10px]">
                A visual archive for your life
              </p>

            </div>

          </div>

        </div>

      </div>


      {/* =====================================================
          SCROLL INDICATOR
      ====================================================== */}

      <div className="absolute bottom-7 left-1/2 z-20 hidden -translate-x-1/2 sm:block">

        <div className="flex flex-col items-center gap-2 text-white/35">

          <span className="text-[8px] uppercase tracking-[0.3em]">
            Scroll
          </span>

          <div
            className="hero-scroll-line h-8 w-px bg-white/25"
            aria-hidden="true"
          />

        </div>

      </div>

    </section>
  )
}

export default Hero