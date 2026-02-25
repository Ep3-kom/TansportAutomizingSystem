import { useState, useEffect } from 'react'

export default function ScheduleForm({ schedule, drivers, onSubmit, onCancel, loading }) {
  const [formData, setFormData] = useState({
    driver_id: '',
    start_time: '08:00',
    end_time: '17:00',
    notes: '',
  })

  useEffect(() => {
    if (schedule) {
      setFormData({
        driver_id: schedule.driver_id || '',
        start_time: schedule.start_time || '08:00',
        end_time: schedule.end_time || '17:00',
        notes: schedule.notes || '',
      })
    }
  }, [schedule])

  function handleChange(e) {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    onSubmit(formData)
  }

  // Filter alleen actieve chauffeurs
  const activeDrivers = drivers.filter(d => d.status === 'actief')

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Chauffeur *</label>
        <select
          name="driver_id"
          value={formData.driver_id}
          onChange={handleChange}
          required
          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-300 transition-all"
        >
          <option value="">Selecteer chauffeur...</option>
          {activeDrivers.map(driver => (
            <option key={driver.id} value={driver.id}>{driver.name}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Starttijd *</label>
          <input
            type="time"
            name="start_time"
            value={formData.start_time}
            onChange={handleChange}
            required
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-300 transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Eindtijd *</label>
          <input
            type="time"
            name="end_time"
            value={formData.end_time}
            onChange={handleChange}
            required
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-300 transition-all"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Notities</label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          placeholder="Bijv. route, klant, bijzonderheden..."
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
          {loading ? 'Opslaan...' : schedule ? 'Bijwerken' : 'Inplannen'}
        </button>
      </div>
    </form>
  )
}
