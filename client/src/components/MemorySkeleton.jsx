function MemorySkeleton() {
  return (
    <article className="overflow-hidden rounded-3xl border border-white/10 bg-white/1.5">
      {/* IMAGE */}
      <div className="aspect-4/3 animate-pulse bg-white/4" />

      {/* CONTENT */}
      <div className="space-y-4 p-6">
        {/* DATE */}
        <div className="h-2.5 w-28 animate-pulse rounded-full bg-white/6" />

        {/* TITLE */}
        <div className="h-6 w-3/5 animate-pulse rounded-full bg-white/6" />

        {/* LOCATION */}
        <div className="h-3.5 w-24 animate-pulse rounded-full bg-white/4" />

        {/* DESCRIPTION */}
        <div className="h-3.5 w-4/5 animate-pulse rounded-full bg-white/4" />
      </div>
    </article>
  )
}

export default MemorySkeleton