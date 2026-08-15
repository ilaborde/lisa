export * from './notes';
export * from './intervals';
export * from './scales';
export * from './chords';
export * from './harmonization';
export * from './fretboard';
export * from './voicings';
export * from './compatibility';
export * from './progressions';
export * from './composition';
export * from './styleProgressions';
export * from './practiceSuggestions';
export * from './arpeggios';
export * from './compositionVariations';

import { getIntervalBetween } from './intervals';
import { getChordFromScale } from './chords';

export const buildInterval = getIntervalBetween;
export const getChordFromRoot = getChordFromScale;
