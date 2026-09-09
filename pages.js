/* Full-page navigation. The home lobby keeps its state while profile and project pages are read. */
let activeView='home',activeProjectId=null,profileRendered=false,lastRouteHash=null;
const pagePositions=new Map();
function parsePageRoute(hash) {
  const project=String(hash).match(/^#project\/([a-z0-9-]+)(?:\/(section-\d+))?$/);
  if(project)return {view:'project',id:project[1],section:project[2] || ''};
  const profile=String(hash).match(/^#profile(?:\/([a-z-]+))?$/);
  if(profile)return {view:'profile',section:profile[1] || ''};
  return {view:'home',section:String(hash || '#featured').slice(1)};
}
function rememberPagePosition() {
  if(lastRouteHash!==null)pagePositions.set(lastRouteHash,{y:window.scrollY,focus:document.activeElement});
}
// Keep the existing document alive. Capturing a long page and fading it twice caused a visible blink.
function navigatePage(hash,{replace=false,source=null}={}) {
  if(hash===location.hash){syncRoute({force:true});return;}
  rememberPagePosition();
  history[replace?'replaceState':'pushState'](null,'',hash);
  const next=parsePageRoute(hash),current=parsePageRoute(lastRouteHash || '#featured');
  const chapter=next.view===current.view&&(next.view!=='project'||next.id===current.id);
  document.documentElement.dataset.transitionMode=motionPaused?'reduced':chapter?'chapter-scroll':'instant-with-cue';
  syncRoute({fromLink:true});
  if(!chapter&&!motionPaused)pulseElement($('routeCue'),'is-running');
}
function visiblePage() { return $(activeView==='project'?'projectPage':activeView==='profile'?'profilePage':'main'); }
function pageTopInset() { return (document.querySelector('.topbar')?.offsetHeight || 0)+(visiblePage().querySelector('.chapter-dock')?.offsetHeight || 0)+24; }
function syncRoute(options={}) {
  const hash=location.hash || '#featured';
  if(lastRouteHash===hash&&!options.force)return;
  if(!options.fromLink)rememberPagePosition();
  const route=parsePageRoute(hash);
  let project;
  if(route.view==='project') {
    project=DATA.projects.find(p=>projectId(p)===route.id);
    if(!project){history.replaceState(null,'','#projects');$('routeNotice').textContent='해당 프로젝트를 찾을 수 없어 게임 목록으로 이동했습니다';$('routeNotice').hidden=false;syncRoute({force:true,fromLink:true});return;}
  }
  const changed=activeView!==route.view || (route.view==='project' && activeProjectId!==route.id);
  activeView=route.view;
  $('main').hidden=activeView!=='home';$('profilePage').hidden=activeView!=='profile';$('projectPage').hidden=activeView!=='project';
  document.body.dataset.view=activeView;
  document.querySelectorAll('main[hidden] video').forEach(video=>video.pause());
  if(activeView==='project')renderProjectPage(project);
  if(activeView==='profile'&&!profileRendered){renderProfilePage();profileRendered=true;}
  document.title=activeView==='project'?`${project.title} | 김하늘 게임 개발 포트폴리오`:activeView==='profile'?'김하늘 소개 | 게임 개발 포트폴리오':'김하늘 | 함께하는 게임을 만드는 개발자';
  const page=visiblePage();
  // No opacity reset or whole-page transform: content and sticky navigation stay stable.
  const saved=options.restore?pagePositions.get(hash):null;
  let target=activeView==='profile'?$(route.section?'profile-'+route.section:'profileTitle'):activeView==='project'?$(route.section || 'projectTitle'):$(route.section) || $('featured');
  if(!target||!page.contains(target))target=activeView==='profile'?$('profileTitle'):activeView==='project'?$('projectTitle'):$('featured');
  if(saved){window.scrollTo({top:saved.y,behavior:'instant'});if(saved.focus?.isConnected&&page.contains(saved.focus))saved.focus.focus({preventScroll:true});}
  else {
    const top=activeView!=='home'&&!route.section?0:Math.max(0,target.getBoundingClientRect().top+scrollY-pageTopInset());
    window.scrollTo({top,behavior:options.fromLink&&!changed&&!motionPaused?'smooth':'instant'});
    if(options.fromLink||changed){target.setAttribute('tabindex','-1');target.focus({preventScroll:true});}
  }
  $('skipLink').href=activeView==='project'?'#projectTitle':activeView==='profile'?'#profileTitle':'#main';
  document.querySelectorAll('#siteNav a').forEach(a=>{const match=activeView==='profile'?a.hash==='#profile':activeView==='project'?a.hash==='#projects':a.hash==='#'+route.section;if(match)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});
  lastRouteHash=location.hash || '#featured';
  scheduleCarousel();queueDetailNavigation();
}
function renderProjectPage(project) {
  if(activeProjectId===projectId(project))return;
  activeProjectId=projectId(project);
  const sections=project.sections || [],index=DATA.projects.indexOf(project),next=DATA.projects[(index+1)%DATA.projects.length];
  $('detailStatus').textContent=`PROJECT ${String(index+1).padStart(2,'0')} / ${String(DATA.projects.length).padStart(2,'0')}`;
  $('projectNext').innerHTML=next&&next!==project?`<a href="${projectHref(next)}">다음 게임 <b>${escapeHTML(next.title)}</b><span aria-hidden="true">↗</span></a>`:'';
  $('detailMenu').innerHTML=`<a href="${projectHref(project)}" data-section=""><span>00</span>프로젝트 소개</a>`+sections.map((s,i)=>`<a href="${projectHref(project,`section-${i+1}`)}" data-section="section-${i+1}"><span>${String(i+1).padStart(2,'0')}</span>${sectionTitleHTML(s.title)}</a>`).join('');
  $('detailContent').innerHTML=`<header class="detail-hero"><div class="detail-hero-top"><div class="case-intro"><span class="eyebrow">${index===DATA.featuredIndex?'FEATURED PROJECT':'PROJECT ARCHIVE'} / ${String(index+1).padStart(2,'0')}</span><h1 id="projectTitle" tabindex="-1">${headingHTML(project.title)}</h1><p class="detail-lead">${headingHTML(project.lead || project.teaser).replace(/\n/g,'<br>')}</p><p class="detail-summary">${escapeHTML(project.summary)}</p>${tagsHTML(project.tags)}<div class="project-links">${(project.links || []).map(l=>linkHTML(l,'btn')).join('')}</div></div><figure class="detail-stage">${projectPreviewHTML(project)}<figcaption><span class="live-mark" aria-hidden="true"></span>${escapeHTML(project.title)} / 실제 플레이 캡처<span class="scene-corner" aria-hidden="true">PLAYBACK</span></figcaption></figure></div><dl class="portfolio-meta">${projectMeta(project).map(([label,value])=>`<div><dt>${escapeHTML(label)}</dt><dd>${escapeHTML(value)}</dd></div>`).join('')}</dl></header><div class="detail-story-heading"><span class="eyebrow">DEVELOPMENT RECORD</span><h2>플레이는 한 판, 디버깅은 몇 판?</h2></div>${sections.map((s,i)=>renderDetailSection(s,i+1)).join('')}<nav class="related-projects" aria-label="다른 프로젝트"><div><span class="eyebrow">CONTINUE EXPLORING</span><h2>다음 게임도 준비되어 있어요</h2></div><div class="related-game-grid">${DATA.projects.filter(p=>p!==project).map(p=>`<a href="${projectHref(p)}"><img src="${escapeHTML(safeMedia(p.thumb))}" alt=""><span>${escapeHTML(p.title)}</span><b aria-hidden="true">↗</b></a>`).join('')}</div></nav>`;
  initMedia($('projectPage'));observeDetailContent();
}
function profileSectionHead(kicker,title,index) {
  return `<header class="profile-section-head"><span class="section-code">${String(index).padStart(2,'0')}</span><div><span class="eyebrow">${kicker}</span><h2>${title}</h2></div></header>`;
}
function knowledgeIcon(name) {
  return /멀티|Photon|Network/i.test(name)?'network':/전투|게임플레이/.test(name)?'game':/UI|UX|디자인/i.test(name)?'library':/최적화|성능/.test(name)?'loop':'code';
}
function renderProfilePage() {
  const name=DATA.name==='KIM HANEUL'?'김하늘':DATA.name;
  const chapters=[['','플레이어 정보'],['values','개발관'],['journey','성장 기록'],['inventory','관심과 학습'],['teamwork','협업 방식'],['credentials','자격 기록'],['next','다음 목표']];
  $('profileMenu').innerHTML=chapters.map(([id,title],i)=>`<a href="#profile${id?'/'+id:''}" data-section="${id?'profile-'+id:''}"><span>${String(i).padStart(2,'0')}</span>${title}</a>`).join('');
  const icons=['network','loop','game','result'];
  $('aboutDetailContent').innerHTML=`
    <header class="profile-hero">
      <div class="identity-dossier"><div class="dossier-top"><span>PLAYER FILE</span><span>KHN</span></div><div class="dossier-photo">${mediaHTML(DATA.profileAvatar,name+' 프로필',true)}<span>UNITY CLIENT DEVELOPER</span></div><div class="dossier-name"><strong>${headingHTML(name)}</strong><span>${escapeHTML(DATA.profileLocation || '')}</span></div><div class="dossier-bottom">${(DATA.profileLanguages || []).map(x=>`<span>${escapeHTML(x)}</span>`).join('')}</div></div>
      <div class="profile-intro"><span class="eyebrow">MEET THE DEVELOPER / KIM HANEUL</span><h1 id="profileTitle" tabindex="-1">게임을 좋아하는 사람에서<br><em>함께할 게임을 만드는 사람으로</em></h1><h2>${sectionTitleHTML(DATA.aboutDetailTitle)}</h2><p>${escapeHTML(DATA.aboutDetailText)}</p><div class="strength-slots">${DATA.aboutStrengths.map((x,i)=>`<div><span>${uiIcon(['code','game','result','learn'][i%4])}</span><b>${escapeHTML(x)}</b></div>`).join('')}</div></div>
    </header>
    <section id="profile-values" class="profile-section">${profileSectionHead('PLAY STYLE','재미도 특성이 있어야죠',1)}<p class="section-instruction">만들고 싶은 재미를 선택하면 연결된 프로젝트를 볼 수 있어요</p>${traitDeckHTML('profile')}</section>
    <section id="profile-journey" class="profile-section">${profileSectionHead('EXPERIENCE LOG','퀘스트는 하나씩, 경험치는 차곡차곡',2)}<div class="journey-layout"><div class="journey-log"><h3 class="panel-label">지나온 체크포인트</h3><ol>${DATA.education.map((x,i)=>`<li><span class="log-index">${String(i+1).padStart(2,'0')}</span><div><span class="eyebrow">RECORD</span><p>${escapeHTML(x)}</p></div>${uiIcon('learn')}</li>`).join('')}</ol></div><div class="activity-log"><h3 class="panel-label">직접 뛰어 본 퀘스트</h3><div class="activity-grid">${DATA.activities.map((x,i)=>`<article>${uiIcon(['game','code','network','loop'][i%4])}<span class="eyebrow">ACTIVITY / ${String(i+1).padStart(2,'0')}</span><h4>${escapeHTML(x)}</h4></article>`).join('')}</div></div></div></section>
    <section id="profile-inventory" class="profile-section">${profileSectionHead('KNOWLEDGE INVENTORY','새 기술은 일단 관심 목록에',3)}<div class="knowledge-grid">${[['관심 있는 분야',DATA.interests,'game'],['계속 공부하는 것',DATA.learning,'learn']].map(([title,items,icon])=>`<article class="knowledge-case"><header>${uiIcon(icon)}<h3>${title}</h3><span>${String(items.length).padStart(2,'0')} ITEMS</span></header><div class="knowledge-slots">${items.map((x,i)=>`<div><span class="slot-serial">${String(i+1).padStart(2,'0')}</span>${uiIcon(knowledgeIcon(x))}<b>${escapeHTML(x)}</b></div>`).join('')}</div></article>`).join('')}</div><a href="#skills" class="text-link inventory-link">프로젝트에 사용한 개발 장비 보기 <span aria-hidden="true">↗</span></a></section>
    <section id="profile-teamwork" class="profile-section">${profileSectionHead('CO-OP PLAYBOOK','협업은 파티 플레이니까',4)}<div class="cooperation-track">${DATA.workStyle.map((x,i)=>`<article><span class="step-marker">${String(i+1).padStart(2,'0')}</span>${uiIcon(['code','learn','game','network'][i%4])}<h3>${escapeHTML(x)}</h3></article>`).join('')}</div></section>
    <section id="profile-credentials" class="profile-section">${profileSectionHead('CREDENTIAL COLLECTION','배운 김에 자격도 챙겼어요',5)}<div class="credential-grid">${DATA.certificates.map(certificateDetail).map((x,i)=>`<article class="credential-card"><div class="credential-seal">${uiIcon('result')}<span>${String(i+1).padStart(2,'0')}</span></div><div class="credential-copy"><span class="eyebrow">${escapeHTML(x.issuer)}</span><h3>${headingHTML(x.name)}</h3><p>${escapeHTML(x.desc)}</p><time>${escapeHTML(x.date)}</time></div></article>`).join('')}</div>${DATA.awards?.length?`<div class="award-records"><h3>수상 기록</h3>${DATA.awards.map(x=>`<p>${escapeHTML(x)}</p>`).join('')}</div>`:''}</section>
    <section id="profile-next" class="profile-section profile-next">${profileSectionHead('NEXT CHAPTER','다음 스테이지도 같이 가요',6)}<p>${escapeHTML(DATA.aboutGoal)}</p><div class="profile-next-actions"><a class="btn primary" href="#projects">만들어 온 게임 보기 ↗</a><a class="text-link" href="#contact">함께할 이야기 나누기 ↗</a></div><div class="profile-companion" aria-hidden="true">${mascotHTML()}</div></section>`;
  initReveals($('aboutDetailContent'));
}
function updatePageNavigation() {
  if(activeView==='home') {
    const line=scrollY+Math.min(140,innerHeight*.22);
    const sections=[...document.querySelectorAll('#main > section[id]')];
    let active='featured';
    for(const section of sections)if(section.getBoundingClientRect().top+scrollY<=line)active=section.id;
    if(active==='about')active='profile';
    document.querySelectorAll('#siteNav a').forEach(link=>{if(link.hash===`#${active}`)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');});
    return;
  }
  const project=activeView==='project',content=$(project?'detailContent':'aboutDetailContent'),menu=$(project?'detailMenu':'profileMenu');
  const sections=[...content.querySelectorAll(project?'.detail-section':'.profile-section')];
  const positions=sections.map(el=>({id:el.id,top:el.getBoundingClientRect().top+scrollY-pageTopInset()+30}));
  const active=sectionAtPosition(positions,scrollY,innerHeight,document.documentElement.scrollHeight);
  const links=[...menu.querySelectorAll('a')];
  const old=menu.querySelector('[aria-current]');
  links.forEach(a=>{if((a.dataset.section || '')===active)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');});
  const current=menu.querySelector('[aria-current]');
  if(current&&old!==current){const r=current.getBoundingClientRect(),b=menu.getBoundingClientRect();if(r.left<b.left||r.right>b.right)menu.scrollTo({left:menu.scrollLeft+r.left-b.left-(menu.clientWidth-r.width)/2,behavior:motionPaused?'instant':'smooth'});}
  const progress=Math.min(100,Math.round(scrollY/Math.max(1,document.documentElement.scrollHeight-innerHeight)*100));
  $(project?'detailProgress':'profileProgress').style.setProperty('--read-progress',progress+'%');
  $(project?'detailProgressText':'profileProgressText').textContent=progress+'%';
}
function bindPageNavigation() {
  history.scrollRestoration='manual';
  document.addEventListener('click',event=>{
    const a=event.target.closest('a[href^="#"]');
    if(!a||event.defaultPrevented||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey||event.button!==0)return;
    event.preventDefault();
    if(a.id==='skipLink'){const target=$(a.hash.slice(1));target.setAttribute('tabindex','-1');target.focus();return;}
    enterBaseDoor(a,()=>navigatePage(a.hash,{replace:!!a.closest('.chapter-menu'),source:a}));
    $('siteNav').classList.remove('is-open');$('menuToggle').setAttribute('aria-expanded','false');
  });
  window.addEventListener('popstate',()=>syncRoute({restore:true}));
  window.addEventListener('hashchange',()=>syncRoute({restore:true}));
  window.addEventListener('scroll',queueDetailNavigation,{passive:true});
  $('profilePage').addEventListener('load',queueDetailNavigation,true);
}
