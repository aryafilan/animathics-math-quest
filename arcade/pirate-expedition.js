import {W,T,$,clamp,rng,key,ui,fx,win,start,rock,camera,label,pulse} from './common.js';
import {levels,treasure} from './levels.mjs';
start({levels:levels['pirate-expedition'],build(m,lv){
 W.reset('#a5d9f4','#77acc3',.011);W.box(160,.4,160,'#4aaac5',0,-.28,0);let random=rng(22+lv),waves=[];for(let i=0;i<65;i++){let x=(random()-.5)*65,z=(random()-.5)*65,o=W.box(1.2+random()*2,.025,.06,'#92d9de',x,.02,z);waves.push({o,x,z})}
 for(let [x,z] of m.rocks){rock(x,z,1.65,'#9a9490',.45);pulse(2.4,x,z,'#b6ecdc');label('KARANG',x,2.2,z)}
 for(let i=0;i<6;i++){let a=i*Math.PI/3,x=Math.sin(a)*34,z=Math.cos(a)*34;W.cyl(4,5,1.3,'#d4c6a6',x,-.43,z);W.cyl(3.9,3.9,.24,'#93c790',x,.35,z);let g=W.group(x,.45,z);W.cyl(.18,.35,2.4,'#9c7b59',0,1.2,0,g);for(let j=0;j<4;j++){let leaf=W.box(.4,.13,2.3,'#62b787',0,2.4,0,g);leaf.rotation.y=j*Math.PI/2;leaf.position.x=Math.sin(j*Math.PI/2)*.8;leaf.position.z=Math.cos(j*Math.PI/2)*.8}}
 let boat=W.group();let hull=W.box(1.8,.65,3.1,'#9c6d4c',0,.43,0,boat);let prow=W.cone(.94,1.3,'#ae7f54',0,.45,-2,boat);prow.rotation.x=-Math.PI/2;W.box(1.57,.13,2.7,'#d7b88e',0,.84,0,boat);W.cyl(.085,.13,3.9,'#976e57',0,2.5,0,boat);let sail=W.box(2.35,2.3,.11,'#fff0cf',0,2.95,.1,boat);W.box(2.6,.09,.1,'#a17a51',0,4.1,0,boat);W.box(.25,.55,.65,'#ef8a79',0,4.65,.1,boat);
 let [gx,gz]=treasure(m),chest=W.group(gx,0,gz);W.box(1.2,.75,.8,'#a8794c',0,.4,0,chest);W.box(1.23,.24,.83,'#f4cd7a',0,.85,0,chest);W.gem(.28,'#ffeaa6',0,1.2,0,chest);chest.visible=false;
 let heading=0,speed=0,x=0,z=0,damage=0,cool=0,t=0;
 ui.mission('Find the hidden treasure','Arah '+m.bearing+'° · jarak '+m.distance+' m','Kompas: 0° utara, 90° timur. A/D putar kemudi; W tambah layar, S kurangi. E jangkar saat dekat lokasi harta. Hindari karang dan gunakan koordinat timur/utara.');
 ui.movement(true,'Jangkar / gali [E]');ui.button('Jangkar / gali',()=>action());
 function action(){speed=0;if(Math.hypot(x-gx,z-gz)<=1.8){chest.visible=true;fx(gx,1,gz,'#ffe298',32);win('Harta ditemukan!')}else ui.notify('Belum di lokasi yang tepat. Periksa arah dan jarak.',false)}
 return {action,frame(dt,active){t+=dt;for(let w of waves){w.o.position.y=.04+Math.sin(t*2+w.x*.3)*.03}
 if(active){cool=Math.max(0,cool-dt);heading=(heading+(+key('KeyD','ArrowRight')-+key('KeyA','ArrowLeft'))*dt*95+360)%360;if(key('KeyW','ArrowUp'))speed=clamp(speed+dt*4,0,5.5);else if(key('KeyS','ArrowDown'))speed=clamp(speed-dt*6,0,5.5);let r=heading*Math.PI/180,px=x+Math.sin(r)*speed*dt,pz=z-Math.cos(r)*speed*dt;
 if(m.rocks.some(([rx,rz])=>Math.hypot(px-rx,pz-rz)<2.15)){speed=0;if(cool===0){damage++;cool=1.5;ui.notify('Karang! Belok dan lanjutkan.',false);fx(x,.6,z,'#eaf7f6',12)}}else{x=clamp(px,-29,29);z=clamp(pz,-29,29)}
 boat.position.set(x,.1+Math.sin(t*3)*.07,z);boat.rotation.y=-r;boat.rotation.z=Math.sin(t*2)*.035;chest.visible=Math.hypot(x-gx,z-gz)<2.6;ui.status('Kompas '+Math.round(heading)%360+'° · Timur '+x.toFixed(1)+' · Utara '+(-z).toFixed(1)+' | Tabrakan '+damage);ui.meter(speed/5.5*100,'Laju '+speed.toFixed(1)+' m/s')}
 camera(x,0,z,14,13)
 }}
}});
