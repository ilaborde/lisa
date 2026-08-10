import { getChordTypeByKey, type ChordQuality } from './chords';
import { getPitchClass, getPitchName, normalizePitchClass } from './notes';
import { STANDARD_TUNING } from './fretboard';

export type ChordInversion = 'root' | 'first' | 'second' | 'third';
export type VoicingPosition = { string: string; stringIndex: number; fret: number; pitchClass: number; noteName: string; chordTone: number };
export type GuitarVoicing = { id: string; positions: VoicingPosition[]; inversion: ChordInversion; bassNote: string; minFret: number; maxFret: number };

const INVERSION_NAMES: ChordInversion[] = ['root','first','second','third'];

export function buildVoicings(root: string, quality: ChordQuality, maxFret = 15): GuitarVoicing[] {
  const rootPitch = getPitchClass(root); if (rootPitch === null) return [];
  const formula = getChordTypeByKey(quality).formula;
  const chordPitches = formula.map(interval => normalizePitchClass(rootPitch + interval));
  const candidates = STANDARD_TUNING.map((string, stringIndex) => {
    const open = getPitchClass(string)!;
    return Array.from({length:maxFret+1},(_,fret)=>({string,stringIndex,fret,pitchClass:normalizePitchClass(open+fret)}))
      .filter(position=>chordPitches.includes(position.pitchClass));
  });
  const results = new Map<string,GuitarVoicing>();
  for(let start=0;start<=maxFret;start++){
    const end=start===0?4:Math.min(maxFret,start+4);
    for(let bassString=0;bassString<4;bassString++){
      const bassOptions=candidates[bassString].filter(p=>p.fret>=start&&p.fret<=end);
      for(const bass of bassOptions){
        const positions=[bass];
        for(let s=bassString+1;s<6;s++){
          const options=candidates[s].filter(p=>p.fret>=start&&p.fret<=end);
          if(options.length){
            const missing=chordPitches.find(p=>!positions.some(pos=>pos.pitchClass===p));
            positions.push(options.find(p=>p.pitchClass===missing)??options[0]);
          }
        }
        if(positions.length<3||!chordPitches.every(p=>positions.some(pos=>pos.pitchClass===p))) continue;
        const tone=chordPitches.indexOf(bass.pitchClass); const inversion=INVERSION_NAMES[tone]??'root';
        const normalized=positions.map(p=>({...p,noteName:getPitchName(p.pitchClass,root.includes('b')?'flat':'sharp'),chordTone:chordPitches.indexOf(p.pitchClass)}));
        const id=normalized.map(p=>`${p.stringIndex}:${p.fret}`).join('-');
        results.set(id,{id,positions:normalized,inversion,bassNote:normalized[0].noteName,minFret:Math.min(...normalized.map(p=>p.fret)),maxFret:Math.max(...normalized.map(p=>p.fret))});
      }
    }
  }
  return [...results.values()].sort((a,b)=>a.minFret-b.minFret||a.inversion.localeCompare(b.inversion)).slice(0,36);
}
