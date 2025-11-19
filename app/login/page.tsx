'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { GradientBackground } from '@/components/GradientBackground'
import { useWeavStore } from '@/store/useWeavStore'

export default function LoginPage() {
  const router = useRouter()
  const { setAuthenticated, theme } = useWeavStore()
  const [email, setEmail] = useState('')

  const handleGoogleLogin = () => {
    // Simulate login
    setAuthenticated(true)
    router.push('/')
  }

  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (email.trim()) {
      setAuthenticated(true)
      router.push('/')
    }
  }

  return (
    <div className="relative h-full flex items-center justify-center p-4 overflow-y-auto">
      <GradientBackground />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          type: 'spring',
          stiffness: 240,
          damping: 28,
        }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="text-center mb-12">
          <motion.h1
            className="text-6xl font-bold mb-4"
            animate={{
              rotate: [0, 5, -5, 0],
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <span className="gradient-primary bg-clip-text text-transparent">
              Weav
            </span>
          </motion.h1>
          <p className={`text-xl ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Where ideas intertwine.
          </p>
        </div>

        <div className={`glass rounded-card p-8 border space-y-4 transition-colors ${
          theme === 'dark' ? 'border-white/10' : 'border-gray-200/50'
        }`}>
          <motion.button
            onClick={handleGoogleLogin}
            className="w-full px-6 py-3 rounded-button bg-white text-black font-medium hover:opacity-90 transition-opacity flex items-center justify-center space-x-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span>Continue with Google</span>
          </motion.button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className={`w-full border-t transition-colors ${
                theme === 'dark' ? 'border-white/10' : 'border-gray-200/50'
              }`}></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className={`px-2 bg-transparent ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                or
              </span>
            </div>
          </div>

          <form onSubmit={handleEmailLogin} className="space-y-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className={`w-full px-4 py-3 rounded-button border focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors ${
                theme === 'dark'
                  ? 'bg-white/5 border-white/10 text-white placeholder-gray-500'
                  : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'
              }`}
              required
            />
            <motion.button
              type="submit"
              className="w-full px-6 py-3 rounded-button gradient-primary text-white font-medium shadow-lg hover:opacity-90 transition-opacity"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Continue with Email
            </motion.button>
          </form>
        </div>

        <div className={`mt-8 text-center text-sm ${
          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
        }`}>
          <a 
            href="/terms" 
            className={`transition-colors mr-4 ${
              theme === 'dark' ? 'hover:text-white' : 'hover:text-gray-900'
            }`}
          >
            Terms
          </a>
          <a 
            href="/privacy" 
            className={`transition-colors ${
              theme === 'dark' ? 'hover:text-white' : 'hover:text-gray-900'
            }`}
          >
            Privacy
          </a>
        </div>
      </motion.div>
    </div>
  )
}

