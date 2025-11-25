import { Howl, Howler } from 'howler'

class SoundManager {
    private bgm: Howl | null = null
    private sfx: Map<string, Howl> = new Map()
    private isMuted: boolean = false
    private volume: number = 0.5

    // Granular settings
    private isBGMEnabled: boolean = true
    private isSFXEnabled: boolean = true
    private isHoverSFXEnabled: boolean = true
    private isClickSFXEnabled: boolean = true
    private isTransitionSFXEnabled: boolean = true

    constructor() {
        // Initialize with default settings
    }

    init() {
        // Preload common SFX
        this.loadSFX('hover', '/sounds/hover.mp3')
        this.loadSFX('click', '/sounds/click.mp3')
        this.loadSFX('transition', '/sounds/transition.wav')
    }

    loadSFX(key: string, src: string) {
        const sound = new Howl({
            src: [src],
            volume: this.volume,
            preload: true,
        })
        this.sfx.set(key, sound)
    }

    playBGM(src: string | string[], volume: number = 0.3) {
        if (this.bgm) {
            this.bgm.stop()
            this.bgm.unload()
        }

        console.log('Initializing BGM with src:', src)
        this.bgm = new Howl({
            src: Array.isArray(src) ? src : [src],
            html5: true, // Force HTML5 Audio for large files (BGM)
            loop: true,
            volume: this.isMuted || !this.isBGMEnabled ? 0 : volume,
            autoplay: true,
            onload: () => console.log('BGM loaded successfully'),
            onloaderror: (id, err) => console.error('BGM load error:', id, err),
            onplay: () => console.log('BGM started playing'),
            onplayerror: (id, err) => console.error('BGM play error:', id, err),
        })
    }

    stopBGM() {
        if (this.bgm) {
            this.bgm.stop()
        }
    }

    resumeBGM() {
        if (this.bgm && !this.bgm.playing()) {
            this.bgm.play()
        }
    }

    playSFX(key: string, volume: number = 0.5) {
        if (this.isMuted || !this.isSFXEnabled) return

        // Check specific SFX types
        if (key === 'hover' && !this.isHoverSFXEnabled) return
        if (key === 'click' && !this.isClickSFXEnabled) return
        if (key === 'transition' && !this.isTransitionSFXEnabled) return

        const sound = this.sfx.get(key)
        if (sound) {
            sound.volume(volume)
            sound.play()
        } else {
            console.warn(`SFX ${key} not found`)
        }
    }

    setVolume(volume: number) {
        this.volume = volume
        Howler.volume(volume)
    }

    toggleMute(muted: boolean) {
        this.isMuted = muted
        Howler.mute(muted)
    }

    setBGMEnabled(enabled: boolean) {
        this.isBGMEnabled = enabled
        if (this.bgm) {
            if (enabled) {
                if (!this.isMuted) {
                    this.bgm.mute(false)
                    this.bgm.fade(0, this.volume, 1000)
                }
            } else {
                // Fade out then mute
                this.bgm.fade(this.bgm.volume(), 0, 1000)
                setTimeout(() => {
                    if (!this.isBGMEnabled && this.bgm) {
                        this.bgm.mute(true)
                    }
                }, 1000)
            }
        }
    }

    setSFXEnabled(enabled: boolean) {
        this.isSFXEnabled = enabled
    }

    setHoverSFXEnabled(enabled: boolean) {
        this.isHoverSFXEnabled = enabled
    }

    setClickSFXEnabled(enabled: boolean) {
        this.isClickSFXEnabled = enabled
    }

    setTransitionSFXEnabled(enabled: boolean) {
        this.isTransitionSFXEnabled = enabled
    }
}

export const soundManager = new SoundManager()
