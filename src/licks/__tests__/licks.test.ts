import {describe,expect,it} from 'vitest';import {REFERENCE_LICKS} from '../data';import {filterLicks} from '../filters';import {analyzeTranscription,degreeOfPosition} from '../theory';import {transposeLick} from '../transpose';import type {ReferenceFilters,ReferenceLick} from '../types';
const filters=(o:Partial<ReferenceFilters>={}):ReferenceFilters=>({search:'',artist:'all',song:'all',style:'all',concept:'all',technique:'all',vocabularyFamily:'all',status:'all',documentation:'all',maxDifficulty:5,...o});
const verified:ReferenceLick={...REFERENCE_LICKS[0],id:'fixture',originalKey:'A',transcriptionStatus:'verified',transcription:[{string:1,fret:5},{string:1,fret:8},{string:2,fret:5},{string:3,fret:6}],musicalContext:{scaleCandidates:['minor-pentatonic']}};
describe('referencias de vocabulario',()=>{
 it('mantiene al menos 40 referencias y cinco por artista',()=>{expect(REFERENCE_LICKS.length).toBeGreaterThanOrEqual(40);const counts=REFERENCE_LICKS.reduce<Record<string,number>>((a,l)=>({...a,[l.artist]:(a[l.artist]??0)+1}),{});expect(Object.values(counts).every(n=>n>=5)).toBe(true)});
 it('enriquece canciones existentes sin duplicar artista+canción',()=>{const gravity=REFERENCE_LICKS.filter(l=>l.artist==='John Mayer'&&l.song==='Gravity');expect(gravity).toHaveLength(1);expect(gravity[0].documentation?.length).toBeGreaterThan(0);expect(gravity[0].verifiedTheory?.importantDegrees).toContain('6')});
 it('filtra referencias documentadas',()=>{const docs=filterLicks(REFERENCE_LICKS,filters({documentation:'documented'}));expect(docs.length).toBeGreaterThan(0);expect(docs.every(l=>l.documentation?.length)).toBe(true)});
 it('todas tienen artista y familias',()=>expect(REFERENCE_LICKS.every(l=>l.artist.trim()&&l.vocabularyFamilies.length)).toBe(true));
 it('filtra por artista y familia',()=>{expect(filterLicks(REFERENCE_LICKS,filters({artist:'John Mayer'})).length).toBeGreaterThanOrEqual(5);expect(filterLicks(REFERENCE_LICKS,filters({vocabularyFamily:'BB Box'})).every(l=>l.vocabularyFamilies.includes('BB Box'))).toBe(true)});
 it('las pendientes no contienen eventos ficticios',()=>expect(REFERENCE_LICKS.filter(l=>l.transcriptionStatus==='pending').every(l=>l.transcription===undefined)).toBe(true));
 it('una transcripción verificada contiene eventos',()=>expect(verified.transcriptionStatus==='verified'&&verified.transcription!.length>0).toBe(true));
 it('transporta y preserva grados',()=>{const moved=transposeLick(verified,'C');expect(moved.transcription!.map(n=>degreeOfPosition(n,moved.originalKey))).toEqual(verified.transcription!.map(n=>degreeOfPosition(n,verified.originalKey)))});
 it('detecta notas fuera de la escala base',()=>expect(analyzeTranscription(verified).outsideNotes.length).toBeGreaterThan(0));
});
