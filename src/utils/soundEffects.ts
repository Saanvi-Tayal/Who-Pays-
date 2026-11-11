import { Platform } from 'react-native';
import { createAudioPlayer, AudioPlayer } from 'expo-audio';
import { triggerHaptic } from './haptics';

import touchMp3 from '../../assets/sounds/touch.mp3';
import bombTickMp3 from '../../assets/sounds/bomb_tick.mp3';
import bombWarningMp3 from '../../assets/sounds/bomb_warning.mp3';
import bombExplosionMp3 from '../../assets/sounds/bomb_explosion.mp3';
import rouletteClickMp3 from '../../assets/sounds/roulette_click.mp3';
import fanfareMp3 from '../../assets/sounds/fanfare.mp3';

const SOUND_ASSETS = {
  touch: touchMp3,
  bombTick: bombTickMp3,
  bombWarning: bombWarningMp3,
  bombExplosion: bombExplosionMp3,
  rouletteClick: rouletteClickMp3,
  fanfare: fanfareMp3,
};

type SoundKey = keyof typeof SOUND_ASSETS;
const players: Partial<Record<SoundKey, AudioPlayer>> = {};

function playSoundAsset(key: SoundKey) {
  try {
    if (!players[key]) {
      players[key] = createAudioPlayer(SOUND_ASSETS[key]);
    }
    const player = players[key];
    if (player) {
      player.seekTo(0);
      player.play();
    }
  } catch {
    // Graceful fallback to synthetic or silent mode
  }
}

interface OscNode {
  type: string;
  frequency: {
    setValueAtTime(val: number, time: number): void;
    exponentialRampToValueAtTime(val: number, time: number): void;
    linearRampToValueAtTime(val: number, time: number): void;
  };
  connect(dest: unknown): void;
  start(time?: number): void;
  stop(time?: number): void;
}

interface GainNode {
  gain: {
    setValueAtTime(val: number, time: number): void;
    exponentialRampToValueAtTime(val: number, time: number): void;
  };
  connect(dest: unknown): void;
}

interface BiquadFilterNode {
  type: string;
  frequency: {
    setValueAtTime(val: number, time: number): void;
    exponentialRampToValueAtTime(val: number, time: number): void;
  };
  connect(dest: unknown): void;
}

interface BufferSourceNode {
  buffer: unknown;
  connect(dest: unknown): void;
  start(time?: number): void;
  stop(time?: number): void;
}

interface AudioBufferType {
  getChannelData(channel: number): Float32Array;
}

interface AudioContextLike {
  state: string;
  currentTime: number;
  sampleRate: number;
  destination: unknown;
  resume(): Promise<void>;
  createOscillator(): OscNode;
  createGain(): GainNode;
  createBiquadFilter(): BiquadFilterNode;
  createBufferSource(): BufferSourceNode;
  createBuffer(channels: number, length: number, sampleRate: number): AudioBufferType;
}

interface WindowWithAudio {
  AudioContext?: new () => AudioContextLike;
  webkitAudioContext?: new () => AudioContextLike;
}

// Browser Web Audio API Synthesizer fallback
class WebAudioSynth {
  private ctx: AudioContextLike | null = null;

  private getContext(): AudioContextLike | null {
    if (Platform.OS !== 'web') return null;
    try {
      const win = typeof window !== 'undefined' ? (window as unknown as WindowWithAudio) : null;
      if (!win) return null;
      const AudioCtx = win.AudioContext || win.webkitAudioContext;
      if (AudioCtx) {
        if (!this.ctx) {
          this.ctx = new AudioCtx();
        }
        if (this.ctx.state === 'suspended') {
          this.ctx.resume().catch(() => {
            // Audio context resume error ignored
          });
        }
        return this.ctx;
      }
    } catch {
      return null;
    }
    return null;
  }

  playTouchBlip() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(640, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(320, ctx.currentTime + 0.06);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.06);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.06);
    } catch {
      // Audio playback failure is non-fatal
    }
  }

  playBombTick() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      gain.gain.setValueAtTime(0.18, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.04);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.04);
    } catch {
      // Audio playback failure is non-fatal
    }
  }

  playBombWarning() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(950, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(1400, ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } catch {
      // Audio playback failure is non-fatal
    }
  }

  playBombExplosion() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const bufferSize = ctx.sampleRate * 0.45;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.45);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.8, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.45);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      noise.start();
      noise.stop(ctx.currentTime + 0.45);
    } catch {
      // Audio playback failure is non-fatal
    }
  }

  playRouletteClick() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(450, ctx.currentTime);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.03);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.03);
    } catch {
      // Audio playback failure is non-fatal
    }
  }

  playVerdictFanfare() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const notes = [440, 554, 659, 880];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const start = ctx.currentTime + idx * 0.1;
        osc.frequency.setValueAtTime(freq, start);
        gain.gain.setValueAtTime(0.2, start);
        gain.gain.exponentialRampToValueAtTime(0.01, start + 0.25);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + 0.25);
      });
    } catch {
      // Audio playback failure is non-fatal
    }
  }
}

const synth = new WebAudioSynth();

/**
 * Universal Sound Effects & Sensory Controller
 * - Plays user-provided .mp3 assets via expo-audio on Native & Web
 * - Features instant Web Audio synthesizer fallback
 * - Triggers synchronized haptic patterns across physical devices
 */
export async function playTouchSound(): Promise<void> {
  playSoundAsset('touch');
  synth.playTouchBlip();
  triggerHaptic('light');
}

export async function playBombTickSound(): Promise<void> {
  playSoundAsset('bombTick');
  synth.playBombTick();
  triggerHaptic('light');
}

export async function playBombWarningSound(): Promise<void> {
  playSoundAsset('bombWarning');
  synth.playBombWarning();
  triggerHaptic('medium');
}

export async function playBombExplosionSound(): Promise<void> {
  playSoundAsset('bombExplosion');
  synth.playBombExplosion();
  triggerHaptic('heavy');
}

export async function playRouletteClickSound(): Promise<void> {
  playSoundAsset('rouletteClick');
  synth.playRouletteClick();
  triggerHaptic('selection');
}

export async function playVerdictFanfareSound(): Promise<void> {
  playSoundAsset('fanfare');
  synth.playVerdictFanfare();
  triggerHaptic('success');
}
