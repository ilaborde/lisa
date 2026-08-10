import {describe,expect,it} from 'vitest';import {CURRICULUM,IMPLEMENTED_LESSONS} from '../curriculum';import {getScaleByKey} from '../../music/scales';
describe('currículo',()=>{
 it('implementa quince lecciones con pasos',()=>{expect(IMPLEMENTED_LESSONS).toHaveLength(15);expect(IMPLEMENTED_LESSONS.every(l=>l.steps.length>0&&l.steps.length<=7)).toBe(true)});
 it('tiene ids únicos',()=>{const ids=IMPLEMENTED_LESSONS.map(l=>l.id);expect(new Set(ids).size).toBe(ids.length)});
 it('sólo referencia prerequisitos existentes',()=>{const ids=new Set(IMPLEMENTED_LESSONS.map(l=>l.id));expect(IMPLEMENTED_LESSONS.flatMap(l=>l.prerequisites).every(id=>ids.has(id))).toBe(true)});
 it('no referencia escalas inexistentes',()=>expect(IMPLEMENTED_LESSONS.filter(l=>l.explore).every(l=>getScaleByKey(l.explore!.scaleKey).key===l.explore!.scaleKey)).toBe(true));
 it('deja niveles avanzados como roadmap',()=>expect(CURRICULUM.filter(l=>l.roadmapOnly)).toHaveLength(4));
});
