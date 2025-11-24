import {
  collection,
  doc,
  addDoc,
  getDocs,
  query,
  orderBy,
  where,
  onSnapshot,
  updateDoc,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore'
import { db } from './config'

export interface Notification {
  id: string
  type: 'new_thread' | 'like' | 'comment' | 'follow'
  message: string
  timestamp: Date
  threadId?: string
  read: boolean
  userId: string // The user who should receive this notification
}

// Create a notification
export const createNotification = async (notificationData: Omit<Notification, 'id' | 'timestamp'>) => {
  if (!db) throw new Error('Firebase Firestore not initialized')
  
  const notificationsRef = collection(db, 'notifications', notificationData.userId, 'userNotifications')
  const notificationDoc = {
    ...notificationData,
    timestamp: serverTimestamp(),
  }
  
  const docRef = await addDoc(notificationsRef, notificationDoc)
  return docRef.id
}

// Create notifications for all users when a new thread is created
export const createNewThreadNotifications = async (threadId: string, threadTitle: string, authorName: string) => {
  if (!db) throw new Error('Firebase Firestore not initialized')
  
  // Get all users (you might want to optimize this with a users collection query)
  // For now, we'll create notifications on-demand when users are active
  // This is a simplified approach - in production, you might want to:
  // 1. Only notify subscribed/following users
  // 2. Use Cloud Functions to batch create notifications
  // 3. Use a separate "notifications" collection with userId field
  
  // For now, we'll create notifications when users query their notifications
  // This function can be called from Cloud Functions or when needed
}

// Get notifications for a user
export const getNotifications = async (userId: string): Promise<Notification[]> => {
  if (!db) throw new Error('Firebase Firestore not initialized')
  
  const notificationsRef = collection(db, 'notifications', userId, 'userNotifications')
  const q = query(notificationsRef, orderBy('timestamp', 'desc'))
  const querySnapshot = await getDocs(q)
  
  const notifications: Notification[] = []
  querySnapshot.forEach((doc) => {
    const data = doc.data()
    notifications.push({
      id: doc.id,
      type: data.type,
      message: data.message,
      timestamp: data.timestamp?.toDate() || new Date(),
      threadId: data.threadId,
      read: data.read || false,
      userId: data.userId,
    })
  })
  
  return notifications
}

// Real-time listener for notifications
export const subscribeToNotifications = (
  userId: string,
  callback: (notifications: Notification[]) => void,
  onError?: (error: Error) => void
) => {
  if (!db) return () => {}
  
  const notificationsRef = collection(db, 'notifications', userId, 'userNotifications')
  const q = query(notificationsRef, orderBy('timestamp', 'desc'))
  
  const unsubscribe = onSnapshot(
    q,
    (querySnapshot) => {
      const notifications: Notification[] = []
      querySnapshot.forEach((doc) => {
        const data = doc.data()
        notifications.push({
          id: doc.id,
          type: data.type,
          message: data.message,
          timestamp: data.timestamp?.toDate() || new Date(),
          threadId: data.threadId,
          read: data.read || false,
          userId: data.userId,
        })
      })
      callback(notifications)
    },
    (error) => {
      console.error('Error listening to notifications:', error)
      if (onError) {
        onError(error as Error)
      }
    }
  )
  
  return unsubscribe
}

// Mark notification as read
export const markNotificationAsRead = async (userId: string, notificationId: string) => {
  if (!db) throw new Error('Firebase Firestore not initialized')
  
  const notificationRef = doc(db, 'notifications', userId, 'userNotifications', notificationId)
  await updateDoc(notificationRef, {
    read: true,
  })
}

// Mark all notifications as read for a user
export const markAllNotificationsAsRead = async (userId: string) => {
  if (!db) throw new Error('Firebase Firestore not initialized')
  
  const notifications = await getNotifications(userId)
  const unreadNotifications = notifications.filter(n => !n.read)
  
  await Promise.all(
    unreadNotifications.map(notification =>
      markNotificationAsRead(userId, notification.id)
    )
  )
}

// Create notification for new thread (simplified - notify all users)
// In production, you'd want to optimize this
export const notifyNewThread = async (threadId: string, threadTitle: string, authorName: string, allUserIds: string[]) => {
  await Promise.all(
    allUserIds.map(userId =>
      createNotification({
        type: 'new_thread',
        message: `${authorName} created a new thread: ${threadTitle}`,
        threadId,
        read: false,
        userId,
      })
    )
  )
}

