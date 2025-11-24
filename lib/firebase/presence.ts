import {
    collection,
    doc,
    setDoc,
    onSnapshot,
    query,
    where,
    serverTimestamp,
    Timestamp,
    deleteDoc,
} from 'firebase/firestore'
import { db } from './config'
import { User } from '@/data/sampleThreads'

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface UserPresence {
    userId: string
    username: string
    avatar: string
    isTyping: boolean
    lastSeen: Date
    isOnline: boolean
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

const timestampToDate = (timestamp: Timestamp | Date | null | undefined): Date => {
    if (!timestamp) return new Date()
    if (timestamp instanceof Date) return timestamp
    return timestamp.toDate()
}

// ============================================================================
// PRESENCE OPERATIONS
// ============================================================================

/**
 * Set user's typing status in a thread
 */
export const setTypingStatus = async (
    threadId: string,
    userId: string,
    user: User,
    isTyping: boolean
): Promise<void> => {
    if (!db || !threadId || !userId) return

    try {
        const presenceRef = doc(db, 'threads', threadId, 'presence', userId)

        await setDoc(presenceRef, {
            userId,
            username: user.username,
            avatar: user.avatar,
            isTyping,
            lastSeen: serverTimestamp(),
            isOnline: true,
        }, { merge: true })
    } catch (error) {
        console.error('Error setting typing status:', error)
    }
}

/**
 * Update user's last seen timestamp
 */
export const updateLastSeen = async (
    threadId: string,
    userId: string,
    user: User
): Promise<void> => {
    if (!db || !threadId || !userId) return

    try {
        const presenceRef = doc(db, 'threads', threadId, 'presence', userId)

        await setDoc(presenceRef, {
            userId,
            username: user.username,
            avatar: user.avatar,
            isTyping: false,
            lastSeen: serverTimestamp(),
            isOnline: true,
        }, { merge: true })
    } catch (error) {
        console.error('Error updating last seen:', error)
    }
}

/**
 * Set user as offline in a thread
 */
export const setUserOffline = async (
    threadId: string,
    userId: string
): Promise<void> => {
    if (!db || !threadId || !userId) return

    try {
        const presenceRef = doc(db, 'threads', threadId, 'presence', userId)

        await setDoc(presenceRef, {
            isOnline: false,
            isTyping: false,
            lastSeen: serverTimestamp(),
        }, { merge: true })
    } catch (error) {
        console.error('Error setting user offline:', error)
    }
}

/**
 * Subscribe to typing users in a thread
 */
export const subscribeToTypingUsers = (
    threadId: string,
    callback: (typingUsers: User[]) => void
): (() => void) => {
    if (!db || !threadId) return () => { }

    try {
        const presenceRef = collection(db, 'threads', threadId, 'presence')
        const q = query(
            presenceRef,
            where('isTyping', '==', true),
            where('isOnline', '==', true)
        )

        return onSnapshot(
            q,
            (querySnapshot) => {
                const typingUsers: User[] = []
                querySnapshot.forEach((doc) => {
                    const data = doc.data()
                    typingUsers.push({
                        id: data.userId,
                        username: data.username,
                        avatar: data.avatar,
                    })
                })
                callback(typingUsers)
            },
            (error) => {
                console.error('Error listening to typing users:', error)
            }
        )
    } catch (error) {
        console.error('Error setting up typing users subscription:', error)
        return () => { }
    }
}

/**
 * Subscribe to online users in a thread
 */
export const subscribeToOnlineUsers = (
    threadId: string,
    callback: (onlineCount: number, onlineUsers: UserPresence[]) => void
): (() => void) => {
    if (!db || !threadId) return () => { }

    try {
        const presenceRef = collection(db, 'threads', threadId, 'presence')
        const q = query(presenceRef, where('isOnline', '==', true))

        return onSnapshot(
            q,
            (querySnapshot) => {
                const onlineUsers: UserPresence[] = []
                querySnapshot.forEach((doc) => {
                    const data = doc.data()
                    onlineUsers.push({
                        userId: data.userId,
                        username: data.username,
                        avatar: data.avatar,
                        isTyping: data.isTyping || false,
                        lastSeen: timestampToDate(data.lastSeen),
                        isOnline: data.isOnline || false,
                    })
                })
                callback(onlineUsers.length, onlineUsers)
            },
            (error) => {
                console.error('Error listening to online users:', error)
            }
        )
    } catch (error) {
        console.error('Error setting up online users subscription:', error)
        return () => { }
    }
}

/**
 * Create a debounced typing status updater
 */
export const createTypingDebouncer = (
    threadId: string,
    userId: string,
    user: User,
    debounceMs: number = 1000
) => {
    let typingTimeout: NodeJS.Timeout | null = null
    let isCurrentlyTyping = false

    const startTyping = () => {
        if (!isCurrentlyTyping) {
            setTypingStatus(threadId, userId, user, true)
            isCurrentlyTyping = true
        }

        if (typingTimeout) {
            clearTimeout(typingTimeout)
        }

        typingTimeout = setTimeout(() => {
            setTypingStatus(threadId, userId, user, false)
            isCurrentlyTyping = false
        }, debounceMs)
    }

    const stopTyping = () => {
        if (typingTimeout) {
            clearTimeout(typingTimeout)
        }
        if (isCurrentlyTyping) {
            setTypingStatus(threadId, userId, user, false)
            isCurrentlyTyping = false
        }
    }

    const cleanup = () => {
        stopTyping()
    }

    return { startTyping, stopTyping, cleanup }
}
