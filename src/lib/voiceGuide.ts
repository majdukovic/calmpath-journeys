/**
 * Voice guidance for breathing exercises.
 * - Native (iOS/Android): uses @capacitor-community/text-to-speech (real device TTS)
 * - Web: falls back to Web Speech API
 *
 * Web Speech API is present in Android WebView but silently fails — native TTS
 * is the only reliable solution on device.
 */

import { Capacitor } from '@capacitor/core';

type Phase = 'inhale' | 'hold' | 'exhale' | 'holdAfter';

const phraseSets: Record<Phase, string[]> = {
  inhale: [
    'Breathe in',
    'In through your nose',
    'Gently inhale',
    'Draw breath in',
    'Breathe in slowly',
  ],
  hold: [
    'Hold',
    'Stay here',
    'Hold gently',
    'Pause',
    'Rest',
  ],
  exhale: [
    'Breathe out',
    'Let it all go',
    'Exhale slowly',
    'Release',
    'Out through your mouth',
  ],
  holdAfter: [
    'Pause',
    'Rest here',
    'Be still',
    'Stay',
    'Empty and calm',
  ],
};

const openingCues = [
  "Let's breathe together.",
  "Settle in. Here we go.",
  "Ready? Let's begin.",
  "Breathe with me.",
];

let phraseIndex = 0;
let hasSpoken = false;

const isNative = Capacitor.isNativePlatform();

// ─── Native TTS (iOS / Android) ───

async function nativeSpeak(text: string): Promise<void> {
  try {
    const { TextToSpeech } = await import('@capacitor-community/text-to-speech');
    await TextToSpeech.stop();
    await TextToSpeech.speak({
      text,
      lang: 'en-US',
      rate: 0.78,
      pitch: 0.95,
      volume: 1.0,
      category: 'ambient', // iOS: plays alongside other audio (ambient sounds)
    });
  } catch {
    // TTS is optional — swallow errors
  }
}

async function nativeStop(): Promise<void> {
  try {
    const { TextToSpeech } = await import('@capacitor-community/text-to-speech');
    await TextToSpeech.stop();
  } catch {}
}

// ─── Web Speech API fallback ───

let selectedVoice: SpeechSynthesisVoice | null = null;
let speakTimeoutId: ReturnType<typeof setTimeout> | null = null;

function findBestVoice(): SpeechSynthesisVoice | null {
  if (!('speechSynthesis' in window)) return null;
  const voices = speechSynthesis.getVoices();
  if (voices.length === 0) return null;
  const englishVoices = voices.filter(v => v.lang.startsWith('en'));
  const preferred = [
    'samantha', 'karen', 'moira', 'fiona', 'tessa',
    'google uk english female', 'microsoft zira', 'microsoft hazel',
    'female', 'woman',
  ];
  for (const pref of preferred) {
    const match = englishVoices.find(v => v.name.toLowerCase().includes(pref));
    if (match) return match;
  }
  return englishVoices[0] || voices[0] || null;
}

function webSpeak(text: string): void {
  if (!('speechSynthesis' in window) || !text) return;
  if (speakTimeoutId !== null) {
    clearTimeout(speakTimeoutId);
    speakTimeoutId = null;
  }
  speechSynthesis.cancel();
  speakTimeoutId = setTimeout(() => {
    speakTimeoutId = null;
    try {
      if (!selectedVoice) selectedVoice = findBestVoice();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.78;
      utterance.pitch = 0.95;
      utterance.volume = 0.9;
      if (selectedVoice) utterance.voice = selectedVoice;
      speechSynthesis.speak(utterance);
    } catch {}
  }, 120);
}

function webStop(): void {
  if (speakTimeoutId !== null) {
    clearTimeout(speakTimeoutId);
    speakTimeoutId = null;
  }
  if ('speechSynthesis' in window) {
    speechSynthesis.cancel();
  }
}

// ─── Public API ───

function speak(text: string): void {
  if (isNative) {
    nativeSpeak(text);
  } else {
    webSpeak(text);
  }
}

/** Initialize voice selection — call on component mount */
export function initVoiceGuide(): void {
  if (isNative) return; // Native TTS needs no init
  if (!('speechSynthesis' in window)) return;
  const tryLoad = () => {
    const voice = findBestVoice();
    if (voice) selectedVoice = voice;
  };
  if (speechSynthesis.getVoices().length > 0) {
    tryLoad();
  } else {
    speechSynthesis.addEventListener('voiceschanged', tryLoad, { once: true });
    setTimeout(tryLoad, 500);
    setTimeout(tryLoad, 2000);
  }
}

/** Speak the opening cue (once per session) */
export function speakOpening(): void {
  if (hasSpoken) return;
  hasSpoken = true;
  const cue = openingCues[Math.floor(Math.random() * openingCues.length)];
  speak(cue);
}

/** Speak a breathing phase cue — rotates for variety */
export function speakPhase(phase: Phase, cycle: number): void {
  const phrases = phraseSets[phase];
  const index = (cycle + phraseIndex) % phrases.length;
  speak(phrases[index]);
  if (phase === 'inhale') {
    phraseIndex = (phraseIndex + 1) % phrases.length;
  }
}

/** Stop any ongoing speech */
export function stopVoiceGuide(): void {
  if (isNative) {
    nativeStop();
  } else {
    webStop();
  }
  hasSpoken = false;
  phraseIndex = 0;
}

/** Check if voice guidance is available */
export function isVoiceAvailable(): boolean {
  if (isNative) return true; // Native TTS always available
  return 'speechSynthesis' in window;
}
