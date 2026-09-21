import { useEffect, useRef, useState } from 'react'

function CameraCapture({ onCapture, onClose }) {
  const videoRef = useRef(null)
  const streamRef = useRef(null)

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  /*
   * Stop all active camera tracks.
   */
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        track.stop()
      })

      streamRef.current = null
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
  }

  /*
   * Start camera.
   */
  const startCamera = async () => {
    setLoading(true)
    setError('')

    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error(
          'Camera access is not supported by this browser.'
        )
      }

      stopCamera()

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: {
            ideal: 'environment'
          },
          width: {
            ideal: 1920
          },
          height: {
            ideal: 1080
          }
        },
        audio: false
      })

      streamRef.current = stream

      if (!videoRef.current) {
        throw new Error('Camera preview could not be initialized.')
      }

      videoRef.current.srcObject = stream

      await videoRef.current.play()

      setLoading(false)
    } catch (cameraError) {
      console.error('Camera error:', cameraError)

      setLoading(false)

      if (cameraError?.name === 'NotAllowedError') {
        setError(
          'Camera permission was blocked. Allow camera access and try again.'
        )
      } else if (cameraError?.name === 'NotFoundError') {
        setError(
          'No camera was found on this device.'
        )
      } else if (cameraError?.name === 'NotReadableError') {
        setError(
          'The camera is currently being used by another application.'
        )
      } else {
        setError(
          cameraError?.message ||
          'Unable to access the camera.'
        )
      }
    }
  }

  /*
   * Start camera when modal opens.
   * Always stop it when modal closes.
   */
  useEffect(() => {
    startCamera()

    return () => {
      stopCamera()
    }
  }, [])

  /*
   * Capture current camera frame.
   */
  const handleCapture = () => {
    const video = videoRef.current

    if (!video || video.readyState < 2) {
      setError(
        'The camera is not ready yet. Please wait a moment.'
      )
      return
    }

    const width = video.videoWidth
    const height = video.videoHeight

    if (!width || !height) {
      setError(
        'The camera is not ready yet. Please try again.'
      )
      return
    }

    const canvas = document.createElement('canvas')

    canvas.width = width
    canvas.height = height

    const context = canvas.getContext('2d')

    if (!context) {
      setError('Unable to capture the photo.')
      return
    }

    context.drawImage(
      video,
      0,
      0,
      width,
      height
    )

    canvas.toBlob(
      (blob) => {
        if (!blob) {
          setError('Unable to create the photo.')
          return
        }

        const file = new File(
          [blob],
          `lifecaptured-camera-${Date.now()}.jpg`,
          {
            type: 'image/jpeg',
            lastModified: Date.now()
          }
        )

        stopCamera()

        onCapture(file)
      },
      'image/jpeg',
      0.92
    )
  }

  /*
   * Close camera safely.
   */
  const handleClose = () => {
    stopCamera()
    onClose()
  }

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md">

      <div className="relative w-full max-w-3xl overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#090909] shadow-2xl">


        {/* =========================
            HEADER
        ========================== */}

        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4 sm:px-6">

          <div>

            <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-amber-300/70">
              Capture
            </p>

            <h2 className="mt-1 text-lg font-medium text-white">
              Take a photo
            </h2>

          </div>


          <button
            type="button"
            onClick={handleClose}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/50 transition hover:bg-white/10 hover:text-white"
            aria-label="Close camera"
          >

            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="h-5 w-5"
              stroke="currentColor"
              strokeWidth="1.7"
            >
              <path
                d="M6 6l12 12M18 6L6 18"
                strokeLinecap="round"
              />
            </svg>

          </button>

        </div>


        {/* =========================
            CAMERA VIEW
        ========================== */}

        <div className="relative aspect-video w-full overflow-hidden bg-black">

          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="h-full w-full object-cover"
          />


          {/* Framing corners */}

          {!loading && !error && (
            <div className="pointer-events-none absolute inset-0">

              <div className="absolute left-6 top-6 h-8 w-8 border-l border-t border-white/35" />

              <div className="absolute right-6 top-6 h-8 w-8 border-r border-t border-white/35" />

              <div className="absolute bottom-6 left-6 h-8 w-8 border-b border-l border-white/35" />

              <div className="absolute bottom-6 right-6 h-8 w-8 border-b border-r border-white/35" />

            </div>
          )}


          {/* Loading */}

          {loading && !error && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60">

              <div className="text-center">

                <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-white/15 border-t-white" />

                <p className="mt-4 text-sm text-white/55">
                  Starting camera...
                </p>

              </div>

            </div>
          )}


          {/* Error */}

          {error && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/80 px-6">

              <div className="max-w-md text-center">

                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-red-300/15 bg-red-300/6">

                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className="h-5 w-5 text-red-300"
                    stroke="currentColor"
                    strokeWidth="1.7"
                  >
                    <path
                      d="M12 8v4"
                      strokeLinecap="round"
                    />

                    <path
                      d="M12 16h.01"
                      strokeLinecap="round"
                    />

                    <circle
                      cx="12"
                      cy="12"
                      r="9"
                    />
                  </svg>

                </div>

                <p className="mt-4 text-sm leading-6 text-white/70">
                  {error}
                </p>

                <button
                  type="button"
                  onClick={startCamera}
                  className="mt-5 rounded-full border border-white/10 bg-white/10 px-5 py-2.5 text-xs font-medium text-white transition hover:bg-white/15"
                >
                  Try again
                </button>

              </div>

            </div>
          )}

        </div>


        {/* =========================
            FOOTER
        ========================== */}

        <div className="flex items-center justify-between gap-4 border-t border-white/10 px-5 py-4 sm:px-6">

          <div>

            <p className="text-xs text-white/45">
              Capture the moment as it is.
            </p>

            <p className="mt-1 hidden text-[10px] text-white/20 sm:block">
              You can edit the photo after capturing it.
            </p>

          </div>


          {/* Shutter */}

          <button
            type="button"
            onClick={handleCapture}
            disabled={loading || Boolean(error)}
            className="group flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/10 transition duration-300 hover:scale-105 hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100"
            aria-label="Capture photo"
          >

            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-xl transition duration-300 group-hover:scale-95">

              <span className="h-10 w-10 rounded-full border border-black/10 bg-white" />

            </span>

          </button>

        </div>

      </div>

    </div>
  )
}

export default CameraCapture