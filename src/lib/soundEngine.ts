/**
 * Advanced ambient sound synthesis using Web Audio API.
 * Each sound type uses distinct techniques to be perceptually unique.
 * No external audio files needed — works fully offline.
 */

type SoundGenerator = {
  start: () => void;
  stop: () => void;
};

// Utility: create a noise buffer
function createNoiseBuffer(ctx: AudioContext, seconds: number): AudioBuffer {
  const length = seconds * ctx.sampleRate;
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < length; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  return buffer;
}

// Utility: create a looping noise source
function createNoiseSource(ctx: AudioContext, seconds = 4): AudioBufferSourceNode {
  const source = ctx.createBufferSource();
  source.buffer = createNoiseBuffer(ctx, seconds);
  source.loop = true;
  return source;
}

// Utility: fade in a gain node
function fadeIn(gain: GainNode, target: number, duration: number) {
  gain.gain.setValueAtTime(0, gain.context.currentTime);
  gain.gain.linearRampToValueAtTime(target, gain.context.currentTime + duration);
}

// Utility: fade out a gain node
function fadeOut(gain: GainNode, duration: number) {
  gain.gain.linearRampToValueAtTime(0, gain.context.currentTime + duration);
}

/**
 * RAIN: Filtered noise base + random high-frequency "droplet" clicks
 * using scheduled grain bursts for a pitter-patter texture.
 */
function createRain(ctx: AudioContext): SoundGenerator {
  const masterGain = ctx.createGain();
  masterGain.connect(ctx.destination);

  // Layer 1: Steady rain base — bandpass filtered noise
  const rainNoise = createNoiseSource(ctx, 4);
  const rainFilter = ctx.createBiquadFilter();
  rainFilter.type = 'bandpass';
  rainFilter.frequency.value = 4000;
  rainFilter.Q.value = 0.4;
  const rainGain = ctx.createGain();
  rainGain.gain.value = 0.12;
  rainNoise.connect(rainFilter);
  rainFilter.connect(rainGain);
  rainGain.connect(masterGain);

  // Layer 2: Lower rumble for body
  const rumbleNoise = createNoiseSource(ctx, 6);
  const rumbleFilter = ctx.createBiquadFilter();
  rumbleFilter.type = 'lowpass';
  rumbleFilter.frequency.value = 500;
  const rumbleGain = ctx.createGain();
  rumbleGain.gain.value = 0.06;
  rumbleNoise.connect(rumbleFilter);
  rumbleFilter.connect(rumbleGain);
  rumbleGain.connect(masterGain);

  // Layer 3: Droplet simulation — short noise bursts at random intervals
  let dropletInterval: ReturnType<typeof setInterval> | null = null;

  function scheduleDrop() {
    const dropBuffer = ctx.createBuffer(1, ctx.sampleRate * 0.02, ctx.sampleRate);
    const dropData = dropBuffer.getChannelData(0);
    for (let i = 0; i < dropData.length; i++) {
      dropData[i] = (Math.random() * 2 - 1) * (1 - i / dropData.length);
    }
    const drop = ctx.createBufferSource();
    drop.buffer = dropBuffer;
    const dropFilter = ctx.createBiquadFilter();
    dropFilter.type = 'highpass';
    dropFilter.frequency.value = 2000 + Math.random() * 6000;
    const dropGain = ctx.createGain();
    dropGain.gain.value = 0.03 + Math.random() * 0.05;
    drop.connect(dropFilter);
    dropFilter.connect(dropGain);
    dropGain.connect(masterGain);
    drop.start();
  }

  return {
    start: () => {
      rainNoise.start();
      rumbleNoise.start();
      fadeIn(masterGain, 1, 1.5);
      dropletInterval = setInterval(() => {
        // Random cluster of drops
        const count = Math.floor(Math.random() * 4) + 1;
        for (let i = 0; i < count; i++) {
          setTimeout(scheduleDrop, Math.random() * 80);
        }
      }, 60 + Math.random() * 100);
    },
    stop: () => {
      fadeOut(masterGain, 0.8);
      if (dropletInterval) clearInterval(dropletInterval);
      setTimeout(() => {
        try { rainNoise.stop(); } catch {}
        try { rumbleNoise.stop(); } catch {}
      }, 900);
    },
  };
}

/**
 * OCEAN: LFO-modulated noise creates rhythmic wave-like sweeping.
 * Two layers at different speeds simulate overlapping waves.
 */
function createOcean(ctx: AudioContext): SoundGenerator {
  const masterGain = ctx.createGain();
  masterGain.connect(ctx.destination);

  function createWaveLayer(speed: number, filterFreq: number, volume: number) {
    const noise = createNoiseSource(ctx, 8);
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = filterFreq;
    filter.Q.value = 1.5;

    // LFO modulates the gain to simulate wave crests
    const lfo = ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.value = speed;

    const lfoGain = ctx.createGain();
    lfoGain.gain.value = volume * 0.5;

    const waveGain = ctx.createGain();
    waveGain.gain.value = volume;

    lfo.connect(lfoGain);
    lfoGain.connect(waveGain.gain);

    noise.connect(filter);
    filter.connect(waveGain);
    waveGain.connect(masterGain);

    return { noise, lfo };
  }

  // Slow large waves
  const bigWave = createWaveLayer(0.08, 350, 0.18);
  // Faster smaller waves
  const smallWave = createWaveLayer(0.22, 800, 0.07);
  // Foam/hiss layer
  const foam = createNoiseSource(ctx, 3);
  const foamFilter = ctx.createBiquadFilter();
  foamFilter.type = 'highpass';
  foamFilter.frequency.value = 3000;
  const foamGain = ctx.createGain();
  foamGain.gain.value = 0.03;
  foam.connect(foamFilter);
  foamFilter.connect(foamGain);
  foamGain.connect(masterGain);

  return {
    start: () => {
      bigWave.noise.start();
      bigWave.lfo.start();
      smallWave.noise.start();
      smallWave.lfo.start();
      foam.start();
      fadeIn(masterGain, 1, 2);
    },
    stop: () => {
      fadeOut(masterGain, 1);
      setTimeout(() => {
        try { bigWave.noise.stop(); bigWave.lfo.stop(); } catch {}
        try { smallWave.noise.stop(); smallWave.lfo.stop(); } catch {}
        try { foam.stop(); } catch {}
      }, 1100);
    },
  };
}

/**
 * FOREST: Gentle noise base + periodic chirp-like oscillator patterns
 * simulating distant birdsong with randomized timing and pitch.
 */
function createForest(ctx: AudioContext): SoundGenerator {
  const masterGain = ctx.createGain();
  masterGain.connect(ctx.destination);

  // Background rustling
  const rustleNoise = createNoiseSource(ctx, 6);
  const rustleFilter = ctx.createBiquadFilter();
  rustleFilter.type = 'bandpass';
  rustleFilter.frequency.value = 1200;
  rustleFilter.Q.value = 0.3;
  const rustleGain = ctx.createGain();
  rustleGain.gain.value = 0.04;
  rustleNoise.connect(rustleFilter);
  rustleFilter.connect(rustleGain);
  rustleGain.connect(masterGain);

  // Light breeze
  const breezeNoise = createNoiseSource(ctx, 10);
  const breezeFilter = ctx.createBiquadFilter();
  breezeFilter.type = 'lowpass';
  breezeFilter.frequency.value = 400;
  const breezeGain = ctx.createGain();
  breezeGain.gain.value = 0.035;
  breezeNoise.connect(breezeFilter);
  breezeFilter.connect(breezeGain);
  breezeGain.connect(masterGain);

  // Bird chirps — scheduled oscillator tweets
  let birdInterval: ReturnType<typeof setInterval> | null = null;

  function chirp() {
    const baseFreq = 1800 + Math.random() * 3000;
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(baseFreq, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * (0.8 + Math.random() * 0.5), ctx.currentTime + 0.08);

    const chirpGain = ctx.createGain();
    chirpGain.gain.setValueAtTime(0, ctx.currentTime);
    chirpGain.gain.linearRampToValueAtTime(0.015 + Math.random() * 0.015, ctx.currentTime + 0.02);
    chirpGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1 + Math.random() * 0.05);

    osc.connect(chirpGain);
    chirpGain.connect(masterGain);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.15);
  }

  return {
    start: () => {
      rustleNoise.start();
      breezeNoise.start();
      fadeIn(masterGain, 1, 1.5);
      birdInterval = setInterval(() => {
        if (Math.random() > 0.4) {
          chirp();
          // Sometimes a quick double chirp
          if (Math.random() > 0.5) {
            setTimeout(chirp, 80 + Math.random() * 120);
          }
        }
      }, 800 + Math.random() * 2000);
    },
    stop: () => {
      fadeOut(masterGain, 0.8);
      if (birdInterval) clearInterval(birdInterval);
      setTimeout(() => {
        try { rustleNoise.stop(); } catch {}
        try { breezeNoise.stop(); } catch {}
      }, 900);
    },
  };
}

/**
 * WIND: Slowly modulating lowpass filter with varying gain
 * creates gusting and fading wind effect. Two layers for depth.
 */
function createWind(ctx: AudioContext): SoundGenerator {
  const masterGain = ctx.createGain();
  masterGain.connect(ctx.destination);

  // Main wind layer — noise with LFO-modulated filter
  const windNoise = createNoiseSource(ctx, 8);
  const windFilter = ctx.createBiquadFilter();
  windFilter.type = 'lowpass';
  windFilter.frequency.value = 500;
  windFilter.Q.value = 0.8;

  // LFO modulates the filter frequency for gusting
  const lfo = ctx.createOscillator();
  lfo.type = 'sine';
  lfo.frequency.value = 0.15; // Very slow
  const lfoDepth = ctx.createGain();
  lfoDepth.gain.value = 300;
  lfo.connect(lfoDepth);
  lfoDepth.connect(windFilter.frequency);

  const windGain = ctx.createGain();
  windGain.gain.value = 0.14;

  windNoise.connect(windFilter);
  windFilter.connect(windGain);
  windGain.connect(masterGain);

  // Higher whistle layer
  const whistleNoise = createNoiseSource(ctx, 5);
  const whistleFilter = ctx.createBiquadFilter();
  whistleFilter.type = 'bandpass';
  whistleFilter.frequency.value = 2000;
  whistleFilter.Q.value = 2;

  const whistleLfo = ctx.createOscillator();
  whistleLfo.type = 'sine';
  whistleLfo.frequency.value = 0.07;
  const whistleLfoDepth = ctx.createGain();
  whistleLfoDepth.gain.value = 800;
  whistleLfo.connect(whistleLfoDepth);
  whistleLfoDepth.connect(whistleFilter.frequency);

  const whistleGain = ctx.createGain();
  whistleGain.gain.value = 0.02;

  whistleNoise.connect(whistleFilter);
  whistleFilter.connect(whistleGain);
  whistleGain.connect(masterGain);

  // Volume gusting via another LFO on master
  const gustLfo = ctx.createOscillator();
  gustLfo.type = 'sine';
  gustLfo.frequency.value = 0.05;
  const gustDepth = ctx.createGain();
  gustDepth.gain.value = 0.4;
  gustLfo.connect(gustDepth);
  gustDepth.connect(masterGain.gain);

  return {
    start: () => {
      windNoise.start();
      whistleNoise.start();
      lfo.start();
      whistleLfo.start();
      gustLfo.start();
      fadeIn(masterGain, 1, 2);
    },
    stop: () => {
      fadeOut(masterGain, 1);
      setTimeout(() => {
        try { windNoise.stop(); lfo.stop(); } catch {}
        try { whistleNoise.stop(); whistleLfo.stop(); } catch {}
        try { gustLfo.stop(); } catch {}
      }, 1100);
    },
  };
}

/**
 * NIGHT: Very quiet ambient base + periodic cricket-like high-pitched
 * chirps using rapid oscillator on/off patterns.
 */
function createNight(ctx: AudioContext): SoundGenerator {
  const masterGain = ctx.createGain();
  masterGain.connect(ctx.destination);

  // Dark ambient base — very low filtered noise
  const baseNoise = createNoiseSource(ctx, 8);
  const baseFilter = ctx.createBiquadFilter();
  baseFilter.type = 'lowpass';
  baseFilter.frequency.value = 250;
  const baseGain = ctx.createGain();
  baseGain.gain.value = 0.04;
  baseNoise.connect(baseFilter);
  baseFilter.connect(baseGain);
  baseGain.connect(masterGain);

  // Gentle mid hum
  const humOsc = ctx.createOscillator();
  humOsc.type = 'sine';
  humOsc.frequency.value = 120;
  const humGain = ctx.createGain();
  humGain.gain.value = 0.008;
  humOsc.connect(humGain);
  humGain.connect(masterGain);

  // Cricket chirps — rapid bursts of high-frequency tone
  let cricketInterval: ReturnType<typeof setInterval> | null = null;

  function cricketChirp() {
    const freq = 4000 + Math.random() * 2000;
    const burstCount = 3 + Math.floor(Math.random() * 5);
    const burstRate = 0.03; // seconds between pulses

    for (let i = 0; i < burstCount; i++) {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = freq;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0, ctx.currentTime + i * burstRate);
      g.gain.linearRampToValueAtTime(0.012, ctx.currentTime + i * burstRate + 0.005);
      g.gain.linearRampToValueAtTime(0, ctx.currentTime + i * burstRate + 0.02);
      osc.connect(g);
      g.connect(masterGain);
      osc.start(ctx.currentTime + i * burstRate);
      osc.stop(ctx.currentTime + i * burstRate + 0.025);
    }
  }

  return {
    start: () => {
      baseNoise.start();
      humOsc.start();
      fadeIn(masterGain, 1, 2);
      cricketInterval = setInterval(() => {
        if (Math.random() > 0.3) {
          cricketChirp();
          // Second cricket with different timing
          if (Math.random() > 0.5) {
            setTimeout(cricketChirp, 200 + Math.random() * 600);
          }
        }
      }, 1000 + Math.random() * 2000);
    },
    stop: () => {
      fadeOut(masterGain, 1);
      if (cricketInterval) clearInterval(cricketInterval);
      setTimeout(() => {
        try { baseNoise.stop(); } catch {}
        try { humOsc.stop(); } catch {}
      }, 1100);
    },
  };
}

export function createSoundGenerator(ctx: AudioContext, type: string): SoundGenerator {
  switch (type) {
    case 'rain': return createRain(ctx);
    case 'ocean': return createOcean(ctx);
    case 'forest': return createForest(ctx);
    case 'wind': return createWind(ctx);
    case 'night': return createNight(ctx);
    default: return createRain(ctx);
  }
}
