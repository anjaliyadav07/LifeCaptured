import { useEffect, useRef, useState } from 'react'

const FILTERS = [
  {
    name: 'Original',
    value: 'none'
  },
  {
    name: 'Warm',
    value: 'sepia(18%) saturate(115%)'
  },
  {
    name: 'Cinematic',
    value: 'contrast(112%) saturate(88%) brightness(96%)'
  },
  {
    name: 'Vintage',
    value: 'sepia(28%) contrast(105%) saturate(85%) brightness(96%)'
  },
  {
    name: 'B&W',
    value: 'grayscale(100%) contrast(108%)'
  }
]

function PhotoEditor({
  imageUrl,
  onClose,
  onSave,
  saving = false
}) {
  const canvasRef = useRef(null)

  const [filter, setFilter] = useState('none')
  const [brightness, setBrightness] = useState(100)
  const [contrast, setContrast] = useState(100)
  const [saturation, setSaturation] = useState(100)
  const [warmth, setWarmth] = useState(0)
  const [rotation, setRotation] = useState(0)

  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState('')

  const [imageDimensions, setImageDimensions] = useState({
    width: 0,
    height: 0
  })

  useEffect(() => {
    if (!imageUrl) {
      return
    }

    setLoading(true)
    setError('')

    const image = new Image()

    image.onload = () => {
      setImageDimensions({
        width: image.naturalWidth,
        height: image.naturalHeight
      })

      setLoading(false)
    }

    image.onerror = () => {
      setError('Unable to load this photo.')
      setLoading(false)
    }

    image.src = imageUrl

    return () => {
      image.onload = null
      image.onerror = null
    }
  }, [imageUrl])

  const getFilterStyle = () => {
    const selectedFilter =
      FILTERS.find((item) => item.value === filter)?.value || 'none'

    const warmthFilter =
      warmth > 0
        ? `sepia(${warmth}%)`
        : ''

    return [
      selectedFilter,
      `brightness(${brightness}%)`,
      `contrast(${contrast}%)`,
      `saturate(${saturation}%)`,
      warmthFilter
    ]
      .filter(Boolean)
      .join(' ')
  }

  const resetEditor = () => {
    setFilter('none')
    setBrightness(100)
    setContrast(100)
    setSaturation(100)
    setWarmth(0)
    setRotation(0)
    setError('')
  }

  const rotateLeft = () => {
    setRotation((current) => current - 90)
  }

  const rotateRight = () => {
    setRotation((current) => current + 90)
  }

  const renderEditedImage = async () => {
    if (!imageUrl) {
      throw new Error('No photo selected.')
    }

    const sourceImage = new Image()

    sourceImage.crossOrigin = 'anonymous'

    await new Promise((resolve, reject) => {
      sourceImage.onload = resolve

      sourceImage.onerror = () => {
        reject(
          new Error(
            'This photo could not be processed. Please try another image.'
          )
        )
      }

      sourceImage.src = imageUrl
    })

    const canvas = canvasRef.current

    if (!canvas) {
      throw new Error('Photo editor is not ready.')
    }

    const maxDimension = 1800

    const scale = Math.min(
      1,
      maxDimension /
        Math.max(
          sourceImage.naturalWidth,
          sourceImage.naturalHeight
        )
    )

    const originalWidth =
      sourceImage.naturalWidth * scale

    const originalHeight =
      sourceImage.naturalHeight * scale

    const isQuarterTurn =
      Math.abs(rotation) % 180 === 90

    canvas.width = isQuarterTurn
      ? originalHeight
      : originalWidth

    canvas.height = isQuarterTurn
      ? originalWidth
      : originalHeight

    const context = canvas.getContext('2d')

    if (!context) {
      throw new Error('Unable to process the photo.')
    }

    context.clearRect(
      0,
      0,
      canvas.width,
      canvas.height
    )

    context.save()

    context.translate(
      canvas.width / 2,
      canvas.height / 2
    )

    context.rotate(
      (rotation * Math.PI) / 180
    )

    context.filter = getFilterStyle()

    context.drawImage(
      sourceImage,
      -originalWidth / 2,
      -originalHeight / 2,
      originalWidth,
      originalHeight
    )

    context.restore()

    const blob = await new Promise((resolve) => {
      canvas.toBlob(
        resolve,
        'image/jpeg',
        0.92
      )
    })

    if (!blob) {
      throw new Error('Unable to create the edited photo.')
    }

    return new File(
      [blob],
      `lifecaptured-${Date.now()}.jpg`,
      {
        type: 'image/jpeg',
        lastModified: Date.now()
      }
    )
  }

  const handleSave = async () => {
    setProcessing(true)
    setError('')

    try {
      const editedFile = await renderEditedImage()

      const editedPreviewUrl =
        URL.createObjectURL(editedFile)

      onSave(
        editedFile,
        editedPreviewUrl
      )
    } catch (error) {
      setError(
        error.message ||
        'Something went wrong while editing the photo.'
      )
    } finally {
      setProcessing(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm sm:p-6">

      <div className="flex max-h-[95vh] w-full max-w-6xl flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#0b0b0b] shadow-2xl">

        {/* HEADER */}

        <header className="flex items-center justify-between border-b border-white/8 px-5 py-4 sm:px-7">

          <div>
            <p className="text-[9px] font-medium uppercase tracking-[0.3em] text-amber-300/70">
              Make it yours
            </p>

            <h2 className="mt-1 text-lg font-medium text-white sm:text-xl">
              Edit your photo
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={processing || saving}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-lg text-white/50 transition hover:border-white/20 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Close photo editor"
          >
            ×
          </button>

        </header>

        {/* BODY */}

        <div className="grid min-h-0 flex-1 overflow-auto lg:grid-cols-[1fr_320px]">

          {/* PREVIEW */}

          <section className="relative flex min-h-90 items-center justify-center overflow-hidden bg-black p-5 sm:p-8 lg:min-h-155">

            <div className="absolute inset-0 opacity-20">
              <div className="h-full w-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08),transparent_55%)]" />
            </div>

            {loading && (
              <p className="relative text-sm text-white/35">
                Preparing photo...
              </p>
            )}

            {!loading && !error && (
              <div className="relative flex max-h-full max-w-full items-center justify-center">

                <img
                  src={imageUrl}
                  alt="Photo being edited"
                  className="max-h-[58vh] max-w-full rounded-xl object-contain shadow-2xl transition-all duration-300 sm:max-h-[62vh] lg:max-h-[68vh]"
                  style={{
                    filter: getFilterStyle(),
                    transform: `rotate(${rotation}deg)`
                  }}
                />

              </div>
            )}

            {error && (
              <div className="relative max-w-sm text-center">

                <p className="text-sm text-red-300">
                  {error}
                </p>

                <button
                  type="button"
                  onClick={() => setError('')}
                  className="mt-4 rounded-full border border-white/10 px-4 py-2 text-xs text-white/60 transition hover:border-white/20 hover:text-white"
                >
                  Try again
                </button>

              </div>
            )}

            {/* ROTATION */}

            {!loading && !error && (
              <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/10 bg-black/65 p-1.5 backdrop-blur-md">

                <button
                  type="button"
                  onClick={rotateLeft}
                  disabled={processing || saving}
                  className="flex h-9 w-9 items-center justify-center rounded-full text-sm text-white/60 transition hover:bg-white/10 hover:text-white disabled:opacity-40"
                  aria-label="Rotate left"
                >
                  ↺
                </button>

                <span className="px-2 text-[10px] uppercase tracking-[0.2em] text-white/30">
                  Rotate
                </span>

                <button
                  type="button"
                  onClick={rotateRight}
                  disabled={processing || saving}
                  className="flex h-9 w-9 items-center justify-center rounded-full text-sm text-white/60 transition hover:bg-white/10 hover:text-white disabled:opacity-40"
                  aria-label="Rotate right"
                >
                  ↻
                </button>

              </div>
            )}

          </section>

          {/* CONTROLS */}

          <aside className="border-t border-white/8 bg-white/[0.018] p-5 sm:p-7 lg:border-l lg:border-t-0">

            <div className="space-y-7">

              {/* FILTERS */}

              <div>

                <div className="mb-3 flex items-center justify-between">
                  <p className="text-[9px] font-medium uppercase tracking-[0.28em] text-white/35">
                    Filters
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2">

                  {FILTERS.map((item) => (
                    <button
                      key={item.name}
                      type="button"
                      onClick={() => setFilter(item.value)}
                      disabled={processing || saving}
                      className={`rounded-xl border px-3 py-2.5 text-left text-xs transition ${
                        filter === item.value
                          ? 'border-amber-300/40 bg-amber-300/8 text-amber-200'
                          : 'border-white/8 bg-white/2.5 text-white/45 hover:border-white/15 hover:text-white/70'
                      }`}
                    >
                      {item.name}
                    </button>
                  ))}

                </div>

              </div>

              {/* ADJUSTMENTS */}

              <div>

                <p className="mb-4 text-[9px] font-medium uppercase tracking-[0.28em] text-white/35">
                  Adjustments
                </p>

                <div className="space-y-5">

                  {/* BRIGHTNESS */}

                  <label className="block">

                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-xs text-white/50">
                        Brightness
                      </span>

                      <span className="text-[10px] text-white/25">
                        {brightness}
                      </span>
                    </div>

                    <input
                      type="range"
                      min="60"
                      max="140"
                      value={brightness}
                      onChange={(event) =>
                        setBrightness(Number(event.target.value))
                      }
                      disabled={processing || saving}
                      className="w-full accent-amber-300"
                    />

                  </label>

                  {/* CONTRAST */}

                  <label className="block">

                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-xs text-white/50">
                        Contrast
                      </span>

                      <span className="text-[10px] text-white/25">
                        {contrast}
                      </span>
                    </div>

                    <input
                      type="range"
                      min="60"
                      max="140"
                      value={contrast}
                      onChange={(event) =>
                        setContrast(Number(event.target.value))
                      }
                      disabled={processing || saving}
                      className="w-full accent-amber-300"
                    />

                  </label>

                  {/* SATURATION */}

                  <label className="block">

                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-xs text-white/50">
                        Saturation
                      </span>

                      <span className="text-[10px] text-white/25">
                        {saturation}
                      </span>
                    </div>

                    <input
                      type="range"
                      min="0"
                      max="160"
                      value={saturation}
                      onChange={(event) =>
                        setSaturation(Number(event.target.value))
                      }
                      disabled={processing || saving}
                      className="w-full accent-amber-300"
                    />

                  </label>

                  {/* WARMTH */}

                  <label className="block">

                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-xs text-white/50">
                        Warmth
                      </span>

                      <span className="text-[10px] text-white/25">
                        {warmth}
                      </span>
                    </div>

                    <input
                      type="range"
                      min="0"
                      max="45"
                      value={warmth}
                      onChange={(event) =>
                        setWarmth(Number(event.target.value))
                      }
                      disabled={processing || saving}
                      className="w-full accent-amber-300"
                    />

                  </label>

                </div>

              </div>

              {/* ACTIONS */}

              <div className="border-t border-white/8 pt-5">

                <button
                  type="button"
                  onClick={resetEditor}
                  disabled={processing || saving}
                  className="text-xs text-white/30 transition hover:text-white/65 disabled:opacity-40"
                >
                  Reset adjustments
                </button>

                <div className="mt-5 flex gap-2">

                  <button
                    type="button"
                    onClick={onClose}
                    disabled={processing || saving}
                    className="flex-1 rounded-full border border-white/10 px-4 py-3 text-xs font-medium text-white/55 transition hover:border-white/20 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={
                      loading ||
                      Boolean(error) ||
                      processing ||
                      saving
                    }
                    className="flex-1 rounded-full bg-white px-4 py-3 text-xs font-medium text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {processing
                      ? 'Processing...'
                      : 'Use this photo'}
                  </button>

                </div>

                <p className="mt-3 text-center text-[10px] leading-4 text-white/20">
                  Your original photo stays unchanged until you choose this photo.
                </p>

              </div>

            </div>

          </aside>

        </div>

        {/* HIDDEN CANVAS */}

        <canvas
          ref={canvasRef}
          className="hidden"
          aria-hidden="true"
        />

      </div>

    </div>
  )
}

export default PhotoEditor