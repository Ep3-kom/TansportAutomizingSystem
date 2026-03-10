import { AlertTriangle } from 'lucide-react'

export default function ConfirmDialog({ open, onClose, onConfirm, title, message }) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-card-lg w-full max-w-sm mx-4 p-6 border border-gray-100/80">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-danger-50 rounded-xl flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-5 h-5 text-danger-500" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-800">{title}</h3>
            <p className="text-sm text-gray-500 mt-1 leading-relaxed">{message}</p>
          </div>
        </div>
        <div className="flex gap-3 mt-6 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-stone-100 rounded-xl hover:bg-stone-200 transition-colors duration-200"
          >
            Annuleren
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2.5 text-sm font-medium text-white bg-danger-500 rounded-xl hover:bg-danger-400 transition-colors duration-200 shadow-sm"
          >
            Verwijderen
          </button>
        </div>
      </div>
    </div>
  )
}
