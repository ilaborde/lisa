import { normalizePitchClass, getPitchClass } from './notes';

export type IntervalInfo = {
  semitones: number;
  degree: string;
  quality: string;
  description: string;
};

const INTERVALS: Record<number, IntervalInfo> = {
  0: { semitones: 0, degree: '1', quality: 'unísono', description: 'unísono' },
  1: { semitones: 1, degree: 'b2', quality: 'segunda menor', description: 'segunda menor' },
  2: { semitones: 2, degree: '2', quality: 'segunda mayor', description: 'segunda mayor' },
  3: { semitones: 3, degree: 'b3', quality: 'tercera menor', description: 'tercera menor' },
  4: { semitones: 4, degree: '3', quality: 'tercera mayor', description: 'tercera mayor' },
  5: { semitones: 5, degree: '4', quality: 'cuarta justa', description: 'cuarta justa' },
  6: { semitones: 6, degree: 'b5 / #4', quality: 'tritono', description: 'quinta disminuida / cuarta aumentada' },
  7: { semitones: 7, degree: '5', quality: 'quinta justa', description: 'quinta justa' },
  8: { semitones: 8, degree: 'b6', quality: 'sexta menor', description: 'sexta menor' },
  9: { semitones: 9, degree: '6', quality: 'sexta mayor', description: 'sexta mayor' },
  10: { semitones: 10, degree: 'b7', quality: 'séptima menor', description: 'séptima menor' },
  11: { semitones: 11, degree: '7', quality: 'séptima mayor', description: 'séptima mayor' },
};

export function getIntervalInfo(semitones: number): IntervalInfo {
  const normalized = normalizePitchClass(semitones);
  return INTERVALS[normalized] ?? INTERVALS[0];
}

export function getIntervalBetween(noteA: string, noteB: string) {
  const aPitch = getPitchClass(noteA);
  const bPitch = getPitchClass(noteB);
  if (aPitch === null || bPitch === null) {
    return getIntervalInfo(0);
  }
  const diff = normalizePitchClass(bPitch - aPitch);
  return getIntervalInfo(diff);
}

export function formatIntervalLabel(noteA: string, noteB: string) {
  const interval = getIntervalBetween(noteA, noteB);
  return `${interval.semitones} semitonos · ${interval.description}`;
}

export const intervalLabels = Object.values(INTERVALS).map((interval) => interval.degree);
