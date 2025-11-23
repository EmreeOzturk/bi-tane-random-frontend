import { create } from 'zustand'
import type { Address } from 'viem'

interface AppState {
  // Wallet state
  isConnected: boolean
  address: Address | null
  chainId: number | null

  // Contract selection
  selectedContract: 'falcons' | 'whales' | null

  // UI state
  isLoading: boolean
  error: string | null

  // Actions
  setWalletConnection: (isConnected: boolean, address: Address | null, chainId: number | null) => void
  setSelectedContract: (contract: 'falcons' | 'whales' | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  clearError: () => void
}

export const useAppStore = create<AppState>((set) => ({
  // Initial state
  isConnected: false,
  address: null,
  chainId: null,
  selectedContract: null,
  isLoading: false,
  error: null,

  // Actions
  setWalletConnection: (isConnected, address, chainId) =>
    set({ isConnected, address, chainId }),

  setSelectedContract: (selectedContract) =>
    set({ selectedContract }),

  setLoading: (isLoading) =>
    set({ isLoading }),

  setError: (error) =>
    set({ error, isLoading: false }),

  clearError: () =>
    set({ error: null }),
}))
