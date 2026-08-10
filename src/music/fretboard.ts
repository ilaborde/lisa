import { getPitchClass, normalizePitchClass, getPitchName } from './notes';
import { getScaleByKey, getScaleDegreeNames, getScaleNotes, type ScaleKey } from './scales';

export const STANDARD_TUNING = ['E','A','D','G','B','E'] as const;
export type FretboardCell = { pitchClass:number; noteName:string; fret:number; string:string; inScale:boolean; degree?:string; isRoot:boolean; isCharacteristic:boolean };

export function buildFretboard(root:string, scaleKey:ScaleKey): FretboardCell[][] {
  const scale=getScaleByKey(scaleKey), notes=getScaleNotes(root,scaleKey), degrees=getScaleDegreeNames(scaleKey);
  const mapping=new Map(notes.map((note,index)=>[getPitchClass(note),{note,degree:degrees[index]}]));
  const rootPitch=getPitchClass(root); const preference=root.includes('b')?'flat':'sharp';
  return STANDARD_TUNING.map((string)=>Array.from({length:23},(_,fret)=>{
    const pitchClass=normalizePitchClass(getPitchClass(string)!+fret); const match=mapping.get(pitchClass);
    return { pitchClass, noteName:match?.note??getPitchName(pitchClass,preference), fret, string, inScale:Boolean(match), degree:match?.degree, isRoot:pitchClass===rootPitch, isCharacteristic:Boolean(scale.characteristicDegree&&match?.degree===scale.characteristicDegree) };
  }));
}
