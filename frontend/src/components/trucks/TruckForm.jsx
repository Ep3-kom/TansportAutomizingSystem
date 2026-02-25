import { useState, useEffect } from 'react'
import { Search, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import { fetchRdwData } from '../../hooks/useTrucks'

const STATUS_OPTIONS = [
  { value: 'beschikbaar', label: 'Beschikbaar' },
  { value: 'onderhoud', label: 'Onderhoud' },
  { value: 'defect', label: 'Defect' },
]

export default function TruckForm({ truck, onSubmit, onCancel, loading }) {
  const [formData, setFormData] = useState({
    license_plate: '',
    brand_model: '',
    apk_expiry: '',
    weight: '',
    mileage: '',
    status: 'beschikbaar',
    notes: '',
  })
  const [rdwLoading, setRdwLoading] = useState(false)
  const [rdwStatus, setRdwStatus] = useState(null) // 'success' | 'error' | null
  const [rdwMessage, setRdwMessage] = useState('')

  useEffect(() => {
    if (truck) {
      setFormData({
        license_plate: truck.license_plate || '',
        brand_model: truck.brand_model || '',
        apk_expiry: truck.apk_expiry || '',
        weight: truck.weight || '',
        mileage: truck.mileage || '',
        status: truck.status || 'beschikbaar',
        notes: truck.notes || '',
      })
    }
  }, [truck])

  function handleChange(e) {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
    // Reset RDW status when license plate changes
    if (e.target.name === 'license_plate') {
      setRdwStatus(null)
      setRdwMessage('')
    }
  }

  async function handleRdwLookup() {
    if (!formData.license_plate.trim()) return

    setRdwLoading(true)
    setRdwStatus(null)
    setRdwMessage('')

    const { data, error } = await fetchRdwData(formData.license_plate)

    if (error) {
      setRdwStatus('error')
      setRdwMessage(error)
    } else {
      setFormData(prev => ({
        ...prev,
        brand_model: data.brand_model || prev.brand_model,
        apk_expiry: data.apk_expiry || prev.apk_expiry,
        weight: data.weight || prev.weight,
      }))
      setRdwStatus('success')
      setRdwMessage(`${data.brand_model} gevonden`)
    }

    setRdwLoading(false)
  }

  function handleSubmit(e) {
    e.preventDefault()
    const submitData = {
      ...formData,
      license_plate: formData.license_plate.replace(/[\s-]/g, '').toUpperCase(),
      weight: formData.weight ? Number(formData.weight) : null,
      mileage: formData.mileage ? Number(formData.mileage) : null,
      apk_expiry: formData.apk_expiry || null,
    }
    onSubmit(submitData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Kenteken + RDW ophalen */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Kenteken *</label>
        <div className="flex gap-2">
          <input
            type="text"
            name="license_plate"
            value={formData.license_plate}
            onChange={handleChange}
            placeholder="Bijv. 09BKK8"
            required
            className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-300 transition-all"
          />
          <button
            type="button"
            onClick={handleRdwLookup}
            disabled={rdwLoading || !formData.license_plate.trim()}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-accent-500 rounded-lg hover:bg-accent-600 transition-colors disabled:opacity-50"
          >
            {rdwLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Search className="w-4 h-4" />
            )}
            RDW Ophalen
          </button>
        </div>
        {rdwStatus && (
          <div className={`flex items-center gap-1.5 mt-2 text-xs ${rdwStatus === 'success' ? 'text-accent-600' : 'text-danger-500'}`}>
            {rdwStatus === 'success' ? <CheckCircle className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
            {rdwMessage}
          </div>
        )}
      </div>

      {/* Automatisch ingevulde velden */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Merk / Model</label>
          <input
            type="text"
            name="brand_model"
            value={formData.brand_model}
            onChange={handleChange}
            placeholder="Wordt opgehaald via RDW..."
            readOnly={rdwStatus === 'success'}
            className={`w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-300 transition-all ${rdwStatus === 'success' ? 'bg-accent-50/50' : 'bg-gray-50'}`}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Gewicht (kg)</label>
          <input
            type="number"
            name="weight"
            value={formData.weight}
            onChange={handleChange}
            placeholder="Wordt opgehaald via RDW..."
            readOnly={rdwStatus === 'success'}
            className={`w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-300 transition-all ${rdwStatus === 'success' ? 'bg-accent-50/50' : 'bg-gray-50'}`}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">APK Vervaldatum</label>
          <input
            type="date"
            name="apk_expiry"
            value={formData.apk_expiry}
            onChange={handleChange}
            readOnly={rdwStatus === 'success'}
            className={`w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-300 transition-all ${rdwStatus === 'success' ? 'bg-accent-50/50' : 'bg-gray-50'}`}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Kilometerstand</label>
          <input
            type="number"
            name="mileage"
            value={formData.mileage}
            onChange={handleChange}
            placeholder="Bijv. 150000"
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-300 transition-all"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Status</label>
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-300 transition-all"
        >
          {STATUS_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Opmerkingen</label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          placeholder="Optionele opmerkingen..."
          rows={3}
          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-300 transition-all resize-none"
        />
      </div>

      <div className="flex gap-3 pt-2 justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Annuleren
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2.5 text-sm font-medium text-white bg-primary-500 rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50"
        >
          {loading ? 'Opslaan...' : truck ? 'Bijwerken' : 'Toevoegen'}
        </button>
      </div>
    </form>
  )
}
