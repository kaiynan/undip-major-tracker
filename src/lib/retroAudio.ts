'use client';

// Retro Web Audio Synthesizer
// Provides zero-asset, zero-latency authentic retro sounds (chimes, bleeps, fanfare)

class RetroAudioEngine {
  private ctx: AudioContext | null = null;
  private muted: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('undip_retro_audio_muted');
        this.muted = saved === 'true';
      } catch {
        this.muted = false;
      }

      // Unlock mobile Web Audio on first touch/click/pointer/key
      const unlockAudio = () => {
        if (this.ctx && this.ctx.state === 'suspended') {
          this.ctx.resume().catch(() => {});
        }
        window.removeEventListener('touchstart', unlockAudio);
        window.removeEventListener('pointerdown', unlockAudio);
        window.removeEventListener('click', unlockAudio);
        window.removeEventListener('keydown', unlockAudio);
      };
      window.addEventListener('touchstart', unlockAudio, { passive: true });
      window.addEventListener('pointerdown', unlockAudio, { passive: true });
      window.addEventListener('click', unlockAudio, { passive: true });
      window.addEventListener('keydown', unlockAudio, { passive: true });
    }
  }

  private initContext() {
    if (typeof window === 'undefined') return null;
    try {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
    } catch {
      return null;
    }
    return this.ctx;
  }

  public isMuted(): boolean {
    return this.muted;
  }

  public setMuted(muted: boolean) {
    this.muted = muted;
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('undip_retro_audio_muted', muted ? 'true' : 'false');
      } catch {
        // Sandboxed WebView safe
      }
    }
  }

  public toggleMute(): boolean {
    this.setMuted(!this.muted);
    return this.muted;
  }

  public async resumeContext(): Promise<boolean> {
    const ctx = this.initContext();
    if (!ctx) return false;
    if (ctx.state === 'suspended') {
      try {
        await ctx.resume();
        return (ctx.state as string) === 'running';
      } catch {
        return false;
      }
    }
    return ctx.state === 'running';
  }

  // Loading tick: very short square-wave blip, pitch rising slightly with progress
  public playLoadingTick(progress: number) {
    if (this.muted) return;
    const ctx = this.initContext();
    if (!ctx || ctx.state === 'suspended') return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      // Pitch rising slightly with progress: 420 Hz at 0% to 640 Hz at 100%
      const clamped = Math.max(0, Math.min(100, progress));
      const freq = 420 + (clamped / 100) * 220;
      const t = ctx.currentTime;
      osc.frequency.setValueAtTime(freq, t);

      // Very short blip (duration 0.03s), low volume (peak gain <= 0.05)
      gain.gain.setValueAtTime(0.035, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.03);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(t);
      osc.stop(t + 0.03);
    } catch {
      // Audio context blocked / suspended safe fallback
    }
  }

  // Loading complete: short rising 3-note chime when the bar reaches 100%
  public playLoadingComplete() {
    if (this.muted) return;
    const ctx = this.initContext();
    if (!ctx || ctx.state === 'suspended') return;

    try {
      const notes = [587.33, 739.99, 880.0]; // D5, F#5, A5
      const baseTime = ctx.currentTime;

      notes.forEach((freq, idx) => {
        const noteStart = baseTime + idx * 0.06;
        const noteDuration = idx === notes.length - 1 ? 0.2 : 0.07;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(freq, noteStart);

        // Peak gain <= 0.05
        gain.gain.setValueAtTime(0.04, noteStart);
        gain.gain.exponentialRampToValueAtTime(0.001, noteStart + noteDuration);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(noteStart);
        osc.stop(noteStart + noteDuration);
      });
    } catch {
      // Safe fallback
    }
  }

  // Quick 8-bit blip (hover or small button click)
  public playBlip(freq = 440) {
    if (this.muted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, ctx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch {
      // Audio context not allowed yet
    }
  }

  // Coin / select confirmation chime
  public playSelect() {
    if (this.muted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    try {
      const t = ctx.currentTime;
      // High chime: E6 to B6
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'square';
      osc1.frequency.setValueAtTime(1318.51, t); // E6
      gain1.gain.setValueAtTime(0.06, t);
      gain1.gain.exponentialRampToValueAtTime(0.001, t + 0.12);

      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'square';
      osc2.frequency.setValueAtTime(1975.53, t + 0.08); // B6
      gain2.gain.setValueAtTime(0.06, t + 0.08);
      gain2.gain.exponentialRampToValueAtTime(0.001, t + 0.28);

      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);

      osc1.start(t);
      osc1.stop(t + 0.12);
      osc2.start(t + 0.08);
      osc2.stop(t + 0.28);
    } catch {
      // Safe fallback
    }
  }

  // PRESS TO PLAY Start Game Fanfare (SNES / Mega Drive level start)
  public playStartGame() {
    if (this.muted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    try {
      const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51]; // C5, E5, G5, C6, E6
      const baseTime = ctx.currentTime;

      notes.forEach((freq, idx) => {
        const noteStart = baseTime + idx * 0.07;
        const noteDuration = idx === notes.length - 1 ? 0.4 : 0.08;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = idx === notes.length - 1 ? 'triangle' : 'square';
        osc.frequency.setValueAtTime(freq, noteStart);

        gain.gain.setValueAtTime(0.08, noteStart);
        gain.gain.exponentialRampToValueAtTime(0.001, noteStart + noteDuration);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(noteStart);
        osc.stop(noteStart + noteDuration);
      });
    } catch {
      // Safe fallback
    }
  }

  // Fast Travel / Warp sound effect
  public playWarp() {
    if (this.muted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      const t = ctx.currentTime;
      osc.frequency.setValueAtTime(220, t);
      osc.frequency.exponentialRampToValueAtTime(880, t + 0.2);

      gain.gain.setValueAtTime(0.05, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(t);
      osc.stop(t + 0.22);
    } catch {
      // Safe fallback
    }
  }

  // Level up / Questionnaire complete victory fanfare
  public playLevelUp() {
    this.playStartGame();
  }
}

export const retroAudio = new RetroAudioEngine();
