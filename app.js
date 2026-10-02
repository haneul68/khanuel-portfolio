const STORAGE_KEY = 'khanuelPortfolioData';
const $ = id => document.getElementById(id);
const cloneDefaultData = () => JSON.parse(JSON.stringify(DEFAULT_DATA));
const projectId = project => project.id || String(project.title || '').toLowerCase().replace(/cops\s*catch/, 'cops-catch').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
function valueHash(value) {
  let hash = 2166136261;
  for (const char of JSON.stringify(value) || '') hash = Math.imul(hash ^ char.codePointAt(0), 16777619) >>> 0;
  return String(hash);
}
function mergeUntouched(base, saved, fingerprints = {}) {
  const merged = { ...base, ...saved };
  for (const key of Object.keys(base)) {
    if (saved[key] === undefined || valueHash(saved[key]) === fingerprints[key]) merged[key] = base[key];
  }
  return merged;
}
function mergeData(base, saved) {
  if (!saved || typeof saved !== 'object' || Array.isArray(saved)) return base;
  const legacy = !saved.schemaVersion || saved.schemaVersion < 5;
  const fingerprints = saved.schemaVersion === 4 ? REVISION4_FINGERPRINTS : saved.schemaVersion === 3 ? REVISION3_FINGERPRINTS : saved.schemaVersion === 2 ? REVISION2_FINGERPRINTS : LEGACY_FINGERPRINTS;
  const merged = legacy ? mergeUntouched(base, saved, fingerprints.profile) : { ...base, ...saved };
  merged.contact = { ...base.contact, ...(saved.contact || {}) };
  merged.projects = Array.isArray(saved.projects) ? saved.projects.filter(p => p && typeof p === 'object').map(p => {
    const current = base.projects.find(item => projectId(item) === projectId(p));
    if (!current || !legacy) return { ...p, id: projectId(p) };
    const baseline=fingerprints.projects[p.title] || {};
    const updated={ ...mergeUntouched(current,p,baseline), id:current.id };
    if(!p.previewMedia && ['sections','heroImage','thumb'].some(key=>p[key]!==undefined && valueHash(p[key])!==baseline[key])) {
      updated.previewMedia=(p.sections || []).find(s=>s.type==='showcase' && s.layout!=='case-study')?.blocks?.find(b=>b.kind==='media')?.media || p.heroImage || p.thumb || updated.previewMedia;
    }
    return updated;
  }) : base.projects;
  if (legacy && (!saved.schemaVersion || saved.schemaVersion < 2)) merged.featuredIndex = Math.max(0, merged.projects.findIndex(p => projectId(p) === 'cops-catch'));
  for (const key of ['skills','education','certificates','chips','profileLanguages','playPhilosophy','aboutStrengths','interests','activities','learning','workStyle']) if (!Array.isArray(merged[key])) merged[key] = base[key];
  const oldHeadings={aboutTitle:'플레이 감각을 코드로 구현하는 개발자',aboutDetailTitle:'함께 즐기는 게임 경험을 설계하는 개발자'};
  for(const [key,old] of Object.entries(oldHeadings))if(merged[key]===old)merged[key]=base[key];
  merged.schemaVersion = 5;
  return merged;
}
function loadData() {
  try { return mergeData(cloneDefaultData(), JSON.parse(localStorage.getItem(STORAGE_KEY))); }
  catch { return cloneDefaultData(); }
}
function saveData(data) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); return true; }
  catch { return false; }
}
let DATA = loadData();
function projectMeta(project) {
  return [['담당', project.role], ['팀', project.team], ['플랫폼', project.platform], ['개발 기간', project.period], ['구현 범위', project.contribution]].filter(([, value]) => value);
}
function certificateDetail(item) {
  return typeof item === 'object' && item ? { name: item.title || item.name || '', issuer: item.issuer || '', date: item.date || '', desc: item.desc || '' } : { name: String(item || ''), issuer: '', date: '', desc: '' };
}
function applyTheme() {
  if (/^#[0-9a-f]{6}$/i.test(DATA.theme)) document.documentElement.style.setProperty('--primary', DATA.theme);
  if (/^#[0-9a-f]{6}$/i.test(DATA.accent)) document.documentElement.style.setProperty('--accent', DATA.accent);
  document.documentElement.style.setProperty('--card-radius', `${Math.max(0, Math.min(24, Number(DATA.radius) || 8))}px`);
  document.body.dataset.background = DATA.background || 'night';
}
function safeMedia(url) {
  return typeof url === 'string' && (/^assets\/[\w./-]+$/.test(url) || /^https?:\/\//i.test(url) || /^data:(image\/(png|jpeg|gif|webp)|video\/(mp4|webm));base64,/i.test(url)) ? url : '';
}
const linkHTML = (link, className='') => link.available !== false && isUsableExternalLink(link.url) ? `<a class="${className}" href="${escapeHTML(link.url)}" target="_blank" rel="noopener noreferrer">${escapeHTML(link.label)} <span aria-hidden="true">↗</span></a>` : '';
const tagsHTML = tags => `<div class="tags">${(tags || []).map(tag => `<span>${escapeHTML(tag)}</span>`).join('')}</div>`;
const projectHref = (project, section) => `#project/${projectId(project)}${section ? '/'+section : ''}`;
let mediaSerial = 0;
let motionPaused = false;
let reducedMotion;
function mediaHTML(url, alt='', eager=false) {
  url = safeMedia(url);
  if (!url) return '';
  if (isVideoUrl(url)) return `<video src="${escapeHTML(url)}" aria-label="${escapeHTML(alt)}" controls playsinline preload="metadata"></video>`;
  const animated = /\.(gif|webp)(?:$|[?#])/i.test(url);
  if (!animated) return `<img src="${escapeHTML(url)}" alt="${escapeHTML(alt)}" loading="${eager ? 'eager' : 'lazy'}" decoding="async">`;
  const id = `capture-${++mediaSerial}`;
  return `<div class="motion-media${motionPaused ? ' is-paused' : ''}" id="${id}"><img src="${escapeHTML(url)}" data-motion-src="${escapeHTML(url)}" alt="${escapeHTML(alt)}" loading="${eager ? 'eager' : 'lazy'}" decoding="async"><canvas role="img" aria-label="${escapeHTML(alt)} · 정지 화면" hidden></canvas><button class="media-toggle" type="button" aria-controls="${id}" aria-label="${escapeHTML(alt)} ${motionPaused ? '재생' : '정지'}" data-media-toggle>${motionPaused ? '▶ 재생' : 'Ⅱ 정지'}</button></div>`;
}
function freezeMedia(frame) {
  const img = frame.querySelector('img');
  if (!img.complete || !img.naturalWidth) return;
  const canvas = frame.querySelector('canvas');
  canvas.width = img.naturalWidth; canvas.height = img.naturalHeight;
  canvas.getContext('2d').drawImage(img, 0, 0);
  canvas.hidden = false; img.hidden = true;
}
function setMediaPaused(frame, paused) {
  const img = frame.querySelector('img');
  frame.classList.toggle('is-paused', paused);
  if (paused) freezeMedia(frame);
  else { img.hidden = false; frame.querySelector('canvas').hidden = true; }
  const button = frame.querySelector('button');
  button.textContent = paused ? '▶ 재생' : 'Ⅱ 정지';
  button.setAttribute('aria-label', `${img.alt} ${paused ? '재생' : '정지'}`);
}
function initMedia(root=document) {
  root.querySelectorAll('.motion-media:not([data-ready])').forEach(frame => {
    frame.dataset.ready = 'true';
    const img = frame.querySelector('img');
    img.addEventListener('load', () => { if (frame.classList.contains('is-paused')) freezeMedia(frame); });
    if (frame.classList.contains('is-paused')) freezeMedia(frame);
  });
}
function setMotionPaused(paused) {
  motionPaused = paused;
  if(paused)stopGameMotion();
  document.documentElement.classList.toggle('reduce-motion', paused);
  document.querySelectorAll('.motion-media').forEach(frame => setMediaPaused(frame, paused));
  if (paused) document.querySelectorAll('video').forEach(video => video.pause());
  $('motionToggle').textContent = paused ? '움직임 켜기' : '움직임 끄기';
  $('motionToggle').setAttribute('aria-pressed', String(paused));
  scheduleCarousel();
}
function featuredProject() { return DATA.projects[DATA.featuredIndex] || DATA.projects.find(p => projectId(p) === 'cops-catch') || DATA.projects[0]; }
const cleanTitle = value => String(value || '').replace(/[.。]+(?=\s*$)/gm,'');
const headingHTML = value => escapeHTML(cleanTitle(value));
function overviewMedia(project) {
  const defaults={'cops-catch':'assets/project-cops-catch-overview.webp','chaos-arena':'assets/project-chaos-battle-scene.webp','gn-banc':'assets/project-gn-banc-combat-flow.webp','shadow-core-defense':'assets/project-shadow-core-defense-gameplay-overview.webp'};
  // Custom project media retains precedence over the built-in footage.
  return project.previewMedia || (project.sections || []).find(s=>s.type==='showcase' && s.layout!=='case-study')?.blocks?.find(b=>b.kind==='media')?.media || defaults[projectId(project)] || project.heroImage || project.thumb;
}
function projectPreviewHTML(project) {
  const media=overviewMedia(project);
  if(projectId(project)==='gn-banc' && media==='assets/project-gn-banc-combat-flow.webp') {
    return `<div class="portrait-pair">${mediaHTML(media,'GN Banc 자동 전투',true)}${mediaHTML('assets/project-gn-banc-hero-upgrade.webp','GN Banc 영웅 성장',true)}</div>`;
  }
  return mediaHTML(media,`${project.title} 실제 플레이`,true);
}
function renderSite() {
  if (!$('featuredGame')) return;
  applyTheme();
  $('brandText').textContent=DATA.brand;
  $('heroTitle').innerHTML=headingHTML(DATA.heroTitle).split('\n').map((line,i)=>`<span${i===0?' class="together-word"':''}>${line}</span>`).join('');
  $('heroSubtitle').textContent=cleanTitle(DATA.heroSubtitle);
  $('heroDesc').textContent=DATA.desc;
  $('profilePhoto').src=safeMedia(DATA.profileAvatar) || 'assets/profile-photo.jpg';
  $('aboutPhoto').src=$('profilePhoto').src;
  $('heroProfilePhoto').src=$('profilePhoto').src;
  $('heroProfileName').textContent=DATA.name==='KIM HANEUL'?'김하늘':DATA.name;
  $('heroProfileRole').textContent=DATA.role;
  document.querySelectorAll('[data-ui-icon]').forEach(el=>el.innerHTML=uiIcon(el.dataset.uiIcon));
  $('heroMascot').innerHTML=mascotHTML();$('profileMascot').innerHTML=mascotHTML();
  $('introTitle').innerHTML=`${headingHTML(DATA.name==='KIM HANEUL'?'김하늘':DATA.name)}<span>${headingHTML(DATA.role)}</span>`;
  $('profileChips').innerHTML=tagsHTML(DATA.chips);
  $('aboutTitle').textContent=cleanTitle(DATA.aboutTitle);
  $('aboutText').textContent=DATA.aboutText;
  $('philosophyGrid').innerHTML=traitDeckHTML('home');
  $('homeJournal').innerHTML=DATA.education.map((line,i)=>`<a class="journal-card game-panel" href="#profile/journey"><span class="save-icon">${uiIcon(i===0?'learn':i===1?'code':'network')}</span><span class="journal-copy"><small>RECORD / ${String(i+1).padStart(2,'0')}</small><b>${escapeHTML(line)}</b></span><span aria-hidden="true">↗</span></a>`).join('');
  $('workStyle').innerHTML=(DATA.workStyle || []).map((line,i)=>`<p class="work-step"><span>0${i+1}</span>${escapeHTML(line)}</p>`).join('');
  $('aboutGoal').textContent=DATA.aboutGoal;
  renderEquipment();
  $('contactCards').innerHTML=`${DATA.contact.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(DATA.contact.email)?`<a class="contact-email" href="mailto:${escapeHTML(DATA.contact.email)}">${escapeHTML(DATA.contact.email)} <span aria-hidden="true">↗</span></a>`:''}<div class="contact-links">${linkHTML({label:'GitHub',url:DATA.contact.github},'text-link')}${linkHTML({label:'Steam',url:DATA.contact.steam},'text-link')}</div>`;
  $('year').textContent=new Date().getFullYear();
  initCarousel();initMedia();initGameSystems();
}
let carouselOrder=[],carouselIndex=0,carouselTimer=null,carouselPaused=false,carouselHovered=false,carouselFocused=false,carouselVisible=false;
function carouselBlocked() {return !carouselVisible || carouselPaused || motionPaused || carouselHovered || carouselFocused || document.hidden || document.body.dataset.view!=='home';}
function scheduleCarousel() {
  clearTimeout(carouselTimer);
  const stopped=carouselBlocked();
  const bar=$('carouselProgress');if(bar){bar.style.animation='none';void bar.offsetWidth;bar.style.animation='carousel-countdown 8s linear both';bar.style.animationPlayState=stopped?'paused':'running';}
  $('gameSelector')?.classList.toggle('is-holding',Boolean(stopped));
  if(carouselOrder.length>1 && !stopped)carouselTimer=setTimeout(()=>selectGame(carouselIndex+1),8000);
}
function renderSelectedGame(p) {
  const host=$('featuredGame');host.hidden=false;host.dataset.ready='true';host.dataset.project=projectId(p);
  const featured=p===featuredProject(),number=String(carouselIndex+1).padStart(2,'0');
  host.innerHTML=`<article class="selected-game expedition-preview" data-game="${projectId(p)}" data-featured="${featured}" role="group" aria-roledescription="슬라이드" aria-label="${carouselIndex+1} / ${carouselOrder.length} ${escapeHTML(p.title)}"><header class="destination-bar"><span class="destination-marker">${uiIcon('game')}</span><div><span class="eyebrow">${featured?'FEATURED PROJECT':'SELECTED PROJECT'} / ${number}</span><h3>도착했으니, 한 판 구경할까요?</h3></div><a href="#projects" class="back-to-map">지도에서 다시 고르기 <span aria-hidden="true">↑</span></a></header><div class="destination-content"><div class="playback-bay"><div class="playback-panel-head"><span><i class="live-mark" aria-hidden="true"></i> 실제 플레이</span><span>${escapeHTML(p.platform || '')} / GAMEPLAY</span></div><div class="game-screen">${projectPreviewHTML(p)}</div><div class="playback-caption"><span>${uiIcon('game')} ${escapeHTML(p.genre || '')}</span><span>PLAY CAPTURE</span></div></div><div class="selected-info"><span class="destination-stamp">${featured?'★ 대표 게임':'GAME / '+number}</span><h2>${headingHTML(p.title)}</h2><p class="selected-lead">${headingHTML(p.lead || p.teaser || p.summary).replace(/\n/g,' ')}</p><div class="destination-facts"><span>${uiIcon('network')} ${escapeHTML(p.team || '')}</span><span>${uiIcon('game')} ${escapeHTML(p.platform || '')}</span></div><div class="role-loadout"><span class="role-emblem" aria-hidden="true">${uiIcon('code')}</span><div><span class="eyebrow">이 게임에서 맡은 일</span><p>${escapeHTML(p.cardRole || p.contribution || '')}</p></div></div><div class="destination-tech">${tagsHTML(p.tags)}</div>${p.summary?`<p class="destination-summary">${escapeHTML(p.summary)}</p>`:''}<a class="game-enter" href="${projectHref(p)}" aria-label="${escapeHTML(p.title)} 개발 이야기 보기"><span class="enter-icon" aria-hidden="true">${uiIcon('learn')}</span><span>이 게임의 개발 이야기<small>구현 · 문제 해결 · 배운 점</small></span><b aria-hidden="true">↗</b></a></div></div></article>`;
  initMedia(host);pulseElement(host,'preview-ready');
}
function selectGame(index,manual=false) {
  if(!carouselOrder.length)return;
  $('gameSelector').style.setProperty('--slide-direction',index<carouselIndex?-1:1);
  carouselIndex=(index+carouselOrder.length)%carouselOrder.length;
  const p=carouselOrder[carouselIndex];
  $('gameSelector').dataset.game=projectId(p);
  travelToGame(carouselIndex,()=>renderSelectedGame(p));
  $('carouselCount').textContent=`${String(carouselIndex+1).padStart(2,'0')} / ${String(carouselOrder.length).padStart(2,'0')}`;
  $('gameTabs').querySelectorAll('button').forEach((button,i)=>{button.setAttribute('aria-pressed',String(i===carouselIndex));});
  if(manual)$('carouselAnnouncement').textContent=`${p.title} 선택됨`;
  initMedia($('featuredGame'));scheduleCarousel();
}
function initCarousel() { renderLibrary(); }
function bindCarousel() {
  $('prevGame').addEventListener('click',()=>selectGame(carouselIndex-1,true));
  $('nextGame').addEventListener('click',()=>selectGame(carouselIndex+1,true));
  $('gameTabs').addEventListener('keydown',event=>{const b=event.target.closest('[data-game-index]');if(!b||!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;event.preventDefault();const n=carouselOrder.length;const i=event.key==='Home'?0:event.key==='End'?n-1:(Number(b.dataset.gameIndex)+(event.key==='ArrowLeft'?-1:1)+n)%n;selectGame(i,true);$('gameTabs').querySelectorAll('button')[i].focus({preventScroll:true});});
  $('gameTabs').addEventListener('click',event=>{const button=event.target.closest('[data-game-index]');if(button)selectGame(Number(button.dataset.gameIndex),true);});
  $('carouselToggle').addEventListener('click',()=>{carouselPaused=!carouselPaused;$('carouselToggle').textContent=carouselPaused?'▶ 자동 전환 켜기':'Ⅱ 자동 전환 끄기';$('carouselToggle').setAttribute('aria-pressed',String(carouselPaused));scheduleCarousel();});
  const selector=$('gameSelector');
  if(typeof IntersectionObserver!=='undefined')new IntersectionObserver(entries=>{const visible=entries.some(entry=>entry.isIntersecting);if(visible!==carouselVisible){carouselVisible=visible;scheduleCarousel();}},{threshold:0}).observe(selector);
  else carouselVisible=true;
  selector.addEventListener('pointerenter',event=>{if(event.pointerType==='mouse'){carouselHovered=true;scheduleCarousel();}});
  selector.addEventListener('pointerleave',()=>{carouselHovered=false;scheduleCarousel();});
  selector.addEventListener('focusin',()=>{carouselFocused=true;scheduleCarousel();});
  selector.addEventListener('focusout',event=>{if(!selector.contains(event.relatedTarget)){carouselFocused=false;scheduleCarousel();}});
  document.addEventListener('visibilitychange',scheduleCarousel);
}

function renderShowcaseSection(section) {
  if(['lessons','roadmap','outcome'].includes(section.layout)){
    const kind=section.layout,icon=kind==='lessons'?'learn':kind==='roadmap'?'upgrade':'result';
    return `<div class="reflection-grid ${kind}">${(section.blocks || []).map((b,i)=>`<article class="reflection-card"><div class="reflection-card-top"><span class="reflection-icon">${uiIcon(icon)}</span><span>${kind==='roadmap'?'NEXT':kind==='lessons'?'LEARNED':'BUILT'} / ${String(i+1).padStart(2,'0')}</span></div><h4>${headingHTML(b.title)}</h4><p>${escapeHTML(b.text)}</p>${b.caption?`<div class="reflection-caption">${escapeHTML(b.caption)}</div>`:''}</article>`).join('')}</div>`;
  }
  return `<div class="showcase-board ${section.layout==='case-study'?'case-study':'showcase-grid'}">${(section.blocks || []).map((block,i)=>`<div class="showcase-block ${block.kind==='media'?'is-media':'is-text'}" style="--block-index:${i}">${block.kind==='media'?`<figure>${mediaHTML(block.media,block.title)}<figcaption>${headingHTML(block.title)}</figcaption></figure>`:`<div class="note-label"><span aria-hidden="true">${String(i).padStart(2,'0')}</span><h4>${headingHTML(block.title)}</h4></div>`}${block.text?`<p>${escapeHTML(block.text)}</p>`:''}${block.caption?`<p class="caption">${escapeHTML(block.caption)}</p>`:''}</div>`).join('')}</div>`;
}
function splitCardLine(line) { const [title,...rest] = String(line).split('|'); return {title, desc:rest.join('|')}; }
function renderArchitectureSection(section) {
  const items = values => (values || []).map(value=>{ const item=splitCardLine(value);return `<li><b>${escapeHTML(item.title)}</b><span>${escapeHTML(item.desc)}</span></li>`; }).join('');
  return `<div class="architecture-board">${section.flow?.length?`<h4>${escapeHTML(section.flowTitle || '플레이 흐름')}</h4><ol class="flow-steps">${items(section.flow)}</ol>`:''}${(section.systems || section.modules)?.length?`<h4>${escapeHTML(section.systemTitle || '시스템')}</h4><ul class="system-list">${items(section.systems || section.modules)}</ul>`:''}${section.domains?.length?`<ul class="system-list">${items(section.domains)}</ul>`:''}${section.note?`<p class="architecture-note">${escapeHTML(section.note)}</p>`:''}</div>`;
}

const DISPLAY_TITLES={
  "만들고 싶었던 게임": "시작은 이런 한 판이었어요",
  "내가 맡은 부분": "이 부분은 제 손을 탔어요",
  "사용 기술과 선택한 이유": "이 장비를 챙긴 이유",
  "만들어 낸 결과": "그래서, 어디까지 만들었냐면",
  "배운 점": "다음 개발에도 챙겨 갈 것",
  "다음에 더 다듬고 싶은 것": "다음 패치에 담고 싶은 것",
  "기절한 도둑을 붙잡고, 감옥까지": "잡았다고 끝? 감옥까지 데려가야죠",
  "사물이 바뀌면 충돌 기준도 함께": "사물로 숨으려다 벽에 숨지 않도록",
  "주운 아이템과 손에 든 아이템이 같도록": "줍고 바꿔도, 아이템의 주인은 하나",
  "상태를 기준으로 연결한 플레이어 구조": "플레이어도 상태 정리가 먼저",
  "조작부터 라운드 결과까지": "낙하 판정 · 조작 설정 · 결과 순위",
  "공격 중에 대쉬를 누르면": "콤보 중에 대쉬를 누른다면?",
  "벽 앞에서 멈추는 대쉬": "대쉬도 벽은 못 뚫어요",
  "이동기와 매치 준비": "캐릭터 골랐으면, 라운드 준비",
  "입력에서 전투까지": "버튼 하나가 한 방이 되기까지",
  "보상이 다음 성장으로 이어지려면": "보상 받기, 숫자만 바꾸면 끝일까?",
  "전투와 저장의 책임 나누기": "싸우는 일과 기억하는 일은 따로",
  "보상을 다음 전투 준비로": "전리품 챙기고, 다음 전투로",
  "웨이브가 바뀌어도 흐름은 자연스럽게": "다음 웨이브에도 각자 할 일이 있다",
  "얻은 보상과 가방 속 아이템 맞추기": "가방이 꽉 찼다면, 보상부터 계산",
  "라운드와 보스 패턴": "라운드는 상태로, 보스는 패턴으로",
  "선택과 보상": "보스는 넘겼고, 다음 능력은?",
  "싱글 플레이보다 파티 초대가 반갑습니다": "파티 초대라면 일단 반갑죠"
};
function sectionTitleHTML(title) { return headingHTML(Object.hasOwn(DISPLAY_TITLES,title)?DISPLAY_TITLES[title]:title); }

function renderDetailSection(section,index) {
  let body='';
  switch (section.type) {
    case 'showcase': body=renderShowcaseSection(section);break;
    case 'architecture': body=renderArchitectureSection(section);break;
    case 'gallery': body=`<div class="gallery">${(section.images || []).map((url,i)=>mediaHTML(url,`${section.title} ${i+1}`)).join('')}</div>`;break;
    case 'features': case 'timeline': body=section.layout==='toolbox'?`<div class="toolbox-grid">${(section.features || []).map(item=>{const line=splitCardLine(item);return `<article class="toolbox-card">${uiIcon(equipmentKind({name:line.title}))}<h4>${headingHTML(line.title)}</h4><p>${escapeHTML(line.desc)}</p></article>`;}).join('')}</div>`:`<ul class="detail-list ${section.layout==='responsibilities'?'responsibility-grid':''}">${(section.features || section.items || []).map(item=>`<li>${escapeHTML(item)}</li>`).join('')}</ul>`;break;
    case 'code': body=`<pre class="code"><code>${escapeHTML(section.code || '')}</code></pre>`;break;
    case 'video': body=isVideoUrl(section.url)?mediaHTML(section.url,section.title):linkHTML({label:'플레이 영상 보기',url:section.url},'text-link');break;
    case 'media': body=mediaHTML(section.url,section.title)+`<p>${escapeHTML(section.text || '')}</p>`;break;
    default: body=`<p>${escapeHTML(section.text || '')}</p>`;
  }
  return `<section class="detail-section" id="section-${index}"><div class="detail-heading"><span class="eyebrow">${String(index).padStart(2,'0')}</span><h3>${sectionTitleHTML(section.title)}</h3></div>${body}</section>`;
}
let bgm=null;
let soundEnabled=false;
async function toggleSound() {
  if(soundEnabled){bgm?.pause();soundEnabled=false;}
  else if(DATA.bgmUrl){
    bgm ||= new Audio(DATA.bgmUrl);bgm.loop=true;bgm.volume=.22;
    try {await bgm.play();soundEnabled=true;}catch{soundEnabled=false;}
  }
  $('soundToggle').textContent=soundEnabled?'소리 끄기':'소리 켜기';
  $('soundToggle').setAttribute('aria-pressed',String(soundEnabled));
}
function bindSiteEvents() {
  bindCarousel();bindPlaybook();bindPageNavigation();
  document.addEventListener('click',event=>{
    const mediaButton=event.target.closest('[data-media-toggle]');
    if(mediaButton){const frame=mediaButton.closest('.motion-media');setMediaPaused(frame,!frame.classList.contains('is-paused'));}
  });
  $('menuToggle').addEventListener('click',()=>{const open=$('siteNav').classList.toggle('is-open');$('menuToggle').setAttribute('aria-expanded',String(open));});
  document.addEventListener('keydown',event=>{if(event.key==='Escape' && $('menuToggle').getAttribute('aria-expanded')==='true'){$('siteNav').classList.remove('is-open');$('menuToggle').setAttribute('aria-expanded','false');$('menuToggle').focus();}});
  $('motionToggle').addEventListener('click',()=>setMotionPaused(!motionPaused));
  reducedMotion.addEventListener('change',event=>setMotionPaused(event.matches));
  $('soundToggle').addEventListener('click',toggleSound);
  queueDetailNavigation();
}
window.addEventListener('DOMContentLoaded',()=>{
  if(!$('featuredGame')) return;
  reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');motionPaused=reducedMotion.matches;
  renderSite();bindSiteEvents();setMotionPaused(motionPaused);syncRoute();
});

function escapeHTML(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}



function isVideoUrl(url) {
  return /^data:video\//.test(String(url || "")) || /\.(mp4|webm|ogg)(\?|$)/i.test(String(url || ""));
}

function isUsableExternalLink(url) {
  return /^https?:\/\//i.test(String(url || ""));
}

function uiIcon(name) {
  const paths={
    code:'<path d="m9 6-6 6 6 6m6-12 6 6-6 6m-2-15-2 18"/>',
    network:'<circle cx="12" cy="5" r="3"/><circle cx="5" cy="18" r="3"/><circle cx="19" cy="18" r="3"/><path d="m10 8-4 7m8-7 4 7M8 18h8"/>',
    save:'<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 4 16 4 16 0V5M4 12c0 4 16 4 16 0"/>',
    loop:'<path d="M4 8a9 9 0 0 1 15-3l2 3M21 2v6h-6M20 16a9 9 0 0 1-15 3l-2-3M3 22v-6h6"/>',
    profile:'<circle cx="12" cy="8" r="4"/><path d="M4 22v-3a8 8 0 0 1 16 0v3Z"/>',
    library:'<rect x="3" y="3" width="7" height="8" rx="2"/><rect x="14" y="3" width="7" height="8" rx="2"/><rect x="3" y="15" width="7" height="7" rx="2"/><rect x="14" y="15" width="7" height="7" rx="2"/>',
    game:'<path d="M8 7h8c3 0 4 2 5 6l1 4c1 4-2 5-4 3l-3-3H9l-3 3c-2 2-5 1-4-3l1-4c1-4 2-6 5-6Z"/><path d="M7 10v6m-3-3h6m6-2h.1m3 3h.1"/>',
    learn:'<path d="M3 4h6c2 0 3 2 3 3 0-1 1-3 3-3h6v15h-6c-2 0-3 1-3 2 0-1-1-2-3-2H3ZM12 7v14"/>',
    upgrade:'<path d="m5 11 7-7 7 7M12 4v17M4 21h16"/>',
    result:'<path d="M7 3h10v6a5 5 0 0 1-10 0ZM7 5H3v3a4 4 0 0 0 5 4m9-7h4v3a4 4 0 0 1-5 4M12 14v7m-5 0h10"/>',
    bag:'<path d="M8 6V4a4 4 0 0 1 8 0v2M4 6h16v15H4ZM4 11h16M10 11v3h4v-3"/>'
  };
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.code}</svg>`;
}
function mascotHTML(extra='') { return skyCompanionHTML(extra); }
function equipmentKind(skill) {
  return /Photon|Network|Multiplayer/i.test(skill.name)?'network':/Firebase|저장|DB/i.test(skill.name)?'save':/상태|풀링|System/i.test(skill.name)?'loop':'code';
}
function equipmentArtwork(kind) {
  const art={
    code:`<path d="m32 6 23 13v27L32 59 9 46V19Z" fill="#142b42" stroke="#759eae"/><path d="m32 11 18 11-18 10-18-10Z" fill="#7bdce0"/><path d="m14 25 15 9v19l-15-9Z" fill="#217086"/><path d="m35 34 15-9v19l-15 9Z" fill="#3e9dad"/><path d="m32 11 0 18M15 22l17 10 18-10" stroke="#cdf9ec"/><path d="m23 36-5 3 5 3m18-6 5 3-5 3" fill="none" stroke="#eaffed" stroke-width="2"/><circle cx="32" cy="7" r="2" fill="#fff2bd"/>`,
    network:`<path d="M15 15h34v35H15Z" fill="#12263e" stroke="#6e92b0"/><path d="m16 40 31-15M17 25l30 15" stroke="#8db9eb" stroke-width="3"/><ellipse cx="17" cy="32" rx="10" ry="18" fill="#193654" stroke="#76d8ea" stroke-width="3"/><ellipse cx="17" cy="32" rx="5" ry="12" fill="#071a30" stroke="#3489a5"/><ellipse cx="47" cy="32" rx="10" ry="18" fill="#352c54" stroke="#b7a0ec" stroke-width="3"/><ellipse cx="47" cy="32" rx="5" ry="12" fill="#181c37" stroke="#7d69b4"/><path d="m28 31 4-5 4 5-4 6Z" fill="#f5d890"/><circle cx="32" cy="12" r="2" fill="#c1e8fa"/>`,
    save:`<path d="M15 12h32l7 8v32H10V20Z" fill="#273b50" stroke="#91a6ad"/><path d="M16 15h31v22H16Z" fill="#061e33" stroke="#568599"/><path d="m31 15 7 12-7 8-7-8Z" fill="#f0c982"/><path d="m31 15 0 20-7-8Z" fill="#bb804c"/><path d="M15 42h34v7H15Z" fill="#536275"/><path d="M20 42v7m7-7v7m10-7v7m7-7v7" stroke="#11293c"/><path d="M13 55h38" stroke="#687f92" stroke-width="3"/><circle cx="46" cy="21" r="2" fill="#75d9c9"/>`,
    loop:`<path d="m27 7 10 0 2 8 7 4 7-2 5 9-5 6 0 8-7 6-2 8H24l-3-8-8-5 0-9-6-6 5-9 8 2 6-4Z" fill="#344955" stroke="#9aacac"/><circle cx="32" cy="32" r="18" fill="#112b3d" stroke="#5e8991"/><path d="M42 27a12 12 0 0 0-22-1l-4-1 3 9 8-6-4-1a8 8 0 0 1 15-1ZM22 38a12 12 0 0 0 22-1l4 1-3-9-8 6 4 1a8 8 0 0 1-15 1Z" fill="#9bd2b9"/><circle cx="32" cy="32" r="3" fill="#f7d68e"/>`
  };
  return `<svg class="equipment-art" viewBox="0 0 64 64" fill="none" aria-hidden="true"><ellipse cx="32" cy="57" rx="24" ry="4" fill="#010a1680"/>${art[kind] || art.code}</svg>`;
}
function renderEquipment() {
  $('skillsGrid').innerHTML=`<div class="equipment-panel"><div class="equipment-top"><span>${uiIcon('bag')} DEVELOPER LOADOUT</span><span>장비 ${String(DATA.skills.length).padStart(2,'0')}</span></div><div class="equipment-body"><div class="equipment-character"><span class="equipped-tag">PLAYER / KIM HANEUL</span><button class="mascot-button" type="button" data-mascot aria-label="장비창의 밤하늘 고양이와 인사하기">${mascotHTML()}</button><span class="mascot-bubble" aria-live="polite">함께할 게임을 만드는 중</span></div><div class="equipment-slots" id="equipmentSlots" role="group" aria-label="개발 장비 선택">${DATA.skills.map((s,i)=>`<button type="button" data-equipment="${i}" aria-pressed="false"><span class="slot-key">${String(i+1).padStart(2,'0')}</span><span class="slot-icon">${equipmentArtwork(equipmentKind(s))}</span><span class="slot-name">${headingHTML(s.name)}</span><span class="slot-check" aria-hidden="true">◆</span></button>`).join('')}</div><div class="equipment-info" id="equipmentInfo" aria-live="polite"></div></div><p class="equipment-hint">아이콘을 선택하면 사용한 기술과 프로젝트를 볼 수 있어요</p></div>`;
  selectEquipment(0);
}
function selectEquipment(index) {
  const skill=DATA.skills[index];if(!skill){$('equipmentInfo').innerHTML='<p>등록된 기술이 없습니다</p>';return;}
  $('equipmentSlots').querySelectorAll('button').forEach((b,i)=>b.setAttribute('aria-pressed',String(i===index)));
  const projects=(skill.projects || []).map(id=>DATA.projects.find(p=>projectId(p)===id)).filter(Boolean);
  $('equipmentInfo').innerHTML=`<span class="eyebrow">선택한 장비</span><div class="equipment-name">${uiIcon(equipmentKind(skill))}<h3>${headingHTML(skill.name)}</h3></div><p>${escapeHTML(skill.desc)}</p><span class="equipment-used">이 장비를 사용한 프로젝트</span><div class="equipment-projects">${projects.length?projects.map(p=>`<a href="${projectHref(p)}"><img src="${escapeHTML(safeMedia(p.thumb))}" alt=""><span><b>${escapeHTML(p.title)}</b><small>${escapeHTML(p.cardRole || p.contribution || '')}</small></span><span aria-hidden="true">↗</span></a>`).join(''):'<p>프로젝트 연결을 추가할 수 있습니다</p>'}</div>`;
  pulseElement($('equipmentInfo'),'slot-selected');
  $('skillsGrid').dataset.equipped=equipmentKind(skill);
}
let libraryFilter='all';
function filterProjects(projects,filter,query='') {
  return projects.filter(p=>{const solo=/개인|1인/.test(p.team || '');return (filter==='all'||(filter==='solo'?solo:!solo)) && [p.title,p.summary,p.genre,...(p.tags || [])].join(' ').toLowerCase().includes(query.trim().toLowerCase());});
}
function renderLibrary() {
  const previousId=$('featuredGame').dataset.project;
  const results=filterProjects(DATA.projects,libraryFilter,$('projectSearch')?.value || '');
  const featured=featuredProject();
  carouselOrder=results.includes(featured)?[featured,...results.filter(p=>p!==featured)]:results;
  carouselIndex=Math.max(0,carouselOrder.findIndex(p=>projectId(p)===previousId));
  $('projectCount').textContent=`${results.length} / ${DATA.projects.length} GAMES`;
  $('libraryEmpty').hidden=!!results.length;
  document.querySelector('.map-canvas').hidden=!results.length;
  document.querySelector('.chart-footer').hidden=!results.length;
  $('featuredGame').hidden=!results.length;
  for(const id of ['carouselToggle','prevGame','nextGame'])$(id).disabled=results.length<2;
  document.querySelectorAll('[data-library-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.libraryFilter===libraryFilter)));
  renderWorldMap();
  if(results.length)selectGame(carouselIndex);
  else {
    $('featuredGame').innerHTML='';delete $('featuredGame').dataset.project;
    $('carouselCount').textContent='00 / 00';$('gameSelector').classList.remove('is-traveling');scheduleCarousel();
  }
}
let revealObserver=null;
function initReveals(root=document) {
  if(typeof IntersectionObserver==='undefined')return;
  revealObserver ||= new IntersectionObserver(entries=>{for(const e of entries){if(e.isIntersecting){e.target.classList.add('is-revealed');revealObserver.unobserve(e.target);}}},{threshold:.08});
  root.querySelectorAll('.section-head,.developer-card,.philosophy-item,.project-card,.equipment-panel,.workbench,.value-module,.journey-log,.activity-log,.knowledge-case,.cooperation-track article,.credential-card').forEach((el,i)=>{if(!el.dataset.reveal){el.dataset.reveal='true';el.style.setProperty('--reveal-delay',`${Math.min(i%4,3)*60}ms`);revealObserver.observe(el);}});
}
// Follow the scroll container itself, including wheel, keyboard, image reflow and resizing.
let detailScrollFrame=0,detailResizeObserver=null,detailActiveSection='';
function sectionAtPosition(positions,scrollTop,height,scrollHeight) {
  if(!positions.length)return '';
  if(scrollHeight>height+4 && scrollTop+height>=scrollHeight-4)return positions[positions.length-1].id;
  const readingLine=scrollTop+Math.min(140,height*.22);
  return positions.reduce((active,item)=>item.top<=readingLine?item.id:active,'');
}
function updateDetailNavigation() {
  detailScrollFrame=0;updatePageNavigation();
}
function queueDetailNavigation(){if(!detailScrollFrame)detailScrollFrame=requestAnimationFrame(updateDetailNavigation);}
function observeDetailContent() {
  detailResizeObserver?.disconnect();detailActiveSection='';
  if(typeof ResizeObserver!=='undefined'){detailResizeObserver=new ResizeObserver(queueDetailNavigation);detailResizeObserver.observe($('detailContent'));$('detailContent').querySelectorAll('.detail-section,.detail-hero').forEach(el=>detailResizeObserver.observe(el));}
  queueDetailNavigation();
}
const mascotSpeechTimers=new WeakMap();
function greetMascot(mascot) {
  const owner=mascot.parentElement,bubble=owner.querySelector('.mascot-bubble');
  if(!bubble)return;
  clearTimeout(mascotSpeechTimers.get(mascot));
  mascot.classList.remove('is-waving');void mascot.offsetWidth;mascot.classList.add('is-waving');
  const messages=['같이 한 판 할까요?','게임은 준비됐어요, 구경 가요!','다음 목적지는 어디인가요?'];
  const index=Number(mascot.dataset.greeting || 0);mascot.dataset.greeting=String(index+1);
  owner.classList.add('is-speaking');bubble.textContent=messages[index%messages.length];
  const parent=owner.getBoundingClientRect(),companion=mascot.getBoundingClientRect(),width=bubble.offsetWidth;
  const companionX=companion.left+companion.width/2-parent.left;
  const center=Math.max(width/2+8,Math.min(parent.width-width/2-8,companionX));
  bubble.style.setProperty('--bubble-x',`${center}px`);
  bubble.style.setProperty('--bubble-y',`${companion.top-parent.top-12}px`);
  bubble.style.setProperty('--tail-x',`${Math.max(15,Math.min(width-15,companionX-center+width/2))}px`);
  mascotSpeechTimers.set(mascot,setTimeout(()=>{owner.classList.remove('is-speaking');mascot.classList.remove('is-waving');mascotSpeechTimers.delete(mascot);},3200));
}
function bindPlaybook() {
  $('detailContent').addEventListener('scroll',queueDetailNavigation,{passive:true});
  $('detailContent').addEventListener('load',queueDetailNavigation,true);
  window.addEventListener('resize',queueDetailNavigation);
  $('projectSearch').addEventListener('input',renderLibrary);
  $('clearProjectSearch').addEventListener('click',()=>{libraryFilter='all';$('projectSearch').value='';renderLibrary();$('projectSearch').focus({preventScroll:true});});
  document.addEventListener('click',event=>{
    const filter=event.target.closest('[data-library-filter]');if(filter){libraryFilter=filter.dataset.libraryFilter;renderLibrary();}
    const equipment=event.target.closest('[data-equipment]');if(equipment)selectEquipment(Number(equipment.dataset.equipment));
    const mascot=event.target.closest('[data-mascot]');if(mascot)greetMascot(mascot);
  });
  $('skillsGrid').addEventListener('keydown',event=>{const b=event.target.closest('[data-equipment]');if(!b||!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','End'].includes(event.key))return;event.preventDefault();const max=DATA.skills.length,index=event.key==='Home'?0:event.key==='End'?max-1:(Number(b.dataset.equipment)+(event.key==='ArrowLeft'||event.key==='ArrowUp'?-1:1)+max)%max;selectEquipment(index);$('equipmentSlots').querySelectorAll('button')[index].focus();});
  initReveals();
}
