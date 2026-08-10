import type { ChordRecord } from '../music/chords';
type Props={harmony:ChordRecord[];selectedChordLabel?:string;onSelectChord?:(label:string)=>void};
export function HarmonyTable({harmony,selectedChordLabel,onSelectChord}:Props){
 if(!harmony.length)return <p className="empty-state">Esta escala no se armoniza por terceras diatónicas en esta vista.</p>;
 return <div className="chords">{harmony.map(chord=><button key={chord.degreeName} type="button" aria-pressed={chord.label===selectedChordLabel} className={`chord ${chord.quality.includes('Diminished')||chord.quality==='diminished'?'tension':''}`} onClick={()=>onSelectChord?.(chord.label)}><strong>{chord.label}</strong><span>{chord.degreeName}</span><small>{chord.qualityLabel}</small></button>)}</div>;
}
