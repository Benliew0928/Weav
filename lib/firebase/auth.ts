import {
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  User as FirebaseUser,
  onAuthStateChanged as firebaseOnAuthStateChanged,
  Auth
} from 'firebase/auth'
import { auth } from './config'

const googleProvider = new GoogleAuthProvider()

export const signInWithGoogle = async () => {
  if (!auth) throw new Error('Firebase auth not initialized')
  const result = await signInWithPopup(auth, googleProvider)
  return result.user
}


export const signOut = async () => {
  if (!auth) throw new Error('Firebase auth not initialized')
  await firebaseSignOut(auth)
}

export const onAuthStateChanged = (callback: (user: FirebaseUser | null) => void) => {
  if (!auth) return () => { }
  return firebaseOnAuthStateChanged(auth, callback)
}

export const getCurrentUser = (): FirebaseUser | null => {
  if (!auth) return null
  return auth.currentUser
}

