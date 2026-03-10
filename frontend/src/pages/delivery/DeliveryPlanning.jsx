import { useState, useMemo } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  Package,
  MapPin,
  Phone,
  Navigation,
  GripVertical,
  Calendar,
} from 'lucide-react'
import { useOrders } from '../../hooks/useOrders'
import { useDeliveryRoutes } from '../../hooks/useDeliveryRoutes'

const statusColors = {
  nieuw: 'bg-primary-50 border-primary-200 text-primary-700',
  ingepland: 'bg-warn-50 border-warn-200 text-warn-700',
  onderweg: 'bg-purple-50 border-purple-200 text-purple-700',
  bezorgd: 'bg-accent-50 border-accent-200 text-accent-700',
}

export default function DeliveryPlanning() {
  const { orders, planOrder, unplanOrder, updateOrderStatus, loading: ordersLoading } = useOrders()
  const { getGoogleMapsUrl } = useDeliveryRoutes()

  const [currentDate, setCurrentDate] = useState(new Date())
  const [view, setView] = useState('week') // 'week' | 'day'
  const [dragOrder, setDragOrder] = useState(null)

  // Week berekenen
  const weekStart = useMemo(() => {
    const d = new Date(currentDate)
    const day = d.getDay()
    const diff = d.getDate() - day + (day === 0 ? -6 : 1) // maandag
    d.setDate(diff)
    d.setHours(0, 0, 0, 0)
    return d
  }, [currentDate])

  const weekDays = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(weekStart)
      d.setDate(d.getDate() + i)
      return {
        date: d,
        dateStr: d.toISOString().split('T')[0],
        dayName: d.toLocaleDateString('nl-NL', { weekday: 'short' }),
        dayNum: d.getDate(),
        monthName: d.toLocaleDateString('nl-NL', { month: 'short' }),
        isToday: d.toISOString().split('T')[0] === new Date().toISOString().split('T')[0],
        isWeekend: d.getDay() === 0 || d.getDay() === 6,
      }
    })
  }, [weekStart])

  const selectedDateStr = currentDate.toISOString().split('T')[0]

  // Ongeplande orders
  const unplannedOrders = orders.filter(o => !o.planned_date && o.status === 'nieuw')

  // Orders per dag
  function getOrdersForDate(dateStr) {
    return orders
      .filter(o => o.planned_date === dateStr && o.status !== 'geannuleerd')
      .sort((a, b) => (a.planned_position || 0) - (b.planned_position || 0))
  }

  // Navigatie
  function navigateWeek(dir) {
    const d = new Date(currentDate)
    d.setDate(d.getDate() + (dir * 7))
    setCurrentDate(d)
  }

  function goToToday() {
    setCurrentDate(new Date())
  }

  // Drag & Drop
  function handleDragStart(order) {
    setDragOrder(order)
  }

  function handleDrop(dateStr) {
    if (!dragOrder) return
    planOrder(dragOrder.id, dateStr, null)
    setDragOrder(null)
  }

  function handleDragOver(e) {
    e.preventDefault()
  }

  // Google Maps URL voor een dag
  function openInMaps(dateStr) {
    const dayOrders = getOrdersForDate(dateStr)
    const url = getGoogleMapsUrl(dayOrders)
    if (url) window.open(url, '_blank')
  }

  const loading = ordersLoading

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-3 border-primary-200 border-t-primary-500 rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Planning</h2>
          <p className="text-sm text-gray-500 mt-1">Sleep bestellingen naar een dag om ze in te plannen</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setView('week')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium ${view === 'week' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500'}`}
            >
              Week
            </button>
            <button
              onClick={() => setView('day')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium ${view === 'day' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500'}`}
            >
              Dag
            </button>
          </div>
        </div>
      </div>

      {/* Navigatie */}
      <div className="flex items-center justify-between bg-card rounded-xl border border-gray-100 px-5 py-3">
        <button onClick={() => navigateWeek(-1)} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
          <ChevronLeft className="w-5 h-5 text-gray-500" />
        </button>
        <div className="flex items-center gap-3">
          <h3 className="text-sm font-semibold text-gray-800">
            {view === 'week'
              ? `${weekDays[0].dayNum} ${weekDays[0].monthName} - ${weekDays[6].dayNum} ${weekDays[6].monthName} ${weekDays[6].date.getFullYear()}`
              : currentDate.toLocaleDateString('nl-NL', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
            }
          </h3>
          <button onClick={goToToday} className="text-xs text-primary-500 hover:text-primary-700 font-medium">
            Vandaag
          </button>
        </div>
        <button onClick={() => navigateWeek(1)} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
          <ChevronRight className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Ongeplande orders (sidebar) */}
        <div className="lg:col-span-1">
          <div className="bg-card rounded-xl border border-gray-100 overflow-hidden sticky top-6">
            <div className="px-4 py-3 border-b border-gray-50">
              <h3 className="text-sm font-semibold text-gray-800">Ongepland</h3>
              <p className="text-xs text-gray-400">{unplannedOrders.length} bestelling{unplannedOrders.length !== 1 ? 'en' : ''}</p>
            </div>
            <div className="max-h-[60vh] overflow-y-auto divide-y divide-gray-50">
              {unplannedOrders.length === 0 ? (
                <div className="px-4 py-6 text-center">
                  <Package className="w-6 h-6 text-gray-300 mx-auto" />
                  <p className="text-xs text-gray-400 mt-2">Alles ingepland</p>
                </div>
              ) : (
                unplannedOrders.map(order => (
                  <div
                    key={order.id}
                    draggable
                    onDragStart={() => handleDragStart(order)}
                    className="px-4 py-3 hover:bg-gray-50 cursor-grab active:cursor-grabbing transition-colors"
                  >
                    <div className="flex items-start gap-2">
                      <GripVertical className="w-4 h-4 text-gray-300 mt-0.5 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate">{order.customer_name}</p>
                        <p className="text-xs text-gray-400 truncate">{order.postcode} {order.city}</p>
                        {order.products?.length > 0 && (
                          <p className="text-xs text-gray-500 mt-0.5 truncate">
                            {order.products.map(p => p.title).join(', ')}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Kalender */}
        <div className="lg:col-span-3">
          {view === 'week' ? (
            // Weekweergave
            <div className="grid grid-cols-7 gap-2">
              {weekDays.map(day => {
                const dayOrders = getOrdersForDate(day.dateStr)
                return (
                  <div
                    key={day.dateStr}
                    onDragOver={handleDragOver}
                    onDrop={() => handleDrop(day.dateStr)}
                    className={`bg-card rounded-xl border overflow-hidden min-h-[200px] transition-colors ${
                      day.isToday
                        ? 'border-primary-300 ring-1 ring-primary-100'
                        : day.isWeekend
                        ? 'border-gray-100 bg-gray-50/50'
                        : 'border-gray-100'
                    } ${dragOrder ? 'border-dashed border-primary-300' : ''}`}
                  >
                    {/* Dag header */}
                    <div className={`px-2.5 py-2 border-b text-center ${day.isToday ? 'bg-primary-50 border-primary-100' : 'border-gray-50'}`}>
                      <p className={`text-xs font-medium uppercase ${day.isToday ? 'text-primary-600' : 'text-gray-400'}`}>
                        {day.dayName}
                      </p>
                      <p className={`text-lg font-bold ${day.isToday ? 'text-primary-700' : 'text-gray-800'}`}>
                        {day.dayNum}
                      </p>
                    </div>

                    {/* Orders */}
                    <div className="p-1.5 space-y-1">
                      {dayOrders.map((order, idx) => (
                        <div
                          key={order.id}
                          draggable
                          onDragStart={() => handleDragStart(order)}
                          className={`p-2 rounded-lg border text-xs cursor-grab active:cursor-grabbing ${statusColors[order.status] || 'bg-gray-50 border-gray-200'}`}
                        >
                          <p className="font-medium truncate">{order.customer_name}</p>
                          <p className="text-[10px] opacity-70 truncate">{order.postcode} {order.city}</p>
                        </div>
                      ))}

                      {dayOrders.length > 0 && (
                        <button
                          onClick={() => openInMaps(day.dateStr)}
                          className="w-full flex items-center justify-center gap-1 py-1.5 text-[10px] text-primary-500 hover:text-primary-700 font-medium rounded-lg hover:bg-primary-50 transition-colors"
                        >
                          <Navigation className="w-3 h-3" />
                          Route
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            // Dagweergave
            <div className="bg-card rounded-xl border border-gray-100 overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
                <div className="flex items-center gap-3">
                  <button onClick={() => {
                    const d = new Date(currentDate)
                    d.setDate(d.getDate() - 1)
                    setCurrentDate(d)
                  }} className="p-1 hover:bg-gray-100 rounded">
                    <ChevronLeft className="w-4 h-4 text-gray-500" />
                  </button>
                  <h3 className="text-sm font-semibold text-gray-800">
                    {currentDate.toLocaleDateString('nl-NL', { weekday: 'long', day: 'numeric', month: 'long' })}
                  </h3>
                  <button onClick={() => {
                    const d = new Date(currentDate)
                    d.setDate(d.getDate() + 1)
                    setCurrentDate(d)
                  }} className="p-1 hover:bg-gray-100 rounded">
                    <ChevronRight className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
                {getOrdersForDate(selectedDateStr).length > 0 && (
                  <button
                    onClick={() => openInMaps(selectedDateStr)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-primary-500 hover:text-primary-700 font-medium rounded-lg hover:bg-primary-50 transition-colors"
                  >
                    <Navigation className="w-4 h-4" />
                    Open route in Google Maps
                  </button>
                )}
              </div>

              <div
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(selectedDateStr)}
                className={`min-h-[300px] ${dragOrder ? 'bg-primary-50/30' : ''}`}
              >
                {getOrdersForDate(selectedDateStr).length === 0 ? (
                  <div className="px-5 py-12 text-center">
                    <Calendar className="w-8 h-8 text-gray-300 mx-auto" />
                    <p className="text-sm text-gray-400 mt-2">Geen bezorgingen voor deze dag</p>
                    <p className="text-xs text-gray-300 mt-1">Sleep bestellingen hierheen om ze in te plannen</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-50">
                    {getOrdersForDate(selectedDateStr).map((order, index) => (
                      <div key={order.id} className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50/50 transition-colors">
                        <div className="w-8 h-8 bg-primary-50 rounded-lg flex items-center justify-center text-sm font-bold text-primary-500 flex-shrink-0">
                          {index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium text-gray-800">{order.customer_name}</p>
                            {order.order_number && <span className="text-xs text-gray-400">{order.order_number}</span>}
                          </div>
                          <div className="flex items-center gap-3 text-xs text-gray-400 mt-0.5">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {order.address}, {order.postcode} {order.city}
                            </span>
                            {order.customer_phone && (
                              <a href={`tel:${order.customer_phone}`} className="flex items-center gap-1 text-primary-500">
                                <Phone className="w-3 h-3" />
                                {order.customer_phone}
                              </a>
                            )}
                          </div>
                          {order.products?.length > 0 && (
                            <p className="text-xs text-gray-500 mt-1">
                              {order.products.map(p => `${p.quantity}x ${p.title}`).join(', ')}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {order.status === 'ingepland' && (
                            <button
                              onClick={() => updateOrderStatus(order.id, 'bezorgd')}
                              className="px-3 py-1.5 bg-accent-500 text-white text-xs font-medium rounded-lg hover:bg-accent-600 transition-colors"
                            >
                              Bezorgd
                            </button>
                          )}
                          <button
                            onClick={() => unplanOrder(order.id)}
                            className="px-3 py-1.5 text-xs text-gray-500 hover:text-danger-500 font-medium rounded-lg hover:bg-danger-50 transition-colors"
                          >
                            Verwijder
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
