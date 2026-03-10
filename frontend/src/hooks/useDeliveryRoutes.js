import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './useAuth.jsx'

export function useDeliveryRoutes() {
  const { profile } = useAuth()
  const [routes, setRoutes] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchRoutes = useCallback(async () => {
    if (!profile?.company_id) return
    setLoading(true)

    const { data, error } = await supabase
      .from('delivery_routes')
      .select('*')
      .eq('company_id', profile.company_id)
      .order('date', { ascending: true })

    if (!error) setRoutes(data || [])
    setLoading(false)
  }, [profile?.company_id])

  useEffect(() => {
    fetchRoutes()
  }, [fetchRoutes])

  async function createRoute({ date, name, stops }) {
    const { data, error } = await supabase
      .from('delivery_routes')
      .insert({
        company_id: profile.company_id,
        date,
        name,
        stops: stops || [],
      })
      .select()
      .single()

    if (!error && data) {
      setRoutes(prev => [...prev, data])
    }
    return { data, error }
  }

  async function updateRoute(id, updates) {
    const { data, error } = await supabase
      .from('delivery_routes')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (!error && data) {
      setRoutes(prev => prev.map(r => r.id === id ? data : r))
    }
    return { data, error }
  }

  async function deleteRoute(id) {
    const { error } = await supabase
      .from('delivery_routes')
      .delete()
      .eq('id', id)

    if (!error) {
      setRoutes(prev => prev.filter(r => r.id !== id))
    }
    return { error }
  }

  function getRouteByDate(date) {
    return routes.find(r => r.date === date)
  }

  // Genereer Google Maps URL met waypoints
  function getGoogleMapsUrl(orderStops, startAddress) {
    if (!orderStops || orderStops.length === 0) return null

    const addresses = orderStops.map(o =>
      encodeURIComponent(`${o.address}, ${o.postcode} ${o.city}`)
    )

    const origin = startAddress
      ? encodeURIComponent(startAddress)
      : addresses[0]

    const destination = addresses[addresses.length - 1]
    const waypoints = addresses.length > 2
      ? addresses.slice(1, -1).join('|')
      : ''

    let url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}`
    if (waypoints) url += `&waypoints=${waypoints}`

    return url
  }

  return {
    routes,
    loading,
    createRoute,
    updateRoute,
    deleteRoute,
    getRouteByDate,
    getGoogleMapsUrl,
    refetch: fetchRoutes,
  }
}
