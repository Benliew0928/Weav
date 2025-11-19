import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Thread, User, Comment } from '@/data/sampleThreads'
import { sampleThreads, currentUser } from '@/data/sampleThreads'

interface WeavState {
  // User
  currentUser: User
  isAuthenticated: boolean

  // Threads
  threads: Thread[]
  selectedThreadId: string | null

  // Ring state
  ringRotation: number // Y-axis rotation in radians
  verticalRotation: number // X-axis rotation clamped to ±90° (full sphere)
  angularVelocity: number // For inertia
  cameraZ: number
  defaultCameraZ: number

  // UI State
  isCreateThreadOpen: boolean
  isThreadDetailOpen: boolean
  isWeavRingVisible: boolean
  use2DFallback: boolean
  showDebugOverlay: boolean
  theme: 'dark' | 'light'
  viewMode: 'sphere' | 'list'
  isTransitioning: boolean
  
  // Focus lock state for card-to-details transition
  isFocusLocked: boolean
  selectedNodePosition: { x: number; y: number; z: number } | null
  transitionPhase: 'idle' | 'focusing' | 'detaching' | 'expanding' | 'expanded' | 'collapsing'

  // Actions
  setAuthenticated: (auth: boolean) => void
  rotateRing: (delta: number) => void
  setVerticalRotation: (rotation: number) => void
  setAngularVelocity: (velocity: number) => void
  setZoom: (z: number) => void
  setDefaultCameraZ: (z: number) => void
  selectNode: (threadId: string | null) => void
  setCreateThreadOpen: (open: boolean) => void
  setThreadDetailOpen: (open: boolean) => void
  setWeavRingVisible: (visible: boolean) => void
  setUse2DFallback: (use: boolean) => void
  setShowDebugOverlay: (show: boolean) => void
  setTheme: (theme: 'dark' | 'light') => void
  toggleTheme: () => void
  setViewMode: (mode: 'sphere' | 'list') => void
  setIsTransitioning: (transitioning: boolean) => void
  setFocusLocked: (locked: boolean) => void
  setSelectedNodePosition: (position: { x: number; y: number; z: number } | null) => void
  setTransitionPhase: (phase: 'idle' | 'focusing' | 'detaching' | 'expanding' | 'expanded' | 'collapsing') => void
  addThread: (thread: Thread) => void
  addComment: (threadId: string, comment: Comment) => void
  updateCurrentUser: (updates: Partial<User>) => void
}

export const useWeavStore = create<WeavState>()(
  persist(
    (set) => ({
  // Initial state
  currentUser,
  isAuthenticated: false,
  threads: sampleThreads,
  selectedThreadId: null,
  ringRotation: 0,
  verticalRotation: 0,
  angularVelocity: 0,
  cameraZ: 10,
  defaultCameraZ: 10,
  isCreateThreadOpen: false,
  isThreadDetailOpen: false,
  isWeavRingVisible: true,
  use2DFallback: false,
  showDebugOverlay: false,
  theme: 'dark',
  viewMode: 'sphere',
  isTransitioning: false,
  isFocusLocked: false,
  selectedNodePosition: null,
  transitionPhase: 'idle',

  // Actions
  setAuthenticated: (auth) => set({ isAuthenticated: auth }),
  rotateRing: (delta) =>
    set((state) => ({ ringRotation: state.ringRotation + delta })),
  setVerticalRotation: (rotation) =>
    set({ verticalRotation: Math.max(-Math.PI / 2, Math.min(Math.PI / 2, rotation)) }),
  setAngularVelocity: (velocity) => set({ angularVelocity: velocity }),
  setZoom: (z) => set({ cameraZ: z }),
  setDefaultCameraZ: (z) => set({ defaultCameraZ: z, cameraZ: z }),
  selectNode: (threadId) => {
    if (threadId) {
      const currentState = useWeavStore.getState()
      
      // Always ensure we start from a clean state
      // If there's any existing selection or transition in progress, reset first
      if (currentState.selectedThreadId || currentState.transitionPhase !== 'idle' || currentState.isFocusLocked) {
        // Reset everything first (but keep transitionPhase as 'collapsing' briefly to prevent thread clearing)
        set({
          selectedThreadId: null,
          isThreadDetailOpen: false,
          transitionPhase: 'collapsing', // Use collapsing instead of idle to prevent thread clearing
          isFocusLocked: false,
          selectedNodePosition: null,
        })
        
        // Wait for reset to complete before starting new transition
        setTimeout(() => {
          // Set to idle first, then immediately to focusing
          set({ 
            transitionPhase: 'idle',
          })
          // Use requestAnimationFrame to ensure state update happens in next frame
          requestAnimationFrame(() => {
            set({ 
              selectedThreadId: threadId, 
              isThreadDetailOpen: false,
              transitionPhase: 'focusing',
              isFocusLocked: true,
            })
          })
        }, 100)
      } else {
        // Clean state, start immediately
        set({ 
          selectedThreadId: threadId, 
          isThreadDetailOpen: false,
          transitionPhase: 'focusing',
          isFocusLocked: true,
        })
      }
    } else {
      // Full reset when deselecting
      set({ 
        selectedThreadId: null, 
        isThreadDetailOpen: false,
        transitionPhase: 'idle',
        isFocusLocked: false,
        selectedNodePosition: null,
      })
    }
  },
  setCreateThreadOpen: (open) => set({ isCreateThreadOpen: open }),
  setThreadDetailOpen: (open) => set({ isThreadDetailOpen: open }),
  setWeavRingVisible: (visible) => set({ isWeavRingVisible: visible }),
  setUse2DFallback: (use) => set({ use2DFallback: use }),
  setShowDebugOverlay: (show) => set({ showDebugOverlay: show }),
  setTheme: (theme) => {
    set({ theme })
    // Update HTML class for Tailwind dark mode
    if (typeof window !== 'undefined') {
      document.documentElement.classList.toggle('dark', theme === 'dark')
      document.documentElement.classList.toggle('light', theme === 'light')
    }
  },
  toggleTheme: () => {
    set((state) => {
      const newTheme = state.theme === 'dark' ? 'light' : 'dark'
      // Update HTML class for Tailwind dark mode
      if (typeof window !== 'undefined') {
        document.documentElement.classList.toggle('dark', newTheme === 'dark')
        document.documentElement.classList.toggle('light', newTheme === 'light')
      }
      return { theme: newTheme }
    })
  },
  setViewMode: (mode) => {
    const currentMode = useWeavStore.getState().viewMode
    if (currentMode !== mode) {
      set({ isTransitioning: true, viewMode: mode })
    } else {
      set({ viewMode: mode })
    }
  },
  setIsTransitioning: (transitioning) => set({ isTransitioning: transitioning }),
  setFocusLocked: (locked) => set({ isFocusLocked: locked }),
  setSelectedNodePosition: (position) => set({ selectedNodePosition: position }),
  setTransitionPhase: (phase) => set({ transitionPhase: phase }),
  addThread: (thread) =>
    set((state) => ({
      threads: [thread, ...state.threads],
    })),
  addComment: (threadId, comment) =>
    set((state) => ({
      threads: state.threads.map((thread) =>
        thread.id === threadId
          ? { ...thread, comments: [...thread.comments, comment] }
          : thread
      ),
    })),
  updateCurrentUser: (updates) =>
    set((state) => {
      const updatedUser: User = {
        ...state.currentUser,
        ...updates,
      }

      return {
        currentUser: updatedUser,
        threads: state.threads.map((thread) =>
          thread.author.id === state.currentUser.id
            ? { ...thread, author: updatedUser }
            : thread
        ),
      }
    }),
    }),
    {
      name: 'weav-storage',
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        theme: state.theme,
      }),
      skipHydration: false,
    }
  )
)

