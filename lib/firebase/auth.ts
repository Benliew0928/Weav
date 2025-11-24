import { 
  signInWithPopup, 
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider, 
  signInAnonymously as firebaseSignInAnonymously, 
  signOut as firebaseSignOut,
  User as FirebaseUser,
  onAuthStateChanged as firebaseOnAuthStateChanged,
  Auth
} from 'firebase/auth'
import { auth } from './config'

const googleProvider = new GoogleAuthProvider()

// Detect if device is mobile
const isMobileDevice = () => {
  if (typeof window === 'undefined') return false
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768
}

export const signInWithGoogle = async () => {
  if (!auth) throw new Error('Firebase auth not initialized')
  
  // Use redirect on mobile devices, popup on desktop
  if (isMobileDevice()) {
    await signInWithRedirect(auth, googleProvider)
    // Note: The redirect will navigate away, so we return null here
    // The actual user will be available after redirect via getRedirectResult or onAuthStateChanged
    return null
  } else {
    const result = await signInWithPopup(auth, googleProvider)
    return result.user
  }
}

// Check for redirect result (call this on app initialization)
export const checkRedirectResult = async (): Promise<FirebaseUser | null> => {
  if (!auth) return null
  try {
    const result = await getRedirectResult(auth)
    return result?.user || null
  } catch (error) {
    console.error('Error getting redirect result:', error)
    return null
  }
}

export const signInAnonymously = async () => {
  if (!auth) throw new Error('Firebase auth not initialized')
  const result = await firebaseSignInAnonymously(auth)
  return result.user
}

export const signOut = async () => {
  if (!auth) throw new Error('Firebase auth not initialized')
  await firebaseSignOut(auth)
}

export const onAuthStateChanged = (callback: (user: FirebaseUser | null) => void) => {
  if (!auth) return () => {}
  return firebaseOnAuthStateChanged(auth, callback)
}

export const getCurrentUser = (): FirebaseUser | null => {
  if (!auth) return null
  return auth.currentUser
}

