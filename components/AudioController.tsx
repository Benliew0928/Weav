'use client'

import { useEffect, useRef } from 'react'
import { useWeavStore } from '@/store/useWeavStore'
import { soundManager } from '@/lib/audio'

export function AudioController() {
    const {
        isMuted,
        volume,
        isBGMEnabled,
        isSFXEnabled,
        isHoverSFXEnabled,
        isClickSFXEnabled,
        isTransitionSFXEnabled,
    } = useWeavStore()
    const initialized = useRef(false)

    useEffect(() => {
        if (!initialized.current) {
            soundManager.init()
            // Placeholder BGM - a soft ambient track
            soundManager.playBGM('/sounds/bgm.mp3', 0.2)
            initialized.current = true
        }
    }, [])

    useEffect(() => {
        soundManager.toggleMute(isMuted)
    }, [isMuted])

    useEffect(() => {
        soundManager.setVolume(volume)
    }, [volume])

    useEffect(() => {
        soundManager.setBGMEnabled(isBGMEnabled)
    }, [isBGMEnabled])

    useEffect(() => {
        soundManager.setSFXEnabled(isSFXEnabled)
    }, [isSFXEnabled])

    useEffect(() => {
        soundManager.setHoverSFXEnabled(isHoverSFXEnabled)
    }, [isHoverSFXEnabled])

    useEffect(() => {
        soundManager.setClickSFXEnabled(isClickSFXEnabled)
    }, [isClickSFXEnabled])

    useEffect(() => {
        soundManager.setTransitionSFXEnabled(isTransitionSFXEnabled)
    }, [isTransitionSFXEnabled])

    return null // This component is headless
}
