import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { getMemories } from '../services/api'
import { useAuth } from '../context/AuthContext'


/* =========================================================
   DATE
========================================================= */

function formatMemoryDate(date) {
  if (!date) {
    return ''
  }

  const parsedDate = new Date(date)

  if (Number.isNaN(parsedDate.getTime())) {
    return ''
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  }).format(parsedDate)
}


/* =========================================================
   LOCATION ICON
========================================================= */

function LocationIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-3.5 w-3.5 shrink-0"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      <path d="M20 10.5c0 5-8 10-8 10s-8-5-8-10a8 8 0 1 1 16 0Z" />
      <circle cx="12" cy="10.5" r="2.5" />
    </svg>
  )
}


/* =========================================================
   LOCATION
========================================================= */

function LocationLabel({ location }) {
  if (!location) {
    return null
  }

  return (
    <p className="flex items-center gap-1.5 text-xs text-white/35">

      <span className="text-white/45">
        <LocationIcon />
      </span>

      <span className="truncate">
        {location}
      </span>

    </p>
  )
}


/* =========================================================
   EMPTY IMAGE
========================================================= */

function EmptyMemoryVisual() {
  return (
    <div className="flex h-full items-center justify-center bg-white/[0.018]">

      <div className="text-center">

        <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-full border border-white/10">

          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="h-4 w-4 text-white/20"
            stroke="currentColor"
            strokeWidth="1.4"
            aria-hidden="true"
          >
            <rect
              x="4"
              y="5"
              width="16"
              height="14"
              rx="2"
            />

            <circle
              cx="9"
              cy="10"
              r="1.5"
            />

            <path d="m5 17 4-4 3 3 2-2 5 4" />
          </svg>

        </div>

        <p className="mt-2 text-[8px] font-medium uppercase tracking-[0.28em] text-white/18">
          Memory
        </p>

        <p className="mt-1 text-[10px] text-white/20">
          No photograph
        </p>

      </div>

    </div>
  )
}


/* =========================================================
   OVERVIEW
========================================================= */

function OverviewPage() {
  const navigate = useNavigate()

  const { user } = useAuth()

  const [memories, setMemories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')


  /* =======================================================
     LOAD MEMORIES
  ======================================================== */

  useEffect(() => {
    let mounted = true

    const fetchMemories = async () => {
      try {
        const token = localStorage.getItem(
          'lifecaptured_token'
        )

        if (!token) {
          throw new Error('Authentication required')
        }

        const data = await getMemories(token)

        if (mounted) {
          setMemories(data.memories || [])
        }
      } catch (requestError) {
        console.error(requestError)

        if (mounted) {
          setError(
            requestError.message ||
              'We could not open your archive.'
          )
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    fetchMemories()

    return () => {
      mounted = false
    }
  }, [])


  /* =======================================================
     DATA
  ======================================================== */

  const latestMemory = memories[0]

  const archiveMemories = memories.slice(1)

  const firstName =
    user?.name?.split(' ')[0] ||
    'there'

  const memoryCount = memories.length

  const latestDate = latestMemory
    ? formatMemoryDate(latestMemory.memory_date)
    : ''


  /* =======================================================
     RENDER
  ======================================================== */

  return (
    <div className="min-h-full bg-black text-white">

      {/* =====================================================
          HEADER
      ====================================================== */}

      <header className="border-b border-white/[0.07]">

        <div className="mx-auto flex max-w-7xl items-end justify-between gap-8 px-6 py-7 sm:px-8 lg:px-10">

          <div>

            <div className="flex items-center gap-3">

              <span
                className="h-px w-7 bg-amber-300/45"
                aria-hidden="true"
              />

              <p className="text-[9px] font-medium uppercase tracking-[0.34em] text-amber-300/65">
                Your story
              </p>

            </div>

            <h1 className="mt-3 text-2xl font-medium tracking-[-0.035em] text-white sm:text-[28px]">
              Welcome back, {firstName}.
            </h1>

            <p className="mt-1.5 text-sm text-white/32">
              Your memories, collected in one place.
            </p>

          </div>


          {/* Archive summary */}

          <div className="hidden items-end gap-7 sm:flex">

            <div className="text-right">

              <p className="text-[8px] uppercase tracking-[0.28em] text-white/20">
                Archive
              </p>

              <p className="mt-1 text-xs text-white/35">
                {latestDate
                  ? `Last captured ${latestDate}`
                  : 'Your archive is beginning'}
              </p>

            </div>


            <div className="text-right">

              <p className="text-[8px] uppercase tracking-[0.3em] text-white/22">
                Memories
              </p>

              <p className="mt-1 text-2xl font-light tracking-tight text-white">
                {memoryCount}
              </p>

            </div>

          </div>

        </div>

      </header>


      {/* =====================================================
          MAIN
      ====================================================== */}

      <main className="mx-auto max-w-7xl px-6 py-7 sm:px-8 lg:px-10 lg:py-9">


        {/* ===================================================
            CREATE MEMORY
        ==================================================== */}

        <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.018]">

          <div
            className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-amber-400/2.5 blur-[120px]"
            aria-hidden="true"
          />

          <div className="relative flex flex-col justify-between gap-6 px-7 py-6 sm:px-8 sm:py-7 lg:flex-row lg:items-center">

            <div className="max-w-2xl">

              <p className="text-[9px] font-medium uppercase tracking-[0.34em] text-amber-300/65">
                Capture a moment
              </p>

              <h2 className="mt-2.5 text-[24px] font-medium leading-tight tracking-[-0.035em] text-white sm:text-[27px]">
                What do you want to remember?
              </h2>

              <p className="mt-2.5 max-w-xl text-sm leading-6 text-white/38">
                Add a photograph, a thought, a place, or a moment.
                Your story grows one memory at a time.
              </p>

            </div>


            <button
              type="button"
              onClick={() => navigate('/app/create-memory')}
              className="group inline-flex w-fit shrink-0 items-center rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition duration-300 hover:bg-white/90 active:scale-[0.99]"
            >
              Create Memory

              <span
                className="ml-2 transition-transform duration-300 group-hover:translate-x-1"
                aria-hidden="true"
              >
                →
              </span>

            </button>

          </div>

        </section>


        {/* ===================================================
            LOADING
        ==================================================== */}

        {loading && (
          <div className="py-16 text-center">

            <div className="mx-auto h-px w-16 overflow-hidden bg-white/10">

              <div className="h-full w-1/2 animate-pulse bg-amber-300/40" />

            </div>

            <p className="mt-4 text-sm text-white/25">
              Opening your archive...
            </p>

          </div>
        )}


        {/* ===================================================
            ERROR
        ==================================================== */}

        {!loading && error && (
          <div className="mt-8 rounded-2xl border border-red-400/15 bg-red-400/2 px-5 py-4">

            <p className="text-sm text-red-300">
              {error}
            </p>

          </div>
        )}


        {/* ===================================================
            EMPTY STATE
        ==================================================== */}

        {!loading &&
          !error &&
          memories.length === 0 && (
            <section className="mt-10 rounded-3xl border border-dashed border-white/10 px-6 py-16 text-center">

              <p className="text-[9px] uppercase tracking-[0.32em] text-white/22">
                Your archive is waiting
              </p>

              <h2 className="mt-3 text-2xl font-medium tracking-tight text-white">
                Begin with one moment.
              </h2>

              <p className="mx-auto mt-2.5 max-w-md text-sm leading-6 text-white/32">
                Capture something meaningful and watch your
                personal story begin to take shape.
              </p>

              <button
                type="button"
                onClick={() =>
                  navigate('/app/create-memory')
                }
                className="mt-5 rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition hover:bg-white/90"
              >
                Capture your first memory
              </button>

            </section>
          )}


        {/* ===================================================
            LATEST MEMORY
        ==================================================== */}

        {!loading &&
          !error &&
          latestMemory && (
            <section className="mt-10">

              <div className="mb-4 flex items-end justify-between">

                <div>

                  <p className="text-[9px] font-medium uppercase tracking-[0.32em] text-white/23">
                    Latest memory
                  </p>

                  <h2 className="mt-1.5 text-xl font-medium tracking-[-0.02em] text-white">
                    Recently captured
                  </h2>

                </div>


                <button
                  type="button"
                  onClick={() =>
                    navigate('/app/memories')
                  }
                  className="hidden text-xs text-white/30 transition hover:text-white/70 sm:block"
                >
                  View all →
                </button>

              </div>


              <article className="group overflow-hidden rounded-3xl border border-white/10 bg-white/[0.018] transition duration-500 hover:border-white/15">

                <div className="grid lg:grid-cols-[1.08fr_0.92fr]">

                  {/* =================================================
                      IMAGE
                  ================================================== */}

                  <button
                    type="button"
                    onClick={() =>
                      navigate(
                        `/app/memories/${latestMemory.id}`
                      )
                    }
                    className="relative block h-56 overflow-hidden text-left sm:h-60 lg:h-64"
                    aria-label={`View ${latestMemory.title}`}
                  >

                    {latestMemory.images?.length > 0 ? (
                      <>
                        <img
                          src={
                            latestMemory.images[0].imageUrl
                          }
                          alt={latestMemory.title}
                          className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.025]"
                        />

                        <div
                          className="absolute inset-0 bg-linearto-r from-transparent via-transparent to-black/20"
                          aria-hidden="true"
                        />

                        <div
                          className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent"
                          aria-hidden="true"
                        />
                      </>
                    ) : (
                      <EmptyMemoryVisual />
                    )}

                  </button>


                  {/* =================================================
                      DETAILS
                  ================================================== */}

                  <div className="flex flex-col justify-between p-6 sm:p-7">

                    <div>

                      <p className="text-[9px] font-medium uppercase tracking-[0.3em] text-amber-300/65">
                        {formatMemoryDate(
                          latestMemory.memory_date
                        )}
                      </p>

                      <h3 className="mt-2.5 text-[23px] font-medium leading-tight tracking-[-0.03em] text-white">
                        {latestMemory.title}
                      </h3>

                      {latestMemory.description && (
                        <p className="mt-2.5 max-w-lg text-sm leading-6 text-white/38">
                          {latestMemory.description}
                        </p>
                      )}

                      {latestMemory.location && (
                        <div className="mt-4">
                          <LocationLabel
                            location={
                              latestMemory.location
                            }
                          />
                        </div>
                      )}

                    </div>


                    {/* FIXED: REAL NAVIGATION */}

                    <button
                      type="button"
                      onClick={() =>
                        navigate(
                          `/app/memories/${latestMemory.id}`
                        )
                      }
                      className="group/button mt-6 inline-flex w-fit items-center rounded-full border border-white/12 px-5 py-2.5 text-xs font-medium text-white/55 transition duration-300 hover:border-white/25 hover:text-white"
                    >
                      View Memory

                      <span
                        className="ml-2 transition-transform duration-300 group-hover/button:translate-x-1"
                        aria-hidden="true"
                      >
                        →
                      </span>

                    </button>

                  </div>

                </div>

              </article>

            </section>
          )}


        {/* ===================================================
            ARCHIVE
        ==================================================== */}

        {!loading &&
          !error &&
          archiveMemories.length > 0 && (
            <section className="mt-10">

              <div className="mb-4 flex items-end justify-between">

                <div>

                  <p className="text-[9px] font-medium uppercase tracking-[0.32em] text-white/23">
                    Your archive
                  </p>

                  <h2 className="mt-1.5 text-xl font-medium tracking-[-0.02em] text-white">
                    More from your story
                  </h2>

                </div>


                <button
                  type="button"
                  onClick={() =>
                    navigate('/app/memories')
                  }
                  className="text-xs text-white/30 transition hover:text-white/70"
                >
                  {archiveMemories.length} more →
                </button>

              </div>


              {/* =================================================
                  MEMORY GRID
              ================================================== */}

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

                {archiveMemories.map((memory) => (

                  <button
                    key={memory.id}
                    type="button"
                    onClick={() =>
                      navigate(
                        `/app/memories/${memory.id}`
                      )
                    }
                    className="group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.018] text-left transition duration-500 hover:-translate-y-0.5 hover:border-white/20"
                  >

                    {/* IMAGE */}

                    <div className="aspect-video overflow-hidden">

                      {memory.images?.length > 0 ? (
                        <img
                          src={
                            memory.images[0].imageUrl
                          }
                          alt={memory.title}
                          loading="lazy"
                          className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.035]"
                        />
                      ) : (
                        <EmptyMemoryVisual />
                      )}

                    </div>


                    {/* CONTENT */}

                    <div className="px-4 pb-4 pt-3.5">

                      <p className="text-[8px] font-medium uppercase tracking-[0.27em] text-amber-300/60">
                        {formatMemoryDate(
                          memory.memory_date
                        )}
                      </p>

                      <h3 className="mt-2 line-clamp-1 text-[16px] font-medium tracking-[-0.02em] text-white">
                        {memory.title}
                      </h3>

                      {memory.location && (
                        <div className="mt-2.5">
                          <LocationLabel
                            location={memory.location}
                          />
                        </div>
                      )}

                      {memory.description && (
                        <p className="mt-1.5 line-clamp-2 text-xs leading-5 text-white/30">
                          {memory.description}
                        </p>
                      )}

                      {/* Subtle interaction cue */}

                      <div className="mt-4 flex items-center text-[9px] uppercase tracking-[0.18em] text-white/20 transition group-hover:text-white/45">

                        Open memory

                        <span
                          className="ml-1.5 transition-transform duration-300 group-hover:translate-x-1"
                          aria-hidden="true"
                        >
                          →
                        </span>

                      </div>

                    </div>

                  </button>

                ))}

              </div>

            </section>
          )}


        {/* ===================================================
            FOOTER
        ==================================================== */}

        {!loading &&
          !error &&
          memories.length > 0 && (
            <footer className="mt-10 border-t border-white/[0.07] py-6">

              <div className="flex items-center gap-3">

                <span
                  className="h-px w-7 bg-amber-300/30"
                  aria-hidden="true"
                />

                <p className="text-[11px] text-white/18">
                  Every memory becomes part of your story.
                </p>

              </div>

            </footer>
          )}

      </main>

    </div>
  )
}

export default OverviewPage