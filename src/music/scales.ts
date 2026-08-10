import { getPitchClass, getScaleSpellings, normalizePitchClass, spellPitchWithLetter, cycleLetter } from './notes';
import { getIntervalInfo } from './intervals';

export type ScaleKey = 'ionian' | 'dorian' | 'phrygian' | 'lydian' | 'mixolydian' | 'aeolian' | 'locrian' | 'major' | 'minor' | 'major-pentatonic' | 'minor-pentatonic' | 'minor-blues';
export type DiatonicModeKey = 'ionian' | 'dorian' | 'phrygian' | 'lydian' | 'mixolydian' | 'aeolian' | 'locrian';

export type ScaleRecord = {
  key: ScaleKey;
  name: string;
  formula: readonly number[];
  degrees: readonly number[];
  description: string;
  modeDegree?: number;
  characteristicDegree?: string;
  characteristicDescription?: string;
  omittedDegrees?: readonly string[];
  pedagogicalNotes?: readonly string[];
};

export const SCALE_DEFINITIONS: readonly ScaleRecord[] = [
  { key: 'ionian', name: 'Jónico', formula: [0,2,4,5,7,9,11], degrees: [1,2,3,4,5,6,7], modeDegree: 1, description: 'El modo mayor de referencia.' },
  { key: 'dorian', name: 'Dórico', formula: [0,2,3,5,7,9,10], degrees: [1,2,3,4,5,6,7], modeDegree: 2, description: 'Modo menor con sexta mayor.', characteristicDegree: '6', characteristicDescription: 'La sexta mayor lo distingue de otros modos menores.' },
  { key: 'phrygian', name: 'Frigio', formula: [0,1,3,5,7,8,10], degrees: [1,2,3,4,5,6,7], modeDegree: 3, description: 'Modo menor con segunda menor.', characteristicDegree: 'b2', characteristicDescription: 'La segunda menor aporta su tensión característica.' },
  { key: 'lydian', name: 'Lidio', formula: [0,2,4,6,7,9,11], degrees: [1,2,3,4,5,6,7], modeDegree: 4, description: 'Modo mayor con cuarta aumentada.', characteristicDegree: '#4', characteristicDescription: 'La cuarta aumentada lo diferencia del modo mayor.' },
  { key: 'mixolydian', name: 'Mixolidio', formula: [0,2,4,5,7,9,10], degrees: [1,2,3,4,5,6,7], modeDegree: 5, description: 'Modo mayor con séptima menor.', characteristicDegree: 'b7', characteristicDescription: 'La séptima menor lo diferencia de la escala mayor.' },
  { key: 'aeolian', name: 'Eólico', formula: [0,2,3,5,7,8,10], degrees: [1,2,3,4,5,6,7], modeDegree: 6, description: 'La escala menor natural.', characteristicDegree: 'b6', characteristicDescription: 'La sexta menor es un rasgo modal frente a otros modos menores.' },
  { key: 'locrian', name: 'Locrio', formula: [0,1,3,5,6,8,10], degrees: [1,2,3,4,5,6,7], modeDegree: 7, description: 'Modo menor inestable con quinta disminuida.', characteristicDegree: 'b5', characteristicDescription: 'La quinta disminuida debilita el acorde de tónica.' },
  { key: 'major', name: 'Mayor', formula: [0,2,4,5,7,9,11], degrees: [1,2,3,4,5,6,7], description: 'Escala diatónica mayor.' },
  { key: 'minor', name: 'Menor natural', formula: [0,2,3,5,7,8,10], degrees: [1,2,3,4,5,6,7], description: 'Escala menor natural.', characteristicDegree: 'b6', characteristicDescription: 'La sexta menor es un rasgo de la escala menor natural.' },
  { key: 'major-pentatonic', name: 'Pentatónica mayor', formula: [0,2,4,7,9], degrees: [1,2,3,5,6], description: 'Pentatónica de carácter mayor.', omittedDegrees: ['4','7'], pedagogicalNotes: ['No contiene semitonos.'] },
  { key: 'minor-pentatonic', name: 'Pentatónica menor', formula: [0,3,5,7,10], degrees: [1,3,4,5,7], description: 'Pentatónica de carácter menor.' },
  { key: 'minor-blues', name: 'Blues menor', formula: [0,3,5,6,7,10], degrees: [1,3,4,5,5,7], description: 'Pentatónica menor con la blue note añadida.', characteristicDegree: 'b5', characteristicDescription: 'La b5 funciona como blue note.' },
];

export const ALL_SCALES = SCALE_DEFINITIONS;
export const DIATONIC_MODE_ORDER: readonly DiatonicModeKey[] = ['lydian','ionian','mixolydian','dorian','aeolian','phrygian','locrian'];

export function getScaleByKey(key: ScaleKey): ScaleRecord { return SCALE_DEFINITIONS.find((scale) => scale.key === key) ?? SCALE_DEFINITIONS[0]; }
export function getScaleFormula(key: ScaleKey) { return getScaleByKey(key).formula; }
export function getScaleNotes(root: string, key: ScaleKey) { const scale = getScaleByKey(key); return getScaleSpellings(root, scale.formula, scale.degrees); }
export function getScaleDegreeNames(key: ScaleKey) { return getScaleByKey(key).formula.map((interval) => getIntervalInfo(interval).degree); }
export function getScaleDescription(key: ScaleKey) { return getScaleByKey(key).description; }
export function getScaleName(key: ScaleKey) { return getScaleByKey(key).name; }
export function getModeOrder() { return DIATONIC_MODE_ORDER; }
export function isDiatonicMode(key: ScaleKey): key is DiatonicModeKey { return getScaleByKey(key).modeDegree !== undefined; }

export function getParentMajor(root: string, key: ScaleKey): { root: string; name: string } | null {
  const scale = getScaleByKey(key);
  if (!scale.modeDegree) return null;
  const rootPitch = getPitchClass(root);
  if (rootPitch === null) return null;
  const majorIntervals = [0,2,4,5,7,9,11];
  const parentPitch = normalizePitchClass(rootPitch - majorIntervals[scale.modeDegree - 1]);
  const parentLetter = cycleLetter(root[0], -(scale.modeDegree - 1));
  const parentRoot = spellPitchWithLetter(parentPitch, parentLetter);
  return { root: parentRoot, name: `${parentRoot} mayor` };
}
