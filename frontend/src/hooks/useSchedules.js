import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './useAuth.jsx'

export function useSchedules(weekStart) {
  const [schedules, setSchedules] = useState([])
  const [loading, setLoading] = useState(true)
  const { profile } = useAuth()

  // Haal schedules op voor de hele week (ma-zo)
  async function fetchSchedules() {
    if (!weekStart) return
    setLoading(true)

    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekEnd.getDate() + 6)

    const { data, error } = await supabase
      .from('schedules')
      .select('*, drivers(name, status)')
      .gte('date', weekStart.toISOString().split('T')[0])
      .lte('date', weekEnd.toISOString().split('T')[0])
      .order('start_time')

    if (!error) setSchedules(data || [])
    setLoading(false)
  }

  async function addSchedule(schedule) {
    const { data, error } = await supabase
      .from('schedules')
      .insert([{ ...schedule, company_id: profile?.company_id }])
      .select('*, drivers(name, status)')
      .single()
    if (!error) setSchedules(prev => [...prev, data])
    return { data, error }
  }

  async function updateSchedule(id, updates) {
    const { data, error } = await supabase
      .from('schedules')
      .update(updates)
      .eq('id', id)
      .select('*, drivers(name, status)')
      .single()
    if (!error) setSchedules(prev => prev.map(s => s.id === id ? data : s))
    return { data, error }
  }

  async function deleteSchedule(id) {
    const { error } = await supabase
      .from('schedules')
      .delete()
      .eq('id', id)
    if (!error) setSchedules(prev => prev.filter(s => s.id !== id))
    return { error }
  }

  // Verplaats een schedule naar een andere dag (voor drag & drop)
  async function moveSchedule(id, newDate) {
    return updateSchedule(id, { date: newDate })
  }

  useEffect(() => {
    if (profile?.company_id && weekStart) fetchSchedules()
  }, [profile?.company_id, weekStart?.toISOString()])

  return {
    schedules,
    loading,
    addSchedule,
    updateSchedule,
    deleteSchedule,
    moveSchedule,
    refetch: fetchSchedules,
  }
}
