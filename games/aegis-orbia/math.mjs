export const STEP=2.4;
export const stages=[
 {chapter:0,title:'Fallen Garden',objective:'Pulihkan perisai taman',kind:'inside',a:2,b:1,r:2,seconds:15,formula:'(x − 2)² + (y − 1)² ≤ 4',story:'Orin tiba di taman penjaga. Menara pertama masih menyimpan energi. Temukan zona aman sebelum pecahan langit menghantam.',hint:'Pusat (2, 1), radius 2. Berlindung di dalam atau pada batas.'},
 {chapter:0,title:'Ring of Echoes',objective:'Aktifkan dua segel pada keliling',kind:'ring',a:0,b:0,r:3,required:2,formula:'x² + y² = 9',story:'Perisai menyelamatkan taman, tetapi jalur menuju menara terputus. Dua segel keliling dapat membuka gerbang.',hint:'Pilih dua titik berbeda yang tepat memenuhi persamaan. Dekati kristal dan tekan E.'},
 {chapter:1,title:'Twin Gates',objective:'Aktifkan dua titik perpotongan',kind:'intersection',a:-2,b:0,r:Math.sqrt(13),c:2,d:0,s:Math.sqrt(13),required:2,formula:'(x + 2)² + y² = 13\\n(x − 2)² + y² = 13',story:'Dua menara saling mengunci. Hanya dua koordinat bersama yang bisa menyinkronkan keduanya.',hint:'Pilih kedua titik yang berada tepat pada kedua keliling.'},
 {chapter:1,title:'Hollow Dome',objective:'Berlindung di wilayah cincin',kind:'annulus',a:0,b:0,r:4,inner:2,seconds:16,formula:'4 < x² + y² ≤ 16',story:'Menara telah terhubung, tetapi inti tengah terlalu panas. Perisai berikutnya hanya melindungi kawasan berbentuk cincin.',hint:'Di luar radius 2 dan di dalam atau pada radius 4.'},
 {chapter:2,title:'The Convergence',objective:'Bertahan di irisan dua perisai',kind:'overlap',a:-1,b:1,r:3,c:2,d:1,s:2.5,seconds:18,formula:'(x + 1)² + (y − 1)² ≤ 9\\n(x − 2)² + (y − 1)² ≤ 6,25',story:'Orin mencapai Core Tower. Dua arus energi harus melindunginya bersamaan untuk meredam badai terakhir.',hint:'Masuk ke daerah yang memenuhi kedua pertidaksamaan.'},
 {chapter:2,title:'The Last Shield',objective:'Nyalakan perisai terakhir',kind:'inside',a:0,b:-2,r:1.5,seconds:14,formula:'x² + (y + 2)² ≤ 2,25',story:'Inti terakhir menunggu. Satu gelombang lagi dan Orbia akan kembali terlindungi.',hint:'Pusat (0, −2), radius 1,5.'}
];
export const sq=(x,y,a,b)=>(x-a)**2+(y-b)**2;
export function accepts(m,x,y){let q=sq(x,y,m.a,m.b),r=m.r*m.r,e=1e-8;switch(m.kind){case'inside':return q<=r+e;case'ring':return Math.abs(q-r)<e;case'intersection':return Math.abs(q-r)<e&&Math.abs(sq(x,y,m.c,m.d)-m.s*m.s)<e;case'annulus':return q>m.inner*m.inner&&q<=r+e;case'overlap':return q<=r+e&&sq(x,y,m.c,m.d)<=m.s*m.s+e;default:return false}}
export const puzzle=m=>m.kind==='ring'||m.kind==='intersection';
export function candidates(m){let p=[];for(let x=-4;x<=4;x++)for(let y=-4;y<=4;y++){if(accepts(m,x,y))p.push({x,y,correct:true})}let decoys=m.kind==='ring'?[[2,2],[-2,-2],[1,3],[-3,1],[0,2],[3,1]]:[[0,2],[0,-2],[1,3],[-1,-3],[2,0],[-2,0]];for(let [x,y] of decoys)if(!p.some(k=>k.x===x&&k.y===y))p.push({x,y,correct:accepts(m,x,y)});return p}
export const world=(x,y)=>[x*STEP,-y*STEP];
export const coords=(x,z)=>[x/STEP,-z/STEP];
