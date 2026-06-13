'use client'

import { useEffect } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import { useAppStore } from '@/store/useAppStore'

export function useKeyboard() {
  const { vimMode, setActiveTab, toggleZenMode, setVimMode, toggleTheme } = useAppStore()

  const normalOnly = { enabled: vimMode === 'normal', preventDefault: true }
  const anyMode    = { preventDefault: true }

  // Tab switching
  useHotkeys('1', () => setActiveTab('calendar'), normalOnly)
  useHotkeys('2', () => setActiveTab('todo'),     normalOnly)
  useHotkeys('3', () => setActiveTab('both'),     normalOnly)

  // Zen + theme
  useHotkeys('z', () => toggleZenMode(), normalOnly)
  useHotkeys('t', () => toggleTheme(),   normalOnly)

  // Mode transitions (react-hotkeys-hook handles these well)
  useHotkeys('i',      () => setVimMode('insert'), normalOnly)
  useHotkeys('escape', () => setVimMode('normal'), anyMode)

  // `:` (colon = Shift+;) — hotkeys-js can't reliably detect this,
  // so we use a raw listener scoped to normal mode only.
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName
      const isEditing = tag === 'INPUT' || tag === 'TEXTAREA' || (e.target as HTMLElement)?.isContentEditable
      if (isEditing) return
      if (e.key === ':' && vimMode === 'normal') {
        e.preventDefault()
        setVimMode('command')
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [vimMode, setVimMode])
}
