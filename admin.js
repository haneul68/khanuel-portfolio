const ADMIN_SESSION_KEY = "khanuelAdminSession";
const ADMIN_PASSWORD_KEY = "khanuelAdminPassword";
const ADMIN_PASSWORD_VERSION_KEY = "khanuelAdminPasswordVersion";
const DEFAULT_PASSWORD = String.fromCharCode(114, 108, 97, 103, 107, 115, 109, 102, 54, 48, 56, 33);
const PASSWORD_VERSION = "2026-07-04-password-update";
let ACTIVE_ADMIN_PROJECT_INDEX = null;
let ADMIN_PROJECT_SEARCH = "";

function certificateLine(item) {
  if (item && typeof item === "object") {
    return [item.title || item.name || "", item.issuer || "Certiport", item.date || "", item.desc || item.summary || ""].join(" | ");
  }
  return String(item || "");
}

function parseCertificateLine(line) {
  const parts = String(line || "").split("|").map(item => item.trim());
  if (parts.length >= 4) {
    const [title, issuer, date, ...descParts] = parts;
    return { title, issuer, date, desc: descParts.join(" | ") };
  }
  return line.trim();
}

const SKILL_ICON_PRESETS = [
  ["GAME", "게임패드"],
  ["UNITY", "Unity"],
  ["C#", "C#"],
  ["NET", "네트워크"],
  ["SYS", "시스템"],
  ["UI", "UI"],
  ["GIT", "Git"],
  ["DB", "데이터"],
  ["AI", "AI"],
  ["TOOL", "도구"],
  ["BUG", "디버그"],
  ["BUILD", "빌드"],
  ["MOBILE", "모바일"],
  ["COMBAT", "전투"],
  ["GROWTH", "성장"],
  ["REWARD", "보상"],
  ["VIDEO", "영상"]
];

const TAB_COPY = {
  dashboard: ["대시보드", "포트폴리오 현황을 한눈에 확인합니다."],
  profile: ["프로필", "첫 화면과 자기소개 텍스트를 수정합니다."],
  projects: ["프로젝트", "프로젝트 카드와 상세 페이지를 관리합니다."],
  skills: ["기술 스택", "기술 카드 목록을 수정합니다."],
  design: ["디자인", "색상과 배경 분위기를 조정합니다."],
  contact: ["연락처", "외부 링크와 이메일을 수정합니다."]
};

function adminPassword() {
  return localStorage.getItem(ADMIN_PASSWORD_KEY) || DEFAULT_PASSWORD;
}

function migratePassword() {
  if (localStorage.getItem(ADMIN_PASSWORD_VERSION_KEY) === PASSWORD_VERSION) return;
  localStorage.setItem(ADMIN_PASSWORD_KEY, DEFAULT_PASSWORD);
  localStorage.setItem(ADMIN_PASSWORD_VERSION_KEY, PASSWORD_VERSION);
}

function isAdminSession() {
  return sessionStorage.getItem(ADMIN_SESSION_KEY) === "true";
}

function setAdminSession(value) {
  if (value) sessionStorage.setItem(ADMIN_SESSION_KEY, "true");
  else sessionStorage.removeItem(ADMIN_SESSION_KEY);
}

function enterAdmin() {
  document.body.classList.add("admin-unlocked");
  $("loginBox").classList.add("hidden");
  $("adminPanel").classList.remove("hidden");
  bindForm();
  renderEditors();
  openTab("dashboard");
}

function tryLogin() {
  const input = $("adminPassword");
  if ((input.value || "").trim() !== adminPassword()) {
    input.classList.add("invalid");
    input.focus();
    return;
  }
  setAdminSession(true);
  enterAdmin();
}

function openTab(tab) {
  document.querySelectorAll(".side-btn[data-tab]").forEach(button => {
    button.classList.toggle("active", button.dataset.tab === tab);
  });
  document.querySelectorAll(".tab").forEach(panel => {
    panel.classList.toggle("active", panel.id === `tab-${tab}`);
  });
  const [title, subtitle] = TAB_COPY[tab] || TAB_COPY.dashboard;
  $("adminTitle").textContent = title;
  $("adminSubtitle").textContent = subtitle;
}

function bindForm() {
  applyTheme();
  $("adminMiniChar").style.backgroundImage = `url("${DATA.character || "assets/character.png"}")`;
  $("fBrand").value = DATA.brand || "";
  $("fHello").value = DATA.hello || "";
  $("fName").value = DATA.name || "";
  $("fRole").value = DATA.role || "";
  $("fProfileLocation").value = DATA.profileLocation || "Asia/Seoul";
  $("fProfileLanguages").value = (DATA.profileLanguages || []).join(", ");
  $("fProfileAvatar").value = DATA.profileAvatar || "";
  $("fDesc").value = DATA.desc || "";
  $("fChips").value = (DATA.chips || []).join(", ");
  $("fChar").value = DATA.character || "";
  $("fAboutTitle").value = DATA.aboutTitle || "";
  $("fAboutText").value = DATA.aboutText || "";
  $("fAboutDetailTitle").value = DATA.aboutDetailTitle || "";
  $("fAboutDetailText").value = DATA.aboutDetailText || "";
  if ($("fPlayPhilosophy")) $("fPlayPhilosophy").value = (DATA.playPhilosophy || []).map(item => `${item[0] || ""}|${item[1] || ""}`).join("\n");
  $("fAboutStrengths").value = (DATA.aboutStrengths || []).join(", ");
  if ($("fEducation")) $("fEducation").value = (DATA.education || []).join("\n");
  $("fAwards").value = (DATA.awards || []).join("\n");
  $("fCertificates").value = (DATA.certificates || []).map(certificateLine).join("\n");
  $("fInterests").value = (DATA.interests || []).join(", ");
  $("fActivities").value = (DATA.activities || []).join("\n");
  $("fLearning").value = (DATA.learning || []).join(", ");
  $("fWorkStyle").value = (DATA.workStyle || []).join("\n");
  $("fAboutGoal").value = DATA.aboutGoal || "";
  $("fTheme").value = DATA.theme || "#8a4dff";
  $("fAccent").value = DATA.accent || "#45c7ff";
  $("fBackground").value = DATA.background || "night";
  $("fRadius").value = String(DATA.radius || "8");
  if ($("fSoundDefaultOn")) $("fSoundDefaultOn").value = String(DATA.soundDefaultOn !== false);
  if ($("fBgmUrl")) $("fBgmUrl").value = DATA.bgmUrl || "";
  $("fGithub").value = DATA.contact.github || "";
  $("fEmail").value = DATA.contact.email || "";
  $("fSteam").value = DATA.contact.steam || "";
  if ($("fFeaturedProject")) {
    $("fFeaturedProject").innerHTML = DATA.projects.map((project, index) => `
      <option value="${index}" ${Number(DATA.featuredIndex || 0) === index ? "selected" : ""}>${escapeHTML(project.title || `프로젝트 ${index + 1}`)}</option>
    `).join("");
  }
  $("characterUpload").innerHTML = uploadBox("대표 오브젝트 이미지 업로드", DATA.character, data => {
    DATA.character = data;
    $("fChar").value = data;
    bindForm();
  }, "image/png,image/jpeg,image/gif,image/webp");
  $("profileAvatarUpload").innerHTML = uploadBox("프로필 사진 업로드", DATA.profileAvatar, data => {
    DATA.profileAvatar = data;
    $("fProfileAvatar").value = data;
    bindForm();
  }, "image/png,image/jpeg,image/gif,image/webp");
  if ($("bgmUpload")) {
    $("bgmUpload").innerHTML = uploadBox("배경음 파일 업로드", DATA.bgmUrl || "", data => {
      DATA.bgmUrl = data;
      $("fBgmUrl").value = data;
      bindForm();
    }, "audio/mpeg,audio/mp3,audio/ogg,audio/wav,audio/webm");
  }
  renderDashboard();
}

function collectForm() {
  DATA.brand = $("fBrand").value.trim() || "KHANEUL";
  DATA.hello = $("fHello").value.trim();
  DATA.name = $("fName").value.trim();
  DATA.role = $("fRole").value.trim();
  DATA.profileLocation = $("fProfileLocation").value.trim() || "Asia/Seoul";
  DATA.profileLanguages = $("fProfileLanguages").value.split(",").map(item => item.trim()).filter(Boolean);
  DATA.profileAvatar = $("fProfileAvatar").value.trim();
  DATA.desc = $("fDesc").value.trim();
  DATA.chips = $("fChips").value.split(",").map(item => item.trim()).filter(Boolean);
  DATA.character = $("fChar").value.trim() || "assets/character.png";
  DATA.aboutTitle = $("fAboutTitle").value.trim();
  DATA.aboutText = $("fAboutText").value.trim();
  DATA.aboutDetailTitle = $("fAboutDetailTitle").value.trim();
  DATA.aboutDetailText = $("fAboutDetailText").value.trim();
  if ($("fPlayPhilosophy")) {
    DATA.playPhilosophy = $("fPlayPhilosophy").value.split("\n").map(line => {
      const [title, ...textParts] = line.split("|");
      return [title?.trim(), textParts.join("|").trim()];
    }).filter(([title, text]) => title || text);
  }
  DATA.aboutStrengths = $("fAboutStrengths").value.split(",").map(item => item.trim()).filter(Boolean);
  if ($("fEducation")) DATA.education = $("fEducation").value.split("\n").map(item => item.trim()).filter(Boolean);
  DATA.awards = $("fAwards").value.split("\n").map(item => item.trim()).filter(Boolean);
  DATA.certificates = $("fCertificates").value.split("\n").map(parseCertificateLine).filter(Boolean);
  DATA.interests = $("fInterests").value.split(",").map(item => item.trim()).filter(Boolean);
  DATA.activities = $("fActivities").value.split("\n").map(item => item.trim()).filter(Boolean);
  DATA.learning = $("fLearning").value.split(",").map(item => item.trim()).filter(Boolean);
  DATA.workStyle = $("fWorkStyle").value.split("\n").map(item => item.trim()).filter(Boolean);
  DATA.aboutGoal = $("fAboutGoal").value.trim();
  DATA.theme = $("fTheme").value;
  DATA.accent = $("fAccent").value;
  DATA.background = $("fBackground").value;
  DATA.radius = $("fRadius").value;
  if ($("fSoundDefaultOn")) DATA.soundDefaultOn = $("fSoundDefaultOn").value === "true";
  if ($("fBgmUrl")) DATA.bgmUrl = $("fBgmUrl").value.trim();
  DATA.contact.github = $("fGithub").value.trim();
  DATA.contact.email = $("fEmail").value.trim();
  DATA.contact.steam = $("fSteam").value.trim();
  if ($("fFeaturedProject")) DATA.featuredIndex = Number($("fFeaturedProject").value || 0);
}

function renderDashboard() {
  const mediaCount = DATA.projects.reduce((count, project) => {
    return count + (project.sections || []).filter(section => ["gallery", "media", "video"].includes(section.type)).length;
  }, 0);
  $("dashProject").textContent = DATA.projects.length;
  $("dashSkill").textContent = DATA.skills.length;
  $("dashMedia").textContent = mediaCount;
  $("dashTheme").textContent = DATA.background === "night" ? "Night" : DATA.background === "neon" ? "Neon" : "Studio";
  $("recentProjects").innerHTML = DATA.projects.slice(0, 6).map(project => `
    <div class="recent-item">
      <span class="recent-thumb">${mediaPreview(project.thumb, project.title)}</span>
      <b>${escapeHTML(project.title)}</b>
      <small>${escapeHTML(project.category || "")}</small>
      <em>${escapeHTML(project.status || "공개")}</em>
      <time>${escapeHTML(project.date || "")}</time>
    </div>
  `).join("");
}

function saveAll() {
  collectForm();
  if (!saveData(DATA)) {
    toast("저장 공간이 부족합니다. 이미지 크기를 줄이거나 큰 GIF/영상은 링크로 넣어주세요.");
    return;
  }
  bindForm();
  renderEditors();
  toast("저장 완료! 사이트 보기에서 바로 확인할 수 있습니다.");
}

function toast(message) {
  const old = document.querySelector(".toast");
  if (old) old.remove();
  const el = document.createElement("div");
  el.className = "toast";
  el.textContent = message;
  document.body.appendChild(el);
  setTimeout(() => el.classList.add("show"), 20);
  setTimeout(() => el.remove(), 2400);
}

function readFile(file, callback) {
  if (!file) return;
  const allowed = /image\/(png|jpeg|jpg|gif|webp)|video\/(mp4|webm|ogg)|audio\/(mpeg|mp3|ogg|wav|webm)/i.test(file.type);
  if (!allowed) {
    toast("PNG, JPG, GIF, WEBP, MP4, WEBM, MP3, OGG, WAV 파일만 사용할 수 있습니다.");
    return;
  }
  if (/^image\/(png|jpeg|jpg|webp)$/i.test(file.type)) {
    compressImageFile(file, callback);
    return;
  }
  if (file.size > 3.5 * 1024 * 1024) {
    toast("큰 GIF/영상/음원은 저장 용량을 넘을 수 있습니다. 가능하면 URL 링크를 사용해주세요.");
  }
  const reader = new FileReader();
  reader.onload = () => callback(reader.result);
  reader.readAsDataURL(file);
}

function compressImageFile(file, callback) {
  const reader = new FileReader();
  reader.onload = () => {
    const image = new Image();
    image.onload = () => {
      const maxSize = 1400;
      const scale = Math.min(1, maxSize / Math.max(image.width, image.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(image.width * scale));
      canvas.height = Math.max(1, Math.round(image.height * scale));
      const ctx = canvas.getContext("2d");
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
      callback(canvas.toDataURL("image/webp", 0.86));
    };
    image.onerror = () => callback(reader.result);
    image.src = reader.result;
  };
  reader.readAsDataURL(file);
}

function uploadBox(label, current, onSet, accept = "image/png,image/jpeg,image/gif,image/webp,video/mp4,video/webm,video/ogg") {
  const id = `upload_${Math.random().toString(36).slice(2)}`;
  setTimeout(() => {
    const box = document.getElementById(id);
    if (!box) return;
    const input = box.querySelector("input");
    const handle = file => readFile(file, data => {
      onSet(data);
      collectForm();
      if (!saveData(DATA)) {
        toast("이미지 저장에 실패했습니다. 더 작은 이미지나 URL을 사용해주세요.");
      } else {
        toast("이미지를 저장했습니다.");
      }
      renderEditors();
      renderDashboard();
      if (ACTIVE_ADMIN_PROJECT_INDEX !== null) openProjectEditor(ACTIVE_ADMIN_PROJECT_INDEX);
    });
    box.addEventListener("click", () => input.click());
    box.addEventListener("dragover", event => {
      event.preventDefault();
      box.classList.add("drag");
    });
    box.addEventListener("dragleave", () => box.classList.remove("drag"));
    box.addEventListener("drop", event => {
      event.preventDefault();
      box.classList.remove("drag");
      handle(event.dataTransfer.files[0]);
    });
    input.addEventListener("change", () => handle(input.files[0]));
  }, 0);

  return `
    <div class="upload-box" id="${id}">
      <input type="file" hidden accept="${accept}">
      <div>
        <b>${escapeHTML(label)}</b>
        <small>클릭하거나 파일을 끌어다 놓으세요. 이미지, GIF, MP4를 지원합니다.</small>
      </div>
      <div class="upload-preview">${mediaPreview(current, label)}</div>
    </div>
  `;
}

function mediaPreview(url, alt = "") {
  if (!url) return '<span class="empty-preview">미리보기</span>';
  if (/^data:audio\//.test(String(url || "")) || /\.(mp3|wav|ogg|webm)(\?|$)/i.test(String(url || ""))) {
    return `<audio src="${escapeHTML(url)}" controls></audio>`;
  }
  if (isVideoUrl(url)) return `<video src="${escapeHTML(url)}" muted loop playsinline></video>`;
  return `<img src="${escapeHTML(url)}" alt="${escapeHTML(alt)}">`;
}

function escapeAttr(value) {
  return escapeHTML(value).replace(/`/g, "&#096;");
}

function renderEditors() {
  renderProjectEditor();
  renderSkillEditor();
  renderDashboard();
}

function updateProject(index, key, value) {
  DATA.projects[index][key] = value;
  renderDashboard();
}

function renderProjectEditor() {
  const query = ADMIN_PROJECT_SEARCH.trim().toLowerCase();
  const projects = DATA.projects
    .map((project, index) => ({ project, index }))
    .filter(({ project }) => !query || [project.title, project.summary, project.category, ...(project.tags || [])].join(" ").toLowerCase().includes(query));
  $("projectEditor").innerHTML = `
    <div class="admin-help-strip">
      <b>프로젝트를 고르고 편집하세요.</b>
      <span>긴 입력폼은 편집 창 안으로 옮겼고, 오른쪽에서 결과 미리보기를 확인할 수 있습니다.</span>
    </div>
    <div class="admin-list-tools">
      <input id="adminProjectSearch" value="${escapeAttr(ADMIN_PROJECT_SEARCH)}" placeholder="프로젝트 검색: 제목, 태그, 분류">
      <span>${projects.length} / ${DATA.projects.length}개 표시</span>
    </div>
    <div class="admin-project-list">
      ${projects.map(({ project, index }) => `
        <article class="admin-project-item" draggable="true" data-project-drag="${index}">
          <div class="admin-project-thumb">${mediaPreview(project.thumb, project.title)}</div>
          <div class="admin-project-main">
            <span>${escapeHTML(project.category || "Game")} · ${escapeHTML(project.status || "공개")}</span>
            <h3>${escapeHTML(project.title || "새 프로젝트")}</h3>
            <p>${escapeHTML(project.summary || "프로젝트 요약을 입력하세요.")}</p>
            <div class="tags">${(project.tags || []).slice(0, 5).map(tag => `<span>${escapeHTML(tag)}</span>`).join("")}</div>
          </div>
          <div class="admin-project-actions">
            <button class="btn primary small" data-edit-project="${index}" type="button">편집</button>
            <button class="btn small" data-preview-project="${index}" type="button">미리보기</button>
            <button class="btn small" data-duplicate-project="${index}" type="button">복제</button>
            <button class="btn danger small" data-delete-project="${index}" type="button">삭제</button>
          </div>
        </article>
      `).join("")}
    </div>
  `;
}

function projectEditForm(index) {
  const project = DATA.projects[index];
  return `
    <div class="form-grid" data-preview-target="detail-0">
      <label>프로젝트 제목<input value="${escapeAttr(project.title)}" data-project="${index}" data-field="title"></label>
      <label>분류<input value="${escapeAttr(project.category)}" data-project="${index}" data-field="category" placeholder="2D, 3D, Tool"></label>
      <label>상태<input value="${escapeAttr(project.status || "공개")}" data-project="${index}" data-field="status"></label>
      <label>날짜<input value="${escapeAttr(project.date || "")}" data-project="${index}" data-field="date" placeholder="2026.06.01"></label>
      <label>내 역할<input value="${escapeAttr(project.role || "")}" data-project="${index}" data-field="role" placeholder="Unity Client Developer"></label>
      <label>개발 기간<input value="${escapeAttr(project.period || "")}" data-project="${index}" data-field="period" placeholder="2026.03 - 2026.06"></label>
      <label>팀 규모<input value="${escapeAttr(project.team || "")}" data-project="${index}" data-field="team" placeholder="개인 / 4인 팀"></label>
      <label>플랫폼<input value="${escapeAttr(project.platform || "")}" data-project="${index}" data-field="platform" placeholder="PC, Mobile, WebGL"></label>
      <label>장르<input value="${escapeAttr(project.genre || "")}" data-project="${index}" data-field="genre" placeholder="Defense, TPS, Puzzle"></label>
      <label>기여도<input value="${escapeAttr(project.contribution || "")}" data-project="${index}" data-field="contribution" placeholder="전투 시스템 70%, UI 100%"></label>
      <label class="wide">요약<input value="${escapeAttr(project.summary)}" data-project="${index}" data-field="summary"></label>
      <label class="wide">썸네일 URL 또는 업로드 결과<input value="${escapeAttr(project.thumb)}" data-project="${index}" data-field="thumb"></label>
      <div class="wide">${uploadBox("썸네일 이미지/GIF/영상", project.thumb, data => { DATA.projects[index].thumb = data; })}</div>
      <label class="wide">상단 대표 배경 이미지 URL<input value="${escapeAttr(project.heroImage || "")}" data-project="${index}" data-field="heroImage" placeholder="상세 페이지 상단에 크게 깔릴 대표 이미지"></label>
      <div class="wide">${uploadBox("상세 상단 대표 배경 이미지", project.heroImage || project.thumb || "", data => { DATA.projects[index].heroImage = data; })}</div>
      <label class="wide">태그, 쉼표로 구분<input value="${escapeAttr((project.tags || []).join(", "))}" data-project-tags="${index}"></label>
      <label class="wide">담당 업무, 줄마다 입력<textarea data-project-lines="${index}" data-field="responsibilities" placeholder="플레이어 이동 구현&#10;스킬 선택 UI 구현">${escapeHTML((project.responsibilities || []).join("\n"))}</textarea></label>
      <label class="wide">핵심 구현, 줄마다 입력<textarea data-project-lines="${index}" data-field="coreSystems" placeholder="라운드 기반 스폰 시스템&#10;보스 패턴 FSM">${escapeHTML((project.coreSystems || []).join("\n"))}</textarea></label>
      <label class="wide">문제 해결, 줄마다 입력<textarea data-project-lines="${index}" data-field="problems" placeholder="프레임 드랍 원인을 오브젝트 풀링으로 개선">${escapeHTML((project.problems || []).join("\n"))}</textarea></label>
      <label class="wide">배운 점 / 회고<textarea data-project-text="${index}" data-field="learned" placeholder="이 프로젝트를 통해 배운 점을 적어주세요.">${escapeHTML(project.learned || "")}</textarea></label>
      <label class="wide">링크, 줄마다 이름|URL 형식<textarea data-project-links="${index}" placeholder="GitHub|https://github.com/...&#10;Demo|https://...">${escapeHTML((project.links || []).map(link => `${link.label || "Link"}|${link.url || ""}`).join("\n"))}</textarea></label>
    </div>
    <div class="section-header">
      <h4>상세 페이지 섹션</h4>
      <button class="btn small" data-add-section="${index}" type="button">섹션 추가</button>
    </div>
    <div class="section-list">
      ${(project.sections || []).map((section, sectionIndex) => sectionEditor(index, sectionIndex, section)).join("")}
    </div>
  `;
}

function ensureProjectEditorModal() {
  let modal = $("adminProjectModal");
  if (modal) return modal;
  modal = document.createElement("div");
  modal.id = "adminProjectModal";
  modal.className = "admin-editor-modal";
  document.body.appendChild(modal);
  return modal;
}

function renderProjectPreview(index) {
  const project = DATA.projects[index];
  if (!project) return "";
  const sections = Array.isArray(project.sections) ? project.sections : [];
  return `
    <div class="admin-preview-full">
      <div class="admin-preview-hero ${project.heroImage || project.thumb ? "has-hero-image" : ""}" id="detail-0"${adminHeroBackgroundStyle(project)}>
        <span class="badge static">${escapeHTML(project.category || "Game")}</span>
        <h3>${escapeHTML(project.title || "새 프로젝트")}</h3>
        <p>${escapeHTML(project.summary || "프로젝트 요약을 입력하세요.")}</p>
        <div class="tags">${(project.tags || []).map(tag => `<span>${escapeHTML(tag)}</span>`).join("")}</div>
        <div class="portfolio-meta-grid">
          ${projectMeta(project).map(([label, value]) => `<div><small>${escapeHTML(label)}</small><b>${escapeHTML(value)}</b></div>`).join("")}
        </div>
        <div class="portfolio-writeup">
          <section>
            <h3>담당 업무</h3>
            <ul>${listFrom(project.responsibilities || ["게임 시스템 구현", "UI 흐름 구성", "플레이 테스트 및 개선"]).map(item => `<li>${escapeHTML(item)}</li>`).join("")}</ul>
          </section>
          <section>
            <h3>핵심 구현</h3>
            <ul>${listFrom(project.coreSystems || []).map(item => `<li>${escapeHTML(item)}</li>`).join("") || "<li>핵심 구현을 입력하세요.</li>"}</ul>
          </section>
          <section>
            <h3>문제 해결</h3>
            <ul>${listFrom(project.problems || []).map(item => `<li>${escapeHTML(item)}</li>`).join("") || "<li>문제 해결 내용을 입력하세요.</li>"}</ul>
          </section>
          <section>
            <h3>배운 점</h3>
            <p>${escapeHTML(project.learned || "프로젝트를 통해 배운 점을 입력하세요.")}</p>
          </section>
        </div>
        <div class="project-links">
          ${(project.links || []).map(link => `<a href="${escapeHTML(link.url || "#")}" target="_blank" rel="noreferrer">${iconSVG(portfolioIconFor(link.label || link.url || "git"))}${escapeHTML(link.label || "Link")}</a>`).join("") || '<span class="empty-link-guide">GitHub 링크 준비 중</span>'}
        </div>
        <div class="detail-media">${mediaPreview(project.thumb, project.title)}</div>
      </div>
      ${sections.map((section, sectionIndex) => renderAdminPreviewSection(section, sectionIndex + 1)).join("")}
      ${typeof renderMoreProjects === "function" ? renderMoreProjects(index) : ""}
    </div>
  `;
}

function renderAdminPreviewSection(section, index) {
  const title = escapeHTML(section.title || `섹션 ${index}`);
  let body = "";
  if (section.type === "gallery") {
    body = `<div class="gallery">${(section.images || []).map(url => mediaPreview(url, title)).join("")}</div>`;
  } else if (section.type === "showcase") {
    body = renderShowcaseSection(section);
  } else if (section.type === "architecture") {
    body = renderArchitectureSection(section);
  } else if (section.type === "features") {
    body = `<div class="feature-grid">${(section.features || []).map(item => `<div class="feature"><span class="mini-icon">${iconSVG(portfolioIconFor(item))}</span>${escapeHTML(item)}</div>`).join("")}</div>`;
  } else if (section.type === "timeline") {
    body = `<div class="timeline">${(section.items || []).map(item => `<div>${escapeHTML(item)}</div>`).join("")}</div>`;
  } else if (section.type === "code") {
    body = `<pre class="code">${escapeHTML(section.code || "")}</pre>`;
  } else if (section.type === "video") {
    body = isVideoUrl(section.url)
      ? `<div class="detail-media">${mediaPreview(section.url, title)}</div>`
      : `<a class="video-link" href="${escapeHTML(section.url || "#")}" target="_blank" rel="noreferrer">영상 링크 열기</a>`;
  } else if (section.type === "media") {
    body = `<div class="detail-media">${mediaPreview(section.url, title)}</div><p>${escapeHTML(section.text || "")}</p>`;
  } else {
    const keywords = Array.isArray(section.keywords) && section.keywords.length
      ? `<div class="section-keywords">${section.keywords.map(keyword => `<span>${iconSVG(portfolioIconFor(keyword))}${escapeHTML(keyword)}</span>`).join("")}</div>`
      : "";
    body = `${keywords}<p>${escapeHTML(section.text || "")}</p>`;
  }
  return `<section class="detail-section" id="detail-${index}"><h3><span class="section-icon">${iconSVG(portfolioIconFor(section.title || section.type))}</span>${title}</h3>${body}</section>`;
}

function adminHeroBackgroundStyle(project) {
  const image = project?.heroImage || project?.thumb || "";
  if (!image) return "";
  return ` style="--detail-hero-image:url('${escapeAttr(image)}')"`;
}

function openProjectEditor(index) {
  const project = DATA.projects[index];
  if (!project) return;
  ACTIVE_ADMIN_PROJECT_INDEX = index;
  const modal = ensureProjectEditorModal();
  modal.innerHTML = `
    <div class="admin-editor-backdrop" data-close-project-editor></div>
    <section class="admin-editor-dialog">
      <header class="admin-editor-head">
        <div>
          <span>PROJECT EDITOR</span>
          <h2>${escapeHTML(project.title || "새 프로젝트")}</h2>
        </div>
        <div class="admin-editor-actions">
          <button class="btn small" data-preview-project="${index}" type="button">방문자 미리보기</button>
          <button class="btn primary small" id="saveProjectEditor" type="button">저장</button>
          <button class="btn danger small" data-close-project-editor type="button">닫기</button>
        </div>
      </header>
      <div class="admin-editor-body">
        <div class="admin-editor-form">${projectEditForm(index)}</div>
        <aside class="admin-live-preview">
          <div class="editor-title">
            <h3>실시간 미리보기</h3>
            <p>방문자 상세 화면 전체를 확인합니다.</p>
          </div>
          <div id="projectLivePreview">${renderProjectPreview(index)}</div>
        </aside>
      </div>
    </section>
  `;
  modal.classList.add("open");
  document.body.style.overflow = "hidden";
  requestAnimationFrame(bindProjectPreviewSync);
}

function closeProjectEditor() {
  const modal = $("adminProjectModal");
  if (modal) modal.classList.remove("open");
  ACTIVE_ADMIN_PROJECT_INDEX = null;
  document.body.style.overflow = "";
}

function refreshProjectEditorPreview() {
  if (ACTIVE_ADMIN_PROJECT_INDEX === null) return;
  const title = document.querySelector("#adminProjectModal .admin-editor-head h2");
  const preview = $("projectLivePreview");
  const project = DATA.projects[ACTIVE_ADMIN_PROJECT_INDEX];
  if (title && project) title.textContent = project.title || "새 프로젝트";
  if (preview) preview.innerHTML = renderProjectPreview(ACTIVE_ADMIN_PROJECT_INDEX);
}

function scrollPreviewTo(targetId, smooth = true) {
  const previewPanel = document.querySelector("#adminProjectModal .admin-live-preview");
  const target = targetId ? document.getElementById(targetId) : null;
  if (!previewPanel || !target) return;
  const panelTop = previewPanel.getBoundingClientRect().top;
  const targetTop = target.getBoundingClientRect().top;
  previewPanel.scrollTo({
    top: previewPanel.scrollTop + targetTop - panelTop - 86,
    behavior: smooth ? "smooth" : "auto"
  });
}

function previewTargetForEditorElement(element) {
  return element?.closest?.("[data-preview-target]")?.dataset.previewTarget || "detail-0";
}

function bindProjectPreviewSync() {
  const modal = $("adminProjectModal");
  const form = modal?.querySelector(".admin-editor-form");
  if (!form || form.dataset.previewSyncReady) return;
  form.dataset.previewSyncReady = "true";
  let ticking = false;

  form.addEventListener("focusin", event => {
    scrollPreviewTo(previewTargetForEditorElement(event.target));
  });

  form.addEventListener("scroll", () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      ticking = false;
      const formTop = form.getBoundingClientRect().top + 120;
      const candidates = [...form.querySelectorAll("[data-preview-target]")];
      const current = candidates
        .filter(item => item.getBoundingClientRect().top <= formTop)
        .pop() || candidates[0];
      scrollPreviewTo(current?.dataset.previewTarget, false);
    });
  }, { passive: true });
}

function sectionEditor(projectIndex, sectionIndex, section) {
  return `
    <div class="section-editor" data-preview-target="detail-${sectionIndex + 1}">
      <div class="section-row">
        <select data-section-type="${projectIndex}:${sectionIndex}">
          ${["overview", "showcase", "architecture", "gallery", "features", "timeline", "code", "video", "media"].map(type => `<option value="${type}" ${section.type === type ? "selected" : ""}>${sectionLabel(type)}</option>`).join("")}
        </select>
        <input value="${escapeAttr(section.title || "")}" data-section-title="${projectIndex}:${sectionIndex}" placeholder="섹션 제목">
        <button class="btn danger small" data-delete-section="${projectIndex}:${sectionIndex}" type="button">삭제</button>
      </div>
      ${sectionFields(projectIndex, sectionIndex, section)}
    </div>
  `;
}

function sectionLabel(type) {
  if (type === "showcase") return "포트폴리오 쇼케이스";
  if (type === "architecture") return "시스템 구조도";
  return {
    overview: "텍스트 소개",
    gallery: "이미지 갤러리",
    features: "주요 기능",
    timeline: "개발 과정",
    code: "코드",
    video: "영상 링크",
    media: "이미지/영상 + 설명"
  }[type] || type;
}

function showcaseLayoutOptions(current) {
  return [
    ["media-left", "이미지 왼쪽 / 설명 오른쪽"],
    ["media-right", "설명 왼쪽 / 이미지 오른쪽"],
    ["stacked", "위아래 정렬"],
    ["bento", "포트폴리오 벤토형"]
  ].map(([value, label]) => `<option value="${value}" ${current === value ? "selected" : ""}>${label}</option>`).join("");
}

function showcaseBlockEditor(projectIndex, sectionIndex, blockIndex, block) {
  const key = `${projectIndex}:${sectionIndex}:${blockIndex}`;
  return `
    <article class="showcase-editor-block" draggable="true" data-showcase-drag="${key}">
      <div class="showcase-editor-head">
        <strong>${escapeHTML(block.title || `블록 ${blockIndex + 1}`)}</strong>
        <div>
          <button class="btn small" type="button" data-showcase-move="${key}:up">위로</button>
          <button class="btn small" type="button" data-showcase-move="${key}:down">아래로</button>
          <button class="btn danger small" type="button" data-delete-showcase-block="${key}">삭제</button>
        </div>
      </div>
      <div class="form-grid">
        <label>블록 종류
          <select data-showcase-field="${key}:kind">
            <option value="media" ${(block.kind || "text") === "media" ? "selected" : ""}>이미지/GIF/영상 + 설명</option>
            <option value="text" ${(block.kind || "text") === "text" ? "selected" : ""}>설명 중심</option>
          </select>
        </label>
        <label>블록 크기
          <select data-showcase-field="${key}:size">
            <option value="normal" ${(block.size || "normal") === "normal" ? "selected" : ""}>기본</option>
            <option value="feature" ${block.size === "feature" ? "selected" : ""}>강조 크게</option>
            <option value="wide" ${block.size === "wide" ? "selected" : ""}>가로 넓게</option>
          </select>
        </label>
        <label class="wide">제목<input data-showcase-field="${key}:title" value="${escapeAttr(block.title || "")}" placeholder="예: 자동 전투 GIF 자리"></label>
        <label class="wide">미디어 URL 또는 업로드 결과<input data-showcase-field="${key}:media" value="${escapeAttr(block.media || "")}" placeholder="이미지/GIF/MP4 URL"></label>
        <div class="wide">${uploadBox("이 블록에 넣을 이미지/GIF/영상", block.media || "", data => {
          DATA.projects[projectIndex].sections[sectionIndex].blocks[blockIndex].media = data;
        })}</div>
        <label class="wide">설명<textarea data-showcase-field="${key}:text" placeholder="이 장면이 어떤 구현을 증명하는지 적어주세요.">${escapeHTML(block.text || "")}</textarea></label>
        <label class="wide">캡션 / 이미지 가이드<textarea data-showcase-field="${key}:caption" placeholder="예: 자동 전투가 5~8초 정도 보이는 GIF 권장">${escapeHTML(block.caption || "")}</textarea></label>
      </div>
    </article>
  `;
}

function sectionFields(projectIndex, sectionIndex, section) {
  const key = `${projectIndex}:${sectionIndex}`;
  if (section.type === "showcase") {
    section.blocks = Array.isArray(section.blocks) ? section.blocks : [];
    return `
      <div class="form-grid">
        <label>배치 방식
          <select data-showcase-section="${key}:layout">${showcaseLayoutOptions(section.layout || "media-left")}</select>
        </label>
        <label>편집 안내<input value="이미지/GIF는 구현을 증명하는 장면에 넣고, 설명에는 목적과 구현 포인트를 적어주세요." readonly></label>
      </div>
      <div class="showcase-editor-list">
        ${section.blocks.map((block, blockIndex) => showcaseBlockEditor(projectIndex, sectionIndex, blockIndex, block)).join("")}
      </div>
      <button class="btn small" type="button" data-add-showcase-block="${key}">+ 쇼케이스 블록 추가</button>
    `;
  }
  if (section.type === "architecture") {
    return `
      <div class="form-grid">
        <label>왼쪽 제목<input data-architecture-field="${key}:flowTitle" value="${escapeAttr(section.flowTitle || "")}" placeholder="Game Loop Flow"></label>
        <label>오른쪽 제목<input data-architecture-field="${key}:systemTitle" value="${escapeAttr(section.systemTitle || "")}" placeholder="Runtime System"></label>
      </div>
      <label>게임 흐름<textarea data-architecture-list="${key}:flow" placeholder="Ready|캐릭터 배치 및 준비&#10;Play|자동 전투와 몬스터 스폰">${escapeHTML((section.flow || []).join("\n"))}</textarea></label>
      <label>런타임 시스템<textarea data-architecture-list="${key}:systems" placeholder="StageManager|상태 전환 관리&#10;Spawner|몬스터 생성">${escapeHTML((section.systems || []).join("\n"))}</textarea></label>
      <label>하단 핵심 영역<textarea data-architecture-list="${key}:domains" placeholder="Combat|전투 판정과 스킬&#10;Save|Firebase 저장">${escapeHTML((section.domains || []).join("\n"))}</textarea></label>
      <label>핵심 설계 메모<textarea data-architecture-field="${key}:note" placeholder="핵심 설계 설명을 입력하세요.">${escapeHTML(section.note || "")}</textarea></label>
    `;
  }
  if (section.type === "gallery") {
    return `
      ${uploadBox("갤러리 이미지/GIF 추가", "", data => {
        const target = DATA.projects[projectIndex].sections[sectionIndex];
        target.images = Array.isArray(target.images) ? target.images : [];
        target.images.push(data);
      })}
      <textarea data-gallery="${key}" placeholder="이미지 URL을 줄마다 입력">${escapeHTML((section.images || []).join("\n"))}</textarea>
    `;
  }
  if (section.type === "features") {
    return `<textarea data-features="${key}" placeholder="주요 기능을 줄마다 입력">${escapeHTML((section.features || []).join("\n"))}</textarea>`;
  }
  if (section.type === "timeline") {
    return `<textarea data-timeline="${key}" placeholder="개발 과정을 줄마다 입력">${escapeHTML((section.items || []).join("\n"))}</textarea>`;
  }
  if (section.type === "code") {
    return `<textarea data-code="${key}" placeholder="코드를 입력">${escapeHTML(section.code || "")}</textarea>`;
  }
  if (section.type === "video") {
    return `
      ${uploadBox("MP4/WebM 영상 업로드", section.url || "", data => { DATA.projects[projectIndex].sections[sectionIndex].url = data; }, "video/mp4,video/webm,video/ogg")}
      <input data-section-url="${key}" value="${escapeAttr(section.url || "")}" placeholder="YouTube, MP4, WebM 링크">
    `;
  }
  if (section.type === "media") {
    return `
      ${uploadBox("이미지/GIF/영상 업로드", section.url || "", data => { DATA.projects[projectIndex].sections[sectionIndex].url = data; })}
      <input data-section-url="${key}" value="${escapeAttr(section.url || "")}" placeholder="이미지/GIF/MP4 URL">
      <textarea data-section-text="${key}" placeholder="미디어 설명">${escapeHTML(section.text || "")}</textarea>
    `;
  }
  return `<textarea data-section-text="${key}" placeholder="상세 설명을 입력">${escapeHTML(section.text || "")}</textarea>`;
}

function iconPresetOptions(current) {
  const values = new Set(SKILL_ICON_PRESETS.map(([value]) => value));
  const extra = current && !values.has(current) ? [[current, `${current} 현재값`]] : [];
  return [...extra, ...SKILL_ICON_PRESETS].map(([value, label]) => `
    <option value="${escapeAttr(value)}" ${current === value ? "selected" : ""}>${escapeHTML(label)} (${escapeHTML(value)})</option>
  `).join("");
}

function renderSkillEditor() {
  $("skillEditor").innerHTML = DATA.skills.map((skill, index) => `
    <article class="editor-card compact-editor">
      <div class="editor-head">
        <h3>${escapeHTML(skill.name || "새 기술")}</h3>
        <button class="btn danger small" data-delete-skill="${index}" type="button">삭제</button>
      </div>
      <div class="form-grid">
        <label>아이콘 선택<select data-skill="${index}" data-field="icon">${iconPresetOptions(skill.icon)}</select></label>
        <div class="wide icon-picker" data-icon-picker="${index}">
          ${SKILL_ICON_PRESETS.map(([value, label]) => `
            <button type="button" class="${skill.icon === value ? "active" : ""}" data-pick-skill-icon="${index}" data-icon-value="${escapeAttr(value)}" title="${escapeAttr(label)}">
              ${iconSVG(value)}
              <span>${escapeHTML(label)}</span>
            </button>
          `).join("")}
        </div>
        <label>이름<input value="${escapeAttr(skill.name)}" data-skill="${index}" data-field="name"></label>
        <label class="wide">설명<input value="${escapeAttr(skill.desc)}" data-skill="${index}" data-field="desc"></label>
      </div>
    </article>
  `).join("");
}

function addProject() {
  const project = {
    title: "New Project",
    category: "2D",
    summary: "프로젝트 요약을 입력하세요.",
    thumb: "",
    tags: ["Unity"],
    status: "비공개",
    date: new Date().toISOString().slice(0, 10).replaceAll("-", "."),
    role: "Unity Client Developer",
    period: "",
    team: "개인",
    platform: "PC",
    genre: "Game",
    contribution: "핵심 시스템 구현",
    responsibilities: ["담당 업무를 입력하세요."],
    coreSystems: ["핵심 구현 내용을 입력하세요."],
    problems: ["문제 해결 과정을 입력하세요."],
    learned: "프로젝트를 통해 배운 점을 입력하세요.",
    links: [],
    sections: [{ type: "overview", title: "게임 소개", text: "게임의 목표, 플레이 방식, 직접 구현한 핵심 시스템을 포트폴리오 문장으로 정리하세요." }]
  };
  DATA.projects.push(project);
  const projectIndex = DATA.projects.length - 1;
  renderEditors();
  openTab("projects");
  openProjectEditor(projectIndex);
}

function addSection(projectIndex) {
  DATA.projects[projectIndex].sections = DATA.projects[projectIndex].sections || [];
  DATA.projects[projectIndex].sections.push(defaultSection("showcase"));
  renderProjectEditor();
  openProjectEditor(projectIndex);
}

function bindAdminEvents() {
  $("loginBtn").addEventListener("click", tryLogin);
  $("adminPassword").addEventListener("keydown", event => {
    if (event.key === "Enter") tryLogin();
    $("adminPassword").classList.remove("invalid");
  });
  $("saveAll").addEventListener("click", saveAll);
  $("addProject").addEventListener("click", addProject);
  $("addSkill").addEventListener("click", () => {
    DATA.skills.push({ icon: "GAME", name: "New Skill", desc: "설명을 입력하세요." });
    renderEditors();
  });
  $("logoutBtn").addEventListener("click", () => {
    setAdminSession(false);
    location.reload();
  });
  $("resetBtn").addEventListener("click", () => {
    if (!confirm("저장된 포트폴리오 데이터를 초기화할까요?")) return;
    localStorage.removeItem(STORAGE_KEY);
    DATA = loadData();
    bindForm();
    renderEditors();
    toast("초기화했습니다.");
  });
  $("changePassword").addEventListener("click", () => {
    const value = $("newPassword").value.trim();
    if (value.length < 4) {
      toast("비밀번호는 4자 이상으로 입력하세요.");
      return;
    }
    localStorage.setItem(ADMIN_PASSWORD_KEY, value);
    $("newPassword").value = "";
    toast("비밀번호를 변경했습니다.");
  });

  document.querySelectorAll(".side-btn[data-tab], [data-open-tab]").forEach(button => {
    button.addEventListener("click", () => openTab(button.dataset.tab || button.dataset.openTab));
  });

  document.addEventListener("input", event => {
    const target = event.target;
    if (target.id === "adminProjectSearch") {
      ADMIN_PROJECT_SEARCH = target.value;
      renderProjectEditor();
      const search = $("adminProjectSearch");
      if (search) {
        search.focus();
        search.setSelectionRange(search.value.length, search.value.length);
      }
    } else if (target.dataset.project) {
      updateProject(Number(target.dataset.project), target.dataset.field, target.value);
    } else if (target.dataset.projectTags) {
      DATA.projects[Number(target.dataset.projectTags)].tags = target.value.split(",").map(item => item.trim()).filter(Boolean);
    } else if (target.dataset.projectLines) {
      DATA.projects[Number(target.dataset.projectLines)][target.dataset.field] = target.value.split("\n").map(item => item.trim()).filter(Boolean);
    } else if (target.dataset.projectText) {
      DATA.projects[Number(target.dataset.projectText)][target.dataset.field] = target.value;
    } else if (target.dataset.projectLinks) {
      DATA.projects[Number(target.dataset.projectLinks)].links = target.value.split("\n").map(line => {
        const [label, ...urlParts] = line.split("|");
        return { label: (label || "").trim(), url: urlParts.join("|").trim() };
      }).filter(link => link.label || link.url);
    } else if (target.dataset.skill) {
      DATA.skills[Number(target.dataset.skill)][target.dataset.field] = target.value;
    } else if (target.dataset.sectionTitle) {
      const [projectIndex, sectionIndex] = target.dataset.sectionTitle.split(":").map(Number);
      DATA.projects[projectIndex].sections[sectionIndex].title = target.value;
    } else if (target.dataset.sectionText) {
      const [projectIndex, sectionIndex] = target.dataset.sectionText.split(":").map(Number);
      DATA.projects[projectIndex].sections[sectionIndex].text = target.value;
    } else if (target.dataset.sectionUrl) {
      const [projectIndex, sectionIndex] = target.dataset.sectionUrl.split(":").map(Number);
      DATA.projects[projectIndex].sections[sectionIndex].url = target.value;
    } else if (target.dataset.architectureField) {
      const [projectIndex, sectionIndex, field] = target.dataset.architectureField.split(":");
      DATA.projects[Number(projectIndex)].sections[Number(sectionIndex)][field] = target.value;
    } else if (target.dataset.architectureList) {
      const [projectIndex, sectionIndex, field] = target.dataset.architectureList.split(":");
      DATA.projects[Number(projectIndex)].sections[Number(sectionIndex)][field] = target.value.split("\n").map(item => item.trim()).filter(Boolean);
    } else if (target.dataset.showcaseSection) {
      const [projectIndex, sectionIndex, field] = target.dataset.showcaseSection.split(":");
      DATA.projects[Number(projectIndex)].sections[Number(sectionIndex)][field] = target.value;
    } else if (target.dataset.showcaseField) {
      const [projectIndex, sectionIndex, blockIndex, field] = target.dataset.showcaseField.split(":");
      DATA.projects[Number(projectIndex)].sections[Number(sectionIndex)].blocks[Number(blockIndex)][field] = target.value;
    } else if (target.dataset.gallery) {
      const [projectIndex, sectionIndex] = target.dataset.gallery.split(":").map(Number);
      DATA.projects[projectIndex].sections[sectionIndex].images = target.value.split("\n").map(item => item.trim()).filter(Boolean);
    } else if (target.dataset.features) {
      const [projectIndex, sectionIndex] = target.dataset.features.split(":").map(Number);
      DATA.projects[projectIndex].sections[sectionIndex].features = target.value.split("\n").map(item => item.trim()).filter(Boolean);
    } else if (target.dataset.timeline) {
      const [projectIndex, sectionIndex] = target.dataset.timeline.split(":").map(Number);
      DATA.projects[projectIndex].sections[sectionIndex].items = target.value.split("\n").map(item => item.trim()).filter(Boolean);
    } else if (target.dataset.code) {
      const [projectIndex, sectionIndex] = target.dataset.code.split(":").map(Number);
      DATA.projects[projectIndex].sections[sectionIndex].code = target.value;
    }
    refreshProjectEditorPreview();
    requestAnimationFrame(() => scrollPreviewTo(previewTargetForEditorElement(target), false));
  });

  document.addEventListener("change", event => {
    const target = event.target;
    if (target.dataset.skill) {
      DATA.skills[Number(target.dataset.skill)][target.dataset.field] = target.value;
      renderDashboard();
    }
    if (["fTheme", "fAccent", "fBackground", "fRadius", "fFeaturedProject", "fSoundDefaultOn", "fBgmUrl"].includes(target.id)) {
      collectForm();
      applyTheme();
      renderDashboard();
    }
    if (target.dataset.sectionType) {
      const [projectIndex, sectionIndex] = target.dataset.sectionType.split(":").map(Number);
      DATA.projects[projectIndex].sections[sectionIndex] = defaultSection(target.value);
      renderProjectEditor();
      openProjectEditor(projectIndex);
    }
    if (target.dataset.showcaseSection) {
      const [projectIndex, sectionIndex, field] = target.dataset.showcaseSection.split(":");
      DATA.projects[Number(projectIndex)].sections[Number(sectionIndex)][field] = target.value;
      refreshProjectEditorPreview();
    }
    if (target.dataset.showcaseField) {
      const [projectIndex, sectionIndex, blockIndex, field] = target.dataset.showcaseField.split(":");
      DATA.projects[Number(projectIndex)].sections[Number(sectionIndex)].blocks[Number(blockIndex)][field] = target.value;
      refreshProjectEditorPreview();
    }
  });

  document.addEventListener("click", event => {
    const editProject = event.target.closest("[data-edit-project]");
    const previewProject = event.target.closest("[data-preview-project]");
    const closeProjectEditorButton = event.target.closest("[data-close-project-editor]");
    const deleteProject = event.target.closest("[data-delete-project]");
    const duplicateProject = event.target.closest("[data-duplicate-project]");
    const pickSkillIcon = event.target.closest("[data-pick-skill-icon]");
    const deleteSkill = event.target.closest("[data-delete-skill]");
    const addSectionButton = event.target.closest("[data-add-section]");
    const deleteSection = event.target.closest("[data-delete-section]");
    const addShowcaseBlock = event.target.closest("[data-add-showcase-block]");
    const deleteShowcaseBlock = event.target.closest("[data-delete-showcase-block]");
    const moveShowcaseBlock = event.target.closest("[data-showcase-move]");
    if (editProject) openProjectEditor(Number(editProject.dataset.editProject));
    if (previewProject && !editProject) openProjectEditor(Number(previewProject.dataset.previewProject));
    if (closeProjectEditorButton) closeProjectEditor();
    if (event.target.closest("#saveProjectEditor")) {
      collectForm();
      if (!saveData(DATA)) {
        toast("저장 공간이 부족합니다. 큰 이미지/GIF는 URL로 넣어주세요.");
        return;
      }
      renderEditors();
      if (ACTIVE_ADMIN_PROJECT_INDEX !== null) openProjectEditor(ACTIVE_ADMIN_PROJECT_INDEX);
      toast("프로젝트를 저장했습니다.");
    }
    if (deleteProject) {
      DATA.projects.splice(Number(deleteProject.dataset.deleteProject), 1);
      closeProjectEditor();
      renderEditors();
    }
    if (duplicateProject) {
      const index = Number(duplicateProject.dataset.duplicateProject);
      const copy = JSON.parse(JSON.stringify(DATA.projects[index]));
      copy.title = `${copy.title || "Project"} Copy`;
      DATA.projects.splice(index + 1, 0, copy);
      renderEditors();
      openProjectEditor(index + 1);
      toast("프로젝트를 복제했습니다.");
    }
    if (pickSkillIcon) {
      const index = Number(pickSkillIcon.dataset.pickSkillIcon);
      DATA.skills[index].icon = pickSkillIcon.dataset.iconValue;
      renderSkillEditor();
      renderDashboard();
    }
    if (deleteSkill) {
      DATA.skills.splice(Number(deleteSkill.dataset.deleteSkill), 1);
      renderEditors();
    }
    if (addSectionButton) addSection(Number(addSectionButton.dataset.addSection));
    if (addShowcaseBlock) {
      const [projectIndex, sectionIndex] = addShowcaseBlock.dataset.addShowcaseBlock.split(":").map(Number);
      const section = DATA.projects[projectIndex].sections[sectionIndex];
      section.blocks = Array.isArray(section.blocks) ? section.blocks : [];
      section.blocks.push({ kind: "media", title: "이미지/GIF 자리", media: "", text: "이 장면으로 보여줄 구현 내용을 적어주세요.", caption: "권장: 5~8초 GIF 또는 핵심 UI 스크린샷" });
      renderProjectEditor();
      openProjectEditor(projectIndex);
    }
    if (deleteShowcaseBlock) {
      const [projectIndex, sectionIndex, blockIndex] = deleteShowcaseBlock.dataset.deleteShowcaseBlock.split(":").map(Number);
      DATA.projects[projectIndex].sections[sectionIndex].blocks.splice(blockIndex, 1);
      renderProjectEditor();
      openProjectEditor(projectIndex);
    }
    if (moveShowcaseBlock) {
      const [projectIndex, sectionIndex, blockIndex, direction] = moveShowcaseBlock.dataset.showcaseMove.split(":");
      moveShowcaseBlockItem(Number(projectIndex), Number(sectionIndex), Number(blockIndex), direction === "up" ? -1 : 1);
      renderProjectEditor();
      openProjectEditor(Number(projectIndex));
    }
    if (deleteSection) {
      const [projectIndex, sectionIndex] = deleteSection.dataset.deleteSection.split(":").map(Number);
      DATA.projects[projectIndex].sections.splice(sectionIndex, 1);
      renderProjectEditor();
      openProjectEditor(projectIndex);
      renderDashboard();
    }
  });

  document.addEventListener("dragstart", event => {
    const projectItem = event.target.closest("[data-project-drag]");
    if (projectItem) {
      event.dataTransfer.setData("text/project-index", projectItem.dataset.projectDrag);
      event.dataTransfer.effectAllowed = "move";
      projectItem.classList.add("dragging");
      return;
    }
    const block = event.target.closest("[data-showcase-drag]");
    if (!block) return;
    event.dataTransfer.setData("text/plain", block.dataset.showcaseDrag);
    event.dataTransfer.effectAllowed = "move";
    block.classList.add("dragging");
  });

  document.addEventListener("dragend", event => {
    const projectItem = event.target.closest("[data-project-drag]");
    if (projectItem) projectItem.classList.remove("dragging");
    const block = event.target.closest("[data-showcase-drag]");
    if (block) block.classList.remove("dragging");
  });

  document.addEventListener("dragover", event => {
    if (event.target.closest("[data-project-drag]")) event.preventDefault();
    if (event.target.closest("[data-showcase-drag]")) event.preventDefault();
  });

  document.addEventListener("drop", event => {
    const targetProject = event.target.closest("[data-project-drag]");
    if (targetProject && event.dataTransfer.types.includes("text/project-index")) {
      event.preventDefault();
      reorderProjects(Number(event.dataTransfer.getData("text/project-index")), Number(targetProject.dataset.projectDrag));
      return;
    }
    const targetBlock = event.target.closest("[data-showcase-drag]");
    if (!targetBlock) return;
    event.preventDefault();
    const from = event.dataTransfer.getData("text/plain");
    const to = targetBlock.dataset.showcaseDrag;
    reorderShowcaseBlocks(from, to);
  });

  document.addEventListener("keydown", event => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "s") {
      event.preventDefault();
      collectForm();
      if (!saveData(DATA)) {
        toast("저장 공간이 부족합니다. 큰 이미지/GIF는 URL로 넣어주세요.");
        return;
      }
      renderDashboard();
      refreshProjectEditorPreview();
      toast("저장했습니다.");
    }
    if (event.key === "Escape" && $("adminProjectModal")?.classList.contains("open")) {
      closeProjectEditor();
    }
  });
}

function moveShowcaseBlockItem(projectIndex, sectionIndex, blockIndex, offset) {
  const blocks = DATA.projects[projectIndex]?.sections?.[sectionIndex]?.blocks;
  if (!Array.isArray(blocks)) return;
  const nextIndex = blockIndex + offset;
  if (nextIndex < 0 || nextIndex >= blocks.length) return;
  const [item] = blocks.splice(blockIndex, 1);
  blocks.splice(nextIndex, 0, item);
}

function reorderShowcaseBlocks(fromKey, toKey) {
  const [fromProject, fromSection, fromBlock] = fromKey.split(":").map(Number);
  const [toProject, toSection, toBlock] = toKey.split(":").map(Number);
  if (fromProject !== toProject || fromSection !== toSection || fromBlock === toBlock) return;
  const blocks = DATA.projects[fromProject]?.sections?.[fromSection]?.blocks;
  if (!Array.isArray(blocks)) return;
  const [item] = blocks.splice(fromBlock, 1);
  blocks.splice(toBlock, 0, item);
  renderProjectEditor();
  openProjectEditor(fromProject);
}

function reorderProjects(fromIndex, toIndex) {
  if (!Number.isInteger(fromIndex) || !Number.isInteger(toIndex) || fromIndex === toIndex) return;
  if (fromIndex < 0 || toIndex < 0 || fromIndex >= DATA.projects.length || toIndex >= DATA.projects.length) return;
  const featuredProject = DATA.projects[DATA.featuredIndex] || null;
  const [item] = DATA.projects.splice(fromIndex, 1);
  DATA.projects.splice(toIndex, 0, item);
  if (featuredProject) DATA.featuredIndex = DATA.projects.indexOf(featuredProject);
  renderProjectEditor();
  renderDashboard();
  toast("프로젝트 순서를 변경했습니다.");
}

function defaultSection(type) {
  if (type === "showcase") {
    return {
      type,
      title: "포트폴리오 쇼케이스",
      layout: "media-left",
      blocks: [
        { kind: "media", title: "이미지/GIF 자리", media: "", text: "이 장면으로 보여줄 구현 내용을 적어주세요.", caption: "권장: 5~8초 GIF 또는 핵심 UI 스크린샷" },
        { kind: "text", title: "구현 설명", text: "왜 이 기능을 만들었고, 어떤 코드 구조로 해결했는지 적어주세요.", caption: "" }
      ]
    };
  }
  if (type === "architecture") {
    return {
      type,
      title: "시스템 구조도",
      flowTitle: "Game Loop Flow",
      systemTitle: "Runtime System",
      flow: ["Ready|게임 준비", "Play|핵심 플레이", "Result|결과 처리"],
      systems: ["GameManager|전체 흐름 관리", "Player|입력과 전투", "UI|화면 피드백"],
      domains: ["Combat|전투", "Data|데이터", "Reward|보상"],
      note: "핵심 설계 메모를 입력하세요."
    };
  }
  if (type === "gallery") return { type, title: "갤러리", images: [] };
  if (type === "features") return { type, title: "주요 구현", features: ["기능을 입력하세요"] };
  if (type === "timeline") return { type, title: "개발 과정", items: ["단계를 입력하세요"] };
  if (type === "code") return { type, title: "코드 예시", code: "" };
  if (type === "video") return { type, title: "영상", url: "" };
  if (type === "media") return { type, title: "미디어", url: "", text: "" };
  return { type: "overview", title: "게임 소개", text: "" };
}

migratePassword();
bindAdminEvents();
if (isAdminSession()) enterAdmin();
