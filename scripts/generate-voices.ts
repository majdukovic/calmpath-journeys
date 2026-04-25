/**
 * ElevenLabs Voice Generation Script
 *
 * Prerequisites:
 * 1. npm install elevenlabs (or use fetch directly)
 * 2. Subscribe to ElevenLabs Creator plan ($11/mo)
 * 3. Set ELEVEN_API_KEY environment variable
 *
 * Usage:
 *   npx tsx scripts/generate-voices.ts
 *
 * This script:
 * 1. Designs two voices (Luna + River) using Voice Design API
 * 2. Saves them to your ElevenLabs library
 * 3. Generates all meditation audio files
 * 4. Saves MP3s to public/audio/meditations/
 */

import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const API_KEY = process.env.ELEVEN_API_KEY;
if (!API_KEY) {
  console.error('Error: Set ELEVEN_API_KEY environment variable');
  process.exit(1);
}

const BASE_URL = 'https://api.elevenlabs.io/v1';
const OUTPUT_DIR = join(__dirname, '..', 'public', 'audio', 'meditations');
const TTS_MODEL_ID = 'eleven_multilingual_v2';
const VOICE_DESIGN_MODEL_ID = 'eleven_multilingual_ttv_v2';

// Previously generated voice IDs (set these to skip voice design step)
const EXISTING_VOICE_IDS: Record<string, string> = {
  luna: 'nuPVUGMC0np65KfAQ5fn',
  river: 'oFoOITL7xFlCG3GnX1e6',
};

// Ensure output directory exists
if (!existsSync(OUTPUT_DIR)) {
  mkdirSync(OUTPUT_DIR, { recursive: true });
}

// ─── Voice descriptions ─────────────────────────────────────────────

const voiceDescriptions = {
  luna: {
    name: 'Luna',
    description:
      'A warm, gentle woman in her early 30s with a soft, nurturing voice. ' +
      'She speaks slowly and deliberately, with natural pauses between phrases. ' +
      'Her tone is intimate and soothing, like a trusted friend guiding you to safety. ' +
      'Slight warmth in the lower register. Neutral American English.',
    previewText:
      'Take a deep breath in... hold it gently... and slowly let it go. ' +
      "You're safe here. There's nowhere else you need to be. " +
      'Let your shoulders soften. Let your jaw unclench. You are held.',
  },
  river: {
    name: 'River',
    description:
      'A warm, grounded man in his late 30s with a deep, resonant voice. ' +
      'He speaks calmly and steadily, with a reassuring presence. ' +
      'His pace is slow and measured, like a meditation teacher with years of experience. ' +
      'Rich baritone, gentle and non-authoritative. Neutral accent.',
    previewText:
      'Good morning. Before you do anything else today, take this moment just for you. ' +
      'Find a comfortable position... let your eyes close gently... ' +
      'and take one deep breath in through your nose.',
  },
};

// ─── Meditation scripts ─────────────────────────────────────────────

const meditationScripts: Record<string, string> = {
  'morning-awakening': `Good morning.

Before you do anything else today, take this moment just for you.

Find a comfortable position. You can sit up tall, or stay lying down, whatever feels right.

Let your eyes close gently. Take one deep breath in through your nose...

hold it for just a moment...

and let it go through your mouth. Nice and slow.

Let's wake up your body with a gentle breath. We'll breathe in for three counts, hold for three, and out for six.

Breathing in... two... three...

Hold... two... three...

And slowly out... two... three... four... five... six...

Again. In... two... three...

Hold... two... three...

Out... two... three... four... five... six...

Beautiful. Two more rounds at your own pace.

...

Now, bring your awareness to your body. Starting at your feet.

Notice the weight of them. Wiggle your toes if you'd like.

Move your attention up through your legs... your hips... your belly.

Feel your chest rise and fall. Your shoulders. Let them soften.

Your neck. Your jaw. Let it unclench.

The space behind your eyes. Let it be soft.

Your whole body is here, awake, and ready.

Now, choose one word for today. Just one word that captures how you want to feel.

Maybe it's calm. Maybe strong. Maybe open. Maybe grateful.

Hold that word in your heart. Let it settle there.

...

Take one more deep breath in... and let it out.

When you're ready, gently open your eyes.

Carry that word, and this energy, with you today. You're ready.`,

  'calm-release': `Find a comfortable position. You don't need to hold anything right now.

Whatever you've been carrying today... you can set it down. Just for these next few minutes.

Let your eyes close. Take a natural breath in... and let it go.

Let's start by releasing some tension. Bring your attention to your shoulders. They might be up by your ears without you realizing it.

On your next exhale, let them drop. Feel the space that creates.

Now your jaw. Is it clenched? Let it soften. Let your lips part slightly.

Your hands. If they're fists, let them open. Let your fingers be loose.

Good. Already lighter.

Now let's breathe together. We'll use a calming four seven eight pattern. In for four, hold for seven, out for eight. I'll count with you.

Breathing in... two... three... four...

Hold... two... three... four... five... six... seven...

And slowly out... two... three... four... five... six... seven... eight...

That's beautiful. Again.

In... two... three... four...

Hold... two... three... four... five... six... seven...

Out... two... three... four... five... six... seven... eight...

Two more at your own pace. Nice and slow.

...

Now, imagine you're standing by a gentle stream. The water is clear and calm, flowing steadily.

Think of something you've been carrying. A worry, a frustration, a weight. Name it silently.

Now imagine placing it into the stream. Watch it float away. Slowly, gently, gone.

If there's more, place that in the stream too. One at a time. The water takes it all.

...

Notice how your body feels now. Lighter, perhaps. More spacious.

Take one more deep breath in... and let everything go.

This peace is always available to you. One breath away.

When you're ready, gently open your eyes. Carry this calm with you.`,

  'self-compassion': `This meditation is a gift to yourself. You don't need to earn it. You don't need to deserve it. It's simply yours.

Find a comfortable position and let your eyes close.

Place one hand on your heart, if that feels comfortable. Feel the warmth of your own touch.

Let's begin with a few gentle breaths. In for five... and out for five.

Breathing in... two... three... four... five...

And out... two... three... four... five...

Again. In... two... three... four... five...

Out... two... three... four... five...

Now, silently repeat these words with me. Let them land wherever they need to.

May I be happy.

...

May I be healthy.

...

May I be safe.

...

May I live with ease.

...

Say them again, slowly. As if speaking to someone you love deeply.

May I be happy. May I be healthy. May I be safe. May I live with ease.

...

You are enough. Exactly as you are, right now, in this moment.

Not the future version of you. Not the version that has it all figured out. This version. Right here.

...

Now, think of someone you love. Hold their face in your mind.

Send these same words to them.

May you be happy. May you be healthy. May you be safe. May you live with ease.

...

Feel the warmth of that intention. It flows both ways.

Take one more breath in... and let it go softly.

Carry this kindness with you today. You are worthy of gentle things.`,

  'evening-winddown': `The day is done. There's nothing more you need to do.

Whatever happened today, whether it was hard, or beautiful, or somewhere in between... it's over now. And you showed up for it. That's enough.

Let your eyes close. Let your body begin to settle.

Take a deep breath in... and a long, slow breath out.

Let the events of today pass through your mind like clouds. Don't hold onto any of them. Just watch them drift by.

That conversation... let it go. That worry... let it go. That thing you forgot to do... it can wait until tomorrow. Let it go.

...

Now, let's soften your body for sleep. Start at the top of your head.

Feel your forehead smooth out. The muscles around your eyes, relax.

Your jaw drops open slightly. Your tongue rests soft against the roof of your mouth.

Your neck lets go. Your shoulders melt down into the surface beneath you.

Your arms feel heavy. Your hands are warm and loose.

Your chest rises and falls, effortlessly. Your belly is soft. No holding.

Your hips, your legs, your feet... all sinking. Heavy. Supported.

...

Let's breathe for sleep now. In for four... and out for eight. No holding. Just a long, gentle release.

In... two... three... four...

Out... two... three... four... five... six... seven... eight...

In... two... three... four...

Out... two... three... four... five... six... seven... eight...

Continue at your own pace. Each exhale pulls you deeper into rest.

...

Before you drift off, think of one thing from today you're grateful for. Just one small thing.

Maybe a kind word. A warm cup of something. A moment of quiet. Let it warm you.

...

You did well today.

You can rest now.

...

Goodnight.`,

  'focus-presence': `Let's bring your attention to a single point. Right here. Right now.

Sit tall if you can. Feel your feet on the floor, your sit bones grounded.

Let your eyes close, or soften your gaze downward.

We'll start with box breathing to anchor your mind. In for four, hold for four, out for four, hold for four. A perfect square of focus.

In... two... three... four...

Hold... two... three... four...

Out... two... three... four...

Hold... two... three... four...

Again. Steady and precise.

In... two... three... four...

Hold... two... three... four...

Out... two... three... four...

Hold... two... three... four...

Two more rounds at your own pace. Let each count be deliberate.

...

Good. Your mind is already clearer.

Now, bring your attention to the sensation of air at the tip of your nose. That tiny spot where you feel each breath enter and leave.

Stay right there. Just notice. Cool air in... warm air out.

...

Your mind will wander. That's not failure. That's normal. When it drifts, notice where it went, and gently return to the breath at your nose. No judgment. Just return.

...

Each time you come back, you're training your brain. You're building focus like a muscle. And right now, you're getting stronger.

...

Now, widen your awareness. From that single point at your nose, expand outward.

Feel the whole room around you. The sounds, the air, the space.

You are here. Fully present. Alert and calm.

Take one more deep breath in... hold at the top... and release.

Take this clarity with you. You are focused. You are present. You're ready.`,
};

// ─── API helpers ─────────────────────────────────────────────────────

async function designVoice(
  description: string,
  previewText: string,
): Promise<{ generated_voice_id: string; audio_base_64: string }[]> {
  const res = await fetch(`${BASE_URL}/text-to-voice/design`, {
    method: 'POST',
    headers: {
      'xi-api-key': API_KEY!,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      voice_description: description,
      text: previewText,
      model_id: VOICE_DESIGN_MODEL_ID,
      guidance_scale: 4,
      should_enhance: true,
    }),
  });

  if (!res.ok) {
    throw new Error(`Voice design failed: ${res.status} ${await res.text()}`);
  }

  const data = await res.json();
  return data.previews;
}

async function createVoice(name: string, description: string, generatedVoiceId: string): Promise<string> {
  const res = await fetch(`${BASE_URL}/text-to-voice`, {
    method: 'POST',
    headers: {
      'xi-api-key': API_KEY!,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      voice_name: name,
      voice_description: description,
      generated_voice_id: generatedVoiceId,
    }),
  });

  if (!res.ok) {
    throw new Error(`Voice creation failed: ${res.status} ${await res.text()}`);
  }

  const data = await res.json();
  return data.voice_id;
}

async function generateSpeech(voiceId: string, text: string, outputPath: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/text-to-speech/${voiceId}`, {
    method: 'POST',
    headers: {
      'xi-api-key': API_KEY!,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text,
      model_id: TTS_MODEL_ID,
      voice_settings: {
        stability: 0.8,
        similarity_boost: 0.75,
        style: 0.3,
        use_speaker_boost: true,
      },
      output_format: 'mp3_44100_128',
    }),
  });

  if (!res.ok) {
    throw new Error(`TTS failed: ${res.status} ${await res.text()}`);
  }

  const buffer = Buffer.from(await res.arrayBuffer());
  writeFileSync(outputPath, buffer);
  console.log(`  ✓ Saved: ${outputPath} (${(buffer.length / 1024 / 1024).toFixed(1)} MB)`);
}

// ─── Main ────────────────────────────────────────────────────────────

async function main() {
  console.log('🎙️  ElevenLabs Meditation Voice Generator\n');

  // Step 1: Use existing voices or design new ones
  const hasExisting = Object.values(EXISTING_VOICE_IDS).every(id => id.length > 0);
  const voices: Record<string, string> = {};

  if (hasExisting) {
    console.log('Step 1: Using existing voice IDs...\n');
    Object.assign(voices, EXISTING_VOICE_IDS);
    for (const [key, id] of Object.entries(voices)) {
      console.log(`  ✓ ${key}: ${id}`);
    }
    console.log('');
  } else {
    console.log('Step 1: Designing voices...\n');

    for (const [key, config] of Object.entries(voiceDescriptions)) {
      console.log(`  Designing ${config.name}...`);
      const previews = await designVoice(config.description, config.previewText);
      console.log(`  Got ${previews.length} previews for ${config.name}`);

      const previewPath = join(OUTPUT_DIR, `_preview-${key}.mp3`);
      writeFileSync(previewPath, Buffer.from(previews[0].audio_base_64, 'base64'));
      console.log(`  Preview saved: ${previewPath}`);

      console.log(`  Creating ${config.name} in library...`);
      const voiceId = await createVoice(
        `Breeze ${config.name}`,
        config.description,
        previews[0].generated_voice_id,
      );
      voices[key] = voiceId;
      console.log(`  ✓ ${config.name} voice ID: ${voiceId}\n`);
    }
  }

  // Step 2: Generate all meditation audio
  console.log('Step 2: Generating meditation audio...\n');

  for (const [meditationId, script] of Object.entries(meditationScripts)) {
    console.log(`\n  📖 ${meditationId}`);

    for (const [voiceKey, voiceId] of Object.entries(voices)) {
      const outputPath = join(OUTPUT_DIR, `${meditationId}-${voiceKey}.mp3`);
      console.log(`    Generating with ${voiceKey}...`);

      // ElevenLabs has a 10,000 char limit per request for multilingual v2
      if (script.length > 10000) {
        console.log(`    ⚠️  Script too long (${script.length} chars), splitting...`);
        // For now, truncate. In production, split and concatenate.
        await generateSpeech(voiceId, script.slice(0, 10000), outputPath);
      } else {
        await generateSpeech(voiceId, script, outputPath);
      }
    }
  }

  console.log('\n✅ Done! All meditation audio files generated.');
  console.log(`\nVoice IDs (save these):`);
  for (const [key, id] of Object.entries(voices)) {
    console.log(`  ${key}: ${id}`);
  }
  console.log('\nYou can now cancel your ElevenLabs subscription.');
}

main().catch(console.error);
