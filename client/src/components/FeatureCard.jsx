function FeatureCard({ number, title, description, children }) {
  return (
    <article className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/3 p-6 transition duration-500 hover:-translate-y-1 hover:border-white/20 hover:bg-white/5 sm:p-8">
      {/* Number */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium tracking-[0.25em] text-white/35">
          {number}
        </span>

        <span className="h-px w-10 bg-white/10 transition-all duration-500 group-hover:w-16 group-hover:bg-amber-300/40" />
      </div>

      {/* Visual */}
      <div className="mt-8 flex h-24 items-center">
        {children}
      </div>

      {/* Content */}
      <div className="mt-7">
        <h3 className="text-2xl font-medium tracking-tight text-white">
          {title}
        </h3>

        <p className="mt-3 max-w-sm text-sm leading-6 text-white/55 sm:text-base">
          {description}
        </p>
      </div>
    </article>
  )
}

export default FeatureCard