import { create } from 'zustand'

/**
 * Client-side UI state (Zustand). Use for nav, theme, or modal state.
 */
export const useUIStore = create((set) => ({
  mobileMenuOpen: false,
  setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),
  toggleMobileMenu: () => set((s) => ({ mobileMenuOpen: !s.mobileMenuOpen })),
}))
