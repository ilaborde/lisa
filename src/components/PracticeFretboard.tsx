import {useMemo} from 'react';
import {buildFretboard} from '../music/fretboard';
import {getPitchClass} from '../music/notes';
import {FRET_ZONES,getTargetNotes,pitchEquals,type PracticeScale,type PracticeSession} from '../music/practiceSuggestions';
import type {ChordRecord} from '../music/chords';

export function PracticeFretboard({scale,chord,zoneId,target}:{scale:PracticeScale;chord:ChordRecord;zoneId:string;target:PracticeSession['target']}){
 const board=useMemo(()=>buildFretboard(scale.root,scale.scaleKey),[scale.root,scale.scaleKey]),zone=FRET_ZONES.find(z=>z.id===zoneId)??FRET_ZONES[0],targets=getTargetNotes(chord,target);
 return <div className="practice-board"><div className="fretboard-scroll"><div className="fretboard-stage"><div className="string-labels">{[...board].reverse().map((row,i)=><span key={i}>{row[0].string}</span>)}</div><div><div className="fretboard">{[...board].reverse().map((row,i)=><div className="string-row" key={i}>{row.slice(1).map(cell=>{
  const chordTone=chord.notes.some(note=>pitchEquals(note,cell.noteName)),isTarget=targets.some(note=>pitchEquals(note,cell.noteName)),visible=cell.fret>=zone.from&&cell.fret<=zone.to;
  return <span className={`fret-cell ${visible?'in-zone':'out-zone'}`} key={cell.fret}><span className={`marker ${isTarget?'target-note':chordTone?'chord-tone':cell.isRoot?'root':cell.inScale?'scale':'outside'}`}>{getPitchClass(cell.noteName)!==null?cell.noteName.replace('#','♯').replace('b','♭'):''}</span></span>
 })}</div>)}</div><div className="fret-numbers">{Array.from({length:22},(_,i)=><span key={i}>{i+1}</span>)}</div></div></div></div><div className="legend"><span><i className="target-note"/>Nota objetivo</span><span><i className="chord-tone"/>Chord tone</span><span><i className="root"/>Tónica</span><span><i className="scale"/>Escala</span><small>Zona visible: trastes {zone.from}–{zone.to}</small></div></div>
}

