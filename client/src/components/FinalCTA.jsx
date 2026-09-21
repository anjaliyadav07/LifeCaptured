import { ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const FinalCTA = () => {
  const navigate = useNavigate()

  return (
    <section className="relative overflow-hidden border-t border-white/10 bg-[#050505] py-24 sm:py-28 lg:py-32">

      {/* Very subtle atmosphere */}

      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-95 w-95 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-300/2.5 blur-[120px]"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-4xl px-6 text-center">

        <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-amber-300/70">
          Start your archive
        </p>

        <h2 className="mt-6 text-5xl font-medium leading-[0.98] tracking-[-0.045em] text-white sm:text-6xl lg:text-7xl">
          Your life is
          <span className="block text-white/30">
            worth remembering.
          </span>
        </h2>

        <p className="mx-auto mt-6 max-w-lg text-sm leading-7 text-white/35 sm:text-base">
          Start with one photograph.
          Let the story grow from there.
        </p>

        <button
          type="button"
          onClick={() => navigate('/register')}
          className="mt-8 inline-flex items-center gap-3 rounded-full bg-white px-7 py-3.5 text-sm font-medium text-black transition duration-300 hover:scale-[1.02] hover:bg-white/90 active:scale-[0.99]"
        >
          Start Capturing

          <ArrowRight size={15} />

        </button>

      </div>

    </section>
  )
}

export default FinalCTA