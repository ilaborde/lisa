import { getScaleNotes, getScaleFormula, getScaleDegreeNames, getScaleDescription, getScaleByKey, getScaleName, getModeOrder, ScaleKey, ALL_SCALES, getScaleCharacteristic } from './scales';
import { getIntervalInfo, getIntervalBetween } from './intervals';
import { getPitchClass, normalizePitchClass, getScaleSpellings, NOTE_NAMES as NOTE_NAME_LIST } from './notes';
import { getChordFromScale, buildChord, getChordTypeByKey, ChordQualities } from './chords';

export {
  getScaleNotes,
  getScaleFormula,
  getScaleDegreeNames,
  getScaleDescription,
  getScaleByKey,
  getScaleName,
  getModeOrder,
  ALL_SCALES,
  getChordTypeByKey,
  buildChord,
};

export type { ScaleKey } from './scales';
export type { ChordQualities } from './chords';

export const NOTE_NAMES = NOTE_NAME_LIST as readonly string[];

export function getModeByKey(key: ScaleKey) {
  return getScaleByKey(key);
}

export function getScaleCharacteristic(key: ScaleKey) {
  return getIntervalInfo(getScaleByKey(key).characteristic).degree;
}

export function getParallelScaleInfo(root: string, key: ScaleKey) {
  const current = getScaleByKey(key);
  const sameNotes = ALL_SCALES.find((candidate) => {
    if (candidate.key === key) return false;
    const currentNotes = getScaleSpellings(root, current.formula);
    const candidateNotes = getScaleSpellings(root, candidate.formula);
    return currentNotes.join(',') === candidateNotes.join(',');
  });
  return {
    reference: sameNotes ?? current,
  };
}

export function getRelativeMajor(root: string, key: ScaleKey) {
  const scale = getScaleByKey(key);
  if (scale.parent === 'minor') {
    const rootPitch = getPitchClass(root);
    if (rootPitch === null) return { root, name: '' };
    const relativeRoot = NOTE_NAMES[(rootPitch + 3) % 12];
    return { root: relativeRoot, name: 'Mayor relativa' };
  }
  const rootPitch = getPitchClass(root);
  if (rootPitch === null) return { root, name: 'Mayor relativa' };
  const relativeRoot = NOTE_NAMES[(rootPitch + 9) % 12];
  return { root: relativeRoot, name: 'Mayor relativa' };
}

export function getRelativeMinor(root: string, key: ScaleKey) {
  const rootPitch = getPitchClass(root);
  if (rootPitch === null) return { root, name: 'Menor relativa' };
  const relativeRoot = NOTE_NAMES[(rootPitch + 3) % 12];
  return { root: relativeRoot, name: 'Menor relativa' };
}

export function getChordFromRoot(root: string, scaleKey: ScaleKey, tetrads = false) {
  return getChordFromScale(root, scaleKey, tetrads);
}

export function getModeTransition(root: string) {
  return {
    root,
    major: `${root} mayor`,
  };
}

export function buildInterval(noteA: string, noteB: string) {
  return getIntervalBetween(noteA, noteB);
}

export type IntervalQuality = {
  semitones: number;
  degree: string;
  quality: string;
  description: string;
};

export function getChordTypeDefinition(key: ChordQualities) {
  return getChordTypeByKey(key);
}
