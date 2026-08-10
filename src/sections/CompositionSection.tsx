import {SongStructure} from '../components/SongStructure';
export function CompositionSection({root}:{root:string}){return <div className="section-view"><section className="card"><h2>Estructura de canción</h2><p>Organizá secciones, compases, repeticiones y progresiones desde el centro tonal actual.</p><SongStructure defaultRoot={root}/></section></div>}
