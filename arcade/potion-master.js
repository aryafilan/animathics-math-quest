import {W,T,$,clamp,ui,fx,win,start,ground,camera,label} from './common.js';
import {levels,concentration} from './levels.mjs';
start({levels:levels['potion-master'],build(m){
 W.reset('#37264f','#443451',.024);ground(26,20,'#6b6281');W.box(21,.8,6,'#b3a1b8',0,1,0);for(let i=0;i<6;i++){let x=-10+i*4;W.box(2.8,5.3,.4,'#6e587d',x,2.6,-6);for(let z of [1.5,3,4.5]){W.box(2.5,.15,.9,'#ad90a9',x,z,-5.5);for(let k=0;k<3;k++)W.gem(.25,['#ffb7e0','#90dfff','#bde39e'][k],x-.7+k*.7,z+.35,-5.5)}}
 const cA='#7acffc',cB='#ff9bda';
 function tank(x,c,txt){let g=W.group(x,1.4,0);let glass=W.cyl(1.28,1.28,4.6,'#c6ddeb',0,2.3,0,g);glass.material.transparent=true;glass.material.opacity=.25;glass.material.depthWrite=false;W.cyl(1.12,1.12,3.9,c,0,2.03,0,g,.18);W.cyl(1.37,1.37,.27,'#aaa4c9',0,.14,0,g);W.cyl(1.37,1.37,.27,'#aaa4c9',0,4.55,0,g);W.box(.28,.28,2,c,x>0?-1:1,.53,0,g);label(txt,0,5.3,0,g);return g}
 tank(-5,cA,'A · '+m.c1+'%');tank(5,cB,'B · '+m.c2+'%');
 let vessel=W.group(0,1.4,0);let glass=W.cyl(1.8,1.65,3.4,'#bfeaff',0,1.7,0,vessel);glass.material.transparent=true;glass.material.opacity=.22;glass.material.depthWrite=false;let liquid=W.cyl(1.65,1.58,1,cA,0,.1,0,vessel,.17);liquid.visible=false;W.cyl(1.85,1.85,.14,'#c5b3d3',0,.07,0,vessel);W.ring(1.8,'#b0d9f0',0,3.38,0,vessel).rotation.x=Math.PI/2;
 for(let i=1;i<=4;i++)W.box(.34,.045,.04,'#ffffff',1.42,i*.73,1.07,vessel);
 let drops=[],a=0,b=0,spin=0,check=false;let mixColor=new T.Color(cA);
 ui.mission('Mix the cure','V = '+m.total+' mL · konsentrasi '+m.target+'%','Tahan katup A/B untuk mengalirkan cairan 5 mL per ketukan. Cairan memiliki konsentrasi berbeda. Penuhi volume dan kadar bahan aktif secara tepat.');
 ui.movement(false,'');ui.hold('💧 Tahan katup A · '+m.c1+'%',()=>pour(0));ui.hold('💗 Tahan katup B · '+m.c2+'%',()=>pour(1));ui.button('Kosongkan gelas',()=>{if(!check){a=b=0;for(let d of drops)W.root.remove(d.o);drops=[];report()}});ui.button('Uji ramuan',()=>{if(a+b!==m.total){ui.notify('Volume belum tepat.',false);return}if(Math.abs(concentration(m,a,b)-m.target)>1e-6){ui.notify('Kadar belum tepat. Kosongkan dan racik lagi.',false);return}check=true;fx(0,4,0,'#aaffd7',32);win('Ramuan berhasil dibuat!')});
 function report(){let v=a+b,k=v/m.total;liquid.visible=v>0;liquid.scale.y=Math.max(.01,3.12*k);liquid.position.y=.13+1.56*k;mixColor.set(cA).lerp(new T.Color(cB),b/(v||1));liquid.material.color.copy(mixColor);liquid.material.emissive.copy(mixColor);ui.status('A '+a+' mL · B '+b+' mL | Total '+v+'/'+m.total+' mL | Kadar '+concentration(m,a,b).toFixed(1)+'%');ui.meter(100*k,'Volume gelas')}
 function pour(type){if(check)return;if(a+b+5>m.total){ui.notify('Gelas penuh.',false);return}if(type)b+=5;else a+=5;for(let i=0;i<3;i++){let o=W.ball(.09,type?cB:cA,type?3.8:-3.8,3.3+i*.12,0,W.root,.5);drops.push({o,t:0,side:type?1:-1})}report();W.tone()}
 report();return {frame(dt){spin+=dt;for(let i=drops.length-1;i>=0;i--){let d=drops[i];d.t+=dt*2.8;let t=Math.min(1,d.t);d.o.position.set(d.side*3.8*(1-t),3.3+Math.sin(t*Math.PI)*1.7-1.1*t,0);if(t>=1){W.root.remove(d.o);d.o.geometry.dispose();d.o.material.dispose();drops.splice(i,1)}}camera(0,2.5,0,18,8)}}
}});
