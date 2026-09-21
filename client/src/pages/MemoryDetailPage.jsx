import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import AIInsightCard from '../components/AIInsightCard'

import {
  deleteMemory,
  generateMemoryInsight,
  getMemory,
  replaceMemoryImage,
  updateMemory
} from '../services/api'

function getMemoryDate(memory) {
  return (
    memory.memoryDate ||
    memory.memory_date ||
    memory.date ||
    memory.createdAt ||
    memory.created_at ||
    null
  )
}

function formatDate(date) {
  if (!date) return ''

  return new Date(date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  })
}

function formatDateForInput(date) {
  if (!date) return ''

  const parsedDate = new Date(date)

  if (Number.isNaN(parsedDate.getTime())) {
    return ''
  }

  const year = parsedDate.getFullYear()
  const month = String(parsedDate.getMonth() + 1).padStart(2, '0')
  const day = String(parsedDate.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

function MemoryDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const fileInputRef = useRef(null)

  const [memory, setMemory] = useState(null)
  const [loading, setLoading] = useState(true)

  const [generatingInsight, setGeneratingInsight] = useState(false)

  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const [showDeleteConfirmation, setShowDeleteConfirmation] =
    useState(false)

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    memoryDate: '',
    location: ''
  })

  const [newImage, setNewImage] = useState(null)
  const [newImagePreview, setNewImagePreview] = useState('')

  const [error, setError] = useState('')

  useEffect(() => {
    const loadMemory = async () => {
      try {
        setError('')

        const token = localStorage.getItem('lifecaptured_token')

        if (!token) {
          throw new Error('Authentication required')
        }

        const data = await getMemory(id, token)

        setMemory(data.memory)
      } catch (error) {
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    loadMemory()
  }, [id])

  useEffect(() => {
    return () => {
      if (newImagePreview) {
        URL.revokeObjectURL(newImagePreview)
      }
    }
  }, [newImagePreview])

  const startEditing = () => {
    setError('')

    setFormData({
      title: memory.title || '',
      description: memory.description || '',
      memoryDate: formatDateForInput(getMemoryDate(memory)),
      location: memory.location || ''
    })

    setNewImage(null)
    setNewImagePreview('')

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }

    setEditing(true)
  }

  const cancelEditing = () => {
    if (newImagePreview) {
      URL.revokeObjectURL(newImagePreview)
    }

    setNewImage(null)
    setNewImagePreview('')
    setEditing(false)
    setError('')

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleChange = (event) => {
    const { name, value } = event.target

    setFormData((current) => ({
      ...current,
      [name]: value
    }))
  }

  const handleImageChange = (event) => {
    const selectedFile = event.target.files?.[0]

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

    if (newImagePreview) {
      URL.revokeObjectURL(newImagePreview)
    }

    const objectUrl = URL.createObjectURL(selectedFile)

    setError('')
    setNewImage(selectedFile)
    setNewImagePreview(objectUrl)
  }

  const handleGenerateInsight = async () => {
    setError('')
    setGeneratingInsight(true)

    try {
      const token = localStorage.getItem('lifecaptured_token')

      if (!token) {
        throw new Error('Authentication required')
      }

      const data = await generateMemoryInsight(id, token)

      setMemory((current) => ({
        ...current,
        aiInsight: data.insight
      }))
    } catch (error) {
      setError(
        error.message ||
          'Something went wrong while understanding this memory.'
      )
    } finally {
      setGeneratingInsight(false)
    }
  }

  const handleSave = async (event) => {
    event.preventDefault()

    setError('')

    if (!formData.title.trim()) {
      setError('Please give this memory a title.')
      return
    }

    if (!formData.memoryDate) {
      setError('Please choose a date for this memory.')
      return
    }

    setSaving(true)

    try {
      const token = localStorage.getItem('lifecaptured_token')

      if (!token) {
        throw new Error('Authentication required')
      }

      const memoryData = await updateMemory(
        id,
        {
          title: formData.title,
          description: formData.description,
          memoryDate: formData.memoryDate,
          location: formData.location
        },
        token
      )

      let updatedMemory = {
        ...memory,
        ...memoryData.memory
      }

      if (newImage) {
        const imageData = await replaceMemoryImage(
          id,
          newImage,
          token
        )

        updatedMemory = {
          ...updatedMemory,
          images: [imageData.image]
        }
      }

      setMemory(updatedMemory)

      if (newImagePreview) {
        URL.revokeObjectURL(newImagePreview)
      }

      setNewImage(null)
      setNewImagePreview('')
      setEditing(false)

      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    } catch (error) {
      setError(error.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    setError('')
    setDeleting(true)

    try {
      const token = localStorage.getItem('lifecaptured_token')

      if (!token) {
        throw new Error('Authentication required')
      }

      await deleteMemory(id, token)

      navigate('/app/memories')
    } catch (error) {
      setError(error.message)
      setDeleting(false)
      setShowDeleteConfirmation(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-sm text-white/30">
        Opening your memory...
      </div>
    )
  }

  if (error && !memory) {
    return (
      <section className="px-6 py-12 lg:px-12">
        <p className="text-sm text-red-300">
          {error}
        </p>

        <button
          type="button"
          onClick={() => navigate('/app/memories')}
          className="mt-6 text-sm text-white/40 transition hover:text-white"
        >
          ← Back to memories
        </button>
      </section>
    )
  }

  if (!memory) {
    return null
  }

  return (
    <section className="px-6 py-10 sm:px-8 lg:px-12 lg:py-12">
      {/* Back */}
      <button
        type="button"
        onClick={() => navigate('/app/memories')}
        disabled={saving || deleting || generatingInsight}
        className="text-xs text-white/35 transition hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
      >
        ← Back to memories
      </button>

      <div className="mt-10 max-w-6xl">
        {/* Error */}
        {error && (
          <div
            role="alert"
            className="mb-8 rounded-2xl border border-red-400/15 bg-red-400/3 px-5 py-4 text-sm text-red-300"
          >
            {error}
          </div>
        )}

        {!editing ? (
          <>
            {/* Header */}
            <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <p className="text-[10px] uppercase tracking-[0.3em] text-amber-300/75">
                  {formatDate(getMemoryDate(memory))}
                </p>

                <h1 className="mt-4 text-4xl font-medium tracking-tight text-white sm:text-5xl lg:text-6xl">
                  {memory.title}
                </h1>

                {memory.location && (
                  <p className="mt-5 text-sm text-white/40">
                    ◇ {memory.location}
                  </p>
                )}

                {memory.description && (
                  <p className="mt-8 max-w-2xl text-base leading-8 text-white/55">
                    {memory.description}
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="flex shrink-0 items-center gap-3">
                <button
                  type="button"
                  onClick={startEditing}
                  disabled={generatingInsight}
                  className="rounded-full border border-white/10 px-5 py-2.5 text-sm text-white/65 transition duration-300 hover:border-white/20 hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Edit Memory
                </button>

                <button
                  type="button"
                  onClick={() => setShowDeleteConfirmation(true)}
                  disabled={generatingInsight}
                  className="rounded-full border border-red-400/15 px-5 py-2.5 text-sm text-red-300/70 transition duration-300 hover:border-red-400/30 hover:bg-red-400/5 hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Delete
                </button>
              </div>
            </div>

            {/* Delete confirmation */}
            {showDeleteConfirmation && (
              <div className="mt-8 rounded-3xl border border-red-400/15 bg-red-400/3 p-6 sm:p-7">
                <p className="text-xs font-medium uppercase tracking-[0.25em] text-red-300/70">
                  Delete memory
                </p>

                <h2 className="mt-3 text-xl font-medium text-white">
                  Delete "{memory.title}"?
                </h2>

                <p className="mt-3 max-w-xl text-sm leading-6 text-white/40">
                  This memory will be removed from your archive.
                  This action cannot be undone.
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirmation(false)}
                    disabled={deleting}
                    className="rounded-full border border-white/10 px-5 py-2.5 text-sm text-white/60 transition hover:border-white/20 hover:text-white disabled:opacity-40"
                  >
                    Keep Memory
                  </button>

                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={deleting}
                    className="rounded-full bg-red-400/10 px-5 py-2.5 text-sm text-red-300 transition hover:bg-red-400/15 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {deleting
                      ? 'Deleting...'
                      : 'Yes, Delete Memory'}
                  </button>
                </div>
              </div>
            )}

            {/* Images */}
            {memory.images?.length > 0 && (
              <div className="mt-12 grid gap-4 sm:grid-cols-2">
                {memory.images.map((image) => (
                  <div
                    key={image.id}
                    className="overflow-hidden rounded-3xl border border-white/10 bg-white/2"
                  >
                    <img
                      src={image.imageUrl}
                      alt={memory.title}
                      className="h-full w-full object-cover transition duration-700 hover:scale-[1.01]"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* No image */}
            {(!memory.images || memory.images.length === 0) && (
              <div className="mt-12 flex aspect-video max-w-4xl items-center justify-center rounded-3xl border border-white/10 bg-white/2">
                <p className="text-xs uppercase tracking-[0.3em] text-white/20">
                  No photo attached
                </p>
              </div>
            )}

            {/* AI Intelligence */}
            <AIInsightCard
              insight={memory.aiInsight}
              generating={generatingInsight}
              onGenerate={handleGenerateInsight}
            />
          </>
        ) : (
          /* Edit mode */
          <form onSubmit={handleSave}>
            <div className="max-w-3xl">
              <p className="text-[10px] uppercase tracking-[0.3em] text-amber-300/75">
                Edit memory
              </p>

              <h1 className="mt-4 text-4xl font-medium tracking-tight text-white sm:text-5xl">
                Make this memory yours
              </h1>

              <p className="mt-4 text-sm leading-6 text-white/35">
                Update the details or replace the photo.
              </p>
            </div>

            <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_0.8fr]">
              {/* Photo */}
              <section>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageChange}
                  className="hidden"
                />

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={saving}
                  className="group relative flex aspect-4/3 w-full overflow-hidden rounded-3xl border border-dashed border-white/15 bg-white/2.5 text-left transition hover:border-white/25 hover:bg-white/4 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {newImagePreview ? (
                    <>
                      <img
                        src={newImagePreview}
                        alt="New memory preview"
                        className="h-full w-full object-cover"
                      />

                      <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/85 via-black/30 to-transparent p-6">
                        <p className="text-sm text-white/75">
                          Click to choose another photo
                        </p>
                      </div>
                    </>
                  ) : memory.images?.[0]?.imageUrl ? (
                    <>
                      <img
                        src={memory.images[0].imageUrl}
                        alt={memory.title}
                        className="h-full w-full object-cover"
                      />

                      <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/85 via-black/30 to-transparent p-6">
                        <p className="text-sm text-white/75">
                          Click to replace this photo
                        </p>
                      </div>
                    </>
                  ) : (
                    <div className="m-auto text-center">
                      <p className="text-sm font-medium text-white/60">
                        Add a photo
                      </p>

                      <p className="mt-2 text-xs text-white/25">
                        JPG, PNG, WEBP · up to 10 MB
                      </p>
                    </div>
                  )}
                </button>

                {newImage && (
                  <p className="mt-3 text-xs text-amber-300/60">
                    New photo selected. Save changes to replace the current
                    photo.
                  </p>
                )}
              </section>

              {/* Details */}
              <section className="space-y-6">
                {/* Title */}
                <div>
                  <label
                    htmlFor="title"
                    className="mb-2 block text-xs font-medium uppercase tracking-[0.15em] text-white/40"
                  >
                    Title
                  </label>

                  <input
                    id="title"
                    name="title"
                    type="text"
                    value={formData.title}
                    onChange={handleChange}
                    maxLength={150}
                    required
                    disabled={saving}
                    className="w-full rounded-2xl border border-white/10 bg-white/4 px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-amber-300/40 focus:bg-white/6 disabled:opacity-50"
                  />
                </div>

                {/* Story */}
                <div>
                  <label
                    htmlFor="description"
                    className="mb-2 block text-xs font-medium uppercase tracking-[0.15em] text-white/40"
                  >
                    Story
                  </label>

                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={5}
                    maxLength={1000}
                    disabled={saving}
                    className="w-full resize-none rounded-2xl border border-white/10 bg-white/4 px-4 py-3.5 text-sm leading-6 text-white outline-none transition placeholder:text-white/20 focus:border-amber-300/40 focus:bg-white/6 disabled:opacity-50"
                  />

                  <p className="mt-2 text-right text-[11px] text-white/20">
                    {formData.description.length}/1000
                  </p>
                </div>

                {/* Date */}
                <div>
                  <label
                    htmlFor="memoryDate"
                    className="mb-2 block text-xs font-medium uppercase tracking-[0.15em] text-white/40"
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
                    disabled={saving}
                    className="w-full rounded-2xl border border-white/10 bg-white/4 px-4 py-3.5 text-sm text-white outline-none transition focus:border-amber-300/40 focus:bg-white/6 disabled:opacity-50"
                  />
                </div>

                {/* Location */}
                <div>
                  <label
                    htmlFor="location"
                    className="mb-2 block text-xs font-medium uppercase tracking-[0.15em] text-white/40"
                  >
                    Location
                  </label>

                  <input
                    id="location"
                    name="location"
                    type="text"
                    value={formData.location}
                    onChange={handleChange}
                    maxLength={255}
                    disabled={saving}
                    placeholder="Where did this happen?"
                    className="w-full rounded-2xl border border-white/10 bg-white/4 px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-amber-300/40 focus:bg-white/6 disabled:opacity-50"
                  />
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={saving}
                    className="rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {saving
                      ? 'Saving changes...'
                      : 'Save Changes'}
                  </button>

                  <button
                    type="button"
                    onClick={cancelEditing}
                    disabled={saving}
                    className="rounded-full border border-white/10 px-6 py-3 text-sm text-white/55 transition hover:border-white/20 hover:text-white disabled:opacity-40"
                  >
                    Cancel
                  </button>
                </div>
              </section>
            </div>
          </form>
        )}
      </div>
    </section>
  )
}

export default MemoryDetailPage