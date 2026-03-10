import { useNavigate } from 'react-router-dom'
import {
  Package,
  PackageCheck,
  Clock,
  Truck,
  ArrowRight,
  MapPin,
  Phone,
} from 'lucide-react'
import StatCard from '../../components/ui/StatCard'
import { useOrders } from '../../hooks/useOrders'
import { useAuth } from '../../hooks/useAuth.jsx'

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Goedemorgen'
  if (hour < 18) return 'Goedemiddag'
  return 'Goedenavond'
}

const statusColors = {
  nieuw: 'bg-primary-50 text-primary-600',
  ingepland: 'bg-warn-50 text-warn-600',
  onderweg: 'bg-purple-50 text-purple-600',
  bezorgd: 'bg-accent-50 text-accent-600',
  geannuleerd: 'bg-gray-100 text-gray-500',
}

const statusLabels = {
  nieuw: 'Nieuw',
  ingepland: 'Ingepland',
  onderweg: 'Onderweg',
  bezorgd: 'Bezorgd',
  geannuleerd: 'Geannuleerd',
}

export default function DeliveryDashboard() {
  const navigate = useNavigate()
  const { profile } = useAuth()
  const { orders, todayOrders, stats, loading } = useOrders()

  // Komende 7 dagen overzicht
  const today = new Date()
  const weekOrders = []
  for (let i = 0; i < 7; i++) {
    const d = new Date(today)
    d.setDate(d.getDate() + i)
    const dateStr = d.toISOString().split('T')[0]
    const dayOrders = orders.filter(o => o.planned_date === dateStr)
    weekOrders.push({
      date: dateStr,
      dayName: d.toLocaleDateString('nl-NL', { weekday: 'short' }),
      dayNum: d.getDate(),
      count: dayOrders.length,
      isToday: i === 0,
    })
  }

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
        <p className="text-gray-500 text-sm mt-1">
          {profile?.companies?.name || 'Je bedrijf'} — overzicht van je bezorgingen
        </p>
      </div>

      {/* Statistieken */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Package} label="Nieuwe Bestellingen" value={stats.nieuw} subtitle={stats.nieuw === 0 ? 'Alles ingepland' : 'Nog in te plannen'} color="primary" />
        <StatCard icon={Clock} label="Ingepland" value={stats.ingepland} subtitle="Wachten op bezorging" color="warn" />
        <StatCard icon={Truck} label="Vandaag Bezorgen" value={todayOrders.length} subtitle={todayOrders.length === 0 ? 'Geen leveringen' : `${todayOrders.length} stop${todayOrders.length !== 1 ? 's' : ''}`} color="primary" />
        <StatCard icon={PackageCheck} label="Bezorgd" value={stats.bezorgd} subtitle="Totaal afgeleverd" color="accent" />
      </div>

      {/* Week overzicht mini */}
      <div className="bg-card rounded-xl border border-gray-100 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
          <h3 className="font-semibold text-gray-800">Komende 7 dagen</h3>
          <button
            onClick={() => navigate('/delivery/planning')}
            className="text-sm text-primary-500 hover:text-primary-700 font-medium flex items-center gap-1 transition-colors"
          >
            Planning openen <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        <div className="grid grid-cols-7 divide-x divide-gray-50">
          {weekOrders.map(day => (
            <div
              key={day.date}
              className={`text-center py-4 ${day.isToday ? 'bg-primary-50' : ''}`}
            >
              <p className={`text-xs font-medium uppercase ${day.isToday ? 'text-primary-600' : 'text-gray-400'}`}>
                {day.dayName}
              </p>
              <p className={`text-lg font-bold mt-1 ${day.isToday ? 'text-primary-700' : 'text-gray-800'}`}>
                {day.dayNum}
              </p>
              <div className={`mt-2 inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-semibold ${
                day.count > 0
                  ? day.isToday ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-600'
                  : 'text-gray-300'
              }`}>
                {day.count > 0 ? day.count : '-'}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bezorgingen vandaag */}
        <div className="lg:col-span-2 bg-card rounded-xl border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
            <h3 className="font-semibold text-gray-800">Bezorgingen Vandaag</h3>
            <span className="text-xs text-gray-400">{todayOrders.length} stop{todayOrders.length !== 1 ? 's' : ''}</span>
          </div>

          {todayOrders.length === 0 ? (
            <div className="px-5 py-8 text-center">
              <Package className="w-8 h-8 text-gray-300 mx-auto" />
              <p className="text-sm text-gray-400 mt-2">Geen bezorgingen voor vandaag</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {todayOrders.map((order, index) => (
                <div key={order.id} className="flex items-center justify-between px-5 py-3.5 hover:bg-gray-50/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-primary-50 rounded-lg flex items-center justify-center text-xs font-bold text-primary-500">
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">{order.customer_name}</p>
                      <div className="flex items-center gap-3 text-xs text-gray-400 mt-0.5">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {order.address}, {order.postcode} {order.city}
                        </span>
                        {order.customer_phone && (
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {order.customer_phone}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColors[order.status]}`}>
                    {statusLabels[order.status]}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Nieuwe bestellingen */}
        <div className="bg-card rounded-xl border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
            <h3 className="font-semibold text-gray-800">Nieuwe Bestellingen</h3>
            <button
              onClick={() => navigate('/delivery/bestellingen')}
              className="text-sm text-primary-500 hover:text-primary-700 font-medium flex items-center gap-1 transition-colors"
            >
              Alle <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {stats.nieuw === 0 ? (
            <div className="px-5 py-8 text-center">
              <PackageCheck className="w-8 h-8 text-gray-300 mx-auto" />
              <p className="text-sm text-gray-400 mt-2">Geen nieuwe bestellingen</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {orders
                .filter(o => o.status === 'nieuw')
                .slice(0, 5)
                .map(order => (
                  <div key={order.id} className="px-5 py-3.5 hover:bg-gray-50/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-800">{order.customer_name}</p>
                      <span className="text-xs text-gray-400">{order.order_number}</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">{order.postcode} {order.city}</p>
                    {order.products?.length > 0 && (
                      <p className="text-xs text-gray-500 mt-1">
                        {order.products.map(p => `${p.quantity}x ${p.title}`).join(', ')}
                      </p>
                    )}
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
