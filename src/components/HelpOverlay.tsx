'use client'

import { useEffect } from 'react'
import { useAppStore } from '@/store/useAppStore'

const sections = [
  {
    title: 'Global',
    rows: [
      ['1 / 2 / 3', 'switch to Calendar / To-Do / Both'],
      ['z', 'toggle Zen mode'],
      ['i', 'enter INSERT mode'],
      [':', 'enter COMMAND mode'],
      ['<esc>', 'back to NORMAL mode'],
    ],
  },
  {
    title: 'Commands  (type after :)',
    rows: [
      [':cal  :todo  :both', 'switch tabs'],
      [':zen', 'toggle Zen mode'],
      [':clear', 'delete all completed todos'],
      [':help  :h', 'show this help'],
      [':q  :w  :wq', 'vim easter eggs'],
    ],
  },
  {
    title: 'To-Do  (Normal mode, tab 2)',
    rows: [
      ['j / k', 'move selection down / up'],
      ['o', 'add new task'],
      ['<enter>', 'edit selected task'],
      ['x', 'toggle completion'],
      ['d', 'delete selected task'],
      ['g g', 'jump to first task'],
      ['G', 'jump to last task'],
    ],
  },
  {
    title: 'Calendar  (Normal mode, tab 1)',
    rows: [
      ['h / l', 'previous / next day'],
      ['j / k', 'previous / next week'],
      ['[ / ]', 'previous / next month'],
      ['o', 'add event on selected day'],
      ['d', 'delete last event on selected day'],
    ],
  },
]

export default function HelpOverlay() {
  const { setShowHelp, setVimMode } = useAppStore()

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'q') {
        e.preventDefault()
        setShowHelp(false)
        setVimMode('normal')
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [setShowHelp, setVimMode])

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6"
      onClick={() => { setShowHelp(false); setVimMode('normal') }}
    >
      <div
        className="bg-[#111] border border-white/10 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Title bar */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-white/8">
          <span className="font-mono text-xs tracking-widest text-white/40 uppercase">help</span>
          <button
            onClick={() => { setShowHelp(false); setVimMode('normal') }}
            className="font-mono text-xs text-white/20 hover:text-white/60 transition-colors"
          >
            esc · close
          </button>
        </div>

        {/* Sections */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-0 divide-y divide-white/6 sm:divide-y-0">
          {sections.map((section) => (
            <div key={section.title} className="px-6 py-5 border-b border-white/6 last:border-0 sm:border-b sm:border-r sm:last:border-r-0 sm:even:border-r-0">
              <div className="font-mono text-[9px] tracking-[0.25em] uppercase text-white/25 mb-4">
                {section.title}
              </div>
              <div className="space-y-2">
                {section.rows.map(([key, desc]) => (
                  <div key={key} className="flex gap-3 items-baseline">
                    <kbd className="font-mono text-[10px] text-emerald-400/70 shrink-0 w-32">
                      {key}
                    </kbd>
                    <span className="font-mono text-[10px] text-white/40 leading-relaxed">
                      {desc}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="px-6 py-3 border-t border-white/8">
          <span className="font-mono text-[9px] text-white/15 tracking-widest">
            press esc or q to close
          </span>
        </div>
      </div>
    </div>
  )
}
