import {useMemo,useState} from 'react';
import {ROOT_OPTIONS,SELECTABLE_SCALES,getChordFromScale,getScaleByKey,type ChordRecord,type ScaleKey} from '../music/theory';
import type {Instrument} from '../music/instrument';
import {ScaleSummary} from '../components/explorer/ScaleSummary';
import {InstrumentVisualization} from '../components/InstrumentVisualization';
import {HarmonyTable} from '../components/HarmonyTable';
import {ModeComparer} from '../components/ModeComparer';
import {ContextAction} from '../components/layout/ContextAction';

export function ExploreSection({instrument,root,scaleKey,selectedChord,onRoot,onScale,onChord,onOpenChord}:{instrument:Instrument;root:string;scaleKey:ScaleKey;selectedChord:ChordRecord|null;onRoot:(v:string)=>void;onScale:(v:ScaleKey)=>void;onChord:(v:ChordRecord)=>void;onOpenChord:(chord:ChordRecord,view:'analysis'|'voicings')=>void}){
 const[tetrads,setTetrads]=useState(false),[labels,setLabels]=useState<'notes'|'degrees'|'both'>('both');
 const harmony=useMemo(()=>getChordFromScale(root,scaleKey,tetrads),[root,scaleKey,tetrads]),scale=getScaleByKey(scaleKey),surface=instrument==='guitar'?'mástil':'teclado';
 return <div className="section-view">
  <section className="card"><div className="controls"><label>Tónica<select value={root} onChange={e=>onRoot(e.target.value)}>{ROOT_OPTIONS.map(n=><option key={n}>{n}</option>)}</select></label><label>Escala / modo<select value={scaleKey} onChange={e=>onScale(e.target.value as ScaleKey)}>{SELECTABLE_SCALES.map(s=><option key={s.key} value={s.key}>{s.name}</option>)}</select></label></div></section>
  <ScaleSummary root={root} scaleKey={scaleKey}/>
  <section className="card fret-card"><div className="section-head"><div><h2>{instrument==='guitar'?'Mástil':'Piano'}</h2><p>La escala permanece visible; el acorde seleccionado tiene prioridad en el {surface}.</p></div><div className="segmented">{(['notes','degrees','both'] as const).map(v=><button key={v} aria-pressed={labels===v} onClick={()=>setLabels(v)}>{v==='notes'?'Notas':v==='degrees'?'Grados':'Ambos'}</button>)}</div></div><InstrumentVisualization instrument={instrument} root={root} scaleKey={scaleKey} labelMode={labels} chordNotes={selectedChord?.notes}/><div className="legend"><span><i className="root"/>Tónica de escala</span><span><i className="chord-tone"/>Acorde actual</span>{scale.characteristicDegree&&<span><i className="characteristic"/>Rasgo {scale.characteristicDegree}</span>}</div></section>
  <section className="card"><div className="section-head"><div><h2>Armonización</h2><p>Seleccioná un acorde para compartirlo con el resto de Lisa.</p></div><div className="segmented"><button aria-pressed={!tetrads} onClick={()=>setTetrads(false)}>Tríadas</button><button aria-pressed={tetrads} onClick={()=>setTetrads(true)}>Tétradas</button></div></div><HarmonyTable harmony={harmony} selectedChordLabel={selectedChord?.label??''} onSelectChord={label=>{const chord=harmony.find(c=>c.label===label);if(chord)onChord(chord)}}/>{selectedChord&&<div className="context-actions"><strong>{selectedChord.label}</strong><ContextAction onClick={()=>onOpenChord(selectedChord,'analysis')}>Analizar acorde</ContextAction><ContextAction onClick={()=>onOpenChord(selectedChord,'voicings')}>Ver voicings</ContextAction></div>}</section>
  <section className="card"><h2>Comparador modal</h2><p>Elegí un modo para actualizar el contexto manteniendo {root} como tónica.</p><ModeComparer root={root} currentKey={scaleKey} onSelect={onScale}/></section>
 </div>
}
