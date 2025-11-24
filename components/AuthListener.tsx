'use client'

import { useEffect } from 'react'
import { useWeavStore } from '@/store/useWeavStore'
import { onAuthStateChanged } from '@/lib/firebase/auth'
import { createUserProfile, getUserProfile } from '@/lib/firebase/users'

export function AuthListener() {
  const { setAuthenticated, setCurrentUserId, setCurrentUser } = useWeavStore()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        // User is signed in
        setCurrentUserId(firebaseUser.uid)
        setAuthenticated(true)

        // Get or create user profile in Firestore
        let userProfile = await getUserProfile(firebaseUser.uid)
        if (!userProfile) {
          await createUserProfile(firebaseUser)
          userProfile = await getUserProfile(firebaseUser.uid)
        }

        if (userProfile) {
          setCurrentUser(userProfile)
        }
      } else {
        // User is signed out
        setCurrentUserId(null)
        setAuthenticated(false)
      }
    })

    return () => unsubscribe()
  }, [setAuthenticated, setCurrentUserId, setCurrentUser])

  return null
}


