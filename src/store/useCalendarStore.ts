import { create } from 'zustand'
import { ICalendarEvent } from '@/models/CalendarEvent'

interface CalendarState {
  selectedDate: string
  events: ICalendarEvent[]
  isAdding: boolean
  isLoading: boolean

  setSelectedDate: (d: string) => void
  setEvents: (events: ICalendarEvent[]) => void
  addEvent: (event: ICalendarEvent) => void
  removeEvent: (id: string) => void
  setIsAdding: (v: boolean) => void
  setIsLoading: (v: boolean) => void
}

function todayStr() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export const useCalendarStore = create<CalendarState>((set) => ({
  selectedDate: todayStr(),
  events: [],
  isAdding: false,
  isLoading: true,

  setSelectedDate: (d) => set({ selectedDate: d }),
  setEvents: (events) => set({ events }),
  addEvent: (event) => set((s) => ({ events: [...s.events, event] })),
  removeEvent: (id) => set((s) => ({ events: s.events.filter((e) => e._id !== id) })),
  setIsAdding: (v) => set({ isAdding: v }),
  setIsLoading: (v) => set({ isLoading: v }),
}))
