'use client'

import { useWeavStore } from '@/store/useWeavStore'

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const { theme } = useWeavStore()
  
  return (
    <div 
      className="h-screen w-screen flex flex-col overflow-hidden transition-colors duration-300"
      style={{
        backgroundColor: theme === 'light' ? '#ffffff' : '#0a0a0f',
        height: '100vh',
        width: '100vw',
        margin: 0,
        padding: 0,
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
      }}
    >
      {children}
    </div>
  )
}

