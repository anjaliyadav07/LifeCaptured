import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createMemory, uploadMemoryImage } from '../services/api'
import PhotoEditor from '../components/PhotoEditor'
import CameraCapture from '../components/CameraCapture'

function CreateMemoryPage() {
  const navigate = useNavigate()
  const fileInputRef = useRef(null)
  const photoAnimationFrameRef = useRef(null)

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    memoryDate: '',
    location: ''
  })

  const [image, setImage] = useState(null)
  const [previewUrl, setPreviewUrl] = useState('')

  const [photoEditorOpen, setPhotoEditorOpen] = useState(false)
  const [cameraOpen, setCameraOpen] = useState(false)

  const [photoVisible, setPhotoVisible] = useState(false)

  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const [saveStage, setSaveStage] = useState('idle')

  /*
   * Clean up object URLs and animation frames.
   */
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }

      if (photoAnimationFrameRef.current) {
        cancelAnimationFrame(photoAnimationFrameRef.current)
      }
    }
  }, [previewUrl])

  /*
   * Handle form fields.
   */
  const handleChange = (event) => {
    const { name, value } = event.target

    setFormData((current) => ({
      ...current,
      [name]: value
    }))
  }

  /*
   * Shared image handling.
   *
   * Both uploaded photos and camera photos
   * enter the exact same pipeline.
   */
  const handleImageFile = (selectedFile) => {
    if (!selectedFile) {
      return
    }

    if (!selectedFile.type.startsWith('image/')) {
      setError('Please select an image file.')
      return
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      setError('Image must be smaller than 10 MB.')
      return
    }

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
    }

    const objectUrl = URL.createObjectURL(selectedFile)

    setError('')
    setImage(selectedFile)
    setPreviewUrl(objectUrl)
    setPhotoVisible(false)

    /*
     * Small cinematic entrance animation.
     */
    if (photoAnimationFrameRef.current) {
      cancelAnimationFrame(photoAnimationFrameRef.current)
    }

    photoAnimationFrameRef.current = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setPhotoVisible(true)
      })
    })

    /*
     * Every new photo enters the editor first.
     */
    setPhotoEditorOpen(true)
  }

  /*
   * Upload from device.
   */
  const handleImageChange = (event) => {
    const selectedFile = event.target.files?.[0]

    if (!selectedFile) {
      return
    }

    handleImageFile(selectedFile)

    /*
     * Allows selecting the same file again.
     */
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  /*
   * Camera capture.
   */
  const handleCameraCapture = (capturedFile) => {
    if (!capturedFile) {
      return
    }

    setCameraOpen(false)

    handleImageFile(capturedFile)
  }

  /*
   * Photo editor saved an edited image.
   */
  const handlePhotoEditorSave = (editedFile, editedPreviewUrl) => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
    }

    setImage(editedFile)
    setPreviewUrl(editedPreviewUrl)
    setPhotoEditorOpen(false)
    setError('')
    setPhotoVisible(false)

    if (photoAnimationFrameRef.current) {
      cancelAnimationFrame(photoAnimationFrameRef.current)
    }

    photoAnimationFrameRef.current = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setPhotoVisible(true)
      })
    })
  }

  /*
   * Close editor.
   */
  const handlePhotoEditorClose = () => {
    setPhotoEditorOpen(false)
  }

  /*
   * Re-open editor.
   */
  const handleEditPhoto = () => {
    if (!image || !previewUrl) {
      return
    }

    setError('')
    setPhotoEditorOpen(true)
  }

  /*
   * Remove current photo.
   */
  const handleRemoveImage = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
    }

    setImage(null)
    setPreviewUrl('')
    setPhotoVisible(false)
    setPhotoEditorOpen(false)
    setError('')

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  /*
   * Save the memory.
   */
  const handleSubmit = async (event) => {
    event.preventDefault()

    setError('')

    if (!image) {
      setError('Please add a photo to this memory.')
      return
    }

    if (!formData.title.trim()) {
      setError('Please give this memory a title.')
      return
    }

    if (!formData.memoryDate) {
      setError('Please choose a date for this memory.')
      return
    }

    setSubmitting(true)
    setSaveStage('creating')

    try {
      const token = localStorage.getItem('lifecaptured_token')

      if (!token) {
        throw new Error('Authentication required')
      }

      /*
       * Create the memory metadata.
       */
      const memoryData = await createMemory(formData, token)

      /*
       * Upload the final edited image.
       */
      setSaveStage('uploading')

      await uploadMemoryImage(
        memoryData.memory.id,
        image,
        token
      )

      /*
       * Short completion state so the transition
       * feels intentional.
       */
      setSaveStage('complete')

      await new Promise((resolve) => {
        setTimeout(resolve, 450)
      })

      navigate('/app')
    } catch (error) {
      setError(
        error.message ||
        'Something went wrong while saving your memory.'
      )

      setSaveStage('idle')
    } finally {
      setSubmitting(false)
    }
  }

  const isSaveDisabled =
    submitting ||
    !image ||
    !formData.title.trim() ||
    !formData.memoryDate

  return (
    <div className="min-h-screen">

      {/* =========================
          HEADER
      ========================== */}

      <header className="border-b border-white/8">

        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-6 sm:px-8">

          <div>

            <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-amber-300/70">
              New memory
            </p>

            <h1 className="mt-2 text-2xl font-medium tracking-tight text-white sm:text-3xl">
              Capture a moment
            </h1>

            <p className="mt-2 max-w-md text-sm leading-6 text-white/30">
              Preserve something worth remembering.
            </p>

          </div>

          <button
            type="button"
            onClick={() => navigate('/app')}
            disabled={submitting}
            className="rounded-full px-3 py-2 text-sm text-white/35 transition hover:bg-white/5 hover:text-white/75 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Cancel
          </button>

        </div>

      </header>


      {/* =========================
          MAIN
      ========================== */}

      <main className="mx-auto max-w-4xl px-6 py-10 sm:px-8 lg:py-14">

        <form onSubmit={handleSubmit}>

          {/* =========================
              ERROR
          ========================== */}

          {error && (
            <div
              role="alert"
              className="mb-6 flex items-start gap-3 rounded-2xl border border-red-400/15 bg-red-400/4 px-5 py-4"
            >

              <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-red-300/30 text-[11px] text-red-300">
                !
              </div>

              <p className="text-sm leading-6 text-red-300/90">
                {error}
              </p>

            </div>
          )}


          <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">


            {/* =========================
                PHOTO
            ========================== */}

            <section>

              {/* Hidden file input */}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImageChange}
                className="hidden"
              />


              {/* PHOTO FRAME */}

              <div className="relative">

                <div className="relative aspect-4/3 w-full overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.018]">

                  {previewUrl ? (
                    <img
                      key={previewUrl}
                      src={previewUrl}
                      alt="Selected memory preview"
                      className={`h-full w-full object-cover transition duration-700 ease-out ${
                        photoVisible
                          ? 'scale-100 opacity-100'
                          : 'scale-[1.025] opacity-0'
                      }`}
                    />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">

                      {/* Decorative frame */}

                      <div className="absolute inset-5 rounded-[1.25rem] border border-dashed border-white/4.5" />

                      <div className="relative">

                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.035] shadow-2xl">

                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            className="h-6 w-6 text-white/40"
                            stroke="currentColor"
                            strokeWidth="1.35"
                          >
                            <rect
                              x="3"
                              y="4"
                              width="18"
                              height="16"
                              rx="2"
                            />

                            <circle
                              cx="8.5"
                              cy="9"
                              r="1.5"
                            />

                            <path d="m21 15-4.5-4.5L7 20" />
                          </svg>

                        </div>

                        <p className="mt-5 text-sm font-medium text-white/65">
                          Your moment starts here
                        </p>

                        <p className="mt-2 max-w-xs text-xs leading-5 text-white/25">
                          Capture something now or choose a photograph from your device.
                        </p>

                      </div>

                    </div>
                  )}


                  {/* Photo overlay */}

                  {previewUrl && (
                    <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/85 via-black/30 to-transparent px-6 pb-6 pt-20">

                      <p className="text-sm font-medium text-white/80">
                        Photo ready
                      </p>

                      <p className="mt-1 text-xs text-white/40">
                        Edit it before preserving this memory.
                      </p>

                    </div>
                  )}

                </div>


                {/* PHOTO CONTROLS */}

                {previewUrl && (
                  <div className="absolute right-4 top-4 flex gap-2">

                    <button
                      type="button"
                      onClick={handleEditPhoto}
                      disabled={submitting}
                      className="rounded-full border border-white/10 bg-black/65 px-4 py-2 text-xs font-medium text-white/80 shadow-lg backdrop-blur-xl transition hover:border-white/20 hover:bg-black/80 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Edit photo
                    </button>

                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      disabled={submitting}
                      className="rounded-full border border-white/10 bg-black/65 px-3.5 py-2 text-xs text-white/60 shadow-lg backdrop-blur-xl transition hover:bg-black/80 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Remove
                    </button>

                  </div>
                )}

              </div>


              {/* =========================
                  CAPTURE OPTIONS
              ========================== */}

              {!previewUrl && (
                <div className="mt-4 grid gap-3 sm:grid-cols-2">

                  {/* CAMERA */}

                  <button
                    type="button"
                    onClick={() => {
                      setError('')
                      setCameraOpen(true)
                    }}
                    disabled={submitting}
                    className="group rounded-2xl border border-amber-300/15 bg-amber-300/[0.035] p-4 text-left transition duration-300 hover:border-amber-300/30  disabhover:bg-amber-300/6 led:cursor-not-allowed disabled:opacity-50"
                  >

                    <div className="flex items-center gap-4">

                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-amber-300/15 bg-amber-300/6 transition group-hover:border-amber-300/30 group-hover:bg-amber-300/10">

                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          className="h-5 w-5 text-amber-200/80"
                          stroke="currentColor"
                          strokeWidth="1.6"
                        >
                          <path
                            d="M4 8.5A2.5 2.5 0 0 1 6.5 6H9l1.2-1.8h3.6L15 6h2.5A2.5 2.5 0 0 1 20 8.5v8A2.5 2.5 0 0 1 17.5 19h-11A2.5 2.5 0 0 1 4 16.5v-8Z"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />

                          <circle
                            cx="12"
                            cy="12.5"
                            r="3.25"
                          />
                        </svg>

                      </div>

                      <div>

                        <p className="text-sm font-medium text-white/90">
                          Take a photo
                        </p>

                        <p className="mt-1 text-xs text-white/35">
                          Capture it now
                        </p>

                      </div>

                    </div>

                  </button>


                  {/* UPLOAD */}

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={submitting}
                    className="group rounded-2xl border border-white/10 bg-white/2.5 p-4 text-left transition duration-300 hover:border-white/20 hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-50"
                  >

                    <div className="flex items-center gap-4">

                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 transition group-hover:border-white/20 group-hover:bg-white/10">

                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          className="h-5 w-5 text-white/60"
                          stroke="currentColor"
                          strokeWidth="1.6"
                        >
                          <path
                            d="M12 16V4"
                            strokeLinecap="round"
                          />

                          <path
                            d="m7.5 8.5 4.5-4.5 4.5 4.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />

                          <path
                            d="M5 14.5v3A2.5 2.5 0 0 0 7.5 20h9a2.5 2.5 0 0 0 2.5-2.5v-3"
                            strokeLinecap="round"
                          />
                        </svg>

                      </div>

                      <div>

                        <p className="text-sm font-medium text-white/80">
                          Upload a photo
                        </p>

                        <p className="mt-1 text-xs text-white/35">
                          Choose from device
                        </p>

                      </div>

                    </div>

                  </button>

                </div>
              )}


              {/* PHOTO STATUS */}

              {image && (
                <div className="mt-4 flex items-center justify-between gap-4 rounded-2xl border border-white/6 bg-white/[0.018] px-4 py-3.5">

                  <div className="flex items-center gap-3">

                    <div className="flex h-8 w-8 items-center justify-center rounded-full border border-emerald-300/15 bg-emerald-300/5">

                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        className="h-4 w-4 text-emerald-300/80"
                        stroke="currentColor"
                        strokeWidth="1.8"
                      >
                        <path
                          d="m6.5 12.5 3.5 3.5 7.5-8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>

                    </div>

                    <div>

                      <p className="text-xs font-medium text-white/60">
                        Ready to preserve
                      </p>

                      <p className="mt-0.5 text-[11px] text-white/25">
                        Your edited photo will be saved with this memory.
                      </p>

                    </div>

                  </div>

                  <button
                    type="button"
                    onClick={handleEditPhoto}
                    disabled={submitting}
                    className="shrink-0 text-xs font-medium text-amber-300/70 transition hover:text-amber-200 disabled:opacity-40"
                  >
                    Edit again
                  </button>

                </div>
              )}


              {!image && (
                <p className="mt-3 text-xs leading-5 text-white/25">
                  JPG, PNG, or WEBP · up to 10 MB
                </p>
              )}

            </section>


            {/* =========================
                DETAILS
            ========================== */}

            <section className="space-y-6">

              {/* TITLE */}

              <div>

                <label
                  htmlFor="title"
                  className="mb-2.5 block text-[11px] font-medium uppercase tracking-[0.2em] text-white/40"
                >
                  Title
                </label>

                <input
                  id="title"
                  name="title"
                  type="text"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Give this moment a name"
                  maxLength={150}
                  required
                  disabled={submitting}
                  className="w-full rounded-2xl border border-white/10 bg-white/2.5 px-4 py-3.5 text-sm text-white outline-none transition duration-300 placeholder:text-white/20 hover:border-white/15 focus:border-amber-300/35 focus:bg-white/4 disabled:cursor-not-allowed disabled:opacity-60"
                />

              </div>


              {/* STORY */}

              <div>

                <label
                  htmlFor="description"
                  className="mb-2.5 block text-[11px] font-medium uppercase tracking-[0.2em] text-white/40"
                >
                  Story
                </label>

                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="What made this moment worth remembering?"
                  rows={5}
                  maxLength={1000}
                  disabled={submitting}
                  className="w-full resize-none rounded-2xl border border-white/10 bg-white/2.5 px-4 py-3.5 text-sm leading-6 text-white outline-none transition duration-300 placeholder:text-white/20 hover:border-white/15 focus:border-amber-300/35 focus:bg-white/4 disabled:cursor-not-allowed disabled:opacity-60"
                />

                <p className="mt-2 text-right text-[11px] text-white/20">
                  {formData.description.length}/1000
                </p>

              </div>


              {/* DATE */}

              <div>

                <label
                  htmlFor="memoryDate"
                  className="mb-2.5 block text-[11px] font-medium uppercase tracking-[0.2em] text-white/40"
                >
                  Date
                </label>

                <input
                  id="memoryDate"
                  name="memoryDate"
                  type="date"
                  value={formData.memoryDate}
                  onChange={handleChange}
                  required
                  disabled={submitting}
                  className="w-full rounded-2xl border border-white/10 bg-white/2.5 px-4 py-3.5 text-sm text-white outline-none transition duration-300 hover:border-white/15 focus:border-amber-300/35 focus:bg-white/4 disabled:cursor-not-allowed disabled:opacity-60"
                />

              </div>


              {/* LOCATION */}

              <div>

                <label
                  htmlFor="location"
                  className="mb-2.5 block text-[11px] font-medium uppercase tracking-[0.2em] text-white/40"
                >
                  Location
                </label>

                <input
                  id="location"
                  name="location"
                  type="text"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Where did this happen?"
                  maxLength={255}
                  disabled={submitting}
                  className="w-full rounded-2xl border border-white/10 bg-white/2.5 px-4 py-3.5 text-sm text-white outline-none transition duration-300 placeholder:text-white/20 hover:border-white/15 focus:border-amber-300/35 focus:bg-white/4 disabled:cursor-not-allowed disabled:opacity-60"
                />

              </div>


              {/* SAVE */}

              <div className="pt-1">

                <button
                  type="submit"
                  disabled={isSaveDisabled}
                  className="group relative w-full overflow-hidden rounded-full bg-white px-6 py-3.5 text-sm font-medium text-black transition duration-300 hover:bg-white/90 disabled:cursor-not-allowed disabled:bg-white/40 disabled:text-black/70"
                >

                  <span className="relative z-10 flex items-center justify-center gap-2">

                    {submitting && (
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-black/20 border-t-black" />
                    )}

                    {saveStage === 'creating' && 'Creating memory...'}
                    {saveStage === 'uploading' && 'Preserving your photo...'}
                    {saveStage === 'complete' && 'Memory preserved'}
                    {saveStage === 'idle' && 'Save Memory'}

                  </span>

                </button>

                {!image && (
                  <p className="mt-2.5 text-center text-[11px] text-white/20">
                    Add a photo to continue
                  </p>
                )}

              </div>

            </section>

          </div>

        </form>

      </main>


      {/* =========================
          PHOTO EDITOR
      ========================== */}

      {photoEditorOpen && image && previewUrl && (
        <PhotoEditor
          imageUrl={previewUrl}
          onClose={handlePhotoEditorClose}
          onSave={handlePhotoEditorSave}
          saving={submitting}
        />
      )}


      {/* =========================
          CAMERA
      ========================== */}

      {cameraOpen && (
        <CameraCapture
          onCapture={handleCameraCapture}
          onClose={() => setCameraOpen(false)}
        />
      )}

    </div>
  )
}

export default CreateMemoryPage