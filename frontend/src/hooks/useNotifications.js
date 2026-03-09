import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './useAuth.jsx'

function getDaysUntil(dateStr) {
  if (!dateStr) return null
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const target = new Date(dateStr + 'T00:00:00')
  return Math.ceil((target - today) / (1000 * 60 * 60 * 24))
}

export function useNotifications() {
  const { profile } = useAuth()
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchNotifications = useCallback(async () => {
    if (!profile?.company_id) return
    setLoading(true)

    const items = []
    const today = new Date().toISOString().split('T')[0]

    // 1. APK herinneringen — trucks met APK binnen 60 dagen
    const { data: trucks } = await supabase
      .from('trucks')
      .select('id, license_plate, brand_model, apk_expiry')
      .not('apk_expiry', 'is', null)

    if (trucks) {
      trucks.forEach(truck => {
        const daysLeft = getDaysUntil(truck.apk_expiry)
        if (daysLeft !== null && daysLeft <= 60) {
          const severity = daysLeft <= 0 ? 'critical' : daysLeft <= 14 ? 'warning' : 'info'
          items.push({
            id: `apk-${truck.id}`,
            type: 'apk',
            severity,
            title: daysLeft <= 0
              ? `APK verlopen: ${truck.license_plate}`
              : `APK verloopt over ${daysLeft} dagen`,
            description: `${truck.brand_model || truck.license_plate} — APK vervalt op ${truck.apk_expiry}`,
            date: truck.apk_expiry,
          })
        }
      })
    }

    // 2. Ritten die bijna beginnen of al bezig zijn (vandaag)
    const { data: schedules } = await supabase
      .from('schedules')
      .select('id, date, start_time, end_time, notes, drivers(name), clients(name)')
      .eq('date', today)
      .order('start_time')

    if (schedules) {
      const now = new Date()
      const nowMinutes = now.getHours() * 60 + now.getMinutes()

      schedules.forEach(schedule => {
        if (!schedule.start_time) return
        const [sh, sm] = schedule.start_time.split(':').map(Number)
        const startMinutes = sh * 60 + sm
        const minutesUntilStart = startMinutes - nowMinutes

        // Rit begint binnen 30 minuten
        if (minutesUntilStart > 0 && minutesUntilStart <= 30) {
          items.push({
            id: `schedule-soon-${schedule.id}`,
            type: 'schedule',
            severity: 'warning',
            title: `Rit begint over ${minutesUntilStart} min`,
            description: `${schedule.drivers?.name || 'Onbekend'} — ${schedule.start_time?.slice(0, 5)}${schedule.clients?.name ? ` bij ${schedule.clients.name}` : ''}`,
            date: today,
          })
        }

        // Rit is te laat (starttijd verstreken, maar we markeren het)
        if (minutesUntilStart < 0 && minutesUntilStart >= -60) {
          const minsLate = Math.abs(minutesUntilStart)
          items.push({
            id: `schedule-late-${schedule.id}`,
            type: 'schedule',
            severity: 'critical',
            title: `Rit had ${minsLate} min geleden moeten starten`,
            description: `${schedule.drivers?.name || 'Onbekend'} — ${schedule.start_time?.slice(0, 5)}${schedule.clients?.name ? ` bij ${schedule.clients.name}` : ''}`,
            date: today,
          })
        }
      })
    }

    // Sorteer: critical eerst, dan warning, dan info
    const severityOrder = { critical: 0, warning: 1, info: 2 }
    items.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity])

    setNotifications(items)
    setLoading(false)
  }, [profile?.company_id])

  useEffect(() => {
    fetchNotifications()
    // Ververs elke 2 minuten
    const interval = setInterval(fetchNotifications, 2 * 60 * 1000)
    return () => clearInterval(interval)
  }, [fetchNotifications])

  const unreadCount = notifications.length

  return { notifications, unreadCount, loading, refetch: fetchNotifications }
}
