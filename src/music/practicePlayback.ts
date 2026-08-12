export type PlaybackConfig={bpm:number;beatsPerBar:number;globalBars:number;chordBars:(number|undefined)[];loop:boolean;countInBars:number};
export type PlaybackPosition={phase:'count-in'|'playing'|'ended';chordIndex:number;bar:number;beat:number;progress:number;elapsedInChordMs:number;nextChordIndex:number|null;countInBeat:number};
export function beatDurationMs(bpm:number){return 60000/Math.max(20,bpm)}
export function chordDurationMs(bpm:number,beatsPerBar:number,bars:number){return beatDurationMs(bpm)*beatsPerBar*Math.max(1,bars)}
export function resolveChordBars(config:PlaybackConfig,index:number){return config.chordBars[index]??config.globalBars}
export function getPlaybackPosition(elapsedMs:number,config:PlaybackConfig):PlaybackPosition{
 const beatMs=beatDurationMs(config.bpm),countMs=config.countInBars*config.beatsPerBar*beatMs;
 if(elapsedMs<countMs)return{phase:'count-in',chordIndex:0,bar:0,beat:Math.floor(elapsedMs/beatMs)%config.beatsPerBar+1,progress:countMs?elapsedMs/countMs:0,elapsedInChordMs:0,nextChordIndex:0,countInBeat:Math.floor(elapsedMs/beatMs)+1};
 const durations=config.chordBars.map((_,i)=>chordDurationMs(config.bpm,config.beatsPerBar,resolveChordBars(config,i))),cycle=durations.reduce((a,b)=>a+b,0),musical=Math.max(0,elapsedMs-countMs);
 if(!durations.length||(!config.loop&&musical>=cycle))return{phase:'ended',chordIndex:Math.max(0,durations.length-1),bar:1,beat:1,progress:1,elapsedInChordMs:0,nextChordIndex:null,countInBeat:0};
 let cursor=config.loop&&cycle?musical%cycle:musical,index=0;while(index<durations.length-1&&cursor>=durations[index]){cursor-=durations[index];index++}
 const bars=resolveChordBars(config,index),bar=Math.min(bars,Math.floor(cursor/(beatMs*config.beatsPerBar))+1),beat=Math.floor(cursor/beatMs)%config.beatsPerBar+1,next=index<durations.length-1?index+1:config.loop?0:null;
 return{phase:'playing',chordIndex:index,bar,beat,progress:cursor/durations[index],elapsedInChordMs:cursor,nextChordIndex:next,countInBeat:0}
}
export function elapsedAtChord(config:PlaybackConfig,index:number){const count=config.countInBars*config.beatsPerBar*beatDurationMs(config.bpm);return count+config.chordBars.slice(0,index).reduce<number>((sum,_,i)=>sum+chordDurationMs(config.bpm,config.beatsPerBar,resolveChordBars(config,i)),0)}
