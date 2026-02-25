import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth.jsx'
import Sidebar from './components/layout/Sidebar'
import TopBar from './components/layout/TopBar'
import Dashboard from './pages/Dashboard'
import Drivers from './pages/Drivers'
import Trucks from './pages/Trucks'
import Planning from './pages/Planning'
import Maintenance from './pages/Maintenance'
import Clients from './pages/Clients'
import Settings from './pages/Settings'
import Login from './pages/Login'
import Register from './pages/Register'

function AppLayout() {
  return (
    <div className="flex h-screen bg-surface">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto p-6">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/chauffeurs" element={<Drivers />} />
            <Route path="/voertuigen" element={<Trucks />} />
            <Route path="/planning" element={<Planning />} />
            <Route path="/onderhoud" element={<Maintenance />} />
            <Route path="/klanten" element={<Clients />} />
            <Route path="/instellingen" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

function App() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-3 border-primary-200 border-t-primary-500 rounded-full animate-spin mx-auto"></div>
          <p className="text-sm text-gray-500 mt-3">Laden...</p>
        </div>
      </div>
    )
  }

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
      <Route path="/registreren" element={user ? <Navigate to="/" /> : <Register />} />
      <Route path="/*" element={user ? <AppLayout /> : <Navigate to="/login" />} />
    </Routes>
  )
}

export default App
