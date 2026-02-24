import { CalendarDays } from 'lucide-react'

export default function Planning() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Planning</h2>
        <p className="text-sm text-gray-500 mt-1">Weekoverzicht van alle ritten</p>
      </div>

      <div className="bg-card rounded-xl border border-gray-100 p-12 text-center">
        <div className="w-14 h-14 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto">
          <CalendarDays className="w-7 h-7 text-primary-400" />
        </div>
        <h3 className="mt-4 text-lg font-semibold text-gray-700">Weekplanning</h3>
        <p className="text-sm text-gray-400 mt-1 max-w-sm mx-auto">
          Hier komt de weekkalender met ritplanning.
        </p>
      </div>
    </div>
  )
}
