'use client'

import Link from 'next/link'
import { useWeavStore } from '@/store/useWeavStore'

export function Footer() {
  const { theme } = useWeavStore()
  
  return (
    <footer 
      className="border-t backdrop-blur-xl transition-colors duration-300 flex-shrink-0"
      style={{
        backgroundColor: theme === 'dark' ? 'rgba(10, 10, 15, 0.95)' : 'rgba(255, 255, 255, 1)',
        borderColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        margin: 0,
        padding: '1rem 0',
        width: '100%',
        position: 'relative',
        zIndex: 10
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          <div className={`text-sm transition-colors ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            © 2025 Weav. Where ideas intertwine.
          </div>
          <div className={`flex items-center space-x-6 text-sm transition-colors ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            <Link 
              href="/about" 
              className={`transition-colors ${
                theme === 'dark' ? 'hover:text-white' : 'hover:text-gray-900'
              }`}
            >
              About
            </Link>
            <Link 
              href="/privacy" 
              className={`transition-colors ${
                theme === 'dark' ? 'hover:text-white' : 'hover:text-gray-900'
              }`}
            >
              Privacy
            </Link>
            <Link 
              href="/terms" 
              className={`transition-colors ${
                theme === 'dark' ? 'hover:text-white' : 'hover:text-gray-900'
              }`}
            >
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

