'use client'

import { motion } from 'framer-motion'
import { Bell, Heart, MessageCircle, UserPlus } from 'lucide-react'
import Link from 'next/link'
import { useWeavStore } from '@/store/useWeavStore'

interface Notification {
  id: string
  type: 'like' | 'comment' | 'follow'
  message: string
  timestamp: Date
  threadId?: string
  read: boolean
}

const sampleNotifications: Notification[] = [
  {
    id: '1',
    type: 'like',
    message: 'alex_weaver liked your thread',
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    threadId: '1',
    read: false,
  },
  {
    id: '2',
    type: 'comment',
    message: 'sam_thoughts commented on your thread',
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    threadId: '1',
    read: false,
  },
  {
    id: '3',
    type: 'follow',
    message: 'maya_ideas started following you',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    read: true,
  },
  {
    id: '4',
    type: 'like',
    message: 'jordan_flow liked your thread',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
    threadId: '2',
    read: true,
  },
]

const iconMap = {
  like: Heart,
  comment: MessageCircle,
  follow: UserPlus,
}

export default function NotificationsPage() {
  const { theme } = useWeavStore()
  
  return (
    <div className={`h-full overflow-y-auto transition-colors duration-300 ${
      theme === 'light' ? 'bg-white' : ''
    }`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            type: 'spring',
            stiffness: 240,
            damping: 28,
          }}
        >
          <div className="flex items-center space-x-3 mb-8">
            <Bell className={`w-6 h-6 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`} />
            <h1 className={`text-3xl font-semibold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Notifications
            </h1>
          </div>

          <div className="space-y-2">
            {sampleNotifications.length === 0 ? (
              <p className={`text-center py-12 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                No notifications yet.
              </p>
            ) : (
              sampleNotifications.map((notification, index) => {
                const Icon = iconMap[notification.type]
                return (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: index * 0.05,
                      type: 'spring',
                      stiffness: 240,
                      damping: 28,
                    }}
                  >
                    <Link
                      href={notification.threadId ? `/thread/${notification.threadId}` : '#'}
                      className="block"
                    >
                      <div
                        className={`glass rounded-card p-4 border transition-colors ${
                          theme === 'dark' 
                            ? 'border-white/10 hover:border-white/20' 
                            : 'border-gray-200/50 hover:border-gray-300/70'
                        } ${
                          !notification.read 
                            ? theme === 'dark' 
                              ? 'bg-purple-500/10' 
                              : 'bg-purple-500/5'
                            : ''
                        }`}
                      >
                        <div className="flex items-start space-x-4">
                          <div className="p-2 rounded-lg gradient-primary">
                            <Icon className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm mb-1 ${
                              theme === 'dark' ? 'text-white' : 'text-gray-900'
                            }`}>
                              {notification.message}
                            </p>
                            <p className={`text-xs ${
                              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                            }`}>
                              {new Date(notification.timestamp).toLocaleString()}
                            </p>
                          </div>
                          {!notification.read && (
                            <div className="w-2 h-2 rounded-full bg-purple-500 mt-2" />
                          )}
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                )
              })
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

