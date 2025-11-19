export interface User {
  id: string
  username: string
  avatar: string
  bio?: string
  displayName?: string
  location?: string
  website?: string
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
  image?: string // Optional image URL or base64
  tags: string[]
  comments: Comment[]
  createdAt: Date
  reactions: Reaction[]
  unread?: boolean
}

export const sampleUsers: User[] = [
  {
    id: '1',
    username: 'alex_weaver',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex',
    bio: 'Thread explorer and idea weaver',
    displayName: 'Alex Weaver',
    location: 'San Francisco, CA',
    website: 'https://alex.design',
  },
  {
    id: '2',
    username: 'sam_thoughts',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sam',
    bio: 'Sharing thoughts one thread at a time',
    displayName: 'Samantha Lee',
    location: 'Toronto, Canada',
  },
  {
    id: '3',
    username: 'maya_ideas',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=maya',
    bio: 'Ideas that connect',
    displayName: 'Maya Flores',
    website: 'https://maya.studio',
  },
  {
    id: '4',
    username: 'jordan_flow',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jordan',
    displayName: 'Jordan Flow',
  },
  {
    id: '5',
    username: 'taylor_weav',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=taylor',
    displayName: 'Taylor Weav',
  },
  {
    id: '6',
    username: 'riley_mind',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=riley',
    displayName: 'Riley Mind',
  },
]

export const currentUser: User = {
  id: 'current',
  username: 'you',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=current',
  displayName: 'You',
  bio: 'Exploring the Weav Garden',
  location: 'Mind Garden',
  website: 'https://weav.space',
}

export const sampleThreads: Thread[] = [
  {
    id: '1',
    title: 'The Future of Conversational AI',
    description: 'Exploring how AI will transform how we communicate and share ideas.',
    author: sampleUsers[0],
    icon: '💬',
    tags: ['AI', 'Technology', 'Future'],
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    unread: true,
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
        reactions: [{ emoji: '👍', count: 3, users: ['1', '3'] }],
      },
      {
        id: 'c2',
        author: sampleUsers[2],
        content: 'The implications for education are huge. Imagine personalized learning at scale.',
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        reactions: [{ emoji: '💡', count: 2, users: ['1'] }],
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
    unread: true,
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
        reactions: [{ emoji: '👍', count: 5, users: ['2', '3', '4'] }],
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
    reactions: [{ emoji: '❤️', count: 18, users: ['1', '2', '3', '5'] }],
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
  {
    id: '7',
    title: 'Mindful Coding Practices',
    description: 'How to write code that serves both machines and humans.',
    author: sampleUsers[5],
    icon: '🧘',
    tags: ['Code', 'Mindfulness', 'Best Practices'],
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    unread: true,
    reactions: [{ emoji: '❤️', count: 11, users: ['1', '2', '3'] }],
    comments: [],
  },
  {
    id: '8',
    title: 'The Power of Visual Thinking',
    description: 'Why spatial interfaces help us understand complex relationships.',
    author: sampleUsers[2],
    icon: '🎯',
    tags: ['Visualization', 'UX', 'Cognition'],
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    reactions: [
      { emoji: '💡', count: 9, users: ['1', '3', '4'] },
      { emoji: '🔥', count: 5, users: ['2'] },
    ],
    comments: [],
  },
  {
    id: '9',
    title: 'Gradient Design Trends',
    description: 'Exploring modern gradient usage in UI design.',
    author: sampleUsers[1],
    icon: '🌈',
    tags: ['Design', 'Trends', 'Gradients'],
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    reactions: [{ emoji: '❤️', count: 7, users: ['3', '4'] }],
    comments: [],
  },
  {
    id: '10',
    title: 'Accessibility First',
    description: 'Building inclusive experiences from the ground up.',
    author: sampleUsers[3],
    icon: '♿',
    tags: ['Accessibility', 'Inclusion', 'Design'],
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    reactions: [
      { emoji: '❤️', count: 16, users: ['1', '2', '3', '4', '5'] },
    ],
    comments: [],
  },
  {
    id: '11',
    title: 'Performance at Scale',
    description: 'Optimizing web apps for millions of users.',
    author: sampleUsers[0],
    icon: '⚡',
    tags: ['Performance', 'Optimization', 'Scale'],
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    reactions: [
      { emoji: '🔥', count: 12, users: ['2', '3', '4'] },
      { emoji: '💡', count: 8, users: ['1', '5'] },
    ],
    comments: [],
  },
  {
    id: '12',
    title: 'The Garden of Ideas',
    description: 'How spatial metaphors help us organize thoughts.',
    author: sampleUsers[4],
    icon: '🌱',
    tags: ['Philosophy', 'Metaphor', 'Organization'],
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
    unread: true,
    reactions: [{ emoji: '❤️', count: 10, users: ['1', '2', '3'] }],
    comments: [],
  },
  {
    id: '13',
    title: 'Real-time Collaboration Tools',
    description: 'Best practices for building collaborative web applications.',
    author: sampleUsers[0],
    icon: '🤝',
    tags: ['Collaboration', 'Tools', 'Web'],
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    reactions: [
      { emoji: '🔥', count: 13, users: ['2', '3', '4', '5'] },
      { emoji: '💡', count: 6, users: ['1'] },
    ],
    comments: [],
  },
  {
    id: '14',
    title: 'Motion Design Principles',
    description: 'Creating fluid and meaningful animations in interfaces.',
    author: sampleUsers[1],
    icon: '🎬',
    tags: ['Animation', 'Motion', 'Design'],
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
    reactions: [{ emoji: '❤️', count: 11, users: ['1', '3', '4'] }],
    comments: [],
  },
  {
    id: '15',
    title: 'TypeScript Best Practices',
    description: 'Writing maintainable and type-safe code with TypeScript.',
    author: sampleUsers[2],
    icon: '📘',
    tags: ['TypeScript', 'Code', 'Best Practices'],
    createdAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000),
    reactions: [
      { emoji: '💡', count: 15, users: ['1', '2', '3', '4', '5'] },
      { emoji: '🔥', count: 9, users: ['1', '2'] },
    ],
    comments: [],
  },
  {
    id: '16',
    title: 'Color Psychology in UI',
    description: 'How colors influence user behavior and perception.',
    author: sampleUsers[3],
    icon: '🎨',
    tags: ['Color', 'Psychology', 'UI'],
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    reactions: [{ emoji: '❤️', count: 8, users: ['2', '4'] }],
    comments: [],
  },
  {
    id: '17',
    title: 'State Management Patterns',
    description: 'Comparing different approaches to managing application state.',
    author: sampleUsers[4],
    icon: '🗂️',
    tags: ['State', 'Patterns', 'Architecture'],
    createdAt: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000),
    reactions: [
      { emoji: '💡', count: 12, users: ['1', '2', '3'] },
      { emoji: '🔥', count: 7, users: ['4', '5'] },
    ],
    comments: [],
  },
  {
    id: '18',
    title: 'Mobile-First Design',
    description: 'Why starting with mobile leads to better experiences.',
    author: sampleUsers[5],
    icon: '📱',
    tags: ['Mobile', 'Design', 'Responsive'],
    createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
    reactions: [{ emoji: '❤️', count: 14, users: ['1', '2', '3', '4'] }],
    comments: [],
  },
  {
    id: '19',
    title: 'API Design Philosophy',
    description: 'Creating intuitive and developer-friendly APIs.',
    author: sampleUsers[0],
    icon: '🔌',
    tags: ['API', 'Design', 'Backend'],
    createdAt: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000),
    reactions: [
      { emoji: '🔥', count: 10, users: ['2', '3', '4'] },
      { emoji: '💡', count: 5, users: ['1', '5'] },
    ],
    comments: [],
  },
  {
    id: '20',
    title: 'Testing Strategies',
    description: 'Building confidence through comprehensive testing approaches.',
    author: sampleUsers[1],
    icon: '🧪',
    tags: ['Testing', 'Quality', 'Best Practices'],
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    reactions: [{ emoji: '💡', count: 9, users: ['1', '2', '3'] }],
    comments: [],
  },
  {
    id: '21',
    title: 'The Future of Web Standards',
    description: 'Exploring emerging web technologies and standards.',
    author: sampleUsers[2],
    icon: '🌐',
    tags: ['Web', 'Standards', 'Future'],
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
    reactions: [
      { emoji: '❤️', count: 12, users: ['1', '3', '4', '5'] },
      { emoji: '🔥', count: 8, users: ['2'] },
    ],
    comments: [],
  },
  {
    id: '22',
    title: 'User Research Methods',
    description: 'Effective ways to understand and empathize with users.',
    author: sampleUsers[3],
    icon: '🔍',
    tags: ['Research', 'UX', 'User-Centered'],
    createdAt: new Date(Date.now() - 16 * 24 * 60 * 60 * 1000),
    reactions: [{ emoji: '💡', count: 11, users: ['1', '2', '4'] }],
    comments: [],
  },
]

