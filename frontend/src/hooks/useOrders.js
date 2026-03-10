import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './useAuth.jsx'

export function useOrders() {
  const { profile } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchOrders = useCallback(async () => {
    if (!profile?.company_id) return
    setLoading(true)

    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('company_id', profile.company_id)
      .order('created_at', { ascending: false })

    if (!error) setOrders(data || [])
    setLoading(false)
  }, [profile?.company_id])

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  async function addOrder(order) {
    const { data, error } = await supabase
      .from('orders')
      .insert({ ...order, company_id: profile.company_id })
      .select()
      .single()

    if (!error && data) {
      setOrders(prev => [data, ...prev])
    }
    return { data, error }
  }

  async function updateOrder(id, updates) {
    const { data, error } = await supabase
      .from('orders')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (!error && data) {
      setOrders(prev => prev.map(o => o.id === id ? data : o))
    }
    return { data, error }
  }

  async function deleteOrder(id) {
    const { error } = await supabase
      .from('orders')
      .delete()
      .eq('id', id)

    if (!error) {
      setOrders(prev => prev.filter(o => o.id !== id))
    }
    return { error }
  }

  async function updateOrderStatus(id, status) {
    return updateOrder(id, { status })
  }

  async function planOrder(id, planned_date, planned_position) {
    return updateOrder(id, {
      planned_date,
      planned_position,
      status: 'ingepland',
    })
  }

  async function unplanOrder(id) {
    return updateOrder(id, {
      planned_date: null,
      planned_position: null,
      status: 'nieuw',
    })
  }

  // Statistieken
  const stats = {
    total: orders.length,
    nieuw: orders.filter(o => o.status === 'nieuw').length,
    ingepland: orders.filter(o => o.status === 'ingepland').length,
    onderweg: orders.filter(o => o.status === 'onderweg').length,
    bezorgd: orders.filter(o => o.status === 'bezorgd').length,
    geannuleerd: orders.filter(o => o.status === 'geannuleerd').length,
  }

  // Orders voor een specifieke datum
  function getOrdersByDate(date) {
    return orders
      .filter(o => o.planned_date === date)
      .sort((a, b) => (a.planned_position || 0) - (b.planned_position || 0))
  }

  // Vandaag
  const today = new Date().toISOString().split('T')[0]
  const todayOrders = getOrdersByDate(today)

  return {
    orders,
    loading,
    stats,
    todayOrders,
    addOrder,
    updateOrder,
    deleteOrder,
    updateOrderStatus,
    planOrder,
    unplanOrder,
    getOrdersByDate,
    refetch: fetchOrders,
  }
}
