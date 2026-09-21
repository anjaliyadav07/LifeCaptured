import { useEffect, useState } from 'react'
import {
  Outlet,
  useLocation,
  useNavigate
} from 'react-router-dom'

import { useAuth } from '../context/AuthContext'

function HomeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-4 w-4"
      stroke="currentColor"
      strokeWidth="1.6"
      aria-hidden="true"
    >
      <path d="M3.5 10.5 12 3l8.5 7.5" />
      <path d="M5.5 9.5V21h13V9.5" />
      <path d="M9.5 21v-6h5v6" />
    </svg>
  )
}

function PlusIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-4 w-4"
      stroke="currentColor"
      strokeWidth="1.6"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v8M8 12h8" />
    </svg>
  )
}

function ImageIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-4 w-4"
      stroke="currentColor"
      strokeWidth="1.6"
      aria-hidden="true"
    >
      <rect
        x="3.5"
        y="4"
        width="17"
        height="16"
        rx="2"
      />

      <circle
        cx="8.5"
        cy="9"
        r="1.5"
      />

      <path d="m4 17 5-5 3.5 3.5 2.5-2.5 5 5" />
    </svg>
  )
}

function TimelineIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-4 w-4"
      stroke="currentColor"
      strokeWidth="1.6"
      aria-hidden="true"
    >
      <rect
        x="4"
        y="5"
        width="16"
        height="15"
        rx="2"
      />

      <path d="M8 3v4M16 3v4M4 9h16" />

      <path d="M8 13h2M14 13h2M8 16h2" />
    </svg>
  )
}

function FramesIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <rect
        x="4"
        y="4"
        width="16"
        height="16"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.4"
      />

      <path
        d="M8 15.5 11 12l2.5 2.5 2-2 1.5 1.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <circle
        cx="9"
        cy="9"
        r="1"
        stroke="currentColor"
        strokeWidth="1.2"
      />
    </svg>
  )
}

function StoriesIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-4 w-4"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      <rect
        x="3.5"
        y="5"
        width="17"
        height="14"
        rx="2"
      />

      <path d="M8 5v14M16 5v14" />
      <path d="M8 9h8M8 13h5" />
    </svg>
  )
}

function LogOutIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-4 w-4"
      stroke="currentColor"
      strokeWidth="1.6"
      aria-hidden="true"
    >
      <path d="M10 4H5v16h5" />
      <path d="M14 8l4 4-4 4" />
      <path d="M18 12H9" />
    </svg>
  )
}

function MenuIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path
        d="M4 7h16M4 12h16M4 17h16"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path
        d="M6 6l12 12M18 6 6 18"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

/* =========================================================
   NAVIGATION
========================================================= */

const navigationItems = [
  {
    label: 'Overview',
    path: '/app',
    icon: HomeIcon
  },
  {
    label: 'Create',
    path: '/app/create-memory',
    icon: PlusIcon
  },
  {
    label: 'Memories',
    path: '/app/memories',
    icon: ImageIcon
  },
  {
    label: 'Timeline',
    path: '/app/timeline',
    icon: TimelineIcon
  },
  {
    label: 'Frames',
    path: '/app/frames',
    icon: FramesIcon
  },
  {
    label: 'Stories',
    path: '/app/stories',
    icon: StoriesIcon
  }
]

function AppLayout() {
  const location = useLocation()
  const navigate = useNavigate()

  const { user, logout } = useAuth()

  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false)

  const firstLetter =
    user?.name?.charAt(0)?.toUpperCase() || 'U'

  const handleLogout = () => {
    setMobileMenuOpen(false)

    logout()

    navigate('/login')
  }

  const handleNavigation = (path) => {
    setMobileMenuOpen(false)

    navigate(path)
  }

  useEffect(() => {
    setMobileMenuOpen(false)
  }, [location.pathname])

  useEffect(() => {
    if (!mobileMenuOpen) {
      document.body.style.overflow = ''

      return
    }

    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileMenuOpen])

  const isItemActive = (item) => {
    if (item.path === '/app') {
      return location.pathname === '/app'
    }

    return (
      location.pathname === item.path ||
      location.pathname.startsWith(
        `${item.path}/`
      )
    )
  }

  return (
    <div className="h-screen overflow-hidden bg-black text-white">

      {/* =====================================================
          DESKTOP SIDEBAR
      ====================================================== */}

      <aside className="fixed inset-y-0 left-0 z-50 hidden w-72 border-r border-white/8 bg-black lg:flex lg:flex-col">

        {/* BRAND */}

        <div className="shrink-0 px-8 pt-7">
          <button
            type="button"
            onClick={() => navigate('/app')}
            className="text-left"
          >
            <div className="text-sm font-semibold tracking-[0.22em] text-white">
              LIFECAPTURED
            </div>

            <p className="mt-2 text-xs text-white/35">
              Your memories, always.
            </p>
          </button>
        </div>

        {/* NAVIGATION */}

        <nav
          aria-label="Main navigation"
          className="mt-8 flex-1 px-4"
        >
          <p className="mb-3 px-4 text-[9px] font-medium uppercase tracking-[0.32em] text-white/20">
            Archive
          </p>

          <div className="space-y-1">
            {navigationItems.map((item) => {
              const isActive =
                isItemActive(item)

              const Icon = item.icon

              return (
                <button
                  key={item.path}
                  type="button"
                  onClick={() =>
                    handleNavigation(item.path)
                  }
                  aria-current={
                    isActive
                      ? 'page'
                      : undefined
                  }
                  className={`group flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm transition-all duration-300 ${
                    isActive
                      ? 'bg-white/10 text-white'
                      : 'text-white/45 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <span
                    className={`transition-colors duration-300 ${
                      isActive
                        ? 'text-white'
                        : 'text-white/40 group-hover:text-white/70'
                    }`}
                  >
                    <Icon />
                  </span>

                  <span>
                    {item.label}
                  </span>

                  {isActive && (
                    <span
                      className="ml-auto h-1.5 w-1.5 rounded-full bg-amber-300 shadow-[0_0_12px_rgba(252,211,77,0.35)]"
                      aria-hidden="true"
                    />
                  )}
                </button>
              )
            })}
          </div>
        </nav>

        {/* USER AREA */}

        <div className="shrink-0 px-4 pb-6">
          <div className="mb-5 border-t border-white/8" />

          <div className="flex items-center gap-3 px-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-amber-200/80 to-amber-600/80 text-sm font-medium text-black">
              {firstLetter}
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-white">
                {user?.name || 'User'}
              </p>

              <p className="mt-0.5 truncate text-xs text-white/35">
                {user?.email || ''}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="mt-5 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-white/40 transition-all duration-300 hover:bg-white/5 hover:text-white"
          >
            <LogOutIcon />

            <span>
              Sign out
            </span>
          </button>
        </div>
      </aside>

      {/* =====================================================
          MOBILE HEADER
      ====================================================== */}

      <header className="relative z-50 flex h-16 shrink-0 items-center justify-between border-b border-white/8 bg-black px-5 lg:hidden">

        <button
          type="button"
          onClick={() => navigate('/app')}
          className="text-xs font-semibold tracking-[0.2em] text-white"
        >
          LIFECAPTURED
        </button>

        <button
          type="button"
          onClick={() =>
            setMobileMenuOpen(
              (current) => !current
            )
          }
          aria-label={
            mobileMenuOpen
              ? 'Close navigation menu'
              : 'Open navigation menu'
          }
          aria-expanded={mobileMenuOpen}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-white/8 text-white/55 transition-all duration-300 hover:border-white/15 hover:bg-white/5 hover:text-white"
        >
          {mobileMenuOpen ? (
            <CloseIcon />
          ) : (
            <MenuIcon />
          )}
        </button>
      </header>

      {/* =====================================================
          MOBILE NAVIGATION
      ====================================================== */}

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">

          {/* BACKDROP */}

          <button
            type="button"
            aria-label="Close navigation menu"
            onClick={() =>
              setMobileMenuOpen(false)
            }
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />

          {/* MENU PANEL */}

          <div className="absolute inset-x-0 top-16 max-h-[calc(100vh-4rem)] overflow-y-auto border-b border-white/10 bg-black px-5 pb-7 pt-5 shadow-2xl">

            <nav aria-label="Mobile navigation">
              <p className="mb-3 px-3 text-[9px] font-medium uppercase tracking-[0.35em] text-white/20">
                Navigate
              </p>

              <div className="space-y-1">
                {navigationItems.map((item) => {
                  const isActive =
                    isItemActive(item)

                  const Icon = item.icon

                  return (
                    <button
                      key={item.path}
                      type="button"
                      onClick={() =>
                        handleNavigation(
                          item.path
                        )
                      }
                      aria-current={
                        isActive
                          ? 'page'
                          : undefined
                      }
                      className={`group flex w-full items-center gap-3 rounded-xl px-3.5 py-3.5 text-sm transition-all duration-300 ${
                        isActive
                          ? 'bg-white/10 text-white'
                          : 'text-white/50 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <span
                        className={`transition-colors duration-300 ${
                          isActive
                            ? 'text-white'
                            : 'text-white/40 group-hover:text-white/70'
                        }`}
                      >
                        <Icon />
                      </span>

                      <span>
                        {item.label}
                      </span>

                      {isActive && (
                        <span
                          className="ml-auto h-1.5 w-1.5 rounded-full bg-amber-300 shadow-[0_0_12px_rgba(252,211,77,0.35)]"
                          aria-hidden="true"
                        />
                      )}
                    </button>
                  )
                })}
              </div>
            </nav>

            <div className="my-6 border-t border-white/8" />

            {/* MOBILE USER */}

            <div className="flex items-center gap-3 px-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-amber-200/80 to-amber-600/80 text-xs font-medium text-black">
                {firstLetter}
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-white">
                  {user?.name || 'User'}
                </p>

                <p className="mt-0.5 truncate text-xs text-white/30">
                  {user?.email || ''}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="mt-4 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-white/40 transition-all duration-300 hover:bg-white/5 hover:text-white"
            >
              <LogOutIcon />

              <span>
                Sign out
              </span>
            </button>
          </div>
        </div>
      )}

      {/* =====================================================
          MAIN CONTENT
      ====================================================== */}

      <main className="h-full overflow-y-auto lg:ml-72">
        <div className="min-h-full">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default AppLayout