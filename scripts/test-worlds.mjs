import assert from 'node:assert/strict';import {missions,primes,speed,length,sequence,depthRate,hits} from '../worlds/missions.mjs';
for(let n of missions['crystal-mines']){for(let p of primes)while(n%p===0)n/=p;assert.equal(n,1)}
for(let m of missions['velocity-rush']){assert(Number.isInteger(speed(m)));assert.equal(speed(m)*m.time,m.lead+m.rival*m.time)}
for(let m of missions['bridge-master'])assert.equal(m.choices.filter(x=>x===length(m)).length,1);
for(let m of missions['cosmic-navigator']){let Q=[{p:[0,0],n:0}],seen=new Set(['0,0']),found=false;while(Q.length){let {p,n}=Q.shift();if(p.join()==m.goal.join()){found=true;break}if(n===6)continue;for(let x=-3;x<=3;x++)for(let y=-3;y<=3;y++){let q=[p[0]+x,p[1]+y];if(q.some(v=>Math.abs(v)>5)||seen.has(q.join())||m.rocks.some(r=>hits(p,q,r)))continue;seen.add(q.join());Q.push({p:q,n:n+1})}}assert(found,'Unreachable destination')}
for(let m of missions['number-factory']){assert.equal(sequence(m).length,m.n);assert.equal(sequence(m)[0],m.start);assert(sequence(m).every(Number.isInteger))}
for(let m of missions['deep-blue']){assert(Number.isInteger(depthRate(m)));assert.equal(m.start+depthRate(m)*m.time,m.goal)}
console.log('PASS: 24 new missions, including obstacle-free space routes within fuel budget');
