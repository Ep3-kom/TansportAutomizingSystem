import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './useAuth.jsx'

export function useShopify() {
  const { profile } = useAuth()
  const [integration, setIntegration] = useState(null)
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)

  const fetchIntegration = useCallback(async () => {
    if (!profile?.company_id) return
    setLoading(true)

    const { data } = await supabase
      .from('integrations')
      .select('*')
      .eq('company_id', profile.company_id)
      .eq('platform', 'shopify')
      .single()

    setIntegration(data || null)
    setLoading(false)
  }, [profile?.company_id])

  useEffect(() => {
    fetchIntegration()
  }, [fetchIntegration])

  async function saveIntegration({ shop_domain, api_key, api_secret, access_token }) {
    const payload = {
      company_id: profile.company_id,
      platform: 'shopify',
      shop_domain,
      api_key,
      api_secret,
      access_token,
      is_active: true,
    }

    let result
    if (integration?.id) {
      result = await supabase
        .from('integrations')
        .update(payload)
        .eq('id', integration.id)
        .select()
        .single()
    } else {
      result = await supabase
        .from('integrations')
        .insert(payload)
        .select()
        .single()
    }

    if (!result.error && result.data) {
      setIntegration(result.data)
    }
    return result
  }

  async function disconnect() {
    if (!integration?.id) return

    const { error } = await supabase
      .from('integrations')
      .update({ is_active: false, access_token: null })
      .eq('id', integration.id)

    if (!error) {
      setIntegration(prev => ({ ...prev, is_active: false, access_token: null }))
    }
    return { error }
  }

  async function syncOrders() {
    if (!integration?.is_active || !integration?.access_token) return { error: 'Geen actieve Shopify koppeling' }

    setSyncing(true)

    try {
      // Haal orders op via Shopify Admin API
      const shopDomain = integration.shop_domain.replace(/^https?:\/\//, '').replace(/\/$/, '')
      const response = await fetch(
        `https://${shopDomain}/admin/api/2024-01/orders.json?status=any&limit=50`,
        {
          headers: {
            'X-Shopify-Access-Token': integration.access_token,
            'Content-Type': 'application/json',
          },
        }
      )

      if (!response.ok) {
        setSyncing(false)
        return { error: `Shopify API fout: ${response.status}` }
      }

      const { orders: shopifyOrders } = await response.json()

      let imported = 0
      let skipped = 0

      for (const so of shopifyOrders) {
        // Check of order al bestaat
        const { data: existing } = await supabase
          .from('orders')
          .select('id')
          .eq('company_id', profile.company_id)
          .eq('shopify_order_id', String(so.id))
          .single()

        if (existing) {
          skipped++
          continue
        }

        const shippingAddr = so.shipping_address || so.billing_address || {}

        const orderData = {
          company_id: profile.company_id,
          shopify_order_id: String(so.id),
          order_number: so.name || `#${so.order_number}`,
          customer_name: `${shippingAddr.first_name || ''} ${shippingAddr.last_name || ''}`.trim() || so.email || 'Onbekend',
          customer_email: so.email,
          customer_phone: shippingAddr.phone || so.phone,
          address: `${shippingAddr.address1 || ''}${shippingAddr.address2 ? ' ' + shippingAddr.address2 : ''}`.trim(),
          postcode: shippingAddr.zip || '',
          city: shippingAddr.city || '',
          province: shippingAddr.province || '',
          country: shippingAddr.country_code || 'NL',
          products: so.line_items?.map(li => ({
            title: li.title,
            quantity: li.quantity,
            variant: li.variant_title,
            sku: li.sku,
            price: li.price,
          })) || [],
          status: so.fulfillment_status === 'fulfilled' ? 'bezorgd' : 'nieuw',
          notes: so.note,
          shopify_data: so,
        }

        await supabase.from('orders').insert(orderData)
        imported++
      }

      // Update last_sync_at
      await supabase
        .from('integrations')
        .update({ last_sync_at: new Date().toISOString() })
        .eq('id', integration.id)

      setIntegration(prev => ({ ...prev, last_sync_at: new Date().toISOString() }))

      setSyncing(false)
      return { data: { imported, skipped, total: shopifyOrders.length } }
    } catch (err) {
      setSyncing(false)
      return { error: err.message }
    }
  }

  return {
    integration,
    loading,
    syncing,
    saveIntegration,
    disconnect,
    syncOrders,
    refetch: fetchIntegration,
    isConnected: integration?.is_active && !!integration?.access_token,
  }
}
