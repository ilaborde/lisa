import {describe,expect,it} from 'vitest';
import {buildChord,type ChordQuality} from '../chords';
import {findClosestArpeggioShape,findClosestVoiceMovements,getArpeggio,getArpeggioShapes} from '../arpeggios';
import {getPlaybackPosition,type PlaybackConfig} from '../practicePlayback';
import {analyzePracticeNote} from '../practiceSuggestions';

describe('motor de arpegios derivado de acordes',()=>{
 const cases:[ChordQuality,string[]][]=[['major',['C','E','G']],['minor',['C','Eb','G']],['dominant7',['C','E','G','Bb']],['major7',['C','E','G','B']],['minor7',['C','Eb','G','Bb']],['halfDiminished7',['C','Eb','Gb','Bb']],['dominant9',['C','E','G','Bb','D']]];
 it.each(cases)('%s produce las notas correctas',(quality,notes)=>expect(getArpeggio(buildChord('C',quality)!).notes).toEqual(notes));
 it('reduce C9 sin mantener datos separados',()=>{const chord=buildChord('C','dominant9')!;expect(getArpeggio(chord,'triad').notes).toEqual(['C','E','G']);expect(getArpeggio(chord,'seventh').notes).toEqual(['C','E','G','Bb']);expect(getArpeggio(chord,'full').notes).toEqual(['C','E','G','Bb','D'])});
 it('genera posiciones desde afinación y rango y elige la cercana',()=>{const f=getArpeggioShapes(buildChord('F','dominant7')!,{ranges:[{id:'low',from:0,to:5},{id:'mid',from:5,to:10}]});const bb=getArpeggioShapes(buildChord('Bb','dominant7')!,{ranges:[{id:'low',from:0,to:5},{id:'mid',from:5,to:10}]});expect(f[0].positions.length).toBeGreaterThan(3);expect(findClosestArpeggioShape(f[1],bb)?.id).toBe('mid')});
});

describe('arpegios sobre playback y contexto',()=>{
 const chords=[buildChord('F','dominant9')!,buildChord('Bb','dominant9')!,buildChord('C','dominant9')!,buildChord('Bb','dominant9')!],config:PlaybackConfig={bpm:75,beatsPerBar:4,globalBars:1,chordBars:[undefined,undefined,undefined,undefined],loop:true,countInBars:0};
 it('cambia el arpegio con el acorde activo y vuelve en loop',()=>{const duration=60000/75*4;expect([0,1,2,3,4].map(index=>getArpeggio(chords[getPlaybackPosition(index*duration,config).chordIndex]).notes)).toEqual([['F','A','C','Eb','G'],['Bb','D','F','Ab','C'],['C','E','G','Bb','D'],['Bb','D','F','Ab','C'],['F','A','C','Eb','G']])});
 it('explica D como tercera fuerte de Bb9 aunque quede fuera de F pentatónica menor',()=>{const result=analyzePracticeNote({note:'D',baseScale:{root:'F',scaleKey:'minor-pentatonic'},chord:chords[1]});expect(result.scaleRelation.belongs).toBe(false);expect(result.chordRelation).toMatchObject({belongs:true,degree:'3',role:'third'});expect(result.importance).toBe('strong-target')});
 it('detecta notas comunes y movimientos cercanos sin imponer voice leading',()=>{const result=findClosestVoiceMovements(getArpeggio(chords[0]),getArpeggio(chords[1]));expect(result.commonNotes).toEqual(['F','C']);expect(result.movements).toContainEqual({from:'A',to:'Ab',semitones:1})});
});
