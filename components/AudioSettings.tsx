'use client'

import { useWeavStore } from '@/store/useWeavStore'
import { Volume2, VolumeX, Music, MousePointer2, Move, Mic } from 'lucide-react'
import { motion } from 'framer-motion'

export function AudioSettings() {
    const {
        theme,
        isMuted,
        volume,
        isBGMEnabled,
        isSFXEnabled,
        isHoverSFXEnabled,
        isClickSFXEnabled,
        isTransitionSFXEnabled,
        setMuted,
        setVolume,
        setBGMEnabled,
        setSFXEnabled,
        setHoverSFXEnabled,
        setClickSFXEnabled,
        setTransitionSFXEnabled,
    } = useWeavStore()

    const cardBase = `rounded-3xl border backdrop-blur-xl transition-colors ${theme === 'dark'
            ? 'bg-white/5 border-white/10'
            : 'bg-white/90 border-gray-200/80 shadow-lg'
        }`

    const labelClass = `text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
        }`

    const toggleClass = (enabled: boolean) => `
    relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-mid focus:ring-offset-2
    ${enabled ? 'bg-primary-mid' : theme === 'dark' ? 'bg-white/10' : 'bg-gray-200'}
  `

    const thumbClass = (enabled: boolean) => `
    inline-block h-4 w-4 transform rounded-full bg-white transition-transform
    ${enabled ? 'translate-x-6' : 'translate-x-1'}
  `

    const Toggle = ({
        label,
        checked,
        onChange,
        icon: Icon,
    }: {
        label: string
        checked: boolean
        onChange: (checked: boolean) => void
        icon?: any
    }) => (
        <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
                {Icon && (
                    <div className={`p-2 rounded-full ${theme === 'dark' ? 'bg-white/5 text-white/70' : 'bg-gray-100 text-gray-600'}`}>
                        <Icon className="w-4 h-4" />
                    </div>
                )}
                <span className={labelClass}>{label}</span>
            </div>
            <button
                type="button"
                className={toggleClass(checked)}
                onClick={() => onChange(!checked)}
                role="switch"
                aria-checked={checked}
            >
                <span className={thumbClass(checked)} />
            </button>
        </div>
    )

    return (
        <section className={`${cardBase} p-6 space-y-6`}>
            <div className="flex items-center justify-between">
                <div>
                    <h2
                        className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'
                            }`}
                    >
                        Audio Settings
                    </h2>
                    <p
                        className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                            }`}
                    >
                        Customize your sonic experience.
                    </p>
                </div>
                <button
                    onClick={() => setMuted(!isMuted)}
                    className={`p-2 rounded-full transition-colors ${theme === 'dark'
                            ? 'hover:bg-white/10 text-white/70'
                            : 'hover:bg-gray-100 text-gray-600'
                        }`}
                    title={isMuted ? 'Unmute' : 'Mute'}
                >
                    {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </button>
            </div>

            <div className="space-y-6">
                {/* Master Volume */}
                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <label className={labelClass}>Master Volume</label>
                        <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                            {Math.round(volume * 100)}%
                        </span>
                    </div>
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={volume}
                        onChange={(e) => setVolume(parseFloat(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-primary-mid"
                        disabled={isMuted}
                    />
                </div>

                <div className={`h-px w-full ${theme === 'dark' ? 'bg-white/10' : 'bg-gray-200'}`} />

                {/* Toggles */}
                <div className="space-y-1">
                    <Toggle
                        label="Background Music"
                        checked={isBGMEnabled}
                        onChange={setBGMEnabled}
                        icon={Music}
                    />

                    <Toggle
                        label="Sound Effects (Master)"
                        checked={isSFXEnabled}
                        onChange={setSFXEnabled}
                        icon={Volume2}
                    />

                    <motion.div
                        initial={false}
                        animate={{ height: isSFXEnabled ? 'auto' : 0, opacity: isSFXEnabled ? 1 : 0 }}
                        className="overflow-hidden pl-4 border-l-2 border-primary-mid/20 ml-4 space-y-1"
                    >
                        <Toggle
                            label="Hover Sounds"
                            checked={isHoverSFXEnabled}
                            onChange={setHoverSFXEnabled}
                            icon={MousePointer2}
                        />
                        <Toggle
                            label="Click Sounds"
                            checked={isClickSFXEnabled}
                            onChange={setClickSFXEnabled}
                            icon={MousePointer2}
                        />
                        <Toggle
                            label="Transition Sounds"
                            checked={isTransitionSFXEnabled}
                            onChange={setTransitionSFXEnabled}
                            icon={Move}
                        />
                    </motion.div>
                </div>
            </div>
        </section>
    )
}
