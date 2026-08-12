import {buildChord,type ChordQuality,type ChordRecord} from './chords';
import {getPitchClass,normalizePitchClass} from './notes';
import {getScaleNotes,type ScaleKey} from './scales';
import {getIntervalBetween} from './intervals';

export type PracticeGenre='unspecified'|'blues'|'rock'|'funk'|'soul'|'jazz'|'pop';
export type PracticeApproach='global'|'follow'|'chord-tones'|'mixed'|'manual';
export type PracticeMode='free'|'guided'|'challenge';
export type Compatibility='Muy compatible'|'Compatible'|'Color'|'Tensión';
export type PracticeScale={root:string;scaleKey:ScaleKey};
export type ScaleSuggestion=PracticeScale&{label:string;compatibility:Compatibility;explanation:string};
export type FretZone={id:string;label:string;from:number;to:number;position:number};
export type PracticeChordConfig={id:string;chord:ChordRecord;scale:PracticeScale|null;zoneId:string;source:'suggested'|'manual';bars?:number};
export type CountInBars=0|1|2;
export type PracticeSession={name?:string;mode:PracticeMode;genre:PracticeGenre;approach:PracticeApproach;activeChordIndex:number;keepNearby:boolean;target:'third'|'seventh'|'both'|'all';globalScale:PracticeScale|null;chordConfigs:PracticeChordConfig[];bpm:number;beatsPerBar:3|4|6;globalBars:number;loop:boolean;countIn:CountInBars;showNextTarget:boolean};
export type PracticeNoteAnalysis={note:string;scaleRelation:{belongs:boolean;degree:string|null;description:string|null};chordRelation:{belongs:boolean;degree:string|null;role:string|null;description:string|null};importance:'strong-target'|'chord-tone'|'scale-tone'|'contextual'};

export const PRACTICE_GENRES:[PracticeGenre,string][]=[['unspecified','Sin especificar'],['blues','Blues'],['rock','Rock'],['funk','Funk'],['soul','Soul / R&B'],['jazz','Jazz'],['pop','Pop']];
export const PRACTICE_APPROACHES:[PracticeApproach,string][]=[['global','Una escala global'],['follow','Seguir los acordes'],['chord-tones','Chord tones'],['mixed','Mixto'],['manual','Manual']];
export const FRET_ZONES:FretZone[]=[
 {id:'low',label:'Zona baja · trastes 0–5',from:0,to:5,position:1},
 {id:'mid-low',label:'Zona media-baja · trastes 4–9',from:4,to:9,position:2},
 {id:'mid',label:'Zona media · trastes 7–12',from:7,to:12,position:3},
 {id:'mid-high',label:'Zona media-alta · trastes 10–15',from:10,to:15,position:4},
 {id:'high',label:'Zona alta · trastes 14–21',from:14,to:21,position:5},
];

const SCALE_LABEL:Record<ScaleKey,string>={ionian:'Jónico',dorian:'Dórico',phrygian:'Frigio',lydian:'Lidio',mixolydian:'Mixolidio',aeolian:'Eólico',locrian:'Locrio',major:'Mayor',minor:'Menor natural','harmonic-minor':'Menor armónica','melodic-minor':'Menor melódica','major-pentatonic':'Pentatónica mayor','minor-pentatonic':'Pentatónica menor','minor-blues':'Blues'};
export function scaleLabel(scale:PracticeScale){return `${scale.root} ${SCALE_LABEL[scale.scaleKey]}`}
function suggestion(root:string,scaleKey:ScaleKey,compatibility:Compatibility,explanation:string):ScaleSuggestion{return{root,scaleKey,label:scaleLabel({root,scaleKey}),compatibility,explanation}}

export function suggestScales(chord:ChordRecord,progression:readonly ChordRecord[]=[],genre:PracticeGenre='unspecified',approach:PracticeApproach='follow'):ScaleSuggestion[]{
 const r=chord.root,isDominant=chord.quality.startsWith('dominant'),isMinor=chord.quality==='minor'||chord.quality==='minor7';
 const result:ScaleSuggestion[]=[];
 if(isDominant) result.push(suggestion(r,'mixolydian','Muy compatible',`Contiene 1, 2, 3, 4, 5, 6 y b7; incluye los chord tones de ${chord.label}.`));
 if(isMinor) result.push(suggestion(r,'dorian','Muy compatible',`Opción menor directa con 6 mayor sobre ${chord.label}.`));
 if(!isDominant&&!isMinor) result.push(suggestion(r,'major','Muy compatible',`Presenta la tríada mayor de ${chord.label} de forma directa.`));
 result.push(suggestion(r,'major-pentatonic','Compatible',`Sonido abierto; contiene 1, 2, 3, 5 y 6.`));
 const bluesCompatibility:Compatibility='Color';
 result.push(suggestion(r,'minor-pentatonic',genre==='blues'?'Compatible':bluesCompatibility,`Color blues: la b3 roza la 3 mayor cuando el acorde es dominante o mayor.`));
 result.push(suggestion(r,'minor-blues',genre==='blues'?'Muy compatible':'Color',`Lenguaje blues; la b3 y la b5 funcionan como notas de color, no como reglas.`));
 if((genre==='blues'||approach==='global')&&progression.length>1){const globalRoot=progression[0].root;for(const key of ['minor-blues','minor-pentatonic','major-pentatonic'] as ScaleKey[]){const candidate=suggestion(globalRoot,key,key==='minor-blues'?'Muy compatible':'Compatible',`Puede conservar un centro global en ${globalRoot}; marcá los cambios con chord tones.`);if(!result.some(x=>x.root===candidate.root&&x.scaleKey===key))result.unshift(candidate)}}
 return result;
}

export function getChordTones(chord:ChordRecord){return [...chord.notes]}
export function getTargetNotes(chord:ChordRecord,target:PracticeSession['target']){const indexes=target==='third'?[1]:target==='seventh'?[3]:target==='both'?[1,3]:chord.notes.map((_,i)=>i);return indexes.filter(i=>i<chord.notes.length).map(i=>chord.notes[i])}
export function noteInScale(note:string,scale:PracticeScale){const pitch=getPitchClass(note);return pitch!==null&&getScaleNotes(scale.root,scale.scaleKey).some(n=>getPitchClass(n)===pitch)}
export function nearestZone(currentId:string,available=FRET_ZONES){const current=FRET_ZONES.find(z=>z.id===currentId)??FRET_ZONES[0],center=(current.from+current.to)/2;return [...available].sort((a,b)=>Math.abs((a.from+a.to)/2-center)-Math.abs((b.from+b.to)/2-center))[0]}
export function parseChordLabel(label:string){const match=label.trim().match(/^([A-Ga-g](?:#|b)?)(maj7|m7b5|dim7|dim|aug|sus2|sus4|m7|m|7|9|11|13)?$/);if(!match)return null;const map:Record<string,ChordQuality>={'':'major',m:'minor','7':'dominant7',maj7:'major7',m7:'minor7',m7b5:'halfDiminished7',dim:'diminished',dim7:'diminished7',aug:'augmented',sus2:'sus2',sus4:'sus4','9':'dominant9','11':'dominant11','13':'dominant13'};return buildChord(match[1][0].toUpperCase()+match[1].slice(1),map[match[2]??''])}
export function pitchEquals(a:string,b:string){const pa=getPitchClass(a),pb=getPitchClass(b);return pa!==null&&pb!==null&&normalizePitchClass(pa)===normalizePitchClass(pb)}
const ROLE:Record<string,string>={'1':'fundamental','b2':'segunda menor','2':'segunda mayor','b3':'tercera menor','3':'tercera mayor','4':'cuarta justa','b5 / #4':'quinta disminuida / cuarta aumentada','5':'quinta justa','b6':'sexta menor','6':'sexta mayor','b7':'séptima menor','7':'séptima mayor'};
export function analyzePracticeNote({note,baseScale,chord}:{note:string;baseScale:PracticeScale;chord:ChordRecord}):PracticeNoteAnalysis{
 const scaleInterval=getIntervalBetween(baseScale.root,note),scaleBelongs=noteInScale(note,baseScale),chordIndex=chord.notes.findIndex(n=>pitchEquals(n,note));
 const chordDegree=chordIndex>=0?chord.degrees[chordIndex]??getIntervalBetween(chord.root,note).degree:null,role=chordDegree?ROLE[chordDegree]??getIntervalBetween(chord.root,note).description:null;
 const strong=chordDegree==='1'||chordDegree==='3'||chordDegree==='b3'||chordDegree==='b7'||chordDegree==='7';
 return{note,scaleRelation:{belongs:scaleBelongs,degree:scaleBelongs?scaleInterval.degree:null,description:scaleBelongs?scaleInterval.description:null},chordRelation:{belongs:chordIndex>=0,degree:chordDegree,role:chordDegree==='1'?'root':chordDegree==='3'||chordDegree==='b3'?'third':chordDegree==='7'||chordDegree==='b7'?'seventh':chordIndex>=0?'chord-tone':null,description:role},importance:strong?'strong-target':chordIndex>=0?'chord-tone':scaleBelongs?'scale-tone':'contextual'}
}
export function explainPracticeNote(analysis:PracticeNoteAnalysis,scale:PracticeScale,chord:ChordRecord){
 const chordPart=analysis.chordRelation.belongs?`Es la ${analysis.chordRelation.degree==='1'?'fundamental':analysis.chordRelation.description} de ${chord.label}.`:'';
 const scalePart=analysis.scaleRelation.belongs?`También es la ${analysis.scaleRelation.degree} de ${scaleLabel(scale)}.`:`No pertenece a ${scaleLabel(scale)}, pero puede definir claramente el acorde.`;
 return `${chordPart} ${scalePart}`.trim()
}
