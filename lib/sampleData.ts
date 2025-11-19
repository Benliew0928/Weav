export interface User {
  id: string
  username: string
  avatar: string
  bio?: string
}

export interface Comment {
  id: string
  author: User
  content: string
  timestamp: Date
  reactions: Reaction[]
  replies?: Comment[]
}

export interface Reaction {
  emoji: string
  count: number
  users: string[]
}

export interface Thread {
  id: string
  title: string
  description: string
  author: User
  icon: string
  tags: string[]
  comments: Comment[]
  createdAt: Date
  reactions: Reaction[]
}

export const sampleUsers: User[] = [
  {
    id: '1',
    username: 'alex_weaver',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex',
    bio: 'Thread explorer and idea weaver',
  },
  {
    id: '2',
    username: 'sam_thoughts',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sam',
    bio: 'Sharing thoughts one thread at a time',
  },
  {
    id: '3',
    username: 'maya_ideas',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=maya',
    bio: 'Ideas that connect',
  },
  {
    id: '4',
    username: 'jordan_flow',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jordan',
  },
  {
    id: '5',
    username: 'taylor_weav',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=taylor',
  },
]

export const sampleThreads: Thread[] = [
  {
    id: '1',
    title: 'The Future of Conversational AI',
    description: 'Exploring how AI will transform how we communicate and share ideas.',
    author: sampleUsers[0],
    icon: '💬',
    tags: ['AI', 'Technology', 'Future'],
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    reactions: [
      { emoji: '❤️', count: 12, users: ['2', '3', '4'] },
      { emoji: '🔥', count: 8, users: ['1', '5'] },
      { emoji: '💡', count: 5, users: ['2', '3'] },
    ],
    comments: [
      {
        id: 'c1',
        author: sampleUsers[1],
        content: 'This is fascinating! I think we\'re just scratching the surface.',
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
        reactions: [
          { emoji: '👍', count: 3, users: ['1', '3'] },
        ],
      },
      {
        id: 'c2',
        author: sampleUsers[2],
        content: 'The implications for education are huge. Imagine personalized learning at scale.',
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        reactions: [
          { emoji: '💡', count: 2, users: ['1'] },
        ],
      },
    ],
  },
  {
    id: '2',
    title: 'Design Systems in 2024',
    description: 'What makes a design system truly scalable and maintainable?',
    author: sampleUsers[1],
    icon: '🎨',
    tags: ['Design', 'UI/UX', 'Systems'],
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
    reactions: [
      { emoji: '❤️', count: 15, users: ['1', '3', '4', '5'] },
      { emoji: '💡', count: 7, users: ['2', '3'] },
    ],
    comments: [
      {
        id: 'c3',
        author: sampleUsers[0],
        content: 'Token-based systems are the way forward. Great post!',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
        reactions: [],
      },
    ],
  },
  {
    id: '3',
    title: 'Building 3D Web Experiences',
    description: 'React Three Fiber makes it accessible, but what are the best practices?',
    author: sampleUsers[2],
    icon: '🌐',
    tags: ['3D', 'WebGL', 'React'],
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
    reactions: [
      { emoji: '🔥', count: 20, users: ['1', '2', '4', '5'] },
      { emoji: '💡', count: 10, users: ['1', '3'] },
    ],
    comments: [
      {
        id: 'c4',
        author: sampleUsers[0],
        content: 'Performance optimization is key. Always test on mid-range devices.',
        timestamp: new Date(Date.now() - 7 * 60 * 60 * 1000),
        reactions: [
          { emoji: '👍', count: 5, users: ['2', '3', '4'] },
        ],
      },
      {
        id: 'c5',
        author: sampleUsers[4],
        content: 'Drei helpers are a game changer for common patterns.',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
        reactions: [],
      },
    ],
  },
  {
    id: '4',
    title: 'The Art of Thread Weaving',
    description: 'How do we create meaningful connections between ideas?',
    author: sampleUsers[3],
    icon: '🧵',
    tags: ['Philosophy', 'Ideas', 'Connection'],
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
    reactions: [
      { emoji: '❤️', count: 18, users: ['1', '2', '3', '5'] },
    ],
    comments: [],
  },
  {
    id: '5',
    title: 'Dark Mode Done Right',
    description: 'Accessibility and aesthetics in dark theme design.',
    author: sampleUsers[4],
    icon: '🌙',
    tags: ['Design', 'Accessibility', 'Dark Mode'],
    createdAt: new Date(Date.now() - 15 * 60 * 60 * 1000),
    reactions: [
      { emoji: '❤️', count: 9, users: ['1', '2'] },
      { emoji: '💡', count: 4, users: ['3'] },
    ],
    comments: [
      {
        id: 'c6',
        author: sampleUsers[1],
        content: 'Contrast ratios are crucial. Great reminder!',
        timestamp: new Date(Date.now() - 14 * 60 * 60 * 1000),
        reactions: [],
      },
    ],
  },
  {
    id: '6',
    title: 'Micro-interactions Matter',
    description: 'Small details that make interfaces feel alive.',
    author: sampleUsers[0],
    icon: '✨',
    tags: ['UX', 'Animation', 'Details'],
    createdAt: new Date(Date.now() - 20 * 60 * 60 * 1000),
    reactions: [
      { emoji: '🔥', count: 14, users: ['2', '3', '4'] },
      { emoji: '💡', count: 6, users: ['1', '5'] },
    ],
    comments: [],
  },
]

export const currentUser: User = {
  id: 'current',
  username: 'you',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=current',
  bio: 'Exploring the WeavSphere',
}

