import {describe,expect,it} from 'vitest';import {expectedAnswer,validateAnswer} from '../validation';
describe('validación pedagógica con el motor musical',()=>{
 it('valida intervalos',()=>expect(validateAnswer({type:'interval',from:'B',to:'D'},'3')).toBe(true));
 it('construye G mayor',()=>expect(expectedAnswer({type:'scale-notes',root:'G',scaleKey:'major'})).toEqual(['G','A','B','C','D','E','F#']));
 it('valida una triada mayor',()=>expect(validateAnswer({type:'chord-notes',root:'C',quality:'major'},['C','E','G'])).toBe(true));
 it('valida B disminuido',()=>expect(validateAnswer({type:'chord-notes',root:'B',quality:'diminished'},['B','D','F'])).toBe(true));
 it('calcula el patrón de armonización',()=>expect(validateAnswer({type:'harmony-quality',root:'G',scaleKey:'major',degree:6},'menor')).toBe(true));
});
