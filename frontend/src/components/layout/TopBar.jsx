import { useState, useRef, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { Bell, Search, AlertTriangle, Clock, Shield } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth.jsx'
import { useNotifications } from '../../hooks/useNotifications'

const pageTitles = {
  '/': 'Dashboard',
  '/chauffeurs': 'Chauffeurs',
  '/voertuigen': 'Voertuigen',
  '/planning': 'Planning',
  '/onderhoud': 'Onderhoud',
  '/klanten': 'Klanten',
  '/instellingen': 'Instellingen',
}

const severityStyles = {
  critical: { bg: 'bg-danger-50', text: 'text-danger-600', icon: AlertTriangle, iconColor: 'text-danger-400' },
  warning: { bg: 'bg-warn-50', text: 'text-warn-600', icon: Clock, iconColor: 'text-warn-400' },
  info: { bg: 'bg-primary-50', text: 'text-primary-600', icon: Shield, iconColor: 'text-primary-400' },
}

export default function TopBar() {
  const location = useLocation()
  const { profile } = useAuth()
  const { notifications, unreadCount } = useNotifications()
  const [showNotifications, setShowNotifications] = useState(false)
  const dropdownRef = useRef(null)

  const title = pageTitles[location.pathname] || 'Dashboard'
  const userName = profile?.full_name || profile?.companies?.name || 'Gebruiker'
  const userInitial = userName.charAt(0).toUpperCase()
  const companyName = profile?.companies?.name || ''

  // Sluit dropdown bij klik buiten
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowNotifications(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

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
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Bell className="w-5 h-5 text-gray-500" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-danger-500 rounded-full flex items-center justify-center px-1">
                <span className="text-[10px] font-bold text-white leading-none">{unreadCount > 9 ? '9+' : unreadCount}</span>
              </span>
            )}
          </button>

          {/* Notificatie dropdown */}
          {showNotifications && (
            <div className="absolute right-0 top-full mt-2 w-96 bg-white rounded-xl border border-gray-200 shadow-lg z-50 overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-semibold text-gray-800 text-sm">Meldingen</h3>
                {unreadCount > 0 && (
                  <span className="text-xs font-medium text-gray-400">{unreadCount} melding{unreadCount !== 1 ? 'en' : ''}</span>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="px-4 py-8 text-center">
                    <Bell className="w-8 h-8 text-gray-300 mx-auto" />
                    <p className="text-sm text-gray-400 mt-2">Geen meldingen</p>
                  </div>
                ) : (
                  notifications.map(notification => {
                    const style = severityStyles[notification.severity] || severityStyles.info
                    const Icon = style.icon
                    return (
                      <div key={notification.id} className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${style.bg}`}>
                          <Icon className={`w-4 h-4 ${style.iconColor}`} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className={`text-sm font-medium ${style.text}`}>{notification.title}</p>
                          <p className="text-xs text-gray-400 mt-0.5 truncate">{notification.description}</p>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            </div>
          )}
        </div>

        {/* Gebruiker avatar */}
        <div className="flex items-center gap-3 pl-3 border-l border-gray-200">
          <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
            <span className="text-sm font-semibold text-primary-600">{userInitial}</span>
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-gray-700 leading-tight">{userName}</p>
            {companyName && <p className="text-xs text-gray-400 leading-tight">{companyName}</p>}
          </div>
        </div>
      </div>
    </header>
  )
}
