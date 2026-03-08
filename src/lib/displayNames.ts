// Cute anonymous display name generator for Breeze Circle

const adjectives = [
  'Calm', 'Gentle', 'Serene', 'Peaceful', 'Quiet', 'Warm', 'Soft',
  'Kind', 'Brave', 'Steady', 'Patient', 'Hopeful', 'Bright', 'Tender',
  'Sweet', 'Cozy', 'Happy', 'Sunny', 'Dreamy', 'Mellow', 'Graceful',
  'Mindful', 'Radiant', 'Blooming', 'Floating', 'Wandering', 'Glowing',
];

const animals = [
  'Otter', 'Fox', 'Bunny', 'Owl', 'Deer', 'Koala', 'Panda',
  'Dove', 'Swan', 'Robin', 'Seal', 'Lamb', 'Fawn', 'Finch',
  'Bear', 'Cat', 'Moth', 'Bee', 'Whale', 'Turtle', 'Heron',
  'Wren', 'Lark', 'Jay', 'Newt', 'Elk', 'Hare', 'Crane',
];

const DISPLAY_NAME_KEY = 'breeze_display_name';

/** Generate a deterministic cute name from a user ID, or random if no ID */
export function generateDisplayName(userId?: string): string {
  // Check if we already have one stored
  try {
    const stored = localStorage.getItem(DISPLAY_NAME_KEY);
    if (stored) return stored;
  } catch {}

  let adjIndex: number;
  let animalIndex: number;

  if (userId) {
    // Simple hash from userId to get deterministic indices
    let hash = 0;
    for (let i = 0; i < userId.length; i++) {
      hash = ((hash << 5) - hash + userId.charCodeAt(i)) | 0;
    }
    adjIndex = Math.abs(hash) % adjectives.length;
    animalIndex = Math.abs(hash >> 8) % animals.length;
  } else {
    adjIndex = Math.floor(Math.random() * adjectives.length);
    animalIndex = Math.floor(Math.random() * animals.length);
  }

  const name = `${adjectives[adjIndex]} ${animals[animalIndex]}`;

  // Persist it
  try {
    localStorage.setItem(DISPLAY_NAME_KEY, name);
  } catch {}

  return name;
}

export function getStoredDisplayName(): string | null {
  try {
    return localStorage.getItem(DISPLAY_NAME_KEY);
  } catch {
    return null;
  }
}
