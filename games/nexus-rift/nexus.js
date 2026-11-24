import {World,T,$,clamp,rng} from './engine.js';
import {worlds,factors,initialEnergy,recipeOK,rotate,reflect,relayOK,beamOK,islands,vector,waves,safe,toWorld,fromWorld} from './math.mjs';
const W=new World(),K='animathics-nexus-rift-v1';
let stage=-1,checkpoint=0,completed=false,active=false,muted=false,avatar=null,phaseFn=()=>{},actionFn=()=>{},jumpFn=()=>{},epoch=0,toastTimer=0;
try{const s=JSON.parse(localStorage.getItem(K)||'{}');checkpoint=Number.isInteger(s.next)&&s.next>=0&&s.next<=3?s.next:0;completed=s.complete===true}catch{}
const chapters=['01 · THE FORGE','02 · THE LIGHT GATE','03 · SKY CORRIDOR','04 · THE GUARDIAN'];
const titles=['Inti energi','Gerbang cahaya','Koridor langit','Rift Guardian'];
const colors=['#f8be85','#bbaaff','#8ce8f6','#e6adff'];
const saved=()=>{try{localStorage.setItem(K,JSON.stringify({next:checkpoint,complete:completed}))}catch{}};
const key=(...codes)=>codes.some(c=>W.keys.has(c)||W.pad.has(c));
const near=(a,x,z,r=1.7)=>Math.hypot(a.g.position.x-x,a.g.position.z-z)<r;
const dialogOpen=()=>['welcome','transition','worldMap'].some(id=>$(id).open);
const playing=()=>active&&!dialogOpen();
const particles=[];
function tone(ok=true){if(!muted)W.tone(ok)}
function say(s,ok=true){clearTimeout(toastTimer);$('toast').textContent=s;$('toast').dataset.ok=ok;$('toast').classList.add('show');toastTimer=setTimeout(()=>$('toast').classList.remove('show'),2400);tone(ok)}
function context(s=''){$('context').textContent=s;$('context').classList.toggle('show',!!s)}
function status(s){$('status').textContent=s}
function meter(n,s){$('fill').style.width=clamp(n,0,100)+'%';$('meterText').textContent=s}
function mission(title,formula,brief){$('title').textContent=title;$('formula').textContent=formula;$('brief').textContent=brief}
function button(text,fn){let b=document.createElement('button');b.className='primary';b.textContent=text;b.onclick=()=>{if(playing())fn()};$('controls').append(b);return b}
function stepper(text,min,max,initial,onchange){let row=document.createElement('div'),name=document.createElement('span'),minus=document.createElement('button'),value=document.createElement('b'),plus=document.createElement('button');let n=initial;row.className='step';name.textContent=text;minus.textContent='−';plus.textContent='+';value.textContent=n;const set=x=>{n=clamp(x,min,max);value.textContent=n;onchange(n)};minus.onclick=()=>{if(playing())set(n-1)};plus.onclick=()=>{if(playing())set(n+1)};row.append(name,minus,value,plus);$('controls').append(row);return {set,get:()=>n}}
function cores(){ $('cores').replaceChildren();for(let i=0;i<4;i++){let b=document.createElement('span');b.className='core'+((completed||checkpoint>i)?' on':'');b.textContent=['◆','✧','➤','✦'][i];b.title=titles[i];$('cores').append(b)}}
function fx(x,y,z,color,n=18){for(let i=0;i<n;i++){let m=W.gem(.08+Math.random()*.1,color,x,y,z);let a=Math.random()*Math.PI*2,s=1+Math.random()*4;particles.push({m,v:new T.Vector3(Math.cos(a)*s,2+Math.random()*5,Math.sin(a)*s),life:.5+Math.random()*.65})}}
function ring(x,z,r,c,y=.06){let o=W.ring(r,c,x,y,z);o.rotation.x=Math.PI/2;return o}
function base(w,d,c){W.box(w,.65,d,c,0,-.35,0)}
function stone(x,z,r,c,y=.8){return W.mesh(new T.DodecahedronGeometry(r,0),c,x,y,z)}
function tree(x,z,c='#77d7ab'){let g=W.group(x,0,z);W.cyl(.15,.3,2,'#917b81',0,1,0,g);for(let i=0;i<3;i++)W.ball(1.1-i*.13,c,Math.sin(i*3)*.4,2.2+i*.35,Math.cos(i*3)*.4,g);return g}
function portal(x,z,c,txt,parent=W.root){let g=W.group(x,0,z,parent);let b=W.cyl(1.35,1.7,.3,'#65758f',0,.15,0,g);let torus=W.ring(1.27,c,0,1.7,0,g);torus.material.emissiveIntensity=.8;let inner=W.mesh(new T.CircleGeometry(1.12,32),c,0,1.7,.025,g,.25);inner.material.transparent=true;inner.material.opacity=.3;inner.material.side=T.DoubleSide;W.label(txt,0,3.4,0,g,c);return {g,torus,inner}}
function hero(x=0,z=0){let a=W.avatar(x,0,z,'#5568ac');let belt=W.box(.93,.18,.6,'#21334c',0,-.35,0,a.body);W.gem(.22,'#a4ffe1',0,.05,-.34,a.body);for(let s of [-1,1])W.box(.38,.19,.49,'#b4e5fa',s*.62,.32,0,a.body,.12);let pack=W.box(.7,.67,.34,'#3a476c',0,.04,.49,a.body);for(let s of [-1,1])W.gem(.18,'#87f3d2',s*.23,.08,.72,a.body);return a}
function cameraFollow(a,d=11,h=8){W.cameraAt(a.g.position.x,a.g.position.y*.65,a.g.position.z,d,h)}
function walk(a,dt,bounds,speed=6.8){W.walk(a,dt,bounds,key('ShiftLeft','ShiftRight')?speed*1.42:speed)}
function jumpController(a){let y=0,v=0;return {jump(){if(y<.01){v=8.8;tone()}},frame(dt){v-=23*dt;y=Math.max(0,y+v*dt);if(y===0)v=0;a.g.position.y=y},reset(){y=0;v=0;a.g.position.y=0},height(){return y}}}
function clear(){epoch++;active=false;phaseFn=()=>{};actionFn=()=>{};jumpFn=()=>{};W.keys.clear();W.pad.clear();particles.length=0;$('controls').replaceChildren();$('toast').classList.remove('show');context();status('');meter(0,'');$('act').textContent='AKSI [E]';$('jump').hidden=false}
function setStage(i){clear();stage=i;$('chapter').textContent=i<0?'CENTRAL NEXUS':chapters[i];cores();const builders=[forge,laser,sky,boss];if(i<0)hub();else builders[i]();active=true}
function finish(){if(!active)return;active=false;let next=stage+1;checkpoint=Math.max(checkpoint,Math.min(next,3));if(next===4)completed=true;saved();cores();$('transitionTag').textContent=next===4?'NEXUS RESTORED':chapters[stage]+' · SELESAI';$('transitionTitle').textContent=next===4?'Nexus kembali hidup!':titles[stage]+' pulih!';$('transitionText').textContent=next===4?'Sepuluh dunia terhubung kembali. Semua misi dapat dimainkan ulang dari awal.':'Energi misi ini tersimpan. Lanjutkan menuju '+titles[next].toLowerCase()+'.';$('next').textContent=next===4?'Kembali ke Nexus':'Lanjutkan misi';$('next').onclick=()=>{$('transition').close();setStage(next===4?-1:next)};tone();$('transition').showModal()}
function hub(){
 W.reset('#1a2445','#293c64',.012);W.cyl(14.8,14.5,.8,'#4c5d7d',0,-.4,0);W.cyl(5,5,.1,'#7087a5',0,.025,0);
 for(let r of [4.8,9.2,13.9])ring(0,0,r,'#8bbbd6',.09);
 for(let i=0;i<30;i++){let a=i*Math.PI*2/30;W.gem(.22,'#8bf5da',Math.sin(a)*13.4,.45,Math.cos(a)*13.4)}
 let core=W.group(0,0,0);W.cyl(1.7,2,.4,'#526d92',0,.2,0,core);let crystal=W.gem(1.03,completed?'#a1ffcd':'#bbabff',0,2.2,0,core);let hoop=W.ring(1.45,'#9df0de',0,2.1,0,core);hoop.rotation.x=.8;W.label(completed?'NEXUS RESTORED':'THE LAST CORE',0,4.3,0,core);
 const gates=worlds.map((g,i)=>{let a=2*Math.PI*i/worlds.length,x=Math.sin(a)*10.8,z=-Math.cos(a)*10.8;let p=portal(x,z,['#a7baff','#9fe8bd','#f4bd91','#d6a4ff'][i%4],g.title);p.g.rotation.y=Math.atan2(-x,-z);return {...g,x,z,...p}});
 avatar=hero(0,4);let jump=jumpController(avatar);jumpFn=()=>jump.jump();
 mission('Pusat Nexus','10 portal · 4 misi terhubung','Dekati inti dan tekan E untuk mulai. Portal di sekelilingmu menuju game asli; misi Nexus Rift adalah petualangan terpisah.');
 button(completed?'Main ulang petualangan':checkpoint?'Lanjutkan misi':'Mulai petualangan',()=>{if(completed){completed=false;checkpoint=0;saved()}setStage(checkpoint)});
 if(checkpoint>0&&!completed)button('Mulai dari awal',()=>{checkpoint=0;saved();setStage(0)});
 status(completed?'Semua inti telah pulih.':checkpoint?'Checkpoint: '+titles[checkpoint]:'Pecahan inti belum dikumpulkan.');meter(completed?100:checkpoint*25,'Progress inti Nexus');
 actionFn=()=>{if(near(avatar,0,0,3)){if(completed){completed=false;checkpoint=0;saved()}setStage(checkpoint);return}let p=gates.find(p=>near(avatar,p.x,p.z,2.5));if(p){openMap(p.id)}else say('Dekati inti atau portal.',false)};
 phaseFn=(dt,run)=>{if(run){walk(avatar,dt,[-12,12,-12,12]);let p=avatar.g.position;if(Math.hypot(p.x,p.z)>13.8){let n=13.8/Math.hypot(p.x,p.z);p.x*=n;p.z*=n}jump.frame(dt)}crystal.rotation.y+=dt*.7;crystal.position.y=2.1+Math.sin(W.t*2)*.18;hoop.rotation.z+=dt*.35;for(let p of gates){p.inner.material.opacity=.22+.09*Math.sin(W.t*2+p.x)}let g=gates.find(p=>near(avatar,p.x,p.z,2.5));context(near(avatar,0,0,3)?'E · Aktifkan misi':g?'E · Portal '+g.title:'');cameraFollow(avatar,12,8.5)};
}
function forge(){
 W.reset('#251d3d','#493a63',.023);base(28,25,'#544662');let rand=rng(23);
 for(let i=0;i<25;i++){let a=i*Math.PI*2/25,x=Math.cos(a)*13,z=Math.sin(a)*11.5;stone(x,z,1.4+rand(),'#665a83',1.2);W.gem(.42,i%2?'#a7afff':'#88f8de',x*.9,.8,z*.9)}
 let core=W.group(0,0,-5.5);W.cyl(2,2.3,.4,'#778099',0,.2,0,core);let crystal=W.gem(1.3,'#c8afff',0,1.9,0,core);ring(0,-5.5,2.1,'#a9e4ff');W.label('ENERGY CORE',0,3.8,0,core);
 let pot=W.group(0,0,5.7);W.cyl(1.45,1.05,1.6,'#49576e',0,.8,0,pot);W.cyl(1.36,1.36,.15,'#8df2b2',0,1.58,0,pot,.7);ring(0,5.7,2,'#92f3b6');W.label('ALCHEMY REACTOR',0,3,0,pot);
 let nodes=factors.map((p,i)=>{let a=Math.PI*2*i/factors.length+.45,x=Math.cos(a)*7.9,z=Math.sin(a)*6.3,g=W.group(x,0,z);W.cyl(.9,1.1,.35,'#7a7292',0,.17,0,g);let gem=W.gem(.78,'#b3a5fc',0,1.24,0,g);W.label(String(p),0,2.6,0,g);return {p,x,z,g,gem}});
 let supplies=[];for(let i=0;i<12;i++){let type=i%2===0?'a':'b',a=i*Math.PI/6+.3,x=Math.cos(a)*9.8,z=Math.sin(a)*8.7,g=W.group(x,0,z);let gem=W.gem(.56,type==='a'?'#ffb477':'#72dfff',0,1.1,0,g);W.label(type==='a'?'SURYA +1':'BULAN +1',0,2.2,0,g);g.visible=false;supplies.push({type,x,z,g,gem,cool:0})}
 let drones=[];for(let i=0;i<2;i++){let d=W.group();W.ball(.65,'#524565',0,.66,0,d);W.box(.72,.17,.12,'#ff8fa8',0,.75,-.58,d,.6);drones.push(d)}
 avatar=hero(0,2.4);let jump=jumpController(avatar);jumpFn=()=>jump.jump();let phase=0,rem=initialEnergy,used=[],a=0,b=0,cool=0,inv=0;
 mission('Bangunkan inti','60 = hasil kali faktor prima','Dekati kristal prima dan tekan E untuk menambang faktor yang membagi sisa inti. Setelah inti terpecah, bawa ramuan yang tepat ke reaktor.');
 function report(){if(phase===0){status('Faktor: '+(used.join(' × ')||'—')+'\nSisa inti: '+rem);meter(100*(1-Math.log(rem)/Math.log(initialEnergy)),'Energi terurai')}else{status('Surya x = '+a+' · Bulan y = '+b+'\nPers. 1: '+(a+b)+' / 7   |   Pers. 2: '+(2*a-b)+' / 5');meter(100*clamp((a+b)/7,0,1),'Kapasitas ramuan')}}
 function action(){if(cool>0)return;cool=.22;if(phase===0){let n=nodes.find(n=>near(avatar,n.x,n.z,2));if(!n){say('Dekati kristal prima.',false);return}if(rem%n.p){say(n.p+' bukan faktor dari '+rem,false);return}rem/=n.p;used.push(n.p);fx(n.x,1.25,n.z,'#c7bbff');if(rem===1){phase=1;crystal.material.color.set('#8cf2c4');crystal.material.emissive.set('#73dcb2');nodes.forEach(n=>n.g.visible=false);supplies.forEach(n=>n.g.visible=true);mission('Racik bahan bakar Nexus','x + y = 7\n2x − y = 5','Sentuh kristal Surya dan Bulan untuk mengumpulkannya. Hindari drone dengan melompat. Dekati reaktor dan tekan E setelah kedua persamaan terpenuhi.');button('Kosongkan tas',()=>{a=b=0;supplies.forEach(n=>n.cool=0);report()});say('Energi prima aktif! Racik bahan bakar.')}else say('Faktor '+n.p+' tersimpan');report();return}
 if(near(avatar,0,5.7,2.5)){if(recipeOK(a,b)){fx(0,2,5.7,'#99ffe0',36);finish()}else say('Kedua persamaan belum seimbang.',false)}else say('Dekati reaktor hijau.',false)}
 actionFn=action;report();
 phaseFn=(dt,run)=>{if(run){cool=Math.max(0,cool-dt);inv=Math.max(0,inv-dt);walk(avatar,dt,[-11.5,11.5,-10.2,10.2]);jump.frame(dt);if(phase===1){for(let n of supplies){n.cool=Math.max(0,n.cool-dt);n.g.visible=n.cool===0;if(n.cool===0&&near(avatar,n.x,n.z,1.12)&&jump.height()<1.1){if(a+b<12){n.type==='a'?a++:b++;n.cool=3;fx(n.x,1,n.z,n.type==='a'?'#ffc690':'#92e8ff',8);tone();report()}}}for(let i=0;i<drones.length;i++){let t=W.t*.55+i*Math.PI,d=drones[i];d.position.set(Math.cos(t)*5.4,.1,Math.sin(t*1.3)*6.1);d.rotation.y=t;if(inv===0&&jump.height()<.85&&near(avatar,d.position.x,d.position.z,1.2)){if(a>0||b>0){if(a>0)a--;else b--;say('Drone mengambil satu kristal!',false);report()}inv=2.2}}}else for(let d of drones)d.position.set(0,-6,0)}
 crystal.rotation.y+=dt*.65;for(let n of nodes){n.gem.rotation.y+=dt;n.gem.position.y=1.2+Math.sin(W.t*2+n.x)*.14}for(let n of supplies)n.gem.rotation.y+=dt*1.7;let n=nodes.find(n=>near(avatar,n.x,n.z,2));context(phase===0&&n?'E · Tambang faktor '+n.p:phase===1&&near(avatar,0,5.7,2.5)?'E · Uji ramuan':'');cameraFollow(avatar,11,8)};
}
function laser(){
 W.reset('#222546','#37476c',.018);base(26,25,'#515f7b');const k=1.5;
 for(let i=-6;i<=6;i++){W.box(.026,.018,18,'#8493ae',i*k,.017,0);W.box(18,.018,.026,'#8493ae',0,.017,i*k);if(i%2===0){W.label(String(i),i*k,.2,9.5).scale.set(1,.27,1);W.label(String(-i),-9.5,.2,i*k).scale.set(1,.27,1)}}
 W.box(.085,.026,19,'#c0e3f5',0,.04,0);W.box(19,.026,.085,'#c0e3f5',0,.04,0);W.label('+X',10,.8,0);W.label('+Y',0,.8,-10);
 let src=W.group(0,0,0);W.cyl(.7,1,.35,'#b0a7d2',0,.18,0,src);let gem=W.gem(.55,'#fce2a8',0,1.08,0,src);
 let [rx,rz]=toWorld(-1,2,k),[gx,gz]=toWorld(-3,-6,k);ring(rx,rz,.5,'#b7e7ff');W.gem(.4,'#a9dfff',rx,.65,rz);W.label('RELAY (−1, 2)',rx,1.8,rz);let gate=portal(gx,gz,'#91f2ce','GATE (−3, −6)');
 function terminal(x,z,c,txt){let g=W.group(x,0,z);W.cyl(.73,.9,.33,'#8492ad',0,.16,0,g);W.box(.85,1.6,.63,'#65769a',0,.9,0,g);W.gem(.44,c,0,2.02,0,g);ring(x,z,1.2,c);W.label(txt,0,3.05,0,g,c);return g}
 let rot=terminal(7,4,'#cfafff','ROTASI'),ref=terminal(7,-4,'#8ee5ff','REFLEKSI');avatar=hero(5,8);let jump=jumpController(avatar);jumpFn=()=>jump.jump();let angle=0,mode=0,modes=['none','X','Y','D'],rvec=[2,1],v=[2,1],beam=null,relay=null,unlocked=false;
 mission('Kalibrasi gerbang cahaya','v = (2, 1) · relay (−1, 2)\nLaser tujuan: y = 2x, arah ke (−3, −6)','Atur rotasi pada terminal ungu hingga vektor mengenai relay. Kemudian atur refleksi pada terminal biru agar laser menuju gerbang. Dekati gerbang dan tekan E.');
 function redraw(){rvec=rotate([2,1],angle);v=reflect(rvec,modes[mode]);for(let o of [beam,relay])if(o){W.root.remove(o);o.geometry.dispose();o.material.dispose()}let a=toWorld(...rvec,k),b=toWorld(v[0]*3,v[1]*3,k);relay=W.line([0,1.02,0],[a[0],1.02,a[1]],'#b6a2fc',.075);beam=W.line([0,.68,0],[b[0],.68,b[1]],'#92f5d2',.085);unlocked=relayOK(rvec)&&beamOK(v);gate.inner.material.opacity=unlocked?.8:.18;status('Rotasi '+angle+'° → ('+rvec.join(', ')+') '+(relayOK(rvec)?'✓':'')+'\nRefleksi '+['tidak ada','sumbu X','sumbu Y','y = x'][mode]+' → ('+v.join(', ')+') '+(beamOK(v)?'✓':''));meter((relayOK(rvec)?50:0)+(unlocked?50:0),'Kalibrasi jalur')}
 redraw();button('Rotasi +90° (dekat terminal)',()=>{if(near(avatar,7,4,2.5)){angle=(angle+90)%360;redraw()}else say('Dekati terminal ungu.',false)});button('Ubah refleksi (dekat terminal)',()=>{if(near(avatar,7,-4,2.5)){mode=(mode+1)%4;redraw()}else say('Dekati terminal biru.',false)});
 actionFn=()=>{if(near(avatar,7,4,2.5)){angle=(angle+90)%360;redraw();tone()}else if(near(avatar,7,-4,2.5)){mode=(mode+1)%4;redraw();tone()}else if(near(avatar,gx,gz,2.4)){if(unlocked){fx(gx,1.5,gz,'#b2ffe0',30);finish()}else say('Kedua jalur harus tepat.',false)}else say('Dekati terminal atau gerbang.',false)};
 phaseFn=(dt,run)=>{if(run){walk(avatar,dt,[-10.8,10.8,-10.8,10.8]);jump.frame(dt)}gem.rotation.y+=dt;context(near(avatar,7,4,2.5)?'E · Rotasi 90°':near(avatar,7,-4,2.5)?'E · Ubah refleksi':near(avatar,gx,gz,2.4)?'E · Buka gerbang':'');cameraFollow(avatar,13,10)};
}
function sky(){
 W.reset('#9bd6f5','#7ab5d1',.011);const k=3,centers=islands.map(([x,y])=>toWorld(x,y,k));
 let platforms=centers.map(([x,z],i)=>{let g=W.group(x,0,z);W.cyl(2.3,2.6,1,'#a392ad',0,-.6,0,g);W.cyl(2.45,2.45,.25,'#89dca6',0,-.12,0,g);W.cone(2.1,2.4,'#9385b1',0,-2.1,0,g).rotation.z=Math.PI;ring(x,z,1.35,'#c0f3dd');W.label('('+islands[i].join(', ')+')',0,3.35,0,g);let charge=W.gem(.4,'#ffd68e',.85,2.2,-.65,g);return {g,charge,x,z}});
 let random=rng(77);for(let i=0;i<24;i++){let x=(random()-.5)*55,z=-13+(random()-.5)*58,g=W.group(x,-4-random()*4,z);for(let j=0;j<3;j++){let c=W.ball(1.7,'#e9f6ff',(j-1)*1.7,0,0,g);c.scale.set(1.2,.54,.8)}}
 let goal=portal(centers[3][0],centers[3][1],'#93f5d3','SKY GATE');goal.g.position.z-=.4;platforms[3].charge.visible=false;
 avatar=hero(0,0);let jump=jumpController(avatar),i=0,charged=false,dx=0,dy=0,flight=null;
 mission('Sky Corridor','P′ = P + (Δx, Δy)','Lompat untuk mengambil kapasitor emas di pulau. Atur vektor dorongan menuju pulau berikutnya, lalu E di pad pusat. Meleset berarti kembali ke checkpoint pulau.');
 let sx=stepper('Δx',-4,4,0,n=>{dx=n;report()}),sy=stepper('Δy',-4,4,0,n=>{dy=n;report()});
 button('Luncurkan dorongan [E]',()=>launch());
 function report(){let p=islands[i],q=islands[Math.min(i+1,3)];status('Pulau '+(i+1)+'/4 · '+(charged?'Kapasitor siap':'Kapasitor kosong')+'\nP = ('+p.join(', ')+') → tujuan ('+q.join(', ')+')\nPrediksi P′ = ('+(p[0]+dx)+', '+(p[1]+dy)+')');meter(i/3*100,'Pulau tercapai')}
 function launch(){if(flight)return;if(i===3){if(near(avatar,centers[3][0],centers[3][1],2)){fx(avatar.g.position.x,1.5,avatar.g.position.z,'#c6ffe2',30);finish()}else say('Dekati pad pusat.',false);return}if(!charged){say('Lompat untuk mengambil kapasitor emas.',false);return}if(!near(avatar,centers[i][0],centers[i][1],1.4)){say('Kembali ke pad pusat.',false);return}if(!dx&&!dy){say('Atur vektor dorongan.',false);return}let a=centers[i],b=toWorld(islands[i][0]+dx,islands[i][1]+dy,k),goal=vector(islands[i],islands[i+1]);flight={a,b,t:0,ok:dx===goal[0]&&dy===goal[1]};jump.reset();avatar.g.position.set(a[0],0,a[1]);avatar.g.rotation.y=Math.atan2(a[0]-b[0],a[1]-b[1]);fx(a[0],.5,a[1],'#c3edff',24);say('Vector boost!')}
 actionFn=launch;jumpFn=()=>{if(!flight)jump.jump()};report();
 phaseFn=(dt,run)=>{for(let p of platforms){p.charge.rotation.y+=dt*1.6;p.charge.position.y=2.2+Math.sin(W.t*3)*.1}
 if(run){if(flight){let f=flight;f.t=Math.min(1,f.t+dt*.57);let t=f.t;avatar.g.position.set(f.a[0]+(f.b[0]-f.a[0])*t,4.5*Math.sin(t*Math.PI),f.a[1]+(f.b[1]-f.a[1])*t);avatar.arms[0].rotation.x=-.9;avatar.arms[1].rotation.x=-.9;if(t>=1){flight=null;if(f.ok){i++;charged=i===3;sx.set(0);sy.set(0);say('Pulau '+(i+1)+' tercapai!');fx(centers[i][0],.8,centers[i][1],'#f4f9c2',20)}else{say('Vektor meleset. Kembali ke pulau terakhir.',false);charged=true}avatar.g.position.set(centers[i][0],0,centers[i][1]);jump.reset();report()}}else{let [x,z]=centers[i];walk(avatar,dt,[x-2.1,x+2.1,z-2.1,z+2.1],5.3);let p=avatar.g.position;if(Math.hypot(p.x-x,p.z-z)>2.12){let n=2.12/Math.hypot(p.x-x,p.z-z);p.x=x+(p.x-x)*n;p.z=z+(p.z-z)*n}jump.frame(dt);if(i<3&&!charged&&near(avatar,x+.85,z-.65,.9)&&jump.height()>.65){charged=true;platforms[i].charge.visible=false;fx(x+.85,2.2,z-.65,'#ffe6a6',16);say('Kapasitor terisi!');report()}}}
 context(flight?'Dorongan aktif':i===3?'E · Aktifkan gerbang langit':charged&&near(avatar,centers[i][0],centers[i][1],1.4)?'E · Luncurkan vektor':!charged?'SPACE · Ambil kapasitor':'');cameraFollow(avatar,13,9)};
}
function boss(){
 W.reset('#24213e','#4e3862',.018);base(23,24,'#525677');
 for(let i=-5;i<=5;i++){W.box(.035,.017,20,'#9ba8c4',i*2,.014,0);W.box(20,.017,.035,'#9ba8c4',0,.014,i*2);if(i%2===0){W.label(String(i),i*2,.2,10.6).scale.set(1,.27,1);W.label(String(-i),-10.7,.2,i*2).scale.set(1,.27,1)}}
 W.box(.11,.025,20.5,'#c3def4',0,.04,0);W.box(20.5,.025,.11,'#c3def4',0,.04,0);W.label('+X',10.7,.65,0);W.label('+Y',0,.65,-10.6);
 let guardian=W.group(0,0,-13);let body=W.mesh(new T.IcosahedronGeometry(2,0),'#8d80c5',0,3.2,0,guardian);let head=W.mesh(new T.IcosahedronGeometry(1.1,0),'#b7a3d8',0,5.05,.25,guardian);for(let s of [-1,1]){W.gem(.23,'#ffb1c9',s*.43,5.05,1.22,guardian);let horn=W.cone(.32,1.1,'#c7b6e8',s*.8,6.0,0,guardian);horn.rotation.z=s*-.45;let wing=W.group(s*1.55,3.65,0,guardian);let o=W.mesh(new T.BoxGeometry(2.7,.17,1.45),'#7265a1',s*1.1,0,0,wing);o.rotation.z=s*.36;W.gem(.43,'#ffc9d8',s*2.7,2.55,.45,guardian)}let bossCore=W.gem(.8,'#ff9ccc',0,3.4,1.8,guardian);
 avatar=hero(0,0);let jump=jumpController(avatar);jumpFn=()=>jump.jump();let phase=0,hp=3,remaining=15,scan=0,charges=2,flash=0,locked=false,tiles=[];
 // Sample the continuous region on a fine grid for scan visualization only.
 for(let x=-5;x<=5;x+=.5)for(let y=-5;y<=5;y+=.5){let [a,b]=toWorld(x,y),o=W.box(.95,.025,.95,'#8decc6',a,.065,b,W.root,.15);o.visible=false;tiles.push({x,y,o})}
 function display(){let w=waves[phase];mission(w.name,w.formula,phase===4?'Empat pelindung harus aktif bersamaan. '+w.hint:'Serangan '+w.source+'. '+w.hint+' Bergerak ke daerah aman sebelum waktu habis.');for(let t of tiles){t.o.material.color.set(w.color);t.o.material.emissive.set(w.color)}}
 function scanNow(){if(locked||charges<=0){say('Scan habis untuk serangan ini.',false);return}charges--;scan=2.4;say('Pemindaian daerah aman')}
 actionFn=scanNow;button('Scan daerah aman [E]',scanNow);button('Lihat empat syarat',()=>{if(phase!==4){say('Syarat serangan saat ini ada di atas.');return}mission(waves[phase].name,waves.slice(0,4).map(w=>w.formula).join('\n'),'Penuhi keempat syarat sekaligus sebelum waktu habis.')});display();$('act').textContent='SCAN [E]';
 function impact(){locked=true;flash=1.8;let [x,y]=fromWorld(avatar.g.position.x,avatar.g.position.z);if(safe(phase,x,y)){fx(0,4,-12,'#ffd0f1',38);say('Shield aktif! Guardian kehilangan energi.');bossCore.scale.setScalar(Math.max(.2,1-phase*.16));phase++;if(phase===waves.length){fx(avatar.g.position.x,1,avatar.g.position.z,'#c4ffe6',42);finish();return}}else{hp--;fx(avatar.g.position.x,1,avatar.g.position.z,'#ffa4bc',24);say('Serangan mengenai pemain. Coba lagi!',false);if(hp===0){hp=3;avatar.g.position.set(0,0,0);jump.reset();say('Energi pulih di checkpoint serangan.',false)}}}
 let visualPhase=0;
 phaseFn=(dt,run)=>{body.rotation.y=Math.sin(W.t*.55)*.18;head.position.y=5.05+Math.sin(W.t*1.5)*.15;bossCore.rotation.y+=dt;guardian.position.y=.1+Math.sin(W.t*1.3)*.13;if(run){if(!locked){walk(avatar,dt,[-10,10,-10,10],7);jump.frame(dt);remaining=Math.max(0,remaining-dt);scan=Math.max(0,scan-dt);if(remaining<=0){visualPhase=phase;impact()}}else{flash=Math.max(0,flash-dt);if(flash===0&&phase<waves.length){locked=false;remaining=phase===4?23:15;charges=2;scan=0;display()}}}
 let show=scan>0||flash>0;for(let t of tiles)t.o.visible=show&&safe(flash>0?visualPhase:Math.min(phase,4),t.x,t.y);let [x,y]=fromWorld(avatar.g.position.x,avatar.g.position.z);let p=Math.min(phase,4);status('Serangan '+Math.min(phase+1,5)+'/5 · Guardian '+Math.max(0,5-phase)+'/5\nEnergi '+('♥ '.repeat(hp))+' · Scan '+charges+'\nPosisi ('+x.toFixed(2)+', '+y.toFixed(2)+')');meter(remaining/(p===4?23:15)*100,locked?'Gelombang serangan':remaining.toFixed(1)+' detik sebelum serangan');context(locked?'Gelombang sedang berlalu':remaining<4?'⚠ Serangan segera datang':'');cameraFollow(avatar,12,10)};
}
function openMap(id=null){W.keys.clear();W.pad.clear();$('links').replaceChildren();for(let w of worlds){let a=document.createElement('a');a.href='../'+w.id+'/index.html';a.target='_blank';a.rel='noopener';a.textContent=w.title;let span=document.createElement('span');span.textContent=w.topic;a.append(span);if(id===w.id)a.style.borderColor='#99f6da';$('links').append(a)}$('worldMap').showModal()}
$('map').onclick=()=>openMap();$('closeMap').onclick=()=>{$('worldMap').close();W.keys.clear();W.pad.clear()};$('hub').onclick=()=>{if(!dialogOpen())setStage(-1)};$('returnHub').onclick=()=>{$('transition').close();setStage(-1)};$('sound').onclick=()=>{muted=!muted;$('sound').textContent=muted?'♪̸':'♫'};$('begin').onclick=()=>{$('welcome').close();setStage(-1);$('hud').hidden=false};$('resume').hidden=checkpoint===0||completed;$('resume').onclick=()=>{$('welcome').close();$('hud').hidden=false;setStage(checkpoint)};
for(let id of ['welcome','transition','worldMap'])$(id).addEventListener('cancel',e=>e.preventDefault());
W.action=()=>{}; // action and jump use independent key bindings in this game.
addEventListener('keydown',e=>{if(!playing()||e.repeat)return;if(e.code==='KeyE'){e.preventDefault();actionFn()}if(e.code==='Space'){e.preventDefault();jumpFn()}});
$('act').onclick=()=>{if(playing())actionFn()};$('jump').onclick=()=>{if(playing())jumpFn()};
W.update=dt=>{phaseFn(dt,playing());for(let i=particles.length-1;i>=0;i--){let p=particles[i];p.life-=dt;p.v.y-=8*dt;p.m.position.addScaledVector(p.v,dt);p.m.rotation.y+=dt*5;if(p.life<=0){W.root.remove(p.m);p.m.geometry.dispose();p.m.material.dispose();particles.splice(i,1)}}};
setStage(-1);active=false;$('welcome').showModal();document.body.classList.add('ready');
