function SparkleIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-5 w-5"
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

function AIInsightCard({
  insight,
  generating,
  onGenerate
}) {
  return (
    <section className="mt-14 overflow-hidden rounded-3xl border border-amber-200/10 bg-linear-to-br from-amber-200/5 via-white/2 to-transparent">
      <div className="p-7 sm:p-9">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full border border-amber-200/15 bg-amber-200/5 text-amber-200/80">
                <SparkleIcon />
              </span>

              <div>
                <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-amber-200/65">
                  LifeCaptured Intelligence
                </p>

                <h2 className="mt-1 text-xl font-medium tracking-tight text-white">
                  {insight
                    ? 'This moment, understood.'
                    : 'Understand this memory'}
                </h2>
              </div>
            </div>

            {!insight && (
              <p className="mt-5 max-w-xl text-sm leading-6 text-white/35">
                Let LifeCaptured look at this photograph and its story to
                discover the mood, themes, and meaning within the moment.
              </p>
            )}
          </div>

          {!insight && (
            <button
              type="button"
              onClick={onGenerate}
              disabled={generating}
              className="shrink-0 rounded-full bg-white px-5 py-2.5 text-sm font-medium text-black transition duration-300 hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {generating ? 'Understanding...' : 'Understand this memory'}
            </button>
          )}
        </div>

        {insight && (
          <div className="mt-10">
            <div className="max-w-3xl">
              <p className="text-2xl font-medium leading-9 tracking-tight text-white sm:text-3xl sm:leading-10">
                “{insight.caption}”
              </p>

              {insight.summary && (
                <p className="mt-5 text-sm leading-7 text-white/45 sm:text-base">
                  {insight.summary}
                </p>
              )}
            </div>

            <div className="mt-10 grid gap-8 border-t border-white/8 pt-8 sm:grid-cols-[0.7fr_1.3fr]">
              <div>
                <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-white/25">
                  Mood
                </p>

                <p className="mt-3 text-base font-medium capitalize text-white/80">
                  {insight.mood}
                </p>
              </div>

              <div>
                <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-white/25">
                  Themes
                </p>

                <div className="mt-3 flex flex-wrap gap-2">
                  {insight.themes?.map((theme) => (
                    <span
                      key={theme}
                      className="rounded-full border border-white/10 bg-white/3 px-3.5 py-1.5 text-xs text-white/55"
                    >
                      {theme}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 border-t border-white/8 pt-5">
              <p className="text-[11px] leading-5 text-white/20">
                AI-generated from your photograph and memory details.
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export default AIInsightCard