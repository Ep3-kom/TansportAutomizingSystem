import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './useAuth.jsx'

export async function fetchRdwData(licensePlate) {
  const kenteken = licensePlate.replace(/[\s-]/g, '').toUpperCase()
  const res = await fetch(
    `https://opendata.rdw.nl/resource/m9d7-ebf2.json?kenteken=${kenteken}`
  )
  if (!res.ok) return { data: null, error: 'RDW API niet bereikbaar' }
  const json = await res.json()
  if (!json.length) return { data: null, error: 'Kenteken niet gevonden' }

  const vehicle = json[0]
  return {
    data: {
      brand_model: `${vehicle.merk} ${vehicle.handelsbenaming}`.trim(),
      apk_expiry: vehicle.vervaldatum_apk_dt?.split('T')[0] || null,
      weight: vehicle.massa_rijklaar ? Number(vehicle.massa_rijklaar) : null,
    },
    error: null,
  }
}

export function useTrucks() {
  const [trucks, setTrucks] = useState([])
  const [loading, setLoading] = useState(true)
  const { profile } = useAuth()

  async function fetchTrucks() {
    setLoading(true)
    const { data, error } = await supabase
      .from('trucks')
      .select('*')
      .order('license_plate')
    if (!error) setTrucks(data)
    setLoading(false)
  }

  async function addTruck(truck) {
    const { data, error } = await supabase
      .from('trucks')
      .insert([{ ...truck, company_id: profile?.company_id }])
      .select()
      .single()
    if (error) {
      console.error('Supabase insert error:', error)
    } else {
      setTrucks(prev => [...prev, data])
    }
    return { data, error }
  }

  async function updateTruck(id, updates) {
    const { data, error } = await supabase
      .from('trucks')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    if (!error) setTrucks(prev => prev.map(t => t.id === id ? data : t))
    return { data, error }
  }

  async function deleteTruck(id) {
    const { error } = await supabase
      .from('trucks')
      .delete()
      .eq('id', id)
    if (!error) setTrucks(prev => prev.filter(t => t.id !== id))
    return { error }
  }

  useEffect(() => {
    if (profile?.company_id) fetchTrucks()
  }, [profile?.company_id])

  return { trucks, loading, addTruck, updateTruck, deleteTruck, refetch: fetchTrucks }
}
