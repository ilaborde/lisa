import { getScaleSpellings } from './notes';
import { IntervalInfo, getIntervalInfo } from './intervals';

export type ScaleKey =
  | 'ionian'
  | 'dorian'
  | 'phrygian'
  | 'lydian'
  | 'mixolydian'
  | 'aeolian'
  | 'locrian'
  | 'major'
  | 'minor'
  | 'major-pentatonic'
  | 'minor-pentatonic'
  | 'minor-blues';

export type ScaleRecord = {
  key: ScaleKey;
  name: string;
  formula: number[];
  description: string;
  parent?: ScaleKey;
  characteristic: number;
};

export const SCALE_DEFINITIONS: ScaleRecord[] = [
  {
    key: 'ionian',
    name: 'Jónico',
    formula: [0, 2, 4, 5, 7, 9, 11],
    description: 'Escala mayor clásica con séptima mayor.',
    parent: 'major',
    characteristic: 11,
  },
  {
    key: 'dorian',
    name: 'Dórico',
    formula: [0, 2, 3, 5, 7, 9, 10],
    description: 'Escala menor con sexta mayor y séptima menor.',
    parent: 'minor',
    characteristic: 9,
  },
  {
    key: 'phrygian',
    name: 'Frigio',
    formula: [0, 1, 3, 5, 7, 8, 10],
    description: 'Escala menor con segunda menor, genera tensión oscura.',
    parent: 'minor',
    characteristic: 1,
  },
  {
    key: 'lydian',
    name: 'Lidio',
    formula: [0, 2, 4, 6, 7, 9, 11],
    description: 'Escala mayor con cuarta aumentada, suena brillante.',
    parent: 'major',
    characteristic: 6,
  },
  {
    key: 'mixolydian',
    name: 'Mixolidio',
    formula: [0, 2, 4, 5, 7, 9, 10],
    description: 'Escala mayor con séptima menor.',
    parent: 'major',
    characteristic: 10,
  },
  {
    key: 'aeolian',
    name: 'Eólico',
    formula: [0, 2, 3, 5, 7, 8, 10],
    description: 'Escala menor natural tradicional.',
    parent: 'minor',
    characteristic: 8,
  },
  {
    key: 'locrian',
    name: 'Locrio',
    formula: [0, 1, 3, 5, 6, 8, 10],
    description: 'Escala inestable con quinta disminuida.',
    parent: 'minor',
    characteristic: 6,
  },
  {
    key: 'major',
    name: 'Mayor',
    formula: [0, 2, 4, 5, 7, 9, 11],
    description: 'Escala mayor, tónica a séptima mayor.',
    characteristic: 11,
  },
  {
    key: 'minor',
    name: 'Menor natural',
    formula: [0, 2, 3, 5, 7, 8, 10],
    description: 'Escala natural menor con tercera y séptima menor.',
    characteristic: 8,
  },
  {
    key: 'major-pentatonic',
    name: 'Pentatónica mayor',
    formula: [0, 2, 4, 7, 9],
    description: 'Escala mayor sin 4° y 7° grado.',
    characteristic: 9,
  },
  {
    key: 'minor-pentatonic',
    name: 'Pentatónica menor',
    formula: [0, 3, 5, 7, 10],
    description: 'Escala menor con 1, b3, 4, 5, b7.',
    characteristic: 10,
  },
  {
    key: 'minor-blues',
    name: 'Blues menor',
    formula: [0, 3, 5, 6, 7, 10],
    description: 'Pentatónica menor con nota de blues b5 añadida.',
    characteristic: 6,
  },
];

export const ALL_SCALES = SCALE_DEFINITIONS;

export function getScaleByKey(key: ScaleKey) {
  return SCALE_DEFINITIONS.find((scale) => scale.key === key) ?? SCALE_DEFINITIONS[0];
}

export function getScaleFormula(key: ScaleKey) {
  return getScaleByKey(key).formula;
}

export function getScaleNotes(root: string, key: ScaleKey) {
  return getScaleSpellings(root, getScaleFormula(key));
}

export function getScaleDegreeNames(key: ScaleKey) {
  const scale = getScaleByKey(key);
  return scale.formula.map((interval) => getIntervalInfo(interval).degree);
}

export function getScaleDescription(key: ScaleKey) {
  return getScaleByKey(key).description;
}

export function getScaleCharacteristic(key: ScaleKey) {
  return getIntervalInfo(getScaleByKey(key).characteristic).degree;
}

export function getScaleName(key: ScaleKey) {
  return getScaleByKey(key).name;
}

export function getModeOrder() {
  return ['lydian', 'ionian', 'mixolydian', 'dorian', 'aeolian', 'phrygian', 'locrian'] as const;
}

export function getModeTransition(root: string) {
  return {
    root,
    major: `${root} mayor`,
  };
}
