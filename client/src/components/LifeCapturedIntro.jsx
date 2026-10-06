import { useEffect, useState } from 'react'

function LifeCapturedIntro({ onComplete }) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      onComplete?.()
    }, 3000)

    return () => clearTimeout(timer)
  }, [onComplete])

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 z-[9999] bg-[#0e0906]">

      {/* Desktop */}
      <video
        src="/videos/lifecaptured-intro.mp4"
        autoPlay
        muted
        playsInline
        className="hidden h-full w-full object-cover md:block"
      />

      {/* Mobile */}
      <video
        src="/videos/lifecaptured-intro-mobile.mp4"
        autoPlay
        muted
        playsInline
        className="block h-full w-full object-cover md:hidden"
      />

    </div>
  )
}

export default LifeCapturedIntro