import { Building2, Plus } from 'lucide-react'

export default function Clients() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Klanten</h2>
          <p className="text-sm text-gray-500 mt-1">Beheer je klantenbestand</p>
        </div>
        <button className="inline-flex items-center gap-2 bg-primary-500 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-primary-600 transition-colors">
          <Plus className="w-4 h-4" />
          Klant Toevoegen
        </button>
      </div>

      <div className="bg-card rounded-xl border border-gray-100 p-12 text-center">
        <div className="w-14 h-14 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto">
          <Building2 className="w-7 h-7 text-primary-400" />
        </div>
        <h3 className="mt-4 text-lg font-semibold text-gray-700">Nog geen klanten</h3>
        <p className="text-sm text-gray-400 mt-1 max-w-sm mx-auto">
          Voeg je eerste klant toe om ritten te koppelen.
        </p>
      </div>
    </div>
  )
}
