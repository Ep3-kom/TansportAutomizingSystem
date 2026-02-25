import { useState, useRef } from 'react'
import { CalendarDays, ChevronLeft, ChevronRight, Plus, GripVertical, Clock, Pencil, Trash2, StickyNote, X } from 'lucide-react'
import { useSchedules } from '../hooks/useSchedules'
import { useDrivers } from '../hooks/useDrivers'
import Modal from '../components/ui/Modal'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import ScheduleForm from '../components/planning/ScheduleForm'

const DAY_NAMES = ['Maandag', 'Dinsdag', 'Woensdag', 'Donderdag', 'Vrijdag', 'Zaterdag', 'Zondag']
const DAY_NAMES_SHORT = ['Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za', 'Zo']

// Helper: maandag van de huidige week
function getMonday(date) {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1)
  d.setDate(diff)
  d.setHours(0, 0, 0, 0)
  return d
}

function formatDate(date) {
  return date.toISOString().split('T')[0]
}

function formatDateShort(date) {
  return date.toLocaleDateString('nl-NL', { day: 'numeric', month: 'short' })
}

function isToday(date) {
  const today = new Date()
  return formatDate(date) === formatDate(today)
}

// Kleuren voor chauffeurs (cyclisch)
const DRIVER_COLORS = [
  { bg: 'bg-primary-50', border: 'border-primary-200', text: 'text-primary-700', accent: 'bg-primary-500' },
  { bg: 'bg-accent-50', border: 'border-green-200', text: 'text-green-700', accent: 'bg-accent-500' },
  { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700', accent: 'bg-purple-500' },
  { bg: 'bg-warn-50', border: 'border-amber-200', text: 'text-amber-700', accent: 'bg-amber-500' },
  { bg: 'bg-pink-50', border: 'border-pink-200', text: 'text-pink-700', accent: 'bg-pink-500' },
  { bg: 'bg-cyan-50', border: 'border-cyan-200', text: 'text-cyan-700', accent: 'bg-cyan-500' },
]

function getDriverColor(driverId, drivers) {
  const idx = drivers.findIndex(d => d.id === driverId)
  return DRIVER_COLORS[idx % DRIVER_COLORS.length]
}

export default function Planning() {
  const [weekStart, setWeekStart] = useState(() => getMonday(new Date()))
  const { schedules, loading, addSchedule, updateSchedule, deleteSchedule, moveSchedule } = useSchedules(weekStart)
  const { drivers } = useDrivers()

  const [modalOpen, setModalOpen] = useState(false)
  const [editingSchedule, setEditingSchedule] = useState(null)
  const [selectedDate, setSelectedDate] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [saving, setSaving] = useState(false)

  // Drag state
  const [draggedSchedule, setDraggedSchedule] = useState(null)
  const [dragOverDay, setDragOverDay] = useState(null)
  const [draggedDriver, setDraggedDriver] = useState(null)

  // Week navigatie
  function prevWeek() {
    const d = new Date(weekStart)
    d.setDate(d.getDate() - 7)
    setWeekStart(d)
  }

  function nextWeek() {
    const d = new Date(weekStart)
    d.setDate(d.getDate() + 7)
    setWeekStart(d)
  }

  function goToday() {
    setWeekStart(getMonday(new Date()))
  }

  // Dagen van de week genereren
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart)
    d.setDate(d.getDate() + i)
    return d
  })

  // Weeknummer
  const weekNumber = getWeekNumber(weekStart)

  // Schedules per dag groeperen
  function getSchedulesForDay(date) {
    const dateStr = formatDate(date)
    return schedules.filter(s => s.date === dateStr)
  }

  // Modal openen voor nieuwe schedule op een dag
  function openAddForDay(date) {
    setEditingSchedule(null)
    setSelectedDate(formatDate(date))
    setModalOpen(true)
  }

  // Modal openen voor bewerken
  function openEdit(schedule) {
    setEditingSchedule(schedule)
    setSelectedDate(schedule.date)
    setModalOpen(true)
  }

  // Submit handler
  async function handleSubmit(formData) {
    setSaving(true)
    if (editingSchedule) {
      await updateSchedule(editingSchedule.id, { ...formData, date: selectedDate })
    } else {
      await addSchedule({ ...formData, date: selectedDate })
    }
    setSaving(false)
    setModalOpen(false)
    setEditingSchedule(null)
    setSelectedDate(null)
  }

  // Delete handler
  async function handleDelete() {
    if (deleteTarget) {
      await deleteSchedule(deleteTarget.id)
      setDeleteTarget(null)
    }
  }

  // --- Drag & Drop: bestaande schedule verplaatsen ---
  function handleDragStart(e, schedule) {
    setDraggedSchedule(schedule)
    setDraggedDriver(null)
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('type', 'schedule')
    e.dataTransfer.setData('scheduleId', schedule.id)
  }

  // --- Drag & Drop: chauffeur vanuit sidebar ---
  function handleDriverDragStart(e, driver) {
    setDraggedDriver(driver)
    setDraggedSchedule(null)
    e.dataTransfer.effectAllowed = 'copy'
    e.dataTransfer.setData('type', 'driver')
    e.dataTransfer.setData('driverId', driver.id)
  }

  function handleDragOver(e, date) {
    e.preventDefault()
    e.dataTransfer.dropEffect = draggedSchedule ? 'move' : 'copy'
    setDragOverDay(formatDate(date))
  }

  function handleDragLeave() {
    setDragOverDay(null)
  }

  async function handleDrop(e, date) {
    e.preventDefault()
    setDragOverDay(null)
    const dateStr = formatDate(date)
    const type = e.dataTransfer.getData('type')

    if (type === 'schedule') {
      // Verplaats bestaande schedule naar nieuwe dag
      const scheduleId = e.dataTransfer.getData('scheduleId')
      if (draggedSchedule && draggedSchedule.date !== dateStr) {
        await moveSchedule(scheduleId, dateStr)
      }
    } else if (type === 'driver') {
      // Nieuwe schedule aanmaken voor deze chauffeur op deze dag
      const driverId = e.dataTransfer.getData('driverId')
      setEditingSchedule(null)
      setSelectedDate(dateStr)
      setModalOpen(true)
      // Pre-fill driver - we use a small trick via editingSchedule
      setEditingSchedule({ driver_id: driverId, start_time: '08:00', end_time: '17:00', notes: '', _isNew: true })
    }

    setDraggedSchedule(null)
    setDraggedDriver(null)
  }

  // Drag naar buiten = verwijder zone
  const [dragOverDelete, setDragOverDelete] = useState(false)

  function handleDeleteZoneDragOver(e) {
    e.preventDefault()
    if (draggedSchedule) {
      e.dataTransfer.dropEffect = 'move'
      setDragOverDelete(true)
    }
  }

  function handleDeleteZoneDrop(e) {
    e.preventDefault()
    setDragOverDelete(false)
    if (draggedSchedule) {
      setDeleteTarget(draggedSchedule)
      setDraggedSchedule(null)
    }
  }

  // Chauffeurs die nog niet ingepland zijn op een specifieke dag
  function getUnscheduledDrivers(date) {
    const dateStr = formatDate(date)
    const scheduledIds = schedules
      .filter(s => s.date === dateStr)
      .map(s => s.driver_id)
    return drivers.filter(d => d.status === 'actief' && !scheduledIds.includes(d.id))
  }

  // Alle actieve chauffeurs voor de sidebar
  const activeDrivers = drivers.filter(d => d.status === 'actief')

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-3 border-primary-200 border-t-primary-500 rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Planning</h2>
          <p className="text-sm text-gray-500 mt-1">Week {weekNumber} — sleep chauffeurs naar de kalender</p>
        </div>
      </div>

      {/* Week navigatie */}
      <div className="flex items-center gap-3">
        <button
          onClick={prevWeek}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>
        <button
          onClick={goToday}
          className="px-3 py-1.5 text-sm font-medium text-primary-600 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors"
        >
          Vandaag
        </button>
        <button
          onClick={nextWeek}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <ChevronRight className="w-5 h-5 text-gray-600" />
        </button>
        <span className="text-sm font-medium text-gray-700">
          {formatDateShort(weekDays[0])} — {formatDateShort(weekDays[6])}
        </span>
      </div>

      <div className="flex gap-4">
        {/* Sidebar: chauffeurs om te slepen */}
        <div className="w-48 shrink-0 space-y-2">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-1">Chauffeurs</h3>
          {activeDrivers.length === 0 && (
            <p className="text-xs text-gray-400 px-1">Geen actieve chauffeurs</p>
          )}
          {activeDrivers.map(driver => {
            const color = getDriverColor(driver.id, drivers)
            return (
              <div
                key={driver.id}
                draggable
                onDragStart={(e) => handleDriverDragStart(e, driver)}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border ${color.bg} ${color.border} cursor-grab active:cursor-grabbing transition-all hover:shadow-sm`}
              >
                <GripVertical className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                <div className="min-w-0">
                  <p className={`text-sm font-medium ${color.text} truncate`}>{driver.name}</p>
                </div>
              </div>
            )
          })}

          {/* Verwijder zone */}
          {draggedSchedule && (
            <div
              onDragOver={handleDeleteZoneDragOver}
              onDragLeave={() => setDragOverDelete(false)}
              onDrop={handleDeleteZoneDrop}
              className={`mt-4 flex items-center justify-center gap-2 px-3 py-4 rounded-lg border-2 border-dashed transition-all ${
                dragOverDelete
                  ? 'border-danger-400 bg-danger-50 text-danger-600'
                  : 'border-gray-300 bg-gray-50 text-gray-400'
              }`}
            >
              <Trash2 className="w-4 h-4" />
              <span className="text-xs font-medium">Hierheen slepen om te verwijderen</span>
            </div>
          )}
        </div>

        {/* Weekkalender */}
        <div className="flex-1 grid grid-cols-7 gap-2">
          {weekDays.map((day, idx) => {
            const dateStr = formatDate(day)
            const daySchedules = getSchedulesForDay(day)
            const today = isToday(day)
            const isDragOver = dragOverDay === dateStr

            return (
              <div
                key={dateStr}
                onDragOver={(e) => handleDragOver(e, day)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, day)}
                className={`rounded-xl border transition-all min-h-70 flex flex-col ${
                  today
                    ? 'border-primary-300 bg-primary-50/30'
                    : isDragOver
                    ? 'border-primary-300 bg-primary-50/20 shadow-sm'
                    : 'border-gray-100 bg-card'
                }`}
              >
                {/* Dag header */}
                <div className={`px-3 py-2 border-b ${today ? 'border-primary-200' : 'border-gray-100'}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className={`text-xs font-medium ${today ? 'text-primary-600' : 'text-gray-500'}`}>
                        {DAY_NAMES_SHORT[idx]}
                      </span>
                      <span className={`ml-1.5 text-sm font-semibold ${today ? 'text-primary-700' : 'text-gray-800'}`}>
                        {day.getDate()}
                      </span>
                    </div>
                    <button
                      onClick={() => openAddForDay(day)}
                      className="p-1 rounded-md hover:bg-gray-100 transition-colors"
                      title="Inplannen"
                    >
                      <Plus className="w-3.5 h-3.5 text-gray-400" />
                    </button>
                  </div>
                </div>

                {/* Schedule kaartjes */}
                <div className="flex-1 p-1.5 space-y-1.5 overflow-y-auto">
                  {daySchedules.map(schedule => {
                    const color = getDriverColor(schedule.driver_id, drivers)
                    const driverName = schedule.drivers?.name || 'Onbekend'

                    return (
                      <div
                        key={schedule.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, schedule)}
                        className={`group relative px-2.5 py-2 rounded-lg border ${color.bg} ${color.border} cursor-grab active:cursor-grabbing transition-all hover:shadow-sm`}
                      >
                        {/* Kleur accent */}
                        <div className={`absolute left-0 top-2 bottom-2 w-1 rounded-full ${color.accent}`} />

                        <div className="pl-2">
                          <p className={`text-xs font-semibold ${color.text} truncate`}>{driverName}</p>
                          <div className="flex items-center gap-1 mt-0.5">
                            <Clock className="w-3 h-3 text-gray-400" />
                            <span className="text-[11px] text-gray-500">
                              {schedule.start_time?.slice(0, 5)} - {schedule.end_time?.slice(0, 5)}
                            </span>
                          </div>
                          {schedule.notes && (
                            <div className="flex items-start gap-1 mt-1">
                              <StickyNote className="w-3 h-3 text-gray-400 mt-0.5 shrink-0" />
                              <p className="text-[11px] text-gray-500 line-clamp-2">{schedule.notes}</p>
                            </div>
                          )}
                        </div>

                        {/* Acties (hover) */}
                        <div className="absolute top-1 right-1 hidden group-hover:flex items-center gap-0.5">
                          <button
                            onClick={(e) => { e.stopPropagation(); openEdit(schedule) }}
                            className="p-1 rounded bg-white/80 hover:bg-white transition-colors"
                          >
                            <Pencil className="w-3 h-3 text-gray-500" />
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); setDeleteTarget(schedule) }}
                            className="p-1 rounded bg-white/80 hover:bg-white transition-colors"
                          >
                            <Trash2 className="w-3 h-3 text-danger-500" />
                          </button>
                        </div>
                      </div>
                    )
                  })}

                  {/* Lege dag hint */}
                  {daySchedules.length === 0 && (
                    <div className="flex items-center justify-center h-full min-h-15">
                      <p className="text-[11px] text-gray-300">Sleep hier</p>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Modal voor toevoegen/bewerken */}
      <Modal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditingSchedule(null); setSelectedDate(null) }}
        title={editingSchedule && !editingSchedule._isNew ? 'Inplanning Bewerken' : 'Chauffeur Inplannen'}
      >
        <div className="mb-4 px-3 py-2 bg-gray-50 rounded-lg">
          <span className="text-sm text-gray-600">
            Datum: <strong>{selectedDate && new Date(selectedDate + 'T00:00:00').toLocaleDateString('nl-NL', { weekday: 'long', day: 'numeric', month: 'long' })}</strong>
          </span>
        </div>
        <ScheduleForm
          schedule={editingSchedule}
          drivers={drivers}
          onSubmit={handleSubmit}
          onCancel={() => { setModalOpen(false); setEditingSchedule(null); setSelectedDate(null) }}
          loading={saving}
        />
      </Modal>

      {/* Bevestiging voor verwijderen */}
      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Inplanning verwijderen"
        message={`Weet je zeker dat je deze inplanning van "${deleteTarget?.drivers?.name || 'deze chauffeur'}" wilt verwijderen?`}
      />
    </div>
  )
}

// Weeknummer berekenen (ISO)
function getWeekNumber(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const dayNum = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  return Math.ceil((((d - yearStart) / 86400000) + 1) / 7)
}
