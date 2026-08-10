import {buildChord,getChordFromScale,type ChordRecord} from './chords';
import {cycleLetter,getPitchClass,normalizePitchClass,spellPitchWithLetter} from './notes';
import {getScaleByKey,type ScaleKey} from './scales';

export type BorrowedChord={chord:ChordRecord;source:string};
export type SecondaryDominant={chord:ChordRecord;target:ChordRecord;functionLabel:string};
export type CadenceKind='authentic'|'plagal'|'half'|'deceptive';
export type Cadence={key:CadenceKind;name:string;description:string;chords:ChordRecord[]};
export type VoiceMovement={from:string;to:string;semitones:number;direction:'común'|'ascendente'|'descendente'};
export type VoiceLeadingAnalysis={from:string;to:string;commonTones:string[];movements:VoiceMovement[];summary:string};

function pitchDistance(from:number,to:number){let distance=normalizePitchClass(to-from);if(distance>6)distance-=12;return distance}

export function analyzeVoiceLeading(from:ChordRecord,to:ChordRecord):VoiceLeadingAnalysis{
 const source=from.notes.map(note=>({note,pitch:getPitchClass(note)!}));const target=to.notes.map(note=>({note,pitch:getPitchClass(note)!}));
 const movements=target.map(destination=>{const nearest=source.map(origin=>({origin,distance:pitchDistance(origin.pitch,destination.pitch)})).sort((a,b)=>Math.abs(a.distance)-Math.abs(b.distance))[0];return{from:nearest.origin.note,to:destination.note,semitones:nearest.distance,direction:nearest.distance===0?'común':nearest.distance>0?'ascendente':'descendente'} as VoiceMovement});
 const commonTones=movements.filter(move=>move.semitones===0).map(move=>move.to);
 const stepwise=movements.filter(move=>Math.abs(move.semitones)<=2&&move.semitones!==0).length;
 return{from:from.label,to:to.label,commonTones,movements,summary:`${commonTones.length} nota${commonTones.length===1?'':'s'} en común · ${stepwise} movimiento${stepwise===1?'':'s'} por tono o semitono`};
}

export function getBorrowedChords(root:string,scaleKey:ScaleKey):BorrowedChord[]{
 const scale=getScaleByKey(scaleKey);if(scale.formula.length!==7)return[];const parallelKey:ScaleKey=scale.formula.includes(4)?'aeolian':'ionian';const current=getChordFromScale(root,scaleKey);const currentSignatures=new Set(current.map(chord=>`${getPitchClass(chord.root)}:${chord.quality}`));
 return getChordFromScale(root,parallelKey).filter(chord=>!currentSignatures.has(`${getPitchClass(chord.root)}:${chord.quality}`)).map(chord=>({chord,source:`${root} ${getScaleByKey(parallelKey).name}`}));
}

export function getSecondaryDominants(root:string,scaleKey:ScaleKey):SecondaryDominant[]{
 const harmony=getChordFromScale(root,scaleKey);return harmony.slice(1).map(target=>{const targetPitch=getPitchClass(target.root)!;const dominantLetter=cycleLetter(target.root[0],4);const dominantRoot=spellPitchWithLetter(targetPitch+7,dominantLetter);const chord=buildChord(dominantRoot,'dominant7')!;return{chord,target,functionLabel:`V7/${target.degreeName}`}});
}

export function getCadences(root:string,scaleKey:ScaleKey):Cadence[]{
 const harmony=getChordFromScale(root,scaleKey);if(harmony.length!==7)return[];return[
  {key:'authentic',name:'Cadencia auténtica',description:'V–I: resolución fuerte hacia la tónica.',chords:[harmony[4],harmony[0]]},
  {key:'plagal',name:'Cadencia plagal',description:'IV–I: resolución más suave.',chords:[harmony[3],harmony[0]]},
  {key:'half',name:'Semicadencia',description:'ii–V: queda abierta sobre la dominante.',chords:[harmony[1],harmony[4]]},
  {key:'deceptive',name:'Cadencia deceptiva',description:'V–vi: evita la resolución esperada a I.',chords:[harmony[4],harmony[5]]},
 ];
}
