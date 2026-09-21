import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Button from './Button'
import Container from './Container'

function Navbar() {
  const scrollToFeatures = () => {
    const featuresSection = document.getElementById('features')

    if (featuresSection) {
      featuresSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      })
    }
  }

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.6,
        ease: 'easeOut'
      }}
      className="absolute inset-x-0 top-0 z-50"
    >
      <Container>
        <nav
          aria-label="Main navigation"
          className="flex h-24 items-center justify-between"
        >
          {/* BRAND */}
          <Link
            to="/"
            aria-label="LifeCaptured home"
            className="text-sm font-medium tracking-[0.2em] text-(--color-text-primary) transition-opacity duration-300 hover:opacity-70"
          >
            LIFECAPTURED
          </Link>

          {/* DESKTOP NAVIGATION */}
          <div className="hidden items-center gap-8 md:flex">
            <button
              type="button"
              onClick={scrollToFeatures}
              className="text-sm text-(--color-text-secondary) transition-colors duration-300 hover:text-(--color-text-primary)"
            >
              Features
            </button>

            <Link
              to="/login"
              className="text-sm text-(--color-text-secondary) transition-colors duration-300 hover:text-(--color-text-primary)"
            >
              Sign in
            </Link>

            <Link to="/register">
              <Button className="px-5 py-2.5">
                Start Capturing
              </Button>
            </Link>
          </div>
        </nav>
      </Container>
    </motion.header>
  )
}

export default Navbar