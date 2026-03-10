import { useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth.jsx'

const pageTitles = {
  '/delivery': 'Dashboard',
  '/delivery/bestellingen': 'Bestellingen',
  '/delivery/planning': 'Planning',
  '/delivery/instellingen': 'Instellingen',
}

export default function DeliveryTopBar() {
  const location = useLocation()
  const { profile, signOut } = useAuth()

  const title = pageTitles[location.pathname] || 'Dashboard'
  const userName = profile?.full_name || profile?.companies?.name || 'Gebruiker'
  const userInitial = userName.charAt(0).toUpperCase()
  const companyName = profile?.companies?.name || ''

  return (
    <header className="h-16 bg-white border-b border-gray-200/80 flex items-center justify-between px-6">
      <h1 className="text-lg font-semibold text-gray-800">{title}</h1>

      <div className="flex items-center gap-4">
        {/* Gebruiker avatar */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center ring-2 ring-primary-50">
            <span className="text-sm font-semibold text-primary-600">{userInitial}</span>
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-gray-700 leading-tight">{userName}</p>
            {companyName && <p className="text-xs text-gray-400 leading-tight">{companyName}</p>}
          </div>
        </div>

        <button
          onClick={signOut}
          className="text-sm text-gray-400 hover:text-gray-600 transition-colors duration-200 px-3 py-1.5 rounded-lg hover:bg-stone-50"
        >
          Uitloggen
        </button>
      </div>
    </header>
  )
}
