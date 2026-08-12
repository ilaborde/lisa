import {useCallback,useEffect,useRef,useState} from 'react';
import {elapsedAtChord,getPlaybackPosition,type PlaybackConfig} from '../music/practicePlayback';
export function usePracticePlayback(config:PlaybackConfig,onChord:(index:number)=>void){
 const[playing,setPlaying]=useState(false),[elapsed,setElapsed]=useState(0);const started=useRef(0),frame=useRef(0),lastIndex=useRef(0);
 const position=getPlaybackPosition(elapsed,config);
 useEffect(()=>{if(!playing)return;const tick=(now:number)=>{const next=now-started.current,set=getPlaybackPosition(next,config);setElapsed(next);if(set.chordIndex!==lastIndex.current&&set.phase==='playing'){lastIndex.current=set.chordIndex;onChord(set.chordIndex)}if(set.phase==='ended'){setPlaying(false);return}frame.current=requestAnimationFrame(tick)};started.current=performance.now()-elapsed;frame.current=requestAnimationFrame(tick);return()=>cancelAnimationFrame(frame.current)},[playing,config,onChord]);
 const play=useCallback(()=>setPlaying(true),[]),pause=useCallback(()=>setPlaying(false),[]),stop=useCallback(()=>{setPlaying(false);setElapsed(0);lastIndex.current=0;onChord(0)},[onChord]);
 const jump=useCallback((index:number)=>{const value=elapsedAtChord(config,index);setElapsed(value);started.current=performance.now()-value;lastIndex.current=index;onChord(index)},[config,onChord]);
 return{playing,position,play,pause,stop,jump};
}
