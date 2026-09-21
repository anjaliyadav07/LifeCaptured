import { useNavigate } from 'react-router-dom'

function formatDate(date) {
  if (!date) return ''

  return new Date(date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  })
}

function MemoryCard({ memory }) {
  const navigate = useNavigate()

  const image = memory.images?.[0]?.imageUrl

  const handleOpen = () => {
    navigate(`/app/memories/${memory.id}`)
  }

  return (
    <article
      onClick={handleOpen}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          handleOpen()
        }
      }}
      role="button"
      tabIndex={0}
      className="group cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-white/2 transition duration-500 hover:-translate-y-1 hover:border-white/20 hover:bg-white/2.5 focus:outline-none focus:ring-1 focus:ring-amber-300/40"
    >
      {/* IMAGE */}
      <div className="aspect-4/3 overflow-hidden bg-white/2">
        {image ? (
          <img
            src={image}
            alt={memory.title || 'Memory'}
            className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center">
            <p className="text-[10px] uppercase tracking-[0.3em] text-white/20">
              Memory
            </p>

            <p className="mt-2 text-xs text-white/20">
              No photo
            </p>
          </div>
        )}
      </div>

      {/* CONTENT */}
      <div className="p-5">
        <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-amber-300/75">
          {formatDate(memory.memoryDate || memory.date)}
        </p>

        <h3 className="mt-3 truncate text-lg font-medium tracking-tight text-white">
          {memory.title}
        </h3>

        {memory.location && (
          <p className="mt-2 truncate text-xs text-white/40">
            ◇ {memory.location}
          </p>
        )}

        {memory.description && (
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-white/35">
            {memory.description}
          </p>
        )}
      </div>
    </article>
  )
}

export default MemoryCard