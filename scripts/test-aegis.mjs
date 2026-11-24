import assert from 'node:assert/strict';
import {stages,accepts,puzzle,candidates,world,coords} from '../games/aegis-orbia/math.mjs';
assert.equal(stages.length,6);
for(let m of stages){if(puzzle(m)){let a=candidates(m);assert(a.filter(p=>p.correct).length>=m.required);assert(a.some(p=>!p.correct));for(let p of a)assert.equal(p.correct,accepts(m,p.x,p.y));if(m.kind==='intersection')assert.equal(a.filter(p=>p.correct).length,2)}else{let good=0,bad=0;for(let x=-4;x<=4;x+=.25)for(let y=-4;y<=4;y+=.25)accepts(m,x,y)?good++:bad++;assert(good>0&&bad>0);assert(m.seconds>=14);console.log(m.title,'safe samples',good)}}
assert(!accepts(stages[3],2,0));assert(accepts(stages[3],4,0));assert(accepts(stages[4],1,1));assert(!accepts(stages[4],-3,1));
assert.deepEqual(coords(...world(2,-3)),[2,-3]);console.log('PASS: six playable mathematical objectives');
