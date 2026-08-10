import {useMemo,useRef,useState} from 'react';
import {getChordFromScale,type ChordRecord} from '../music/chords';
import {getProgressionVariations} from '../music/compositionVariations';
import type {ProgressionItem} from '../music/progressions';
import type {ScaleKey} from '../music/scales';
import {ContextAction} from './layout/ContextAction';

type SectionType='Intro'|'Verso'|'Pre-coro'|'Estribillo'|'Puente'|'Solo'|'Outro';
type SongSection={id:string;type:SectionType;name:string;bars:number;repeats:number;chords:ChordRecord[]};
const TYPES:SectionType[]=['Intro','Verso','Pre-coro','Estribillo','Puente','Solo','Outro'];

export function SongStructure({root,scaleKey,activeProgression,onOpenChord}:{root:string;scaleKey:ScaleKey;activeProgression:ProgressionItem[];onOpenChord:(chord:ChordRecord,view:'analysis'|'voicings')=>void}){
 const nextId=useRef(1),base=activeProgression.map(item=>item.chord),harmony=useMemo(()=>getChordFromScale(root,scaleKey,false),[root,scaleKey]);
 const[sections,setSections]=useState<SongSection[]>([]),[newType,setNewType]=useState<SectionType>('Verso');
 function make(type:SectionType,chords=base):SongSection{return{id:`section-${nextId.current++}`,type,name:`${type}`,bars:4,repeats:1,chords:[...chords]}}
 function createDraft(){if(!base.length)return;const variants=getProgressionVariations(base,root,scaleKey),simple=variants.find(item=>item.key==='simple')?.chords??base,rich=variants.find(item=>item.key==='rich')?.chords??base,different=variants.find(item=>item.key==='darker'||item.key==='tension')?.chords??base;setSections([make('Intro',simple),make('Verso',simple),make('Estribillo',rich),make('Verso',simple),make('Puente',different),make('Estribillo',rich)])}
 function update(id:string,patch:Partial<SongSection>){setSections(current=>current.map(section=>section.id===id?{...section,...patch}:section))}
 function move(index:number,direction:-1|1){const to=index+direction;if(to<0||to>=sections.length)return;setSections(current=>{const result=[...current],[item]=result.splice(index,1);result.splice(to,0,item);return result})}
 function duplicate(section:SongSection){setSections(current=>[...current,{...section,id:`section-${nextId.current++}`,name:`${section.name} copia`,chords:[...section.chords]}])}
 const totalBars=sections.reduce((sum,section)=>sum+section.bars*section.repeats,0);
 return <div className="song-workshop">
  <section className="composition-source"><div><p className="eyebrow">Material armónico</p><h3>{base.length?base.map(chord=>chord.label).join(' – '):'No hay una progresión activa'}</h3><p>{base.length?'Lisa puede convertirla en una forma completa y generar contraste entre secciones.':'Armá primero una progresión para comenzar sin cargar acordes a mano.'}</p></div><button disabled={!base.length} onClick={createDraft}>{sections.length?'Regenerar borrador':'Crear canción desde la progresión'}</button></section>
  <div className="song-toolbar"><label>Nueva sección<select value={newType} onChange={e=>setNewType(e.target.value as SectionType)}>{TYPES.map(type=><option key={type}>{type}</option>)}</select></label><button onClick={()=>setSections(current=>[...current,make(newType)])}>Agregar sección</button><span>{sections.length} secciones · {totalBars} compases</span></div>
  <div className="song-sections">{sections.map((section,index)=>{const variations=getProgressionVariations(section.chords,root,scaleKey);return <article key={section.id}>
   <header><span>{index+1}</span><input aria-label="Nombre de la sección" value={section.name} onChange={e=>update(section.id,{name:e.target.value})}/><div><button disabled={index===0} onClick={()=>move(index,-1)}>←</button><button disabled={index===sections.length-1} onClick={()=>move(index,1)}>→</button><button onClick={()=>duplicate(section)}>⧉</button><button onClick={()=>setSections(current=>current.filter(item=>item.id!==section.id))}>×</button></div></header>
   <div className="song-fields"><label>Tipo<select value={section.type} onChange={e=>update(section.id,{type:e.target.value as SectionType})}>{TYPES.map(type=><option key={type}>{type}</option>)}</select></label><label>Compases<input type="number" min="1" max="64" value={section.bars} onChange={e=>update(section.id,{bars:Number(e.target.value)})}/></label><label>Repeticiones<input type="number" min="1" max="16" value={section.repeats} onChange={e=>update(section.id,{repeats:Number(e.target.value)})}/></label></div>
   <div className="composition-chords">{section.chords.map((chord,chordIndex)=><div key={`${chord.label}-${chordIndex}`}><button onClick={()=>onOpenChord(chord,'analysis')}>{chord.label}</button><small>{chord.degreeName}</small><ContextAction onClick={()=>onOpenChord(chord,'voicings')}>Voicing</ContextAction><button aria-label={`Quitar ${chord.label}`} onClick={()=>update(section.id,{chords:section.chords.filter((_,i)=>i!==chordIndex)})}>×</button></div>)}</div>
   <div className="composition-add"><span>Agregar acorde:</span>{harmony.map(chord=><button key={chord.degreeName} onClick={()=>update(section.id,{chords:[...section.chords,chord]})}>{chord.label}</button>)}</div>
   {variations.length>0&&<div className="composition-variations">{variations.slice(0,4).map(variation=><button key={variation.key} onClick={()=>update(section.id,{chords:variation.chords})}><strong>{variation.name}</strong><span>{variation.change}</span></button>)}</div>}
  </article>})}</div>
  {!sections.length&&<p className="empty-state">Usá la progresión activa para generar un borrador, o agregá una sección vacía y elegí acordes de la tonalidad.</p>}
 </div>
}
