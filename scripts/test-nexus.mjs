import assert from 'node:assert/strict';
import {worlds,factors,initialEnergy,recipeOK,rotate,reflect,relayOK,beamOK,islands,vector,waves,safe,toWorld,fromWorld} from '../games/nexus-rift/math.mjs';
assert.equal(worlds.length,10);assert.equal(new Set(worlds.map(w=>w.id)).size,10);
let n=initialEnergy;for(let p of factors)while(n%p===0)n/=p;assert.equal(n,1);
let recipes=[];for(let a=0;a<=12;a++)for(let b=0;b<=12;b++)if(recipeOK(a,b))recipes.push([a,b]);assert.equal(JSON.stringify(recipes),'[[4,3]]');
let routes=[];for(let a of [0,90,180,270])for(let m of ['none','X','Y','D']){let v=rotate([2,1],a);if(relayOK(v)&&beamOK(reflect(v,m)))routes.push([a,m])}assert.equal(JSON.stringify(routes),'[[90,"X"]]');
for(let i=0;i<islands.length-1;i++){let v=vector(islands[i],islands[i+1]);assert(v.every(x=>Math.abs(x)<=4));assert(v.some(x=>x!==0));assert.equal(JSON.stringify(fromWorld(...toWorld(...islands[i],3),3)),JSON.stringify(islands[i]))}
for(let i=0;i<waves.length;i++){let good=0,bad=0;for(let x=-5;x<=5;x+=.25)for(let y=-5;y<=5;y+=.25)safe(i,x,y)?good++:bad++;assert(good>10&&bad>10);console.log('Wave',i+1,'safe sampled positions',good,'unsafe',bad)}
assert(safe(4,2,1));assert(!safe(4,0,0));console.log('PASS: all 10 links, four mission constraints, five boss waves, unique recipe and relay, all vector jumps feasible.');
