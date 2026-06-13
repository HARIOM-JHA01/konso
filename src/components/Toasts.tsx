'use client'

import { useToastStore } from '@/store/useToastStore'

const typeStyles = {
  error:   'border-red-500/40 text-red-400',
  success: 'border-emerald-500/40 text-emerald-400',
  info:    'border-white/20 text-white/60',
}

export default function Toasts() {
  const { toasts, removeToast } = useToastStore()

  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-12 right-4 z-50 flex flex-col gap-2 items-end pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={[
            'flex items-center gap-3 px-4 py-2 bg-[#161616] border font-mono text-xs pointer-events-auto',
            'animate-in fade-in slide-in-from-bottom-2 duration-200',
            typeStyles[toast.type],
          ].join(' ')}
          style={{ maxWidth: '320px' }}
        >
          <span className="flex-1 tracking-wide">{toast.message}</span>
          <button
            onClick={() => removeToast(toast.id)}
            className="text-white/20 hover:text-white/60 transition-colors shrink-0"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  )
}
