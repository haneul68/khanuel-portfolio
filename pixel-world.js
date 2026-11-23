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
function islandType(project,index=0) { return {'cops-catch':0,'chaos-arena':1,'gn-banc':2,'shadow-core-defense':3,'golden-apple':'golden-apple'}[projectId(project)] ?? index%4; }
function renderProjectRoster() {
  $('gameTabs').innerHTML=carouselOrder.map((p,i)=>`<button type="button" class="project-tile" data-game-index="${i}" data-featured="${p===featuredProject()}" aria-label="${escapeHTML(p.title)} 선택" aria-pressed="${i===carouselIndex}">${p===featuredProject()?'<span class="tile-featured">★ 대표 게임</span>':''}${projectIslandHTML(p)}<span class="project-tile-title">${headingHTML(p.title)}</span><span class="project-tile-meta">${uiIcon('network')} ${escapeHTML(p.team || '')}</span></button>`).join('');
}
// Keep routes immediate; the illustrated world does not fade away when opening a record.
function enterBaseDoor(source,finish) { finish(); }
let gameSystemsBound=false;
function initGameSystems() {
  if(gameSystemsBound)return;gameSystemsBound=true;
  const scene=document.querySelector('.scene-motes');
  if(scene)scene.innerHTML=Array.from({length:12},(_,i)=>`<i style="--mote-x:${15+(i*17)%78}%;--mote-y:${12+(i*11)%60}%;--mote-delay:-${i*.8}s;--mote-duration:${4+i%4}s"></i>`).join('');
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

  const hero=$('featured');if(hero){hero.style.setProperty('--scene-x',0);hero.style.setProperty('--scene-y',0);}
}
