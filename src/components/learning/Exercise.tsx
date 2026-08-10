import {useMemo,useState} from 'react';
import {buildFretboard} from '../../music/fretboard';
import {getPitchClass} from '../../music/notes';
import {validateAnswer} from '../../learning/validation';
import type {LessonStep} from '../../learning/lessonTypes';

type ExerciseStep=Extract<LessonStep,{type:'exercise'}>;
export function Exercise({step,onCorrect}:{step:ExerciseStep;onCorrect:()=>void}){
 const[selected,setSelected]=useState<string[]>([]),[feedback,setFeedback]=useState<'idle'|'correct'|'wrong'>('idle'),[hint,setHint]=useState(false);
 const board=useMemo(()=>buildFretboard('C','major').map(row=>row.slice(0,13)),[]);
 function finish(ok:boolean){setFeedback(ok?'correct':'wrong');if(ok)onCorrect()}
 function answer(value:string){const next=step.exercise==='multiple-choice'?[value]:step.exercise==='order'?[...selected,value]:selected.includes(value)?selected.filter(v=>v!==value):[...selected,value];setSelected(next);if(step.exercise==='multiple-choice')finish(validateAnswer(step.validation,value))}
 if(step.exercise==='fretboard'){
  const rawTarget=step.validation.type==='exact'?step.validation.answer:'C',target=Array.isArray(rawTarget)?rawTarget[0]:rawTarget,targetPitch=getPitchClass(target),positions=board.flat().filter(c=>c.pitchClass===targetPitch);
  function checkBoard(){const ok=selected.length===positions.length&&selected.every(key=>{const parts=key.split('-').map(Number),stringNumber=parts[0],fret=parts[1];return board[6-stringNumber][fret].pitchClass===targetPitch});finish(ok)}
  return <div className="learning-exercise"><p>{step.prompt}</p><div className="learning-fretboard">{[...board].reverse().map((row,i)=><div key={i}><b>{row[0].string}</b>{row.map(cell=>{const key=`${6-i}-${cell.fret}`,pressed=selected.includes(key);return <button key={key} aria-pressed={pressed} onClick={()=>setSelected(v=>pressed?v.filter(x=>x!==key):[...v,key])}>{cell.fret}</button>})}</div>)}</div><button className="check-answer" onClick={checkBoard}>Comprobar</button><Feedback state={feedback} step={step}/></div>
 }
 function check(){finish(validateAnswer(step.validation,step.exercise==='multiple-choice'?selected[0]??'':selected))}
 return <div className="learning-exercise"><p>{step.prompt}</p><div className="answer-options">{step.options?.map(option=><button key={option} aria-pressed={selected.includes(option)} onClick={()=>answer(option)}>{option}</button>)}</div>{step.exercise!=='multiple-choice'&&<button className="check-answer" onClick={check}>Comprobar</button>}<button className="hint-button" onClick={()=>setHint(v=>!v)}>Ver pista</button>{hint&&feedback!=='correct'&&<p className="hint">{step.hint}</p>}<Feedback state={feedback} step={step}/></div>
}
function Feedback({state,step}:{state:'idle'|'correct'|'wrong';step:ExerciseStep}){if(state==='idle')return null;return state==='correct'?<p className="feedback correct">✓ {step.success}</p>:<p className="feedback wrong">Todavía no. {step.hint}</p>}
