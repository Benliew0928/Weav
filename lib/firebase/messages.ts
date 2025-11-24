import {
    collection,
    doc,
    addDoc,
    updateDoc,
    getDoc,
    query,
    where,
    orderBy,
    limit,
    onSnapshot,
    Timestamp,
    serverTimestamp,
    writeBatch,
    startAfter,
    getDocs
} from 'firebase/firestore'
import { db } from './config'
import { User } from '@/data/sampleThreads'
import { getUserProfile } from './users'

export interface ChatMessage {
    id: string
    authorId: string
    author: User
    content: string
    timestamp: Date
    isEdited: boolean
    editedAt?: Date
    type: 'text' | 'image' | 'file' | 'audio'
    mediaUrl?: string
    metadata?: {
        duration?: number // Duration in seconds for audio
        fileName?: string
    }
    reactions: MessageReaction[]
    isDeleted?: boolean
    readBy?: Record<string, Timestamp>
}

export interface MessageReaction {
    emoji: string
    userIds: string[]
}

const timestampToDate = (timestamp: Timestamp | Date | null | undefined): Date => {
    if (!timestamp) return new Date()
    if (timestamp instanceof Date) return timestamp
    return timestamp.toDate()
}

export const sendMessage = async (
    threadId: string,
    authorId: string,
    content: string,
    type: 'text' | 'image' | 'file' | 'audio' = 'text',
    mediaUrl?: string,
    metadata?: { duration?: number; fileName?: string }
): Promise<string> => {
    if (!db) throw new Error('Firebase Firestore not initialized')
    if (!threadId || !authorId || !content.trim()) throw new Error('Invalid message parameters')

    try {
        const messagesRef = collection(db, 'threads', threadId, 'messages')

        const messageData: any = {
            authorId,
            content: content.trim(),
            timestamp: serverTimestamp(),
            isEdited: false,
            type,
            reactions: [],
            isDeleted: false,
            readBy: {
                [authorId]: serverTimestamp()
            }
        }

        if (mediaUrl) {
            messageData.mediaUrl = mediaUrl
        }

        if (metadata) {
            messageData.metadata = metadata
        }

        const docRef = await addDoc(messagesRef, messageData)
        return docRef.id
    } catch (error) {
        console.error('Error sending message:', error)
        throw new Error(`Failed to send message: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
}

export const subscribeToMessages = (
    threadId: string,
    callback: (messages: ChatMessage[]) => void,
    onError: (error: Error) => void,
    limitCount: number = 50
) => {
    if (!db) return () => { }

    const messagesRef = collection(db, 'threads', threadId, 'messages')

    // Simple query - removed the problematic where('isDeleted', 'in', [true, false])
    const q = query(
        messagesRef,
        orderBy('timestamp', 'desc'),
        limit(limitCount)
    )

    const unsubscribe = onSnapshot(q, async (snapshot) => {
        try {
            const messages = await Promise.all(snapshot.docs.map(async (docSnapshot) => {
                const data = docSnapshot.data()
                const author = await getUserProfile(data.authorId)

                return {
                    id: docSnapshot.id,
                    ...data,
                    timestamp: data.timestamp?.toDate() || new Date(),
                    editedAt: data.editedAt?.toDate(),
                    author
                } as ChatMessage
            }))

            callback(messages.reverse())
        } catch (error) {
            console.error('Error processing messages:', error)
            onError(error as Error)
        }
    }, (error) => {
        console.error('Error subscribing to messages:', error)
        onError(error)
    })

    return unsubscribe
}

export const loadMoreMessages = async (
    threadId: string,
    lastMessageTimestamp: Date,
    limitCount: number = 20
): Promise<ChatMessage[]> => {
    if (!db) return []

    try {
        const messagesRef = collection(db, 'threads', threadId, 'messages')
        const q = query(
            messagesRef,
            where('isDeleted', 'in', [true, false]),
            orderBy('timestamp', 'desc'),
            startAfter(Timestamp.fromDate(lastMessageTimestamp)),
            limit(limitCount)
        )

        const snapshot = await getDocs(q)
        const messages = await Promise.all(snapshot.docs.map(async (docSnapshot) => {
            const data = docSnapshot.data()
            const author = await getUserProfile(data.authorId)

            return {
                id: docSnapshot.id,
                ...data,
                timestamp: data.timestamp?.toDate() || new Date(),
                editedAt: data.editedAt?.toDate(),
                author
            } as ChatMessage
        }))

        // Return in chronological order (oldest to newest)
        return messages.reverse()
    } catch (error) {
        console.error('Error loading more messages:', error)
        return []
    }
}

export const editMessage = async (
    threadId: string,
    messageId: string,
    newContent: string,
    userId: string
): Promise<void> => {
    if (!db) throw new Error('Firebase Firestore not initialized')
    if (!threadId || !messageId || !newContent.trim() || !userId) throw new Error('Invalid edit parameters')

    try {
        const messageRef = doc(db, 'threads', threadId, 'messages', messageId)
        const messageSnap = await getDoc(messageRef)

        if (!messageSnap.exists()) throw new Error('Message not found')

        const messageData = messageSnap.data()
        if (messageData.authorId !== userId) {
            throw new Error('Unauthorized: You can only edit your own messages')
        }

        await updateDoc(messageRef, {
            content: newContent.trim(),
            isEdited: true,
            editedAt: serverTimestamp(),
        })
    } catch (error) {
        console.error('Error editing message:', error)
        throw new Error(`Failed to edit message: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
}

export const deleteMessage = async (
    threadId: string,
    messageId: string,
    userId: string
): Promise<void> => {
    if (!db) throw new Error('Firebase Firestore not initialized')
    if (!threadId || !messageId || !userId) throw new Error('Invalid delete parameters')

    try {
        const messageRef = doc(db, 'threads', threadId, 'messages', messageId)
        const messageSnap = await getDoc(messageRef)

        if (!messageSnap.exists()) throw new Error('Message not found')

        const messageData = messageSnap.data()
        if (messageData.authorId !== userId) {
            throw new Error('Unauthorized: You can only delete your own messages')
        }

        await updateDoc(messageRef, {
            isDeleted: true,
            content: '[Message deleted]',
        })
    } catch (error) {
        console.error('Error deleting message:', error)
        throw new Error(`Failed to delete message: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
}

export const addReaction = async (
    threadId: string,
    messageId: string,
    emoji: string,
    userId: string
): Promise<void> => {
    if (!db) throw new Error('Firebase Firestore not initialized')
    if (!threadId || !messageId || !emoji || !userId) throw new Error('Invalid reaction parameters')

    try {
        const messageRef = doc(db, 'threads', threadId, 'messages', messageId)
        const messageSnap = await getDoc(messageRef)

        if (!messageSnap.exists()) throw new Error('Message not found')

        const messageData = messageSnap.data()
        const reactions: MessageReaction[] = messageData.reactions || []
        const existingReaction = reactions.find((r) => r.emoji === emoji)

        if (existingReaction) {
            if (existingReaction.userIds.includes(userId)) {
                existingReaction.userIds = existingReaction.userIds.filter((id) => id !== userId)
                if (existingReaction.userIds.length === 0) {
                    const updatedReactions = reactions.filter((r) => r.emoji !== emoji)
                    await updateDoc(messageRef, { reactions: updatedReactions })
                } else {
                    await updateDoc(messageRef, { reactions })
                }
            } else {
                existingReaction.userIds.push(userId)
                await updateDoc(messageRef, { reactions })
            }
        } else {
            reactions.push({ emoji, userIds: [userId] })
            await updateDoc(messageRef, { reactions })
        }
    } catch (error) {
        console.error('Error adding reaction:', error)
        throw new Error(`Failed to add reaction: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
}

export const removeReaction = async (
    threadId: string,
    messageId: string,
    emoji: string,
    userId: string
): Promise<void> => {
    await addReaction(threadId, messageId, emoji, userId)
}

export const markMessageAsRead = async (
    threadId: string,
    messageId: string,
    userId: string
): Promise<void> => {
    if (!db) return
    try {
        const messageRef = doc(db, 'threads', threadId, 'messages', messageId)
        await updateDoc(messageRef, {
            [`readBy.${userId}`]: serverTimestamp()
        })
    } catch (error) {
        console.error('Error marking message as read:', error)
    }
}

export const markMessagesAsRead = async (
    threadId: string,
    messageIds: string[],
    userId: string
): Promise<void> => {
    const firestore = db
    if (!firestore || messageIds.length === 0) return
    try {
        const batch = writeBatch(firestore)
        messageIds.forEach(msgId => {
            const messageRef = doc(firestore, 'threads', threadId, 'messages', msgId)
            batch.update(messageRef, {
                [`readBy.${userId}`]: serverTimestamp()
            })
        })
        await batch.commit()
    } catch (error) {
        console.error('Error marking messages as read:', error)
    }
}
