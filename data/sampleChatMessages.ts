import { User } from './sampleThreads'

export interface ChatMessage {
  id: string
  author: User
  content: string
  timestamp: Date
  reactions?: { emoji: string; count: number }[]
  isEdited?: boolean
}

export interface ChatRoom {
  threadId: string
  messages: ChatMessage[]
  activeMembers: number
  typingUsers: User[]
}

// Sample chat messages for different threads
export const sampleChatMessages: Record<string, ChatMessage[]> = {
  '1': [
    {
      id: 'msg-1',
      author: {
        id: 'user-1',
        username: 'alex_weaver',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex',
      },
      content: 'Hey everyone! Just discovered this amazing new framework. Has anyone tried it?',
      timestamp: new Date(Date.now() - 3600000), // 1 hour ago
    },
    {
      id: 'msg-2',
      author: {
        id: 'user-2',
        username: 'sarah_codes',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
      },
      content: 'Yes! I\'ve been using it for a month now. It\'s incredible! 🚀',
      timestamp: new Date(Date.now() - 3500000),
    },
    {
      id: 'msg-3',
      author: {
        id: 'user-3',
        username: 'mike_dev',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mike',
      },
      content: 'The performance improvements are insane. My app went from 2s load time to 200ms!',
      timestamp: new Date(Date.now() - 3400000),
    },
    {
      id: 'msg-4',
      author: {
        id: 'user-1',
        username: 'alex_weaver',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex',
      },
      content: 'That\'s amazing! Can you share your setup?',
      timestamp: new Date(Date.now() - 3300000),
    },
    {
      id: 'msg-5',
      author: {
        id: 'user-4',
        username: 'jess_tech',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jess',
      },
      content: 'I\'d love to see that too! Maybe we can do a code review session?',
      timestamp: new Date(Date.now() - 3200000),
    },
  ],
  '2': [
    {
      id: 'msg-6',
      author: {
        id: 'user-5',
        username: 'design_master',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=design',
      },
      content: 'What do you think about the new design trends?',
      timestamp: new Date(Date.now() - 7200000), // 2 hours ago
    },
    {
      id: 'msg-7',
      author: {
        id: 'user-6',
        username: 'ui_wizard',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=wizard',
      },
      content: 'I\'m loving the glassmorphism trend! It adds so much depth.',
      timestamp: new Date(Date.now() - 7100000),
    },
  ],
  '3': [
    {
      id: 'msg-8',
      author: {
        id: 'user-7',
        username: 'code_ninja',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ninja',
      },
      content: 'Anyone up for a coding challenge?',
      timestamp: new Date(Date.now() - 10800000), // 3 hours ago
    },
  ],
}

// Get chat messages for a thread
export function getChatMessages(threadId: string): ChatMessage[] {
  return sampleChatMessages[threadId] || []
}

// Get active members count (random for demo)
export function getActiveMembers(threadId: string): number {
  const messages = getChatMessages(threadId)
  const uniqueUsers = new Set(messages.map(m => m.author.id))
  return Math.max(uniqueUsers.size, Math.floor(Math.random() * 20) + 5)
}

// Get typing users (random for demo)
export function getTypingUsers(threadId: string): User[] {
  const messages = getChatMessages(threadId)
  const users = Array.from(new Set(messages.map(m => m.author)))
  return users.slice(0, Math.floor(Math.random() * 3))
}

