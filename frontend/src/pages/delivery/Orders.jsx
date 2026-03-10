import { useState } from 'react'
import {
  Package,
  Search,
  Plus,
  MapPin,
  Phone,
  Mail,
  ChevronDown,
  X,
  Trash2,
  Calendar,
  Eye,
} from 'lucide-react'
import { useOrders } from '../../hooks/useOrders'

const statusColors = {
  nieuw: 'bg-primary-50 text-primary-600 border-primary-200',
  ingepland: 'bg-warn-50 text-warn-600 border-warn-200',
  onderweg: 'bg-purple-50 text-purple-600 border-purple-200',
  bezorgd: 'bg-accent-50 text-accent-600 border-accent-200',
  geannuleerd: 'bg-gray-50 text-gray-500 border-gray-200',
}

const statusLabels = {
  nieuw: 'Nieuw',
  ingepland: 'Ingepland',
  onderweg: 'Onderweg',
  bezorgd: 'Bezorgd',
  geannuleerd: 'Geannuleerd',
}

const allStatuses = ['nieuw', 'ingepland', 'onderweg', 'bezorgd', 'geannuleerd']

export default function Orders() {
  const { orders, loading, addOrder, updateOrderStatus, deleteOrder } = useOrders()
  const [filter, setFilter] = useState('alle')
  const [search, setSearch] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(null)
  const [newOrder, setNewOrder] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    address: '',
    postcode: '',
    city: '',
    products: '',
    notes: '',
    order_number: '',
  })
  const [saving, setSaving] = useState(false)

  const filteredOrders = orders
    .filter(o => filter === 'alle' || o.status === filter)
    .filter(o => {
      if (!search) return true
      const q = search.toLowerCase()
      return (
        o.customer_name?.toLowerCase().includes(q) ||
        o.postcode?.toLowerCase().includes(q) ||
        o.city?.toLowerCase().includes(q) ||
        o.order_number?.toLowerCase().includes(q) ||
        o.address?.toLowerCase().includes(q)
      )
    })

  async function handleAddOrder(e) {
    e.preventDefault()
    setSaving(true)

    const products = newOrder.products
      ? newOrder.products.split(',').map(p => ({ title: p.trim(), quantity: 1 }))
      : []

    await addOrder({
      customer_name: newOrder.customer_name,
      customer_email: newOrder.customer_email,
      customer_phone: newOrder.customer_phone,
      address: newOrder.address,
      postcode: newOrder.postcode,
      city: newOrder.city,
      products,
      notes: newOrder.notes,
      order_number: newOrder.order_number || `#M-${Date.now().toString().slice(-6)}`,
    })

    setNewOrder({ customer_name: '', customer_email: '', customer_phone: '', address: '', postcode: '', city: '', products: '', notes: '', order_number: '' })
    setShowAddModal(false)
    setSaving(false)
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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">Bestellingen</h2>
          <p className="text-sm text-gray-500 mt-1">{orders.length} bestelling{orders.length !== 1 ? 'en' : ''} totaal</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary-600 text-white text-sm font-medium rounded-xl hover:bg-primary-700 hover:-translate-y-px shadow-sm transition-all duration-200"
        >
          <Plus className="w-4 h-4" />
          Bestelling toevoegen
        </button>
      </div>

      {/* Filters + zoeken */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Zoek op naam, postcode, stad..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm text-gray-700 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-300 transition-all duration-200"
          />
        </div>
        <div className="flex gap-1 bg-gray-100 p-1 rounded-lg overflow-x-auto">
          <button
            onClick={() => setFilter('alle')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-all ${
              filter === 'alle' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Alle ({orders.length})
          </button>
          {allStatuses.map(status => {
            const count = orders.filter(o => o.status === status).length
            if (count === 0 && status === 'geannuleerd') return null
            return (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-all ${
                  filter === status ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {statusLabels[status]} ({count})
              </button>
            )
          })}
        </div>
      </div>

      {/* Orders lijst */}
      <div className="bg-card rounded-xl border border-gray-100/80 shadow-card overflow-hidden">
        {filteredOrders.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <Package className="w-10 h-10 text-gray-300 mx-auto" />
            <p className="text-sm text-gray-400 mt-3">
              {search ? 'Geen bestellingen gevonden' : 'Nog geen bestellingen'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {filteredOrders.map(order => (
              <div key={order.id} className="flex items-center justify-between px-5 py-4 hover:bg-stone-50/50 transition-colors duration-150">
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Package className="w-4 h-4 text-gray-400" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-gray-800">{order.customer_name}</p>
                      {order.order_number && (
                        <span className="text-xs text-gray-400">{order.order_number}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-400 mt-0.5">
                      <span className="flex items-center gap-1 truncate">
                        <MapPin className="w-3 h-3 flex-shrink-0" />
                        {order.address}, {order.postcode} {order.city}
                      </span>
                      {order.planned_date && (
                        <span className="flex items-center gap-1 flex-shrink-0">
                          <Calendar className="w-3 h-3" />
                          {new Date(order.planned_date).toLocaleDateString('nl-NL', { day: 'numeric', month: 'short' })}
                        </span>
                      )}
                    </div>
                    {order.products?.length > 0 && (
                      <p className="text-xs text-gray-500 mt-1 truncate">
                        {order.products.map(p => `${p.quantity}x ${p.title}`).join(', ')}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                  {/* Status dropdown */}
                  <div className="relative group">
                    <button className={`text-xs font-medium px-2.5 py-1 rounded-full border flex items-center gap-1 ${statusColors[order.status]}`}>
                      {statusLabels[order.status]}
                      <ChevronDown className="w-3 h-3" />
                    </button>
                    <div className="absolute right-0 top-full mt-1 bg-white rounded-lg border border-gray-200 shadow-lg z-10 py-1 w-36 hidden group-hover:block">
                      {allStatuses.filter(s => s !== order.status).map(status => (
                        <button
                          key={status}
                          onClick={() => updateOrderStatus(order.id, status)}
                          className="w-full text-left px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-50"
                        >
                          {statusLabels[status]}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Detail knop */}
                  <button
                    onClick={() => setShowDetailModal(order)}
                    className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                  </button>

                  {/* Verwijder knop */}
                  <button
                    onClick={() => {
                      if (window.confirm('Weet je zeker dat je deze bestelling wilt verwijderen?')) {
                        deleteOrder(order.id)
                      }
                    }}
                    className="p-1.5 text-gray-400 hover:text-danger-500 rounded-lg hover:bg-danger-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {showDetailModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowDetailModal(null)}>
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-card-lg border border-gray-100/80" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100/80">
              <h3 className="font-semibold text-gray-800">Bestelling {showDetailModal.order_number}</h3>
              <button onClick={() => setShowDetailModal(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-400">Klant</p>
                  <p className="text-sm font-medium text-gray-800">{showDetailModal.customer_name}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Status</p>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColors[showDetailModal.status]}`}>
                    {statusLabels[showDetailModal.status]}
                  </span>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-400">Adres</p>
                <p className="text-sm text-gray-700">{showDetailModal.address}</p>
                <p className="text-sm text-gray-700">{showDetailModal.postcode} {showDetailModal.city}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {showDetailModal.customer_phone && (
                  <div>
                    <p className="text-xs text-gray-400 flex items-center gap-1"><Phone className="w-3 h-3" /> Telefoon</p>
                    <a href={`tel:${showDetailModal.customer_phone}`} className="text-sm text-primary-500">{showDetailModal.customer_phone}</a>
                  </div>
                )}
                {showDetailModal.customer_email && (
                  <div>
                    <p className="text-xs text-gray-400 flex items-center gap-1"><Mail className="w-3 h-3" /> Email</p>
                    <a href={`mailto:${showDetailModal.customer_email}`} className="text-sm text-primary-500">{showDetailModal.customer_email}</a>
                  </div>
                )}
              </div>
              {showDetailModal.products?.length > 0 && (
                <div>
                  <p className="text-xs text-gray-400 mb-2">Producten</p>
                  <div className="bg-gray-50 rounded-lg p-3 space-y-1">
                    {showDetailModal.products.map((p, i) => (
                      <div key={i} className="flex items-center justify-between text-sm">
                        <span className="text-gray-700">{p.quantity}x {p.title}</span>
                        {p.variant && <span className="text-xs text-gray-400">{p.variant}</span>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {showDetailModal.notes && (
                <div>
                  <p className="text-xs text-gray-400">Notities</p>
                  <p className="text-sm text-gray-700">{showDetailModal.notes}</p>
                </div>
              )}
              {showDetailModal.planned_date && (
                <div>
                  <p className="text-xs text-gray-400">Geplande bezorgdatum</p>
                  <p className="text-sm text-gray-700">
                    {new Date(showDetailModal.planned_date).toLocaleDateString('nl-NL', { weekday: 'long', day: 'numeric', month: 'long' })}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Toevoegen Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowAddModal(false)}>
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-card-lg border border-gray-100/80" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100/80">
              <h3 className="font-semibold text-gray-800">Bestelling toevoegen</h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddOrder} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Klantnaam *</label>
                  <input
                    type="text"
                    value={newOrder.customer_name}
                    onChange={e => setNewOrder(p => ({ ...p, customer_name: e.target.value }))}
                    required
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-300 transition-all duration-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Telefoon</label>
                  <input
                    type="tel"
                    value={newOrder.customer_phone}
                    onChange={e => setNewOrder(p => ({ ...p, customer_phone: e.target.value }))}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-300 transition-all duration-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={newOrder.customer_email}
                    onChange={e => setNewOrder(p => ({ ...p, customer_email: e.target.value }))}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-300 transition-all duration-200"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Adres *</label>
                  <input
                    type="text"
                    value={newOrder.address}
                    onChange={e => setNewOrder(p => ({ ...p, address: e.target.value }))}
                    required
                    placeholder="Straatnaam 123"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-300 transition-all duration-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Postcode *</label>
                  <input
                    type="text"
                    value={newOrder.postcode}
                    onChange={e => setNewOrder(p => ({ ...p, postcode: e.target.value }))}
                    required
                    placeholder="1234 AB"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-300 transition-all duration-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stad *</label>
                  <input
                    type="text"
                    value={newOrder.city}
                    onChange={e => setNewOrder(p => ({ ...p, city: e.target.value }))}
                    required
                    placeholder="Amsterdam"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-300 transition-all duration-200"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Producten</label>
                  <input
                    type="text"
                    value={newOrder.products}
                    onChange={e => setNewOrder(p => ({ ...p, products: e.target.value }))}
                    placeholder="Boxspring 180x200, Matras (komma-gescheiden)"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-300 transition-all duration-200"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notities</label>
                  <textarea
                    value={newOrder.notes}
                    onChange={e => setNewOrder(p => ({ ...p, notes: e.target.value }))}
                    rows={2}
                    placeholder="Bijv. 2e verdieping, geen lift"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-300 transition-all duration-200 resize-none"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Annuleren
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-primary-600 text-white text-sm font-medium rounded-xl hover:bg-primary-700 hover:-translate-y-px shadow-sm disabled:opacity-50 transition-all duration-200"
                >
                  {saving ? 'Opslaan...' : 'Opslaan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
