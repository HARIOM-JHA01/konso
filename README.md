### **Konso**

> A minimalist productivity app combining a Calendar and To-Do list with Vim-style modes and full keyboard navigation. Built with Next.js App Router, MongoDB, Zustand, TailwindCSS, and pnpm. Designed for users who value focus, control, and clean UI.

---

### 🛠️ **Tech Stack**

-   **Next.js App Router** – Frontend + API
-   **TailwindCSS** – Styling
-   **Zustand** – State Management
-   **MongoDB + Mongoose** – Database
-   **pnpm** – Package Management
-   **Hotkeys / Vim-style Modes** – Custom Logic
-   **Keyboard-Only Navigation** – Accessibility & UX

---

## 🪜 Development Phases

### 🔹 Phase 1: Base Setup & UI Layout

-   [x] Initialize Next.js App with App Router (✅ done)
-   [x] TailwindCSS, Zustand, Mongoose, MongoDB setup
-   [ ] Build layout:
    -   Tabbed interface: Calendar | To-Do | Both
    -   Zen mode toggle
    -   Placeholder UIs for calendar and todo list
-   [ ] Add keyboard shortcuts: Tab navigation (1/2/3), toggle zen mode (Z)

---

### 🔹 Phase 2: To-Do List System

-   [ ] Create To-Do model (Mongoose)
-   [ ] Create API routes: `GET`, `POST`, `PUT`, `DELETE` (CRUD)
-   [ ] Build interactive To-Do component with add/edit/remove
-   [ ] Sync to MongoDB, Zustand for client-side state
-   [ ] Add keyboard shortcuts for creating/editing tasks

---

### 🔹 Phase 3: Calendar System

-   [ ] Create CalendarEvent model (Mongoose)
-   [ ] API routes: `GET`, `POST`, `DELETE` for events
-   [ ] Minimal calendar UI (monthly/weekly view)
-   [ ] Drag/drop or modal to create events (basic)
-   [ ] Keyboard nav for changing date/view (← ↑ ↓ → / W A S D)

---

### 🔹 Phase 4: Modal Editor Modes (Vim-style)

-   [ ] Define three modes:
    -   **Normal** – Navigation
    -   **Insert** – Typing / Editing
    -   **Command** – Shortcuts / Commands
-   [ ] Display current mode on screen
-   [ ] Toggle modes using `i`, `esc`, `:` keys
-   [ ] Prevent mouse usage (optional zen)

---

### 🔹 Phase 5: Keyboard Navigation & Zen Mode

-   [ ] Use `cmdk` / `hotkeys.js` / `react-hotkeys-hook` for keybinding
-   [ ] Tab switching via shortcuts
-   [ ] Zen mode: hides all UI except the main panel (toggle with `Z`)
-   [ ] Smooth transitions with Tailwind animations

---

### 🔹 Phase 6: Final Polish

-   [ ] Mobile responsive layout (if needed)
-   [ ] Dark mode toggle
-   [ ] Polish design: fonts, shadows, spacing, colors
-   [ ] Error handling + loading states
-   [ ] Deploy on **Vercel** with MongoDB Atlas

---

## 🧩 Optional Future Features

-   Notifications/reminders for tasks
-   Import/export iCal events
-   Markdown support in notes
-   Sync across devices
-   User accounts & auth (e.g. Clerk/Auth.js)

---
