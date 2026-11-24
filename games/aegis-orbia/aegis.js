import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.1/build/three.module.js';
import {STEP,stages,accepts,puzzle,candidates,world,coords} from './math.mjs';
const $=id=>document.getElementById(id),T=THREE;
const scene=new T.Scene(),camera=new T.PerspectiveCamera(57,innerWidth/innerHeight,.1,220),renderer=new T.WebGLRenderer({antialias:true,powerPreference:'high-performance'});
renderer.setSize(innerWidth,innerHeight);renderer.setPixelRatio(Math.min(devicePixelRatio,1.65));renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.15;renderer.outputColorSpace=T.SRGBColorSpace;$('view').append(renderer.domElement);
const hemi=new T.HemisphereLight(0xffd6cb,0x2a1d3c,2.0);scene.add(hemi);const sun=new T.DirectionalLight(0xffba78,3.05);sun.position.set(-13,28,15);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);Object.assign(sun.shadow.camera,{left:-23,right:23,top:23,bottom:-23,near:.5,far:80});sun.shadow.normalBias=.035;scene.add(sun);
const fill=new T.DirectionalLight(0x73c7f8,1.1);fill.position.set(8,9,-15);scene.add(fill);
const root=new T.Group(),effects=new T.Group();scene.add(root,effects);
const clamp=T.MathUtils.clamp;
function rng(seed){return()=>{seed=(1664525*seed+1013904223)>>>0;return seed/4294967296}}
const material=(c,metal=.08,rough=.75,glow=0)=>new T.MeshStandardMaterial({color:c,metalness:metal,roughness:rough,emissive:c,emissiveIntensity:glow});
function mesh(geo,mat,x=0,y=0,z=0,p=root){const m=new T.Mesh(geo,mat);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;p.add(m);return m}
function box(w,h,d,mat,x=0,y=0,z=0,p=root){return mesh(new T.BoxGeometry(w,h,d),mat,x,y,z,p)}
function cyl(a,b,h,mat,x=0,y=0,z=0,p=root,n=12){return mesh(new T.CylinderGeometry(a,b,h,n),mat,x,y,z,p)}
function gem(r,mat,x=0,y=0,z=0,p=root){return mesh(new T.OctahedronGeometry(r,0),mat,x,y,z,p)}
function ball(r,mat,x=0,y=0,z=0,p=root){return mesh(new T.SphereGeometry(r,16,12),mat,x,y,z,p)}
function group(x=0,y=0,z=0,p=root){let g=new T.Group();g.position.set(x,y,z);p.add(g);return g}
function ring(r,mat,x=0,y=0,z=0,p=root){let m=mesh(new T.TorusGeometry(r,.055,8,64),mat,x,y,z,p);m.rotation.x=Math.PI/2;return m}
function rounded(w,h,d,r,mat,x=0,y=0,z=0,p=root){let geo=new T.BoxGeometry(w,h,d,4,4,4),a=geo.attributes.position,xx=w/2-r,yy=h/2-r,zz=d/2-r;for(let i=0;i<a.count;i++){let px=a.getX(i),py=a.getY(i),pz=a.getZ(i),bx=clamp(px,-xx,xx),by=clamp(py,-yy,yy),bz=clamp(pz,-zz,zz),v=new T.Vector3(px-bx,py-by,pz-bz).normalize().multiplyScalar(r);a.setXYZ(i,bx+v.x,by+v.y,bz+v.z)}geo.computeVertexNormals();return mesh(geo,mat,x,y,z,p)}
function label(txt,x,y,z,fg='#ffe0a7',w=2.4,p=root){let c=document.createElement('canvas');c.width=512;c.height=128;let ctx=c.getContext('2d');ctx.fillStyle='#1f1529e8';ctx.beginPath();ctx.roundRect(6,6,500,116,25);ctx.fill();ctx.strokeStyle=fg;ctx.lineWidth=5;ctx.stroke();ctx.font='900 48px Nunito, system-ui';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle=fg;ctx.fillText(txt,256,65,475);let tex=new T.CanvasTexture(c);tex.colorSpace=T.SRGBColorSpace;let s=new T.Sprite(new T.SpriteMaterial({map:tex,transparent:true,depthTest:false}));s.scale.set(w,w/4,1);s.position.set(x,y,z);p.add(s);return s}
function tileTexture(color,edge){let c=document.createElement('canvas');c.width=c.height=128;let ctx=c.getContext('2d');ctx.fillStyle=color;ctx.fillRect(0,0,128,128);ctx.strokeStyle=edge;ctx.lineWidth=3;ctx.strokeRect(4,4,120,120);for(let [x,y] of [[14,14],[114,14],[14,114],[114,114]]){ctx.beginPath();ctx.arc(x,y,4,0,Math.PI*2);ctx.fillStyle=edge;ctx.fill()}let t=new T.CanvasTexture(c);t.colorSpace=T.SRGBColorSpace;return t}
function disposeGroup(g){let ge=new Set(),ma=new Set(),te=new Set();g.traverse(o=>{if(o.geometry)ge.add(o.geometry);for(let m of (Array.isArray(o.material)?o.material:[o.material]))if(m){ma.add(m);if(m.map)te.add(m.map)}});g.clear();for(let o of ge)o.dispose();for(let o of ma)o.dispose();for(let o of te)o.dispose()}
function createSlayer(){
  const root = new THREE.Group();
  const armor = new THREE.MeshStandardMaterial({color:0x1a2c3b, metalness:0.78, roughness:0.28});
  const plate = new THREE.MeshStandardMaterial({color:0x314d62, metalness:0.7, roughness:0.32});
  const dark  = new THREE.MeshStandardMaterial({color:0x0a1119, metalness:0.55, roughness:0.38});
  const cyan  = new THREE.MeshStandardMaterial({color:0x00dfff, emissive:0x00b8ff, emissiveIntensity:1.5});
  const gold  = new THREE.MeshStandardMaterial({color:0xffbc42, metalness:0.7, roughness:0.24});
  const skin  = new THREE.MeshStandardMaterial({color:0xd89768, roughness:0.72});
  const mesh = (geo, mat, x=0,y=0,z=0) => { const m = new THREE.Mesh(geo,mat); m.position.set(x,y,z); m.castShadow=true; m.receiveShadow=true; root.add(m); return m; };

  // Torso berlapis dan inti energi dada.
  mesh(new THREE.BoxGeometry(1.22,1.32,.66), armor, 0,1.62,0);
  mesh(new THREE.BoxGeometry(1.04,.98,.16), plate, 0,1.72,-.39);
  mesh(new THREE.BoxGeometry(1.31,.16,.76), gold, 0,1.22,0);
  const core = mesh(new THREE.OctahedronGeometry(.25,0), cyan, 0,1.78,-.52);
  mesh(new THREE.BoxGeometry(.68,.08,.06), cyan, 0,2.13,-.48);

  // Kepala kotak khas Roblox dengan helm tempur dan visor menyala.
  mesh(new THREE.BoxGeometry(.82,.78,.72), skin, 0,2.72,0);
  mesh(new THREE.BoxGeometry(.94,.30,.82), armor, 0,3.08,0);
  mesh(new THREE.BoxGeometry(.95,.25,.18), dark, 0,2.77,-.42);
  mesh(new THREE.BoxGeometry(.76,.12,.07), cyan, 0,2.77,-.53);
  mesh(new THREE.BoxGeometry(.13,.38,.64), gold, 0,3.02,-.46);
  for(const s of [-1,1]){
    const fin = mesh(new THREE.ConeGeometry(.16,.55,4), cyan, s*.48,3.25,.03);
    fin.rotation.z = s*.55;
  }

  function arm(x, flip){
    const g = new THREE.Group(); g.position.set(x,2.2,0); root.add(g);
    const add = (geo,mat,px,py,pz) => { const m=new THREE.Mesh(geo,mat); m.position.set(px,py,pz); m.castShadow=true; g.add(m); return m; };
    add(new THREE.SphereGeometry(.39,12,8), plate,0,-.05,0);
    add(new THREE.BoxGeometry(.48,.58,.5), armor,0,-.43,0);
    add(new THREE.BoxGeometry(.54,.12,.56), gold,0,-.68,0);
    add(new THREE.BoxGeometry(.44,.48,.46), plate,0,-.95,0);
    add(new THREE.BoxGeometry(.48,.28,.48), dark,0,-1.30,-.02);
    const stripe = add(new THREE.BoxGeometry(.12,.40,.05), cyan,flip*.17,-.98,-.25);
    return g;
  }
  const lArm = arm(-.88,-1), rArm = arm(.88,1);

  function leg(x){
    const g = new THREE.Group(); g.position.set(x,1.02,0); root.add(g);
    const add = (geo,mat,px,py,pz) => { const m=new THREE.Mesh(geo,mat); m.position.set(px,py,pz); m.castShadow=true; g.add(m); return m; };
    add(new THREE.BoxGeometry(.52,.58,.54), armor,0,-.30,0);
    add(new THREE.BoxGeometry(.60,.12,.58), gold,0,-.58,0);
    add(new THREE.BoxGeometry(.48,.58,.50), plate,0,-.93,.03);
    add(new THREE.BoxGeometry(.58,.28,.78), dark,0,-1.34,-.12);
    add(new THREE.BoxGeometry(.12,.36,.06), cyan,0,-.93,-.27);
    return g;
  }
  const lLeg = leg(-.31), rLeg = leg(.31);

  // Jetpack, pendorong, dan pedang energi di punggung.
  const pack = new THREE.Group(); pack.position.set(0,1.78,.46); root.add(pack);
  for(const s of [-1,1]){
    const jet = new THREE.Mesh(new THREE.CylinderGeometry(.18,.24,.70,10), plate); jet.position.set(s*.34,0,0); jet.rotation.x=Math.PI/2; jet.castShadow=true; pack.add(jet);
    const flame = new THREE.Mesh(new THREE.ConeGeometry(.17,.52,8), cyan); flame.position.set(s*.34,0,.48); flame.rotation.x=Math.PI/2; pack.add(flame);
  }
  const blade = new THREE.Mesh(new THREE.BoxGeometry(.13,1.42,.18), cyan); blade.position.set(.52,.38,.22); blade.rotation.z=-.48; pack.add(blade);
  const hilt = new THREE.Mesh(new THREE.BoxGeometry(.48,.13,.18), gold); hilt.position.set(.18,-.18,.22); hilt.rotation.z=-.48; pack.add(hilt);
  return {root, lArm, rArm, lLeg, rLeg, core, pack};
}

const slayer=createSlayer(),player=slayer.root;scene.add(player);player.position.set(0,.32,5);slayer.root.scale.setScalar(.94);
let stage=0,checkpoint=0,complete=false,demo=false,mode='intro',lives=3,timer=0,age=0,impactAge=0,impactOK=false,activated=new Set(),nodes=[],towers=[],meteors=[],particles=[],domes=[],outlines=[],ambience=[],seals=[],epoch=0,velY=0,dashTime=0,dashCooldown=0,yaw=0,pitch=.58,dist=17,walkT=0,mute=false,audio=null,toastTimer=0,nearNode=null,showEnding=false;
const KEY='aegis-orbia-save-v1';
try{let s=JSON.parse(localStorage.getItem(KEY)||'{}');checkpoint=Number.isInteger(s.next)&&s.next>=0&&s.next<stages.length?s.next:0;complete=!!s.complete}catch{}
function save(){if(demo)return;try{localStorage.setItem(KEY,JSON.stringify({next:checkpoint,complete}))}catch{}}
function tone(freq=550,duration=.15,type='sine',vol=.045){if(mute)return;try{audio??=new (window.AudioContext||window.webkitAudioContext)();if(audio.state==='suspended')audio.resume();let o=audio.createOscillator(),g=audio.createGain();o.type=type;o.frequency.setValueAtTime(freq,audio.currentTime);g.gain.setValueAtTime(vol,audio.currentTime);g.gain.exponentialRampToValueAtTime(.001,audio.currentTime+duration);o.connect(g);g.connect(audio.destination);o.start();o.stop(audio.currentTime+duration+.01)}catch{}}
function chime(){tone(660,.24);let e=epoch;setTimeout(()=>{if(epoch===e)tone(990,.25)},100)}
function toast(s,good=true){clearTimeout(toastTimer);$('toast').textContent=s;$('toast').classList.toggle('bad',!good);$('toast').classList.add('show');toastTimer=setTimeout(()=>$('toast').classList.remove('show'),2300);tone(good?760:180,.16,good?'sine':'triangle')}
function prompt(s){$('prompt').textContent=s;$('prompt').classList.toggle('show',!!s)}
function setFlash(){let e=epoch;$('flash').style.opacity='.38';setTimeout(()=>{if(e===epoch)$('flash').style.opacity='0'},100)}
function particlesAt(x,y,z,color,n=24){for(let i=0;i<n;i++){let mat=new T.MeshBasicMaterial({color,transparent:true,opacity:1}),o=gem(.08+Math.random()*.14,mat,x,y,z,effects);let a=Math.random()*Math.PI*2,s=2+Math.random()*5;particles.push({o,v:new T.Vector3(Math.cos(a)*s,2+Math.random()*5,Math.sin(a)*s),life:.65+Math.random()*.7})}}
const palettes=[
 {sky:0x463044,fog:.017,stone:'#554257',edge:'#b88979',tile:'#604552',axis:'#86574f',trim:'#e2b17a',leaf:'#85b79d',glow:'#7cf2e6',name:'I · FALLEN GARDEN'},
 {sky:0x30283d,fog:.015,stone:'#484456',edge:'#83749d',tile:'#4b455b',axis:'#6c536f',trim:'#bc9bd3',leaf:'#9a8cc4',glow:'#8de9ff',name:'II · TWIN TOWERS'},
 {sky:0x281926,fog:.012,stone:'#4b303e',edge:'#a65e5d',tile:'#51323d',axis:'#864c4b',trim:'#f0b579',leaf:'#d38a7f',glow:'#99f7ef',name:'III · CORE TOWER'}
];
function tower(x,z,h,pal,main=false){let g=group(x,0,z),dark=material(pal.stone,.32,.56),gold=material(pal.trim,.64,.3),light=material(pal.glow,.15,.35,.65),base=material(pal.edge,.15,.7);
 cyl(2.25,2.6,.45,base,0,.2,0,g,8);cyl(1.8,2.25,.65,dark,0,.72,0,g,8);cyl(1.24,1.55,h-1.3,dark,0,h/2+.45,0,g,8);for(let y=1.4;y<h;y+=1.1)cyl(1.45,1.45,.12,gold,0,y,0,g,8);
 for(let j=0;j<4;j++){let a=j*Math.PI/2+.785;let pillar=rounded(.38,h-.55,.38,.09,base,Math.cos(a)*1.3,h/2,Math.sin(a)*1.3,g);pillar.rotation.y=a;let strip=box(.12,h-1.15,.13,light,Math.cos(a)*1.55,h/2,Math.sin(a)*1.55,g);strip.rotation.y=a}
 cyl(1.9,1.4,.45,gold,0,h+.07,0,g,8);let crystal=gem(main?1.05:.75,light,0,h+1.05,0,g);let orb=ring(1.7,light,0,h+.8,0,g);orb.rotation.x=.55;for(let j=0;j<4;j++){let a=j*Math.PI/2;let spike=mesh(new T.ConeGeometry(.24,1.3,5),gold,Math.cos(a)*1.8,h+.65,Math.sin(a)*1.8,g);spike.rotation.z=Math.cos(a)*.22}towers.push({g,crystal,orb,light});return g}
function tree(x,z,pal,seed){let r=rng(seed),g=group(x,0,z),wood=material('#88706d',.1,.85),leaf=material(pal.leaf,.03,.85);cyl(.17,.37,2.65,wood,0,1.35,0,g,7);for(let i=0;i<5;i++){let a=i*2.4,b=mesh(new T.DodecahedronGeometry(1.0+r()*.4,0),leaf,Math.sin(a)*.65,2.6+i*.24,Math.cos(a)*.55,g);b.scale.set(1,.72,1);b.rotation.y=a}for(let j=0;j<3;j++){let a=j*2.1;gem(.18,material(pal.glow,.1,.3,.5),Math.sin(a)*.7,2.6+j*.3,Math.cos(a)*.7,g)}}
function lamp(x,z,pal){let g=group(x,0,z),m=material(pal.stone,.45,.5),gold=material(pal.trim,.6,.4),light=material('#ffc184',.1,.3,.9);cyl(.37,.5,.3,m,0,.15,0,g,8);cyl(.14,.18,2.1,m,0,1.2,0,g);box(.7,.13,.7,gold,0,2.3,0,g);ball(.28,light,0,2.55,0,g);for(let s of [-1,1])for(let t of [-1,1])box(.055,.55,.055,gold,s*.23,2.55,t*.23,g);box(.64,.14,.64,gold,0,2.85,0,g)}
function buildWorld(chapter){disposeGroup(root);disposeGroup(effects);nodes=[];towers=[];meteors=[];particles=[];domes=[];outlines=[];ambience=[];seals=[];let pal=palettes[chapter],random=rng(71+chapter);scene.background=new T.Color(pal.sky);scene.fog=new T.FogExp2(pal.sky,pal.fog);sun.color.set(chapter===2?0xff9863:0xffc09a);fill.color.set(chapter===1?0xb9b9ff:0x78d5f5);
 let stone=material(pal.stone,.22,.8),edge=material(pal.edge,.14,.72),gold=material(pal.trim,.6,.36),light=material(pal.glow,.1,.33,.75),lava=material('#d95b40',.1,.55,.8);
 // Layered floating fortress platform and luminous supports.
 rounded(27,1.5,27,.32,stone,0,-.84,0);rounded(26.4,.23,26.4,.1,edge,0,-.16,0);rounded(25.9,.12,25.9,.05,stone,0,-.025,0);
 for(let i=0;i<4;i++){let a=i*Math.PI/2,g=group(0,-1.1,0);g.rotation.y=a;rounded(24.9,.38,.46,.12,gold,0,0,13.1,g);for(let j=-5;j<=5;j++){let x=j*2.1;rounded(1.65,.9,.45,.13,stone,x,.05,13.36,g);box(.85,.1,.08,light,x,.05,13.62,g)}}
 let tx=tileTexture(pal.tile,pal.edge),ax=tileTexture(pal.axis,pal.trim),m1=new T.MeshStandardMaterial({map:tx,roughness:.72}),m2=new T.MeshStandardMaterial({map:ax,roughness:.7});
 for(let x=-4;x<=4;x++)for(let y=-4;y<=4;y++){let [wx,wz]=world(x,y);rounded(2.19,.21,2.19,.075,x===0||y===0?m2:m1,wx,.12,wz);if(y===0&&x)label(String(x),wx,.48,.47,'#ffdfa0',1.05);if(x===0&&y)label(String(y),.47,.48,wz,'#ffdfa0',1.05)}
 box(22,.075,.12,gold,0,.22,0);box(.12,.075,22,gold,0,.22,0);label('X',10.9,.9,.22,'#86edfb',1.6);label('Y',.2,.9,-10.9,'#86edfb',1.6);label('0',.45,.48,.45,'#ffe1ac',.9);
 // Every location is a different fortress vista, not a reskinned character.
 if(chapter===0){for(let x of [-11.9,11.9])for(let z of [-10,-4,2,8]){tree(x,z,pal,Math.round((x+20)*(z+20)));for(let i=0;i<3;i++)gem(.2,material(i%2?'#f4b3bc':'#c8efd9',.1,.6),x+Math.sin(i*2)*.7,.4,z+Math.cos(i*2)*.6)}tower(0,-16,7,pal,true);for(let s of [-1,1]){let g=group(s*5.5,0,-14);rounded(2.4,.7,2.6,.15,edge,0,.35,0,g);for(let i=0;i<3;i++)rounded(1.85,.4,1.9,.08,stone,0,.9+i*.38,0,g);gem(.65,light,0,2.3,0,g)}}
 if(chapter===1){tower(-7,-15,8,pal);tower(7,-15,8,pal);let g=group(0,0,-15);for(let s of [-1,1])rounded(1.25,5.5,1.45,.16,edge,s*2.6,2.75,0,g);let arch=mesh(new T.TorusGeometry(2.65,.34,8,40,Math.PI),gold,0,5.3,0,g);box(5.3,.26,.55,light,0,5.15,0,g);for(let s of [-1,1])for(let z of [-9,-2,5,10])lamp(s*12,z,pal)}
 if(chapter===2){tower(0,-16,10,pal,true);tower(-8,-15,5.6,pal);tower(8,-15,5.6,pal);for(let s of [-1,1])for(let i=0;i<5;i++){let z=10-i*4.8,g=group(s*12,0,z);rounded(1.15,.55,1.15,.1,edge,0,.25,0,g);rounded(.65,2.8,.65,.12,stone,0,1.65,0,g);gem(.42,light,0,3.3,0,g);ring(.58,gold,0,3.3,0,g)}}
 for(let s of [-1,1])for(let z of [-11,11])lamp(s*11.7,z,pal);
 // Silhouettes, ember streams, small suspended rocks and a visible molten horizon.
 for(let i=0;i<23;i++){let a=i*2.399,r=24+random()*33,x=Math.sin(a)*r,z=Math.cos(a)*r;let rock=mesh(new T.DodecahedronGeometry(2+random()*3,0),stone,x,-4-random()*5,z);rock.scale.set(1,.8+random()*1.3,1);rock.rotation.set(random(),random()*3,random());if(i%3===0){let m=mesh(new T.ConeGeometry(2.3,5+random()*6,5),edge,x,-3,z);m.rotation.y=random()*3}}
 for(let i=0;i<35;i++){let a=random()*Math.PI*2,r=15+random()*22,x=Math.sin(a)*r,z=Math.cos(a)*r,y=-1+random()*12;let o=gem(.035+random()*.09,lava,x,y,z);ambience.push({o,x,y,z,phase:random()*6})}
}
function dome(cx,cy,r,color='#64e9ff',outlineOnly=false){let [x,z]=world(cx,cy),R=r*STEP,g=group(x,.25,z),mat=new T.MeshBasicMaterial({color,transparent:true,opacity:.19,side:T.DoubleSide,depthWrite:false,blending:T.AdditiveBlending});let shell=mesh(new T.SphereGeometry(R,40,24,0,Math.PI*2,0,Math.PI/2),mat,0,0,0,g);shell.scale.y=.77;let wire=mesh(new T.SphereGeometry(R,24,12,0,Math.PI*2,0,Math.PI/2),new T.MeshBasicMaterial({color,wireframe:true,transparent:true,opacity:.09,depthWrite:false,blending:T.AdditiveBlending}),0,0,0,g);wire.scale.y=.77;let base=ring(R,new T.MeshBasicMaterial({color,transparent:true,opacity:.9}),0,.05,0,g);for(let j=0;j<4;j++){let a=j*Math.PI/2;let band=mesh(new T.TorusGeometry(R,.035,6,64,Math.PI),new T.MeshBasicMaterial({color,transparent:true,opacity:.5,depthWrite:false}),0,0,0,g);band.rotation.y=a;band.scale.y=.77}if(outlineOnly){shell.visible=false;wire.visible=false;for(let j=3;j<g.children.length;j++)g.children[j].visible=false}g.visible=false;domes.push({g,shell,wire,base});return g}
function setupShield(m){dome(m.a,m.b,m.r);if(m.kind==='overlap'||m.kind==='intersection')dome(m.c,m.d,m.s,'#c4a5ff');if(m.kind==='annulus')dome(m.a,m.b,m.inner,'#ff6e83',true)}
function spawnMeteor(x,z,delay,i){let g=group(x,18,z,effects),rock=material('#8c4141',.23,.65),fire=material('#ffae60',.03,.44,.95);let body=mesh(new T.DodecahedronGeometry(.55+i%3*.15,0),rock,0,0,0,g);for(let j=0;j<4;j++){let a=j*1.57;gem(.18,fire,Math.sin(a)*.43,Math.cos(a)*.4,.25,g)}let tail=mesh(new T.ConeGeometry(.48,3.5,10),new T.MeshBasicMaterial({color:0xffa35c,transparent:true,opacity:.35,depthWrite:false,blending:T.AdditiveBlending}),0,1.8,0,g);let halo=ball(.85,new T.MeshBasicMaterial({color:0xff9d57,transparent:true,opacity:.13,depthWrite:false,blending:T.AdditiveBlending}),0,0,0,g);meteors.push({g,x,z,delay,body,halo});}
function burst(m,ok){for(let d of domes)d.g.visible=true;let random=rng(900+stage);for(let i=0;i<17;i++){let x=(random()-.5)*22,z=(random()-.5)*22;spawnMeteor(x,z,random()*.5,i)}let [x,z]=world(m.a,m.b);particlesAt(x,1.2,z,0x91fff0,42);if(ok){for(let t of towers)t.light.emissiveIntensity=1.7;particlesAt(player.position.x,1.8,player.position.z,0x93efff,26)}else particlesAt(player.position.x,1,player.position.z,0xff8c85,20);setFlash();tone(ok?1020:135,.4,ok?'triangle':'sawtooth',.055)}
function updateHUD(){let m=stages[stage];$('chapter').textContent=palettes[m.chapter].name+'  ·  '+(stage+1)+'/6';$('mission').textContent=m.title;$('objective').textContent=m.objective;$('formula').textContent=m.formula;$('hint').textContent=m.hint;$('health').textContent='♥ '.repeat(lives)+'♡ '.repeat(3-lives);$('count').textContent=(complete?6:stage)+' / 6';$('progress').replaceChildren();for(let i=0;i<6;i++){let p=document.createElement('span');p.className='pip'+(complete||i<stage?' on':'');$('progress').append(p)}$('timerPanel').hidden=puzzle(m);$('demoTag').hidden=!demo;$('status').textContent=puzzle(m)?'Segel aktif: '+activated.size+' / '+m.required:'Cari perlindungan sebelum meteor tiba.'}
function showStory(tag,title,text,button,cb){mode='story';clearKeys();$('storyTag').textContent=tag;$('storyTitle').textContent=title;$('storyText').textContent=text;$('continue').textContent=button;$('continue').onclick=()=>{$('story').close();cb()};$('story').showModal()}
function load(i,story=true){epoch++;stage=i;let m=stages[i];mode='loading';activated=new Set();timer=m.seconds||0;age=0;impactAge=0;impactOK=false;showEnding=false;dashTime=0;dashCooldown=0;velY=0;nearNode=null;clearKeys();$('flash').style.opacity=0;$('toast').classList.remove('show');prompt('');buildWorld(m.chapter);setupShield(m);player.position.set(0,.32,5.8);player.rotation.set(0,0,0);yaw=0;pitch=.58;dist=17;camera.position.set(0,13,22);camera.lookAt(0,1.7,0);
 if(puzzle(m)){for(let p of candidates(m)){let [x,z]=world(p.x,p.y),g=group(x,.25,z);let pedestal=cyl(.52,.7,.26,material('#9c7f88',.5,.45),0,.13,0,g,8);let jewel=gem(.48,material('#ffd18b',.35,.4,.45),0,.94,0,g);let halo=ring(.76,material('#eab879',.15,.5,.4),0,.16,0,g);label('('+p.x+', '+p.y+')',0,1.95,0,'#ffdfac',1.75,g);nodes.push({...p,g,jewel,halo,id:p.x+','+p.y})}}
 updateHUD();if(story)showStory('ACT '+(m.chapter+1)+' · '+(stage+1)+'/6',m.title,m.story,'Mulai misi',()=>{mode='play';chime()});else mode='play'}
function finish(){if(mode!=='play'&&mode!=='impact')return;let next=stage+1;checkpoint=Math.min(next,5);complete=next===6;save();updateHUD();if(complete){mode='ending';showEnding=true;for(let d of domes)d.g.visible=true;let huge=dome(0,0,5.25,'#8ef8ea');huge.visible=true;for(let t of towers)t.light.emissiveIntensity=2.5;particlesAt(0,6,-10,0x9ffff4,75);chime();let e=epoch;setTimeout(()=>{if(epoch===e)showStory(demo?'DEMO SELESAI':'ORBIA RESTORED','The Last Shield','Perisai terakhir menyelimuti Orbia. Tiga menara kembali menyala, dan Orin telah memulihkan cahaya dunia.','Main lagi',()=>{checkpoint=0;complete=false;lives=3;save();load(0)})},2000)}else{chime();showStory('SHIELD RESTORED · '+next+'/6',mTitle(next-1)+' pulih!',next%2===0?'Menara kembali menyala. Jalur berikutnya terbuka.':'Satu langkah lebih dekat menuju Core Tower.','Lanjutkan',()=>load(next))}}
function mTitle(i){return stages[i].title}
function action(){if(mode!=='play')return;let m=stages[stage];if(!puzzle(m)){toast('Tunggu gelombang meteor di posisi aman.');return}if(!nearNode){toast('Dekati kristal hingga tombol aksi muncul.',false);return}let n=nearNode;if(activated.has(n.id)){toast('Segel ini sudah aktif.');return}if(!accepts(m,n.x,n.y)){toast('Titik ('+n.x+', '+n.y+') tidak memenuhi persamaan.',false);tone(160,.2);return}activated.add(n.id);n.jewel.material.color.set('#8df7e7');n.jewel.material.emissive.set('#8df7e7');n.halo.material.color.set('#91ffef');particlesAt(n.g.position.x,1.2,n.g.position.z,0x99ffec,28);chime();updateHUD();if(activated.size>=m.required){for(let d of domes)d.g.visible=true;finish()}else toast('Segel berhasil diaktifkan!')}
function pass(){if(!['play','impact'].includes(mode))return;demo=true;$('demoTag').hidden=false;clearKeys();let m=stages[stage];if(puzzle(m)){for(let n of nodes)if(n.correct&&!activated.has(n.id)&&activated.size<m.required){activated.add(n.id);n.jewel.material.color.set('#9affed');n.jewel.material.emissive.set('#9affed')}}else{let pt=null;outer:for(let x=-4;x<=4;x+=.25)for(let y=-4;y<=4;y+=.25)if(accepts(m,x,y)){pt=[x,y];break outer}if(pt){let [x,z]=world(...pt);player.position.set(x,.32,z);velY=0}for(let d of domes)d.g.visible=true}finish()}
function impact(){let m=stages[stage],[x,y]=coords(player.position.x,player.position.z);impactOK=accepts(m,x,y);mode='impact';impactAge=0;clearKeys();if(!impactOK){lives=Math.max(0,lives-1);updateHUD();velY=6;toast('Di luar daerah aman. Energi berkurang.',false)}else toast('AEGIS ACTIVE · Perisai melindungimu!');burst(m,impactOK)}
const keys=new Set(),joy={x:0,y:0};let drag=null,joyId=null;
function clearKeys(){keys.clear();joy.x=joy.y=0;$('knob').style.transform='';joyId=null}
function jump(){if(mode==='play'&&player.position.y<.35){velY=9.5;tone(390,.12,'triangle')}}
function dash(){if(mode==='play'&&dashCooldown<=0){dashTime=.22;dashCooldown=1.5;tone(320,.15,'triangle');particlesAt(player.position.x,.6,player.position.z,0x9adfff,9)}}
addEventListener('keydown',e=>{if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Space'].includes(e.code))e.preventDefault();keys.add(e.code);if(e.repeat)return;if(e.code==='Space')jump();if(e.code==='ShiftLeft'||e.code==='ShiftRight')dash();if(e.code==='KeyE')action();if(e.code==='KeyP')pass();if(e.code==='Escape'&&mode==='play')pause()});addEventListener('keyup',e=>keys.delete(e.code));addEventListener('blur',clearKeys);
const cv=renderer.domElement;cv.addEventListener('pointerdown',e=>{drag={id:e.pointerId,x:e.clientX,y:e.clientY};cv.setPointerCapture(e.pointerId)});cv.addEventListener('pointermove',e=>{if(!drag||e.pointerId!==drag.id)return;yaw-=(e.clientX-drag.x)*.0055;pitch=clamp(pitch+(e.clientY-drag.y)*.004,.22,1.0);drag.x=e.clientX;drag.y=e.clientY});for(let ev of ['pointerup','pointercancel','lostpointercapture'])cv.addEventListener(ev,()=>drag=null);cv.addEventListener('wheel',e=>dist=clamp(dist+Math.sign(e.deltaY),12,22),{passive:true});
const joystick=$('joy');function moveJoy(e){let r=joystick.getBoundingClientRect(),x=(e.clientX-r.left-r.width/2)/(r.width*.4),y=(e.clientY-r.top-r.height/2)/(r.height*.4),n=Math.max(1,Math.hypot(x,y));joy.x=x/n;joy.y=y/n;$('knob').style.transform='translate('+joy.x*32+'px,'+joy.y*32+'px)'}joystick.addEventListener('pointerdown',e=>{e.preventDefault();joyId=e.pointerId;joystick.setPointerCapture(e.pointerId);moveJoy(e)});joystick.addEventListener('pointermove',e=>{if(joyId===e.pointerId)moveJoy(e)});for(let ev of ['pointerup','pointercancel','lostpointercapture'])joystick.addEventListener(ev,e=>{if(e.pointerId===joyId){joyId=null;joy.x=joy.y=0;$('knob').style.transform=''}});$('jump').onclick=jump;$('dash').onclick=dash;$('act').onclick=action;
function pause(){if(mode!=='play')return;mode='pause';clearKeys();$('menu').showModal()}
$('pause').onclick=pause;$('unpause').onclick=()=>{$('menu').close();mode='play'};$('retry').onclick=()=>{$('menu').close();lives=3;load(stage,false)};$('audio').onclick=()=>{mute=!mute;$('audio').textContent=mute?'♪̸':'♫'};$('pass').onclick=pass;
for(let id of ['intro','story','menu'])$(id).addEventListener('cancel',e=>e.preventDefault());
function begin(i,isDemo){demo=isDemo;complete=false;lives=3;$('intro').close();$('hud').hidden=false;load(i)}
$('start').onclick=()=>{checkpoint=0;begin(0,false)};$('resume').hidden=!checkpoint||complete;$('resume').onclick=()=>begin(checkpoint,false);$('demo').onclick=()=>begin(0,true);
if(new URLSearchParams(location.search).get('demo')==='1'){$('start').hidden=true;$('resume').hidden=true;$('demo').textContent='Mulai mode presentasi'}
let last=performance.now(),time=0;
function animate(now){requestAnimationFrame(animate);let dt=Math.min(.04,(now-last)/1000);last=now;time+=dt;let m=stages[stage];
 if(mode==='play'){age+=dt;dashTime=Math.max(0,dashTime-dt);dashCooldown=Math.max(0,dashCooldown-dt);
 let f=+(keys.has('KeyW')||keys.has('ArrowUp'))-+(keys.has('KeyS')||keys.has('ArrowDown'))-joy.y,s=+(keys.has('KeyD')||keys.has('ArrowRight'))-+(keys.has('KeyA')||keys.has('ArrowLeft'))+joy.x,n=Math.hypot(f,s),speed=dashTime>0?16:7.8;
 if(n>.04){f/=Math.max(n,1);s/=Math.max(n,1);let dx=s*Math.cos(yaw)-f*Math.sin(yaw),dz=-s*Math.sin(yaw)-f*Math.cos(yaw);player.position.x=clamp(player.position.x+dx*speed*dt,-10.45,10.45);player.position.z=clamp(player.position.z+dz*speed*dt,-10.45,10.45);let a=Math.atan2(-dx,-dz);player.rotation.y+=Math.atan2(Math.sin(a-player.rotation.y),Math.cos(a-player.rotation.y))*Math.min(1,dt*15);walkT+=dt*speed*2.1}else if(dashTime>0){player.position.x=clamp(player.position.x-Math.sin(player.rotation.y)*speed*dt,-10.45,10.45);player.position.z=clamp(player.position.z-Math.cos(player.rotation.y)*speed*dt,-10.45,10.45)}
 velY-=23*dt;player.position.y=Math.max(.32,player.position.y+velY*dt);if(player.position.y<=.32)velY=0;
 let sw=n>.04?Math.sin(walkT)*.69:0,air=player.position.y>.38;slayer.lArm.rotation.x=air?-.8:sw;slayer.rArm.rotation.x=air?-.8:-sw;slayer.lLeg.rotation.x=air?-.2:-sw;slayer.rLeg.rotation.x=air?.25:sw;player.rotation.z=dashTime>0?.035:Math.sin(walkT)*.018*Math.min(n,1);
 if(puzzle(m)){nearNode=nodes.find(n=>Math.hypot(n.g.position.x-player.position.x,n.g.position.z-player.position.z)<1.55&&!activated.has(n.id))||null;prompt(nearNode?'E · Aktifkan ('+nearNode.x+', '+nearNode.y+')':'');for(let n of nodes)n.jewel.scale.setScalar(n===nearNode?1.18:1)}else{timer=Math.max(0,timer-dt);$('timer').textContent=timer.toFixed(1)+' s';$('timerbar').style.width=100*timer/m.seconds+'%';prompt(timer<4?'☄ SERANGAN SEGERA TIBA':'');if(timer<=0)impact()}}
 else if(mode==='impact'){impactAge+=dt;if(!impactOK){velY-=23*dt;player.position.y=Math.max(.32,player.position.y+velY*dt)}if(impactAge>=1.7){if(impactOK)finish();else if(lives===0){showStory('AEGIS OFFLINE','Energi habis','Orin kembali ke checkpoint tahap ini. Baca persamaan dan cari perlindungan yang tepat.','Coba lagi',()=>{lives=3;load(stage,false)})}else{load(stage,false)}}}
 slayer.core.rotation.y+=dt*3;slayer.core.rotation.x+=dt*1.6;slayer.pack.position.y=1.78+Math.sin(time*4)*.025;for(let t of towers){t.crystal.rotation.y+=dt*.65;t.orb.rotation.z+=dt*.3}for(let n of nodes){n.jewel.rotation.y+=dt*1.7;n.jewel.position.y=.94+Math.sin(time*2.6+n.g.position.x)*.11}for(let a of ambience){a.o.position.set(a.x+Math.sin(time*.24+a.phase)*.5,a.y+Math.sin(time*.6+a.phase)*1.1,a.z);a.o.rotation.y+=dt*.5}
 for(let d of domes){if(d.g.visible){d.shell.material.opacity=.17+.035*Math.sin(time*4);d.wire.material.opacity=.09+.025*Math.sin(time*3)}}
 for(let k of meteors){let t=impactAge-k.delay;if(t<0){k.g.visible=false;continue}k.g.visible=t<.9;k.g.position.set(k.x+(1-t)*2.7,Math.max(.2,18*(1-t/.85)),k.z+(1-t)*1.8);k.body.rotation.x+=dt*7;if(t>=.78&&!k.hit){k.hit=true;particlesAt(k.x,.4,k.z,impactOK?0x7eeaff:0xff9b61,6)}}
 for(let i=particles.length-1;i>=0;i--){let p=particles[i];p.life-=dt;p.v.y-=8*dt;p.o.position.addScaledVector(p.v,dt);p.o.rotation.y+=dt*8;p.o.material.opacity=clamp(p.life,0,1);if(p.life<=0){effects.remove(p.o);p.o.geometry.dispose();p.o.material.dispose();particles.splice(i,1)}}
 let [x,y]=coords(player.position.x,player.position.z);$('coords').textContent='('+x.toFixed(1)+', '+y.toFixed(1)+')';
 let focus=new T.Vector3(player.position.x*.68,1.55+Math.max(0,player.position.y-.32)*.25,player.position.z*.68-1.4),cam=new T.Vector3(focus.x+Math.sin(yaw)*dist*Math.cos(pitch),focus.y+dist*Math.sin(pitch),focus.z+Math.cos(yaw)*dist*Math.cos(pitch));if(mode==='intro'){focus.set(0,1.9,-2);cam.set(8,8,17)}if(showEnding){focus.set(0,3,-5);cam.set(13*Math.sin(time*.16),14,24)}camera.position.lerp(cam,Math.min(1,dt*7));camera.lookAt(focus);renderer.render(scene,camera)
}
buildWorld(0);player.position.set(0,.32,5.8);camera.position.set(8,8,17);$('intro').showModal();document.body.classList.add('ready');requestAnimationFrame(animate);
