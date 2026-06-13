export type Tab = 'calendar' | 'todo' | 'both'

export interface CommandContext {
  setActiveTab: (tab: Tab) => void
  toggleZenMode: () => void
  setShowHelp: (v: boolean) => void
  clearCompleted: () => Promise<void>
  setTheme: (t: 'dark' | 'light') => void
}

/** Returns a feedback string (empty = silent success, non-empty = show in bar) */
export function executeCommand(raw: string, ctx: CommandContext): string {
  const cmd = raw.trim().toLowerCase()

  switch (cmd) {
    case '1':
    case 'cal':
    case 'calendar':
      ctx.setActiveTab('calendar')
      return ''

    case '2':
    case 'todo':
      ctx.setActiveTab('todo')
      return ''

    case '3':
    case 'both':
      ctx.setActiveTab('both')
      return ''

    case 'zen':
      ctx.toggleZenMode()
      return ''

    case 'h':
    case 'help':
      ctx.setShowHelp(true)
      return ''

    case 'clear':
      ctx.clearCompleted()
      return 'cleared completed tasks'

    case 'light':
    case 'theme light':
      ctx.setTheme('light')
      return ''

    case 'dark':
    case 'theme dark':
      ctx.setTheme('dark')
      return ''

    case 'q':
      return 'E37: No write since last change (add ! to override)'

    case 'q!':
      return 'Nice try. This is a browser.'

    case 'w':
    case 'write':
      return 'Already synced to MongoDB ☁'

    case 'wq':
      return 'Saved to cloud. Still cannot quit the browser.'

    case 'noh':
    case 'nohlsearch':
      return "E185: Cannot find color scheme 'highlight'"

    default:
      return `E492: Not an editor command: ${raw.trim()}`
  }
}
