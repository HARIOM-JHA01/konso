'use client'

import { useEffect, useRef } from 'react'
import { useAppStore } from '@/store/useAppStore'

const modeConfig = {
  normal:  { label: 'NORMAL',  color: '#10b981' }, // emerald-500
  insert:  { label: 'INSERT',  color: '#fbbf24' }, // amber-400
  command: { label: 'COMMAND', color: '#0ea5e9' }, // sky-500
}

const hint = {
  normal:  'i · insert  :  command  z · zen',
  insert:  '<esc> · normal',
  command: '<esc> · normal',
}

export default function ModeIndicator() {
  const vimMode = useAppStore((s) => s.vimMode)
  const theme   = useAppStore((s) => s.theme)
  const { label, color } = modeConfig[vimMode]
  const badgeRef = useRef<HTMLSpanElement>(null)

  // Pulse the badge on every mode change
  useEffect(() => {
    const el = badgeRef.current
    if (!el) return
    el.animate(
      [{ transform: 'scaleX(1.08)', opacity: 0.7 }, { transform: 'scaleX(1)', opacity: 1 }],
      { duration: 180, easing: 'ease-out' }
    )
  }, [vimMode])

  return (
    <div className="flex items-center gap-3 font-mono text-xs">
      <span
        ref={badgeRef}
        className="px-3 py-1 font-bold tracking-widest text-black origin-left"
        style={{
          backgroundColor: color,
          transition: 'background-color 140ms ease',
          // Re-invert in light mode so the badge colors survive the double-flip
          filter: theme === 'light' ? 'invert(1) hue-rotate(180deg)' : undefined,
        }}
      >
        {label}
      </span>
      <span className="text-white/20 tracking-wider hidden sm:inline transition-opacity duration-150">
        {hint[vimMode]}
      </span>
    </div>
  )
}
