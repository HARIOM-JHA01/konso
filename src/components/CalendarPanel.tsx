'use client'

import { useEffect, useRef, useState } from 'react'
import { useAppStore } from '@/store/useAppStore'
import { useCalendarStore } from '@/store/useCalendarStore'
import { useToastStore } from '@/store/useToastStore'

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

function parseDate(str: string) {
  const [y, m, d] = str.split('-').map(Number)
  return new Date(y, m - 1, d)
}

function formatDate(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function addDays(str: string, n: number): string {
  const d = parseDate(str)
  d.setDate(d.getDate() + n)
  return formatDate(d)
}

function isSameMonth(str: string, year: number, month: number) {
  const [y, m] = str.split('-').map(Number)
  return y === year && m === month
}

function todayStr() {
  return formatDate(new Date())
}

export default function CalendarPanel() {
  const { vimMode, setVimMode, activeTab } = useAppStore()
  const { selectedDate, events, isAdding, isLoading, setSelectedDate, setEvents, addEvent, removeEvent, setIsAdding, setIsLoading } =
    useCalendarStore()
  const { addToast } = useToastStore()

  const [inputValue, setInputValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  // Derive visible month from selectedDate
  const [selYear, selMonth] = selectedDate.split('-').map(Number)

  // Fetch events whenever visible month changes
  useEffect(() => {
    setIsLoading(true)
    const month = `${selYear}-${String(selMonth).padStart(2, '0')}`
    fetch(`/api/events?month=${month}`)
      .then((r) => r.json())
      .then(setEvents)
      .catch(() => addToast('Could not load events', 'error'))
      .finally(() => setIsLoading(false))
  }, [selYear, selMonth, setEvents, setIsLoading])

  // Focus input when adding
  useEffect(() => {
    if (isAdding && vimMode === 'insert') {
      setTimeout(() => inputRef.current?.focus(), 0)
    }
  }, [isAdding, vimMode])

  // Cancel add when mode leaves insert
  useEffect(() => {
    if (vimMode === 'normal') {
      setIsAdding(false)
      setInputValue('')
    }
  }, [vimMode, setIsAdding])

  // Keyboard navigation — only when calendar tab is active
  useEffect(() => {
    const isActive = activeTab === 'calendar'

    const handler = (e: KeyboardEvent) => {
      if (!isActive || vimMode !== 'normal') return

      switch (e.key) {
        case 'h':
        case 'ArrowLeft':
          e.preventDefault()
          setSelectedDate(addDays(selectedDate, -1))
          break
        case 'l':
        case 'ArrowRight':
          e.preventDefault()
          setSelectedDate(addDays(selectedDate, 1))
          break
        case 'j':
        case 'ArrowDown':
          e.preventDefault()
          setSelectedDate(addDays(selectedDate, 7))
          break
        case 'k':
        case 'ArrowUp':
          e.preventDefault()
          setSelectedDate(addDays(selectedDate, -7))
          break
        case '[':
          e.preventDefault()
          setSelectedDate(addDays(selectedDate, -28))
          break
        case ']':
          e.preventDefault()
          setSelectedDate(addDays(selectedDate, 28))
          break
        case 'o':
          e.preventDefault()
          setIsAdding(true)
          setVimMode('insert')
          break
        case 'd': {
          e.preventDefault()
          const dayEvents = events.filter((ev) => ev.date === selectedDate)
          if (dayEvents.length > 0) handleDelete(dayEvents[dayEvents.length - 1]._id)
          break
        }
      }
    }

    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vimMode, activeTab, selectedDate, events])

  async function handleAdd() {
    const title = inputValue.trim()
    if (!title) { setVimMode('normal'); return }
    try {
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, date: selectedDate }),
      })
      if (!res.ok) throw new Error()
      const event = await res.json()
      addEvent(event)
    } catch {
      addToast('Failed to create event', 'error')
    }
    setVimMode('normal')
  }

  async function handleDelete(id: string) {
    try {
      const res = await fetch(`/api/events/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
      removeEvent(id)
    } catch {
      addToast('Failed to delete event', 'error')
    }
  }

  function onInputKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') { e.preventDefault(); handleAdd() }
  }

  // Build calendar grid (Mon-first)
  const firstOfMonth = new Date(selYear, selMonth - 1, 1)
  // Mon=0 … Sun=6 offset
  const startOffset = (firstOfMonth.getDay() + 6) % 7
  const daysInMonth = new Date(selYear, selMonth, 0).getDate()
  const totalCells = Math.ceil((startOffset + daysInMonth) / 7) * 7

  const cells: (string | null)[] = []
  for (let i = 0; i < totalCells; i++) {
    const dayNum = i - startOffset + 1
    if (dayNum < 1 || dayNum > daysInMonth) { cells.push(null); continue }
    const d = new Date(selYear, selMonth - 1, dayNum)
    cells.push(formatDate(d))
  }

  const today = todayStr()
  const monthStr = `${selYear}-${String(selMonth).padStart(2, '0')}`
  const monthLabel = new Date(selYear, selMonth - 1, 1).toLocaleString('default', {
    month: 'long', year: 'numeric',
  })

  const eventsByDate: Record<string, number> = {}
  events.forEach((ev) => {
    eventsByDate[ev.date] = (eventsByDate[ev.date] ?? 0) + 1
  })

  const selectedDayEvents = events.filter((ev) => ev.date === selectedDate)

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-6 pt-5 pb-3 border-b border-white/6 flex items-center gap-4 shrink-0">
        <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-white/25">
          calendar
        </span>
        <span className="font-mono text-xs text-white/50 ml-auto">
          {monthLabel}
        </span>
        <div className="flex gap-2 font-mono text-[10px] text-white/20">
          <button onClick={() => setSelectedDate(addDays(selectedDate, -28))} className="hover:text-white/50 transition-colors">[ prev</button>
          <button onClick={() => setSelectedDate(addDays(selectedDate, 28))} className="hover:text-white/50 transition-colors">next ]</button>
        </div>
      </div>

      <div className="flex flex-1 min-h-0">
        {/* Calendar grid */}
        <div className="flex flex-col flex-1 px-4 py-3 min-w-0">
          {/* Day labels */}
          <div className="grid grid-cols-7 mb-1">
            {DAY_LABELS.map((d) => (
              <div key={d} className="text-center font-mono text-[9px] tracking-widest text-white/20 uppercase py-1">
                {d}
              </div>
            ))}
          </div>

          {/* Day cells */}
          <div className="grid grid-cols-7 gap-px flex-1">
            {cells.map((dateStr, i) => {
              if (isLoading && dateStr) {
                return (
                  <div key={i} className="aspect-square flex items-center justify-center">
                    <div className="w-4 h-2 bg-white/6 rounded animate-pulse" />
                  </div>
                )
              }
              if (!dateStr) {
                return <div key={i} className="aspect-square" />
              }
              const isToday = dateStr === today
              const isSelected = dateStr === selectedDate
              const hasEvents = (eventsByDate[dateStr] ?? 0) > 0
              const isCurrentMonth = isSameMonth(dateStr, selYear, selMonth)
              const [,,d] = dateStr.split('-')

              return (
                <button
                  key={dateStr}
                  onClick={() => setSelectedDate(dateStr)}
                  className={[
                    'relative flex flex-col items-center justify-center aspect-square font-mono text-xs transition-colors duration-75 rounded-sm',
                    isSelected
                      ? 'bg-white text-black'
                      : isToday
                      ? 'ring-1 ring-white/30 text-white'
                      : isCurrentMonth
                      ? 'text-white/50 hover:bg-white/6 hover:text-white/80'
                      : 'text-white/15 hover:bg-white/3',
                  ].join(' ')}
                >
                  {Number(d)}
                  {hasEvents && (
                    <span className={[
                      'absolute bottom-1 w-1 h-1 rounded-full',
                      isSelected ? 'bg-black/40' : 'bg-white/40',
                    ].join(' ')} />
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Event sidebar */}
        <div className="w-44 border-l border-white/6 flex flex-col shrink-0">
          <div className="px-3 pt-3 pb-2 border-b border-white/6 shrink-0">
            <span className="font-mono text-[9px] tracking-widest text-white/20 uppercase">
              {selectedDate}
            </span>
          </div>

          <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
            {selectedDayEvents.length === 0 && !isAdding && (
              <span className="font-mono text-[10px] text-white/12 block mt-1">no events</span>
            )}
            {selectedDayEvents.map((ev) => (
              <div key={ev._id} className="group flex items-start gap-1">
                <span className="font-mono text-[10px] text-white/50 leading-relaxed flex-1 break-words">
                  {ev.title}
                </span>
                <button
                  onClick={() => handleDelete(ev._id)}
                  className="font-mono text-[10px] text-white/0 group-hover:text-white/30 hover:!text-white/70 transition-colors shrink-0 mt-0.5"
                >
                  ×
                </button>
              </div>
            ))}

            {isAdding && vimMode === 'insert' && (
              <input
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={onInputKeyDown}
                placeholder="event title…"
                className="w-full bg-transparent font-mono text-[10px] text-white outline-none caret-white/70 border-b border-white/25 py-px mt-1 placeholder-white/15"
              />
            )}
          </div>

          <div className="px-3 py-2 border-t border-white/6 shrink-0">
            <span className="font-mono text-[9px] text-white/12 tracking-widest leading-relaxed block">
              {vimMode === 'normal'
                ? 'hjkl·move  o·add  d·del'
                : 'enter·save  esc·cancel'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
