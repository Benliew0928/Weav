'use client'

import { useEffect, useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Globe, Link as LinkIcon, MessageCircle } from 'lucide-react'
import { useWeavStore } from '@/store/useWeavStore'
import { Avatar } from '@/components/Avatar'
import { getUserProfile } from '@/lib/firebase/users'
import { User } from '@/data/sampleThreads'
import { useParams } from 'next/navigation'

export const runtime = 'edge'

export default function PublicProfilePage() {
    const { userId } = useParams()
    const { theme, threads, currentUser } = useWeavStore()
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchUser() {
            if (typeof userId === 'string') {
                // If viewing own profile, use store data
                if (currentUser && currentUser.id === userId) {
                    setUser(currentUser)
                    setLoading(false)
                    return
                }

                try {
                    const fetchedUser = await getUserProfile(userId)
                    setUser(fetchedUser)
                } catch (error) {
                    console.error('Error fetching user:', error)
                } finally {
                    setLoading(false)
                }
            }
        }
        fetchUser()
    }, [userId, currentUser])

    const userThreads = useMemo(
        () => threads.filter((t) => t.author.id === userId),
        [threads, userId]
    )

    const totalComments = useMemo(
        () => userThreads.reduce((sum, thread) => sum + thread.comments.length, 0),
        [userThreads]
    )

    const totalReactions = useMemo(
        () =>
            userThreads.reduce(
                (sum, thread) =>
                    sum +
                    thread.reactions.reduce((acc, reaction) => acc + reaction.count, 0),
                0
            ),
        [userThreads]
    )

    const cardBase = `rounded-3xl border backdrop-blur-xl transition-colors ${theme === 'dark'
        ? 'bg-white/5 border-white/10'
        : 'bg-white/90 border-gray-200/80 shadow-lg'
        }`

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-mid" />
            </div>
        )
    }

    if (!user) {
        return (
            <div className="flex items-center justify-center h-full">
                <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                    User not found
                </p>
            </div>
        )
    }

    return (
        <div
            className={`h-full overflow-y-auto transition-colors duration-300 ${theme === 'light' ? 'bg-white' : ''
                }`}
        >
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-8 pb-24 space-y-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: 'spring', stiffness: 220, damping: 26 }}
                    className={`${cardBase} overflow-hidden relative`}
                >
                    <div
                        className="absolute inset-0 opacity-60"
                        style={{
                            background:
                                theme === 'dark'
                                    ? 'linear-gradient(130deg, rgba(123,97,255,0.35), rgba(58,147,255,0.25))'
                                    : 'linear-gradient(130deg, rgba(123,97,255,0.25), rgba(58,147,255,0.15))',
                        }}
                    />
                    <div className="relative z-10 px-6 sm:px-10 py-10 flex flex-col lg:flex-row lg:items-center gap-8">
                        <div className="flex items-center gap-6">
                            <div className="relative">
                                <Avatar
                                    src={user.avatar}
                                    alt={user.username}
                                    size="xl"
                                    className="ring-4 ring-primary-mid/40"
                                />
                            </div>
                            <div>
                                <p
                                    className={`text-sm uppercase tracking-wide ${theme === 'dark' ? 'text-white/70' : 'text-gray-600'
                                        }`}
                                >
                                    Explorer
                                </p>
                                <h1
                                    className={`text-3xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'
                                        }`}
                                >
                                    {user.displayName || user.username}
                                </h1>
                                <p
                                    className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                                        }`}
                                >
                                    @{user.username}
                                </p>
                            </div>
                        </div>
                        <div className="flex-1 flex flex-wrap items-center gap-4 justify-end">
                            <div className="text-left">
                                <p
                                    className={`text-xs uppercase tracking-wider ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                                        }`}
                                >
                                    Threads
                                </p>
                                <p
                                    className={`text-2xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'
                                        }`}
                                >
                                    {userThreads.length}
                                </p>
                            </div>
                            <div className="text-left">
                                <p
                                    className={`text-xs uppercase tracking-wider ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                                        }`}
                                >
                                    Comments
                                </p>
                                <p
                                    className={`text-2xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'
                                        }`}
                                >
                                    {totalComments}
                                </p>
                            </div>
                            <div className="text-left">
                                <p
                                    className={`text-xs uppercase tracking-wider ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                                        }`}
                                >
                                    Reactions
                                </p>
                                <p
                                    className={`text-2xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'
                                        }`}
                                >
                                    {totalReactions}
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.05, type: 'spring', stiffness: 220, damping: 26 }}
                        className="lg:col-span-2 space-y-6"
                    >
                        <section className={`${cardBase} p-6 space-y-6`}>
                            <div className="flex items-center justify-between">
                                <h2
                                    className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'
                                        }`}
                                >
                                    About
                                </h2>
                            </div>
                            <p
                                className={`text-body ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                                    }`}
                            >
                                {user.bio || 'No bio yet.'}
                            </p>
                            <div className="flex flex-wrap gap-6">
                                {user.location && (
                                    <div className="flex items-center gap-2">
                                        <MapPin className={`w-4 h-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
                                        <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
                                            {user.location}
                                        </span>
                                    </div>
                                )}
                                {user.website && (
                                    <div className="flex items-center gap-2">
                                        <Globe className={`w-4 h-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
                                        <a
                                            href={user.website}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={`hover:underline ${theme === 'dark' ? 'text-primary-light' : 'text-primary-mid'}`}
                                        >
                                            {user.website.replace(/^https?:\/\//, '')}
                                        </a>
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* Recent Activity / Threads could go here */}
                        <section className={`${cardBase} p-6 space-y-4`}>
                            <h2 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                Recent Threads
                            </h2>
                            {userThreads.length > 0 ? (
                                <div className="space-y-4">
                                    {userThreads.slice(0, 3).map(thread => (
                                        <div key={thread.id} className={`p-4 rounded-xl border ${theme === 'dark' ? 'border-white/10 bg-white/5' : 'border-gray-100 bg-gray-50'}`}>
                                            <h3 className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{thread.title}</h3>
                                            <p className={`text-sm mt-1 line-clamp-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{thread.description}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>No threads yet.</p>
                            )}
                        </section>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}
