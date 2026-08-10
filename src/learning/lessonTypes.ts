import type {ScaleKey} from '../music/scales';
export type ValidationRule={type:'exact';answer:string|string[]}|{type:'interval';from:string;to:string}|{type:'scale-notes';root:string;scaleKey:ScaleKey}|{type:'chord-notes';root:string;quality:'major'|'minor'|'diminished'}|{type:'harmony-quality';root:string;scaleKey:ScaleKey;degree:number};
export type LessonStep={id:string;type:'explanation'|'comparison'|'summary';title:string;body:string;lines?:string[]}|{id:string;type:'exercise';title:string;prompt:string;exercise:'multiple-choice'|'note-selection'|'order'|'fretboard';options?:string[];validation:ValidationRule;hint:string;success:string};
export type Lesson={id:string;title:string;description:string;estimatedMinutes:number;prerequisites:string[];explore?:{root:string;scaleKey:ScaleKey};steps:LessonStep[]};
export type CourseLevel={id:string;title:string;description:string;roadmapOnly?:boolean;lessons:Lesson[]};
