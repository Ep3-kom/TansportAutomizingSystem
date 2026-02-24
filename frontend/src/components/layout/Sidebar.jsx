import { NavLink, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  Truck,
  CalendarDays,
  Wrench,
  Building2,
  Settings,
} from 'lucide-react'

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/chauffeurs', icon: Users, label: 'Chauffeurs' },
  { to: '/voertuigen', icon: Truck, label: 'Voertuigen' },
  { to: '/planning', icon: CalendarDays, label: 'Planning' },
  { to: '/onderhoud', icon: Wrench, label: 'Onderhoud' },
  { to: '/klanten', icon: Building2, label: 'Klanten' },
]

export default function Sidebar() {
  const location = useLocation()

  return (
    <aside className="w-64 bg-sidebar border-r border-gray-200 flex flex-col">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-primary-500 rounded-lg flex items-center justify-center">
            <Truck className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-800 tracking-tight">TAS</span>
        </div>
      </div>

      {/* Navigatie */}
      <nav className="flex-1 py-4 px-3 space-y-1">
        {navItems.map(({ to, icon: Icon, label }) => {
          const isActive = location.pathname === to
          return (
            <NavLink
              key={to}
              to={to}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-primary-500' : 'text-gray-400'}`} />
              {label}
            </NavLink>
          )
        })}
      </nav>

      {/* Settings onderaan */}
      <div className="px-3 pb-4 border-t border-gray-100 pt-3">
        <NavLink
          to="/instellingen"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
            location.pathname === '/instellingen'
              ? 'bg-primary-50 text-primary-700'
              : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
          }`}
        >
          <Settings className={`w-5 h-5 ${location.pathname === '/instellingen' ? 'text-primary-500' : 'text-gray-400'}`} />
          Instellingen
        </NavLink>
      </div>
    </aside>
  )
}
