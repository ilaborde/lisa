import {ALL_CHORD_TYPES,buildChord,type ChordQuality} from './chords';
import {getPitchClass,normalizePitchClass,ROOT_OPTIONS,type PitchClass} from './notes';
import {getScaleDegreeNames,getScaleNotes,SELECTABLE_SCALES,type ScaleKey} from './scales';

export type ChordScaleMatch={scaleKey:ScaleKey;scaleName:string;root:string;notes:string[];availableTensions:string[];cautionNotes:string[]};
export type DetectedChord={root:string;quality:ChordQuality;label:string;notes:string[]};
export type DetectedScale={root:string;scaleKey:ScaleKey;label:string;notes:string[];exact:boolean};

function pitchSet(notes:readonly string[]){return new Set(notes.map(getPitchClass).filter((p):p is PitchClass=>p!==null))}
function sameSet(a:ReadonlySet<number>,b:ReadonlySet<number>){return a.size===b.size&&[...a].every(p=>b.has(p))}

export function getChordScaleMatches(root:string,quality:ChordQuality):ChordScaleMatch[]{
 const chord=buildChord(root,quality);if(!chord)return[];const chordPitches=pitchSet(chord.notes);
 return SELECTABLE_SCALES.map(scale=>{const notes=getScaleNotes(root,scale.key),degrees=getScaleDegreeNames(scale.key),scalePitches=pitchSet(notes);if(![...chordPitches].every(p=>scalePitches.has(p)))return null;
  const extras=notes.map((note,index)=>({note,degree:degrees[index]})).filter(({note})=>!chordPitches.has(getPitchClass(note)!));
  const isMajor=quality==='major'||quality==='major7'||quality==='dominant7'||quality==='augmented';
  const caution=extras.filter(({degree})=>isMajor?degree==='4'||degree==='b2':degree==='b2').map(({note,degree})=>`${note} (${degree})`);
  return{scaleKey:scale.key,scaleName:scale.name,root,notes,availableTensions:extras.filter(x=>!caution.some(c=>c.startsWith(`${x.note} (`))).map(({note,degree})=>`${note} (${degree})`),cautionNotes:caution};
 }).filter((match):match is ChordScaleMatch=>match!==null);
}

export function detectChords(selectedPitches:readonly number[]):DetectedChord[]{
 const selected=new Set(selectedPitches.map(normalizePitchClass));if(selected.size<2)return[];const matches:DetectedChord[]=[];
 for(const root of ROOT_OPTIONS){for(const type of ALL_CHORD_TYPES){const chord=buildChord(root,type.key);if(!chord)continue;if(sameSet(selected,pitchSet(chord.notes))&&!matches.some(m=>m.label===chord.label))matches.push({root,quality:type.key,label:chord.label,notes:chord.notes})}}
 return matches;
}

export function detectScales(selectedPitches:readonly number[]):DetectedScale[]{
 const selected=new Set(selectedPitches.map(normalizePitchClass));if(!selected.size)return[];const matches:DetectedScale[]=[];
 for(const root of ROOT_OPTIONS){for(const scale of SELECTABLE_SCALES){const notes=getScaleNotes(root,scale.key),pitches=pitchSet(notes);if([...selected].every(p=>pitches.has(p))){const identity=`${getPitchClass(root)}:${scale.formula.join(',')}`;if(!matches.some(m=>`${getPitchClass(m.root)}:${SELECTABLE_SCALES.find(s=>s.key===m.scaleKey)?.formula.join(',')}`===identity))matches.push({root,scaleKey:scale.key,label:`${root} ${scale.name}`,notes,exact:sameSet(selected,pitches)})}}}
 return matches.sort((a,b)=>Number(b.exact)-Number(a.exact)||a.notes.length-b.notes.length).slice(0,24);
}
