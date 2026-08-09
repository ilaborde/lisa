import { getPitchClass, normalizePitchClass, getPitchName, getScaleSpellings } from './notes';
import { getScaleDegreeNames, getScaleCharacteristic, getScaleFormula } from './scales';
import { ScaleKey } from './scales';

export const STANDARD_TUNING = ['E', 'A', 'D', 'G', 'B', 'E'] as const;

export type FretboardCell = {
  stringName: string;
  fret: number;
  note: string;
  inScale: boolean;
  degree?: string;
  isRoot: boolean;
  isCharacteristic: boolean;
};

export function buildFretboard(root: string, scaleKey: ScaleKey, labelMode: 'notes' | 'degrees' | 'both') {
  const scaleNotes = getScaleSpellings(root, getScaleFormula(scaleKey));
  const scalePitches = scaleNotes.map((note) => getPitchClass(note)).filter((value): value is number => value !== null);
  const scaleSpellingMap = Object.fromEntries(
    scaleNotes.map((note) => [getPitchClass(note) ?? 0, note]),
  ) as Record<number, string>;
  const rootPitch = getPitchClass(root)!;
  const characteristic = getScaleCharacteristic(scaleKey);

  return STANDARD_TUNING.map((stringRoot) => {
    const openPitch = getPitchClass(stringRoot)!;
    return Array.from({ length: 13 }, (_, fret) => {
      const pitch = normalizePitchClass(openPitch + fret);
      const note = scaleSpellingMap[pitch] ?? getPitchName(pitch);
      const inScale = scalePitches.includes(pitch);
      const isRoot = pitch === rootPitch;
      const degreeInfo = getScaleDegreeNames(scaleKey).find((_, index) => {
        const expectedPitch = normalizePitchClass(rootPitch + getScaleFormula(scaleKey)[index]);
        return expectedPitch === pitch;
      });
      return {
        stringName: stringRoot,
        fret,
        note,
        inScale,
        degree: degreeInfo,
        isRoot,
        isCharacteristic: degreeInfo === characteristic,
      };
    });
  });
}
