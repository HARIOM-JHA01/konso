import { create } from 'zustand'

export interface Todo {
  _id: string
  text: string
  completed: boolean
  order: number
  createdAt: string
}

interface TodoState {
  todos: Todo[]
  selectedIndex: number
  isAdding: boolean
  editingId: string | null
  isLoading: boolean

  setTodos: (todos: Todo[]) => void
  addTodo: (todo: Todo) => void
  updateTodo: (id: string, updates: Partial<Todo>) => void
  deleteTodo: (id: string) => void
  setSelectedIndex: (i: number) => void
  setIsAdding: (v: boolean) => void
  setEditingId: (id: string | null) => void
  setIsLoading: (v: boolean) => void
}

export const useTodoStore = create<TodoState>((set) => ({
  todos: [],
  selectedIndex: 0,
  isAdding: false,
  editingId: null,
  isLoading: true,

  setTodos: (todos) => set({ todos }),
  addTodo: (todo) => set((s) => ({ todos: [...s.todos, todo] })),
  updateTodo: (id, updates) =>
    set((s) => ({
      todos: s.todos.map((t) => (t._id === id ? { ...t, ...updates } : t)),
    })),
  deleteTodo: (id) =>
    set((s) => ({
      todos: s.todos.filter((t) => t._id !== id),
      selectedIndex: Math.max(0, s.selectedIndex - 1),
    })),
  setSelectedIndex: (i) => set({ selectedIndex: i }),
  setIsAdding: (v) => set({ isAdding: v }),
  setEditingId: (id) => set({ editingId: id }),
  setIsLoading: (v) => set({ isLoading: v }),
}))
