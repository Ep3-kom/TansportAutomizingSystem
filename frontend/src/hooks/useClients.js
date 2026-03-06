import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './useAuth.jsx'

export function useClients() {
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)
  const { profile } = useAuth()

  async function fetchClients() {
    setLoading(true)
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .order('name')
    if (!error) setClients(data)
    setLoading(false)
  }

  async function addClient(client) {
    const { data, error } = await supabase
      .from('clients')
      .insert([{ ...client, company_id: profile?.company_id }])
      .select()
      .single()
    if (!error) setClients(prev => [...prev, data])
    return { data, error }
  }

  async function updateClient(id, updates) {
    const { data, error } = await supabase
      .from('clients')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    if (!error) setClients(prev => prev.map(c => c.id === id ? data : c))
    return { data, error }
  }

  async function deleteClient(id) {
    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', id)
    if (!error) setClients(prev => prev.filter(c => c.id !== id))
    return { error }
  }

  useEffect(() => {
    if (profile?.company_id) fetchClients()
  }, [profile?.company_id])

  return { clients, loading, addClient, updateClient, deleteClient, refetch: fetchClients }
}
