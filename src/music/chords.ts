import { cycleLetter, getPitchClass, normalizePitchClass, spellPitchWithLetter } from './notes';
import { getIntervalInfo } from './intervals';
import { getScaleByKey, getScaleDegreeNames, getScaleNotes, type ScaleKey } from './scales';

export type TriadQuality = 'major' | 'minor' | 'diminished' | 'augmented' | 'sus2' | 'sus4';
export type SeventhChordQuality = 'dominant7' | 'major7' | 'minor7' | 'halfDiminished7' | 'diminished7';
export type ChordQuality = TriadQuality | SeventhChordQuality;

export type ChordTypeRecord = { key: ChordQuality; label: string; suffix: string; formula: readonly number[]; degrees: readonly number[] };
export const ALL_CHORD_TYPES: readonly ChordTypeRecord[] = [
  { key:'major', label:'Mayor', suffix:'', formula:[0,4,7], degrees:[1,3,5] }, { key:'minor', label:'Menor', suffix:'m', formula:[0,3,7], degrees:[1,3,5] },
  { key:'diminished', label:'Disminuido', suffix:'dim', formula:[0,3,6], degrees:[1,3,5] }, { key:'augmented', label:'Aumentado', suffix:'aug', formula:[0,4,8], degrees:[1,3,5] },
  { key:'sus2', label:'Sus2', suffix:'sus2', formula:[0,2,7], degrees:[1,2,5] }, { key:'sus4', label:'Sus4', suffix:'sus4', formula:[0,5,7], degrees:[1,4,5] },
  { key:'dominant7', label:'7', suffix:'7', formula:[0,4,7,10], degrees:[1,3,5,7] }, { key:'major7', label:'Maj7', suffix:'maj7', formula:[0,4,7,11], degrees:[1,3,5,7] },
  { key:'minor7', label:'m7', suffix:'m7', formula:[0,3,7,10], degrees:[1,3,5,7] }, { key:'halfDiminished7', label:'m7b5', suffix:'m7b5', formula:[0,3,6,10], degrees:[1,3,5,7] },
  { key:'diminished7', label:'dim7', suffix:'dim7', formula:[0,3,6,9], degrees:[1,3,5,7] },
];

export type ChordRecord = { root:string; type:ChordQuality; label:string; notes:string[]; degrees:string[]; intervals:string[]; quality:ChordQuality; qualityLabel:string; degreeName:string };
export function isChordQuality(value: string): value is ChordQuality { return ALL_CHORD_TYPES.some((type) => type.key === value); }
export function getChordTypeByKey(key: ChordQuality) { return ALL_CHORD_TYPES.find((chord) => chord.key === key) ?? ALL_CHORD_TYPES[0]; }

export function buildChord(root: string, typeKey: ChordQuality): ChordRecord | null {
  const rootPitch = getPitchClass(root); if (rootPitch === null) return null;
  const type = getChordTypeByKey(typeKey);
  const notes = type.formula.map((interval, index) => spellPitchWithLetter(rootPitch + interval, cycleLetter(root[0], type.degrees[index] - 1)));
  return { root, type:type.key, label:`${root}${type.suffix}`, notes, degrees:type.formula.map((i)=>getIntervalInfo(i).degree), intervals:type.formula.map((i)=>getIntervalInfo(i).description), quality:type.key, qualityLabel:type.label, degreeName:'' };
}

function qualityFrom(intervals: number[]): ChordQuality {
  const signature = intervals.join(',');
  const match = ALL_CHORD_TYPES.find((type) => type.formula.join(',') === signature);
  return match?.key ?? 'minor';
}

export function getChordFromScale(root: string, scaleKey: ScaleKey, tetrads = false): ChordRecord[] {
  const scale = getScaleByKey(scaleKey);
  if (scale.formula.length !== 7) return [];
  const notes = getScaleNotes(root, scaleKey);
  const degreeNames = getScaleDegreeNames(scaleKey);
  return notes.map((note, index) => {
    const indexes = tetrads ? [index,index+2,index+4,index+6] : [index,index+2,index+4];
    const chordNotes = indexes.map((i) => notes[i % 7]);
    const chordRootPitch = getPitchClass(note)!;
    const intervals = chordNotes.map((item) => normalizePitchClass(getPitchClass(item)! - chordRootPitch));
    const quality = qualityFrom(intervals);
    const definition = getChordTypeByKey(quality);
    const accidental = degreeNames[index].replace(/[1-7]/g, '').replace(' / #4', '');
    const romanBase = ['I','II','III','IV','V','VI','VII'][index];
    const roman = quality === 'minor' || quality === 'minor7' || quality === 'halfDiminished7' || quality === 'diminished' || quality === 'diminished7' ? romanBase.toLowerCase() : romanBase;
    const symbol = quality === 'diminished' || quality === 'diminished7' ? '°' : quality === 'halfDiminished7' ? 'ø' : quality === 'augmented' ? '+' : '';
    return { root:note, type:quality, label:`${note}${definition.suffix}`, notes:chordNotes, degrees:intervals.map((i)=>getIntervalInfo(i).degree), intervals:intervals.map((i)=>getIntervalInfo(i).description), quality, qualityLabel:definition.label, degreeName:`${accidental}${roman}${symbol}` };
  });
}
