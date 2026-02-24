import {
  Users,
  Truck,
  CalendarDays,
  AlertTriangle,
  ArrowRight,
  Clock,
  MapPin,
  CheckCircle2,
  TrendingUp,
} from 'lucide-react'
import StatCard from '../components/ui/StatCard'

// Dummy data — puur voor UI demonstratie
const todayTrips = [
  { id: 1, driver: 'Jan de Vries', truck: 'AB-123-CD', from: 'Amsterdam', to: 'Rotterdam', time: '08:00', status: 'onderweg' },
  { id: 2, driver: 'Pieter Bakker', truck: 'EF-456-GH', from: 'Utrecht', to: 'Den Haag', time: '09:30', status: 'gepland' },
  { id: 3, driver: 'Karel Smit', truck: 'IJ-789-KL', from: 'Eindhoven', to: 'Breda', time: '07:00', status: 'afgerond' },
  { id: 4, driver: 'Mohammed El Amrani', truck: 'MN-012-OP', from: 'Tilburg', to: 'Arnhem', time: '10:00', status: 'gepland' },
]

const apkWarnings = [
  { id: 1, truck: 'AB-123-CD', brand: 'Volvo FH16', daysLeft: 12 },
  { id: 2, truck: 'QR-345-ST', brand: 'DAF XF', daysLeft: 28 },
  { id: 3, truck: 'UV-678-WX', brand: 'MAN TGX', daysLeft: 45 },
]

const statusColors = {
  onderweg: 'bg-primary-100 text-primary-700',
  gepland: 'bg-warn-100 text-warn-500',
  afgerond: 'bg-accent-100 text-accent-500',
}

const statusIcons = {
  onderweg: TrendingUp,
  gepland: Clock,
  afgerond: CheckCircle2,
}

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Welkom */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Goedemorgen 👋</h2>
        <p className="text-gray-500 text-sm mt-1">Hier is het overzicht van vandaag</p>
      </div>

      {/* Statistieken */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Users} label="Actieve Chauffeurs" value="8" subtitle="2 met verlof" color="primary" />
        <StatCard icon={Truck} label="Beschikbare Voertuigen" value="12" subtitle="1 in onderhoud" color="accent" />
        <StatCard icon={CalendarDays} label="Ritten Vandaag" value="4" subtitle="2 onderweg" color="primary" />
        <StatCard icon={AlertTriangle} label="APK Waarschuwingen" value="3" subtitle="Binnen 60 dagen" color="warn" />
      </div>

      {/* 2 kolommen: ritten + APK */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Ritten vandaag */}
        <div className="lg:col-span-2 bg-card rounded-xl border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
            <h3 className="font-semibold text-gray-800">Ritten Vandaag</h3>
            <button className="text-sm text-primary-500 hover:text-primary-700 font-medium flex items-center gap-1 transition-colors">
              Bekijk alles <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="divide-y divide-gray-50">
            {todayTrips.map((trip) => {
              const StatusIcon = statusIcons[trip.status]
              return (
                <div key={trip.id} className="flex items-center justify-between px-5 py-3.5 hover:bg-gray-50/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center">
                      <MapPin className="w-4 h-4 text-primary-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">{trip.from} → {trip.to}</p>
                      <p className="text-xs text-gray-400">{trip.driver} • {trip.truck}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-400 font-mono">{trip.time}</span>
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[trip.status]}`}>
                      <StatusIcon className="w-3 h-3" />
                      {trip.status.charAt(0).toUpperCase() + trip.status.slice(1)}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* APK Waarschuwingen */}
        <div className="bg-card rounded-xl border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-50">
            <h3 className="font-semibold text-gray-800">APK Waarschuwingen</h3>
            <p className="text-xs text-gray-400 mt-0.5">Verloopt binnen 60 dagen</p>
          </div>
          <div className="divide-y divide-gray-50">
            {apkWarnings.map((apk) => (
              <div key={apk.id} className="flex items-center justify-between px-5 py-3.5 hover:bg-gray-50/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${apk.daysLeft <= 14 ? 'bg-danger-50' : 'bg-warn-50'}`}>
                    <AlertTriangle className={`w-4 h-4 ${apk.daysLeft <= 14 ? 'text-danger-400' : 'text-warn-400'}`} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">{apk.truck}</p>
                    <p className="text-xs text-gray-400">{apk.brand}</p>
                  </div>
                </div>
                <span className={`text-xs font-semibold ${apk.daysLeft <= 14 ? 'text-danger-500' : 'text-warn-500'}`}>
                  {apk.daysLeft} dagen
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
