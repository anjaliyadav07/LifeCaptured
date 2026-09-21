import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getMemories } from '../services/api'

function getMemoryDate(memory) {
  return (
    memory.memoryDate ||
    memory.memory_date ||
    memory.date ||
    memory.createdAt ||
    memory.created_at ||
    null
  )
}

function parseMemoryDate(memory) {
  const value = getMemoryDate(memory)

  if (!value) {
    return null
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return null
  }

  return date
}

function formatDate(memory) {
  const date = parseMemoryDate(memory)

  if (!date) {
    return 'Date not available'
  }

  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  })
}

function getYear(memory) {
  const date = parseMemoryDate(memory)

  if (!date) {
    return 'Other'
  }

  return String(date.getFullYear())
}

function getMonth(memory) {
  const date = parseMemoryDate(memory)

  if (!date) {
    return 'Other'
  }

  return date.toLocaleDateString('en-US', {
    month: 'long'
  })
}

function TimelineMemory({ memory }) {
  const navigate = useNavigate()

  const image = memory.images?.[0]?.imageUrl

  return (
    <article
      onClick={() => navigate(`/app/memories/${memory.id}`)}
      className="group relative cursor-pointer"
    >
      {/* TIMELINE DOT */}
      <div className="absolute -left-1.75 top-6 h-3.5 w-3.5 rounded-full border-2 border-black bg-amber-300 ring-4 ring-black transition duration-300 group-hover:scale-125" />

      {/* MEMORY CARD */}
      <div className="ml-8 grid gap-5 rounded-2xl border border-white/10 bg-white/2 p-4 transition duration-500 hover:border-white/20 hover:bg-white/4 sm:grid-cols-[180px_1fr] sm:p-5">

        {/* IMAGE */}
        <div className="aspect-4/3 overflow-hidden rounded-xl bg-white/3">
          {image ? (
            <img
              src={image}
              alt={memory.title || 'Memory'}
              className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center">
              <p className="text-[9px] uppercase tracking-[0.3em] text-white/20">
                Memory
              </p>

              <p className="mt-2 text-xs text-white/20">
                No photo
              </p>
            </div>
          )}
        </div>

        {/* CONTENT */}
        <div className="flex min-w-0 flex-col justify-center py-1">

          <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-amber-300/70">
            {formatDate(memory)}
          </p>

          <h3 className="mt-3 truncate text-xl font-medium tracking-tight text-white">
            {memory.title || 'Untitled memory'}
          </h3>

          {memory.location && (
            <p className="mt-2 truncate text-xs text-white/40">
              ◇ {memory.location}
            </p>
          )}

          {memory.description && (
            <p className="mt-3 line-clamp-2 max-w-xl text-sm leading-6 text-white/35">
              {memory.description}
            </p>
          )}

          <div className="mt-5">
            <span className="text-xs text-white/35 transition group-hover:text-white/70">
              View memory →
            </span>
          </div>

        </div>
      </div>
    </article>
  )
}

function TimelinePage() {
  const [memories, setMemories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadMemories = async () => {
      try {
        setLoading(true)
        setError('')

        const token = localStorage.getItem('lifecaptured_token')

        if (!token) {
          throw new Error('Authentication required')
        }

        const data = await getMemories(token)

        const loadedMemories = Array.isArray(data.memories)
          ? data.memories
          : []

        const sortedMemories = [...loadedMemories].sort((a, b) => {
          const dateA = parseMemoryDate(a)
          const dateB = parseMemoryDate(b)

          if (!dateA && !dateB) {
            return 0
          }

          if (!dateA) {
            return 1
          }

          if (!dateB) {
            return -1
          }

          return dateB.getTime() - dateA.getTime()
        })

        setMemories(sortedMemories)
      } catch (error) {
        console.error('Timeline error:', error)
        setError(error.message || 'Unable to load your timeline')
      } finally {
        setLoading(false)
      }
    }

    loadMemories()
  }, [])

  const groupedMemories = useMemo(() => {
    const groups = {}

    memories.forEach((memory) => {
      const year = getYear(memory)
      const month = getMonth(memory)

      if (!groups[year]) {
        groups[year] = {}
      }

      if (!groups[year][month]) {
        groups[year][month] = []
      }

      groups[year][month].push(memory)
    })

    return groups
  }, [memories])

  const years = Object.keys(groupedMemories).sort((a, b) => {
    if (a === 'Other') return 1
    if (b === 'Other') return -1

    return Number(b) - Number(a)
  })

  return (
    <section className="px-6 py-10 sm:px-8 lg:px-12 lg:py-12">

      {/* HEADER */}
      <div>
        <p className="text-[10px] uppercase tracking-[0.3em] text-white/30">
          Your story
        </p>

        <h1 className="mt-3 text-3xl font-medium tracking-tight text-white sm:text-4xl">
          Timeline
        </h1>

        <p className="mt-3 text-sm text-white/35">
          Every memory, placed in the story of your life.
        </p>
      </div>

      {/* ERROR */}
      {error && (
        <div className="mt-10 rounded-2xl border border-red-400/20 bg-red-400/5 px-5 py-4 text-sm text-red-300">
          {error}
        </div>
      )}

      {/* LOADING */}
      {loading && (
        <div className="mt-14">

          <div className="h-5 w-20 animate-pulse rounded bg-white/5" />

          <div className="mt-8 space-y-5 border-l border-white/10">

            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="ml-8 h-40 animate-pulse rounded-2xl border border-white/5 bg-white/2"
              />
            ))}

          </div>
        </div>
      )}

      {/* EMPTY */}
      {!loading && !error && memories.length === 0 && (
        <div className="mt-14 rounded-3xl border border-white/10 px-8 py-20 text-center">

          <p className="text-[10px] uppercase tracking-[0.3em] text-amber-300/70">
            Your story begins here
          </p>

          <h2 className="mt-4 text-2xl font-medium text-white">
            Nothing on your timeline yet.
          </h2>

          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-white/35">
            Capture your first memory and it will appear here.
          </p>

          <button
            type="button"
            onClick={() => navigate('/app/create-memory')}
            className="mt-7 rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition hover:bg-white/90"
          >
            Create a memory →
          </button>

        </div>
      )}

      {/* TIMELINE */}
      {!loading && !error && memories.length > 0 && (
        <div className="mt-14">

          {years.map((year) => (
            <section
              key={year}
              className="mb-16 last:mb-0"
            >

              {/* YEAR */}
              <div className="flex items-center gap-5">

                <h2 className="text-sm font-medium tracking-[0.2em] text-white/70">
                  {year}
                </h2>

                <div className="h-px flex-1 bg-white/8" />

              </div>

              {/* MONTHS */}
              <div className="mt-8 space-y-12">

                {Object.entries(groupedMemories[year]).map(
                  ([month, monthMemories]) => (
                    <div key={month}>

                      {/* MONTH */}
                      <div className="mb-5 flex items-center gap-4">

                        <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-amber-300/65">
                          {month}
                        </p>

                        <div className="h-px w-8 bg-white/10" />

                      </div>

                      {/* MEMORY LIST */}
                      <div className="space-y-5 border-l border-white/10">

                        {monthMemories.map((memory) => (
                          <TimelineMemory
                            key={memory.id}
                            memory={memory}
                          />
                        ))}

                      </div>

                    </div>
                  )
                )}

              </div>

            </section>
          ))}

        </div>
      )}

    </section>
  )
}

export default TimelinePage