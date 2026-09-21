import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import Container from '../components/Container'
import SectionHeading from '../components/SectionHeading'
import FeatureCard from '../components/FeatureCard'
import ProductShowcase from '../components/ProductShowcase'
import FinalCTA from '../components/FinalCTA'
import Footer from '../components/Footer'

function LandingPage() {
  return (
    <main className="min-h-screen w-full overflow-x-clip bg-black text-white">
      {/* =====================================================
          NAVIGATION
      ====================================================== */}
      <Navbar />

      {/* =====================================================
          HERO
      ====================================================== */}
      <Hero />

      {/* =====================================================
          CORE EXPERIENCE
      ====================================================== */}
      <section
        id="features"
        className="relative overflow-hidden border-t border-white/8 py-20 sm:py-24 lg:py-28"
      >
        <div
          className="pointer-events-none absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-amber-300/[0.035] blur-[110px]"
          aria-hidden="true"
        />

        <Container>
          <SectionHeading
            eyebrow="Built for your story"
            title="Everything you need to remember beautifully."
            description="LifeCaptured turns scattered moments into a personal visual archive you can return to, explore, and relive."
          />

          <div className="mt-10 grid gap-4 lg:grid-cols-3">
            {/* CAPTURE */}
            <FeatureCard
              number="01"
              title="Capture"
              description="Save photographs, thoughts, places, and the small moments worth keeping."
            >
              <div className="relative h-24 w-24">
                <div className="absolute inset-0 rotate-[-8deg] rounded-2xl border border-white/15 bg-white/2.5 transition duration-500 group-hover:rotate-3" />

                <div className="absolute inset-2 flex items-center justify-center rounded-xl border border-white/10 bg-black">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className="h-8 w-8 text-amber-300/80"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    aria-hidden="true"
                  >
                    <rect
                      x="3"
                      y="5"
                      width="18"
                      height="14"
                      rx="2"
                    />

                    <circle
                      cx="12"
                      cy="12"
                      r="3.5"
                    />

                    <path d="M8 5l1.2-2h5.6L16 5" />
                  </svg>
                </div>
              </div>
            </FeatureCard>

            {/* ORGANIZE */}
            <FeatureCard
              number="02"
              title="Organize"
              description="Give every memory a date, place, context, and position in your personal timeline."
            >
              <div className="relative w-full max-w-55">
                <div className="absolute left-4 right-4 top-1/2 h-px bg-white/10" />

                <div className="relative flex items-center justify-between">
                  <span className="h-3 w-3 rounded-full border border-white/35 bg-black" />

                  <span className="h-4 w-4 rounded-full border border-amber-300/60 bg-amber-300/10" />

                  <span className="h-3 w-3 rounded-full border border-white/35 bg-black" />

                  <span className="h-4 w-4 rounded-full border border-amber-300/60 bg-amber-300/10" />

                  <span className="h-3 w-3 rounded-full border border-white/35 bg-black" />
                </div>

                <div className="mt-5 flex justify-between text-[9px] uppercase tracking-[0.2em] text-white/25">
                  <span>Now</span>
                  <span>Then</span>
                  <span>Always</span>
                </div>
              </div>
            </FeatureCard>

            {/* RELIVE */}
            <FeatureCard
              number="03"
              title="Relive"
              description="Turn the moments you've captured into visual stories you can experience again."
            >
              <div className="relative h-24 w-40">
                <div className="absolute left-0 top-4 h-16 w-28 rotate-[-7deg] rounded-xl border border-white/10 bg-white/2.5" />

                <div className="absolute left-6 top-2 h-16 w-28 rotate-3 rounded-xl border border-white/10 bg-white/[0.035]" />

                <div className="absolute left-12 top-4 h-16 w-28 rotate-[9deg] rounded-xl border border-amber-300/20 bg-amber-300/[0.035]" />

                <div className="absolute left-20 top-6 h-2 w-2 rounded-full bg-amber-300/80 shadow-[0_0_18px_rgba(252,211,77,0.45)]" />
              </div>
            </FeatureCard>
          </div>

          <div className="mt-10 flex items-center gap-4 border-t border-white/8 pt-6">
            <span
              className="h-px w-10 bg-amber-300/40"
              aria-hidden="true"
            />

            <p className="max-w-2xl text-sm leading-6 text-white/35">
              Your memories shouldn't disappear into a camera roll.
              They should become a story you can actually experience.
            </p>
          </div>
        </Container>
      </section>

      {/* =====================================================
          PRODUCT PREVIEW
      ====================================================== */}
      <section className="border-t border-white/8">
        <ProductShowcase />
      </section>

      {/* =====================================================
          FINAL CTA
      ====================================================== */}
      <section className="border-t border-white/8">
        <FinalCTA />
      </section>

      {/* =====================================================
          FOOTER
      ====================================================== */}
      <Footer />
    </main>
  )
}

export default LandingPage