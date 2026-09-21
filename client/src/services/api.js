const API_URL =
  import.meta.env.VITE_API_URL ||
  'http://localhost:5000/api'

const apiRequest = async (endpoint, options = {}) => {
  const isFormData = options.body instanceof FormData

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...(options.headers || {})
    }
  })

  const contentType = response.headers.get('content-type') || ''

  let data

  if (contentType.includes('application/json')) {
    data = await response.json()
  } else {
    const text = await response.text()

    data = {
      message: text || 'The server returned an unexpected response'
    }
  }

  if (!response.ok) {
    throw new Error(
      data.message || `Request failed with status ${response.status}`
    )
  }

  return data
}

export const registerUser = (userData) => {
  return apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData)
  })
}

export const loginUser = (credentials) => {
  return apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials)
  })
}

export const getCurrentUser = (token) => {
  return apiRequest('/auth/me', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

export const getMemories = (token) => {
  return apiRequest('/memories', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

export const createMemory = (memoryData, token) => {
  return apiRequest('/memories', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(memoryData)
  })
}

export const uploadMemoryImage = (memoryId, image, token) => {
  const formData = new FormData()

  formData.append('image', image)

  return apiRequest(`/memories/${memoryId}/images`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`
    },
    body: formData
  })
}
export const getMemory = (memoryId, token) => {
  return apiRequest(`/memories/${memoryId}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}
export const updateMemory = (memoryId, memoryData, token) => {
  return apiRequest(`/memories/${memoryId}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(memoryData)
  })
}

export const deleteMemory = (memoryId, token) => {
  return apiRequest(`/memories/${memoryId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}
export const replaceMemoryImage = (memoryId, image, token) => {
  const formData = new FormData()

  formData.append('image', image)

  return apiRequest(`/memories/${memoryId}/images`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`
    },
    body: formData
  })
}
export const generateMemoryInsight = (memoryId, token) => {
  return apiRequest(`/memories/${memoryId}/ai`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}
export const searchMemories = (query, token) => {
  return apiRequest(
    `/memories/search?q=${encodeURIComponent(query)}`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  )
}
export const getMemoriesByMonth = (
  year,
  month,
  token
) => {
  return apiRequest(
    `/memories/month/${year}/${month}`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  )
}
export const generateStory = (
  year,
  month,
  token
) => {
  return apiRequest(
    '/memories/story',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        year,
        month
      })
    }
  )
}