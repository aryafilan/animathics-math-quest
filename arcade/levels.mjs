export const levels={
'legendary-blacksmith':[{iron:4,gold:2},{iron:3,gold:6},{iron:6,gold:4}],
'castle-siege':[{d:12},{d:18},{d:24}],
'harvest-kingdom':[{plots:6,water:9,a:{w:1,v:3},b:{w:3,v:7}},{plots:7,water:12,a:{w:1,v:3},b:{w:3,v:8}},{plots:8,water:14,a:{w:1,v:4},b:{w:4,v:11}}],
'potion-master':[{total:100,target:30,c1:0,c2:100},{total:100,target:50,c1:20,c2:80},{total:120,target:55,c1:10,c2:70}],
'pirate-expedition':[{bearing:45,distance:16,rocks:[[-6,-4],[5,-3],[14,-6]]},{bearing:315,distance:20,rocks:[[3,-6],[-7,-3],[-3,-14]]},{bearing:120,distance:19,rocks:[[7,0],[5,9],[15,-5]]}],
'math-fortress':[{budget:6,count:5,hp:3,speed:2.6},{budget:8,count:7,hp:4,speed:2.8},{budget:10,count:9,hp:5,speed:3}]
};
export const gcd=(a,b)=>b?gcd(b,a%b):a;
export const flight=(x,v)=>.8+v*x/8-x*x/16;
export const farmScore=(m,a,b)=>a*m.a.v+b*m.b.v;
export function farmBest(m){let best=0;for(let a=0;a<=m.plots;a++)for(let b=0;a+b<=m.plots;b++)if(a*m.a.w+b*m.b.w<=m.water)best=Math.max(best,farmScore(m,a,b));return best}
export const concentration=(m,a,b)=>(a*m.c1+b*m.c2)/(a+b||1);
export function treasure(m){let r=m.bearing*Math.PI/180;return [m.distance*Math.sin(r),-m.distance*Math.cos(r)]}
export const sites=[[-10,3],[-5,-3],[0,3],[5,-3],[10,3],[-8,-5],[3,5]];
export const types=[{name:'Pulse',cost:2,r:4.6,period:.52,damage:1},{name:'Nova',cost:4,r:6.7,period:.72,damage:2}];
export function waveStep(m,state,dt){
 state.time+=dt;
 while(state.spawn<m.count&&state.time>=state.spawn*.94){state.enemies.push({id:state.spawn++,x:-15,hp:m.hp})}
 for(let e of state.enemies)e.x+=m.speed*dt;
 let shots=[];
 for(let t of state.towers){t.cool=Math.max(0,t.cool-dt);let q=types[t.type],p=sites[t.site];if(t.cool<=1e-9){let e=state.enemies.filter(e=>e.hp>0&&e.x<15&&Math.hypot(e.x-p[0],p[1])<=q.r).sort((a,b)=>b.x-a.x)[0];if(e){e.hp-=q.damage;t.cool=q.period;shots.push({site:t.site,x:e.x})}}}
 state.enemies=state.enemies.filter(e=>{if(e.hp<=0){state.kills++;return false}if(e.x>=15){state.leaks++;return false}return true});
 return shots
}
export function newWave(towers){return {time:0,spawn:0,kills:0,leaks:0,enemies:[],towers:towers.map(t=>({...t,cool:0}))}}
