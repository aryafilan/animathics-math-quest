export const missions={
'crystal-mines':[12,30,84,105],
'velocity-rush':[{lead:12,rival:4,time:4},{lead:18,rival:5,time:6},{lead:20,rival:3,time:5},{lead:24,rival:6,time:4}],
'bridge-master':[{a:3,b:4,choices:[4,5,6]},{a:6,b:8,choices:[9,10,12]},{a:5,b:12,choices:[12,13,15]},{a:8,b:15,choices:[16,17,18]}],
'cosmic-navigator':[{goal:[3,2],rocks:[[1,2],[-2,1]]},{goal:[-4,3],rocks:[[-2,1],[-3,-1]]},{goal:[4,-3],rocks:[[2,-1],[1,2]]},{goal:[-3,-4],rocks:[[-1,-2],[2,-2]]}],
'number-factory':[{start:2,param:3,kind:'add',n:5},{start:3,param:2,kind:'mul',n:4},{start:16,param:-3,kind:'add',n:5},{start:2,param:3,kind:'mul',n:4}],
'deep-blue':[{start:4,goal:16,time:4},{start:18,goal:6,time:3},{start:3,goal:23,time:5},{start:28,goal:10,time:6}]
};
export const primes=[2,3,5,7,11,13];
export const speed=m=>m.rival+m.lead/m.time;
export const length=m=>Math.hypot(m.a,m.b);
export const sequence=(m,p=m.param)=>Array.from({length:m.n},(_,i)=>m.kind==='add'?m.start+i*p:m.start*p**i);
export const depthRate=m=>(m.goal-m.start)/m.time;
export function hits(a,b,r,tol=.48){let dx=b[0]-a[0],dy=b[1]-a[1],q=dx*dx+dy*dy;if(!q)return Math.hypot(a[0]-r[0],a[1]-r[1])<tol;let t=Math.max(0,Math.min(1,((r[0]-a[0])*dx+(r[1]-a[1])*dy)/q));return Math.hypot(a[0]+t*dx-r[0],a[1]+t*dy-r[1])<tol}
