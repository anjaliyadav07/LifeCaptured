import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowRight,
  Film,
  MapPin,
  Sparkles
} from 'lucide-react'

import { useAuth } from '../context/AuthContext'
import { getMemoriesByMonth } from '../services/api'

function formatMonth(year, month) {
  return new Date(
    year,
    month - 1,
    1
  ).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric'
  })
}

function formatDay(date) {
  if (!date) {
    return ''
  }

  return new Date(date).toLocaleDateString(
    'en-US',
    {
      day: '2-digit'
    }
  )
}

function formatWeekday(date) {
  if (!date) {
    return ''
  }

  return new Date(date).toLocaleDateString(
    'en-US',
    {
      weekday: 'short'
    }
  )
}

function getImage(memory) {
  if (
    memory.images &&
    memory.images.length > 0
  ) {
    return memory.images[0].imageUrl
  }

  return ''
}

function getInsight(memory) {
  return memory.ai_insight || null
}

function getUniquePlaces(memories) {
  const places = memories
    .map((memory) =>
      memory.location
        ? memory.location.trim()
        : ''
    )
    .filter(Boolean)

  return new Set(places).size
}

function getDominantMood(memories) {
  const moods = memories
    .map((memory) => {
      const insight = getInsight(memory)

      return insight?.mood
        ? insight.mood.trim().toLowerCase()
        : ''
    })
    .filter(Boolean)

  if (moods.length === 0) {
    return null
  }

  const counts = {}

  moods.forEach((mood) => {
    counts[mood] =
      (counts[mood] || 0) + 1
  })

  return Object.entries(counts).sort(
    (a, b) => b[1] - a[1]
  )[0][0]
}

function getThemes(memories) {
  const themes = []

  memories.forEach((memory) => {
    const insight = getInsight(memory)

    if (
      insight &&
      Array.isArray(insight.themes)
    ) {
      insight.themes.forEach((theme) => {
        if (typeof theme === 'string') {
          themes.push(theme)
        }
      })
    }
  })

  const counts = {}

  themes.forEach((theme) => {
    const key = theme.trim().toLowerCase()

    if (key) {
      counts[key] =
        (counts[key] || 0) + 1
    }
  })

  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([theme]) => theme)
}

function getFeaturedMemory(memories) {
  if (memories.length === 0) {
    return null
  }

  const scoreMemory = (memory) => {
    let score = 0

    if (getImage(memory)) {
      score += 5
    }

    if (memory.description) {
      score += 3
    }

    if (memory.location) {
      score += 2
    }

    if (getInsight(memory)) {
      score += 4
    }

    return score
  }

  return [...memories].sort(
    (a, b) =>
      scoreMemory(b) - scoreMemory(a)
  )[0]
}

function Stat({ value, label }) {
  return (
    <div>
      <p className="text-xl font-medium tracking-tight text-white sm:text-2xl">
        {value}
      </p>

      <p className="mt-1 text-[9px] uppercase tracking-[0.28em] text-white/25">
        {label}
      </p>
    </div>
  )
}

function MemoryCard({
  memory,
  featured = false,
  onOpen
}) {
  const image = getImage(memory)

  return (
    <button
      type="button"
      onClick={() => onOpen(memory.id)}
      className="group block w-full overflow-hidden rounded-2xl border border-white/8 bg-[#090909] text-left transition duration-500 hover:-translate-y-1 hover:border-white/15"
    >
      <div
        className={`relative overflow-hidden ${
          featured
            ? 'aspect-16/10'
            : 'aspect-4/3'
        }`}
      >
        {image ? (
          <img
            src={image}
            alt={memory.title || 'Memory'}
            className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.035]"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-white/2">
            <span className="text-[9px] uppercase tracking-[0.3em] text-white/15">
              Memory
            </span>
          </div>
        )}

        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/10 to-transparent" />

        <div className="absolute inset-x-0 bottom-0 p-5">
          <p className="text-[9px] uppercase tracking-[0.24em] text-amber-200/60">
            {formatDay(memory.memory_date)}
            {' · '}
            {formatWeekday(memory.memory_date)}
          </p>

          <h3 className="mt-2 line-clamp-2 text-base font-medium tracking-tight text-white sm:text-lg">
            {memory.title}
          </h3>

          {memory.location && (
            <div className="mt-2 flex items-center gap-1.5 text-[10px] text-white/40">
              <MapPin size={10} />
              <span className="truncate">
                {memory.location}
              </span>
            </div>
          )}
        </div>
      </div>

      {!featured && memory.description && (
        <div className="px-5 py-4">
          <p className="line-clamp-2 text-xs leading-6 text-white/30">
            {memory.description}
          </p>
        </div>
      )}
    </button>
  )
}

function FramesPage() {
  const navigate = useNavigate()
  const { token } = useAuth()

  const today = new Date()

  const [year, setYear] = useState(
    today.getFullYear()
  )

  const [month, setMonth] = useState(
    today.getMonth() + 1
  )

  const [memories, setMemories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const monthName = formatMonth(
    year,
    month
  )

  const isCurrentMonth =
    year === today.getFullYear() &&
    month === today.getMonth() + 1

  useEffect(() => {
    let active = true

    const loadMonth = async () => {
      if (!token) {
        setLoading(false)
        setError('Authentication required')
        return
      }

      setLoading(true)
      setError('')

      try {
        const data =
          await getMemoriesByMonth(
            year,
            month,
            token
          )

        if (!active) {
          return
        }

        setMemories(
          Array.isArray(data.memories)
            ? data.memories
            : []
        )
      } catch (requestError) {
        if (!active) {
          return
        }

        setMemories([])

        setError(
          requestError.message ||
            'We could not load this month.'
        )
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    loadMonth()

    return () => {
      active = false
    }
  }, [year, month, token])

  const featuredMemory = useMemo(
    () => getFeaturedMemory(memories),
    [memories]
  )

  const remainingMemories = useMemo(() => {
    if (!featuredMemory) {
      return memories
    }

    return memories.filter(
      (memory) =>
        memory.id !== featuredMemory.id
    )
  }, [memories, featuredMemory])

  const placeCount = useMemo(
    () => getUniquePlaces(memories),
    [memories]
  )

  const dominantMood = useMemo(
    () => getDominantMood(memories),
    [memories]
  )

  const themes = useMemo(
    () => getThemes(memories),
    [memories]
  )

  const goToPreviousMonth = () => {
    if (month === 1) {
      setYear(
        (currentYear) => currentYear - 1
      )
      setMonth(12)
      return
    }

    setMonth(
      (currentMonth) => currentMonth - 1
    )
  }

  const goToNextMonth = () => {
    if (isCurrentMonth) {
      return
    }

    if (month === 12) {
      setYear(
        (currentYear) => currentYear + 1
      )
      setMonth(1)
      return
    }

    setMonth(
      (currentMonth) => currentMonth + 1
    )
  }

  const openMemory = (memoryId) => {
    navigate(`/app/memories/${memoryId}`)
  }

  return (
    <section className="min-h-full px-6 py-8 sm:px-8 lg:px-12 lg:py-10">

      {/* =====================================================
          TOP BAR
      ====================================================== */}

      <div className="flex items-center justify-between">

        <button
          type="button"
          onClick={() => navigate('/app')}
          className="group inline-flex items-center gap-2 text-xs text-white/30 transition hover:text-white"
        >
          <ArrowLeft
            size={14}
            className="transition-transform duration-300 group-hover:-translate-x-1"
          />

          Overview
        </button>


        <div className="flex items-center gap-2">

          <button
            type="button"
            onClick={goToPreviousMonth}
            disabled={loading}
            aria-label="Previous month"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/8 text-white/30 transition hover:border-white/15 hover:bg-white/5 hover:text-white disabled:opacity-30"
          >
            <ArrowLeft size={15} />
          </button>

          <button
            type="button"
            onClick={goToNextMonth}
            disabled={
              loading || isCurrentMonth
            }
            aria-label="Next month"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/8 text-white/30 transition hover:border-white/15 hover:bg-white/5 hover:text-white disabled:opacity-20"
          >
            <ArrowRight size={15} />
          </button>

        </div>

      </div>


      {/* =====================================================
          LOADING
      ====================================================== */}

      {loading && (
        <div className="mt-14 animate-pulse">

          <div className="h-3 w-20 rounded-full bg-white/5" />

          <div className="mt-6 h-20 w-72 rounded-2xl bg-white/5 sm:w-96" />

          <div className="mt-4 h-4 w-20 rounded-full bg-white/5" />

          <div className="mt-12 aspect-16/7 rounded-3xl bg-white/3" />

          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            {[1, 2, 3, 4].map(
              (item) => (
                <div
                  key={item}
                  className="overflow-hidden rounded-2xl border border-white/8"
                >
                  <div className="aspect-4/3 bg-white/3" />

                  <div className="space-y-3 p-5">
                    <div className="h-2 w-20 rounded-full bg-white/5" />

                    <div className="h-5 w-3/4 rounded-full bg-white/5" />
                  </div>
                </div>
              )
            )}
          </div>

        </div>
      )}


      {/* =====================================================
          ERROR
      ====================================================== */}

      {!loading && error && (
        <div
          role="alert"
          className="mt-10 rounded-2xl border border-red-400/15 bg-red-400/3 px-5 py-4 text-sm text-red-300"
        >
          {error}
        </div>
      )}


      {/* =====================================================
          EMPTY MONTH
      ====================================================== */}

      {!loading &&
        !error &&
        memories.length === 0 && (
          <div className="flex min-h-[72vh] items-center justify-center">

            <div className="max-w-xl text-center">

              <p className="text-[10px] font-medium uppercase tracking-[0.4em] text-amber-200/55">
                Frames
              </p>

              <h1 className="mt-6 text-5xl font-medium tracking-[-0.045em] text-white sm:text-7xl">
                {monthName}
              </h1>

              <p className="mx-auto mt-6 max-w-md text-sm leading-7 text-white/30">
                Nothing has been captured here yet.
                Start with one moment and let this
                month take shape.
              </p>

              <button
                type="button"
                onClick={() =>
                  navigate('/app/create-memory')
                }
                className="mt-8 rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition hover:bg-white/90"
              >
                Capture a memory
              </button>

            </div>

          </div>
        )}


      {/* =====================================================
          FRAMES
      ====================================================== */}

      {!loading &&
        !error &&
        memories.length > 0 && (
          <div className="mt-12">

            {/* HEADER */}

            <header className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">

              <div>

                <p className="text-[10px] font-medium uppercase tracking-[0.4em] text-amber-200/60">
                  Frames
                </p>

                <h1 className="mt-5 text-7xl font-medium leading-[0.82] tracking-[-0.07em] text-white sm:text-8xl">
                  {new Date(
                    year,
                    month - 1,
                    1
                  ).toLocaleString(
                    'en-US',
                    {
                      month: 'long'
                    }
                  )}
                </h1>

                <p className="mt-5 text-xl tracking-tight text-white/25 sm:text-2xl">
                  {year}
                </p>

              </div>


              <div className="grid grid-cols-3 gap-7 border-t border-white/8 pt-5 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">

                <Stat
                  value={memories.length}
                  label="Moments"
                />

                <Stat
                  value={placeCount}
                  label="Places"
                />

                <Stat
                  value={
                    dominantMood || '—'
                  }
                  label="Mood"
                />

              </div>

            </header>


            {/* FEATURED MEMORY */}

            {featuredMemory && (
              <button
                type="button"
                onClick={() =>
                  openMemory(
                    featuredMemory.id
                  )
                }
                className="group relative mt-12 block w-full overflow-hidden rounded-3xl border border-white/10 bg-[#090909] text-left transition duration-500 hover:border-white/15 sm:mt-14"
              >

                <div className="relative aspect-16/8 min-h-90 overflow-hidden sm:min-h-115">

                  {getImage(featuredMemory) ? (
                    <img
                      src={getImage(
                        featuredMemory
                      )}
                      alt={
                        featuredMemory.title ||
                        'Featured memory'
                      }
                      className="h-full w-full object-cover transition duration-1400 group-hover:scale-[1.025]"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-white/2">
                      <span className="text-[10px] uppercase tracking-[0.3em] text-white/15">
                        No photograph
                      </span>
                    </div>
                  )}

                  <div className="absolute inset-0 bg-linear-to-t from-black via-black/25 to-transparent" />

                  <div className="absolute inset-x-0 top-0 flex items-center justify-between p-6 sm:p-8">

                    <span className="text-[9px] font-medium uppercase tracking-[0.35em] text-white/45">
                      Featured moment
                    </span>

                    <span className="text-[9px] uppercase tracking-[0.3em] text-white/35">
                      {formatDay(
                        featuredMemory.memory_date
                      )}
                      {' / '}
                      {new Date(
                        year,
                        month - 1,
                        1
                      )
                        .toLocaleString(
                          'en-US',
                          {
                            month: 'short'
                          }
                        )
                        .toUpperCase()}
                    </span>

                  </div>


                  <div className="absolute inset-x-0 bottom-0 p-7 sm:p-10 lg:p-12">

                    <div className="max-w-3xl">

                      <p className="text-[10px] uppercase tracking-[0.3em] text-amber-200/70">
                        {formatWeekday(
                          featuredMemory.memory_date
                        )}
                        {' · '}
                        {formatDay(
                          featuredMemory.memory_date
                        )}
                      </p>

                      <h2 className="mt-4 text-3xl font-medium tracking-tight text-white sm:text-5xl">
                        {featuredMemory.title}
                      </h2>

                      {featuredMemory.description && (
                        <p className="mt-4 max-w-2xl text-sm leading-7 text-white/55 sm:text-base">
                          {featuredMemory.description}
                        </p>
                      )}

                      {featuredMemory.location && (
                        <div className="mt-6 flex items-center gap-2 text-xs text-white/40">
                          <MapPin size={12} />
                          {featuredMemory.location}
                        </div>
                      )}

                    </div>

                  </div>

                </div>

              </button>
            )}


            {/* MONTH RHYTHM */}

            <section className="mt-12 border-y border-white/8 py-7 sm:mt-14 sm:py-8">

              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

                <div className="flex items-center gap-3">

                  <span className="text-amber-200/60">
                    <Sparkles size={15} />
                  </span>

                  <div>

                    <p className="text-[9px] uppercase tracking-[0.35em] text-white/25">
                      The rhythm of {new Date(
                        year,
                        month - 1,
                        1
                      ).toLocaleString(
                        'en-US',
                        {
                          month: 'long'
                        }
                      )}
                    </p>

                    <p className="mt-1 text-sm text-white/50">
                      {memories.length}{' '}
                      {memories.length === 1
                        ? 'moment'
                        : 'moments'}{' '}
                      across {placeCount}{' '}
                      {placeCount === 1
                        ? 'place'
                        : 'places'}
                    </p>

                  </div>

                </div>


                <div className="flex flex-wrap items-center gap-x-5 gap-y-3">

                  {memories.map(
                    (memory, index) => (
                      <button
                        key={memory.id}
                        type="button"
                        onClick={() =>
                          openMemory(
                            memory.id
                          )
                        }
                        className="group flex items-center gap-2"
                      >

                        <span className="text-[9px] tabular-nums text-white/25 transition group-hover:text-amber-200/70">
                          {String(
                            index + 1
                          ).padStart(2, '0')}
                        </span>

                        <span className="h-1 w-1 rounded-full bg-white/15 transition group-hover:bg-amber-200/70" />

                        <span className="text-[10px] uppercase tracking-[0.18em] text-white/35 transition group-hover:text-white/70">
                          {formatDay(
                            memory.memory_date
                          )}
                        </span>

                      </button>
                    )
                  )}

                </div>

              </div>

            </section>


            {/* THEMES */}

            {themes.length > 0 && (
              <section className="mt-14">

                <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

                  <div>

                    <p className="text-[9px] font-medium uppercase tracking-[0.35em] text-white/25">
                      Recurring themes
                    </p>

                    <h2 className="mt-3 text-2xl font-medium tracking-tight text-white sm:text-3xl">
                      A few things from this month.
                    </h2>

                  </div>


                  <div className="flex flex-wrap gap-2">

                    {themes.map(
                      (theme) => (
                        <span
                          key={theme}
                          className="rounded-full border border-white/8 bg-white/2 px-4 py-2 text-[11px] capitalize text-white/45"
                        >
                          {theme}
                        </span>
                      )
                    )}

                  </div>

                </div>

              </section>
            )}


            {/* VISUAL ARCHIVE */}

            {remainingMemories.length > 0 && (
              <section className="mt-16">

                <div className="flex items-end justify-between">

                  <div>

                    <p className="text-[9px] font-medium uppercase tracking-[0.35em] text-white/25">
                      Your visual archive
                    </p>

                    <h2 className="mt-3 text-2xl font-medium tracking-tight text-white sm:text-3xl">
                      Moments worth keeping.
                    </h2>

                  </div>

                  <p className="hidden text-[10px] uppercase tracking-[0.25em] text-white/20 sm:block">
                    {remainingMemories.length}{' '}
                    more
                  </p>

                </div>


                <div className="mt-8 grid gap-5 lg:grid-cols-2">

                  {remainingMemories.map(
                    (memory, index) => (
                      <MemoryCard
                        key={memory.id}
                        memory={memory}
                        onOpen={openMemory}
                        featured={
                          index === 0
                        }
                      />
                    )
                  )}

                </div>

              </section>
            )}


            {/* STORY CTA */}

            <section className="relative mt-20 overflow-hidden rounded-3xl border border-white/10 bg-[#080808] px-6 py-16 text-center sm:px-10 sm:py-20">

              <div
                className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-300/2.5 blur-[100px]"
                aria-hidden="true"
              />

              <div className="relative">

                <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/3 text-white/50">
                  <Film size={18} />
                </div>

                <p className="mt-6 text-[9px] font-medium uppercase tracking-[0.35em] text-amber-200/55">
                  Your month, remembered
                </p>

                <h2 className="mx-auto mt-4 max-w-xl text-3xl font-medium leading-tight tracking-[-0.035em] text-white sm:text-5xl">
                  Seen as a month.
                  <span className="block text-white/30">
                    Remembered as a story.
                  </span>
                </h2>

                <p className="mx-auto mt-5 max-w-md text-sm leading-7 text-white/30">
                  Bring these moments together into
                  a cinematic story made from your
                  real memories.
                </p>

                <button
                  type="button"
                  onClick={() =>
                    navigate('/app/stories')
                  }
                  className="mt-8 inline-flex items-center gap-3 rounded-full bg-white px-7 py-3.5 text-sm font-medium text-black transition duration-300 hover:scale-[1.02] hover:bg-white/90 active:scale-[0.99]"
                >
                  Create Story
                  <ArrowRight size={15} />
                </button>

              </div>

            </section>


            {/* QUIET END */}

            <footer className="py-16 text-center sm:py-20">

              <p className="text-[9px] uppercase tracking-[0.4em] text-white/15">
                {monthName}
              </p>

              <p className="mt-4 text-xs text-white/20">
                {memories.length}{' '}
                {memories.length === 1
                  ? 'moment'
                  : 'moments'}{' '}
                captured.
              </p>

            </footer>

          </div>
        )}

    </section>
  )
}

export default FramesPage