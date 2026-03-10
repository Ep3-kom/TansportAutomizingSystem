import { useState, useEffect } from 'react'
import {
  Building2,
  User,
  Save,
  Loader2,
  CheckCircle,
  MapPin,
  Mail,
  Phone,
  Hash,
  ShoppingBag,
  Link2,
  RefreshCw,
  AlertCircle,
  Unlink,
} from 'lucide-react'
import { useAuth } from '../../hooks/useAuth.jsx'
import { useShopify } from '../../hooks/useShopify'
import { supabase } from '../../lib/supabase'

export default function DeliverySettings() {
  const { profile, user } = useAuth()
  const { integration, isConnected, saveIntegration, disconnect, syncOrders, syncing, loading: shopifyLoading } = useShopify()

  const [activeTab, setActiveTab] = useState('shopify')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [syncResult, setSyncResult] = useState(null)
  const [syncError, setSyncError] = useState(null)

  // Shopify formulier
  const [shopify, setShopify] = useState({
    shop_domain: '',
    access_token: '',
  })

  // Bedrijfsgegevens
  const [company, setCompany] = useState({
    name: '',
    kvk_number: '',
    btw_number: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postcode: '',
  })

  // Persoonlijke gegevens
  const [personal, setPersonal] = useState({
    full_name: '',
    email: '',
  })

  useEffect(() => {
    if (integration) {
      setShopify({
        shop_domain: integration.shop_domain || '',
        access_token: integration.access_token || '',
      })
    }
  }, [integration])

  useEffect(() => {
    if (profile?.companies) {
      setCompany({
        name: profile.companies.name || '',
        kvk_number: profile.companies.kvk_number || '',
        btw_number: profile.companies.btw_number || '',
        email: profile.companies.email || '',
        phone: profile.companies.phone || '',
        address: profile.companies.address || '',
        city: profile.companies.city || '',
        postcode: profile.companies.postcode || '',
      })
    }
    if (profile) {
      setPersonal({
        full_name: profile.full_name || '',
        email: user?.email || '',
      })
    }
  }, [profile, user])

  async function handleSaveShopify(e) {
    e.preventDefault()
    setSaving(true)
    setSyncError(null)

    const { error } = await saveIntegration({
      shop_domain: shopify.shop_domain,
      access_token: shopify.access_token,
    })

    setSaving(false)
    if (error) {
      setSyncError(error.message)
    } else {
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    }
  }

  async function handleSync() {
    setSyncResult(null)
    setSyncError(null)

    const { data, error } = await syncOrders()

    if (error) {
      setSyncError(typeof error === 'string' ? error : error.message)
    } else {
      setSyncResult(data)
      setTimeout(() => setSyncResult(null), 5000)
    }
  }

  async function handleDisconnect() {
    if (!window.confirm('Weet je zeker dat je de Shopify koppeling wilt verbreken?')) return
    await disconnect()
    setShopify({ shop_domain: '', access_token: '' })
  }

  async function handleSaveCompany(e) {
    e.preventDefault()
    if (!profile?.company_id) return
    setSaving(true)

    const { error } = await supabase
      .from('companies')
      .update(company)
      .eq('id', profile.company_id)

    setSaving(false)
    if (!error) {
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    }
  }

  async function handleSavePersonal(e) {
    e.preventDefault()
    if (!profile?.id) return
    setSaving(true)

    const { error } = await supabase
      .from('profiles')
      .update({ full_name: personal.full_name })
      .eq('id', profile.id)

    setSaving(false)
    if (!error) {
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    }
  }

  const tabs = [
    { id: 'shopify', label: 'Shopify Koppeling', icon: ShoppingBag },
    { id: 'company', label: 'Bedrijfsgegevens', icon: Building2 },
    { id: 'personal', label: 'Mijn Account', icon: User },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-800">Instellingen</h2>
        <p className="text-sm text-gray-500 mt-1">Beheer je koppelingen en bedrijfsgegevens</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-lg w-fit">
        {tabs.map(tab => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-white text-gray-800 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Succes melding */}
      {saved && (
        <div className="flex items-center gap-2 bg-accent-50 text-accent-700 text-sm px-4 py-3 rounded-lg">
          <CheckCircle className="w-4 h-4" />
          Gegevens succesvol opgeslagen
        </div>
      )}

      {/* Shopify tab */}
      {activeTab === 'shopify' && (
        <div className="space-y-6">
          {/* Status banner */}
          {isConnected && (
            <div className="flex items-center justify-between bg-accent-50 border border-accent-200 rounded-xl px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-accent-100 rounded-lg flex items-center justify-center">
                  <Link2 className="w-5 h-5 text-accent-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-accent-800">Shopify verbonden</p>
                  <p className="text-xs text-accent-600">
                    {integration?.shop_domain}
                    {integration?.last_sync_at && (
                      <> — Laatst gesynchroniseerd: {new Date(integration.last_sync_at).toLocaleString('nl-NL')}</>
                    )}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleSync}
                  disabled={syncing}
                  className="flex items-center gap-1.5 px-3 py-2 bg-accent-600 text-white text-sm font-medium rounded-lg hover:bg-accent-700 disabled:opacity-50 transition-colors"
                >
                  <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
                  {syncing ? 'Synchroniseren...' : 'Sync nu'}
                </button>
                <button
                  onClick={handleDisconnect}
                  className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-500 hover:text-danger-500 font-medium rounded-lg hover:bg-danger-50 transition-colors"
                >
                  <Unlink className="w-4 h-4" />
                  Verbreken
                </button>
              </div>
            </div>
          )}

          {/* Sync resultaat */}
          {syncResult && (
            <div className="flex items-center gap-2 bg-primary-50 text-primary-700 text-sm px-4 py-3 rounded-lg">
              <CheckCircle className="w-4 h-4" />
              {syncResult.imported} nieuwe order{syncResult.imported !== 1 ? 's' : ''} geimporteerd, {syncResult.skipped} overgeslagen
            </div>
          )}

          {/* Sync error */}
          {syncError && (
            <div className="flex items-center gap-2 bg-danger-50 text-danger-600 text-sm px-4 py-3 rounded-lg">
              <AlertCircle className="w-4 h-4" />
              {syncError}
            </div>
          )}

          {/* Shopify koppeling formulier */}
          <form onSubmit={handleSaveShopify} className="bg-card rounded-xl border border-gray-100/80 shadow-card overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-50">
              <h3 className="font-semibold text-gray-800">Shopify API Koppeling</h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Koppel je Shopify winkel om automatisch bestellingen te importeren
              </p>
            </div>

            <div className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Shop domein</label>
                <div className="relative">
                  <ShoppingBag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={shopify.shop_domain}
                    onChange={e => setShopify(p => ({ ...p, shop_domain: e.target.value }))}
                    placeholder="mijn-winkel.myshopify.com"
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm text-gray-700 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-300 transition-all duration-200"
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1">Je kunt dit vinden in je Shopify admin URL</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Access Token</label>
                <div className="relative">
                  <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="password"
                    value={shopify.access_token}
                    onChange={e => setShopify(p => ({ ...p, access_token: e.target.value }))}
                    placeholder="shpat_xxxxxxxxxxxxx"
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm text-gray-700 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-300 transition-all duration-200"
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  Maak een Custom App aan in Shopify Admin &gt; Settings &gt; Apps and sales channels &gt; Develop apps
                </p>
              </div>

              <div className="bg-primary-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-primary-800 mb-2">Benodigde Shopify API rechten:</h4>
                <ul className="text-xs text-primary-700 space-y-1">
                  <li>read_orders — Om bestellingen op te halen</li>
                  <li>write_orders — Om bezorgstatus terug te schrijven</li>
                  <li>read_products — Om productinformatie op te halen</li>
                </ul>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-50 flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 px-5 py-2.5 bg-primary-600 text-white text-sm font-medium rounded-xl hover:bg-primary-700 hover:-translate-y-px shadow-sm disabled:opacity-50 transition-all duration-200"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {isConnected ? 'Bijwerken' : 'Koppelen'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Bedrijfsgegevens tab */}
      {activeTab === 'company' && (
        <form onSubmit={handleSaveCompany} className="bg-card rounded-xl border border-gray-100/80 shadow-card overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-50">
            <h3 className="font-semibold text-gray-800">Bedrijfsgegevens</h3>
            <p className="text-xs text-gray-400 mt-0.5">Gegevens van je bedrijf</p>
          </div>

          <div className="p-6 space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Bedrijfsnaam</label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={company.name}
                  onChange={e => setCompany(p => ({ ...p, name: e.target.value }))}
                  className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm text-gray-700 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-300 transition-all duration-200"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">KVK-nummer</label>
                <div className="relative">
                  <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="text" value={company.kvk_number} onChange={e => setCompany(p => ({ ...p, kvk_number: e.target.value }))} placeholder="12345678" className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm text-gray-700 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-300 transition-all duration-200" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">BTW-nummer</label>
                <div className="relative">
                  <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="text" value={company.btw_number} onChange={e => setCompany(p => ({ ...p, btw_number: e.target.value }))} placeholder="NL123456789B01" className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm text-gray-700 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-300 transition-all duration-200" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">E-mailadres</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="email" value={company.email} onChange={e => setCompany(p => ({ ...p, email: e.target.value }))} placeholder="info@bedrijf.nl" className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm text-gray-700 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-300 transition-all duration-200" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Telefoonnummer</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="tel" value={company.phone} onChange={e => setCompany(p => ({ ...p, phone: e.target.value }))} placeholder="0612345678" className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm text-gray-700 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-300 transition-all duration-200" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Adres</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="text" value={company.address} onChange={e => setCompany(p => ({ ...p, address: e.target.value }))} placeholder="Straatnaam 123" className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm text-gray-700 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-300 transition-all duration-200" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Postcode</label>
                <input type="text" value={company.postcode} onChange={e => setCompany(p => ({ ...p, postcode: e.target.value }))} placeholder="1234 AB" className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm text-gray-700 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-300 transition-all duration-200" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Plaats</label>
                <input type="text" value={company.city} onChange={e => setCompany(p => ({ ...p, city: e.target.value }))} placeholder="Amsterdam" className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm text-gray-700 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-300 transition-all duration-200" />
              </div>
            </div>
          </div>

          <div className="px-6 py-4 border-t border-gray-50 flex justify-end">
            <button type="submit" disabled={saving} className="flex items-center gap-2 px-5 py-2.5 bg-primary-600 text-white text-sm font-medium rounded-xl hover:bg-primary-700 hover:-translate-y-px shadow-sm disabled:opacity-50 transition-all duration-200">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Opslaan
            </button>
          </div>
        </form>
      )}

      {/* Mijn Account tab */}
      {activeTab === 'personal' && (
        <form onSubmit={handleSavePersonal} className="bg-card rounded-xl border border-gray-100/80 shadow-card overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-50">
            <h3 className="font-semibold text-gray-800">Mijn Account</h3>
            <p className="text-xs text-gray-400 mt-0.5">Je persoonlijke accountgegevens</p>
          </div>

          <div className="p-6 space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Volledige naam</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="text" value={personal.full_name} onChange={e => setPersonal(p => ({ ...p, full_name: e.target.value }))} className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm text-gray-700 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-300 transition-all duration-200" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">E-mailadres</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="email" value={personal.email} disabled className="w-full pl-10 pr-4 py-2.5 bg-stone-100 border border-stone-200 rounded-xl text-sm text-gray-400 cursor-not-allowed" />
              </div>
              <p className="text-xs text-gray-400 mt-1">E-mailadres kan niet worden gewijzigd</p>
            </div>
          </div>

          <div className="px-6 py-4 border-t border-gray-50 flex justify-end">
            <button type="submit" disabled={saving} className="flex items-center gap-2 px-5 py-2.5 bg-primary-600 text-white text-sm font-medium rounded-xl hover:bg-primary-700 hover:-translate-y-px shadow-sm disabled:opacity-50 transition-all duration-200">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Opslaan
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
