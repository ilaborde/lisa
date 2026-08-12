import type {ChordRecord} from '../music/chords';
import type {Instrument} from '../music/instrument';
import type {ProgressionItem} from '../music/progressions';
import type {ScaleKey} from '../music/scales';
import {ProgressionBuilder} from '../components/ProgressionBuilder';
import {ContextAction} from '../components/layout/ContextAction';

export function ProgressionsSection({instrument,root,scaleKey,progression,onChord,onProgression,onOpenChord,onPractice}:{instrument:Instrument;root:string;scaleKey:ScaleKey;progression:ProgressionItem[];onChord:(chord:ChordRecord)=>void;onProgression:(items:ProgressionItem[])=>void;onOpenChord:(chord:ChordRecord,view:'analysis'|'voicings')=>void;onPractice:()=>void}){
 return <div className="section-view">{progression.length>0&&<button className="context-action practice-launch" onClick={onPractice}>Practicar esta progresión</button>}
  <section className="card progression-context"><p className="eyebrow">Progresión activa</p>{progression.length?<div className="active-progression">{progression.map(item=><article key={item.id}><button className="progression-chord" onClick={()=>onChord(item.chord)}>{item.chord.label}</button><span>{item.chord.degreeName||item.annotation}</span><div><ContextAction onClick={()=>onOpenChord(item.chord,'analysis')}>Analizar</ContextAction><ContextAction onClick={()=>onOpenChord(item.chord,'voicings')}>Voicings</ContextAction></div></article>)}</div>:<p>Construí una secuencia para conservarla en el contexto global.</p>}</section>
  <section className="card"><h2>Constructor de progresiones</h2><ProgressionBuilder root={root} scaleKey={scaleKey} instrument={instrument} onSelectChord={onChord} onProgressionChange={onProgression}/></section>
 </div>
}
