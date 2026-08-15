import {useEffect,useMemo,useState} from 'react';
import {ALL_CHORD_TYPES,buildChord,getChordFromScale,type ChordQuality,type ChordRecord} from '../music/chords';
import {ROOT_OPTIONS,getPitchClass} from '../music/notes';
import {getScaleByKey,type ScaleKey} from '../music/scales';
import type {Instrument} from '../music/instrument';
import {ChordScaleAnalysis} from '../components/ChordScaleAnalysis';
import {InstrumentVisualization} from '../components/InstrumentVisualization';
import {Voicings} from '../components/Voicings';
import {PianoVoicings} from '../components/PianoVoicings';
import {PracticeFretboard} from '../components/PracticeFretboard';
import {FRET_ZONES,type PracticeApproach} from '../music/practiceSuggestions';
import {getArpeggio,type ArpeggioExtent} from '../music/arpeggios';

export type ChordView='analysis'|'arpeggios'|'voicings';
export function ChordsSection({instrument,root,scaleKey,chord,view,onView,onChord,onPractice}:{instrument:Instrument;root:string;scaleKey:ScaleKey;chord:ChordRecord|null;view:ChordView;onView:(view:ChordView)=>void;onChord:(chord:ChordRecord)=>void;onPractice:(chord:ChordRecord,approach?:PracticeApproach)=>void}){
 const current=chord??buildChord('C','major')!;
 const[manualRoot,setManualRoot]=useState(current.root),[manualType,setManualType]=useState<ChordQuality>(current.quality);
 const[extent,setExtent]=useState<ArpeggioExtent>('full'),[zoneId,setZoneId]=useState('mid-low'),[labelMode,setLabelMode]=useState<'notes'|'degrees'>('notes'),arpeggio=getArpeggio(current,extent);
 useEffect(()=>{setManualRoot(current.root);setManualType(current.quality)},[current.root,current.quality]);
 const contextualChord=useMemo(()=>[...getChordFromScale(root,scaleKey,false),...getChordFromScale(root,scaleKey,true)].find(candidate=>candidate.root===current.root&&candidate.notes.length===current.notes.length&&candidate.notes.every(note=>current.notes.some(item=>getPitchClass(item)===getPitchClass(note)))),[root,scaleKey,current]);
 function choose(nextRoot:string,nextType:ChordQuality){const next=buildChord(nextRoot,nextType);if(next)onChord(next)}
 return <div className="section-view"><button className="context-action practice-launch" onClick={()=>onPractice(current)}>Practicar sobre este acorde</button>
  <section className="card chord-hero"><div><p className="eyebrow">Acorde actual</p><h2>{current.label}</h2><p>{current.qualityLabel} · {current.notes.join(' · ')}</p></div><div className="controls"><label>Fundamental<select value={manualRoot} onChange={e=>{setManualRoot(e.target.value);choose(e.target.value,manualType)}}>{ROOT_OPTIONS.map(note=><option key={note}>{note}</option>)}</select></label><label>Acorde<select value={manualType} onChange={e=>{const type=e.target.value as ChordQuality;setManualType(type);choose(manualRoot,type)}}>{ALL_CHORD_TYPES.map(type=><option key={type.key} value={type.key}>{type.label}</option>)}</select></label></div></section>
  <div className="subnav"><button aria-pressed={view==='analysis'} onClick={()=>onView('analysis')}>Análisis</button><button aria-pressed={view==='arpeggios'} onClick={()=>onView('arpeggios')}>Arpegios</button><button aria-pressed={view==='voicings'} onClick={()=>onView('voicings')}>Voicings</button></div>
  {view==='analysis'&&<>
   <section className="card"><h2>Construcción</h2><div className="chord-construction">{current.notes.map((note,index)=><article key={`${note}-${index}`}><strong>{note}</strong><span>{current.degrees[index]}</span><small>{current.intervals[index]}</small></article>)}</div></section>
   <section className="card"><h2>En el contexto actual</h2><p><b>{root} {getScaleByKey(scaleKey).name}</b> · {contextualChord?`${current.label} funciona como ${contextualChord.degreeName}.`:'El acorde no es diatónico en esta escala.'}</p><InstrumentVisualization instrument={instrument} root={root} scaleKey={scaleKey} labelMode="both" chordNotes={current.notes}/></section>
   <section className="card"><h2>Relación acorde–escala</h2><ChordScaleAnalysis chord={current}/></section>
  </>}
  {view==='arpeggios'&&<><section className="card arpeggio-summary"><div className="section-head"><div><p className="eyebrow">Arpegio de {current.label}</p><h2>{arpeggio.notes.join(' · ')}</h2><p className="degree-line">{arpeggio.degrees.join(' · ')}</p></div><button className="context-action" onClick={()=>onPractice(current,'arpeggios')}>Practicar este arpegio</button></div><div className="segmented">{([['triad','Triada'],['seventh','Séptima'],['full','Completo']] as [ArpeggioExtent,string][]).map(([value,label])=><button key={value} aria-pressed={extent===value} onClick={()=>setExtent(value)}>{label}</button>)}</div><p className="compact-theory"><b>Arpegio:</b> las notas del acorde tocadas como línea melódica. <b>Voicing:</b> una disposición concreta de sus voces simultáneas.</p></section>
   {instrument==='guitar'?<section className="card"><div className="section-head"><div><h2>Arpegio sobre el mástil</h2><p>Forma generada desde las notas del acorde, la afinación y la zona elegida.</p></div><div className="inline-controls"><label>Vista<select value={labelMode} onChange={e=>setLabelMode(e.target.value as 'notes'|'degrees')}><option value="notes">Notas</option><option value="degrees">Grados</option></select></label><label>Posición<select value={zoneId} onChange={e=>setZoneId(e.target.value)}>{FRET_ZONES.map(zone=><option key={zone.id} value={zone.id}>Posición {zone.position} · {zone.from}–{zone.to}</option>)}</select></label></div></div><PracticeFretboard scale={{root:current.root,scaleKey:'major'}} chord={current} zoneId={zoneId} target="all" approach="arpeggios" arpeggioExtent={extent} labelMode={labelMode}/></section>:<section className="card"><h2>Recorrido melódico</h2><p>{arpeggio.notes.join(' → ')}</p></section>}
  </>}
  {view==='voicings'&&<section className="card"><h2>Voicings de {instrument==='guitar'?'guitarra':'piano'}</h2><p className="current-chord">Acorde actual: <b>{current.label}</b></p>{instrument==='guitar'?<Voicings selectedChord={current}/>:<PianoVoicings selectedChord={current}/>}</section>}
 </div>
}
