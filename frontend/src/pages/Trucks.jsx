import { useState } from 'react'
import { Truck, Plus, Search, Pencil, Trash2, Calendar, Weight, Gauge } from 'lucide-react'
import { useTrucks } from '../hooks/useTrucks'
import Modal from '../components/ui/Modal'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import TruckForm from '../components/trucks/TruckForm'

const statusColors = {
  beschikbaar: 'bg-accent-100 text-accent-500',
  onderhoud: 'bg-warn-100 text-warn-500',
  defect: 'bg-danger-100 text-danger-500',
}

function getApkWarning(apk_expiry) {
  if (!apk_expiry) return null
  const today = new Date()
  const expiry = new Date(apk_expiry)
  const diffDays = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24))
  if (diffDays < 0) return { label: 'Verlopen', color: 'text-danger-500' }
  if (diffDays <= 30) return { label: `${diffDays} dagen`, color: 'text-warn-500' }
  return null
}

export default function Trucks() {
  const { trucks, loading, addTruck, updateTruck, deleteTruck } = useTrucks()
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingTruck, setEditingTruck] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [saving, setSaving] = useState(false)

  const filtered = trucks.filter(t =>
    t.license_plate?.toLowerCase().includes(search.toLowerCase()) ||
    t.brand_model?.toLowerCase().includes(search.toLowerCase())
  )

  async function handleSubmit(formData) {
    setSaving(true)
    if (editingTruck) {
      await updateTruck(editingTruck.id, formData)
    } else {
      await addTruck(formData)
    }
    setSaving(false)
    setModalOpen(false)
    setEditingTruck(null)
  }

  async function handleDelete() {
    if (deleteTarget) {
      await deleteTruck(deleteTarget.id)
      setDeleteTarget(null)
    }
  }

  function openAdd() {
    setEditingTruck(null)
    setModalOpen(true)
  }

  function openEdit(truck) {
    setEditingTruck(truck)
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
          <h2 className="text-2xl font-bold text-gray-800">Voertuigen</h2>
          <p className="text-sm text-gray-500 mt-1">{trucks.length} voertuig{trucks.length !== 1 ? 'en' : ''} totaal</p>
        </div>
        <button
          onClick={openAdd}
          className="inline-flex items-center gap-2 bg-primary-500 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-primary-600 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Voertuig Toevoegen
        </button>
      </div>

      {/* Zoekbalk */}
      {trucks.length > 0 && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Zoek op kenteken of merk..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-300 transition-all"
          />
        </div>
      )}

      {/* Lege staat */}
      {trucks.length === 0 && (
        <div className="bg-card rounded-xl border border-gray-100 p-12 text-center">
          <div className="w-14 h-14 bg-accent-50 rounded-2xl flex items-center justify-center mx-auto">
            <Truck className="w-7 h-7 text-accent-400" />
          </div>
          <h3 className="mt-4 text-lg font-semibold text-gray-700">Nog geen voertuigen</h3>
          <p className="text-sm text-gray-400 mt-1 max-w-sm mx-auto">
            Voeg je eerste voertuig toe om je wagenpark te beheren.
          </p>
        </div>
      )}

      {/* Voertuigen lijst */}
      {filtered.length > 0 && (
        <div className="bg-card rounded-xl border border-gray-100 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3">Kenteken</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3">Merk / Model</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3">Gewicht</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3">Km-stand</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3">APK</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3">Status</th>
                <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3">Acties</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((truck) => {
                const apkWarning = getApkWarning(truck.apk_expiry)
                return (
                  <tr key={truck.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-accent-50 rounded-lg flex items-center justify-center">
                          <Truck className="w-4 h-4 text-accent-500" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-800 font-mono">{truck.license_plate}</p>
                          {truck.notes && <p className="text-xs text-gray-400 truncate max-w-48">{truck.notes}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-sm text-gray-600">{truck.brand_model || '-'}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1.5 text-sm text-gray-600">
                        <Weight className="w-3.5 h-3.5 text-gray-400" />
                        {truck.weight ? `${truck.weight.toLocaleString('nl-NL')} kg` : '-'}
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1.5 text-sm text-gray-600">
                        <Gauge className="w-3.5 h-3.5 text-gray-400" />
                        {truck.mileage ? `${truck.mileage.toLocaleString('nl-NL')} km` : '-'}
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {truck.apk_expiry ? new Date(truck.apk_expiry).toLocaleDateString('nl-NL') : '-'}
                        </span>
                        {apkWarning && (
                          <span className={`text-xs font-medium ${apkWarning.color}`}>
                            ({apkWarning.label})
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[truck.status] || ''}`}>
                        {truck.status?.charAt(0).toUpperCase() + truck.status?.slice(1)}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEdit(truck)}
                          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <Pencil className="w-4 h-4 text-gray-400" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(truck)}
                          className="p-2 rounded-lg hover:bg-danger-50 transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-gray-400 hover:text-danger-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Geen resultaten bij zoeken */}
      {trucks.length > 0 && filtered.length === 0 && (
        <div className="bg-card rounded-xl border border-gray-100 p-8 text-center">
          <p className="text-sm text-gray-500">Geen voertuigen gevonden voor "{search}"</p>
        </div>
      )}

      {/* Modal voor toevoegen/bewerken */}
      <Modal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditingTruck(null) }}
        title={editingTruck ? 'Voertuig Bewerken' : 'Voertuig Toevoegen'}
      >
        <TruckForm
          truck={editingTruck}
          onSubmit={handleSubmit}
          onCancel={() => { setModalOpen(false); setEditingTruck(null) }}
          loading={saving}
        />
      </Modal>

      {/* Bevestiging voor verwijderen */}
      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Voertuig verwijderen"
        message={`Weet je zeker dat je "${deleteTarget?.license_plate}" wilt verwijderen? Dit kan niet ongedaan worden.`}
      />
    </div>
  )
}
