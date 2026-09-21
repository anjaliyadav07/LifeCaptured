function SearchIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-4.5 w-4.5"
      aria-hidden="true"
    >
      <circle
        cx="11"
        cy="11"
        r="6.5"
        stroke="currentColor"
        strokeWidth="1.4"
      />

      <path
        d="m16 16 4.5 4.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  )
}

function SparkleIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-3.5 w-3.5"
      aria-hidden="true"
    >
      <path
        d="M12 2.75l1.25 5.5L18.75 9.5l-5.5 1.25L12 16.25l-1.25-5.5L5.25 9.5l5.5-1.25L12 2.75Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />

      <path
        d="M19 14.5l.55 2.45L22 17.5l-2.45.55L19 20.5l-.55-2.45L16 17.5l2.45-.55L19 14.5Z"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ClearIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path
        d="M7 7l10 10M17 7 7 17"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

function MemorySearch({
  value,
  onChange,
  onSearch,
  onClear,
  searching
}) {
  const handleSubmit = (event) => {
    event.preventDefault()

    if (!value.trim() || searching) {
      return
    }

    onSearch()
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative min-w-0 flex-1">
          <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/30">
            <SearchIcon />
          </div>

          <input
            type="text"
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder="Search by feeling, place, person, or moment..."
            disabled={searching}
            className="h-12 w-full rounded-full border border-white/10 bg-white/2.5 pl-11 pr-12 text-sm text-white outline-none transition duration-300 placeholder:text-white/22 hover:border-white/15 focus:border-amber-200/30 focus:bg-white/4 disabled:cursor-not-allowed disabled:opacity-60"
          />

          {value && !searching && (
            <button
              type="button"
              onClick={onClear}
              aria-label="Clear search"
              className="absolute right-4 top-1/2 flex -translate-y-1/2 items-center justify-center rounded-full text-white/25 transition hover:text-white/70"
            >
              <ClearIcon />
            </button>
          )}
        </div>

        <button
          type="submit"
          disabled={!value.trim() || searching}
          className="flex h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-white px-6 text-sm font-medium text-black transition duration-300 hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-30"
        >
          <SparkleIcon />

          {searching ? 'Understanding...' : 'Search'}
        </button>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 px-4 text-[11px] text-white/20">
        <span>Try</span>

        <button
          type="button"
          onClick={() => onChange('peaceful moments near water')}
          className="text-white/30 transition hover:text-amber-200/70"
        >
          “peaceful moments near water”
        </button>

        <span>or</span>

        <button
          type="button"
          onClick={() => onChange('travel memories')}
          className="text-white/30 transition hover:text-amber-200/70"
        >
          “travel memories”
        </button>
      </div>
    </form>
  )
}

export default MemorySearch