import * as T from 'https://cdn.jsdelivr.net/npm/three@0.160.1/build/three.module.js';
export {T};
export const $=id=>document.getElementById(id);
export const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
export function rng(seed){return()=>{seed=(1664525*seed+1013904223)>>>0;return seed/4294967296}}
export class World{
 constructor(){
  this.scene=new T.Scene();this.camera=new T.PerspectiveCamera(52,innerWidth/innerHeight,.1,400);
  this.renderer=new T.WebGLRenderer({antialias:true,powerPreference:'high-performance'});this.renderer.setSize(innerWidth,innerHeight);this.renderer.setPixelRatio(Math.min(devicePixelRatio,1.6));this.renderer.shadowMap.enabled=true;this.renderer.shadowMap.type=T.PCFSoftShadowMap;this.renderer.toneMapping=T.ACESFilmicToneMapping;this.renderer.toneMappingExposure=1.2;document.querySelector('#view').append(this.renderer.domElement);
  this.root=new T.Group();this.scene.add(this.root);this.keys=new Set();this.pad=new Set();this.yaw=0;this.t=0;this.audio=null;this.drag=null;
  addEventListener('keydown',e=>{if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Space'].includes(e.code))e.preventDefault();this.keys.add(e.code);if(!e.repeat&&(e.code==='KeyE'||e.code==='Space'))this.action?.()});addEventListener('keyup',e=>this.keys.delete(e.code));addEventListener('blur',()=>{this.keys.clear();this.pad.clear()});
  for(const b of document.querySelectorAll('[data-key]')){const end=()=>this.pad.delete(b.dataset.key);b.addEventListener('pointerdown',e=>{e.preventDefault();b.setPointerCapture(e.pointerId);this.pad.add(b.dataset.key)});for(const ev of ['pointerup','pointercancel','lostpointercapture'])b.addEventListener(ev,end)}
  $('act').onclick=()=>this.action?.();
  const canvas=this.renderer.domElement;canvas.addEventListener('pointerdown',e=>{this.drag=[e.clientX,e.clientY];canvas.setPointerCapture(e.pointerId)});canvas.addEventListener('pointermove',e=>{if(this.drag){this.yaw-=(e.clientX-this.drag[0])*.006;this.drag=[e.clientX,e.clientY]}});for(const ev of ['pointerup','pointercancel','lostpointercapture'])canvas.addEventListener(ev,()=>this.drag=null);
  addEventListener('resize',()=>{this.camera.aspect=innerWidth/innerHeight;this.camera.updateProjectionMatrix();this.renderer.setSize(innerWidth,innerHeight)});
  this.camera.position.set(10,12,18);this.camera.lookAt(0,0,0);
  let last=performance.now();const frame=now=>{requestAnimationFrame(frame);let dt=Math.min(.04,(now-last)/1000);last=now;this.t+=dt;this.update?.(dt);this.renderer.render(this.scene,this.camera)};requestAnimationFrame(frame);
 }
 reset(sky,ground,fog=.025){
  this.root.traverse(o=>{if(o.isMesh||o.isSprite){o.geometry?.dispose();const ms=Array.isArray(o.material)?o.material:[o.material];for(const m of ms){m?.map?.dispose();m?.dispose()}}});this.root.clear();this.yaw=0;
  this.scene.background=new T.Color(sky);this.scene.fog=new T.FogExp2(sky,fog);this.root.add(new T.HemisphereLight(0xffffff,ground,2));let s=new T.DirectionalLight(0xfff2d9,2.8);s.position.set(-16,28,12);s.castShadow=true;s.shadow.mapSize.set(1024,1024);Object.assign(s.shadow.camera,{left:-24,right:24,top:24,bottom:-24,near:.5,far:90});s.shadow.normalBias=.035;this.root.add(s);
 }
 group(x=0,y=0,z=0,parent=this.root){const g=new T.Group();g.position.set(x,y,z);parent.add(g);return g}
 mesh(geo,color,x,y,z,parent=this.root,glow=0){const m=new T.Mesh(geo,new T.MeshStandardMaterial({color,roughness:.7,metalness:.07,emissive:color,emissiveIntensity:glow,flatShading:true}));m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m}
 box(w,h,d,c,x=0,y=0,z=0,p=this.root,g=0){return this.mesh(new T.BoxGeometry(w,h,d),c,x,y,z,p,g)}
 ball(r,c,x=0,y=0,z=0,p=this.root,g=0){return this.mesh(new T.SphereGeometry(r,14,10),c,x,y,z,p,g)}
 cone(r,h,c,x=0,y=0,z=0,p=this.root,g=0){return this.mesh(new T.ConeGeometry(r,h,7),c,x,y,z,p,g)}
 cyl(r1,r2,h,c,x=0,y=0,z=0,p=this.root,g=0){return this.mesh(new T.CylinderGeometry(r1,r2,h,12),c,x,y,z,p,g)}
 gem(r,c,x=0,y=0,z=0,p=this.root){return this.mesh(new T.OctahedronGeometry(r,0),c,x,y,z,p,.38)}
 ring(r,c,x,y,z,p=this.root){return this.mesh(new T.TorusGeometry(r,.07,8,40),c,x,y,z,p,.6)}
 label(txt,x,y,z,p=this.root,color='#ffffff'){const c=document.createElement('canvas');c.width=512;c.height=128;const ctx=c.getContext('2d');ctx.fillStyle='#0b142be8';ctx.beginPath();ctx.roundRect(4,4,504,120,24);ctx.fill();ctx.strokeStyle=color;ctx.lineWidth=5;ctx.stroke();ctx.fillStyle=color;ctx.font='bold 48px system-ui';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(txt,256,64,476);const tex=new T.CanvasTexture(c);tex.colorSpace=T.SRGBColorSpace;const s=new T.Sprite(new T.SpriteMaterial({map:tex,depthTest:false}));s.position.set(x,y,z);s.scale.set(3.8,.95,1);p.add(s);return s}
 line(a,b,c,r=.06,p=this.root){let A=new T.Vector3(...a),B=new T.Vector3(...b),v=B.clone().sub(A),m=this.cyl(r,r,v.length(),c,0,0,0,p,.12);m.position.copy(A.add(B).multiplyScalar(.5));m.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),v.normalize());return m}
 avatar(x,y,z,color='#7668e9'){let g=this.group(x,y,z),body=this.group(0,1.25,0,g);this.box(.9,.95,.55,color,0,0,0,body);this.box(.65,.6,.24,'#ffb962',0,.03,.37,body);this.box(.25,.09,.07,'#fff1bd',0,.12,-.31,body);let head=this.group(0,.87,0,body);this.box(.87,.78,.76,'#ffc6a1',0,0,0,head);this.box(.94,.24,.82,'#3b304e',0,.36,.02,head);this.box(.26,.34,.23,'#4f3c64',-.28,.23,-.34,head);for(let s of [-1,1]){this.ball(.09,'#202945',s*.2,.01,-.39,head);this.ball(.035,'#fff',s*.2-.024,.04,-.466,head)}let arms=[],legs=[];for(let s of [-1,1]){let a=this.group(s*.64,.29,0,body);this.box(.31,.64,.38,color,0,-.26,0,a);this.box(.27,.23,.33,'#ffc6a1',0,-.66,0,a);arms.push(a);let l=this.group(s*.25,.78,0,g);this.box(.35,.6,.39,'#36405b',0,-.29,0,l);this.box(.41,.22,.64,'#f7f6ee',0,-.67,-.08,l);legs.push(l)}return {g,body,arms,legs}}
 walk(a,dt,bounds,speed=5){let has=k=>this.keys.has(k)||this.pad.has(k);let x=+!!(has('KeyD')||has('ArrowRight'))-+!!(has('KeyA')||has('ArrowLeft')),z=+!!(has('KeyS')||has('ArrowDown'))-+!!(has('KeyW')||has('ArrowUp')),n=Math.hypot(x,z);if(n){x/=n;z/=n;let dx=x*Math.cos(this.yaw)+z*Math.sin(this.yaw),dz=-x*Math.sin(this.yaw)+z*Math.cos(this.yaw);a.g.position.x=clamp(a.g.position.x+dx*speed*dt,bounds[0],bounds[1]);a.g.position.z=clamp(a.g.position.z+dz*speed*dt,bounds[2],bounds[3]);let ang=Math.atan2(-dx,-dz);a.g.rotation.y+=Math.atan2(Math.sin(ang-a.g.rotation.y),Math.cos(ang-a.g.rotation.y))*Math.min(1,dt*13)}let s=Math.sin(this.t*12)*Math.min(1,n);a.legs[0].rotation.x=s*.65;a.legs[1].rotation.x=-s*.65;a.arms[0].rotation.x=-s*.6;a.arms[1].rotation.x=s*.6;a.body.position.y=1.25+Math.abs(s)*.055;return n}
 cameraAt(x,y,z,dist=16,ht=10){let target=new T.Vector3(x+Math.sin(this.yaw)*dist,y+ht,z+Math.cos(this.yaw)*dist);this.camera.position.lerp(target,.075);this.camera.lookAt(x,y+.7,z)}
 tone(ok=true){try{this.audio??=new (window.AudioContext||window.webkitAudioContext)();let o=this.audio.createOscillator(),g=this.audio.createGain();o.frequency.value=ok?760:180;g.gain.setValueAtTime(.055,this.audio.currentTime);g.gain.exponentialRampToValueAtTime(.001,this.audio.currentTime+.22);o.connect(g);g.connect(this.audio.destination);o.start();o.stop(this.audio.currentTime+.23)}catch{}}
}
