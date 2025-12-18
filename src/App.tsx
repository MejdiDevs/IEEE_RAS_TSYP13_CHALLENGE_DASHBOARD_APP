import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from '@/contexts/AuthContext'
import { DataProvider } from '@/contexts/DataContext'
import { Login } from '@/components/Auth/Login'
import { Landing } from '@/pages/Landing'
import Dashboard from '@/pages/Dashboard'
import { Communication } from '@/pages/Communication'
import { VehicleTaskManagerPage } from '@/pages/VehicleTaskManagerPage'
import { Toaster } from 'react-hot-toast'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { currentUser, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-muted-foreground font-inter">Loading...</div>
      </div>
    )
  }

  return currentUser ? <>{children}</> : <Navigate to="/login" />
}

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route 
              path="/task-manager" 
              element={
                <ProtectedRoute>
                  <VehicleTaskManagerPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/communication" 
              element={
                <ProtectedRoute>
                  <Communication />
                </ProtectedRoute>
              } 
            />
          </Routes>
          <Toaster position="top-right" />
        </Router>
      </DataProvider>
    </AuthProvider>
  )
}

export default App

