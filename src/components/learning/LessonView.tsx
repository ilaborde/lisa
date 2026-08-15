import {useState} from 'react';
import type {Lesson} from '../../learning/lessonTypes';
import type {Instrument} from '../../music/instrument';
import {getLearningProgress,markLessonComplete,saveLessonStep} from '../../learning/progress';
import {getLesson} from '../../learning/curriculum';
import {LESSON_GUIDANCE} from '../../learning/guidance';
import {LessonStep} from './LessonStep';

export function LessonView({lesson,onBack,onNext,onExplore,onPracticeArpeggios,instrument}:{lesson:Lesson;instrument:Instrument;onBack:()=>void;onNext:()=>void;onExplore:(root:string,scaleKey:NonNullable<Lesson['explore']>['scaleKey'])=>void;onPracticeArpeggios:()=>void}){
 const[index,setIndex]=useState(()=>Math.min(getLearningProgress().savedSteps[lesson.id]??0,lesson.steps.length-1)),step=lesson.steps[index],last=index===lesson.steps.length-1,guidance=LESSON_GUIDANCE[lesson.id],previous=lesson.prerequisites.map(getLesson).filter(Boolean).map(item=>item!.title);
 function forward(){saveLessonStep(lesson.id,index+1);if(last){markLessonComplete(lesson.id);onNext()}else setIndex(i=>i+1)}
 return <div className="lesson-view"><button className="back-button" onClick={onBack}>← Ruta de aprendizaje</button>
  <header><div><p className="eyebrow">Lección · {lesson.estimatedMinutes} min</p><h1>{lesson.title}</h1><p>{lesson.description}</p></div><span>Paso {index+1} de {lesson.steps.length}</span></header>
  {guidance&&<section className="lesson-context"><div><small>Venís de</small><strong>{previous.length?previous.join(' · '):'El comienzo del recorrido'}</strong></div><div><small>Objetivo</small><strong>{guidance.goal}</strong></div><div><small>Para qué sirve</small><strong>{guidance.application}</strong></div><p>{guidance.connection}</p></section>}
  <nav className="lesson-roadmap" aria-label="Pasos de la lección">{lesson.steps.map((item,stepIndex)=><button key={item.id} aria-current={stepIndex===index?'step':undefined} className={stepIndex<index?'done':''} onClick={()=>setIndex(stepIndex)}><span>{stepIndex<index?'✓':stepIndex+1}</span><small>{item.type==='exercise'?'Práctica':item.type==='summary'?'Conexión':'Concepto'}</small><strong>{item.title}</strong></button>)}</nav>
  <div className="lesson-progress"><i style={{width:`${((index+1)/lesson.steps.length)*100}%`}}/></div>
  <LessonStep step={step} instrument={instrument} onCorrect={()=>saveLessonStep(lesson.id,index,true)}/>
  {last&&guidance&&<p className="lesson-closure"><strong>Ahora podés:</strong> {guidance.application}</p>}
  {lesson.explore&&last&&<button className="context-action" onClick={()=>onExplore(lesson.explore!.root,lesson.explore!.scaleKey)}>Aplicar en Explorar: {lesson.explore.root}</button>}
  {last&&lesson.id.includes('arpeggio')&&<button className="context-action" onClick={onPracticeArpeggios}>Practicar arpegios · C | Am | F | G</button>}
  <nav className="lesson-nav"><button disabled={index===0} onClick={()=>setIndex(i=>i-1)}>← Anterior</button><button onClick={forward}>{last?'Completar lección':'Siguiente →'}</button></nav>
 </div>
}
