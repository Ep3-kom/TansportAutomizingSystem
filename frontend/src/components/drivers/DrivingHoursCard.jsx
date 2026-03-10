import { Clock, AlertTriangle, ShieldAlert, CheckCircle } from 'lucide-react'

function ProgressBar({ label, current, max, unit = 'u' }) {
  const percent = Math.min((current / max) * 100, 100)
  const isOver = current > max
  const isWarning = percent >= 80 && !isOver

  let barColor = 'bg-primary-400'
  if (isOver) barColor = 'bg-danger-400'
  else if (isWarning) barColor = 'bg-amber-400'

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-[11px]">
        <span className="text-gray-500">{label}</span>
        <span className={`font-medium ${isOver ? 'text-danger-600' : isWarning ? 'text-amber-600' : 'text-gray-600'}`}>
          {current.toFixed(1)}{unit} / {max}{unit}
        </span>
      </div>
      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-300 ${barColor}`}
          style={{ width: `${Math.min(percent, 100)}%` }}
        />
      </div>
    </div>
  )
}

export default function DrivingHoursCard({ drivers, getDriverSummary }) {
  if (!drivers || drivers.length === 0) return null

  const activeDrivers = drivers.filter(d => d.status === 'actief')

  const driverData = activeDrivers.map(driver => ({
    ...driver,
    summary: getDriverSummary(driver.id),
  }))

  // Sorteer: overtredingen eerst, dan waarschuwingen, dan ok
  const statusOrder = { violation: 0, warning: 1, ok: 2 }
  driverData.sort((a, b) => statusOrder[a.summary.status] - statusOrder[b.summary.status])

  // Filter: toon alleen chauffeurs met rijtijd > 0
  const driversWithHours = driverData.filter(d => d.summary.weeklyHours > 0)

  if (driversWithHours.length === 0) return null

  const violationCount = driversWithHours.filter(d => d.summary.status === 'violation').length
  const warningCount = driversWithHours.filter(d => d.summary.status === 'warning').length

  return (
    <div className="bg-card rounded-xl border border-gray-100/80 shadow-card overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100/60">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-800">Rij- & Rusttijden</h3>
            <p className="text-xs text-gray-400 mt-0.5">EU Verordening 561/2006</p>
          </div>
          {violationCount > 0 ? (
            <span className="flex items-center gap-1 text-xs font-medium text-danger-600 bg-danger-50 px-2 py-1 rounded-full">
              <ShieldAlert className="w-3 h-3" /> {violationCount} overtreding{violationCount !== 1 ? 'en' : ''}
            </span>
          ) : warningCount > 0 ? (
            <span className="flex items-center gap-1 text-xs font-medium text-amber-600 bg-warn-50 px-2 py-1 rounded-full">
              <AlertTriangle className="w-3 h-3" /> {warningCount} waarschuwing{warningCount !== 1 ? 'en' : ''}
            </span>
          ) : (
            <span className="flex items-center gap-1 text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
              <CheckCircle className="w-3 h-3" /> In orde
            </span>
          )}
        </div>
      </div>

      <div className="divide-y divide-gray-50">
        {driversWithHours.map(driver => {
          const { summary } = driver
          const statusIcon = summary.status === 'violation'
            ? <ShieldAlert className="w-4 h-4 text-danger-500" />
            : summary.status === 'warning'
            ? <AlertTriangle className="w-4 h-4 text-amber-500" />
            : <CheckCircle className="w-4 h-4 text-green-400" />

          return (
            <div key={driver.id} className="px-5 py-3.5">
              <div className="flex items-center gap-3 mb-2.5">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  summary.status === 'violation' ? 'bg-danger-50' :
                  summary.status === 'warning' ? 'bg-warn-50' : 'bg-green-50'
                }`}>
                  {statusIcon}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">{driver.name}</p>
                  <p className="text-[11px] text-gray-400">
                    Vandaag: {summary.dailyHours.toFixed(1)}u · Week: {summary.weeklyHours.toFixed(1)}u
                  </p>
                </div>
              </div>
              <div className="space-y-1.5 ml-11">
                <ProgressBar label="Dag" current={summary.dailyHours} max={9} />
                <ProgressBar label="Week" current={summary.weeklyHours} max={56} />
                <ProgressBar label="2 weken" current={summary.biweeklyHours} max={90} />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
