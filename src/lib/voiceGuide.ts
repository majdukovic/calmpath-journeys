/**
 * Voice guidance for breathing exercises using Web Speech API.
 * Warm, soothing cues inspired by Calm & Headspace guided sessions.
 * Works offline, no API key needed.
 */

type Phase = 'inhale' | 'hold' | 'exhale' | 'holdAfter';

// Short, warm phrases inspired by Headspace and Calm — kept brief so they
// finish speaking before the phase timer ends.
const phraseSets: Record<Phase, string[]> = {
  inhale: [
    'Breathe in...',
    'In through your nose',
    'Gently inhale',
    'Draw breath in',
    'Breathe in slowly',
  ],
  hold: [
    'Hold...',
    'Stay here',
    'Hold gently',
    'Pause',
    'Rest',
  ],
  exhale: [
    'Breathe out...',
    'Let it all go',
    'Exhale slowly',
    'Release',
    'Out through your mouth',
  ],
  holdAfter: [
    'Pause...',
    'Rest here',
    'Be still',
    'Stay',
    'Empty and calm',
  ],
};

// Opening cues — kept short (≤5 words) so they finish before the first inhale cue fires
const openingCues = [
  "Let's breathe together.",
  "Settle in. Here we go.",
  "Ready? Let's begin.",
  "Take a breath. Let's start.",
  "Breathe with me.",
];

let phraseIndex = 0;
let hasSpoken = false;
let selectedVoice: SpeechSynthesisVoice | null = null;
let speakTimeoutId: ReturnType<typeof setTimeout> | null = null;

/**
 * Try to find the best available female English voice.
 * Prioritizes: Samantha (Apple), Karen, Google UK Female, Zira, then any English voice.
 */
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

/** Initialize voice selection — call early (e.g. on mount) */
export function initVoiceGuide(): void {
  if (!('speechSynthesis' in window)) return;

  const tryLoad = () => {
    const voice = findBestVoice();
    if (voice) selectedVoice = voice;
  };

  if (speechSynthesis.getVoices().length > 0) {
    tryLoad();
  } else {
    speechSynthesis.addEventListener('voiceschanged', tryLoad, { once: true });
    // Fallback: some WebView environments never fire voiceschanged
    setTimeout(tryLoad, 500);
    setTimeout(tryLoad, 2000);
  }
}

/**
 * Speak a phrase with soothing parameters.
 *
 * IMPORTANT: On Chrome and Android WebView there is a known bug where calling
 * speechSynthesis.speak() immediately after cancel() silently fails. The fix
 * is a short setTimeout between cancel and the next speak call.
 */
function speak(text: string): void {
  if (!('speechSynthesis' in window) || !text) return;

  // Clear any pending scheduled speech
  if (speakTimeoutId !== null) {
    clearTimeout(speakTimeoutId);
    speakTimeoutId = null;
  }

  speechSynthesis.cancel();

  // Delay after cancel to avoid the silent-fail race condition on Chrome/Android
  speakTimeoutId = setTimeout(() => {
    speakTimeoutId = null;
    try {
      // Re-try voice selection if we still don't have one
      if (!selectedVoice) selectedVoice = findBestVoice();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.78;   // Slow and calming
      utterance.pitch = 0.95;  // Slightly lower for warmth
      utterance.volume = 0.9;

      if (selectedVoice) utterance.voice = selectedVoice;

      speechSynthesis.speak(utterance);
    } catch {
      // Voice guide is optional — swallow errors silently
    }
  }, 120);
}

/** Speak the opening cue (first time only per session) */
export function speakOpening(): void {
  if (hasSpoken) return;
  hasSpoken = true;
  const cue = openingCues[Math.floor(Math.random() * openingCues.length)];
  speak(cue);
}

/** Speak a phase cue — rotates phrases for variety */
export function speakPhase(phase: Phase, cycle: number): void {
  const phrases = phraseSets[phase];
  const index = (cycle + phraseIndex) % phrases.length;
  speak(phrases[index]);

  // Advance rotation index each cycle
  if (phase === 'inhale') {
    phraseIndex = (phraseIndex + 1) % phrases.length;
  }
}

/** Stop any ongoing speech */
export function stopVoiceGuide(): void {
  if (speakTimeoutId !== null) {
    clearTimeout(speakTimeoutId);
    speakTimeoutId = null;
  }
  if ('speechSynthesis' in window) {
    speechSynthesis.cancel();
  }
  hasSpoken = false;
  phraseIndex = 0;
}

/** Check if voice synthesis is available */
export function isVoiceAvailable(): boolean {
  return 'speechSynthesis' in window;
}
