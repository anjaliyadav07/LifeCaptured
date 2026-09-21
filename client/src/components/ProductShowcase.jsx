import {
  CalendarDays,
  Clock3,
  MapPin,
  Image as ImageIcon
} from 'lucide-react'

import memory01 from '../assets/showcase/memory-01.jpg'
import memory02 from '../assets/showcase/memory-02.jpg'
import memory03 from '../assets/showcase/memory-03.jpg'
import memory04 from '../assets/showcase/memory-04.jpg'

const memories = [
  {
    title: 'A Night Worth Remembering',
    date: '01 SEP 2026',
    location: 'Home',
    image: memory01
  },
  {
    title: 'Somewhere Above the Clouds',
    date: '10 SEP 2026',
    location: 'Above the mountains',
    image: memory02
  },
  {
    title: 'An Evening by the Water',
    date: '10 SEP 2026',
    location: 'By the water',
    image: memory03
  },
  {
    title: 'The City After Dark',
    date: '15 SEP 2026',
    location: 'The city',
    image: memory04
  }
]

const ProductShowcase = () => {
  return (
    <section className="relative overflow-hidden bg-[#050505] py-20 sm:py-24 lg:py-28">

      {/* =====================================================
          AMBIENT LIGHT
      ====================================================== */}

      <div
        className="pointer-events-none absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-amber-300/[2.5 blur-[120px]"
        aria-hidden="true"
      />


      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">

        {/* ===================================================
            SECTION INTRO
        ==================================================== */}

        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">

          <div>

            <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-amber-300/70">
              The product
            </p>

            <h2 className="mt-5 max-w-xl text-4xl font-medium leading-[1.02] tracking-[-0.04em] text-white sm:text-5xl lg:text-6xl">
              Your memories,
              <span className="block text-white/30">
                kept together.
              </span>
            </h2>

          </div>


          <p className="max-w-xl text-sm leading-7 text-white/40 lg:ml-auto">
            One place for the photographs, places, dates, and
            stories that make up your life — organized into an
            archive you can actually explore.
          </p>

        </div>


        {/* ===================================================
            PRODUCT WINDOW
        ==================================================== */}

        <div className="mt-12 overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#090909] shadow-[0_25px_90px_rgba(0,0,0,0.45)]">

          {/* =================================================
              APP HEADER
          ================================================== */}

          <div className="flex h-14 items-center justify-between border-b border-white/10 px-5 sm:px-7">

            <div className="flex items-center gap-3">

              <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/3.5">

                <span className="text-[8px] font-semibold tracking-[0.15em] text-white/65">
                  LC
                </span>

              </div>


              <div>

                <p className="text-xs font-medium text-white/70">
                  LifeCaptured
                </p>

                <p className="text-[9px] text-white/25">
                  Personal archive
                </p>

              </div>

            </div>


            <div className="flex items-center gap-3">

              <span className="hidden text-[8px] uppercase tracking-[0.2em] text-white/20 sm:block">
                September 2026
              </span>

              <div className="h-7 w-7 rounded-full border border-white/10 bg-white/5" />

            </div>

          </div>


          {/* =================================================
              APPLICATION BODY
          ================================================== */}

          <div className="grid lg:grid-cols-[190px_1fr]">

            {/* =================================================
                SIDEBAR
            ================================================== */}

            <aside className="hidden border-r border-white/10 p-5 lg:block">

              <p className="text-[8px] uppercase tracking-[0.25em] text-white/20">
                Archive
              </p>


              <nav className="mt-5 space-y-1">

                {[
                  'Overview',
                  'Create Memory',
                  'Your Memories',
                  'Timeline',
                  'Frames',
                  'Stories'
                ].map((item, index) => (
                  <div
                    key={item}
                    className={`rounded-lg px-3 py-2.5 text-[10px] ${
                      index === 2
                        ? 'bg-white/[0.07] text-white/80'
                        : 'text-white/25'
                    }`}
                  >
                    {item}
                  </div>
                ))}

              </nav>

            </aside>


            {/* =================================================
                MAIN CONTENT
            ================================================== */}

            <div className="p-5 sm:p-7 lg:p-8">

              {/* Heading */}

              <div className="flex items-end justify-between gap-4">

                <div>

                  <p className="text-[9px] uppercase tracking-[0.25em] text-white/25">
                    September 2026
                  </p>

                  <h3 className="mt-2 text-xl font-medium tracking-tight text-white sm:text-2xl">
                    Your recent moments
                  </h3>

                </div>


                <div className="hidden items-center gap-2 text-[9px] text-white/30 sm:flex">

                  <CalendarDays size={12} />

                  By date

                </div>

              </div>


              {/* =================================================
                  MEMORY GRID
              ================================================== */}

              <div className="mt-7 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">

                {memories.map((memory, index) => (
                  <MemoryPreview
                    key={memory.title}
                    memory={memory}
                    featured={index === 0}
                  />
                ))}

              </div>


              {/* =================================================
                  ARCHIVE FOOTER
              ================================================== */}

              <div className="mt-6 flex items-center justify-between border-t border-white/8 pt-5">

                <div className="flex items-center gap-2 text-[9px] uppercase tracking-[0.18em] text-white/25">

                  <Clock3 size={11} />

                  Your archive keeps growing

                </div>


                <span className="text-[9px] text-white/20">
                  12 moments
                </span>

              </div>

            </div>

          </div>

        </div>


        {/* ===================================================
            CAPTION
        ==================================================== */}

        <div className="mt-5 flex items-center justify-between">

          <p className="text-[9px] uppercase tracking-[0.22em] text-white/15">
            A glimpse inside your archive
          </p>

          <span className="text-[9px] text-white/15">
            LifeCaptured
          </span>

        </div>

      </div>

    </section>
  )
}


/* =========================================================
   MEMORY PREVIEW
========================================================= */

const MemoryPreview = ({
  memory,
  featured
}) => {
  return (
    <article
      className={`group relative overflow-hidden rounded-xl border border-white/10 bg-[#0c0c0c] ${
        featured
          ? 'sm:col-span-2 xl:col-span-1'
          : ''
      }`}
    >

      <div
        className={`relative overflow-hidden ${
          featured
            ? 'h-56'
            : 'h-44'
        }`}
      >

        {/* =================================================
            PHOTOGRAPH
        ================================================== */}

        <img
          src={memory.image}
          alt=""
          aria-hidden="true"
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover opacity-80 transition duration-700 ease-out group-hover:scale-[1.045] group-hover:opacity-95"
        />


        {/* =================================================
            CINEMATIC OVERLAY
        ================================================== */}

        <div
          className="absolute inset-0 bg-linear-to-t from-black via-black/20 to-transparent"
          aria-hidden="true"
        />

        <div
          className="absolute inset-0 bg-black/4"
          aria-hidden="true"
        />


        {/* =================================================
            IMAGE INDICATOR
        ================================================== */}

        <div className="absolute left-4 top-4 flex h-7 w-7 items-center justify-center rounded-lg border border-white/15 bg-black/30 backdrop-blur-sm">

          <ImageIcon
            size={13}
            strokeWidth={1.3}
            className="text-white/55"
          />

        </div>


        {/* =================================================
            MEMORY METADATA
        ================================================== */}

        <div className="absolute bottom-0 left-0 right-0 p-4">

          <p className="text-[7px] uppercase tracking-[0.2em] text-white/50">
            {memory.date}
          </p>


          <p className="mt-1.5 text-xs font-medium leading-5 text-white/90">
            {memory.title}
          </p>


          <div className="mt-2 flex items-center gap-1.5 text-[8px] text-white/50">

            <MapPin size={9} />

            {memory.location}

          </div>

        </div>

      </div>

    </article>
  )
}

export default ProductShowcase