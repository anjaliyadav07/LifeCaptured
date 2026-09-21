import {
  LockKeyhole,
  UserRound,
  Database
} from 'lucide-react'

const principles = [
  {
    icon: LockKeyhole,
    title: 'Private',
    description:
      'Your memories live inside your personal account.'
  },
  {
    icon: UserRound,
    title: 'Personal',
    description:
      'Your archive grows around your life and your moments.'
  },
  {
    icon: Database,
    title: 'Organized',
    description:
      'Photographs, dates, places, and stories stay together.'
  }
]

const PrivacySection = () => {
  return (
    <section className="overflow-hidden border-t border-white/10 bg-[#050505] py-20 sm:py-24 lg:py-28">

      <div className="mx-auto max-w-7xl px-6 lg:px-10">

        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-16">

          {/* Heading */}

          <div>

            <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-amber-300/70">
              Your memories
            </p>

            <h2 className="mt-5 max-w-xl text-4xl font-medium leading-[1.05] tracking-[-0.04em] text-white sm:text-5xl lg:text-6xl">
              Your story should
              <span className="block text-white/30">
                belong to you.
              </span>
            </h2>

            <p className="mt-6 max-w-lg text-sm leading-7 text-white/40 sm:text-base">
              LifeCaptured is built around something deeply
              personal: the moments that make your life yours.
            </p>

          </div>


          {/* Principles */}

          <div className="grid gap-2.5 sm:grid-cols-3">

            {principles.map((item) => {
              const Icon = item.icon

              return (
                <article
                  key={item.title}
                  className="rounded-2xl border border-white/8 bg-white/[0.012] p-5 transition duration-300 hover:border-white/15"
                >

                  <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/2.5">

                    <Icon
                      size={16}
                      strokeWidth={1.4}
                      className="text-white/40"
                    />

                  </div>

                  <h3 className="mt-7 text-xs font-medium text-white/75">
                    {item.title}
                  </h3>

                  <p className="mt-2.5 text-[11px] leading-5 text-white/30">
                    {item.description}
                  </p>

                </article>
              )
            })}

          </div>

        </div>

      </div>

    </section>
  )
}

export default PrivacySection