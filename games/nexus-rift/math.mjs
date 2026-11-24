export const worlds=[{"id":"quadratic-raid","title":"Quadratic Raid","topic":"Pertidaksamaan kuadrat"},{"id":"feasible-zone","title":"Feasible Zone","topic":"Sistem pertidaksamaan"},{"id":"inequality-raid","title":"Inequality Raid","topic":"Pertidaksamaan linear"},{"id":"transform-combo","title":"Transform Combo","topic":"Komposisi transformasi"},{"id":"skybound","title":"Skybound Transform Quest","topic":"Transformasi geometri"},{"id":"circle-meteor","title":"Lingkaran Meteor","topic":"Persamaan lingkaran"},{"id":"bazar-alkimia","title":"Bazar Alkimia SPLDV","topic":"SPLDV"},{"id":"laser-line","title":"Laser Line","topic":"Persamaan garis"},{"id":"cosmic-navigator","title":"Cosmic Navigator","topic":"Vektor"},{"id":"crystal-mines","title":"Crystal Mines","topic":"Faktorisasi prima"}];
export const factors=[2,3,5,7,11];
export const initialEnergy=60;
export const recipe={sum:7,difference:5};
export const recipeOK=(a,b)=>a+b===recipe.sum&&2*a-b===recipe.difference;
export function rotate([x,y],deg){return ({0:[x,y],90:[-y,x],180:[-x,-y],270:[y,-x]})[deg]}
export function reflect([x,y],mode){return ({none:[x,y],X:[x,-y],Y:[-x,y],D:[y,x]})[mode]}
export const relayOK=v=>v[0]===-1&&v[1]===2;
export const beamOK=v=>v[0]===-1&&v[1]===-2;
export const islands=[[0,0],[3,2],[-1,4],[2,7]];
export const vector=(a,b)=>[b[0]-a[0],b[1]-a[1]];
export const waves=[
 {name:'Meteor Shield',source:'Lingkaran Meteor',color:'#72e8ff',formula:'(x − 2)² + (y + 1)² ≤ 6,25',hint:'Di dalam lingkaran pusat (2, −1), radius 2,5.',test:(x,y)=>(x-2)**2+(y+1)**2<=6.25},
 {name:'Linear Rift',source:'Inequality Raid',color:'#f9bb7e',formula:'x + y ≥ 3',hint:'Di sisi garis x + y = 3 yang memiliki jumlah koordinat lebih besar.',test:(x,y)=>x+y>=3},
 {name:'Dual Barrier',source:'Feasible Zone',color:'#91e7b1',formula:'x ≥ −1; y ≤ 2; x + y ≥ 1',hint:'Penuhi ketiga syarat sekaligus.',test:(x,y)=>x>=-1&&y<=2&&x+y>=1},
 {name:'Parabolic Storm',source:'Quadratic Raid',color:'#d9a1fa',formula:'y ≥ x²/4 − 1',hint:'Di atas parabola y = x²/4 − 1.',test:(x,y)=>y>=x*x/4-1},
 {name:'Nexus Convergence',source:'Keempat dunia pertahanan',color:'#ffe18b',formula:'Lingkaran ∩ linear ∩ daerah layak ∩ parabola',hint:'Penuhi seluruh syarat dari empat serangan sebelumnya.',test:(x,y)=>waves.slice(0,4).every(w=>w.test(x,y))}
];
export const safe=(i,x,y)=>waves[i].test(x,y);
export const toWorld=(x,y,k=2)=>[x*k,-y*k];
export const fromWorld=(x,z,k=2)=>[x/k,-z/k];
