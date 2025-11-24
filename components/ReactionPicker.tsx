'use client'

import { motion } from 'framer-motion'
import { useWeavStore } from '@/store/useWeavStore'

const REACTIONS = ['❤️', '👍', '👎', '😂', '😮', '😢', '🔥', '🎉']

interface ReactionPickerProps {
    onSelect: (emoji: string) => void
    onClose: () => void
}

export function ReactionPicker({ onSelect, onClose }: ReactionPickerProps) {
    const { theme } = useWeavStore()

    return (
        <>
            <div
                className="fixed inset-0 z-40"
                onClick={(e) => {
                    e.stopPropagation()
                    onClose()
                }}
            />
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 10 }}
                className={`absolute bottom-full mb-2 z-50 glass backdrop-blur-xl border rounded-full p-1.5 flex gap-1 shadow-xl ${theme === 'dark'
                        ? 'bg-[#1a1a2e]/90 border-white/20'
                        : 'bg-white/90 border-gray-200'
                    }`}
                onClick={(e) => e.stopPropagation()}
            >
                {REACTIONS.map((emoji) => (
                    <button
                        key={emoji}
                        onClick={(e) => {
                            e.stopPropagation()
                            onSelect(emoji)
                            onClose()
                        }}
                        className={`w-8 h-8 flex items-center justify-center rounded-full transition-all transform hover:scale-110 ${theme === 'dark' ? 'hover:bg-white/20' : 'hover:bg-black/5'
                            }`}
                    >
                        <span className="text-lg leading-none select-none">{emoji}</span>
                    </button>
                ))}
            </motion.div>
        </>
    )
}
