import type {FretboardCell} from '../music/fretboard';

export function fretboardCellKey(renderedRowIndex:number,fret:number){return `${renderedRowIndex+1}-${fret}`}
export function validateFretboardSelection(board:FretboardCell[][],selected:readonly string[],targetPitch:number|null){
 if(targetPitch===null)return false;
 const positions=board.flat().filter(cell=>cell.pitchClass===targetPitch);
 return selected.length===positions.length&&selected.every(key=>{const[stringNumber,fret]=key.split('-').map(Number);return board[6-stringNumber]?.[fret]?.pitchClass===targetPitch});
}
