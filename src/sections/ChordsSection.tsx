import {useEffect,useMemo,useState} from 'react';
import {ALL_CHORD_TYPES,buildChord,getChordFromScale,type ChordQuality,type ChordRecord} from '../music/chords';
import {ROOT_OPTIONS,getPitchClass} from '../music/notes';
import {getScaleByKey,type ScaleKey} from '../music/scales';
import type {Instrument} from '../music/instrument';
import {ChordScaleAnalysis} from '../components/ChordScaleAnalysis';
import {InstrumentVisualization} from '../components/InstrumentVisualization';
import {Voicings} from '../components/Voicings';
import {PianoVoicings} from '../components/PianoVoicings';

export type ChordView='analysis'|'voicings';
export function ChordsSection({instrument,root,scaleKey,chord,view,onView,onChord}:{instrument:Instrument;root:string;scaleKey:ScaleKey;chord:ChordRecord|null;view:ChordView;onView:(view:ChordView)=>void;onChord:(chord:ChordRecord)=>void}){
 const current=chord??buildChord('C','major')!;
 const[manualRoot,setManualRoot]=useState(current.root),[manualType,setManualType]=useState<ChordQuality>(current.quality);
 useEffect(()=>{setManualRoot(current.root);setManualType(current.quality)},[current.root,current.quality]);
 const contextualChord=useMemo(()=>[...getChordFromScale(root,scaleKey,false),...getChordFromScale(root,scaleKey,true)].find(candidate=>candidate.root===current.root&&candidate.notes.length===current.notes.length&&candidate.notes.every(note=>current.notes.some(item=>getPitchClass(item)===getPitchClass(note)))),[root,scaleKey,current]);
 function choose(nextRoot:string,nextType:ChordQuality){const next=buildChord(nextRoot,nextType);if(next)onChord(next)}
 return <div className="section-view">
  <section className="card chord-hero"><div><p className="eyebrow">Acorde actual</p><h2>{current.label}</h2><p>{current.qualityLabel} · {current.notes.join(' · ')}</p></div><div className="controls"><label>Fundamental<select value={manualRoot} onChange={e=>{setManualRoot(e.target.value);choose(e.target.value,manualType)}}>{ROOT_OPTIONS.map(note=><option key={note}>{note}</option>)}</select></label><label>Acorde<select value={manualType} onChange={e=>{const type=e.target.value as ChordQuality;setManualType(type);choose(manualRoot,type)}}>{ALL_CHORD_TYPES.map(type=><option key={type.key} value={type.key}>{type.label}</option>)}</select></label></div></section>
  <div className="subnav"><button aria-pressed={view==='analysis'} onClick={()=>onView('analysis')}>Análisis</button><button aria-pressed={view==='voicings'} onClick={()=>onView('voicings')}>Voicings</button></div>
  {view==='analysis'&&<>
   <section className="card"><h2>Construcción</h2><div className="chord-construction">{current.notes.map((note,index)=><article key={`${note}-${index}`}><strong>{note}</strong><span>{current.degrees[index]}</span><small>{current.intervals[index]}</small></article>)}</div></section>
   <section className="card"><h2>En el contexto actual</h2><p><b>{root} {getScaleByKey(scaleKey).name}</b> · {contextualChord?`${current.label} funciona como ${contextualChord.degreeName}.`:'El acorde no es diatónico en esta escala.'}</p><InstrumentVisualization instrument={instrument} root={root} scaleKey={scaleKey} labelMode="both" chordNotes={current.notes}/></section>
   <section className="card"><h2>Relación acorde–escala</h2><ChordScaleAnalysis chord={current}/></section>
  </>}
  {view==='voicings'&&<section className="card"><h2>Voicings de {instrument==='guitar'?'guitarra':'piano'}</h2><p className="current-chord">Acorde actual: <b>{current.label}</b></p>{instrument==='guitar'?<Voicings selectedChord={current}/>:<PianoVoicings selectedChord={current}/>}</section>}
 </div>
}
