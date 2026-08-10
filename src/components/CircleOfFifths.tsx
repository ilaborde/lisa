import {getPitchClass} from '../music/notes';

const KEYS=[
 {root:'C',label:'C',acc:'0',minor:'Am'},{root:'G',label:'G',acc:'1♯',minor:'Em'},{root:'D',label:'D',acc:'2♯',minor:'Bm'},{root:'A',label:'A',acc:'3♯',minor:'F♯m'},
 {root:'E',label:'E',acc:'4♯',minor:'C♯m'},{root:'B',label:'B',acc:'5♯',minor:'G♯m'},{root:'F#',label:'F♯ / G♭',acc:'6♯ / 6♭',minor:'D♯m / E♭m'},
 {root:'Db',label:'D♭ / C♯',acc:'5♭ / 7♯',minor:'B♭m / A♯m'},{root:'Ab',label:'A♭',acc:'4♭',minor:'Fm'},{root:'Eb',label:'E♭',acc:'3♭',minor:'Cm'},
 {root:'Bb',label:'B♭',acc:'2♭',minor:'Gm'},{root:'F',label:'F',acc:'1♭',minor:'Dm'}] as const;
export function CircleOfFifths({currentRoot,onSelect}:{currentRoot:string;onSelect:(root:string)=>void}){
 const selected=KEYS.find(k=>getPitchClass(k.root)===getPitchClass(currentRoot))??KEYS[0];
 return <div className="circle-layout"><svg className="circle-svg" viewBox="0 0 500 500" role="group" aria-label="Círculo de quintas">{KEYS.map((key,i)=>{const angle=i*30-90,x=250+190*Math.cos(angle*Math.PI/180),y=250+190*Math.sin(angle*Math.PI/180);return <g key={key.root} transform={`translate(${x} ${y})`} onClick={()=>onSelect(key.root)} className={key===selected?'selected':''} role="button" tabIndex={0} onKeyDown={e=>{if(e.key==='Enter'||e.key===' ')onSelect(key.root)}}><circle r="52"/><text y="-8">{key.label}</text><text className="minor" y="14">{key.minor}</text><text className="acc" y="33">{key.acc}</text></g>})}<circle className="circle-center" cx="250" cy="250" r="76"/><text className="center-title" x="250" y="238">{selected.label} mayor</text><text className="center-detail" x="250" y="264">relativa: {selected.minor}</text><text className="center-detail" x="250" y="286">armadura: {selected.acc}</text></svg><p>Las tonalidades vecinas difieren en una alteración. Cada tonalidad mayor comparte armadura con su relativa menor.</p></div>;
}
