import assert from 'node:assert/strict';
import {levels,gcd,flight,farmBest,farmScore,concentration,treasure,sites,types,waveStep,newWave} from '../arcade/levels.mjs';
for(let m of levels['legendary-blacksmith'])assert(gcd(m.iron,m.gold)>0&&m.iron+m.gold<=10);
for(let m of levels['castle-siege'])assert(Math.abs(flight(m.d,m.d/2)-.8)<1e-9);
for(let m of levels['harvest-kingdom'])assert(farmBest(m)>0);
for(let m of levels['potion-master']){let solutions=0;for(let a=0;a<=m.total;a+=5)if(Math.abs(concentration(m,a,m.total-a)-m.target)<1e-9)solutions++;assert.equal(solutions,1)}
for(let m of levels['pirate-expedition']){let [x,z]=treasure(m);assert(Math.abs(Math.hypot(x,z)-m.distance)<1e-9);assert(m.rocks.every(([a,b])=>Math.hypot(a-x,b-z)>2.15))}
for(let m of levels['math-fortress']){let witness=null,minCost=Infinity;for(let i=0;i<3**sites.length;i++){let n=i,towers=[],cost=0;for(let j=0;j<sites.length;j++){let d=n%3;n=Math.floor(n/3);if(d){towers.push({site:j,type:d-1});cost+=types[d-1].cost}}if(!towers.length||cost>m.budget)continue;let s=newWave(towers);for(let t=0;t<2400&&s.kills+s.leaks<m.count;t++)waveStep(m,s,1/60);if(s.kills===m.count&&s.leaks===0&&cost<minCost){witness=towers;minCost=cost}}assert(witness,'No perfect defense for budget '+m.budget);assert.equal(minCost,m.budget);assert(witness.length>=2);console.log('Defense witness',m.budget,JSON.stringify(witness))}
console.log('PASS 18 missions');
