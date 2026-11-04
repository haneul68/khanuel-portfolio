/* Dedicated planning reader. Content is shared with the reviewed Word documents. */
function planningEntryHTML(project) {
  const docs=PLANNING_DOCS.filter(d=>d.id===projectId(project));
  if(!docs.length)return '';
  return `<aside class="planning-entry" aria-label="기획서"><div><span class="eyebrow">GAME DESIGN</span><strong>이 게임은 이렇게 설계했어요</strong><p>게임 기획 전반 · 김하늘 <span>개발 기록과 함께, 기획 의도와 상세 명세도 읽어보세요.</span></p></div><button type="button" class="btn planning-open" data-planning-open="${escapeHTML(projectId(project))}">기획서 열기 <span aria-hidden="true">↗</span></button></aside>`;
}
(() => {
  const reader=document.createElement('dialog');
  reader.id='planningReader';reader.className='planning-reader';reader.setAttribute('aria-labelledby','planningTitle');
  reader.innerHTML=`<header class="planning-top"><div><span class="eyebrow">GAME DESIGN / 김하늘</span><h2 id="planningTitle"></h2></div><button type="button" class="planning-close" aria-label="기획 창 닫기">닫기 <span aria-hidden="true">×</span></button></header><div class="planning-doc-tabs" id="planningDocTabs" aria-label="기획 문서 선택"></div><div class="planning-layout"><nav class="planning-nav" aria-label="기획서 목차"></nav><div class="planning-scroll"><section class="planning-intro"><span class="planning-ownership">게임 기획 전반 담당</span><p id="planningIntent"></p></section><div class="planning-paper"><header class="planning-document-header"><div><span class="eyebrow">DESIGN DOCUMENT</span><h3 id="planningDocTitle"></h3></div><a id="planningDownload" class="btn" download>Word 기획서 받기 ↓</a></header><div id="planningBody"></div></div></div></div>`;
  document.body.append(reader);
  let currentDocs=[],currentDoc=null,opener=null,scrollBefore=0,overflowBefore='';
  const e=s=>escapeHTML(String(s));
  const blocksHTML=blocks=>blocks.map(b=>{
    if(b.type==='p')return `<p>${e(b.text)}</p>`;
    if(b.type==='h')return `<h4>${e(b.text)}</h4>`;
    if(b.type==='note')return `<p class="planning-note">${e(b.text)}</p>`;
    if(b.type==='flow')return `<figure class="planning-flow"><figcaption>${e(b.title)}</figcaption><ol>${b.steps.map(s=>`<li>${e(s)}</li>`).join('')}</ol></figure>`;
    if(b.type==='table')return `<div class="planning-table-wrap" tabindex="0" role="region" aria-label="${e(b.title)}"><table><caption>${e(b.title)}</caption><thead><tr>${b.columns.map(s=>`<th scope="col">${e(s)}</th>`).join('')}</tr></thead><tbody>${b.rows.map(row=>`<tr>${row.map((s,i)=>i===0?`<th scope="row">${e(s)}</th>`:`<td>${e(s)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
    if(b.type==='diagram')return `<figure class="planning-diagram"><img src="assets/planning/spawn-rule.png" alt="중심점 기준 바깥 사각형 56 × 56에서 안쪽 46 × 46을 제외한 적 출현 범위"><figcaption>${e(b.caption)}</figcaption></figure>`;
    return '';
  }).join('');
  function selectDoc(key){
    const d=currentDocs.find(x=>x.key===key);if(!d)return;currentDoc=d;
    reader.style.setProperty('--plan-accent','#'+d.color);reader.style.setProperty('--plan-pale','#'+d.pale);
    reader.querySelector('#planningDocTitle').textContent=d.title;
    reader.querySelector('#planningDownload').href=`assets/planning/${d.key}.docx`;
    reader.querySelector('#planningDownload').setAttribute('download',`${d.title}.docx`);
    reader.querySelector('#planningDocTabs').hidden=currentDocs.length<2;
    reader.querySelector('#planningDocTabs').innerHTML=currentDocs.map(x=>`<button type="button" data-planning-doc="${e(x.key)}" aria-pressed="${x===d}">${x.key.endsWith('tutorial')?'튜토리얼 상세 기획서':'게임 및 시스템 기획서'}</button>`).join('');
    reader.querySelector('.planning-nav').innerHTML=d.pages.map((pg,i)=>`<button type="button" data-planning-chapter="${i}"><span>${String(i+1).padStart(2,'0')}</span>${e(pg.title)}</button>`).join('');
    reader.querySelector('#planningBody').innerHTML=d.pages.map((pg,i)=>`<section id="planning-chapter-${i}" class="planning-chapter"><h3 tabindex="-1"><span>${String(i+1).padStart(2,'0')}</span>${e(pg.title)}</h3>${blocksHTML(pg.blocks)}</section>`).join('');
    reader.querySelector('.planning-scroll').scrollTop=0;
    reader.querySelector('.planning-nav').scrollTo(0,0);
  }
  function open(id,button){
    currentDocs=PLANNING_DOCS.filter(d=>d.id===id);if(!currentDocs.length)return;
    opener=button;scrollBefore=window.scrollY;overflowBefore=document.body.style.overflow;
    reader.querySelector('#planningTitle').textContent=currentDocs[0].game+' 기획서';
    reader.querySelector('#planningIntent').textContent=currentDocs[0].intent;
    selectDoc(currentDocs[0].key);
    document.querySelectorAll('video').forEach(v=>v.pause());
    reader.showModal();document.body.style.overflow='hidden';reader.querySelector('.planning-close').focus({preventScroll:true});
  }
  document.addEventListener('click',event=>{
    const openButton=event.target.closest('[data-planning-open]');
    if(openButton){event.preventDefault();open(openButton.dataset.planningOpen,openButton);return;}
    if(!reader.open)return;
    if(event.target.closest('.planning-close')){reader.close();return;}
    const tab=event.target.closest('[data-planning-doc]');if(tab){selectDoc(tab.dataset.planningDoc);reader.querySelector(`[data-planning-doc="${currentDoc.key}"]`).focus({preventScroll:true});return;}
    const chapter=event.target.closest('[data-planning-chapter]');if(chapter){const target=reader.querySelector('#planning-chapter-'+chapter.dataset.planningChapter+' h3');target.scrollIntoView({behavior:'instant',block:'start'});target.focus({preventScroll:true});}
  });
  reader.addEventListener('close',()=>{document.body.style.overflow=overflowBefore;window.scrollTo({top:scrollBefore,behavior:'instant'});if(opener?.isConnected)opener.focus({preventScroll:true});});
  window.addEventListener('hashchange',()=>{if(reader.open)reader.close();});
})();
