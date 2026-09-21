import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import OverviewPage from './pages/OverviewPage'
import CreateMemoryPage from './pages/CreateMemoryPage'
import MemoriesPage from './pages/MemoriesPage'
import MonthInFramesPage from './pages/MonthInFramesPage'
import MemoryDetailPage from './pages/MemoryDetailPage'
import TimelinePage from './pages/TimelinePage'
import StoriesPage from './pages/StoriesPage'

import AppLayout from './layouts/AppLayout'

import { AuthProvider, useAuth } from './context/AuthContext'

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        <p className="text-sm text-white/40">
          Opening your archive...
        </p>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return children
}

function AppRoutes() {
  return (
    <Routes>

      {/* =========================
          PUBLIC ROUTES
      ========================== */}

      <Route
        path="/"
        element={<LandingPage />}
      />

      <Route
        path="/login"
        element={<LoginPage />}
      />

      <Route
        path="/register"
        element={<RegisterPage />}
      />

      {/* =========================
          AUTHENTICATED APP
      ========================== */}

      <Route
        path="/app"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >

        {/* OVERVIEW */}
        <Route
          index
          element={<OverviewPage />}
        />

        {/* CREATE MEMORY */}
        <Route
          path="create-memory"
          element={<CreateMemoryPage />}
        />

        {/* ALL MEMORIES */}
        <Route
          path="memories"
          element={<MemoriesPage />}
        />

        {/* SINGLE MEMORY */}
        <Route
          path="memories/:id"
          element={<MemoryDetailPage />}
        />

        {/* TIMELINE */}
        <Route
          path="timeline"
          element={<TimelinePage />}
        />
<Route
  path="frames"
  element={<MonthInFramesPage />}
/>
        <Route
  path="stories"
  element={<StoriesPage />}
/>

      </Route>

    </Routes>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App