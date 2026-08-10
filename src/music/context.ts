import type {ChordRecord} from './chords';import type {ScaleKey} from './scales';import type {ProgressionItem} from './progressions';
export type MusicalContextState={root:string;scaleKey:ScaleKey;selectedChord:ChordRecord|null;selectedProgression:ProgressionItem[]};
export function selectContextChord(context:MusicalContextState,chord:ChordRecord):MusicalContextState{return {...context,selectedChord:chord}}
export function selectContextScale(context:MusicalContextState,scaleKey:ScaleKey):MusicalContextState{return {...context,scaleKey}}
export function selectContextRoot(context:MusicalContextState,root:string):MusicalContextState{return {...context,root}}
export function exploreMajorContext(context:MusicalContextState,root:string):MusicalContextState{return {...context,root,scaleKey:'major'}}
export function selectContextProgression(context:MusicalContextState,selectedProgression:ProgressionItem[]):MusicalContextState{return {...context,selectedProgression}}
