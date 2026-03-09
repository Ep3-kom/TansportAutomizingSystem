import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './useAuth.jsx'

// EU Verordening (EG) 561/2006 — Rij- en rusttijden
const LIMITS = {
  MAX_DAILY_HOURS: 9,          // Max 9 uur per dag
  MAX_DAILY_HOURS_EXTENDED: 10, // Max 10 uur, 2x per week toegestaan
  MAX_EXTENDED_DAYS_PER_WEEK: 2,
  MAX_WEEKLY_HOURS: 56,         // Max 56 uur per week
  MAX_BIWEEKLY_HOURS: 90,       // Max 90 uur per 2 weken
  MIN_DAILY_REST: 11,           // Min 11 uur dagelijkse rust
  MIN_DAILY_REST_REDUCED: 9,    // Min 9 uur (3x per week)
  MAX_REDUCED_REST_PER_WEEK: 3,
  MIN_WEEKLY_REST: 45,          // Min 45 uur wekelijkse rust
  WARNING_THRESHOLD: 0.8,       // Waarschuwing bij 80% van limiet
}

// Bereken uren tussen twee tijden (HH:MM)
function calcHours(startTime, endTime) {
  if (!startTime || !endTime) return 0
  const [sh, sm] = startTime.split(':').map(Number)
  const [eh, em] = endTime.split(':').map(Number)
  const diff = (eh * 60 + em) - (sh * 60 + sm)
  return Math.max(0, diff / 60)
}

// Maandag van een week ophalen
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

export function useDrivingHours() {
  const { profile } = useAuth()
  const [schedules, setSchedules] = useState([])
  const [loading, setLoading] = useState(true)

  // Haal schedules op van afgelopen 2 weken + huidige week
  const fetchSchedules = useCallback(async () => {
    if (!profile?.company_id) return
    setLoading(true)

    const today = new Date()
    const monday = getMonday(today)
    const twoWeeksAgo = new Date(monday)
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14)
    const sunday = new Date(monday)
    sunday.setDate(sunday.getDate() + 6)

    const { data, error } = await supabase
      .from('schedules')
      .select('id, driver_id, date, start_time, end_time, drivers(name)')
      .gte('date', formatDate(twoWeeksAgo))
      .lte('date', formatDate(sunday))
      .order('date')
      .order('start_time')

    if (!error) setSchedules(data || [])
    setLoading(false)
  }, [profile?.company_id])

  useEffect(() => {
    fetchSchedules()
  }, [fetchSchedules])

  // Bereken rijtijd per chauffeur per dag
  function getDailyHours(driverId, date) {
    const dateStr = typeof date === 'string' ? date : formatDate(date)
    return schedules
      .filter(s => s.driver_id === driverId && s.date === dateStr)
      .reduce((total, s) => total + calcHours(s.start_time, s.end_time), 0)
  }

  // Bereken weekuren (ma-zo)
  function getWeeklyHours(driverId, weekStartDate) {
    const monday = weekStartDate ? getMonday(weekStartDate) : getMonday(new Date())
    let total = 0
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday)
      d.setDate(d.getDate() + i)
      total += getDailyHours(driverId, d)
    }
    return total
  }

  // Bereken 2-weken uren
  function getBiweeklyHours(driverId) {
    const monday = getMonday(new Date())
    const prevMonday = new Date(monday)
    prevMonday.setDate(prevMonday.getDate() - 7)
    return getWeeklyHours(driverId, prevMonday) + getWeeklyHours(driverId, monday)
  }

  // Bereken rust tussen laatste shift en een tijdstip
  function getRestHoursSince(driverId, date, startTime) {
    const dateStr = typeof date === 'string' ? date : formatDate(date)

    // Zoek alle schedules vóór deze datum+tijd
    const previous = schedules
      .filter(s => {
        if (s.driver_id !== driverId) return false
        if (s.date < dateStr) return true
        if (s.date === dateStr && s.end_time && startTime && s.end_time <= startTime) return true
        return false
      })
      .sort((a, b) => {
        if (a.date !== b.date) return b.date.localeCompare(a.date)
        return (b.end_time || '').localeCompare(a.end_time || '')
      })

    if (previous.length === 0) return null // Geen vorige shift

    const lastShift = previous[0]
    const lastEnd = new Date(`${lastShift.date}T${lastShift.end_time || '17:00'}`)
    const nextStart = new Date(`${dateStr}T${startTime || '08:00'}`)
    const diffHours = (nextStart - lastEnd) / (1000 * 60 * 60)
    return Math.max(0, diffHours)
  }

  // Tel hoeveel dagen >9u deze week
  function getExtendedDaysThisWeek(driverId) {
    const monday = getMonday(new Date())
    let count = 0
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday)
      d.setDate(d.getDate() + i)
      if (getDailyHours(driverId, d) > LIMITS.MAX_DAILY_HOURS) count++
    }
    return count
  }

  // Check alle regels voor een chauffeur op een specifieke dag + nieuwe rit
  function checkViolations(driverId, date, startTime, endTime) {
    const dateStr = typeof date === 'string' ? date : formatDate(date)
    const newHours = calcHours(startTime, endTime)
    const currentDailyHours = getDailyHours(driverId, dateStr)
    const totalDailyHours = currentDailyHours + newHours

    const currentWeeklyHours = getWeeklyHours(driverId)
    const totalWeeklyHours = currentWeeklyHours + newHours

    const currentBiweeklyHours = getBiweeklyHours(driverId)
    const totalBiweeklyHours = currentBiweeklyHours + newHours

    const restHours = getRestHoursSince(driverId, dateStr, startTime)
    const extendedDays = getExtendedDaysThisWeek(driverId)

    const violations = []
    const warnings = []

    // Dagelijkse limiet
    const dailyMax = extendedDays < LIMITS.MAX_EXTENDED_DAYS_PER_WEEK
      ? LIMITS.MAX_DAILY_HOURS_EXTENDED
      : LIMITS.MAX_DAILY_HOURS

    if (totalDailyHours > dailyMax) {
      violations.push({
        type: 'daily',
        message: `Dagelijks maximum overschreden: ${totalDailyHours.toFixed(1)}u van max ${dailyMax}u`,
        current: totalDailyHours,
        limit: dailyMax,
      })
    } else if (totalDailyHours > LIMITS.MAX_DAILY_HOURS) {
      warnings.push({
        type: 'daily_extended',
        message: `Verlengde dag (${totalDailyHours.toFixed(1)}u). Max ${LIMITS.MAX_EXTENDED_DAYS_PER_WEEK}x per week toegestaan, nu ${extendedDays + 1}x.`,
        current: totalDailyHours,
        limit: LIMITS.MAX_DAILY_HOURS_EXTENDED,
      })
    } else if (totalDailyHours >= LIMITS.MAX_DAILY_HOURS * LIMITS.WARNING_THRESHOLD) {
      warnings.push({
        type: 'daily',
        message: `Bijna aan dagelijks maximum: ${totalDailyHours.toFixed(1)}u van max ${LIMITS.MAX_DAILY_HOURS}u`,
        current: totalDailyHours,
        limit: LIMITS.MAX_DAILY_HOURS,
      })
    }

    // Wekelijkse limiet
    if (totalWeeklyHours > LIMITS.MAX_WEEKLY_HOURS) {
      violations.push({
        type: 'weekly',
        message: `Wekelijks maximum overschreden: ${totalWeeklyHours.toFixed(1)}u van max ${LIMITS.MAX_WEEKLY_HOURS}u`,
        current: totalWeeklyHours,
        limit: LIMITS.MAX_WEEKLY_HOURS,
      })
    } else if (totalWeeklyHours >= LIMITS.MAX_WEEKLY_HOURS * LIMITS.WARNING_THRESHOLD) {
      warnings.push({
        type: 'weekly',
        message: `Bijna aan wekelijks maximum: ${totalWeeklyHours.toFixed(1)}u van max ${LIMITS.MAX_WEEKLY_HOURS}u`,
        current: totalWeeklyHours,
        limit: LIMITS.MAX_WEEKLY_HOURS,
      })
    }

    // 2-wekelijks limiet
    if (totalBiweeklyHours > LIMITS.MAX_BIWEEKLY_HOURS) {
      violations.push({
        type: 'biweekly',
        message: `2-weken maximum overschreden: ${totalBiweeklyHours.toFixed(1)}u van max ${LIMITS.MAX_BIWEEKLY_HOURS}u`,
        current: totalBiweeklyHours,
        limit: LIMITS.MAX_BIWEEKLY_HOURS,
      })
    } else if (totalBiweeklyHours >= LIMITS.MAX_BIWEEKLY_HOURS * LIMITS.WARNING_THRESHOLD) {
      warnings.push({
        type: 'biweekly',
        message: `Bijna aan 2-weken maximum: ${totalBiweeklyHours.toFixed(1)}u van max ${LIMITS.MAX_BIWEEKLY_HOURS}u`,
        current: totalBiweeklyHours,
        limit: LIMITS.MAX_BIWEEKLY_HOURS,
      })
    }

    // Rusttijd check
    if (restHours !== null && restHours < LIMITS.MIN_DAILY_REST_REDUCED) {
      violations.push({
        type: 'rest',
        message: `Onvoldoende rust: ${restHours.toFixed(1)}u sinds vorige shift (min ${LIMITS.MIN_DAILY_REST_REDUCED}u)`,
        current: restHours,
        limit: LIMITS.MIN_DAILY_REST_REDUCED,
      })
    } else if (restHours !== null && restHours < LIMITS.MIN_DAILY_REST) {
      warnings.push({
        type: 'rest',
        message: `Verkorte rust: ${restHours.toFixed(1)}u (normaal min ${LIMITS.MIN_DAILY_REST}u). Max ${LIMITS.MAX_REDUCED_REST_PER_WEEK}x per week.`,
        current: restHours,
        limit: LIMITS.MIN_DAILY_REST,
      })
    }

    return { violations, warnings }
  }

  // Overzicht per chauffeur (voor dashboard)
  function getDriverSummary(driverId) {
    const dailyHours = getDailyHours(driverId, new Date())
    const weeklyHours = getWeeklyHours(driverId)
    const biweeklyHours = getBiweeklyHours(driverId)

    const dailyPercent = (dailyHours / LIMITS.MAX_DAILY_HOURS) * 100
    const weeklyPercent = (weeklyHours / LIMITS.MAX_WEEKLY_HOURS) * 100
    const biweeklyPercent = (biweeklyHours / LIMITS.MAX_BIWEEKLY_HOURS) * 100

    const maxPercent = Math.max(dailyPercent, weeklyPercent, biweeklyPercent)

    let status = 'ok'
    if (maxPercent >= 100) status = 'violation'
    else if (maxPercent >= 80) status = 'warning'

    return {
      dailyHours,
      weeklyHours,
      biweeklyHours,
      dailyPercent,
      weeklyPercent,
      biweeklyPercent,
      status,
    }
  }

  return {
    loading,
    checkViolations,
    getDriverSummary,
    getDailyHours,
    getWeeklyHours,
    getBiweeklyHours,
    refetch: fetchSchedules,
    LIMITS,
  }
}
