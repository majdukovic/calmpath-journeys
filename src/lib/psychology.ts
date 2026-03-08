// Neuroscience-backed reward and reflection systems
// Based on: Atomic Habits (cue-craving-response-reward), Dr. Jud Brewer's habit loop mapping,
// variable reward schedules (serotonin/dopamine), and compassionate identity reinforcement.

// ─── VARIABLE REWARDS ───
// These rotate unpredictably to maintain dopamine anticipation without anxiety.
// Key insight: the ANTICIPATION of reward releases more dopamine than the reward itself.
// For anxious users, rewards must feel warm and earned, never gamified or pressuring.

/** Surprise garden discoveries — shown randomly after sessions */
export const gardenDiscoveries = [
  { emoji: '🐝', message: 'A little bee found your garden today!' },
  { emoji: '🌙', message: 'Moonflowers bloomed while you were breathing.' },
  { emoji: '🐞', message: 'A ladybug landed in your garden — good luck!' },
  { emoji: '🍃', message: 'A gentle breeze stirred the leaves in your garden.' },
  { emoji: '🌅', message: 'The sunset painted your garden gold tonight.' },
  { emoji: '🦔', message: 'A tiny hedgehog is napping under your oak tree.' },
  { emoji: '🪺', message: 'A bird built a small nest in your garden.' },
  { emoji: '🌻', message: 'A wild sunflower appeared at the edge of your garden.' },
  { emoji: '🫧', message: 'Morning dew is sparkling on your garden leaves.' },
  { emoji: '🌾', message: 'The tall grass in your garden is swaying gently.' },
  { emoji: '🦋', message: 'A monarch butterfly is visiting your flowers.' },
  { emoji: '✨', message: 'Your garden has a soft glow today — it\'s thriving.' },
];

/** Get a discovery with ~30% probability (variable ratio schedule) */
export function maybeGetDiscovery(): typeof gardenDiscoveries[number] | null {
  // Variable ratio: roughly 1 in 3 sessions triggers a discovery
  // Use time-based seed so it's consistent within the same session
  const seed = Math.floor(Date.now() / 60000); // changes every minute
  const roll = (seed * 7919) % 100; // pseudo-random based on prime
  if (roll < 30) {
    return gardenDiscoveries[seed % gardenDiscoveries.length];
  }
  return null;
}

// ─── IDENTITY-REINFORCING COMPLETION MESSAGES ───
// Based on Atomic Habits Ch. 2: "Every action is a vote for the type of person you wish to become"
// These build identity ("I am someone who takes care of myself") not metrics ("I did 7 sessions")
// Triggers serotonin through self-worth, not dopamine through scores

export const identityMessages = [
  "You're someone who shows up for yourself. That's rare and beautiful.",
  "You chose calm today. That says a lot about who you are.",
  "You just proved that you can slow down when the world speeds up.",
  "Not everyone pauses to breathe. You do. That matters.",
  "You're building something no one can take from you — inner peace.",
  "Every time you do this, you become a little more you.",
  "This is what self-compassion looks like in action.",
  "The person you were yesterday would be proud of you right now.",
  "You're not just managing — you're growing.",
  "You chose presence over panic. That's your superpower.",
  "You're teaching your nervous system that you're safe. That's real.",
  "Today you chose yourself. Tomorrow, it'll be a little easier.",
  "You're becoming someone who meets hard moments with softness.",
  "You didn't run from your feelings. You sat with them. That takes courage.",
  "You're rewriting the story your anxiety tells you.",
];

export function getIdentityMessage(): string {
  // Rotate based on current hour so it feels fresh each session
  const idx = (Date.now() % (identityMessages.length * 3600000)) / 3600000;
  return identityMessages[Math.floor(idx) % identityMessages.length];
}

// ─── CURIOSITY-BASED REFLECTION PROMPTS ───
// Based on Dr. Jud Brewer's "Gear 1" habit loop mapping.
// These help users observe their anxiety patterns with curiosity, not judgment.
// The goal is to activate the prefrontal cortex GENTLY — curiosity deactivates the amygdala.
// Key: never ask "why" (triggers rumination). Ask "what" and "how" (triggers curiosity).

export const curiosityPrompts = [
  "What does your body feel like right now? Just notice, no need to change anything.",
  "Where do you feel the most relaxed in your body right now?",
  "How does your breathing feel compared to when you started?",
  "What sensation surprised you during the breathing exercise?",
  "What was on your mind before you opened the app?",
  "Did any thoughts come and go during the breathing? What did you notice?",
  "What usually happens right before you feel anxious? Just curious.",
  "When your mind wandered, where did it go? No judgment — just noticing.",
  "How does this moment feel different from 3 minutes ago?",
  "What does calm actually feel like for you? Describe it in one word.",
  "Is there something you were worried about that feels smaller now?",
  "What would tomorrow-you say about this moment?",
  "If calm was a place, what would it look like for you?",
  "What is one tiny thing you could do today that future-you would thank you for?",
];

export function getCuriosityPrompt(): string {
  const seed = Math.floor(Date.now() / 86400000); // daily rotation
  return curiosityPrompts[seed % curiosityPrompts.length];
}

// ─── HABIT STACKING CONTEXT CUES ───
// Atomic Habits Ch. 5: "The most effective way to build a new habit is to attach it
// to an existing one." We map the app to the user's natural daily rhythms.
// These contextual suggestions tie calming activities to things users already do.

export interface ContextCue {
  emoji: string;
  suggestion: string;
  action?: string; // optional CTA
}

export function getContextCue(): ContextCue {
  const hour = new Date().getHours();

  // Early morning (5-8): attach to waking ritual
  if (hour >= 5 && hour < 8) {
    const cues: ContextCue[] = [
      { emoji: '☀️', suggestion: 'Before you check your phone — how about 3 gentle breaths?', action: 'Start breathing' },
      { emoji: '🫖', suggestion: 'While your coffee brews, a quick moment of calm?', action: 'Start breathing' },
      { emoji: '🌅', suggestion: 'The morning is fresh. Set one gentle intention for today.', action: 'Start your calm' },
    ];
    return cues[Math.floor(Date.now() / 86400000) % cues.length];
  }

  // Mid-morning (8-12): attach to work start
  if (hour >= 8 && hour < 12) {
    const cues: ContextCue[] = [
      { emoji: '🧘', suggestion: 'Between tasks? A 3-minute reset can sharpen your focus.' , action: 'Quick reset' },
      { emoji: '💧', suggestion: 'Grab some water, stretch, and take one deep breath.' },
      { emoji: '🌿', suggestion: 'A tiny pause now can change how the rest of your day feels.', action: 'Start your calm' },
    ];
    return cues[Math.floor(Date.now() / 86400000) % cues.length];
  }

  // Afternoon (12-17): attach to post-lunch
  if (hour >= 12 && hour < 17) {
    const cues: ContextCue[] = [
      { emoji: '🌤', suggestion: 'Afternoon check-in: how are you feeling right now?' },
      { emoji: '🍃', suggestion: 'The afternoon can be heavy. A few breaths might lighten it.', action: 'Breathe with me' },
      { emoji: '☁️', suggestion: 'If your energy is dipping — that\'s okay. Rest is productive too.' },
    ];
    return cues[Math.floor(Date.now() / 86400000) % cues.length];
  }

  // Evening (17-21): attach to wind-down
  if (hour >= 17 && hour < 21) {
    const cues: ContextCue[] = [
      { emoji: '🌇', suggestion: 'The day is winding down. What went well today?', action: 'Reflect' },
      { emoji: '🧸', suggestion: 'Evening is for softness. You earned it.', action: 'Start your calm' },
      { emoji: '🌙', suggestion: 'Before screen time takes over — a quick calm moment?', action: 'Start breathing' },
    ];
    return cues[Math.floor(Date.now() / 86400000) % cues.length];
  }

  // Night (21-5): attach to bedtime
  const cues: ContextCue[] = [
    { emoji: '🌙', suggestion: 'Can\'t sleep? That\'s okay. Let\'s breathe together.', action: 'Start breathing' },
    { emoji: '🌌', suggestion: 'The night is quiet. Your mind can be too.', action: 'Start your calm' },
    { emoji: '💫', suggestion: 'Tomorrow is a fresh page. Tonight, just rest.' },
  ];
  return cues[Math.floor(Date.now() / 86400000) % cues.length];
}
