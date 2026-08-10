import {describe,expect,it} from 'vitest';
import {buildFretboard} from '../../music/fretboard';
import {getPitchClass} from '../../music/notes';
import {fretboardCellKey,validateFretboardSelection} from '../fretboardExercise';

describe('ejercicio del mástil',()=>{
 const board=buildFretboard('C','major').map(row=>row.slice(0,13));
 it('valida los seis C correctos entre los trastes 0 y 12',()=>{const selected=['1-8','2-1','3-5','4-10','5-3','6-8'];expect(validateFretboardSelection(board,selected,getPitchClass('C'))).toBe(true)});
 it('asigna la primera fila visible a la primera cuerda',()=>expect(fretboardCellKey(0,8)).toBe('1-8'));
 it('rechaza una posición incorrecta aunque haya seis selecciones',()=>expect(validateFretboardSelection(board,['1-8','2-1','3-5','4-10','5-3','6-7'],getPitchClass('C'))).toBe(false));
});
