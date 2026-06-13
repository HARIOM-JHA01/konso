'use client'

import { useEffect, useRef, useState } from 'react'
import { useAppStore } from '@/store/useAppStore'
import { useTodoStore } from '@/store/useTodoStore'
import { useToastStore } from '@/store/useToastStore'

export default function TodoPanel() {
  const { vimMode, setVimMode, activeTab } = useAppStore()
  const {
    todos, selectedIndex, isAdding, editingId, isLoading,
    setTodos, addTodo, updateTodo, deleteTodo,
    setSelectedIndex, setIsAdding, setEditingId, setIsLoading,
  } = useTodoStore()
  const { addToast } = useToastStore()

  const [inputValue, setInputValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const gPendingRef = useRef(false)

  // Fetch todos on mount
  useEffect(() => {
    setIsLoading(true)
    fetch('/api/todos')
      .then((r) => r.json())
      .then(setTodos)
      .catch(() => addToast('Could not load tasks', 'error'))
      .finally(() => setIsLoading(false))
  }, [setTodos, setIsLoading])

  // Focus input when adding/editing
  useEffect(() => {
    if ((isAdding || editingId) && vimMode === 'insert') {
      setTimeout(() => inputRef.current?.focus(), 0)
    }
  }, [isAdding, editingId, vimMode])

  // Pre-fill input when editing
  useEffect(() => {
    if (editingId) {
      const todo = todos.find((t) => t._id === editingId)
      setInputValue(todo?.text ?? '')
    } else if (isAdding) {
      setInputValue('')
    }
  }, [editingId, isAdding, todos])

  // When switching back to normal mode, cancel any in-progress add/edit
  useEffect(() => {
    if (vimMode === 'normal') {
      setIsAdding(false)
      setEditingId(null)
      setInputValue('')
    }
  }, [vimMode, setIsAdding, setEditingId])

  // Keep selected item scrolled into view
  useEffect(() => {
    const el = listRef.current?.querySelector(`[data-index="${selectedIndex}"]`)
    el?.scrollIntoView({ block: 'nearest' })
  }, [selectedIndex])

  // Todo-specific keyboard shortcuts (normal mode, todo tab active)
  useEffect(() => {
    const isActive = activeTab === 'todo' || activeTab === 'both'

    const handler = (e: KeyboardEvent) => {
      if (!isActive || vimMode !== 'normal') return

      switch (e.key) {
        case 'j':
        case 'ArrowDown':
          e.preventDefault()
          setSelectedIndex(Math.min(selectedIndex + 1, todos.length - 1))
          break
        case 'k':
        case 'ArrowUp':
          e.preventDefault()
          setSelectedIndex(Math.max(selectedIndex - 1, 0))
          break
        case 'o':
          e.preventDefault()
          setIsAdding(true)
          setVimMode('insert')
          break
        case 'Enter':
          e.preventDefault()
          if (todos[selectedIndex]) {
            setEditingId(todos[selectedIndex]._id)
            setVimMode('insert')
          }
          break
        case 'x':
          e.preventDefault()
          if (todos[selectedIndex]) toggleTodo(todos[selectedIndex])
          break
        case 'd':
          e.preventDefault()
          if (todos[selectedIndex]) handleDelete(todos[selectedIndex]._id)
          break
        case 'g':
          // gg = jump to first (second g handled via gPending ref)
          if (gPendingRef.current) {
            e.preventDefault()
            setSelectedIndex(0)
            gPendingRef.current = false
          } else {
            gPendingRef.current = true
            setTimeout(() => { gPendingRef.current = false }, 500)
          }
          break
        case 'G':
          e.preventDefault()
          setSelectedIndex(Math.max(0, todos.length - 1))
          break
      }
    }

    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vimMode, activeTab, selectedIndex, todos])

  async function handleAdd() {
    const text = inputValue.trim()
    if (!text) { setVimMode('normal'); return }
    try {
      const res = await fetch('/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      })
      if (!res.ok) throw new Error('Failed to create task')
      const todo = await res.json()
      addTodo(todo)
      setSelectedIndex(todos.length)
    } catch (e) {
      addToast('Failed to create task', 'error')
      console.error(e)
    }
    setVimMode('normal')
  }

  async function handleEdit() {
    const text = inputValue.trim()
    if (!text || !editingId) { setVimMode('normal'); return }
    try {
      const res = await fetch(`/api/todos/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      })
      if (!res.ok) throw new Error('Failed to update task')
      const updated = await res.json()
      updateTodo(editingId, updated)
    } catch (e) {
      addToast('Failed to update task', 'error')
      console.error(e)
    }
    setVimMode('normal')
  }

  async function toggleTodo(todo: { _id: string; completed: boolean }) {
    try {
      const res = await fetch(`/api/todos/${todo._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !todo.completed }),
      })
      if (!res.ok) throw new Error('Failed to toggle task')
      const updated = await res.json()
      updateTodo(todo._id, updated)
    } catch (e) {
      addToast('Failed to toggle task', 'error')
      console.error(e)
    }
  }

  async function handleDelete(id: string) {
    try {
      const res = await fetch(`/api/todos/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete task')
      deleteTodo(id)
    } catch (e) {
      addToast('Failed to delete task', 'error')
      console.error(e)
    }
  }

  function onInputKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.preventDefault()
      isAdding ? handleAdd() : handleEdit()
    }
    // Escape is handled globally → goes to normal → clears isAdding/editingId
  }

  const isEmpty = todos.length === 0

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-6 pt-5 pb-3 border-b border-white/6 shrink-0">
        <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-white/25">
          to-do
        </span>
      </div>

      {/* List */}
      <div ref={listRef} className="flex-1 overflow-y-auto px-6 py-3 space-y-px">
        {isLoading && (
          <div className="space-y-2 pt-2">
            {[40, 64, 52, 72, 44].map((w, i) => (
              <div key={i} className="flex items-center gap-3 px-3 py-2">
                <div className="w-3 shrink-0" />
                <div className="w-4 h-4 shrink-0 bg-white/6 rounded-sm animate-pulse" />
                <div className="h-2 bg-white/6 rounded animate-pulse" style={{ width: `${w}%` }} />
              </div>
            ))}
          </div>
        )}
        {!isLoading && isEmpty && !isAdding && (
          <div className="flex flex-col items-center justify-center h-full gap-3 select-none">
            <span className="font-mono text-xs text-white/15 tracking-widest">empty.</span>
            <span className="font-mono text-[10px] text-white/10">
              press <kbd className="text-white/25">o</kbd> to add a task
            </span>
          </div>
        )}

        {todos.map((todo, i) => {
          const isSelected = i === selectedIndex
          const isEditing = editingId === todo._id

          return (
            <div
              key={todo._id}
              data-index={i}
              onClick={() => setSelectedIndex(i)}
              className={[
                'group flex items-center gap-3 px-3 py-2 rounded-sm cursor-pointer transition-colors duration-75',
                isSelected ? 'bg-white/6' : 'hover:bg-white/3',
              ].join(' ')}
            >
              {/* Gutter indicator */}
              <span className="font-mono text-xs w-3 shrink-0 text-center text-white/20 select-none">
                {isSelected ? '›' : ''}
              </span>

              {/* Checkbox */}
              <button
                onClick={(e) => { e.stopPropagation(); toggleTodo(todo) }}
                className={[
                  'w-4 h-4 shrink-0 border font-mono text-[10px] flex items-center justify-center transition-colors',
                  todo.completed
                    ? 'border-white/20 text-white/30'
                    : 'border-white/20 text-transparent hover:border-white/40',
                ].join(' ')}
              >
                {todo.completed ? '×' : ''}
              </button>

              {/* Text or inline edit */}
              {isEditing && vimMode === 'insert' ? (
                <input
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={onInputKeyDown}
                  className="flex-1 bg-transparent font-mono text-sm text-white outline-none caret-white/70 border-b border-white/30 py-px"
                />
              ) : (
                <span
                  className={[
                    'flex-1 font-mono text-sm tracking-wide leading-relaxed transition-colors',
                    todo.completed ? 'line-through text-white/20' : 'text-white/80',
                  ].join(' ')}
                >
                  {todo.text}
                </span>
              )}

              {/* Delete button (hover/selected) */}
              {!isEditing && (
                <button
                  onClick={(e) => { e.stopPropagation(); handleDelete(todo._id) }}
                  className="font-mono text-xs text-white/0 group-hover:text-white/20 hover:!text-white/60 transition-colors ml-2 select-none"
                >
                  ×
                </button>
              )}
            </div>
          )
        })}

        {/* Add input row */}
        {isAdding && vimMode === 'insert' && (
          <div className="flex items-center gap-3 px-3 py-2">
            <span className="font-mono text-xs w-3 shrink-0 text-center text-white/20 select-none">›</span>
            <div className="w-4 h-4 shrink-0 border border-white/20" />
            <input
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={onInputKeyDown}
              placeholder="new task…"
              className="flex-1 bg-transparent font-mono text-sm text-white outline-none caret-white/70 border-b border-white/30 py-px placeholder-white/15"
            />
          </div>
        )}
      </div>

      {/* Hint bar */}
      <div className="px-6 py-2 border-t border-white/6 shrink-0">
        <span className="font-mono text-[10px] text-white/12 tracking-widest">
          {vimMode === 'normal'
            ? 'j/k · move  gg/G · first/last  o · add  enter · edit  x · toggle  d · delete'
            : 'enter · save  esc · cancel'}
        </span>
      </div>
    </div>
  )
}
