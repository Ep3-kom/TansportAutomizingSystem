import { useLocation } from 'react-router-dom'
import { Bell, Search } from 'lucide-react'

const pageTitles = {
  '/': 'Dashboard',
  '/chauffeurs': 'Chauffeurs',
  '/voertuigen': 'Voertuigen',
  '/planning': 'Planning',
  '/onderhoud': 'Onderhoud',
  '/klanten': 'Klanten',
  '/instellingen': 'Instellingen',
}

export default function TopBar() {
  const location = useLocation()
  const title = pageTitles[location.pathname] || 'Dashboard'

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      <h1 className="text-lg font-semibold text-gray-800">{title}</h1>

      <div className="flex items-center gap-4">
        {/* Zoekbalk */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Zoeken..."
            className="pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-300 w-64 transition-all"
          />
        </div>

        {/* Notificatie-bel */}
        <button className="relative p-2 rounded-lg hover:bg-gray-50 transition-colors">
          <Bell className="w-5 h-5 text-gray-500" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger-400 rounded-full"></span>
        </button>

        {/* Gebruiker avatar */}
        <div className="flex items-center gap-3 pl-3 border-l border-gray-200">
          <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
            <span className="text-sm font-semibold text-primary-600">A</span>
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-gray-700 leading-tight">Admin</p>
            <p className="text-xs text-gray-400 leading-tight">TAS Demo</p>
          </div>
        </div>
      </div>
    </header>
  )
}
