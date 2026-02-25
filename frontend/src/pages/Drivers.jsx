import { useState } from 'react'
import { Users, Plus, Search, Pencil, Trash2, Phone } from 'lucide-react'
import { useDrivers } from '../hooks/useDrivers'
import Modal from '../components/ui/Modal'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import DriverForm from '../components/drivers/DriverForm'

const statusColors = {
  actief: 'bg-accent-100 text-accent-500',
  verlof: 'bg-warn-100 text-warn-500',
  ziek: 'bg-danger-100 text-danger-500',
}

export default function Drivers() {
  const { drivers, loading, addDriver, updateDriver, deleteDriver } = useDrivers()
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingDriver, setEditingDriver] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [saving, setSaving] = useState(false)

  const filtered = drivers.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.phone?.toLowerCase().includes(search.toLowerCase())
  )

  async function handleSubmit(formData) {
    setSaving(true)
    if (editingDriver) {
      await updateDriver(editingDriver.id, formData)
    } else {
      await addDriver(formData)
    }
    setSaving(false)
    setModalOpen(false)
    setEditingDriver(null)
  }

  async function handleDelete() {
    if (deleteTarget) {
      await deleteDriver(deleteTarget.id)
      setDeleteTarget(null)
    }
  }

  function openAdd() {
    setEditingDriver(null)
    setModalOpen(true)
  }

  function openEdit(driver) {
    setEditingDriver(driver)
    setModalOpen(true)
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Chauffeurs</h2>
          <p className="text-sm text-gray-500 mt-1">{drivers.length} chauffeur{drivers.length !== 1 ? 's' : ''} totaal</p>
        </div>
        <button
          onClick={openAdd}
          className="inline-flex items-center gap-2 bg-primary-500 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-primary-600 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Chauffeur Toevoegen
        </button>
      </div>

      {/* Zoekbalk */}
      {drivers.length > 0 && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Zoek op naam of telefoon..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-300 transition-all"
          />
        </div>
      )}

      {/* Lege staat */}
      {drivers.length === 0 && (
        <div className="bg-card rounded-xl border border-gray-100 p-12 text-center">
          <div className="w-14 h-14 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto">
            <Users className="w-7 h-7 text-primary-400" />
          </div>
          <h3 className="mt-4 text-lg font-semibold text-gray-700">Nog geen chauffeurs</h3>
          <p className="text-sm text-gray-400 mt-1 max-w-sm mx-auto">
            Voeg je eerste chauffeur toe om te beginnen met plannen.
          </p>
        </div>
      )}

      {/* Chauffeurs lijst */}
      {filtered.length > 0 && (
        <div className="bg-card rounded-xl border border-gray-100 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3">Naam</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3">Telefoon</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3">Rijbewijs</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3">Status</th>
                <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3">Acties</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((driver) => (
                <tr key={driver.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-primary-50 rounded-lg flex items-center justify-center">
                        <span className="text-sm font-semibold text-primary-600">
                          {driver.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">{driver.name}</p>
                        {driver.notes && <p className="text-xs text-gray-400 truncate max-w-48">{driver.notes}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1.5 text-sm text-gray-600">
                      <Phone className="w-3.5 h-3.5 text-gray-400" />
                      {driver.phone || '-'}
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-sm text-gray-600 font-mono">{driver.license_type}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[driver.status] || ''}`}>
                      {driver.status.charAt(0).toUpperCase() + driver.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => openEdit(driver)}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <Pencil className="w-4 h-4 text-gray-400" />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(driver)}
                        className="p-2 rounded-lg hover:bg-danger-50 transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-gray-400 hover:text-danger-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Geen resultaten bij zoeken */}
      {drivers.length > 0 && filtered.length === 0 && (
        <div className="bg-card rounded-xl border border-gray-100 p-8 text-center">
          <p className="text-sm text-gray-500">Geen chauffeurs gevonden voor "{search}"</p>
        </div>
      )}

      {/* Modal voor toevoegen/bewerken */}
      <Modal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditingDriver(null) }}
        title={editingDriver ? 'Chauffeur Bewerken' : 'Chauffeur Toevoegen'}
      >
        <DriverForm
          driver={editingDriver}
          onSubmit={handleSubmit}
          onCancel={() => { setModalOpen(false); setEditingDriver(null) }}
          loading={saving}
        />
      </Modal>

      {/* Bevestiging voor verwijderen */}
      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Chauffeur verwijderen"
        message={`Weet je zeker dat je "${deleteTarget?.name}" wilt verwijderen? Dit kan niet ongedaan worden.`}
      />
    </div>
  )
}
