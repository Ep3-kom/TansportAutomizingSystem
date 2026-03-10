import { NavLink, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Package,
  CalendarDays,
  Settings,
  PackageCheck,
} from 'lucide-react'

const navItems = [
  { to: '/delivery', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/delivery/bestellingen', icon: Package, label: 'Bestellingen' },
  { to: '/delivery/planning', icon: CalendarDays, label: 'Planning' },
]

export default function DeliverySidebar() {
  const location = useLocation()

  return (
    <aside className="w-64 bg-sidebar border-r border-gray-200/80 flex flex-col">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-gray-100/80">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-primary-600 rounded-xl flex items-center justify-center shadow-sm">
            <PackageCheck className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-xl font-semibold text-gray-800 tracking-tight">TAS</span>
            <span className="text-xs text-gray-400 ml-1.5 font-medium">Bezorging</span>
          </div>
        </div>
      </div>

      {/* Navigatie */}
      <nav className="flex-1 py-5 px-3 space-y-0.5">
        {navItems.map(({ to, icon: Icon, label }) => {
          const isActive = location.pathname === to
          return (
            <NavLink
              key={to}
              to={to}
              end={to === '/delivery'}
              className={`relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-primary-50/80 text-primary-700 shadow-sm'
                  : 'text-gray-500 hover:bg-stone-50 hover:text-gray-700'
              }`}
            >
              {isActive && <div className="absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-full bg-primary-500" />}
              <Icon className={`w-5 h-5 ${isActive ? 'text-primary-500' : 'text-gray-400'}`} />
              {label}
            </NavLink>
          )
        })}
      </nav>

      {/* Settings onderaan */}
      <div className="px-3 pb-4 border-t border-gray-100/80 pt-3">
        <NavLink
          to="/delivery/instellingen"
          className={`relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
            location.pathname === '/delivery/instellingen'
              ? 'bg-primary-50/80 text-primary-700 shadow-sm'
              : 'text-gray-500 hover:bg-stone-50 hover:text-gray-700'
          }`}
        >
          {location.pathname === '/delivery/instellingen' && <div className="absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-full bg-primary-500" />}
          <Settings className={`w-5 h-5 ${location.pathname === '/delivery/instellingen' ? 'text-primary-500' : 'text-gray-400'}`} />
          Instellingen
        </NavLink>
      </div>
    </aside>
  )
}
