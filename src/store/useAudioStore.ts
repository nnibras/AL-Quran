import { create } from "zustand";

interface Track {
  src: string;
  fallbackSrc?: string;
  title: string;
  kind: "surah" | "ayah";
}

interface AudioState {
  track: Track | null;
  isPlaying: boolean;
  isLoading: boolean;
  error: string | null;
  currentTime: number;
  duration: number;
  audioEl: HTMLAudioElement | null;
  registerAudio: (el: HTMLAudioElement | null) => void;
  loadAndPlay: (track: Track) => void;
  toggle: () => void;
  pause: () => void;
  seek: (time: number) => void;
  setPlaying: (playing: boolean) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setProgress: (currentTime: number, duration: number) => void;
  usedFallback: boolean;
}

export const useAudioStore = create<AudioState>((set, get) => ({
  track: null,
  isPlaying: false,
  isLoading: false,
  error: null,
  currentTime: 0,
  duration: 0,
  audioEl: null,
  usedFallback: false,

  registerAudio: (el) => set({ audioEl: el }),

  loadAndPlay: (track) => {
    const { audioEl } = get();
    set({ track, error: null, isLoading: true, currentTime: 0, duration: 0, usedFallback: false });
    if (audioEl) {
      audioEl.src = track.src;
      audioEl.play().catch(() => set({ isLoading: false }));
    }
  },

  toggle: () => {
    const { audioEl, isPlaying, track } = get();
    if (!audioEl || !track) return;
    if (isPlaying) {
      audioEl.pause();
    } else {
      audioEl.play().catch(() => {});
    }
  },

  pause: () => {
    get().audioEl?.pause();
  },

  seek: (time) => {
    const { audioEl } = get();
    if (audioEl) audioEl.currentTime = time;
  },

  setPlaying: (playing) => set({ isPlaying: playing }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error, isLoading: false }),
  setProgress: (currentTime, duration) => set({ currentTime, duration }),
}));
