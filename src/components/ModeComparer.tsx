import { DIATONIC_MODE_ORDER,getScaleByKey,getScaleNotes,isDiatonicMode,type ScaleKey } from '../music/scales';
const CHANGES=[{from:'#4',to:'4'},{from:'7',to:'b7'},{from:'3',to:'b3'},{from:'6',to:'b6'},{from:'2',to:'b2'},{from:'5',to:'b5'}];
export function ModeComparer({root,currentKey}:{root:string;currentKey:ScaleKey}){
 const reference=isDiatonicMode(currentKey)?currentKey:'ionian';
 return <div className="mode-comparer">{!isDiatonicMode(currentKey)&&<p className="notice">El continuo compara únicamente los siete modos diatónicos. Se destaca Jónico como referencia.</p>}
  <div className="mode-list">{DIATONIC_MODE_ORDER.map(key=><div className={`mode-chip ${key===reference?'active':''}`} key={key}><strong>{getScaleByKey(key).name}</strong><span>{getScaleNotes(root,key).join(' ')}</span></div>)}</div>
  <div className="transitions">{CHANGES.map((change,i)=>{const from=DIATONIC_MODE_ORDER[i],to=DIATONIC_MODE_ORDER[i+1],a=getScaleNotes(root,from),b=getScaleNotes(root,to),index=a.findIndex((n,j)=>n!==b[j]);return <div key={from}><strong>{getScaleByKey(from).name} → {getScaleByKey(to).name}</strong><span>{change.from} → {change.to}</span><span>{a[index]} → {b[index]}</span></div>})}</div>
 </div>;
}
