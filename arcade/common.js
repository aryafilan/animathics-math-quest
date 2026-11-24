import {World,T,$,clamp,rng} from '../worlds/engine.js';
export {T,$,clamp,rng};
export const W=new World();
let level=0,epoch=0,active=false,done=false,onFrame=()=>{},onAction=()=>{},onTap=()=>{},toastTimer=0;
const particles=[],P=new T.Vector3();
export const key=(...codes)=>codes.some(c=>W.keys.has(c)||W.pad.has(c));
export const live=()=>active&&!done;
export const ui={
 mission:(name,formula,desc)=>{$('mission').textContent=name;$('formula').textContent=formula;$('brief').textContent=desc},
 status:(s)=>{$('status').textContent=s},
 meter:(n,label='')=>{$('fill').style.width=clamp(n,0,100)+'%';$('meterText').textContent=label},
 buttons:()=>{$('controls').replaceChildren()},
 button:(label,fn)=>{let b=document.createElement('button');b.className='primary';b.textContent=label;b.onclick=()=>{if(live())fn()};$('controls').append(b);return b},
 range:(label,min,max,val,fn)=>{let row=document.createElement('label'),s=document.createElement('span'),i=document.createElement('input');i.type='range';i.min=min;i.max=max;i.value=val;i.step=1;s.textContent=label+': '+val;row.append(s,i);$('controls').append(row);i.oninput=()=>{if(!live())return;s.textContent=label+': '+i.value;fn(+i.value)};return i},
 hold:(label,fn)=>{let b=document.createElement('button');b.className='primary';b.textContent=label;let timer=null;const stop=()=>{clearInterval(timer);timer=null};b.onpointerdown=e=>{e.preventDefault();if(!live())return;b.setPointerCapture(e.pointerId);stop();fn();timer=setInterval(()=>{if(live())fn();else stop()},180)};for(let ev of ['pointerup','pointercancel','lostpointercapture'])b.addEventListener(ev,stop);b.onkeydown=e=>{if((e.code==='Space'||e.code==='Enter')&&live()){e.preventDefault();fn()}};$('controls').append(b);return b},
 movement:(yes=true,act='Aksi [E]')=>{$('movement').hidden=!yes;$('act').hidden=!act;if(act)$('act').textContent=act},
 notify:(s,good=true)=>{clearTimeout(toastTimer);$('message').textContent=s;$('message').dataset.ok=good;$('message').classList.add('show');toastTimer=setTimeout(()=>$('message').classList.remove('show'),2300);W.tone(good)}
};
export function fx(x,y,z,color='#ffe59a',count=16){for(let i=0;i<count;i++){let m=W.gem(.09+Math.random()*.09,color,x,y,z);let a=Math.random()*Math.PI*2,s=1+Math.random()*4;particles.push({m,v:new T.Vector3(Math.cos(a)*s,2+Math.random()*4,Math.sin(a)*s),life:.6+Math.random()*.6})}}
export function pulse(x,z,r,color){const m=W.ring(r,color,x,.12,z);m.rotation.x=Math.PI/2;return m}
export function defer(fn,ms){let e=epoch;setTimeout(()=>{if(e===epoch)fn()},ms)}
export function win(note='Misi berhasil!'){if(done)return;done=true;active=false;W.keys.clear();W.pad.clear();$('resultTitle').textContent=note;$('resultText').textContent=level+1===config.levels.length?'Semua misi ditaklukkan!':'Siap untuk misi berikutnya?';$('continue').textContent=level+1===config.levels.length?'Main lagi':'Misi berikutnya';W.tone();defer(()=>{$('result').showModal()},450)}
let config;
export function start(c){config=c;
 function load(){epoch++;active=false;done=false;onFrame=()=>{};onAction=()=>{};onTap=()=>{};W.keys.clear();W.pad.clear();particles.length=0;ui.buttons();ui.status('');ui.meter(0);ui.movement(false,'');$('round').textContent='MISI '+(level+1)+' / '+c.levels.length;$('message').classList.remove('show');let x=c.build(c.levels[level],level);onFrame=x.frame||(()=>{});onAction=x.action||(()=>{});onTap=x.tap||(()=>{});active=true}
 W.update=dt=>{onFrame(dt,live());for(let i=particles.length-1;i>=0;i--){let p=particles[i];p.life-=dt;p.v.y-=8*dt;p.m.position.addScaledVector(p.v,dt);p.m.rotation.y+=dt*7;if(p.life<=0){W.root.remove(p.m);p.m.geometry.dispose();p.m.material.dispose();particles.splice(i,1)}}};
 W.action=()=>{if(live()&&!$('intro').open&&!['BUTTON','INPUT'].includes(document.activeElement?.tagName))onAction()};
 let down=null,canvas=W.renderer.domElement,ray=new T.Raycaster();
 canvas.addEventListener('pointerdown',e=>{down=[e.clientX,e.clientY]});
 canvas.addEventListener('pointerup',e=>{if(!down||!live())return;let d=Math.hypot(e.clientX-down[0],e.clientY-down[1]);down=null;if(d>9)return;ray.setFromCamera(new T.Vector2(e.clientX/innerWidth*2-1,1-e.clientY/innerHeight*2),W.camera);onTap(ray)});
 $('act').onclick=()=>{if(live())onAction()};
 $('begin').onclick=()=>{$('intro').close();active=true;W.tone()};$('continue').onclick=()=>{$('result').close();level=(level+1)%c.levels.length;load()};$('restart').onclick=()=>{if($('result').open)$('result').close();load()};for(let id of ['intro','result'])$(id).addEventListener('cancel',e=>e.preventDefault());
 load();active=false;$('intro').showModal();document.body.classList.add('ready')
}
export function ground(w,d,color){return W.box(w,.65,d,color,0,-.35,0)}
export function rock(x,z,r,color,y=.7){let o=W.mesh(new T.DodecahedronGeometry(r,0),color,x,y,z);o.rotation.set(x*.3,z*.2,r);return o}
export function tree(x,z,color='#79be87'){let g=W.group(x,0,z);W.cyl(.15,.3,2,'#907353',0,1,0,g);for(let i=0;i<3;i++)W.ball(1.05-i*.13,color,Math.sin(i*3)*.36,2.2+i*.3,Math.cos(i*3)*.3,g);return g}
export function camera(x,y,z,d,h){W.cameraAt(x,y,z,d,h)}
export function hitObject(ray,objects){return ray.intersectObjects(objects,true)[0]?.object||null}
export function pathLine(a,b,c,r=.06){return W.line(a,b,c,r)}
export function label(txt,x,y,z,p,color){return W.label(txt,x,y,z,p,color)}
