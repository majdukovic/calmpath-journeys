// Audio player for guided meditations
// Uses HTML5 Audio API which works in Capacitor WebView

export interface AudioPlayerState {
  playing: boolean;
  currentTime: number;
  duration: number;
  loading: boolean;
  error: string | null;
}

type StateListener = (state: AudioPlayerState) => void;

class MeditationAudioPlayer {
  private audio: HTMLAudioElement | null = null;
  private listeners: Set<StateListener> = new Set();
  private updateInterval: ReturnType<typeof setInterval> | null = null;

  private state: AudioPlayerState = {
    playing: false,
    currentTime: 0,
    duration: 0,
    loading: false,
    error: null,
  };

  subscribe(listener: StateListener): () => void {
    this.listeners.add(listener);
    listener(this.state);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach(l => l({ ...this.state }));
  }

  async load(src: string): Promise<void> {
    this.cleanup();

    this.state = { playing: false, currentTime: 0, duration: 0, loading: true, error: null };
    this.notify();

    const audio = new Audio(src);
    this.audio = audio;

    return new Promise((resolve, reject) => {
      audio.addEventListener('loadedmetadata', () => {
        this.state.duration = audio.duration;
        this.state.loading = false;
        this.notify();
        resolve();
      }, { once: true });

      audio.addEventListener('error', () => {
        this.state.loading = false;
        this.state.error = 'Failed to load audio';
        this.notify();
        reject(new Error('Failed to load audio'));
      }, { once: true });

      audio.addEventListener('ended', () => {
        this.state.playing = false;
        this.state.currentTime = this.state.duration;
        this.stopUpdates();
        this.notify();
      });

      audio.load();
    });
  }

  play(): void {
    if (!this.audio) return;
    this.audio.play().then(() => {
      this.state.playing = true;
      this.notify();
      this.startUpdates();
    }).catch(() => {
      this.state.error = 'Playback failed';
      this.notify();
    });
  }

  pause(): void {
    if (!this.audio) return;
    this.audio.pause();
    this.state.playing = false;
    this.stopUpdates();
    this.notify();
  }

  toggle(): void {
    if (this.state.playing) {
      this.pause();
    } else {
      this.play();
    }
  }

  seek(time: number): void {
    if (!this.audio) return;
    this.audio.currentTime = Math.max(0, Math.min(time, this.state.duration));
    this.state.currentTime = this.audio.currentTime;
    this.notify();
  }

  skip(delta: number): void {
    if (!this.audio) return;
    this.seek(this.audio.currentTime + delta);
  }

  setVolume(volume: number): void {
    if (!this.audio) return;
    this.audio.volume = Math.max(0, Math.min(1, volume));
  }

  getState(): AudioPlayerState {
    return { ...this.state };
  }

  cleanup(): void {
    this.stopUpdates();
    if (this.audio) {
      this.audio.pause();
      this.audio.src = '';
      this.audio = null;
    }
    this.state = { playing: false, currentTime: 0, duration: 0, loading: false, error: null };
  }

  private startUpdates(): void {
    this.stopUpdates();
    this.updateInterval = setInterval(() => {
      if (this.audio) {
        this.state.currentTime = this.audio.currentTime;
        this.notify();
      }
    }, 250);
  }

  private stopUpdates(): void {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
  }
}

// Singleton instance
export const meditationPlayer = new MeditationAudioPlayer();
