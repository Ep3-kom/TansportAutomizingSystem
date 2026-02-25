import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './useAuth.jsx'

export function useDrivers() {
  const [drivers, setDrivers] = useState([])
  const [loading, setLoading] = useState(true)
  const { profile } = useAuth()

  async function fetchDrivers() {
    setLoading(true)
    const { data, error } = await supabase
      .from('drivers')
      .select('*')
      .order('name')
    if (!error) setDrivers(data)
    setLoading(false)
  }

  async function addDriver(driver) {
    const { data, error } = await supabase
      .from('drivers')
      .insert([{ ...driver, company_id: profile?.company_id }])
      .select()
      .single()
    if (!error) setDrivers(prev => [...prev, data])
    return { data, error }
  }

  async function updateDriver(id, updates) {
    const { data, error } = await supabase
      .from('drivers')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    if (!error) setDrivers(prev => prev.map(d => d.id === id ? data : d))
    return { data, error }
  }

  async function deleteDriver(id) {
    const { error } = await supabase
      .from('drivers')
      .delete()
      .eq('id', id)
    if (!error) setDrivers(prev => prev.filter(d => d.id !== id))
    return { error }
  }

  useEffect(() => {
    if (profile?.company_id) fetchDrivers()
  }, [profile?.company_id])

  return { drivers, loading, addDriver, updateDriver, deleteDriver, refetch: fetchDrivers }
}
