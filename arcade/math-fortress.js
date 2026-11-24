import {W,T,$,clamp,ui,fx,win,start,ground,tree,camera,pulse,label,hitObject} from './common.js';
import {levels,sites,types,waveStep,newWave} from './levels.mjs';
start({levels:levels['math-fortress'],build(m){
 W.reset('#a8d6eb','#729c86',.016);ground(38,24,'#87ba8a');W.box(32,.07,3.3,'#cdb79c',0,.02,0);for(let x=-16;x<=16;x+=3)W.box(1,.02,.07,'#f8e7c9',x,.08,0);
 for(let x=-16;x<=16;x+=4){tree(x,-10);tree(x,10)}
 let base=W.group(16,0,0);W.box(3.4,3.6,4.8,'#aaa4b9',0,1.8,0,base);for(let z of [-2.6,2.6]){W.cyl(1.05,1.05,5.1,'#bfb8c9',0,2.55,z,base);W.cone(1.25,1.3,'#6b75ac',0,5.65,z,base)}W.box(1.3,2.5,.16,'#776782',-1.72,1.25,0,base).rotation.y=Math.PI/2;label('CITADEL',0,7,0,base);
 let pads=sites.map(([x,z],i)=>{let g=W.group(x,0,z),pad=W.cyl(.77,.9,.25,'#d3d9b7',0,.12,0,g);pad.userData.site=i;label(String(i+1),0,1.25,0,g);return {g,pad,tower:null,ring:null,type:null}});
 let choice=0,state=null,placements=[],enemyMeshes=new Map(),beams=[],running=false,time=0;
 function cost(){return placements.reduce((a,t)=>a+types[t.type].cost,0)}
 ui.mission('Defend the citadel','Pulse: r = 4,6; biaya 2 | Nova: r = 6,7; biaya 4','Pilih jenis menara lalu ketuk pad bernomor. Ketuk lagi untuk bongkar. Lingkaran menunjukkan radius. Anggaran '+m.budget+'. Tahan seluruh '+m.count+' monster agar tidak ada yang lolos.');
 ui.movement(false,'');let a=ui.button('Pulse · radius 4,6',()=>{choice=0;select()}),b=ui.button('Nova · radius 6,7',()=>{choice=1;select()});function select(){a.style.opacity=choice===0?'1':'.55';b.style.opacity=choice===1?'1':'.55'}select();
 let placeRow=document.createElement('div');placeRow.style.display='flex';placeRow.style.flexWrap='wrap';placeRow.style.gap='5px';for(let i=0;i<sites.length;i++){let btn=document.createElement('button');btn.className='site';btn.textContent=i+1;btn.onclick=()=>place(i);placeRow.append(btn)}$('controls').append(placeRow);
 ui.button('Mulai gelombang',()=>{if(running)return;if(!placements.length){ui.notify('Bangun menara dahulu.',false);return}state=newWave(placements);running=true;ui.notify('Gelombang dimulai!')});
 function report(){ui.status('Anggaran '+cost()+'/'+m.budget+(state?' · Kalahkan '+state.kills+'/'+m.count+' · Lolos '+state.leaks:''));ui.meter(state?100*(state.kills+state.leaks)/m.count:100*cost()/m.budget,state?'Gelombang musuh':'Anggaran terpakai')}
 function place(i){if(running)return;let p=pads[i];if(p.tower){p.g.remove(p.tower);W.root.remove(p.ring);p.tower=p.ring=null;p.type=null;placements=placements.filter(t=>t.site!==i);report();return}let type=types[choice];if(cost()+type.cost>m.budget){ui.notify('Anggaran tidak cukup.',false);return}
 let g=W.group(0,0,0,p.g);let c=choice?'#ffbb70':'#78bfff';W.cyl(.55,.72,1.8,'#76869b',0,.9,0,g);W.cyl(.73,.6,.34,c,0,1.85,0,g);W.gem(.4,c,0,2.22,0,g);p.tower=g;p.type=choice;p.ring=pulse(type.r,sites[i][0],sites[i][1],c);placements.push({site:i,type:choice});fx(sites[i][0],1,sites[i][1],c,9);report()}
 function clearWave(){for(let g of enemyMeshes.values())W.root.remove(g);enemyMeshes.clear();state=null;running=false;report()}
 report();
 return {tap:ray=>{let o=hitObject(ray,pads.map(p=>p.pad));if(o)place(o.userData.site)},frame(dt,active){time+=dt;if(active&&running){let shots=waveStep(m,state,dt);for(let e of state.enemies){if(!enemyMeshes.has(e.id)){let g=W.group(e.x,0,0);W.ball(.58,'#bd85ca',0,.62,0,g);W.box(.42,.13,.12,'#442b5d',.48,.72,0,g);W.ball(.15,'#ffcf82',.53,.8,.15,g);enemyMeshes.set(e.id,g)}let g=enemyMeshes.get(e.id);g.position.set(e.x,.08*Math.sin(time*9+e.id),0);g.scale.setScalar(.8+.2*e.hp/m.hp)}
 for(let [id,g] of enemyMeshes)if(!state.enemies.some(e=>e.id===id)){fx(g.position.x,.8,0,'#e9aef6',8);W.root.remove(g);enemyMeshes.delete(id)}
 for(let s of shots){let [x,z]=sites[s.site];let line=W.line([x,2.2,z],[s.x,.7,0],'#fff2b1',.055);beams.push({line,life:.1});W.tone()}
 if(state.spawn===m.count&&!state.enemies.length){running=false;if(!state.leaks)win('Benteng bertahan!');else{ui.notify(state.leaks+' monster lolos. Susun ulang pertahanan.',false);clearWave()}}report()}
 for(let i=beams.length-1;i>=0;i--){beams[i].life-=dt;if(beams[i].life<=0){W.root.remove(beams[i].line);beams[i].line.geometry.dispose();beams[i].line.material.dispose();beams.splice(i,1)}}
 camera(0,0,0,24,24)
 }}
}});
