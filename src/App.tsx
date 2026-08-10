import {useState} from 'react';
import {getScaleByKey,type ChordRecord,type ScaleKey} from './music/theory';
import {getSavedInstrument,saveInstrument,type Instrument} from './music/instrument';
import type {ProgressionItem} from './music/progressions';
import {Navigation,type Section} from './components/layout/Navigation';
import {LearnSection} from './sections/LearnSection';
import {ExploreSection} from './sections/ExploreSection';
import {ChordsSection,type ChordView} from './sections/ChordsSection';
import {ProgressionsSection} from './sections/ProgressionsSection';
import {CompositionSection} from './sections/CompositionSection';
import {ToolsSection} from './sections/ToolsSection';

export default function App(){
 const[root,setRoot]=useState('G'),[scaleKey,setScaleKey]=useState<ScaleKey>('mixolydian'),[selectedChord,setSelectedChord]=useState<ChordRecord|null>(null),[selectedProgression,setSelectedProgression]=useState<ProgressionItem[]>([]),[instrument,setInstrument]=useState<Instrument>(getSavedInstrument),[active,setActive]=useState<Section>('explorar'),[chordView,setChordView]=useState<ChordView>('analysis'),[menu,setMenu]=useState(false);
 const scale=getScaleByKey(scaleKey);
 function changeInstrument(value:Instrument){setInstrument(value);saveInstrument(value)}
 function openChord(chord:ChordRecord,view:ChordView){setSelectedChord(chord);setChordView(view);setActive('acordes')}
 function explore(rootValue:string,key:ScaleKey){setRoot(rootValue);setScaleKey(key);setActive('explorar')}
 return <div className="app"><Navigation open={menu} setOpen={setMenu} active={active} setActive={setActive} instrument={instrument} onInstrument={changeInstrument}/><main><div className="shell">
  {active!=='aprender'&&<header className="page-header"><div><p className="eyebrow">{active}</p><h1>{active==='explorar'?'Entendé la escala, no sólo la forma.':active==='acordes'?'Entendé y tocá cada acorde.':active==='progresiones'?'Construí movimiento armónico.':active==='composicion'?'Dale forma a la música.':'Analizá desde distintos ángulos.'}</h1></div><div className="context-bar"><strong>{root} {scale.name}</strong><span>{selectedChord?.label??'Sin acorde'}</span><span>{selectedProgression.length?selectedProgression.map(item=>item.chord.label).join(' – '):'Sin progresión'}</span><span>{instrument==='guitar'?'Guitarra':'Piano'}</span></div></header>}
  {active==='aprender'&&<LearnSection instrument={instrument} onExplore={explore}/>} 
  {active==='explorar'&&<ExploreSection instrument={instrument} root={root} scaleKey={scaleKey} selectedChord={selectedChord} onRoot={setRoot} onScale={setScaleKey} onChord={setSelectedChord} onOpenChord={openChord}/>} 
  {active==='acordes'&&<ChordsSection instrument={instrument} root={root} scaleKey={scaleKey} chord={selectedChord} view={chordView} onView={setChordView} onChord={setSelectedChord}/>} 
  {active==='progresiones'&&<ProgressionsSection instrument={instrument} root={root} scaleKey={scaleKey} progression={selectedProgression} onChord={setSelectedChord} onProgression={setSelectedProgression} onOpenChord={openChord}/>} 
  {active==='composicion'&&<CompositionSection root={root} scaleKey={scaleKey} progression={selectedProgression} onOpenChord={openChord}/>} 
  {active==='herramientas'&&<ToolsSection instrument={instrument} root={root} onRoot={setRoot} onExplore={next=>explore(next,'major')} onChord={chord=>openChord(chord,'analysis')}/>}<footer>Lisa · teoría musical para guitarra y piano</footer>
 </div></main></div>
}
