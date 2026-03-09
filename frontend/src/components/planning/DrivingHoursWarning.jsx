import { useState, useEffect } from 'react'
import { AlertTriangle, ShieldAlert, Clock, Info } from 'lucide-react'

export default function DrivingHoursWarning({ violations = [], warnings = [] }) {
  if (violations.length === 0 && warnings.length === 0) return null

  return (
    <div className="space-y-2">
      {/* Overtredingen (rood) */}
      {violations.map((v, i) => (
        <div key={`v-${i}`} className="flex items-start gap-2.5 px-3 py-2.5 bg-danger-50 border border-danger-200 rounded-lg">
          <ShieldAlert className="w-4 h-4 text-danger-500 mt-0.5 shrink-0" />
          <div>
            <p className="text-xs font-semibold text-danger-700">Overtreding EU 561/2006</p>
            <p className="text-xs text-danger-600 mt-0.5">{v.message}</p>
          </div>
        </div>
      ))}

      {/* Waarschuwingen (oranje) */}
      {warnings.map((w, i) => (
        <div key={`w-${i}`} className="flex items-start gap-2.5 px-3 py-2.5 bg-warn-50 border border-amber-200 rounded-lg">
          <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
          <div>
            <p className="text-xs font-semibold text-amber-700">Let op — Rijtijden</p>
            <p className="text-xs text-amber-600 mt-0.5">{w.message}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
