import { Wrench } from 'lucide-react'

export default function Maintenance() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Onderhoud</h2>
        <p className="text-sm text-gray-500 mt-1">APK, onderhoud en reparaties bijhouden</p>
      </div>

      <div className="bg-card rounded-xl border border-gray-100 p-12 text-center">
        <div className="w-14 h-14 bg-warn-50 rounded-2xl flex items-center justify-center mx-auto">
          <Wrench className="w-7 h-7 text-warn-400" />
        </div>
        <h3 className="mt-4 text-lg font-semibold text-gray-700">Onderhoudstracker</h3>
        <p className="text-sm text-gray-400 mt-1 max-w-sm mx-auto">
          Hier komt het overzicht van gepland en uitgevoerd onderhoud.
        </p>
      </div>
    </div>
  )
}
