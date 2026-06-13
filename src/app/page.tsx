'use client'

import { useEffect, useState } from 'react'
import { useAppStore } from '@/store/useAppStore'
import { useKeyboard } from '@/hooks/useKeyboard'
import TabBar from '@/components/TabBar'
import ModeIndicator from '@/components/ModeIndicator'
import CommandBar from '@/components/CommandBar'
import HelpOverlay from '@/components/HelpOverlay'
import CalendarPanel from '@/components/CalendarPanel'
import TodoPanel from '@/components/TodoPanel'
import Toasts from '@/components/Toasts'

const ZEN_TRANSITION = 'opacity 260ms ease, transform 260ms ease, max-height 260ms ease'

export default function Home() {
  useKeyboard()

  const { activeTab, zenMode, vimMode, showHelp, theme } = useAppStore()
  const isCommand = vimMode === 'command'
  const isLight = theme === 'light'

  // Panel fade
  const [displayedTab, setDisplayedTab] = useState(activeTab)
  const [panelVisible, setPanelVisible] = useState(true)

  useEffect(() => {
    if (activeTab === displayedTab) return
    setPanelVisible(false)
    const t = setTimeout(() => {
      setDisplayedTab(activeTab)
      setPanelVisible(true)
    }, 110)
    return () => clearTimeout(t)
  }, [activeTab, displayedTab])

  const zenHideTop = {
    opacity: zenMode ? 0 : 1,
    transform: zenMode ? 'translateY(-4px)' : 'translateY(0)',
    pointerEvents: (zenMode ? 'none' : 'auto') as React.CSSProperties['pointerEvents'],
    maxHeight: zenMode ? '0px' : '60px',
    overflow: 'hidden' as const,
    transition: ZEN_TRANSITION,
  }

  const zenHideBottom = {
    opacity: zenMode ? 0 : 1,
    transform: zenMode ? 'translateY(4px)' : 'translateY(0)',
    pointerEvents: (zenMode ? 'none' : 'auto') as React.CSSProperties['pointerEvents'],
    maxHeight: zenMode ? '0px' : '44px',
    overflow: 'hidden' as const,
    transition: ZEN_TRANSITION,
    borderTop: '1px solid rgba(255,255,255,0.05)',
  }

  return (
    <div
      id="app-root"
      className="flex flex-col h-screen bg-[#0d0d0d] text-white overflow-hidden"
      style={isLight ? { filter: 'invert(1) hue-rotate(180deg)', transition: 'filter 200ms ease' } : { transition: 'filter 200ms ease' }}
    >

      {showHelp && <HelpOverlay />}
      <Toasts />

      {/* Tab bar */}
      <div style={zenHideTop} className="shrink-0">
        <TabBar />
      </div>

      {/* Main content */}
      <main
        className={['flex flex-1 min-h-0', displayedTab === 'both' ? 'flex-col sm:flex-row' : 'flex-row'].join(' ')}
        style={{ opacity: panelVisible ? 1 : 0, transition: 'opacity 110ms ease' }}
      >
        {(displayedTab === 'calendar' || displayedTab === 'both') && (
          <div
            className={[
              'flex flex-col min-h-0',
              displayedTab === 'both'
                ? 'flex-1 border-b sm:border-b-0 sm:border-r border-white/8'
                : 'flex-1',
            ].join(' ')}
          >
            <CalendarPanel />
          </div>
        )}
        {(displayedTab === 'todo' || displayedTab === 'both') && (
          <div className="flex flex-col flex-1 min-h-0">
            <TodoPanel />
          </div>
        )}
      </main>

      {/* Status bar */}
      <div style={zenHideBottom} className="shrink-0">
        <footer className="flex items-center h-9">
          {isCommand ? (
            <div className="flex-1 h-full">
              <CommandBar />
            </div>
          ) : (
            <>
              <div className="px-4">
                <ModeIndicator />
              </div>
              <span className="ml-auto font-mono text-[10px] text-white/12 tracking-widest pr-4 hidden sm:inline">
                {activeTab === 'calendar' ? '1:cal' : activeTab === 'todo' ? '2:todo' : '3:both'}
                {' · '}t·theme{' · '}z·zen{' · '}:help
              </span>
            </>
          )}
        </footer>
      </div>
    </div>
  )
}
