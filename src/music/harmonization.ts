import { getChordFromScale } from './chords';
import { ScaleKey } from './scales';

export function harmonizeScale(root: string, scaleKey: ScaleKey, tetrads = false) {
  return getChordFromScale(root, scaleKey, tetrads);
}
