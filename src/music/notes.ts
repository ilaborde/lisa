export type PitchClass = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;

export const NOTE_LETTERS = ['C', 'D', 'E', 'F', 'G', 'A', 'B'] as const;
export const LETTER_TO_PITCH: Record<string, PitchClass> = {
  C: 0,
  D: 2,
  E: 4,
  F: 5,
  G: 7,
  A: 9,
  B: 11,
};

export const ENHARMONIC_NAMES: Record<PitchClass, string[]> = {
  0: ['C', 'B#'],
  1: ['C#', 'Db'],
  2: ['D'],
  3: ['D#', 'Eb'],
  4: ['E', 'Fb'],
  5: ['F', 'E#'],
  6: ['F#', 'Gb'],
  7: ['G'],
  8: ['G#', 'Ab'],
  9: ['A'],
  10: ['A#', 'Bb'],
  11: ['B', 'Cb'],
};

export const NOTE_NAMES = [
  'C',
  'C#/Db',
  'D',
  'D#/Eb',
  'E',
  'F',
  'F#/Gb',
  'G',
  'G#/Ab',
  'A',
  'A#/Bb',
  'B',
] as const;

export function normalizePitchClass(value: number): PitchClass {
  const normalized = ((value % 12) + 12) % 12;
  return normalized as PitchClass;
}

export function getPitchClass(noteName: string): PitchClass | null {
  const normalized = noteName.trim().replace(/\s+/g, '');
  for (const [pitch, names] of Object.entries(ENHARMONIC_NAMES) as [string, string[]][]) {
    if (names.includes(normalized)) {
      return Number(pitch) as PitchClass;
    }
  }
  return null;
}

export function getPitchName(pitch: PitchClass): string {
  return ENHARMONIC_NAMES[pitch][0];
}

export function cycleLetter(letter: string, steps: number): string {
  const index = NOTE_LETTERS.indexOf(letter as typeof NOTE_LETTERS[number]);
  const nextIndex = ((index + steps) % NOTE_LETTERS.length + NOTE_LETTERS.length) % NOTE_LETTERS.length;
  return NOTE_LETTERS[nextIndex];
}

export function getLetterForPitch(pitch: PitchClass, preferredAccidental: 'sharp' | 'flat' | 'natural' = 'natural'): string {
  const candidates = ENHARMONIC_NAMES[pitch];
  if (preferredAccidental === 'natural') {
    const natural = candidates.find((name) => !name.includes('#') && !name.includes('b'));
    if (natural) return natural;
  }
  if (preferredAccidental === 'flat') {
    const flat = candidates.find((name) => name.includes('b'));
    if (flat) return flat;
  }
  if (preferredAccidental === 'sharp') {
    const sharp = candidates.find((name) => name.includes('#'));
    if (sharp) return sharp;
  }
  return candidates[0];
}

export function getNameForDegree(root: string, semitone: number, degreeLetter: string): string {
  const rootPitch = getPitchClass(root);
  if (rootPitch === null) {
    return getLetterForPitch(normalizePitchClass(semitone as PitchClass));
  }

  const expectedLetter = degreeLetter;
  const expectedNaturalPitch = LETTER_TO_PITCH[expectedLetter];
  if (expectedNaturalPitch === undefined) {
    return getLetterForPitch(normalizePitchClass(semitone as PitchClass));
  }

  const interval = normalizePitchClass(semitone as PitchClass - expectedNaturalPitch);
  if (interval === 0) {
    return expectedLetter;
  }
  if (interval === 1) {
    return `${expectedLetter}#`;
  }
  if (interval === 11) {
    return `${expectedLetter}b`;
  }
  if (interval === 2) {
    return `${expectedLetter}##`;
  }
  if (interval === 10) {
    return `${expectedLetter}bb`;
  }
  return getLetterForPitch(normalizePitchClass(semitone as PitchClass));
}

function getAccidentalCount(noteName: string) {
  return noteName.replace(/[^#b]/g, '').length;
}

export function getScaleSpellings(root: string, formula: number[]): string[] {
  const rootPitch = getPitchClass(root);
  if (rootPitch === null) {
    return formula.map((value) => getLetterForPitch(normalizePitchClass(value as PitchClass)));
  }

  const rootLetter = root[0];
  const startIndex = NOTE_LETTERS.indexOf(rootLetter as typeof NOTE_LETTERS[number]);
  let previousIndex = startIndex;

  return formula.map((interval, offset) => {
    const targetPitch = normalizePitchClass(rootPitch + interval);
    if (offset === 0) {
      return root;
    }

    let bestSpelling: string | null = null;
    let bestScore: number | null = null;
    let bestIndex = previousIndex;

    for (let candidateIndex = 0; candidateIndex < NOTE_LETTERS.length; candidateIndex++) {
      const candidateLetter = NOTE_LETTERS[candidateIndex];
      const candidateName = getNameForDegree(root, targetPitch, candidateLetter);
      if (getPitchClass(candidateName) === targetPitch) {
        const accidentalCount = getAccidentalCount(candidateName);
        const letterDistance = Math.min(
          Math.abs(candidateIndex - previousIndex),
          NOTE_LETTERS.length - Math.abs(candidateIndex - previousIndex),
        );
        const score = accidentalCount * 100 + letterDistance;
        if (bestScore === null || score < bestScore) {
          bestScore = score;
          bestSpelling = candidateName;
          bestIndex = candidateIndex;
        }
      }
    }

    if (bestSpelling !== null) {
      previousIndex = bestIndex;
      return bestSpelling;
    }

    return getLetterForPitch(targetPitch);
  });
}

export function getScaleDegreeLetters(root: string): string[] {
  const rootLetter = root[0];
  const startIndex = NOTE_LETTERS.indexOf(rootLetter as typeof NOTE_LETTERS[number]);
  return NOTE_LETTERS.slice(startIndex).concat(NOTE_LETTERS.slice(0, startIndex));
}
