export type Instrument='guitar'|'piano';export const DEFAULT_INSTRUMENT:Instrument='guitar';const KEY='lisa-instrument';
export function getSavedInstrument():Instrument{if(typeof localStorage==='undefined')return DEFAULT_INSTRUMENT;return localStorage.getItem(KEY)==='piano'?'piano':'guitar'}
export function saveInstrument(value:Instrument){if(typeof localStorage!=='undefined')localStorage.setItem(KEY,value);return value}
