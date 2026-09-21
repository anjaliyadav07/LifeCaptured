import { ArrowUpRight } from 'lucide-react'

const moments = [
  {
    date: 'JUL 2026',
    title: 'Somewhere worth remembering.',
    image:
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80'
  },
  {
    date: 'AUG 2026',
    title: 'The little moments matter too.',
    image:
      'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=900&q=80'
  },
  {
    date: 'TODAY',
    title: 'And the story keeps growing.',
    image:
      'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=900&q=80'
  }
]

const Experience = () => {
  return (
    <section
      id="experience"
      className="overflow-hidden border-t border-white/10 bg-black py-20 sm:py-24 lg:py-28"
    >

      <div className="mx-auto max-w-7xl px-6 lg:px-10">

        {/* =====================================================
            INTRO
        ====================================================== */}

        <div className="max-w-3xl">

          <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-amber-300/70">
            Your memories, connected
          </p>

          <h2 className="mt-5 text-4xl font-medium leading-[1.02] tracking-[-0.045em] text-white sm:text-5xl lg:text-6xl">
            Your life,
            <span className="block text-white/30">
              seen as a story.
            </span>
          </h2>

          <p className="mt-6 max-w-2xl text-sm leading-7 text-white/40 sm:text-base">
            A photograph is only one moment. LifeCaptured
            brings those moments together to reveal the story
            they were always part of.
          </p>

        </div>


        {/* =====================================================
            TIMELINE
        ====================================================== */}

        <div className="relative mt-12 sm:mt-14">

          {/* Timeline line */}

          <div
            className="absolute left-0 right-0 top-2.25 hidden h-px bg-white/10 sm:block"
            aria-hidden="true"
          />

          <div className="grid gap-5 sm:grid-cols-3 sm:gap-6">

            {moments.map((moment, index) => (
              <article
                key={moment.date}
                className="relative"
              >

                {/* Timeline point */}

                <div className="relative z-10 mb-6 hidden sm:block">

                  <div className="flex h-4.75 w-4.75 items-center justify-center rounded-full border border-amber-300/35 bg-black">

                    <div className="h-1.5 w-1.5 rounded-full bg-amber-300/80" />

                  </div>

                </div>


                {/* Date */}

                <p className="text-[9px] uppercase tracking-[0.25em] text-white/25">
                  {moment.date}
                </p>


                {/* Image */}

                <div className="group relative mt-3 overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0a]">

                  <div className="aspect-4/3 overflow-hidden">

                    <img
                      src={moment.image}
                      alt={moment.title}
                      loading="lazy"
                      className="h-full w-full object-cover opacity-70 transition duration-700 group-hover:scale-[1.04] group-hover:opacity-85"
                    />

                    <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/10 to-transparent" />

                  </div>


                  {/* Card content */}

                  <div className="absolute bottom-0 left-0 right-0 p-4">

                    <div className="flex items-end justify-between gap-3">

                      <h3 className="text-sm font-medium leading-5 text-white/85">
                        {moment.title}
                      </h3>

                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/15 bg-black/30 backdrop-blur-sm">

                        <ArrowUpRight
                          size={12}
                          className="text-white/50"
                        />

                      </div>

                    </div>

                  </div>

                </div>

              </article>
            ))}

          </div>

        </div>


        {/* =====================================================
            CLOSING STATEMENT
        ====================================================== */}

        <div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-7 sm:flex-row sm:items-center sm:justify-between">

          <p className="max-w-2xl text-sm leading-7 text-white/30">
            Because your life isn't a collection of separate
            photographs. It's one story — made from thousands
            of moments.
          </p>

          <span className="shrink-0 text-[9px] uppercase tracking-[0.22em] text-amber-300/45">
            Always growing
          </span>

        </div>

      </div>

    </section>
  )
}

export default Experience