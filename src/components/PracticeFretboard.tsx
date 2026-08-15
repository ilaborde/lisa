import {useMemo} from 'react';
import {buildFretboard} from '../music/fretboard';
import {getPitchClass} from '../music/notes';
import {FRET_ZONES,getTargetNotes,pitchEquals,type PracticeApproach,type PracticeScale,type PracticeSession} from '../music/practiceSuggestions';
import type {ChordRecord} from '../music/chords';
import {getArpeggio,type ArpeggioExtent} from '../music/arpeggios';

export function PracticeFretboard({scale,chord,zoneId,target,approach='mixed',arpeggioExtent='full',showGuideTones=false,labelMode='notes'}:{scale:PracticeScale;chord:ChordRecord;zoneId:string;target:PracticeSession['target'];approach?:PracticeApproach;arpeggioExtent?:ArpeggioExtent;showGuideTones?:boolean;labelMode?:'notes'|'degrees'}){
 const board=useMemo(()=>buildFretboard(scale.root,scale.scaleKey),[scale.root,scale.scaleKey]),zone=FRET_ZONES.find(z=>z.id===zoneId)??FRET_ZONES[0],targets=getTargetNotes(chord,target),arpeggio=getArpeggio(chord,arpeggioExtent),onlyArpeggio=approach==='arpeggios';
 return <div className="practice-board"><div className="fretboard-scroll"><div className="fretboard-stage"><div className="string-labels">{[...board].reverse().map((row,i)=><span key={i}>{row[0].string}</span>)}</div><div><div className="fretboard">{[...board].reverse().map((row,i)=><div className="string-row" key={i}>{row.slice(1).map(cell=>{
  const arpIndex=arpeggio.notes.findIndex(note=>pitchEquals(note,cell.noteName)),chordTone=arpIndex>=0,isGuide=chordTone&&['3','b3','7','b7','bb7'].includes(arpeggio.degrees[arpIndex]),isTarget=onlyArpeggio&&showGuideTones?isGuide:targets.some(note=>pitchEquals(note,cell.noteName)),visible=cell.fret>=zone.from&&cell.fret<=zone.to,show=chordTone||(!onlyArpeggio&&cell.inScale);
  const markerText=labelMode==='degrees'&&chordTone?arpeggio.degrees[arpIndex]:cell.noteName.replace('#','♯').replace('b','♭');
  return <span className={`fret-cell ${visible?'in-zone':'out-zone'}`} key={cell.fret}>{show&&<span className={`marker ${arpeggio.degrees[arpIndex]==='1'?'arpeggio-root':isTarget?'target-note':chordTone?'chord-tone':cell.isRoot?'root':cell.inScale?'scale':'outside'}`}>{getPitchClass(cell.noteName)!==null?markerText:''}</span>}</span>
 })}</div>)}</div><div className="fret-numbers">{Array.from({length:22},(_,i)=><span key={i}>{i+1}</span>)}</div></div></div></div><div className="legend"><span><i className="arpeggio-root"/>Fundamental</span>{showGuideTones&&<span><i className="target-note"/>Guide tones</span>}<span><i className="chord-tone"/>Arpegio</span>{!onlyArpeggio&&<span><i className="scale"/>Escala base</span>}<small>Zona visible: trastes {zone.from}–{zone.to}</small></div></div>
}
