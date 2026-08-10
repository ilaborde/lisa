import type {ChordRecord} from './chords';import type {ScaleKey} from './scales';
export type MusicalContextState={root:string;scaleKey:ScaleKey;selectedChord:ChordRecord|null};
export function selectContextChord(context:MusicalContextState,chord:ChordRecord):MusicalContextState{return {...context,selectedChord:chord}}
export function selectContextScale(context:MusicalContextState,scaleKey:ScaleKey):MusicalContextState{return {...context,scaleKey}}
export function selectContextRoot(context:MusicalContextState,root:string):MusicalContextState{return {...context,root}}
export function exploreMajorContext(context:MusicalContextState,root:string):MusicalContextState{return {...context,root,scaleKey:'major'}}
