import {W,T,$,clamp,ui,fx,win,start,ground,tree,camera,label,hitObject} from './common.js';
import {levels,farmBest,farmScore} from './levels.mjs';
start({levels:levels['harvest-kingdom'],build(m){
 W.reset('#bce6f5','#87ad89',.02);ground(27,24,'#8cc88b');for(let i=0;i<8;i++){tree(-12,-10+i*2.8);tree(12,-10+i*2.8)}
 let barn=W.group(0,0,-9);W.box(5,3.1,3.4,'#e0aa82',0,1.55,0,barn);let roof=W.cone(3.8,1.9,'#b76d61',0,3.9,0,barn);roof.rotation.y=Math.PI/4;W.box(1.3,2.1,.12,'#755c63',0,1.05,1.78,barn);label('HARVEST MARKET',0,5.2,0,barn);
 let avatar=W.avatar(0,0,7,'#4fae8b'),plots=[];let cols=4;for(let i=0;i<m.plots;i++){let x=(i%cols-1.5)*4.1,z=Math.floor(i/cols)*4.7-1.3,g=W.group(x,0,z);let pad=W.box(3.35,.24,3.35,'#8b6956',0,.12,0,g);pad.userData.index=i;for(let j=0;j<4;j++)W.box(.04,.06,3,'#c6a27e',-1.18+j*.78,.28,0,g);let plants=W.group(0,.22,0,g);plots.push({g,pad,plants,type:-1,growth:0})}
 let kind=0,near=-1,working=false,elapsed=0,locked=false;
 const count=()=>[plots.filter(p=>p.type===0).length,plots.filter(p=>p.type===1).length];
 const water=()=>{let [a,b]=count();return a*m.a.w+b*m.b.w};
 const report=()=>{let [a,b]=count();ui.status('Wortel '+a+' · Jagung '+b+' · Air '+water()+'/'+m.water+' · Nilai '+farmScore(m,a,b));ui.meter(100*water()/m.water,'Air terpakai')};
 ui.mission('Rancang kebun paling menguntungkan','Maks Z = '+m.a.v+'x + '+m.b.v+'y | '+m.a.w+'x + '+m.b.w+'y ≤ '+m.water+' | x+y ≤ '+m.plots,'Pilih bibit, jalan ke petak dan tekan E, atau ketuk langsung petaknya. Petak terisi dapat dikosongkan dengan E/ketuk. Maksimalkan keuntungan; panen setelah rencana siap.');
 ui.movement(true,'Tanam / cabut [E]');let chooseA=ui.button('🥕 Wortel: air '+m.a.w+' / nilai '+m.a.v,()=>{kind=0;pick()});let chooseB=ui.button('🌽 Jagung: air '+m.b.w+' / nilai '+m.b.v,()=>{kind=1;pick()});function pick(){chooseA.style.opacity=kind===0?'1':'.55';chooseB.style.opacity=kind===1?'1':'.55'}pick();
 ui.button('Panen dan jual',()=>{if(working)return;let [a,b]=count();if(!a&&!b){ui.notify('Tanam dahulu.',false);return}working=true;elapsed=0;ui.notify('Panen sedang berjalan!')});
 function plant(i){if(i<0||working||locked)return;let p=plots[i];if(p.type!==-1){p.type=-1;p.plants.clear();report();return}if(water()+[m.a,m.b][kind].w>m.water){ui.notify('Air tidak cukup. Cabut tanaman dahulu.',false);return}
 p.type=kind;p.growth=.08;for(let z of [-.8,.8])for(let x of [-.8,.8]){let g=W.group(x,0,z,p.plants);W.cyl(.07,.1,.8,'#67a873',0,.4,0,g);W.ball(.23,'#93d38a',-.18,.7,0,g);W.ball(.23,'#85c879',.18,.7,0,g);let fruit=kind===0?W.cone(.18,.55,'#ff9a59',0,.28,.12,g):W.cyl(.13,.15,.52,'#ffdd77',0,.7,.1,g);if(kind===0)fruit.rotation.z=Math.PI;g.scale.setScalar(.15)}fx(p.g.position.x,.4,p.g.position.z,'#b4f1a2',7);report()}
 report();
 return {action:()=>plant(near),tap:ray=>{let o=hitObject(ray,plots.map(p=>p.pad));if(o)plant(o.userData.index)},frame(dt,active){if(active){if(!working)W.walk(avatar,dt,[-10.7,10.7,-7,9],6.2);near=plots.findIndex(p=>p.g.position.distanceTo(avatar.g.position)<2.05);for(let i=0;i<plots.length;i++){let p=plots[i];p.pad.material.color.set(i===near?'#b98e69':'#8b6956');if(p.type>=0){p.growth=clamp(p.growth+dt*.9,.08,1);for(let g of p.plants.children)g.scale.setScalar(p.growth)}}if(working){elapsed+=dt;if(elapsed>=1.8){working=false;let [a,b]=count(),score=farmScore(m,a,b),best=farmBest(m);if(score===best){for(let p of plots)if(p.type!==-1)fx(p.g.position.x,.8,p.g.position.z,'#ffdf7c',10);win('Panen optimum! Z = '+score)}else ui.notify('Pendapatan '+score+'. Maksimum yang mungkin '+best+'. Perbaiki kebun.',false)}}}
 camera(0,0,0,18,17)
 }}
}});
