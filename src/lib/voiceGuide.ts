/**
 * Voice guidance for breathing exercises using Web Speech API.
 * Warm, soothing cues inspired by Calm & Headspace guided sessions.
 * Works offline, no API key needed.
 */

type Phase = 'inhale' | 'hold' | 'exhale' | 'holdAfter';

// Varied cues so it doesn't feel robotic — rotates each cycle
const phraseSets: Record<Phase, string[]> = {
  inhale: [
    'Breathe in, slowly',
    'Gently inhale',
    'Fill your lungs, slowly',
    'Draw in a deep breath',
    'Breathe in through your nose',
  ],
  hold: [
    'Hold, gently',
    'Softly hold',
    'Stay here',
    'Keep holding',
    'Rest in stillness',
  ],
  exhale: [
    'Now, let it go',
    'Slowly release',
    'Breathe out, gently',
    'Let everything go',
    'Exhale, slowly and softly',
  ],
  holdAfter: [
    'Rest here',
    'Be still',
    'Pause gently',
    'Empty and calm',
    'Stay in the quiet',
  ],
};

// Opening cues for the very first breath
const openingCues = [
  'Let your body relax. We\'ll begin.',
  'Close your eyes if you\'d like. Let\'s start.',
  'Find a comfortable position. Here we go.',
];

let phraseIndex = 0;
let hasSpoken = false;
let selectedVoice: SpeechSynthesisVoice | null = null;
let voiceReady = false;

/**
 * Try to find the best available female English voice.
 * Prioritizes: Samantha (Apple), Google UK Female, Microsoft Zira, then any female English voice.
 */
function findBestVoice(): SpeechSynthesisVoice | null {
  if (!('speechSynthesis' in window)) return null;

  const voices = speechSynthesis.getVoices();
  if (voices.length === 0) return null;

  const englishVoices = voices.filter(v => v.lang.startsWith('en'));

  // Priority order for warm, soothing voices
  const preferred = [
    'samantha', 'karen', 'moira', 'fiona', 'tessa',
    'google uk english female', 'microsoft zira', 'microsoft hazel',
    'female', 'woman',
  ];

  for (const pref of preferred) {
    const match = englishVoices.find(v => v.name.toLowerCase().includes(pref));
    if (match) return match;
  }

  // Fall back to first English voice
  return englishVoices[0] || voices[0] || null;
}

/** Initialize voice selection — call early (e.g. on mount) */
export function initVoiceGuide(): void {
  if (!('speechSynthesis' in window)) return;

  const tryLoad = () => {
    selectedVoice = findBestVoice();
    if (selectedVoice) voiceReady = true;
  };

  // Voices may load async
  if (speechSynthesis.getVoices().length > 0) {
    tryLoad();
  } else {
    speechSynthesis.addEventListener('voiceschanged', tryLoad, { once: true });
  }
}

/** Speak a phrase with soothing parameters */
function speak(text: string): void {
  if (!('speechSynthesis' in window)) return;

  // Cancel any ongoing speech
  speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.78; // Slow and calming
  utterance.pitch = 0.95; // Slightly lower for warmth
  utterance.volume = 0.85; // Not too loud

  if (selectedVoice) {
    utterance.voice = selectedVoice;
  }

  speechSynthesis.speak(utterance);
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
  // Use cycle to vary phrase selection
  const index = (cycle + phraseIndex) % phrases.length;
  speak(phrases[index]);

  // Advance index every full rotation
  if (phase === 'inhale') {
    phraseIndex = (phraseIndex + 1) % phrases.length;
  }
}

/** Stop any ongoing speech */
export function stopVoiceGuide(): void {
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
