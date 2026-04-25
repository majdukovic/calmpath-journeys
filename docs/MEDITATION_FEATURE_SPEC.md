# Guided Meditation Feature — Product & Technical Spec

## Overview

Add **Guided Meditations** as a premium feature in Breeze, offering pre-generated AI voice narrations for various meditation styles. Users choose a meditation based on their current state (mood, time of day, intention), and a soothing AI voice guides them through the entire session.

---

## 1. Voice Generation Strategy

### Approach: One-Time Pre-Generation with ElevenLabs

All audio files are pre-generated using ElevenLabs API, exported as MP3s, and bundled/hosted — **zero runtime API cost**.

### ElevenLabs API Workflow

```
1. POST /v1/text-to-voice/design → Generate voice previews from description
2. POST /v1/text-to-voice/create  → Save preferred voice to library (permanent)
3. POST /v1/text-to-speech/{voice_id} → Generate audio for each meditation script
4. Download MP3 files → Host on CDN or bundle in app
```

### Voice Design API

**Endpoint:** `POST https://api.elevenlabs.io/v1/text-to-voice/design`

Key parameters:
- `voice_description` — Natural language: "A warm, gentle woman in her 30s with a soft British accent, speaking slowly and soothingly as if guiding a meditation"
- `model_id` — `eleven_multilingual_ttv_v2` (stable for long-form) or `eleven_ttv_v3` (most expressive)
- `guidance_scale` — 3-5 for natural sound (higher = more literal but potentially artificial)
- `text` — Preview text (100-1000 chars) to audition the voice

### TTS API

**Endpoint:** `POST https://api.elevenlabs.io/v1/text-to-speech/{voice_id}`

- Output: MP3 at 44.1kHz (high quality) or 22.05kHz (smaller files)
- Max 10,000 chars per request (Multilingual v2) — split longer scripts into chunks
- Voice settings: `stability` (0.7-0.85 for meditation), `similarity_boost`, `style`

### Cost Estimate

| Plan | Price | Characters | Audio Duration | Enough for... |
|------|-------|-----------|----------------|---------------|
| Starter | $5/mo | 30,000 | ~30 min | 3-4 meditations |
| Creator | $11/mo | 100,000 | ~100 min | 10-12 meditations |
| Pro | $49/mo | 500,000 | ~500 min | Full library |

**Estimated need for v1 (5 meditations × 2 voices = 10 audio files):**
- ~5,000 chars per meditation script × 10 = 50,000 characters
- **Creator plan ($11) for 1 month** is sufficient
- Total one-time cost: ~$11

---

## 2. Voice Profiles

### Voice A: "Luna" — Calm Female

```
Description: "A warm, gentle woman in her early 30s with a soft, nurturing voice.
She speaks slowly and deliberately, with natural pauses between phrases.
Her tone is intimate and soothing, like a trusted friend guiding you to safety.
Slight warmth in the lower register. No accent or very neutral American English."
```

**Best for:** Evening meditations, sleep, self-compassion, calming sessions

### Voice B: "River" — Calm Male

```
Description: "A warm, grounded man in his late 30s with a deep, resonant voice.
He speaks calmly and steadily, with a reassuring presence. His pace is slow
and measured, like a meditation teacher with years of experience. Rich baritone,
gentle and non-authoritative. Neutral accent."
```

**Best for:** Morning meditations, focus, body scan, energizing sessions

### Voice C (Future): "Sage" — Warm Non-Binary / Androgynous

```
Description: "A calm, androgynous voice with a warm, centered quality.
Neither distinctly masculine nor feminine, with a gentle, flowing cadence.
Speaks with a wise, unhurried quality. Mid-range pitch, very soothing."
```

**Best for:** Loving-kindness, gratitude, general-purpose

---

## 3. Meditation Package — "Breeze Meditations" (v1)

### 3a. Categories & Selection Framework

Users choose a meditation based on:

| Dimension | Options |
|-----------|---------|
| **Time of day** | Morning, Afternoon, Evening, Bedtime |
| **Intention** | Calm, Energize, Focus, Release, Sleep, Self-Love |
| **Duration** | Quick (3 min), Standard (5 min), Deep (10 min) |
| **Voice** | Luna (female), River (male) |

### 3b. The 5 Guided Meditations (v1 Package)

---

#### 1. 🌅 Morning Awakening — "Start Your Day with Intention"
- **Category:** Morning / Energize
- **Duration:** 5 minutes
- **Default voice:** River (male)
- **Breathing pattern:** 3-3-6 Energizing
- **Structure:**
  1. Welcome & settling (30s) — "Good morning. Take a moment to notice you're here..."
  2. Body awakening scan (60s) — Gentle attention from feet to head, inviting energy
  3. Energizing breathwork (90s) — Guided 3-3-6 pattern with counts
  4. Intention setting (60s) — "Choose one word for today... Hold it in your heart..."
  5. Gentle close (30s) — "Carry this energy with you. You're ready."
- **Background sound:** Soft morning birds (synthesized or ambient)

---

#### 2. 🌊 Calm & Release — "Let Go of What You're Carrying"
- **Category:** Afternoon / Calm / Release
- **Duration:** 7 minutes
- **Default voice:** Luna (female)
- **Breathing pattern:** 4-7-8 Relaxing
- **Structure:**
  1. Welcome & grounding (30s) — "Find a comfortable position. You don't need to hold anything right now..."
  2. Progressive relaxation (90s) — Release tension from shoulders, jaw, hands
  3. 4-7-8 breathwork (120s) — Guided counting with gentle encouragement
  4. Letting-go visualization (90s) — "Imagine placing what you're carrying into a stream... Watch it drift away..."
  5. Body check-in (30s) — "Notice how your body feels now..."
  6. Gentle close (30s) — "This peace is always available to you."
- **Background sound:** Ocean waves

---

#### 3. 💜 Self-Compassion — "A Moment of Kindness for Yourself"
- **Category:** Anytime / Self-Love
- **Duration:** 5 minutes
- **Default voice:** Luna (female)
- **Breathing pattern:** 5-5 Calm Breath
- **Structure:**
  1. Welcome (20s) — "This meditation is a gift to yourself..."
  2. Settling breath (40s) — 5-5 breathing, 3 cycles
  3. Loving-kindness phrases (120s) — "May I be happy. May I be healthy. May I be safe. May I live with ease." (Repeat with pauses)
  4. Self-acceptance (60s) — "You are enough, exactly as you are right now..."
  5. Expanding compassion (40s) — "Send this warmth to someone you love..."
  6. Close (20s) — "Carry this kindness with you today."
- **Background sound:** Soft meditation bells (synthesized)

---

#### 4. 🌙 Evening Wind-Down — "Prepare Your Mind for Rest"
- **Category:** Evening / Bedtime / Sleep
- **Duration:** 8 minutes
- **Default voice:** Luna (female)
- **Breathing pattern:** 4-8 Sleep Breath
- **Structure:**
  1. Welcome (30s) — "The day is done. There's nothing more to do..."
  2. Day release (60s) — "Let the events of today pass through your mind like clouds..."
  3. Body scan for sleep (120s) — Systematic relaxation, heavy limbs, sinking feeling
  4. 4-8 breathwork (90s) — Slow, elongated exhales
  5. Gratitude moment (60s) — "Think of one thing today you're grateful for... Let it warm you..."
  6. Sleep transition (60s) — Voice gets progressively softer and slower
  7. Silence / fade out (30s) — Natural ending into sleep
- **Background sound:** Night sounds / gentle rain

---

#### 5. ⚡ Focus & Presence — "Sharpen Your Mind"
- **Category:** Morning / Afternoon / Focus / Energize
- **Duration:** 5 minutes
- **Default voice:** River (male)
- **Breathing pattern:** Box Breathing (4-4-4-4)
- **Structure:**
  1. Welcome (20s) — "Let's bring your attention to a single point..."
  2. Box breathing (90s) — Guided 4-4-4-4 with firm, steady counts
  3. Focused attention (60s) — "Notice the sensation of air at the tip of your nose..."
  4. Wandering mind anchor (60s) — "When your mind wanders, gently return. No judgment..."
  5. Expansion (40s) — "Now widen your awareness to the whole room..."
  6. Close (30s) — "Take this clarity with you. You are focused. You are present."
- **Background sound:** White noise / very subtle ambient

---

### 3c. Future Meditations (v2 expansion)

| # | Name | Category | Duration |
|---|------|----------|----------|
| 6 | Body Scan Journey | Relaxation / Anytime | 10 min |
| 7 | Anxiety SOS Meditation | Crisis / Calm | 3 min |
| 8 | Gratitude Glow | Evening / Self-Love | 5 min |
| 9 | Walking Meditation | Afternoon / Energize | 5 min |
| 10 | Resilience Builder | Morning / Empower | 7 min |

---

## 4. App Integration — Product & UX

### 4a. Navigation & Entry Points

**New route:** `/meditate` (premium-gated)

**Entry points:**
1. **Home page** — New "Guided Meditations" card below Daily Calm card
2. **Bottom nav** — Replace "Learn" tab with "Meditate" tab (move Learn into Settings or make it a sub-section)
   - OR: Keep 5 tabs as-is, add Meditate as a section within Home
3. **Post-breathing completion** — "Try a guided meditation" CTA
4. **Daily Calm flow** — Optional guided meditation step before gratitude

**Recommended approach:** Add a "Meditate" card on Home that opens `/meditate`. Keep current tab structure (Home, Journal, SOS, Learn, Settings). This avoids navigation disruption.

### 4b. Meditation Browse Screen (`/meditate`)

```
┌─────────────────────────────────┐
│ ← Guided Meditations     🔊    │
│                                 │
│ How are you feeling?            │
│ ┌──────┐ ┌──────┐ ┌──────┐    │
│ │ Calm │ │Energy│ │Focus │    │
│ └──────┘ └──────┘ └──────┘    │
│ ┌──────┐ ┌──────┐ ┌──────┐    │
│ │Release│ │Sleep │ │ Love │    │
│ └──────┘ └──────┘ └──────┘    │
│                                 │
│ ─── Recommended for you ───     │
│ (based on time of day)          │
│                                 │
│ ┌───────────────────────────┐  │
│ │ 🌅 Morning Awakening      │  │
│ │ Start your day with       │  │
│ │ intention · 5 min         │  │
│ │ [River 🎙️] [Luna 🎙️]     │  │
│ └───────────────────────────┘  │
│                                 │
│ ┌───────────────────────────┐  │
│ │ ⚡ Focus & Presence        │  │
│ │ Sharpen your mind · 5 min │  │
│ └───────────────────────────┘  │
│                                 │
│ ─── All Meditations ───        │
│ (scrollable list)               │
└─────────────────────────────────┘
```

**Key UX details:**
- **Intention chips** at top filter the list
- **Smart recommendation** based on time of day (morning → Awakening, evening → Wind-Down)
- Each card shows: title, subtitle, duration, voice selector
- Premium lock badge for non-premium users (shows 1 free preview, rest locked)

### 4c. Meditation Player Screen

```
┌─────────────────────────────────┐
│ ×                               │
│                                 │
│         🌊                      │
│   (animated visual that         │
│    pulses with the voice)       │
│                                 │
│   Calm & Release                │
│   Let Go of What You're         │
│   Carrying                      │
│                                 │
│   ━━━━━━━━━●━━━━━━━━━ 3:24/7:00│
│                                 │
│    ⏪15    ▶️ / ⏸     ⏩15       │
│                                 │
│   Voice: Luna  ·  🔊 Volume     │
│                                 │
│   🌊 Ocean  🌧️ Rain  🌿 Forest  │
│   (ambient sound selector)      │
│                                 │
└─────────────────────────────────┘
```

**Player features:**
- Play/pause, 15s skip forward/back
- Progress bar with elapsed/total time
- Voice toggle (if both voices available for this meditation)
- Ambient sound mixer (layer nature sounds behind voice)
- Background playback (continue when screen locks)
- Session counts toward daily streak

### 4d. Free vs. Premium Access

| Feature | Free | Premium |
|---------|------|---------|
| Browse meditation library | ✅ See all titles & descriptions | ✅ |
| Preview (first 30 seconds) | ✅ 1 meditation | ✅ |
| Full playback | ❌ | ✅ All meditations |
| Voice selection | ❌ Default only | ✅ Choose voice |
| Ambient sound layering | ❌ | ✅ |
| New meditations (monthly) | ❌ | ✅ |

---

## 5. Sales & Premium Integration

### 5a. Updated Premium Offering — "Breeze Plus"

Add to existing premium features list on Upgrade page:

```typescript
{
  icon: Headphones, // from lucide-react
  title: 'Guided Meditations',
  description: '5 expert-crafted meditations with calming AI voices. Morning, evening, sleep, focus & self-love.',
}
```

This becomes the **hero feature** of Premium — the most tangible, high-value offering.

### 5b. Conversion Funnel

1. **Discovery** — Home page shows "Guided Meditations" card with "NEW" badge
2. **Browse** — User sees all 5 meditations, reads descriptions, sees duration
3. **Taste** — User can play 30s preview of one meditation (free)
4. **Gate** — "Unlock all meditations" → Upgrade page
5. **Convert** — Standard Stripe checkout

### 5c. Pricing Justification

Meditation apps charge $70-$100/year. Breeze at $14.99/year is a steal. Guided meditations add perceived value that justifies even a small price increase to ~$19.99/year in the future.

---

## 6. Technical Architecture

### 6a. Audio File Storage

**Option A: Bundle in app (recommended for v1)**
- Store MP3s in `public/audio/meditations/`
- ~1MB per minute of audio at 128kbps
- 5 meditations × 2 voices × ~6 min avg = ~60MB total
- Pros: Instant playback, works offline
- Cons: Increases app download size

**Option B: CDN download on demand (recommended for v2+)**
- Host on Supabase Storage or CloudFlare R2
- Download on first play, cache locally
- Pros: Small initial download
- Cons: Requires internet for first play

**Recommended: Option A for v1** (5 meditations is manageable), migrate to B when library grows.

### 6b. File Structure

```
public/
  audio/
    meditations/
      morning-awakening-luna.mp3
      morning-awakening-river.mp3
      calm-release-luna.mp3
      calm-release-river.mp3
      self-compassion-luna.mp3
      self-compassion-river.mp3
      evening-winddown-luna.mp3
      evening-winddown-river.mp3
      focus-presence-luna.mp3
      focus-presence-river.mp3

src/
  lib/
    meditations.ts          # Meditation data, types, recommendation logic
    audioPlayer.ts          # HTML5 Audio / Capacitor media playback
  pages/
    Meditate.tsx            # Browse screen
    MeditationPlayer.tsx    # Player screen (fullscreen)
  components/
    MeditationCard.tsx      # Card for browse list
    MeditationPlayerUI.tsx  # Player controls component
    IntentionChips.tsx      # Filter chips
```

### 6c. Data Model

```typescript
export interface GuidedMeditation {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  duration: number; // seconds
  category: MeditationCategory;
  intentions: Intention[];
  timeOfDay: TimeOfDay[];
  breathingPattern: PatternId;
  defaultVoice: VoiceId;
  availableVoices: VoiceId[];
  audioFiles: Record<VoiceId, string>; // voice → audio file path
  backgroundSound: SoundType;
  premium: boolean;
  previewDuration: number; // seconds available for free
}

export type MeditationCategory = 'morning' | 'afternoon' | 'evening' | 'bedtime' | 'anytime';
export type Intention = 'calm' | 'energize' | 'focus' | 'release' | 'sleep' | 'self-love';
export type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night';
export type VoiceId = 'luna' | 'river';
export type SoundType = 'ocean' | 'rain' | 'forest' | 'birds' | 'bells' | 'white-noise' | 'night';
```

### 6d. Audio Playback

Use HTML5 `Audio` API (works in Capacitor WebView):

```typescript
// Simple approach — no native plugin needed
const audio = new Audio('/audio/meditations/calm-release-luna.mp3');
audio.play();
audio.pause();
audio.currentTime = 30; // seek
```

For background playback on iOS (screen locked), may need `@capacitor-community/native-audio` plugin.

### 6e. Smart Recommendations

```typescript
function getRecommendedMeditation(hour: number): GuidedMeditation {
  if (hour >= 5 && hour < 10) return meditations.find(m => m.id === 'morning-awakening');
  if (hour >= 10 && hour < 17) return meditations.find(m => m.id === 'focus-presence');
  if (hour >= 17 && hour < 21) return meditations.find(m => m.id === 'calm-release');
  return meditations.find(m => m.id === 'evening-winddown'); // 9pm+
}
```

---

## 7. Voice Generation Script (for development)

### Prerequisites

```bash
npm install elevenlabs  # or use HTTP API directly
export ELEVEN_API_KEY="your-api-key"
```

### Step 1: Design voices

```typescript
import { ElevenLabsClient } from 'elevenlabs';

const client = new ElevenLabsClient({ apiKey: process.env.ELEVEN_API_KEY });

// Design Luna
const lunaPreview = await client.textToVoice.design({
  voice_description: "A warm, gentle woman in her early 30s with a soft, nurturing voice. She speaks slowly and deliberately, with natural pauses between phrases. Her tone is intimate and soothing, like a trusted friend. Very slight warmth in the lower register. Neutral American English.",
  text: "Take a deep breath in... hold it gently... and slowly let it go. You're safe here. There's nowhere else you need to be.",
  model_id: "eleven_multilingual_ttv_v2"
});

// Save the best preview
const luna = await client.textToVoice.create({
  voice_name: "Luna",
  voice_description: "Calm female meditation guide",
  generated_voice_id: lunaPreview.previews[0].generated_voice_id
});
```

### Step 2: Generate meditation audio

```typescript
const fs = require('fs');

async function generateMeditation(voiceId: string, script: string, outputPath: string) {
  const audio = await client.textToSpeech.convert(voiceId, {
    text: script,
    model_id: "eleven_multilingual_ttv_v2",
    voice_settings: {
      stability: 0.8,        // High stability for consistent meditation tone
      similarity_boost: 0.75,
      style: 0.3,            // Subtle emotional variation
      use_speaker_boost: true
    },
    output_format: "mp3_44100_128"
  });

  const buffer = Buffer.from(await audio.arrayBuffer());
  fs.writeFileSync(outputPath, buffer);
}
```

### Step 3: Batch generate all meditations

```typescript
const scripts = {
  'morning-awakening': morningScript,
  'calm-release': calmReleaseScript,
  'self-compassion': selfCompassionScript,
  'evening-winddown': eveningScript,
  'focus-presence': focusScript,
};

for (const [id, script] of Object.entries(scripts)) {
  await generateMeditation(lunaVoiceId, script, `public/audio/meditations/${id}-luna.mp3`);
  await generateMeditation(riverVoiceId, script, `public/audio/meditations/${id}-river.mp3`);
}
```

---

## 8. Implementation Phases

### Phase 1: Voice Generation (offline, 1-2 days)
- [ ] Subscribe to ElevenLabs Creator plan ($11)
- [ ] Design Luna and River voices using Voice Design API
- [ ] Write 5 meditation scripts (full text with pause markers)
- [ ] Generate 10 audio files (5 meditations × 2 voices)
- [ ] QA: Listen to all files, regenerate any that sound off
- [ ] Cancel ElevenLabs subscription

### Phase 2: Core Feature (3-4 days)
- [ ] Create `meditations.ts` data file
- [ ] Create `audioPlayer.ts` utility
- [ ] Build Meditate browse page (`/meditate`)
- [ ] Build MeditationPlayer page (fullscreen)
- [ ] Add route to App.tsx
- [ ] Add "Guided Meditations" card to Home page
- [ ] Premium gate (preview + lock)

### Phase 3: Polish & Premium (1-2 days)
- [ ] Add meditation feature to Upgrade page
- [ ] Smart time-of-day recommendations
- [ ] Ambient sound layering during playback
- [ ] Background playback support (Capacitor plugin if needed)
- [ ] Session tracking (count meditations toward streak)
- [ ] Voice selection per meditation

### Phase 4: Future
- [ ] Add 5 more meditations (v2 pack)
- [ ] CDN-hosted audio with download manager
- [ ] "Sage" third voice option
- [ ] User favorites / recently played
- [ ] Meditation streaks & garden integration
- [ ] Sleep timer (auto-stop after X minutes)

---

## 9. Meditation Scripts (Draft — Meditation #1)

### Morning Awakening — Full Script (~5 min)

```
Good morning.

...

Before you do anything else today, take this moment just for you.

...

Find a comfortable position. You can sit up tall, or stay lying down — whatever feels right.

...

Let your eyes close gently. Take one deep breath in through your nose...

... hold it for just a moment ...

... and let it go through your mouth. Nice and slow.

...

Let's wake up your body with a gentle breath.

We'll breathe in for three counts... hold for three... and out for six.

...

Breathing in... two... three...

Hold... two... three...

And slowly out... two... three... four... five... six...

...

Again. In... two... three...

Hold... two... three...

Out... two... three... four... five... six...

...

Beautiful. Two more rounds at your own pace.

...

[pause 30 seconds]

...

Now, bring your awareness to your body. Starting at your feet.

Notice the weight of them. Wiggle your toes if you'd like.

...

Move your attention up through your legs... your hips... your belly.

...

Feel your chest rise and fall. Your shoulders. Let them soften.

...

Your neck. Your jaw. Let it unclench.

...

The space behind your eyes. Let it be soft.

...

Your whole body is here, awake, and ready.

...

Now, choose one word for today. Just one word that captures how you want to feel.

...

Maybe it's "calm." Maybe "strong." Maybe "open." Maybe "grateful."

...

Hold that word in your heart. Let it settle there.

...

[pause 10 seconds]

...

Take one more deep breath in... and let it out.

...

When you're ready, gently open your eyes.

Carry that word — and this energy — with you today.

You're ready.
```

*Note: `...` represents 2-3 second pauses. In the ElevenLabs script, these translate to literal `...` in the text (the model naturally pauses) or explicit silence insertion in post-production.*

---

## Sources

- [ElevenLabs TTS API](https://elevenlabs.io/docs/api-reference/text-to-speech/convert)
- [ElevenLabs Voice Design API](https://elevenlabs.io/docs/api-reference/text-to-voice/design)
- [ElevenLabs Text to Speech Overview](https://elevenlabs.io/docs/overview/capabilities/text-to-speech)
- [ElevenLabs Pricing](https://elevenlabs.io/pricing)
- [Headspace Meditation Techniques](https://www.headspace.com/meditation/techniques)
- [Calm vs Headspace Comparison](https://halomentalhealth.com/b/calm-vs-headspace)
- [Headspace vs Calm Review](https://www.choosingtherapy.com/headspace-vs-calm/)
