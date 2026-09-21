import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowRight,
  Clapperboard,
  Film,
  MapPin,
  Sparkles
} from 'lucide-react'

import { useAuth } from '../context/AuthContext'
import {
  generateStory,
  getMemoriesByMonth
} from '../services/api'

const API_BASE_URL = 'http://localhost:5000'

function formatMonth(year, month) {
  return new Date(
    year,
    month - 1,
    1
  ).toLocaleString('en-US', {
    month: 'long'
  })
}

function formatDate(date) {
  if (!date) {
    return ''
  }

  return new Date(date).toLocaleDateString(
    'en-US',
    {
      day: '2-digit',
      month: 'short'
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

function MemoryRow({
  memory,
  index
}) {
  const image = getImage(memory)

  return (
    <div className="group flex items-center gap-4 border-t border-white/8 py-4 first:border-t-0">

      {/* NUMBER */}

      <span className="w-6 shrink-0 text-[9px] tabular-nums text-white/20">
        {String(index + 1).padStart(2, '0')}
      </span>


      {/* IMAGE */}

      <div className="h-14 w-20 shrink-0 overflow-hidden rounded-lg border border-white/8 bg-white/2 sm:h-16 sm:w-24">

        {image ? (
          <img
            src={image}
            alt=""
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Clapperboard
              size={14}
              className="text-white/15"
            />
          </div>
        )}

      </div>


      {/* DETAILS */}

      <div className="min-w-0 flex-1">

        <p className="truncate text-sm font-medium text-white/75 transition group-hover:text-white">
          {memory.title || 'Untitled memory'}
        </p>

        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-white/25">

          <span>
            {formatDate(
              memory.memory_date
            )}
          </span>

          {memory.location && (
            <span className="flex min-w-0 items-center gap-1">
              <MapPin size={9} />
              <span className="truncate">
                {memory.location}
              </span>
            </span>
          )}

        </div>

      </div>

    </div>
  )
}

function StoriesPage() {
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

  const [loadingMemories, setLoadingMemories] =
    useState(true)

  const [generating, setGenerating] =
    useState(false)

  const [error, setError] = useState('')

  const [story, setStory] = useState(null)


  const monthName = formatMonth(
    year,
    month
  )


  const isCurrentMonth =
    year === today.getFullYear() &&
    month === today.getMonth() + 1


  const placeCount = useMemo(
    () => getUniquePlaces(memories),
    [memories]
  )


  /*
   * Load the memories belonging to
   * the selected month.
   */

  useEffect(() => {
    let active = true

    const loadMemories = async () => {
      if (!token) {
        setLoadingMemories(false)
        setError(
          'Authentication required'
        )
        return
      }

      setLoadingMemories(true)
      setError('')
      setStory(null)

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

        console.error(requestError)

        setMemories([])

        setError(
          requestError.message ||
            'We could not load this month.'
        )
      } finally {
        if (active) {
          setLoadingMemories(false)
        }
      }
    }

    loadMemories()

    return () => {
      active = false
    }
  }, [year, month, token])


  const goToPreviousMonth = () => {
    if (month === 1) {
      setYear(
        (currentYear) =>
          currentYear - 1
      )

      setMonth(12)

      return
    }

    setMonth(
      (currentMonth) =>
        currentMonth - 1
    )
  }


  const goToNextMonth = () => {
    if (isCurrentMonth) {
      return
    }

    if (month === 12) {
      setYear(
        (currentYear) =>
          currentYear + 1
      )

      setMonth(1)

      return
    }

    setMonth(
      (currentMonth) =>
        currentMonth + 1
    )
  }


  const handleGenerate = async () => {
    if (memories.length === 0) {
      return
    }

    try {
      setGenerating(true)
      setError('')
      setStory(null)

      const response =
        await generateStory(
          year,
          month,
          token
        )

      setStory(response.story)

      window.setTimeout(() => {
        document
          .getElementById(
            'generated-story'
          )
          ?.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          })
      }, 100)
    } catch (requestError) {
      console.error(requestError)

      setError(
        requestError.message ||
          'We could not create your story.'
      )
    } finally {
      setGenerating(false)
    }
  }


  return (
    <main className="min-h-full bg-[#080808] text-white">

      <div className="mx-auto max-w-6xl px-6 py-8 sm:px-8 lg:px-10 lg:py-10">


        {/* =====================================================
            TOP NAVIGATION
        ====================================================== */}

        <div className="flex items-center justify-between">

          <button
            type="button"
            onClick={() =>
              navigate('/app/frames')
            }
            className="group inline-flex items-center gap-2 text-xs text-white/35 transition hover:text-white"
          >
            <ArrowLeft
              size={14}
              className="transition-transform duration-300 group-hover:-translate-x-1"
            />

            Back to Frames
          </button>


          <div className="flex items-center gap-2">

            <button
              type="button"
              onClick={
                goToPreviousMonth
              }
              disabled={
                loadingMemories ||
                generating
              }
              aria-label="Previous month"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/8 text-white/30 transition hover:border-white/15 hover:bg-white/5 hover:text-white disabled:opacity-30"
            >
              <ArrowLeft size={14} />
            </button>

            <button
              type="button"
              onClick={
                goToNextMonth
              }
              disabled={
                loadingMemories ||
                generating ||
                isCurrentMonth
              }
              aria-label="Next month"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/8 text-white/30 transition hover:border-white/15 hover:bg-white/5 hover:text-white disabled:opacity-20"
            >
              <ArrowRight size={14} />
            </button>

          </div>

        </div>


        {/* =====================================================
            HEADER
        ====================================================== */}

        <section className="mt-14 max-w-4xl sm:mt-16">

          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.035] px-4 py-2 text-[10px] uppercase tracking-[0.25em] text-white/55">

            <Sparkles
              size={13}
              className="text-amber-200/70"
            />

            Stories

          </div>


          <h1 className="mt-7 text-5xl font-medium leading-[0.95] tracking-tighter text-white sm:text-6xl lg:text-7xl">

            Turn a month of memories

            <span className="block text-white/30">
              into something you can relive.
            </span>

          </h1>


          <p className="mt-6 max-w-2xl text-sm leading-7 text-white/40 sm:text-base">
            LifeCaptured brings the photographs
            from a month together into a cinematic
            story made from your real memories.
          </p>

        </section>


        {/* =====================================================
            SELECTED MONTH
        ====================================================== */}

        <section className="mt-12 flex flex-col gap-6 border-y border-white/8 py-7 sm:mt-14 sm:flex-row sm:items-end sm:justify-between">

          <div>

            <p className="text-[9px] uppercase tracking-[0.35em] text-amber-200/55">
              Your selected month
            </p>

            <h2 className="mt-2 text-3xl font-medium tracking-tight text-white sm:text-4xl">
              {monthName}
            </h2>

            {!loadingMemories && (
              <p className="mt-2 text-xs text-white/25">
                {memories.length}{' '}
                {memories.length === 1
                  ? 'moment'
                  : 'moments'}{' '}
                {placeCount > 0 &&
                  `· ${placeCount} ${
                    placeCount === 1
                      ? 'place'
                      : 'places'
                  }`}
              </p>
            )}

          </div>


          <div className="flex items-center gap-3">

            <span className="text-[9px] uppercase tracking-[0.25em] text-white/20">
              Choose another month
            </span>

            <div className="flex items-center gap-2">

              <button
                type="button"
                onClick={
                  goToPreviousMonth
                }
                disabled={
                  loadingMemories ||
                  generating
                }
                aria-label="Previous month"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-white/8 text-white/30 transition hover:border-white/15 hover:text-white disabled:opacity-30"
              >
                <ArrowLeft size={13} />
              </button>

              <button
                type="button"
                onClick={
                  goToNextMonth
                }
                disabled={
                  loadingMemories ||
                  generating ||
                  isCurrentMonth
                }
                aria-label="Next month"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-white/8 text-white/30 transition hover:border-white/15 hover:text-white disabled:opacity-20"
              >
                <ArrowRight size={13} />
              </button>

            </div>

          </div>

        </section>


        {/* =====================================================
            LOADING
        ====================================================== */}

        {loadingMemories && (
          <section className="mt-10 animate-pulse rounded-3xl border border-white/10 bg-white/2 p-6 sm:p-8">

            <div className="h-3 w-32 rounded-full bg-white/5" />

            <div className="mt-7 space-y-4">

              {[1, 2, 3].map(
                (item) => (
                  <div
                    key={item}
                    className="flex items-center gap-4 border-t border-white/5 pt-4"
                  >
                    <div className="h-14 w-20 rounded-lg bg-white/5" />

                    <div className="flex-1 space-y-3">
                      <div className="h-3 w-2/5 rounded-full bg-white/5" />
                      <div className="h-2 w-1/4 rounded-full bg-white/5" />
                    </div>
                  </div>
                )
              )}

            </div>

          </section>
        )}


        {/* =====================================================
            ERROR
        ====================================================== */}

        {!loadingMemories &&
          error && (
            <div
              role="alert"
              className="mt-10 rounded-2xl border border-red-400/15 bg-red-400/3 px-5 py-4 text-sm text-red-300"
            >
              {error}
            </div>
          )}


        {/* =====================================================
            NO MEMORIES
        ====================================================== */}

        {!loadingMemories &&
          !error &&
          memories.length === 0 && (
            <section className="mt-10 flex min-h-105 items-center justify-center rounded-3xl border border-white/10 bg-white/2 px-6 text-center">

              <div className="max-w-md">

                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/3 text-white/25">
                  <Film size={18} />
                </div>

                <p className="mt-6 text-[9px] uppercase tracking-[0.35em] text-amber-200/50">
                  No moments yet
                </p>

                <h2 className="mt-3 text-2xl font-medium tracking-tight text-white">
                  This month is still waiting.
                </h2>

                <p className="mt-4 text-sm leading-7 text-white/30">
                  Capture a memory first. Once
                  this month has moments, you can
                  turn them into a Story here.
                </p>

                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      '/app/create-memory'
                    )
                  }
                  className="mt-7 rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition hover:bg-white/90"
                >
                  Capture a memory
                </button>

              </div>

            </section>
          )}


        {/* =====================================================
            STORY BUILDER
        ====================================================== */}

        {!loadingMemories &&
          !error &&
          memories.length > 0 && (
            <section className="mt-10 overflow-hidden rounded-3xl border border-white/10 bg-[#0a0a0a]">

              {/* BUILDER HEADER */}

              <div className="border-b border-white/8 px-6 py-6 sm:px-8">

                <div className="flex items-start gap-4">

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/[0.07] text-white/70">
                    <Clapperboard size={19} />
                  </div>

                  <div>

                    <p className="text-sm font-medium text-white">
                      This Story will include
                    </p>

                    <p className="mt-1 text-xs leading-5 text-white/30">
                      Your memories from{' '}
                      {monthName}.
                    </p>

                  </div>

                </div>

              </div>


              {/* MEMORY LIST */}

              <div className="px-6 sm:px-8">

                {memories.map(
                  (memory, index) => (
                    <MemoryRow
                      key={memory.id}
                      memory={memory}
                      index={index}
                    />
                  )
                )}

              </div>


              {/* CREATE ACTION */}

              <div className="border-t border-white/8 px-6 py-6 sm:px-8">

                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

                  <div>

                    <p className="text-sm text-white/55">
                      Ready to relive{' '}
                      <span className="text-white/80">
                        {monthName}
                      </span>
                      ?
                    </p>

                    <p className="mt-1 text-xs text-white/25">
                      Cinematic transitions,
                      movement, dates and
                      memory titles included.
                    </p>

                  </div>


                  <button
                    type="button"
                    onClick={
                      handleGenerate
                    }
                    disabled={generating}
                    className="inline-flex shrink-0 items-center justify-center gap-3 rounded-full bg-white px-7 py-3.5 text-sm font-medium text-black transition duration-300 hover:scale-[1.02] hover:bg-white/90 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
                  >

                    <Clapperboard
                      size={16}
                    />

                    {generating
                      ? 'Crafting your story...'
                      : 'Create Story'}

                    {!generating && (
                      <ArrowRight
                        size={15}
                      />
                    )}

                  </button>

                </div>

              </div>

            </section>
          )}


        {/* =====================================================
            GENERATING STATE
        ====================================================== */}

        {generating && (
          <section className="mt-8 overflow-hidden rounded-3xl border border-white/10 bg-[#080808] px-6 py-14 text-center sm:px-10 sm:py-20">

            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-amber-200/10 bg-amber-200/3 text-amber-200/60">

              <Sparkles
                size={18}
                className="animate-pulse"
              />

            </div>

            <p className="mt-6 text-[9px] uppercase tracking-[0.35em] text-amber-200/55">
              Creating your story
            </p>

            <h2 className="mt-3 text-2xl font-medium tracking-tight text-white sm:text-3xl">
              Crafting {monthName}.
            </h2>

            <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-white/30">
              Your photographs are being arranged
              into a cinematic sequence. This may
              take a moment.
            </p>

          </section>
        )}


        {/* =====================================================
            GENERATED STORY
        ====================================================== */}

        {story && !generating && (
          <section
            id="generated-story"
            className="mt-12 scroll-mt-8"
          >

            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">

              <div>

                <p className="text-[9px] uppercase tracking-[0.35em] text-amber-200/55">
                  Your Story
                </p>

                <h2 className="mt-3 text-3xl font-medium tracking-tight text-white sm:text-4xl">
                  {monthName}
                </h2>

                <p className="mt-2 text-sm text-white/30">
                  {story.imageCount}{' '}
                  {story.imageCount === 1
                    ? 'moment'
                    : 'moments'}{' '}
                  brought together.
                </p>

              </div>

              <button
                type="button"
                onClick={() =>
                  navigate('/app/frames')
                }
                className="inline-flex items-center gap-2 text-xs text-white/35 transition hover:text-white"
              >
                <ArrowLeft size={13} />
                Back to Frames
              </button>

            </div>


            <div className="overflow-hidden rounded-3xl border border-white/10 bg-black shadow-[0_30px_100px_rgba(0,0,0,0.45)]">

              <video
                controls
                playsInline
                preload="metadata"
                className="aspect-video w-full bg-black"
                src={`${API_BASE_URL}${story.videoUrl}`}
              />

            </div>


            <div className="flex flex-col gap-4 border-b border-white/8 py-7 sm:flex-row sm:items-center sm:justify-between">

              <div>

                <p className="text-sm font-medium text-white/70">
                  {monthName}, remembered.
                </p>

                <p className="mt-1 text-xs text-white/25">
                  Your moments. Your story.
                </p>

              </div>


              <button
                type="button"
                onClick={handleGenerate}
                disabled={generating}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 px-5 py-2.5 text-xs font-medium text-white/60 transition hover:border-white/20 hover:bg-white/5 hover:text-white disabled:opacity-40"
              >
                <Clapperboard size={13} />
                Create Again
              </button>

            </div>

          </section>
        )}


        {/* =====================================================
            FOOTER
        ====================================================== */}

        <footer className="py-14 text-center">

          <p className="text-[9px] uppercase tracking-[0.4em] text-white/15">
            LifeCaptured Stories
          </p>

          <p className="mt-3 text-xs text-white/20">
            Your moments. Your story.
          </p>

        </footer>

      </div>

    </main>
  )
}

export default StoriesPage