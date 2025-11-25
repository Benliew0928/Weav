'use client'

import { useEffect } from 'react'
import { useWeavStore } from '@/store/useWeavStore'
import { subscribeToThreads } from '@/lib/firebase/threads'

export function ThreadListener() {
    const { syncThreadsFromFirebase } = useWeavStore()

    useEffect(() => {
        const unsubscribe = subscribeToThreads((threads) => {
            syncThreadsFromFirebase(threads)
        })

        return () => unsubscribe()
    }, [syncThreadsFromFirebase])

    return null
}
