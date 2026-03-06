import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Users,
  Truck,
  CalendarDays,
  AlertTriangle,
  ArrowRight,
  Clock,
  Building2,
} from 'lucide-react'
import StatCard from '../components/ui/StatCard'
import { useDrivers } from '../hooks/useDrivers'
import { useTrucks } from '../hooks/useTrucks'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth.jsx'

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Goedemorgen'
  if (hour < 18) return 'Goedemiddag'
  return 'Goedenavond'
}

function getDaysUntil(dateStr) {
  if (!dateStr) return null
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const target = new Date(dateStr + 'T00:00:00')
  return Math.ceil((target - today) / (1000 * 60 * 60 * 24))
}

export default function Dashboard() {
  const navigate = useNavigate()
  const { profile } = useAuth()
  const { drivers, loading: driversLoading } = useDrivers()
  const { trucks, loading: trucksLoading } = useTrucks()
  const [todaySchedules, setTodaySchedules] = useState([])
  const [schedulesLoading, setSchedulesLoading] = useState(true)

  const today = new Date().toISOString().split('T')[0]

  useEffect(() => {
    async function fetchToday() {
      if (!profile?.company_id) return
      const { data } = await supabase
        .from('schedules')
        .select('*, drivers(name), clients(name)')
        .eq('date', today)
        .order('start_time')
      setTodaySchedules(data || [])
      setSchedulesLoading(false)
    }
    fetchToday()
  }, [profile?.company_id, today])

  const loading = driversLoading || trucksLoading || schedulesLoading

  // Statistieken berekenen
  const activeDrivers = drivers.filter(d => d.status === 'actief')
  const verlofDrivers = drivers.filter(d => d.status === 'verlof')
  const ziekDrivers = drivers.filter(d => d.status === 'ziek')
  const availableTrucks = trucks.filter(t => t.status === 'beschikbaar')
  const onderhoudTrucks = trucks.filter(t => t.status === 'onderhoud')

  // APK waarschuwingen: trucks met APK binnen 60 dagen
  const apkWarnings = trucks
    .map(t => ({ ...t, daysLeft: getDaysUntil(t.apk_expiry) }))
    .filter(t => t.daysLeft !== null && t.daysLeft <= 60)
    .sort((a, b) => a.daysLeft - b.daysLeft)

  const driverSubtitle = [
    verlofDrivers.length > 0 && `${verlofDrivers.length} verlof`,
    ziekDrivers.length > 0 && `${ziekDrivers.length} ziek`,
  ].filter(Boolean).join(', ') || 'Iedereen actief'

  const truckSubtitle = onderhoudTrucks.length > 0
    ? `${onderhoudTrucks.length} in onderhoud`
    : 'Alles beschikbaar'

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-3 border-primary-200 border-t-primary-500 rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Welkom */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800">{getGreeting()} 👋</h2>
        <p className="text-gray-500 text-sm mt-1">Hier is het overzicht van vandaag</p>
      </div>

      {/* Statistieken */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Users} label="Actieve Chauffeurs" value={activeDrivers.length} subtitle={driverSubtitle} color="primary" />
        <StatCard icon={Truck} label="Beschikbare Voertuigen" value={availableTrucks.length} subtitle={truckSubtitle} color="accent" />
        <StatCard icon={CalendarDays} label="Ritten Vandaag" value={todaySchedules.length} subtitle={todaySchedules.length === 0 ? 'Geen inplanningen' : `${todaySchedules.length} ingepland`} color="primary" />
        <StatCard icon={AlertTriangle} label="APK Waarschuwingen" value={apkWarnings.length} subtitle={apkWarnings.length > 0 ? 'Binnen 60 dagen' : 'Alles in orde'} color={apkWarnings.length > 0 ? 'warn' : 'accent'} />
      </div>

      {/* 2 kolommen: ritten + APK */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Inplanningen vandaag */}
        <div className="lg:col-span-2 bg-card rounded-xl border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
            <h3 className="font-semibold text-gray-800">Inplanningen Vandaag</h3>
            <button
              onClick={() => navigate('/planning')}
              className="text-sm text-primary-500 hover:text-primary-700 font-medium flex items-center gap-1 transition-colors"
            >
              Bekijk planning <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {todaySchedules.length === 0 ? (
            <div className="px-5 py-8 text-center">
              <CalendarDays className="w-8 h-8 text-gray-300 mx-auto" />
              <p className="text-sm text-gray-400 mt-2">Geen inplanningen voor vandaag</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {todaySchedules.map((schedule) => (
                <div key={schedule.id} className="flex items-center justify-between px-5 py-3.5 hover:bg-gray-50/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center">
                      <Users className="w-4 h-4 text-primary-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">{schedule.drivers?.name || 'Onbekend'}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {schedule.start_time?.slice(0, 5)} - {schedule.end_time?.slice(0, 5)}
                        </span>
                        {schedule.clients?.name && (
                          <span className="flex items-center gap-1">
                            <Building2 className="w-3 h-3" />
                            {schedule.clients.name}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  {schedule.notes && (
                    <span className="text-xs text-gray-400 max-w-48 truncate hidden sm:block">{schedule.notes}</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* APK Waarschuwingen */}
        <div className="bg-card rounded-xl border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-50">
            <h3 className="font-semibold text-gray-800">APK Waarschuwingen</h3>
            <p className="text-xs text-gray-400 mt-0.5">Verloopt binnen 60 dagen</p>
          </div>

          {apkWarnings.length === 0 ? (
            <div className="px-5 py-8 text-center">
              <AlertTriangle className="w-8 h-8 text-gray-300 mx-auto" />
              <p className="text-sm text-gray-400 mt-2">Geen APK waarschuwingen</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {apkWarnings.map((truck) => (
                <div key={truck.id} className="flex items-center justify-between px-5 py-3.5 hover:bg-gray-50/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${truck.daysLeft <= 14 ? 'bg-danger-50' : 'bg-warn-50'}`}>
                      <AlertTriangle className={`w-4 h-4 ${truck.daysLeft <= 14 ? 'text-danger-400' : 'text-warn-400'}`} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">{truck.license_plate}</p>
                      <p className="text-xs text-gray-400">{truck.brand_model || 'Onbekend model'}</p>
                    </div>
                  </div>
                  <span className={`text-xs font-semibold ${truck.daysLeft <= 14 ? 'text-danger-500' : 'text-warn-500'}`}>
                    {truck.daysLeft <= 0 ? 'Verlopen!' : `${truck.daysLeft} dagen`}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
