import {
  createContext,
  useContext,
  useEffect,
  useState
} from 'react'

import {
  getCurrentUser,
  loginUser,
  registerUser
} from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(
    () => localStorage.getItem('lifecaptured_token')
  )
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!token) {
      setLoading(false)
      return
    }

    const restoreSession = async () => {
      try {
        const data = await getCurrentUser(token)

        setUser(data.user)
      } catch {
        localStorage.removeItem('lifecaptured_token')
        setToken(null)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    restoreSession()
  }, [token])

  const register = async (userData) => {
    return registerUser(userData)
  }

  const login = async (credentials) => {
    const data = await loginUser(credentials)

    localStorage.setItem(
      'lifecaptured_token',
      data.token
    )

    setToken(data.token)
    setUser(data.user)

    return data
  }

  const logout = () => {
    localStorage.removeItem('lifecaptured_token')

    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        register,
        login,
        logout,
        isAuthenticated: Boolean(user)
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error(
      'useAuth must be used inside AuthProvider'
    )
  }

  return context
}