import type {ScaleKey} from '../music/scales';
import type {ChordQuality} from '../music/chords';

export type TheoryCategory='fundamentals'|'intervals'|'scales'|'modes'|'chords'|'harmony'|'advanced-harmony'|'improvisation'|'rhythm'|'melody'|'composition';
export type TheoryLevel='basic'|'intermediate'|'advanced';
export type TheoryAction={label:string;target:'explore'|'chords'|'progressions'|'practice'|'learn';root?:string;scaleKey?:ScaleKey;chordQuality?:ChordQuality;lessonId?:string};
export type TheorySection=
 |{type:'text';title:string;body:string}
 |{type:'formula';title?:string;formula:string;caption?:string}
 |{type:'example';title:string;lines:string[];body?:string}
 |{type:'callout';kind:'importance'|'try'|'warning';title:string;body:string}
 |{type:'comparison';title:string;items:{label:string;formula?:string;notes?:string[]}[];highlight?:string}
 |{type:'scale';title:string;root:string;scaleKey:ScaleKey;compareWith?:ScaleKey;harmonize?:boolean}
 |{type:'chord';title:string;root:string;quality:ChordQuality;compareWith?:ChordQuality[]};
export type TheoryArticle={id:string;title:string;aliases?:string[];keywords?:string[];category:TheoryCategory;level:TheoryLevel;summary:string;sections:TheorySection[];related?:string[];actions?:TheoryAction[];lessonId?:string};
