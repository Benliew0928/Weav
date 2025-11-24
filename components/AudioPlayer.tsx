'use client'

import { useState, useRef, useEffect } from 'react'
import { Play, Pause } from 'lucide-react'
import { useWeavStore } from '@/store/useWeavStore'

interface AudioPlayerProps {
    audioUrl: string
    duration?: number
    isOwnMessage: boolean
}

export function AudioPlayer({ audioUrl, duration, isOwnMessage }: AudioPlayerProps) {
    const { theme } = useWeavStore()
    const [isPlaying, setIsPlaying] = useState(false)
    const [currentTime, setCurrentTime] = useState(0)
    const [audioDuration, setAudioDuration] = useState(duration || 0)
    const audioRef = useRef<HTMLAudioElement>(null)

    useEffect(() => {
        const audio = audioRef.current
        if (!audio) return

        const updateTime = () => setCurrentTime(audio.currentTime)
        const updateDuration = () => setAudioDuration(audio.duration)
        const handleEnded = () => setIsPlaying(false)

        audio.addEventListener('timeupdate', updateTime)
        audio.addEventListener('loadedmetadata', updateDuration)
        audio.addEventListener('ended', handleEnded)

        return () => {
            audio.removeEventListener('timeupdate', updateTime)
            audio.removeEventListener('loadedmetadata', updateDuration)
            audio.removeEventListener('ended', handleEnded)
        }
    }, [])

    const togglePlay = () => {
        const audio = audioRef.current
        if (!audio) return

        if (isPlaying) {
            audio.pause()
        } else {
            audio.play()
        }
        setIsPlaying(!isPlaying)
    }

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        const audio = audioRef.current
        if (!audio) return

        const time = parseFloat(e.target.value)
        audio.currentTime = time
        setCurrentTime(time)
    }

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = Math.floor(seconds % 60)
        return `${mins}:${secs.toString().padStart(2, '0')}`
    }

    const progress = audioDuration > 0 ? (currentTime / audioDuration) * 100 : 0

    return (
        <div className={`flex items-center gap-3 min-w-[200px] ${isOwnMessage ? 'text-white' : theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
            }`}>
            <audio ref={audioRef} src={audioUrl} preload="metadata" />

            {/* Play/Pause Button */}
            <button
                onClick={togglePlay}
                className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all ${isOwnMessage
                        ? 'bg-white/20 hover:bg-white/30'
                        : theme === 'dark'
                            ? 'bg-white/10 hover:bg-white/20'
                            : 'bg-gray-200 hover:bg-gray-300'
                    }`}
            >
                {isPlaying ? (
                    <Pause className="w-5 h-5" fill="currentColor" />
                ) : (
                    <Play className="w-5 h-5 ml-0.5" fill="currentColor" />
                )}
            </button>

            {/* Waveform/Progress */}
            <div className="flex-1 flex flex-col gap-1">
                <div className="relative h-1 bg-white/20 rounded-full overflow-hidden">
                    <div
                        className={`absolute left-0 top-0 h-full rounded-full transition-all ${isOwnMessage ? 'bg-white' : 'bg-primary-mid'
                            }`}
                        style={{ width: `${progress}%` }}
                    />
                    <input
                        type="range"
                        min="0"
                        max={audioDuration}
                        value={currentTime}
                        onChange={handleSeek}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                </div>

                <div className="flex justify-between text-xs opacity-70">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(audioDuration)}</span>
                </div>
            </div>
        </div>
    )
}
