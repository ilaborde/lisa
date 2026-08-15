import {describe,expect,it} from 'vitest';
import {buildChord} from '../chords';
import {FRET_ZONES,analyzePracticeNote,getChordTones,getTargetNotes,nearestZone,noteInScale,suggestScales,type PracticeSession} from '../practiceSuggestions';
import {beatDurationMs,chordDurationMs,elapsedAtChord,getPlaybackPosition,type PlaybackConfig} from '../practicePlayback';
import {loadPracticeSession,savePracticeSession} from '../practicePersistence';

describe('motor de práctica',()=>{
 it('sugiere opciones blues razonables para A7',()=>{const chord=buildChord('A','dominant7')!,labels=suggestScales(chord,[chord,buildChord('D','dominant7')!,buildChord('E','dominant7')!],'blues','global').map(s=>s.label);expect(labels).toContain('A Blues');expect(labels).toContain('A Pentatónica menor');expect(labels).toContain('A Mixolidio')});
 it('calcula chord tones y objetivos de D7',()=>{const chord=buildChord('D','dominant7')!;expect(getChordTones(chord)).toEqual(['D','F#','A','C']);expect(getTargetNotes(chord,'third')).toEqual(['F#']);expect(getTargetNotes(chord,'seventh')).toEqual(['C'])});
 it('reconoce una nota objetivo externa a la escala global',()=>{expect(noteInScale('F#',{root:'A',scaleKey:'minor-blues'})).toBe(false)});
 it('mantiene zonas físicas válidas y cercanas',()=>{expect(FRET_ZONES.every(z=>z.from>=0&&z.to<=21)).toBe(true);expect(nearestZone('mid').id).toBe('mid')});
});

describe('análisis contextual',()=>{it('reconoce Bb en G pentatónica menor y como fundamental de Bb9',()=>{const analysis=analyzePracticeNote({note:'Bb',baseScale:{root:'G',scaleKey:'minor-pentatonic'},chord:buildChord('Bb','dominant9')!});expect(analysis.scaleRelation).toMatchObject({belongs:true,degree:'b3'});expect(analysis.chordRelation).toMatchObject({belongs:true,degree:'1',role:'root'})});it('prioriza F# como tercera fuerte de D7 aunque quede fuera de A blues',()=>{const analysis=analyzePracticeNote({note:'F#',baseScale:{root:'A',scaleKey:'minor-blues'},chord:buildChord('D','dominant7')!});expect(analysis.scaleRelation.belongs).toBe(false);expect(analysis.chordRelation).toMatchObject({degree:'3',role:'third'});expect(analysis.importance).toBe('strong-target')})});

describe('playback musical',()=>{const config:PlaybackConfig={bpm:120,beatsPerBar:4,globalBars:1,chordBars:[undefined,2],loop:false,countInBars:0};it('calcula BPM y compases',()=>{expect(beatDurationMs(120)).toBe(500);expect(chordDurationMs(120,4,1)).toBe(2000);expect(chordDurationMs(120,4,2)).toBe(4000)});it('avanza con duraciones individuales',()=>{expect(getPlaybackPosition(1999,config).chordIndex).toBe(0);expect(getPlaybackPosition(2000,config)).toMatchObject({chordIndex:1,bar:1,beat:1});expect(getPlaybackPosition(4500,config).bar).toBe(2)});it('termina o vuelve según loop',()=>{expect(getPlaybackPosition(6000,config).phase).toBe('ended');expect(getPlaybackPosition(6000,{...config,loop:true}).chordIndex).toBe(0)});it('resuelve count-in y salto manual',()=>{const counted={...config,countInBars:1};expect(getPlaybackPosition(500,counted).phase).toBe('count-in');expect(getPlaybackPosition(2000,counted).phase).toBe('playing');expect(elapsedAtChord(config,1)).toBe(2000)})});

describe('persistencia de práctica',()=>{it('guarda y restaura arpegio, posición visual y guide tones',()=>{let raw:string|null=null;const storage={getItem:()=>raw,setItem:(_key:string,value:string)=>{raw=value}};const session={mode:'guided',genre:'blues',approach:'arpeggios',activeChordIndex:0,keepNearby:true,target:'both',globalScale:{root:'A',scaleKey:'minor-blues'},chordConfigs:[],bpm:80,beatsPerBar:4,globalBars:1,loop:true,countIn:0,showNextTarget:true,arpeggioExtent:'seventh',showGuideTones:true,labelMode:'degrees'} as PracticeSession;savePracticeSession(session,storage);expect(loadPracticeSession(storage)).toMatchObject(session)})});


