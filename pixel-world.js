/* Illustrated game world. Artwork is separate from content and interactive controls. */
function pulseElement(element,className) {
  if(!element || motionPaused)return;
  element.classList.remove(className);
  requestAnimationFrame(()=>element.classList.add(className));
}
function skyCompanionHTML(extra='') {
  return `<span class="sky-cat ${extra}" role="img" aria-label="하늘색 스카프와 별 장식을 한 밤하늘 고양이"><img src="assets/sky-cat.png" alt="" decoding="async"></span>`;
}
const traitIcons=['network','loop','game','result'];
const traitNames=['CO-OP','REPLAY','MOMENT','FEEDBACK'];
// Links use existing project records; these are connections to an aspiration, not claimed results.
function traitProjects(index) {
  const ids=[['cops-catch','chaos-arena'],['gn-banc','shadow-core-defense'],['cops-catch','chaos-arena'],['gn-banc','shadow-core-defense']][index] || [];
  return ids.map(id=>DATA.projects.find(p=>projectId(p)===id)).filter(Boolean);
}
function traitPanelHTML(index) {
  const pair=DATA.playPhilosophy[index];if(!pair)return '';
  const projects=traitProjects(index);
  return `<div class="trait-insignia" aria-hidden="true"><i></i><span>${uiIcon(traitIcons[index%4])}</span><b>${traitNames[index%4]}</b></div><div class="trait-description"><span class="eyebrow">선택한 특성 / ${String(index+1).padStart(2,'0')}</span><h4>${headingHTML(pair[0])}</h4><p>${escapeHTML(pair[1])}</p><span class="trait-related-label">연결해서 볼 개발 기록</span><div class="trait-projects">${projects.map(p=>`<a href="${projectHref(p)}"><img src="${escapeHTML(safeMedia(p.thumb))}" alt="" loading="lazy"><span><b>${headingHTML(p.title)}</b><small>${escapeHTML(p.cardRole || p.role || '')}</small></span><i aria-hidden="true">↗</i></a>`).join('') || '<span>이 특성을 바탕으로 다음 게임을 고민하고 있습니다</span>'}</div></div>`;
}
function traitDeckHTML(prefix) {
  if(!DATA.playPhilosophy.length)return '';
  return `<div class="trait-console" data-trait-console="${prefix}"><div class="trait-console-bar"><span>${uiIcon('game')} PLAY STYLE</span><span>나의 개발 특성</span></div><div class="trait-console-body"><div class="trait-slots" role="tablist" aria-label="만들고 싶은 재미 선택">${DATA.playPhilosophy.map(([title],i)=>`<button type="button" role="tab" id="${prefix}-trait-${i}" data-trait="${i}" aria-selected="${i===0}" tabindex="${i===0?'0':'-1'}" aria-controls="${prefix}-trait-panel"><span class="trait-key">${String(i+1).padStart(2,'0')}</span><span class="trait-glyph">${uiIcon(traitIcons[i%4])}</span><span><b>${headingHTML(title)}</b><small>${traitNames[i%4]}</small></span><i class="trait-chosen" aria-hidden="true">◆</i></button>`).join('')}</div><div class="trait-panel" id="${prefix}-trait-panel" role="tabpanel" aria-labelledby="${prefix}-trait-0" tabindex="0">${traitPanelHTML(0)}</div></div><div class="console-help"><span>← → 특성 선택</span><span>개발 기록을 누르면 프로젝트로 이동</span></div></div>`;
}
function selectTrait(console,index,focus=false) {
  const tabs=Array.from(console.querySelectorAll('[data-trait]'));
  if(!tabs[index])return;
  tabs.forEach((tab,i)=>{tab.setAttribute('aria-selected',String(i===index));tab.tabIndex=i===index?0:-1;});
  const panel=console.querySelector('.trait-panel');
  panel.innerHTML=traitPanelHTML(index);panel.setAttribute('aria-labelledby',tabs[index].id);
  pulseElement(panel,'trait-equipped');
  if(focus)tabs[index].focus({preventScroll:true});
}
let worldJourney=null,worldPosition=null,worldGeneration=0,worldSpacing=240;
function worldPoint(index) { return {x:120+index*worldSpacing,y:index%2?183:146}; }
function islandType(project,index=0) { return {'cops-catch':0,'chaos-arena':1,'gn-banc':2,'shadow-core-defense':3}[projectId(project)] ?? index%4; }
function renderWorldMap() {
  worldSpacing=Math.max(205,($('gameTabs').clientWidth-240)/Math.max(1,carouselOrder.length-1));
  const width=Math.max(370,(carouselOrder.length-1)*worldSpacing+240);
  const points=carouselOrder.map((p,i)=>worldPoint(i));
  const path=points.map((p,i)=>i?` Q ${p.x-worldSpacing/2} ${p.y} ${p.x} ${p.y}`:`M ${p.x} ${p.y}`).join('');
  worldGeneration++;worldJourney?.cancel();worldJourney=null;worldPosition=null;
  $('gameTabs').innerHTML=`<div class="world-map-inner" style="width:${width}px"><svg class="world-road" viewBox="0 0 ${width} 305" aria-hidden="true"><path class="road-shadow" d="${path}"/><path class="road-line" d="${path}"/></svg>${carouselOrder.map((p,i)=>{const pos=points[i];return `<button type="button" class="world-node" data-featured="${p===featuredProject()}" data-game-index="${i}" aria-label="${escapeHTML(p.title)} 선택" aria-pressed="${i===carouselIndex}" style="--node-x:${pos.x}px;--node-y:${pos.y}px;--float-delay:-${i*1.3}s"><span class="island-number">${p===featuredProject()?'★':String(i+1).padStart(2,'0')}</span><span class="island-art island-${islandType(p,i)}" aria-hidden="true"></span><span class="island-ripple" aria-hidden="true"></span><span class="island-title">${headingHTML(p.title)}</span><small class="island-note">${escapeHTML(p.team || p.genre || '')}</small></button>`;}).join('')}<span class="world-traveler" id="worldTraveler" aria-hidden="true"><img src="assets/sky-cat.png" alt=""><i></i></span></div>`;
}
function travelToGame(index,onarrival) {
  const map=$('gameTabs'),traveler=$('worldTraveler'),end=worldPoint(index),generation=++worldGeneration;
  if(worldJourney&&traveler){const matrix=new DOMMatrixReadOnly(getComputedStyle(traveler).transform);worldPosition={x:matrix.m41+22,y:matrix.m42+51};}
  worldJourney?.cancel();worldJourney=null;
  const start=worldPosition || end;
  const selected=map.querySelectorAll('[data-game-index]')[index];
  if(selected)map.scrollTo({left:Math.max(0,end.x-map.clientWidth/2),behavior:motionPaused?'instant':'smooth'});
  const pose=p=>`translate3d(${p.x-22}px,${p.y-51}px,0)`;
  function arrive() {
    if(generation!==worldGeneration)return;
    worldPosition=end;traveler.style.transform=pose(end);traveler.classList.remove('is-traveling');
    $('gameSelector').classList.remove('is-traveling');
    onarrival();pulseElement(selected,'is-arriving');
  }
  if(!traveler){onarrival();return;}
  if(!worldPosition || motionPaused || (start.x===end.x&&start.y===end.y)){arrive();return;}
  traveler.classList.add('is-traveling');$('gameSelector').classList.add('is-traveling');
  // A curved path and a slight hop communicate travel, rather than teleporting between thumbnails.
  const frames=Array.from({length:25},(_,i)=>{const t=i/24;return {transform:pose({x:start.x+(end.x-start.x)*t,y:start.y+(end.y-start.y)*t-Math.sin(Math.PI*t)*34}),offset:t};});
  worldPosition=end;
  const animation=traveler.animate(frames,{duration:620,easing:'cubic-bezier(.3,0,.2,1)',fill:'forwards'});
  worldJourney=animation;
  animation.finished.then(()=>{arrive();animation.cancel();if(worldJourney===animation)worldJourney=null;}).catch(()=>{});
}
// Keep routes immediate; the illustrated world does not fade away when opening a record.
function enterBaseDoor(source,finish) { finish(); }
let gameSystemsBound=false;
function initGameSystems() {
  if(gameSystemsBound)return;gameSystemsBound=true;
  const scene=document.querySelector('.scene-motes');
  if(scene)scene.innerHTML=Array.from({length:12},(_,i)=>`<i style="--mote-x:${15+(i*17)%78}%;--mote-y:${12+(i*11)%60}%;--mote-delay:-${i*.8}s;--mote-duration:${4+i%4}s"></i>`).join('');
  if(typeof ResizeObserver!=='undefined'){
    let width=$('gameTabs').clientWidth,pending=0;
    new ResizeObserver(()=>{const next=$('gameTabs').clientWidth;if(!next||Math.abs(next-width)<2)return;width=next;cancelAnimationFrame(pending);pending=requestAnimationFrame(()=>{renderWorldMap();if(carouselOrder.length)travelToGame(carouselIndex,()=>{const project=carouselOrder[carouselIndex];if($('featuredGame').dataset.project!==projectId(project))renderSelectedGame(project);});});}).observe($('gameTabs'));
  }
  document.addEventListener('click',event=>{const tab=event.target.closest('[data-trait]');if(tab)selectTrait(tab.closest('[data-trait-console]'),Number(tab.dataset.trait));});
  document.addEventListener('keydown',event=>{
    const tab=event.target.closest('[data-trait]');if(!tab || !['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','End'].includes(event.key))return;
    event.preventDefault();const console=tab.closest('[data-trait-console]'),n=console.querySelectorAll('[data-trait]').length;
    const index=event.key==='Home'?0:event.key==='End'?n-1:(Number(tab.dataset.trait)+(/Left|Up/.test(event.key)?-1:1)+n)%n;
    selectTrait(console,index,true);
  });
  const hero=$('featured');let frame=0,last={x:0,y:0};
  hero.addEventListener('pointermove',event=>{if(event.pointerType!=='mouse'||motionPaused)return;const b=hero.getBoundingClientRect();last={x:(event.clientX-b.left)/b.width-.5,y:(event.clientY-b.top)/b.height-.5};if(frame)return;frame=requestAnimationFrame(()=>{frame=0;hero.style.setProperty('--scene-x',last.x);hero.style.setProperty('--scene-y',last.y);});},{passive:true});
  hero.addEventListener('pointerleave',()=>{hero.style.setProperty('--scene-x',0);hero.style.setProperty('--scene-y',0);},{passive:true});
  document.addEventListener('visibilitychange',()=>document.documentElement.classList.toggle('scene-asleep',document.hidden));
}
function stopGameMotion() {
  if(worldJourney)worldJourney.finish();
  const hero=$('featured');if(hero){hero.style.setProperty('--scene-x',0);hero.style.setProperty('--scene-y',0);}
}
