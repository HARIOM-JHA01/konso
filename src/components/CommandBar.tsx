'use client'

import { useEffect, useRef, useState } from 'react'
import { useAppStore } from '@/store/useAppStore'
import { useTodoStore } from '@/store/useTodoStore'
import { executeCommand } from '@/lib/commands'

export default function CommandBar() {
  const { setActiveTab, toggleZenMode, setShowHelp, setVimMode, commandOutput, setCommandOutput, setTheme } =
    useAppStore()
  const { todos, deleteTodo } = useTodoStore()

  const [input, setInput] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
    setCommandOutput('')
  }, [setCommandOutput])

  async function clearCompleted() {
    const completed = todos.filter((t) => t.completed)
    await Promise.all(
      completed.map((t) =>
        fetch(`/api/todos/${t._id}`, { method: 'DELETE' })
          .then(() => deleteTodo(t._id))
          .catch(console.error)
      )
    )
  }

  function submit() {
    if (!input.trim()) { setVimMode('normal'); return }

    const output = executeCommand(input, {
      setActiveTab,
      toggleZenMode,
      setShowHelp,
      clearCompleted,
      setTheme,
    })

    if (output) {
      setCommandOutput(output)
      setInput('')
      // Stay in command mode to show output, exit on next Escape
    } else {
      setVimMode('normal')
      setInput('')
    }
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') { e.preventDefault(); submit() }
    if (e.key === 'Escape') { e.preventDefault(); setVimMode('normal'); setInput('') }
  }

  return (
    <div className="flex items-center gap-0 h-full px-2 font-mono text-sm">
      {commandOutput ? (
        <span className="text-amber-400/80 text-xs tracking-wide px-2">{commandOutput}</span>
      ) : (
        <>
          <span className="text-white/60 select-none px-1">:</span>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            spellCheck={false}
            autoComplete="off"
            className="flex-1 bg-transparent text-white outline-none caret-white text-xs tracking-wide"
          />
        </>
      )}
    </div>
  )
}
