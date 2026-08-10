import type {ScaleKey} from '../music/scales';
export type LickStyle='blues'|'blues-rock'|'rock'|'funk-rock'|'soul'|'pop-blues';
export type Technique='bend'|'slide'|'hammer-on'|'pull-off'|'double-stop'|'chromatic'|'enclosure'|'vibrato'|'fingerstyle'|'chord-embellishment'|'octaves'|'thumb-over'|'shuffle'|'muting'|'chord-accents'|'single-note-fills'|'wide-bend'|'quarter-tone-bend';
export type Difficulty=1|2|3|4|5;
export type LickSection='intro'|'opening-fills'|'verse-fill'|'chorus-fill'|'solo'|'outro'|'riff'|'live-improvisation'|'lead-phrasing'|'intro-style'|'rhythm-embellishment'|'main-groove'|'lead-rhythm'|'lead'|'intro-and-fills'|'style-reference';
export type TranscriptionStatus='verified'|'manual'|'pending';
export type LickEvent={string:number;fret:number;duration?:number;technique?:Technique;targetFret?:number};
export type VerifiedTheory={baseScale?:string;additionalDegrees?:string[];importantDegrees?:string[];chordShapes?:string[];techniques?:string[]};
export type DocumentationSource={publisher:string;article:string;verification:'editorial-analysis'|'song-analysis'|'style-analysis'};
export interface ReferenceLick{id:string;artist:string;song:string;album?:string;style:LickStyle;section:LickSection;referenceTimestamp?:{start:number;end:number};originalKey:string;transcriptionStatus:TranscriptionStatus;transcription?:LickEvent[];musicalContext:{scaleCandidates:ScaleKey[];chord?:string;chords?:string[];progression?:string[];description?:string};concepts:string[];techniques:Technique[];verifiedTheory?:VerifiedTheory;documentation?:DocumentationSource[];analysis?:{degrees:string[];chordTones:string[];outsideNotes?:string[];explanation:string};difficulty:Difficulty;vocabularyFamilies:string[];influences?:string[];source:{type:'recording'|'manual-transcription'|'licensed-tab';description:string}}
export type ReferenceFilters={search:string;artist:'all'|string;song:'all'|string;style:'all'|LickStyle;concept:'all'|string;technique:'all'|Technique;vocabularyFamily:'all'|string;status:'all'|TranscriptionStatus;documentation:'all'|'documented'|'undocumented';maxDifficulty:number};
