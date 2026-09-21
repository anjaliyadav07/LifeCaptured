import {
  Camera,
  CalendarDays,
  Layers3,
  Clapperboard
} from 'lucide-react'

const steps = [
  {
    number: '01',
    icon: Camera,
    title: 'Capture',
    description:
      'Save the photograph, thought, place, or moment while it is still fresh.'
  },
  {
    number: '02',
    icon: CalendarDays,
    title: 'Remember',
    description:
      'Give the moment context with a date, location, description, and feeling.'
  },
  {
    number: '03',
    icon: Layers3,
    title: 'Connect',
    description:
      'See individual memories become part of a larger timeline.'
  },
  {
    number: '04',
    icon: Clapperboard,
    title: 'Relive',
    description:
      'Turn the moments of a month into a cinematic story.'
  }
]

const MemoryToStory = () => {
  return (
    <section className="overflow-hidden border-t border-white/10 bg-[#070707] py-20 sm:py-24 lg:py-28">

      <div className="mx-auto max-w-7xl px-6 lg:px-10">

        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">

          {/* Introduction */}

          <div className="max-w-xl">

            <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-amber-300/70">
              From memory to story
            </p>

            <h2 className="mt-5 text-4xl font-medium leading-[1.05] tracking-[-0.04em] text-white sm:text-5xl lg:text-6xl">
              One moment at a time.
              <span className="block text-white/30">
                One story over time.
              </span>
            </h2>

            <p className="mt-6 max-w-lg text-sm leading-7 text-white/40 sm:text-base">
              LifeCaptured is designed around the way memories
              actually grow — slowly, naturally, and over time.
            </p>

          </div>


          {/* Steps */}

          <div className="relative">

            <div
              className="absolute bottom-5 left-5.5 top-5 w-px bg-white/10"
              aria-hidden="true"
            />

            <div className="space-y-2.5">

              {steps.map((step) => {
                const Icon = step.icon

                return (
                  <article
                    key={step.number}
                    className="group relative grid grid-cols-[45px_1fr] gap-4 rounded-2xl border border-white/8 bg-white/[0.012] p-4 transition duration-300 hover:border-white/15 hover:bg-white/2.5 sm:grid-cols-[45px_1fr_auto] sm:gap-5 sm:p-5"
                  >

                    <div className="relative z-10 flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-[#070707] text-white/30 transition duration-300 group-hover:border-amber-300/30 group-hover:text-amber-300/80">

                      <Icon
                        size={17}
                        strokeWidth={1.4}
                      />

                    </div>


                    <div>

                      <div className="flex items-center gap-3">

                        <span className="text-[8px] uppercase tracking-[0.22em] text-white/20">
                          {step.number}
                        </span>

                        <h3 className="text-sm font-medium text-white/80">
                          {step.title}
                        </h3>

                      </div>

                      <p className="mt-2 max-w-lg text-xs leading-6 text-white/30 sm:text-sm">
                        {step.description}
                      </p>

                    </div>


                    <span className="hidden items-center text-white/10 transition group-hover:text-white/30 sm:flex">
                      →
                    </span>

                  </article>
                )
              })}

            </div>

          </div>

        </div>

      </div>

    </section>
  )
}

export default MemoryToStory