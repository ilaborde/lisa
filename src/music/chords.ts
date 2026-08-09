import { getPitchClass, normalizePitchClass, getScaleSpellings } from './notes';
import { getIntervalInfo } from './intervals';
import { getScaleFormula, ScaleKey } from './scales';

export type ChordQualities = 'mayor' | 'menor' | 'disminuido' | 'aumentado' | 'sust2' | 'sust4' | '7' | 'maj7' | 'm7' | 'm7b5' | 'dim7';

export type ChordTypeRecord = {
  key: ChordQualities;
  label: string;
  formula: number[];
};

export const ALL_CHORD_TYPES: ChordTypeRecord[] = [
  { key: 'mayor', label: 'Mayor', formula: [0, 4, 7] },
  { key: 'menor', label: 'Menor', formula: [0, 3, 7] },
  { key: 'disminuido', label: 'Disminuido', formula: [0, 3, 6] },
  { key: 'aumentado', label: 'Aumentado', formula: [0, 4, 8] },
  { key: 'sust2', label: 'Sus2', formula: [0, 2, 7] },
  { key: 'sust4', label: 'Sus4', formula: [0, 5, 7] },
  { key: '7', label: '7', formula: [0, 4, 7, 10] },
  { key: 'maj7', label: 'Maj7', formula: [0, 4, 7, 11] },
  { key: 'm7', label: 'm7', formula: [0, 3, 7, 10] },
  { key: 'm7b5', label: 'm7b5', formula: [0, 3, 6, 10] },
  { key: 'dim7', label: 'dim7', formula: [0, 3, 6, 9] },
];

export type ChordRecord = {
  root: string;
  type: ChordQualities;
  label: string;
  notes: string[];
  degrees: string[];
  intervals: string[];
  quality: string;
  degreeName: string;
};

export function getChordTypeByKey(key: ChordQualities) {
  return ALL_CHORD_TYPES.find((chord) => chord.key === key) ?? ALL_CHORD_TYPES[0];
}

export function buildChord(root: string, typeKey: ChordQualities) {
  const chordType = getChordTypeByKey(typeKey);
  const rootPitch = getPitchClass(root);
  if (rootPitch === null) {
    return null;
  }

  const notes = chordType.formula.map((interval) => {
    const pitch = normalizePitchClass(rootPitch + interval);
    return getScaleSpellings(root, [interval])[0];
  });

  const degrees = chordType.formula.map((interval) => getIntervalInfo(interval).degree);
  const intervals = chordType.formula.map((interval) => getIntervalInfo(interval).description);

  return {
    root,
    type: chordType.key,
    label: `${root} ${chordType.label}`,
    notes,
    degrees,
    intervals,
    quality: chordType.label,
    degreeName: '',
  };
}

export function getChordFromScale(root: string, scaleKey: ScaleKey, tetrads = false) {
  const formula = getScaleFormula(scaleKey);
  const scaleNotes = getScaleSpellings(root, formula);
  const chords = scaleNotes.map((note, index) => {
    const chordNotes = [scaleNotes[index], scaleNotes[(index + 2) % scaleNotes.length], scaleNotes[(index + 4) % scaleNotes.length]];
    const triadIntervals = chordNotes.map((target) => {
      const rootPitch = getPitchClass(note);
      const targetPitch = getPitchClass(target);
      return rootPitch !== null && targetPitch !== null ? normalizePitchClass(targetPitch - rootPitch) : 0;
    });
    const quality = determineChordQuality(triadIntervals);
    const label = `${note}${quality === 'mayor' ? '' : quality === 'menor' ? 'm' : quality === 'disminuido' ? 'dim' : quality === 'aumentado' ? 'aug' : ''}`;
    const degrees = triadIntervals.map((interval) => getIntervalInfo(interval).degree);
    const intervals = triadIntervals.map((interval) => getIntervalInfo(interval).description);

    let notesToShow = chordNotes;
    if (tetrads) {
      notesToShow = [...chordNotes, scaleNotes[(index + 6) % scaleNotes.length]];
    }

    const tetradQuality = tetrads ? determineTetradQuality(notesToShow, note) : '';
    const chordName = tetrads ? `${note}${tetradQuality}` : label;

    return {
      root: note,
      type: tetrads ? (tetradQuality as ChordQualities) : (quality as ChordQualities),
      label: chordName,
      notes: notesToShow,
      degrees: notesToShow.map((target) => {
        const rootPitch = getPitchClass(note);
        const targetPitch = getPitchClass(target);
        const interval = rootPitch !== null && targetPitch !== null ? normalizePitchClass(targetPitch - rootPitch) : 0;
        return getIntervalInfo(interval).degree;
      }),
      intervals: notesToShow.map((target) => {
        const rootPitch = getPitchClass(note);
        const targetPitch = getPitchClass(target);
        const interval = rootPitch !== null && targetPitch !== null ? normalizePitchClass(targetPitch - rootPitch) : 0;
        return getIntervalInfo(interval).description;
      }),
      quality: tetrads ? tetradQuality : quality,
      degreeName: getScaleDegreeName(index),
    };
  });

  return chords;
}

function determineChordQuality(intervals: number[]) {
  if (intervals[1] === 4 && intervals[2] === 7) return 'mayor';
  if (intervals[1] === 3 && intervals[2] === 7) return 'menor';
  if (intervals[1] === 3 && intervals[2] === 6) return 'disminuido';
  if (intervals[1] === 4 && intervals[2] === 8) return 'aumentado';
  return 'menor';
}

function determineTetradQuality(notes: string[], root: string) {
  const rootPitch = getPitchClass(root);
  if (rootPitch === null) return 'm7';
  const pitches = notes.map((note) => getPitchClass(note) ?? 0);
  const intervals = pitches.map((pitch) => normalizePitchClass(pitch - rootPitch));
  const third = intervals[1];
  const fifth = intervals[2];
  const seventh = intervals[3];
  if (third === 4 && fifth === 7 && seventh === 11) return 'maj7';
  if (third === 4 && fifth === 7 && seventh === 10) return '7';
  if (third === 3 && fifth === 7 && seventh === 10) return 'm7';
  if (third === 3 && fifth === 6 && seventh === 10) return 'm7b5';
  if (third === 3 && fifth === 6 && seventh === 9) return 'dim7';
  return 'm7';
}

function getScaleDegreeName(index: number) {
  return ['I', 'ii', 'iii', 'IV', 'v', 'vi', 'bVII'][index] ?? '';
}
