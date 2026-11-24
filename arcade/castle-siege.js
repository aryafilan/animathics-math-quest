import {W,T,$,clamp,key,ui,fx,win,start,ground,tree,rock,camera,label} from './common.js';
import {levels,flight} from './levels.mjs';
start({levels:levels['castle-siege'],build(m){
 W.reset('#f3cba0','#958a77',.012);ground(65,24,'#a4be8b');let ox=-m.d/2,tx=m.d/2;
 for(let x=-28;x<29;x+=3){tree(x,-10,'#77a885');rock(x,10,.75,'#c2b197')}
 let cat=W.group(ox,0,0);W.box(2.6,.55,2.3,'#987357',0,.5,0,cat);for(let s of [-1,1]){let wheel=W.cyl(.57,.57,.22,'#533e3d',0,.55,s*1.22,cat);wheel.rotation.x=Math.PI/2;W.box(.22,2.1,.22,'#755c48',-.45,1.35,s*.8,cat)}let arm=W.group(-.45,1.8,0,cat);W.box(3.2,.22,.24,'#ad8255',.9,0,0,arm);W.box(.4,.45,.65,'#d6ae78',2.45,.02,0,arm);
 let castle=W.group(tx,0,0);let debris=[];for(let s of [-1,1]){W.box(1.7,4.2,1.7,'#b9a3a5',0,2.1,s*2.2,castle);for(let i=0;i<4;i++)W.box(.43,.65,.43,'#ddc8b8',i%2?.6:-.6,4.45,s*2.2+(i>1?.6:-.6),castle)}for(let y=0;y<4;y++)for(let z=-1;z<=1;z++){let b=W.box(1.1,.64,1.06,'#d1b6a1',0,.35+y*.67,z*1.08,castle);debris.push(b)}W.label('BENTENG · '+m.d+' m',tx,5.3,0);
 for(let x=0;x<=m.d;x+=2){W.box(.07,.04,1.0,'#ecedd5',ox+x,.015,3);W.label(String(x),ox+x,.55,4)}
 let v=5,shot=null,attempt=0,ball=W.ball(.27,'#ff9f66',ox,.8,0,W.root,.5),trail=[];ball.visible=false;
 ui.mission('Taklukkan benteng','y(x) = 0,8 + v·x/8 − x²/16','Kecepatan horizontal tetap 8 m/s. Atur komponen vertikal v. Bola harus kembali ke tinggi 0,8 m tepat di gerbang pada x = '+m.d+' m. A/D atau slider mengatur v; E menembak.');
 ui.movement(false,'Tembak [E]');let slider=ui.range('v (m/s)',2,15,v,n=>v=n);ui.button('Lepaskan proyektil',()=>fire());let show=false;ui.button('Bantuan: lihat 3 titik awal',()=>{show=!show;for(let s of trail)s.visible=show});
 for(let x=1;x<=3;x++){let q=W.ball(.09,'#fdf2ad',ox+x,flight(x,v),0,W.root,.7);q.visible=false;trail.push(q)}
 function fire(){if(shot)return;shot={x:0,v};attempt++;ball.visible=true;W.tone();ui.notify('Fire!');}
 let repeat=0;
 return {action:fire,frame(dt,active){if(active){repeat-=dt;if(!shot&&repeat<=0&&(key('KeyA','ArrowLeft')||key('KeyD','ArrowRight'))){v=clamp(v+(key('KeyD','ArrowRight')?1:-1),2,15);slider.value=v;slider.dispatchEvent(new Event('input'));repeat=.16}for(let i=0;i<trail.length;i++)trail[i].position.y=flight(i+1,v);arm.rotation.z=.15+v*.042;if(shot){shot.x=Math.min(shot.x+dt*8,2*shot.v);let x=shot.x;ball.position.set(ox+x,flight(x,shot.v),0);if(x>=2*shot.v-1e-5){let miss=Math.abs(x-m.d);fx(ox+x,.8,0,miss<.1?'#ffd28b':'#a3bda8',24);ball.visible=false;shot=null;if(miss<.1){for(let b of debris){b.position.x+=Math.random()*2;b.position.y*=.2;b.rotation.z=Math.random()*2}win('Benteng runtuh!')}else ui.notify('Tembakan meleset '+miss.toFixed(0)+' m. Kalibrasi lagi.',false)}}ui.status('v = '+v+' m/s · Tembakan '+attempt+(shot?' · Proyektil terbang':' · Gerbang '+m.d+' m'));ui.meter(100*v/15,'Daya tembak')}
 camera(0,2,0,Math.max(21,m.d*1.08),13)
 }}
}});
