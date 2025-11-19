import { create } from 'zustand'
import { Thread, User, Comment } from './sampleData'
import { sampleThreads, currentUser } from './sampleData'

interface AppState {
  // User
  currentUser: User
  isAuthenticated: boolean
  
  // Threads
  threads: Thread[]
  selectedThreadId: string | null
  
  // UI State
  isCreateThreadOpen: boolean
  isWeavSphereVisible: boolean
  
  // Actions
  setSelectedThread: (threadId: string | null) => void
  setCreateThreadOpen: (open: boolean) => void
  setWeavSphereVisible: (visible: boolean) => void
  addThread: (thread: Thread) => void
  addComment: (threadId: string, comment: Comment) => void
  setAuthenticated: (auth: boolean) => void
}

export const useAppStore = create<AppState>((set) => ({
  // Initial state
  currentUser,
  isAuthenticated: false,
  threads: sampleThreads,
  selectedThreadId: null,
  isCreateThreadOpen: false,
  isWeavSphereVisible: true,
  
  // Actions
  setSelectedThread: (threadId) => set({ selectedThreadId: threadId }),
  setCreateThreadOpen: (open) => set({ isCreateThreadOpen: open }),
  setWeavSphereVisible: (visible) => set({ isWeavSphereVisible: visible }),
  addThread: (thread) => set((state) => ({ 
    threads: [thread, ...state.threads] 
  })),
  addComment: (threadId, comment) => set((state) => ({
    threads: state.threads.map((thread) =>
      thread.id === threadId
        ? { ...thread, comments: [...thread.comments, comment] }
        : thread
    ),
  })),
  setAuthenticated: (auth) => set({ isAuthenticated: auth }),
}))

