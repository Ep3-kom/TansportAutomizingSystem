import { Settings as SettingsIcon } from 'lucide-react'

export default function Settings() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Instellingen</h2>
        <p className="text-sm text-gray-500 mt-1">Bedrijfsgegevens en accountinstellingen</p>
      </div>

      <div className="bg-card rounded-xl border border-gray-100 p-12 text-center">
        <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto">
          <SettingsIcon className="w-7 h-7 text-gray-400" />
        </div>
        <h3 className="mt-4 text-lg font-semibold text-gray-700">Instellingen</h3>
        <p className="text-sm text-gray-400 mt-1 max-w-sm mx-auto">
          Hier komen de bedrijfs- en accountinstellingen.
        </p>
      </div>
    </div>
  )
}
