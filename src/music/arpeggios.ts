import type {ChordRecord} from './chords';
import {STANDARD_TUNING} from './fretboard';
import {getPitchClass,normalizePitchClass} from './notes';

export type ArpeggioExtent='triad'|'seventh'|'full';
export type Arpeggio={chord:ChordRecord;extent:ArpeggioExtent;notes:string[];degrees:string[]};
export type ArpeggioPosition={stringIndex:number;string:string;fret:number;note:string;degree:string;isRoot:boolean;isGuideTone:boolean};
export type ArpeggioShape={id:string;label:string;from:number;to:number;averageFret:number;positions:ArpeggioPosition[]};
export type FretRange={id?:string;label?:string;from:number;to:number};
export type ArpeggioMovement={from:string;to:string;semitones:1|2};
export type ArpeggioConnection={commonNotes:string[];movements:ArpeggioMovement[]};

const limitFor=(extent:ArpeggioExtent,length:number)=>extent==='triad'?Math.min(3,length):extent==='seventh'?Math.min(4,length):length;
export function getArpeggio(chord:ChordRecord,extent:ArpeggioExtent='full'):Arpeggio{const limit=limitFor(extent,chord.notes.length);return{chord,extent,notes:chord.notes.slice(0,limit),degrees:chord.degrees.slice(0,limit)}}
export function getArpeggioNotes(chord:ChordRecord,extent:ArpeggioExtent='full'){return getArpeggio(chord,extent).notes}
export function getArpeggioDegrees(chord:ChordRecord,extent:ArpeggioExtent='full'){return getArpeggio(chord,extent).degrees}

export function getArpeggioShapes(chord:ChordRecord,{extent='full',ranges=[{id:'low',label:'Posición baja',from:0,to:5},{id:'middle',label:'Posición media',from:6,to:11},{id:'high',label:'Posición alta',from:12,to:17}]}:{extent?:ArpeggioExtent;ranges?:FretRange[]}={}):ArpeggioShape[]{
 const arpeggio=getArpeggio(chord,extent),pitches=arpeggio.notes.map(getPitchClass),degreeByPitch=new Map(arpeggio.notes.map((note,index)=>[getPitchClass(note),arpeggio.degrees[index]]));
 return ranges.map((range,index)=>{const positions:ArpeggioPosition[]=[];STANDARD_TUNING.forEach((string,stringIndex)=>{for(let fret=range.from;fret<=range.to;fret++){const pitch=normalizePitchClass(getPitchClass(string)!+fret),noteIndex=pitches.indexOf(pitch);if(noteIndex>=0){const degree=degreeByPitch.get(pitch)??'';positions.push({stringIndex,string,fret,note:arpeggio.notes[noteIndex],degree,isRoot:degree==='1',isGuideTone:['3','b3','7','b7','bb7'].includes(degree)})}}});
  return{id:range.id??`position-${index+1}`,label:range.label??`Posición ${index+1}`,from:range.from,to:range.to,averageFret:positions.length?positions.reduce((sum,item)=>sum+item.fret,0)/positions.length:(range.from+range.to)/2,positions};
 }).filter(shape=>shape.positions.length>0);
}
export function findClosestArpeggioShape(current:ArpeggioShape,next:readonly ArpeggioShape[]){return [...next].sort((a,b)=>Math.abs(a.averageFret-current.averageFret)-Math.abs(b.averageFret-current.averageFret))[0]??null}
const samePitch=(a:string,b:string)=>getPitchClass(a)===getPitchClass(b);
export function findClosestVoiceMovements(current:Arpeggio,next:Arpeggio):ArpeggioConnection{
 const commonNotes=current.notes.filter(note=>next.notes.some(candidate=>samePitch(note,candidate)));
 const movements:ArpeggioMovement[]=[];for(const from of current.notes){if(commonNotes.some(note=>samePitch(note,from)))continue;let best:{to:string;distance:number;sameLetter:boolean}|null=null;for(const to of next.notes){if(commonNotes.some(note=>samePitch(note,to)))continue;const a=getPitchClass(from)!,b=getPitchClass(to)!,distance=Math.min(normalizePitchClass(b-a),normalizePitchClass(a-b)),sameLetter=from[0]===to[0];if(distance>0&&distance<=2&&(!best||distance<best.distance||(distance===best.distance&&sameLetter&&!best.sameLetter)))best={to,distance,sameLetter}}if(best)movements.push({from,to:best.to,semitones:best.distance as 1|2})}
 return{commonNotes,movements};
}
