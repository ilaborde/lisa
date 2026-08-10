import type {ChordRecord} from '../music/chords';
import type {ProgressionItem} from '../music/progressions';
import type {ScaleKey} from '../music/scales';
import {SongStructure} from '../components/SongStructure';

export function CompositionSection({root,scaleKey,progression,onOpenChord}:{root:string;scaleKey:ScaleKey;progression:ProgressionItem[];onOpenChord:(chord:ChordRecord,view:'analysis'|'voicings')=>void}){return <div className="section-view"><section className="card"><h2>Taller de canción</h2><p>Transformá una progresión en secciones con contraste, energía y variaciones armónicas.</p><SongStructure root={root} scaleKey={scaleKey} activeProgression={progression} onOpenChord={onOpenChord}/></section></div>}
