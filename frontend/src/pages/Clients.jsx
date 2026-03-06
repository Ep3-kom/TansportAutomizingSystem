import { useState } from 'react'
import { Building2, Plus, Search, Pencil, Trash2, Phone, Mail, MapPin, User } from 'lucide-react'
import { useClients } from '../hooks/useClients'
import Modal from '../components/ui/Modal'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import ClientForm from '../components/clients/ClientForm'

export default function Clients() {
  const { clients, loading, addClient, updateClient, deleteClient } = useClients()
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingClient, setEditingClient] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [saving, setSaving] = useState(false)

  const filtered = clients.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.contact_person?.toLowerCase().includes(search.toLowerCase()) ||
    c.email?.toLowerCase().includes(search.toLowerCase()) ||
    c.phone?.toLowerCase().includes(search.toLowerCase())
  )

  async function handleSubmit(formData) {
    setSaving(true)
    if (editingClient) {
      await updateClient(editingClient.id, formData)
    } else {
      await addClient(formData)
    }
    setSaving(false)
    setModalOpen(false)
    setEditingClient(null)
  }

  async function handleDelete() {
    if (deleteTarget) {
      await deleteClient(deleteTarget.id)
      setDeleteTarget(null)
    }
  }

  function openAdd() {
    setEditingClient(null)
    setModalOpen(true)
  }

  function openEdit(client) {
    setEditingClient(client)
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
          <h2 className="text-2xl font-bold text-gray-800">Klanten</h2>
          <p className="text-sm text-gray-500 mt-1">{clients.length} klant{clients.length !== 1 ? 'en' : ''} totaal</p>
        </div>
        <button
          onClick={openAdd}
          className="inline-flex items-center gap-2 bg-primary-500 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-primary-600 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Klant Toevoegen
        </button>
      </div>

      {/* Zoekbalk */}
      {clients.length > 0 && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Zoek op naam, contactpersoon, e-mail of telefoon..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-300 transition-all"
          />
        </div>
      )}

      {/* Lege staat */}
      {clients.length === 0 && (
        <div className="bg-card rounded-xl border border-gray-100 p-12 text-center">
          <div className="w-14 h-14 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto">
            <Building2 className="w-7 h-7 text-primary-400" />
          </div>
          <h3 className="mt-4 text-lg font-semibold text-gray-700">Nog geen klanten</h3>
          <p className="text-sm text-gray-400 mt-1 max-w-sm mx-auto">
            Voeg je eerste klant toe om ritten te koppelen.
          </p>
        </div>
      )}

      {/* Klanten lijst */}
      {filtered.length > 0 && (
        <div className="bg-card rounded-xl border border-gray-100 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3">Bedrijf</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3">Contact</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3">E-mail</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3">Telefoon</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3">Adres</th>
                <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3">Acties</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((client) => (
                <tr key={client.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-primary-50 rounded-lg flex items-center justify-center">
                        <span className="text-sm font-semibold text-primary-600">
                          {client.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">{client.name}</p>
                        {client.notes && <p className="text-xs text-gray-400 truncate max-w-48">{client.notes}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1.5 text-sm text-gray-600">
                      <User className="w-3.5 h-3.5 text-gray-400" />
                      {client.contact_person || '-'}
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1.5 text-sm text-gray-600">
                      <Mail className="w-3.5 h-3.5 text-gray-400" />
                      {client.email || '-'}
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1.5 text-sm text-gray-600">
                      <Phone className="w-3.5 h-3.5 text-gray-400" />
                      {client.phone || '-'}
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1.5 text-sm text-gray-600">
                      <MapPin className="w-3.5 h-3.5 text-gray-400" />
                      <span className="truncate max-w-40">{client.address || '-'}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => openEdit(client)}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <Pencil className="w-4 h-4 text-gray-400" />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(client)}
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
      {clients.length > 0 && filtered.length === 0 && (
        <div className="bg-card rounded-xl border border-gray-100 p-8 text-center">
          <p className="text-sm text-gray-500">Geen klanten gevonden voor "{search}"</p>
        </div>
      )}

      {/* Modal voor toevoegen/bewerken */}
      <Modal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditingClient(null) }}
        title={editingClient ? 'Klant Bewerken' : 'Klant Toevoegen'}
      >
        <ClientForm
          client={editingClient}
          onSubmit={handleSubmit}
          onCancel={() => { setModalOpen(false); setEditingClient(null) }}
          loading={saving}
        />
      </Modal>

      {/* Bevestiging voor verwijderen */}
      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Klant verwijderen"
        message={`Weet je zeker dat je "${deleteTarget?.name}" wilt verwijderen? Dit kan niet ongedaan worden.`}
      />
    </div>
  )
}
