import { describe, it, expect } from 'vitest';
import { getScaleNotes, getChordFromRoot, buildInterval } from '../theory';

describe('Motor musical básico', () => {
  it('G mixolidio produce G A B C D E F y grados 1 2 3 4 5 6 b7', () => {
    const scale = getScaleNotes('G', 'mixolydian');
    expect(scale).toEqual(['G', 'A', 'B', 'C', 'D', 'E', 'F']);
    const harmony = getChordFromRoot('G', 'mixolydian', false).map((chord) => chord.label);
    expect(harmony).toEqual(['G', 'Am', 'Bdim', 'C', 'Dm', 'Em', 'F']);
  });

  it('C mayor produce C D E F G A B y armonización correcta', () => {
    const scale = getScaleNotes('C', 'major');
    expect(scale).toEqual(['C', 'D', 'E', 'F', 'G', 'A', 'B']);
    const harmony = getChordFromRoot('C', 'major', false).map((chord) => chord.label);
    expect(harmony).toEqual(['C', 'Dm', 'Em', 'F', 'G', 'Am', 'Bdim']);
  });

  it('D dórico produce D E F G A B C', () => {
    const scale = getScaleNotes('D', 'dorian');
    expect(scale).toEqual(['D', 'E', 'F', 'G', 'A', 'B', 'C']);
  });

  it('A menor pentatónica produce A C D E G', () => {
    const scale = getScaleNotes('A', 'minor-pentatonic');
    expect(scale).toEqual(['A', 'C', 'D', 'E', 'G']);
  });

  it('B disminuido produce B D F', () => {
    const harmony = getChordFromRoot('B', 'locrian', false).find((chord) => chord.label.startsWith('B'));
    expect(harmony?.notes.slice(0, 3)).toEqual(['B', 'D', 'F']);
  });

  it('Intervalos: B → D = 3 semitonos, B → F = 6 semitonos', () => {
    const intervalBD = buildInterval('B', 'D');
    const intervalBF = buildInterval('B', 'F');
    expect(intervalBD).toBeDefined();
    expect(intervalBD?.quality).toContain('menor');
    expect(intervalBF).toBeDefined();
    expect(intervalBF?.description).toContain('disminuida');
  });
});
