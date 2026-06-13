'use client'

import { useAppStore } from '@/store/useAppStore'

const tabs = [
  { id: 'calendar' as const, label: 'Calendar', key: '1' },
  { id: 'todo' as const, label: 'To-Do', key: '2' },
  { id: 'both' as const, label: 'Both', key: '3' },
]

export default function TabBar() {
  const { activeTab, setActiveTab } = useAppStore()

  return (
    <header className="flex items-center gap-0 border-b border-white/8 px-6 py-0 shrink-0">
      {tabs.map((tab, i) => {
        const isActive = activeTab === tab.id
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={[
              'relative flex items-center gap-2 px-5 py-3 font-mono text-xs tracking-widest uppercase transition-colors duration-150 cursor-pointer select-none',
              isActive
                ? 'text-white'
                : 'text-white/30 hover:text-white/60',
            ].join(' ')}
          >
            <span className="text-white/20">{tab.key}</span>
            <span>{tab.label}</span>
            {isActive && (
              <span className="absolute bottom-0 left-0 right-0 h-px bg-white" />
            )}
          </button>
        )
      })}
      <div className="ml-auto font-mono text-xs text-white/15 tracking-widest pr-1">
        konso
      </div>
    </header>
  )
}
