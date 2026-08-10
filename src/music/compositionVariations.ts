import {buildChord,type ChordQuality,type ChordRecord} from './chords';
import {getBorrowedChords,getCadences,getSecondaryDominants} from './composition';
import {getPitchClass} from './notes';
import type {ScaleKey} from './scales';

export type ProgressionVariation={key:string;name:string;description:string;chords:ChordRecord[];change:string};
function triadQuality(quality:ChordQuality):ChordQuality{if(quality==='minor7')return'minor';if(quality==='halfDiminished7'||quality==='diminished7')return'diminished';if(quality==='dominant7'||quality==='major7'||quality==='dominant9'||quality==='dominant11'||quality==='dominant13')return'major';return quality}
function seventhQuality(quality:ChordQuality):ChordQuality{if(quality==='major')return'major7';if(quality==='minor')return'minor7';if(quality==='diminished')return'halfDiminished7';return quality}
function rebuild(chord:ChordRecord,quality:ChordQuality){const next=buildChord(chord.root,quality)!;return{...next,degreeName:chord.degreeName}}

export function getProgressionVariations(chords:readonly ChordRecord[],root:string,scaleKey:ScaleKey):ProgressionVariation[]{
 if(!chords.length)return[];const variants:ProgressionVariation[]=[];
 const simple=chords.map(chord=>rebuild(chord,triadQuality(chord.quality)));if(simple.some((chord,index)=>chord.label!==chords[index].label))variants.push({key:'simple',name:'Simplificar',description:'Reduce extensiones a tríadas para una textura más directa.',chords:simple,change:'Séptimas y extensiones se convierten en tríadas.'});
 const rich=chords.map(chord=>rebuild(chord,seventhQuality(chord.quality)));if(rich.some((chord,index)=>chord.label!==chords[index].label))variants.push({key:'rich',name:'Color jazzístico',description:'Añade séptimas manteniendo fundamentales y funciones.',chords:rich,change:'Las tríadas compatibles reciben una séptima.'});
 const borrowed=getBorrowedChords(root,scaleKey)[0];if(borrowed){const index=Math.max(0,chords.length-2);variants.push({key:'darker',name:'Más oscura',description:'Introduce intercambio modal cerca del final.',chords:chords.map((chord,i)=>i===index?borrowed.chord:chord),change:`${chords[index].label} se sustituye por ${borrowed.chord.label}, prestado de ${borrowed.source}.`})}
 const last=chords[chords.length-1],secondary=getSecondaryDominants(root,scaleKey).find(item=>getPitchClass(item.target.root)===getPitchClass(last.root));if(secondary)variants.push({key:'tension',name:'Más tensión',description:'Prepara el último acorde con su dominante secundario.',chords:[...chords.slice(0,-1),secondary.chord,last],change:`Se inserta ${secondary.chord.label} (${secondary.functionLabel}) antes de ${last.label}.`});
 const deceptive=getCadences(root,scaleKey).find(cadence=>cadence.key==='deceptive');if(deceptive)variants.push({key:'open-ending',name:'Final inesperado',description:'Evita la resolución principal con una cadencia deceptiva.',chords:[...chords,...deceptive.chords],change:`Se agrega ${deceptive.chords.map(chord=>chord.label).join('–')} al final.`});
 return variants.filter((variant,index,all)=>all.findIndex(item=>item.chords.map(chord=>chord.label).join('|')===variant.chords.map(chord=>chord.label).join('|'))===index);
}
