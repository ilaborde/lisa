export type PitchClass = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;

export const NOTE_LETTERS = ['C', 'D', 'E', 'F', 'G', 'A', 'B'] as const;
export const ROOT_OPTIONS = ['C', 'C#', 'Db', 'D', 'Eb', 'E', 'F', 'F#', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'] as const;
export const NOTE_NAMES = ROOT_OPTIONS;

const NATURAL_PITCHES: Record<string, number> = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
const SHARP_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const FLAT_NAMES = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];

export function normalizePitchClass(value: number): PitchClass {
  return (((value % 12) + 12) % 12) as PitchClass;
}

export function getPitchClass(noteName: string): PitchClass | null {
  const match = noteName.trim().match(/^([A-Ga-g])([#b]*)$/);
  if (!match) return null;
  let pitch = NATURAL_PITCHES[match[1].toUpperCase()];
  for (const accidental of match[2]) pitch += accidental === '#' ? 1 : -1;
  return normalizePitchClass(pitch);
}

export function getPitchName(pitch: PitchClass, preference: 'sharp' | 'flat' = 'sharp'): string {
  return (preference === 'flat' ? FLAT_NAMES : SHARP_NAMES)[pitch];
}

export function cycleLetter(letter: string, steps: number): string {
  const index = NOTE_LETTERS.indexOf(letter.toUpperCase() as typeof NOTE_LETTERS[number]);
  return NOTE_LETTERS[(index + steps + 70) % 7];
}

export function spellPitchWithLetter(pitch: number, letter: string): string {
  const target = normalizePitchClass(pitch);
  const natural = NATURAL_PITCHES[letter];
  let delta = target - natural;
  if (delta > 6) delta -= 12;
  if (delta < -6) delta += 12;
  if (delta === 0) return letter;
  if (delta > 0 && delta <= 2) return `${letter}${'#'.repeat(delta)}`;
  if (delta < 0 && delta >= -2) return `${letter}${'b'.repeat(-delta)}`;
  return getPitchName(target, delta < 0 ? 'flat' : 'sharp');
}

/** Spells each formula item against its explicit diatonic degree (1..7). */
export function getScaleSpellings(root: string, formula: readonly number[], degrees?: readonly number[]): string[] {
  const rootPitch = getPitchClass(root);
  if (rootPitch === null) return [];
  const degreeNumbers = degrees ?? formula.map((_, index) => index + 1);
  return formula.map((interval, index) => {
    const letter = cycleLetter(root[0], degreeNumbers[index] - 1);
    return spellPitchWithLetter(rootPitch + interval, letter);
  });
}

export function getScaleDegreeLetters(root: string): string[] {
  return Array.from({ length: 7 }, (_, index) => cycleLetter(root[0], index));
}
