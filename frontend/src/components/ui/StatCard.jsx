export default function StatCard({ icon: Icon, label, value, subtitle, color = 'primary' }) {
  const colorMap = {
    primary: {
      bg: 'bg-primary-50',
      icon: 'text-primary-500',
      value: 'text-primary-700',
    },
    accent: {
      bg: 'bg-accent-50',
      icon: 'text-accent-500',
      value: 'text-accent-500',
    },
    warn: {
      bg: 'bg-warn-50',
      icon: 'text-warn-500',
      value: 'text-warn-500',
    },
    danger: {
      bg: 'bg-danger-50',
      icon: 'text-danger-500',
      value: 'text-danger-500',
    },
  }

  const c = colorMap[color] || colorMap.primary

  return (
    <div className="bg-card rounded-xl border border-gray-100 p-5 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 font-medium">{label}</p>
          <p className={`text-3xl font-bold mt-1 ${c.value}`}>{value}</p>
          {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
        </div>
        <div className={`${c.bg} p-2.5 rounded-lg`}>
          <Icon className={`w-5 h-5 ${c.icon}`} />
        </div>
      </div>
    </div>
  )
}
