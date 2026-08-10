import { useMemo, useState } from 'react';
import { buildFretboard, type FretboardCell } from '../music/fretboard';
import { getIntervalBetween } from '../music/intervals';
import type { ScaleKey } from '../music/scales';

type Props={root:string;scaleKey:ScaleKey;labelMode:'notes'|'degrees'|'both'};
const DOTS=[3,5,7,9,12,15,17,19,21];
export function Fretboard({root,scaleKey,labelMode}:Props){
 const [selected,setSelected]=useState<FretboardCell|null>(null); const board=useMemo(()=>buildFretboard(root,scaleKey),[root,scaleKey]);
 return <div className="fretboard-component"><div className="fretboard-scroll"><div className="fretboard-stage">
  <div className="string-labels">{[...board].reverse().map((row,i)=><span key={i}>{row[0].string}</span>)}</div>
  <div><div className="fretboard">{[...board].reverse().map((row,i)=><div className="string-row" key={i}>{row.slice(1).map(cell=>{
   const status=cell.isRoot?'root':cell.isCharacteristic?'characteristic':cell.inScale?'scale':'outside';
   return <button type="button" key={cell.fret} className="fret-cell" onClick={()=>setSelected(cell)} aria-label={`Cuerda ${cell.string}, traste ${cell.fret}: ${cell.noteName}${cell.degree?`, grado ${cell.degree}`:', fuera de escala'}`}>
    <span className={`marker ${status}`}>{labelMode!=='degrees'&&<span>{cell.noteName.replace('#','♯').replace('b','♭')}</span>}{labelMode!=='notes'&&cell.degree&&<small>{cell.degree}</small>}</span>
   </button>})}</div>)}</div>
   <div className="fret-numbers">{Array.from({length:22},(_,i)=><span key={i} className={DOTS.includes(i+1)?(i+1===12?'double-dot':'dot'):''}>{i+1}</span>)}</div>
  </div></div></div>
  <div className="fretboard-info">{selected?<><strong>{selected.noteName} · cuerda {selected.string}, traste {selected.fret}</strong><span>{selected.degree?`${selected.degree} — ${getIntervalBetween(root,selected.noteName).description}`:'Fuera de la escala seleccionada'}</span></>:<span>Seleccioná una posición para ver sus datos.</span>}</div>
 </div>;
}
