import { create } from 'zustand'

type Tab = 'calendar' | 'todo' | 'both'
type VimMode = 'normal' | 'insert' | 'command'
export type Theme = 'dark' | 'light'

interface AppState {
  activeTab: Tab
  zenMode: boolean
  vimMode: VimMode
  showHelp: boolean
  commandOutput: string
  theme: Theme
  setActiveTab: (tab: Tab) => void
  toggleZenMode: () => void
  setVimMode: (mode: VimMode) => void
  setShowHelp: (v: boolean) => void
  setCommandOutput: (msg: string) => void
  setTheme: (t: Theme) => void
  toggleTheme: () => void
}

export const useAppStore = create<AppState>((set) => ({
  activeTab: 'both',
  zenMode: false,
  vimMode: 'normal',
  showHelp: false,
  commandOutput: '',
  theme: 'dark',
  setActiveTab: (tab) => set({ activeTab: tab }),
  toggleZenMode: () => set((state) => ({ zenMode: !state.zenMode })),
  setVimMode: (mode) => set({ vimMode: mode }),
  setShowHelp: (v) => set({ showHelp: v }),
  setCommandOutput: (msg) => set({ commandOutput: msg }),
  setTheme: (t) => set({ theme: t }),
  toggleTheme: () => set((s) => ({ theme: s.theme === 'dark' ? 'light' : 'dark' })),
}))
