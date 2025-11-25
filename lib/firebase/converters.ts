import { Timestamp } from 'firebase/firestore'
import { User, Thread, Comment, Reaction } from '@/data/sampleThreads'

// Convert Firestore Timestamp to Date
export const timestampToDate = (timestamp: Timestamp | Date | null | undefined): Date => {
  if (!timestamp) return new Date()
  if (timestamp instanceof Date) return timestamp
  return timestamp.toDate()
}

// Convert Date to Firestore Timestamp
export const dateToTimestamp = (date: Date | null | undefined): Timestamp => {
  if (!date) return Timestamp.now()
  return Timestamp.fromDate(date)
}

// Convert User to Firestore format
export const userToFirestore = (user: User) => {
  return {
    id: user.id,
    username: user.username,
    avatar: user.avatar,
    bio: user.bio || null,
    displayName: user.displayName || null,
    location: user.location || null,
    website: user.website || null,
  }
}

// Convert Firestore document to User
export const firestoreToUser = (data: any): User => {
  return {
    id: data.id || data.userId || '',
    username: data.username || '',
    avatar: data.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=user',
    bio: data.bio || undefined,
    displayName: data.displayName || undefined,
    location: data.location || undefined,
    website: data.website || undefined,
  }
}

// Convert Reaction to Firestore format
export const reactionToFirestore = (reaction: Reaction) => {
  return {
    emoji: reaction.emoji,
    count: reaction.count,
    users: reaction.users,
  }
}

// Convert Firestore data to Reaction
export const firestoreToReaction = (data: any): Reaction => {
  return {
    emoji: data.emoji || '',
    count: data.count || 0,
    users: data.users || [],
  }
}

// Convert Comment to Firestore format
export const commentToFirestore = (comment: Comment): any => {
  return {
    id: comment.id,
    authorId: comment.author.id,
    authorUsername: comment.author.username,
    authorAvatar: comment.author.avatar,
    content: comment.content,
    timestamp: dateToTimestamp(comment.timestamp),
    reactions: comment.reactions.map(reactionToFirestore),
    replies: comment.replies?.map(commentToFirestore) || [],
  }
}

// Convert Firestore data to Comment
export const firestoreToComment = (data: any): Comment => {
  const author: User = {
    id: data.authorId || 'unknown',
    username: data.authorUsername || 'unknown',
    avatar: data.authorAvatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=unknown',
  }

  return {
    id: data.id || '',
    author,
    content: data.content || '',
    timestamp: timestampToDate(data.timestamp),
    reactions: (data.reactions || []).map(firestoreToReaction),
    replies: data.replies?.map((reply: any) => firestoreToComment(reply)) || undefined,
  }
}

// Convert Thread to Firestore format
export const threadToFirestore = (thread: Thread) => {
  return {
    id: thread.id,
    title: thread.title,
    description: thread.description,
    authorId: thread.author.id,
    icon: thread.icon,
    image: thread.image || null,
    tags: thread.tags,
    createdAt: dateToTimestamp(thread.createdAt),
    reactions: thread.reactions.map(reactionToFirestore),
    comments: thread.comments.map(commentToFirestore),
    unread: thread.unread || false,
  }
}

// Convert Firestore document to Thread (requires author User object)
export const firestoreToThread = (data: any, author: User): Thread => {
  return {
    id: data.id || '',
    title: data.title || '',
    description: data.description || '',
    author,
    icon: data.icon || '💬',
    image: data.image || undefined,
    tags: data.tags || [],
    createdAt: timestampToDate(data.createdAt),
    reactions: (data.reactions || []).map(firestoreToReaction),
    comments: (data.comments || []).map((comment: any) =>
      firestoreToComment(comment)
    ),
    unread: data.unread || false,
  }
}
