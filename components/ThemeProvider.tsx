'use client'

import { useEffect } from 'react'
import { useWeavStore } from '@/store/useWeavStore'

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme, setTheme } = useWeavStore()

  useEffect(() => {
    // Initialize theme on mount - sync with HTML and body class
    const currentTheme = theme || 'dark'
    const html = document.documentElement
    const body = document.body
    html.classList.remove('dark', 'light')
    body.classList.remove('dark', 'light')
    html.classList.add(currentTheme)
    body.classList.add(currentTheme)
  }, [])

  // Watch for theme changes and update HTML and body class
  useEffect(() => {
    const html = document.documentElement
    const body = document.body
    html.classList.remove('dark', 'light')
    body.classList.remove('dark', 'light')
    html.classList.add(theme)
    body.classList.add(theme)
  }, [theme])

  return <>{children}</>
}

