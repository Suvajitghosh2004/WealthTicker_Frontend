import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useUIStore = create(
  persist(
    (set) => ({
      isDark: false,
      sidebarOpen: false,

      toggleDark: () => set((s) => ({ isDark: !s.isDark })),
      toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
      setSidebar: (open) => set({ sidebarOpen: open })
    }),
    { name: 'wt-ui' }
  )
)

export default useUIStore
