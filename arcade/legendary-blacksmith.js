import {W,T,$,clamp,rng,key,ui,fx,win,start,ground,rock,camera,pulse,label} from './common.js';
import {levels,gcd} from './levels.mjs';
start({levels:levels['legendary-blacksmith'],build(m,level){
 W.reset('#241a38','#3d2345',.024);ground(29,27,'#53475d');let rand=rng(11+level);
 for(let i=0;i<22;i++){let a=i*Math.PI/11,x=13*Math.cos(a),z=12*Math.sin(a);rock(x,z,1.4+rand(),'#6b526c',1);W.gem(.42,i%2?'#eb8d7d':'#b8a0ff',x*.9,.8,z*.9)}
 let forge=W.group(0,0,-7);W.box(5,.55,4,'#817080',0,.27,0,forge);W.box(3,1.6,2.2,'#3d354e',0,1.3,0,forge);W.box(2.1,1,.1,'#ff814d',0,1.2,1.15,forge,.9);W.cyl(.7,1.0,2.8,'#65556b',0,2.9,-.35,forge);let anvil=W.group(0,0,forge.position.z+3.6);W.box(1.6,.45,.85,'#a3afbc',0,1.25,0,anvil);W.box(.65,1,.6,'#505b6c',0,.63,0,anvil);let horn=W.cone(.36,1,'#a3afbc',1.14,1.25,0,anvil);horn.rotation.z=-Math.PI/2;label('FORGE',0,4,0,forge,'#ffd2a0');pulse(0,anvil.position.z,1.5,'#ffcd91');
 let blade=W.group(0,1.65,.2,anvil);W.box(.34,.13,1.85,'#ffb881',0,0,0,blade,.5);W.box(.83,.18,.18,'#e5b764',0,0,.9,blade);blade.visible=false;
 const avatar=W.avatar(0,0,7,'#a874d6');let hammer=W.group(.07,-.6,-.2,avatar.arms[1]);W.box(.16,.88,.15,'#bd8f65',0,-.13,0,hammer);W.box(.68,.3,.39,'#b9c4d4',0,-.65,0,hammer);
 let nodes=[];for(let k=0;k<12;k++){let type=k%2===0?'iron':'gold',a=k*Math.PI/6+.17,x=Math.cos(a)*9,z=Math.sin(a)*8+1,g=W.group(x,0,z);W.cyl(.68,.88,.32,'#73627c',0,.15,0,g);let mesh=W.gem(.72,type==='iron'?'#b7c5dc':'#ffd06d',0,.9,0,g);label(type==='iron'?'BESI':'EMAS',0,2.15,0,g);nodes.push({g,mesh,type,cool:0})}
 let drones=[];for(let i=0;i<2+level;i++){let g=W.group(0,0,0);W.ball(.63,'#5e4c78',0,.7,0,g);W.box(.65,.15,.12,'#ff7687',0,.85,-.59,g,.7);for(let s of [-1,1])W.box(.5,.08,.32,'#a57fbd',s*.63,.8,0,g);drones.push(g)}
 let bag={iron:0,gold:0},phase='gather',strikes=0,heat=0,inv=0,near=null,t=0,swing=0,hitCooldown=0,cycleHit=-1;
 const ratio=gcd(m.iron,m.gold);ui.mission('Forge the legendary blade','Besi : emas = '+m.iron/ratio+' : '+m.gold/ratio+'  |  total '+(m.iron+m.gold),'WASD bergerak. E untuk menambang bijih di dekatmu. Hindari drone. Bawa komposisi tepat ke landasan, lalu pukul saat indikator panas 45–70%.');
 ui.movement(true,'Tambang / pukul [E]');ui.button('Kosongkan tas',()=>{if(phase==='gather'){bag.iron=bag.gold=0;ui.notify('Tas dikosongkan.')}});ui.button('Aksi tempa',()=>action());
 function report(){ui.status('Besi '+bag.iron+' · Emas '+bag.gold+' | '+(phase==='forge'?'Pukulan tepat '+strikes+'/3':'Dekati bijih atau landasan'));ui.meter(phase==='forge'?heat:100*(bag.iron+bag.gold)/(m.iron+m.gold),phase==='forge'?'PANAS '+Math.round(heat)+'% · target 45–70%':'Muatan tas')}
 function action(){if(hitCooldown>0)return;swing=.3;hitCooldown=.25;if(phase==='forge'){let cycle=Math.floor((t*3.2-1.57)/(2*Math.PI));if(heat>=45&&heat<=70&&cycle!==cycleHit){cycleHit=cycle;strikes++;fx(0,1.8,anvil.position.z,'#ffcd70',18);ui.notify('Perfect strike! '+strikes+'/3');if(strikes===3){blade.children[0].material.color.set('#c9ecff');blade.children[0].material.emissive.set('#83c6ff');win('Senjata legendaris selesai!')}}else{strikes=Math.max(0,strikes-1);ui.notify('Satu pukulan tiap siklus saat suhu 45–70%.',false)}return}
  if(avatar.g.position.distanceTo(anvil.position)<2.1){if(bag.iron===m.iron&&bag.gold===m.gold){phase='forge';blade.visible=true;heat=0;t=0;ui.notify('Paduan sempurna! Siap tempa.');}else ui.notify('Komposisi belum sesuai rasio dan total.',false);return}
  if(!near||near.cool>0){ui.notify('Dekati bijih yang bercahaya.',false);return}if(bag.iron+bag.gold>=m.iron+m.gold){ui.notify('Tas penuh. Kosongkan jika komposisi salah.',false);return}
  bag[near.type]++;near.cool=2;fx(near.g.position.x,1,near.g.position.z,near.type==='gold'?'#ffd06d':'#c9e3ff',9);ui.notify('+1 '+(near.type==='iron'?'besi':'emas'));report()
 }
 return {action,frame(dt,active){t+=dt;for(let n of nodes){n.cool=Math.max(0,n.cool-dt);n.mesh.visible=n.cool===0;n.mesh.rotation.y+=dt; n.mesh.position.y=.92+.12*Math.sin(t*3+n.g.position.x)}
 if(active){hitCooldown=Math.max(0,hitCooldown-dt);if(phase==='gather'){W.walk(avatar,dt,[-11,11,-10,10],7);near=nodes.find(n=>n.g.position.distanceTo(avatar.g.position)<1.8&&n.cool===0)||null;inv=Math.max(0,inv-dt);for(let i=0;i<drones.length;i++){let a=t*.55+i*2.2,d=drones[i];d.position.set(Math.cos(a)*6.5,.15,Math.sin(a*1.3)*5);d.rotation.y=-a;if(inv===0&&d.position.distanceTo(avatar.g.position)<1.3){if(bag.gold>0)bag.gold--;else if(bag.iron>0)bag.iron--;inv=2;ui.notify('Drone! Satu bijih terjatuh.',false);fx(d.position.x,1,d.position.z,'#ff789a',8)}}}else heat=50+50*Math.sin(t*3.2-1.57);swing=Math.max(0,swing-dt);if(swing>0)avatar.arms[1].rotation.x=-1.45*Math.sin(swing/.3*Math.PI);report()}
 camera(avatar.g.position.x,0,avatar.g.position.z,11,7.4)
 }}
}});
