import { useState, useEffect } from 'react'
import { Building2, User, Save, Loader2, CheckCircle, MapPin, Mail, Phone, Hash } from 'lucide-react'
import { useAuth } from '../hooks/useAuth.jsx'
import { supabase } from '../lib/supabase'

export default function Settings() {
  const { profile, user } = useAuth()
  const [activeTab, setActiveTab] = useState('company')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

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

  // Laad huidige gegevens
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

  async function handleSaveCompany(e) {
    e.preventDefault()
    if (!profile?.company_id) return
    setSaving(true)

    const { error } = await supabase
      .from('companies')
      .update({
        name: company.name,
        kvk_number: company.kvk_number,
        btw_number: company.btw_number,
        email: company.email,
        phone: company.phone,
        address: company.address,
        city: company.city,
        postcode: company.postcode,
      })
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
    { id: 'company', label: 'Bedrijfsgegevens', icon: Building2 },
    { id: 'personal', label: 'Mijn Account', icon: User },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-800">Instellingen</h2>
        <p className="text-sm text-gray-500 mt-1">Beheer je bedrijfsgegevens en accountinstellingen</p>
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

      {/* Bedrijfsgegevens tab */}
      {activeTab === 'company' && (
        <form onSubmit={handleSaveCompany} className="bg-card rounded-xl border border-gray-100/80 shadow-card overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-50">
            <h3 className="font-semibold text-gray-800">Bedrijfsgegevens</h3>
            <p className="text-xs text-gray-400 mt-0.5">Gegevens van je transportbedrijf</p>
          </div>

          <div className="p-6 space-y-5">
            {/* Bedrijfsnaam */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Bedrijfsnaam</label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={company.name}
                  onChange={e => setCompany(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Transport B.V."
                  className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm text-gray-700 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-300 transition-all duration-200"
                />
              </div>
            </div>

            {/* KVK en BTW naast elkaar */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">KVK-nummer</label>
                <div className="relative">
                  <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={company.kvk_number}
                    onChange={e => setCompany(prev => ({ ...prev, kvk_number: e.target.value }))}
                    placeholder="12345678"
                    className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm text-gray-700 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-300 transition-all duration-200"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">BTW-nummer</label>
                <div className="relative">
                  <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={company.btw_number}
                    onChange={e => setCompany(prev => ({ ...prev, btw_number: e.target.value }))}
                    placeholder="NL123456789B01"
                    className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm text-gray-700 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-300 transition-all duration-200"
                  />
                </div>
              </div>
            </div>

            {/* E-mail en Telefoon */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">E-mailadres</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    value={company.email}
                    onChange={e => setCompany(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="info@bedrijf.nl"
                    className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm text-gray-700 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-300 transition-all duration-200"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Telefoonnummer</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="tel"
                    value={company.phone}
                    onChange={e => setCompany(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="0612345678"
                    className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm text-gray-700 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-300 transition-all duration-200"
                  />
                </div>
              </div>
            </div>

            {/* Adres */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Adres</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={company.address}
                  onChange={e => setCompany(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="Straatnaam 123"
                  className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm text-gray-700 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-300 transition-all duration-200"
                />
              </div>
            </div>

            {/* Postcode en Plaats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Postcode</label>
                <input
                  type="text"
                  value={company.postcode}
                  onChange={e => setCompany(prev => ({ ...prev, postcode: e.target.value }))}
                  placeholder="1234 AB"
                  className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm text-gray-700 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-300 transition-all duration-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Plaats</label>
                <input
                  type="text"
                  value={company.city}
                  onChange={e => setCompany(prev => ({ ...prev, city: e.target.value }))}
                  placeholder="Amsterdam"
                  className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm text-gray-700 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-300 transition-all duration-200"
                />
              </div>
            </div>
          </div>

          {/* Opslaan knop */}
          <div className="px-6 py-4 border-t border-gray-50 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2.5 bg-primary-600 text-white text-sm font-medium rounded-xl hover:bg-primary-700 hover:-translate-y-px shadow-sm disabled:opacity-50 transition-all duration-200"
            >
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
            {/* Naam */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Volledige naam</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={personal.full_name}
                  onChange={e => setPersonal(prev => ({ ...prev, full_name: e.target.value }))}
                  placeholder="Jan de Vries"
                  className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm text-gray-700 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-300 transition-all duration-200"
                />
              </div>
            </div>

            {/* E-mail (alleen lezen) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">E-mailadres</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  value={personal.email}
                  disabled
                  className="w-full pl-10 pr-4 py-2.5 bg-stone-100 border border-stone-200 rounded-xl text-sm text-gray-400 cursor-not-allowed"
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">E-mailadres kan niet worden gewijzigd</p>
            </div>

            {/* Rol (alleen lezen) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Rol</label>
              <input
                type="text"
                value={profile?.role === 'admin' ? 'Beheerder' : profile?.role === 'planner' ? 'Planner' : 'Viewer'}
                disabled
                className="w-full px-4 py-2.5 bg-stone-100 border border-stone-200 rounded-xl text-sm text-gray-400 cursor-not-allowed"
              />
            </div>
          </div>

          {/* Opslaan knop */}
          <div className="px-6 py-4 border-t border-gray-50 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2.5 bg-primary-600 text-white text-sm font-medium rounded-xl hover:bg-primary-700 hover:-translate-y-px shadow-sm disabled:opacity-50 transition-all duration-200"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Opslaan
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
