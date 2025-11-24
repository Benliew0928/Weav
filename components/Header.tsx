'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Avatar } from './Avatar'
import { ThemeToggle } from './ThemeToggle'
import { ViewToggle } from './ViewToggle'
import { useWeavStore } from '@/store/useWeavStore'
import { signOut } from '@/lib/firebase/auth'

export function Header() {
  const pathname = usePathname()
  const { currentUser, isAuthenticated, theme, logout } = useWeavStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleLogout = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Error signing out:', error)
    } finally {
      logout()
    }
  }

  if (pathname === '/login') return null

  return (
    <header 
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b transition-colors duration-300"
      style={{
        backgroundColor: theme === 'dark' ? 'rgba(0, 0, 0, 0.4)' : 'rgba(255, 255, 255, 0.95)',
        borderColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold gradient-primary bg-clip-text text-transparent">
              Weav
            </span>
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            <Link
              href="/"
              className={`text-sm font-medium transition-colors ${
                pathname === '/'
                  ? theme === 'dark' ? 'text-white' : 'text-gray-900'
                  : theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Feed
            </Link>
            <Link
              href="/notifications"
              className={`text-sm font-medium transition-colors ${
                pathname === '/notifications'
                  ? theme === 'dark' ? 'text-white' : 'text-gray-900'
                  : theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Notifications
            </Link>
            {/* Profile Avatar in nav - visible on desktop */}
            {mounted && isAuthenticated && (
              <Link 
                href="/profile"
                className="transition-transform hover:scale-110 flex items-center relative z-10"
                title="Profile"
              >
                <Avatar
                  src={currentUser?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=user'}
                  alt={currentUser?.username || 'User'}
                  size="sm"
                  className="ring-2 ring-primary-mid/30 hover:ring-primary-mid/60 transition-all cursor-pointer"
                />
              </Link>
            )}
          </nav>

          <div className="flex items-center space-x-4">
            {/* View Toggle - only show on home page */}
            {pathname === '/' && <ViewToggle />}
            {/* Profile Avatar - visible on mobile when authenticated */}
            {mounted && isAuthenticated && (
              <Link 
                href="/profile"
                className="md:hidden transition-transform hover:scale-110 flex items-center mr-2 relative z-10"
                aria-label="Profile"
                title="Profile"
              >
                <Avatar
                  src={currentUser?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=user'}
                  alt={currentUser?.username || 'User'}
                  size="sm"
                  className="ring-2 ring-primary-mid/30 hover:ring-primary-mid/60 transition-all cursor-pointer"
                />
              </Link>
            )}
            <ThemeToggle />
            {!isAuthenticated ? (
              <Link
                href="/login"
                className="px-4 py-2 rounded-button gradient-primary text-white text-sm font-medium hover:opacity-90 transition-opacity"
              >
                Sign In
              </Link>
            ) : (
              <button
                onClick={handleLogout}
                className={`px-3 py-1.5 rounded-button text-xs font-medium border transition-colors ${
                  theme === 'dark'
                    ? 'border-white/15 text-gray-300 hover:bg-white/10'
                    : 'border-gray-200 text-gray-700 hover:bg-gray-100'
                }`}
              >
                Log out
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

