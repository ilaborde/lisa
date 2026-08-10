import type {ChordRecord} from '../music/chords';
import type {Instrument} from '../music/instrument';

export function ProgressionChordMap({chord}:{chord:ChordRecord;instrument?:Instrument}){
 const targets=chord.notes.filter((_,index)=>index===0||index===1||index===3);
 return <section className="progression-chord-summary">
  <small>Notas: {chord.notes.join(' · ')}</small>
  <small className="progression-targets">Objetivos: {targets.join(' · ')}</small>
  <small>Fórmula: {chord.degrees.join(' · ')}</small>
 </section>
}
