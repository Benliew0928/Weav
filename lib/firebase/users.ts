import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  onSnapshot,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore'
import { db } from './config'
import { User } from '@/data/sampleThreads'
import { userToFirestore, firestoreToUser } from './converters'
import { User as FirebaseUser } from 'firebase/auth'

// Create or update user profile
export const createUserProfile = async (firebaseUser: FirebaseUser, additionalData?: Partial<User>) => {
  if (!db) throw new Error('Firebase Firestore not initialized')
  
  const userRef = doc(db, 'users', firebaseUser.uid)
  const userData: any = {
    id: firebaseUser.uid,
    username: firebaseUser.displayName?.toLowerCase().replace(/\s+/g, '_') || `user_${firebaseUser.uid.slice(0, 8)}`,
    displayName: firebaseUser.displayName || 'Anonymous User',
    avatar: firebaseUser.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${firebaseUser.uid}`,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    ...additionalData,
  }

  // If user is anonymous, set a default username
  if (firebaseUser.isAnonymous) {
    userData.username = `anonymous_${firebaseUser.uid.slice(0, 8)}`
    userData.displayName = 'Anonymous User'
  }

  await setDoc(userRef, userData, { merge: true })
  return userData
}

// Get user profile
export const getUserProfile = async (userId: string): Promise<User | null> => {
  if (!db) throw new Error('Firebase Firestore not initialized')
  
  const userRef = doc(db, 'users', userId)
  const userSnap = await getDoc(userRef)
  
  if (!userSnap.exists()) {
    return null
  }
  
  return firestoreToUser({ id: userId, ...userSnap.data() })
}

// Update user profile
export const updateUserProfile = async (userId: string, updates: Partial<User>) => {
  if (!db) throw new Error('Firebase Firestore not initialized')
  
  const userRef = doc(db, 'users', userId)
  const firestoreData: any = { ...updates }
  delete firestoreData.id // Don't update the ID
  firestoreData.updatedAt = serverTimestamp()
  
  await updateDoc(userRef, firestoreData)
}

// Real-time user profile listener
export const onUserProfileChange = (userId: string, callback: (user: User | null) => void) => {
  if (!db) return () => {}
  
  const userRef = doc(db, 'users', userId)
  const unsubscribe = onSnapshot(
    userRef,
    (snapshot) => {
      if (snapshot.exists()) {
        callback(firestoreToUser({ id: userId, ...snapshot.data() }))
      } else {
        callback(null)
      }
    },
    (error) => {
      console.error('Error listening to user profile:', error)
      callback(null)
    }
  )
  
  return unsubscribe
}

