export * from './notes';
export * from './intervals';
export * from './scales';
export * from './chords';
export * from './harmonization';
export * from './fretboard';

import { getIntervalBetween } from './intervals';
import { getChordFromScale } from './chords';

export const buildInterval = getIntervalBetween;
export const getChordFromRoot = getChordFromScale;
