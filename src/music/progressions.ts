import type {ChordRecord} from './chords';

export type ProgressionItem={id:string;chord:ChordRecord};
export function moveProgressionItem(items:readonly ProgressionItem[],from:number,to:number):ProgressionItem[]{if(from<0||to<0||from>=items.length||to>=items.length)return[...items];const result=[...items],removed=result.splice(from,1)[0];result.splice(to,0,removed);return result}
export function formatProgression(items:readonly ProgressionItem[]){return{chords:items.map(item=>item.chord.label).join(' – '),romans:items.map(item=>item.chord.degreeName).join(' – ')}}
