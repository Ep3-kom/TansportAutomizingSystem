import { Routes, Route } from 'react-router-dom'
import Sidebar from './components/layout/Sidebar'
import TopBar from './components/layout/TopBar'
import Dashboard from './pages/Dashboard'
import Drivers from './pages/Drivers'
import Trucks from './pages/Trucks'
import Planning from './pages/Planning'
import Maintenance from './pages/Maintenance'
import Clients from './pages/Clients'
import Settings from './pages/Settings'

function App() {
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

export default App
