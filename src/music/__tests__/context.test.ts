import {describe,expect,it} from 'vitest';import {getChordFromScale} from '../chords';import {exploreMajorContext,selectContextChord,selectContextRoot,selectContextScale,type MusicalContextState} from '../context';
const initial:MusicalContextState={root:'G',scaleKey:'mixolydian',selectedChord:null};
describe('flujo de contexto musical',()=>{
 it('selecciona un acorde desde armonización y lo mantiene',()=>{const chord=getChordFromScale('G','mixolydian',false).find(c=>c.root==='C')!;expect(selectContextChord(initial,chord).selectedChord?.label).toBe('C')});
 it('cambia el modo manteniendo la tónica',()=>{const next=selectContextScale(initial,'dorian');expect(next).toMatchObject({root:'G',scaleKey:'dorian'})});
 it('cambia la tónica desde una herramienta',()=>expect(selectContextRoot(initial,'Eb').root).toBe('Eb'));
 it('explora la tonalidad mayor elegida en el círculo',()=>expect(exploreMajorContext(initial,'Eb')).toMatchObject({root:'Eb',scaleKey:'major'}));
 it('el acorde compartido sirve para análisis y voicings',()=>{const chord=getChordFromScale('C','ionian',true)[4],next=selectContextChord(initial,chord);expect(next.selectedChord).toBe(chord);expect(next.selectedChord?.quality).toBe(chord.quality)});
 it('un acorde detectado usa el mismo flujo compartido',()=>{const detected=getChordFromScale('D','major',true)[0];expect(selectContextChord(initial,detected).selectedChord?.root).toBe('D')});
});
