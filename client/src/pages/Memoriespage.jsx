import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Image as ImageIcon,
  Plus,
  Search,
  MapPin,
  CalendarDays,
  ArrowUpRight,
  X
} from 'lucide-react'

import { getMemories } from '../services/api'
import { useAuth } from '../context/AuthContext'

function formatMemoryDate(date) {
  if (!date) {
    return ''
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(new Date(date))
}

function getMemoryImage(memory) {
  return memory?.images?.[0]?.imageUrl || ''
}

function EmptyMemoryVisual() {
  return (
    <div className="flex h-full items-center justify-center bg-white/[0.018]">
      <div className="text-center">
        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full border border-white/10">
          <ImageIcon
            size={17}
            strokeWidth={1.4}
            className="text-white/20"
          />
        </div>

        <p className="mt-3 text-[8px] uppercase tracking-[0.28em] text-white/15">
          Memory
        </p>

        <p className="mt-1 text-[10px] text-white/20">
          No photograph
        </p>
      </div>
    </div>
  )
}

function MemoryCard({ memory, onOpen }) {
  const image = getMemoryImage(memory)

  return (
    <button
      type="button"
      onClick={() => onOpen(memory.id)}
      className="group w-full overflow-hidden rounded-3xl border border-white/8 bg-white/[0.018] text-left transition duration-500 hover:-translate-y-1 hover:border-white/15 hover:bg-white/2.5"
    >
      {/* IMAGE */}
      <div className="relative aspect-4/3 overflow-hidden bg-white/[0.018]">
        {image ? (
          <img
            src={image}
            alt={memory.title || 'Memory'}
            className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.035]"
          />
        ) : (
          <EmptyMemoryVisual />
        )}

        <div
          className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/55 via-transparent to-transparent"
          aria-hidden="true"
        />

        <div className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-black/25 text-white/40 backdrop-blur-sm transition duration-300 group-hover:border-white/20 group-hover:text-white/80">
          <ArrowUpRight
            size={14}
            strokeWidth={1.5}
          />
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-5 sm:p-6">
        <div className="flex items-center gap-2 text-[9px] uppercase tracking-[0.24em] text-amber-300/55">
          <CalendarDays size={11} strokeWidth={1.5} />

          <span>
            {formatMemoryDate(memory.memory_date)}
          </span>
        </div>

        <h2 className="mt-3 truncate text-lg font-medium tracking-[-0.02em] text-white/90">
          {memory.title || 'Untitled memory'}
        </h2>

        {memory.location && (
          <div className="mt-2.5 flex items-center gap-1.5 text-xs text-white/25">
            <MapPin
              size={12}
              strokeWidth={1.5}
            />

            <span className="truncate">
              {memory.location}
            </span>
          </div>
        )}

        {memory.description && (
          <p className="mt-3 line-clamp-2 text-xs leading-5 text-white/30">
            {memory.description}
          </p>
        )}
      </div>
    </button>
  )
}

function LoadingCard() {
  return (
    <div className="overflow-hidden rounded-3xl border border-white/8 bg-white/[0.018]">
      <div className="aspect-4/3 animate-pulse bg-white/[0.035]" />

      <div className="space-y-3 p-5 sm:p-6">
        <div className="h-2.5 w-24 animate-pulse rounded-full bg-white/6" />
        <div className="h-5 w-3/4 animate-pulse rounded-full bg-white/6" />
        <div className="h-3 w-1/2 animate-pulse rounded-full bg-white/4" />
      </div>
    </div>
  )
}

function MemoriesPage() {
  const navigate = useNavigate()
  const { token } = useAuth()

  const [memories, setMemories] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    const loadMemories = async () => {
      try {
        setLoading(true)
        setError('')

        if (!token) {
          throw new Error('Authentication required')
        }

        const data = await getMemories(token)

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

        setError(
          requestError.message ||
            'We could not open your memories.'
        )
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    loadMemories()

    return () => {
      active = false
    }
  }, [token])

  const filteredMemories = useMemo(() => {
    const query = searchQuery
      .trim()
      .toLowerCase()

    if (!query) {
      return memories
    }

    return memories.filter((memory) => {
      const searchableText = [
        memory.title,
        memory.description,
        memory.location,
        memory.memory_date
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()

      return searchableText.includes(query)
    })
  }, [memories, searchQuery])

  const openMemory = (memoryId) => {
    navigate(`/app/memories/${memoryId}`)
  }

  const clearSearch = () => {
    setSearchQuery('')
  }

  return (
    <div className="min-h-full bg-black text-white">
      {/* HEADER */}
      <header className="border-b border-white/[0.07]">
        <div className="mx-auto flex max-w-7xl items-end justify-between gap-8 px-6 py-8 sm:px-8 lg:px-10">
          <div>
            <p className="text-[9px] font-medium uppercase tracking-[0.34em] text-amber-300/65">
              Your archive
            </p>

            <h1 className="mt-2.5 text-3xl font-medium tracking-[-0.04em] text-white sm:text-4xl">
              Your memories.
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-white/32">
              Every moment you've chosen to keep,
              in one place.
            </p>
          </div>

          {/* CREATE — secondary action */}
          <button
            type="button"
            onClick={() =>
              navigate('/app/create-memory')
            }
            className="group hidden shrink-0 items-center gap-2 rounded-full bg-white px-5 py-2.5 text-xs font-medium text-black transition duration-300 hover:bg-white/90 sm:inline-flex"
          >
            <Plus
              size={14}
              strokeWidth={1.8}
            />

            Create
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8 sm:px-8 lg:px-10 lg:py-10">
        {/* SEARCH + COUNT */}
        <section className="flex flex-col gap-5 border-b border-white/[0.07] pb-7 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full max-w-xl">
            <Search
              size={16}
              strokeWidth={1.5}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/25"
            />

            <input
              type="search"
              value={searchQuery}
              onChange={(event) =>
                setSearchQuery(event.target.value)
              }
              placeholder="Search your memories..."
              aria-label="Search your memories"
              className="w-full rounded-2xl border border-white/10 bg-white/2.5 py-3.5 pl-11 pr-11 text-sm text-white outline-none placeholder:text-white/20 transition focus:border-white/20 focus:bg-white/[0.035]"
            />

            {searchQuery && (
              <button
                type="button"
                onClick={clearSearch}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-white/25 transition hover:bg-white/5 hover:text-white/70"
              >
                <X size={14} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <p className="text-xs text-white/25">
              {searchQuery
                ? `${filteredMemories.length} ${
                    filteredMemories.length === 1
                      ? 'result'
                      : 'results'
                  }`
                : `${memories.length} ${
                    memories.length === 1
                      ? 'moment'
                      : 'moments'
                  }`}
            </p>

            <span
              className="h-1 w-1 rounded-full bg-white/15"
              aria-hidden="true"
            />

            <p className="text-xs text-white/20">
              All memories
            </p>
          </div>
        </section>

        {/* ERROR */}
        {!loading && error && (
          <section className="mt-10 rounded-3xl border border-red-400/15 bg-red-400/3 px-6 py-5">
            <p className="text-sm text-red-300">
              {error}
            </p>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-3 text-xs text-white/40 transition hover:text-white"
            >
              Try again →
            </button>
          </section>
        )}

        {/* LOADING */}
        {loading && (
          <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map(
              (_, index) => (
                <LoadingCard key={index} />
              )
            )}
          </section>
        )}

        {/* EMPTY ARCHIVE */}
        {!loading &&
          !error &&
          memories.length === 0 && (
            <section className="mt-10 flex min-h-105 items-center justify-center rounded-3xl border border-dashed border-white/10 px-6">
              <div className="max-w-md text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/2.5">
                  <ImageIcon
                    size={22}
                    strokeWidth={1.3}
                    className="text-white/30"
                  />
                </div>

                <p className="mt-6 text-[9px] font-medium uppercase tracking-[0.32em] text-amber-300/55">
                  Your archive is waiting
                </p>

                <h2 className="mt-3 text-2xl font-medium tracking-tight text-white">
                  Begin with one moment.
                </h2>

                <p className="mt-3 text-sm leading-6 text-white/30">
                  Capture a photograph and give it a
                  place in your story.
                </p>

                <button
                  type="button"
                  onClick={() =>
                    navigate('/app/create-memory')
                  }
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition hover:bg-white/90"
                >
                  <Plus size={15} />
                  Create your first memory
                </button>
              </div>
            </section>
          )}

        {/* SEARCH EMPTY */}
        {!loading &&
          !error &&
          memories.length > 0 &&
          filteredMemories.length === 0 && (
            <section className="mt-10 rounded-3xl border border-dashed border-white/10 px-6 py-20 text-center">
              <Search
                size={22}
                strokeWidth={1.4}
                className="mx-auto text-white/20"
              />

              <h2 className="mt-5 text-xl font-medium text-white">
                Nothing matched your search.
              </h2>

              <p className="mt-2 text-sm text-white/30">
                Try another title, place, description,
                or date.
              </p>

              <button
                type="button"
                onClick={clearSearch}
                className="mt-5 text-xs text-white/45 transition hover:text-white"
              >
                Clear search
              </button>
            </section>
          )}

        {/* MEMORY GRID */}
        {!loading &&
          !error &&
          filteredMemories.length > 0 && (
            <section className="mt-8">
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {filteredMemories.map((memory) => (
                  <MemoryCard
                    key={memory.id}
                    memory={memory}
                    onOpen={openMemory}
                  />
                ))}
              </div>
            </section>
          )}

        {/* MOBILE CREATE */}
        {!loading &&
          !error &&
          memories.length > 0 && (
            <div className="mt-10 flex justify-center sm:hidden">
              <button
                type="button"
                onClick={() =>
                  navigate('/app/create-memory')
                }
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition hover:bg-white/90"
              >
                <Plus size={15} />
                Create Memory
              </button>
            </div>
          )}
      </main>
    </div>
  )
}

export default MemoriesPage