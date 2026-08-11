const STORAGE_KEY = "khanuelPortfolioData";
const $ = id => document.getElementById(id);

function isBrokenText(value) {
  return /[�筌癰揶獄紐諛袁夷]/.test(String(value || ""));
}

const DEFAULT_DATA = {
  brand: "KHANEUL",
  hello: "안녕하세요!",
  name: "KIM HANEUL",
  role: "Unity Client Developer",
  desc: "게임을 사랑하고, 플레이어에게 즐거움을 주는 게임을 만들기 위해 고민하는 개발자입니다.",
  profileAvatar: "assets/profile-photo.jpg",
  profileLocation: "Asia/Seoul",
  profileLanguages: ["한국어", "영어"],
  character: "assets/character.png",
  theme: "#8a4dff",
  accent: "#45c7ff",
  background: "night",
  radius: "8",
  soundDefaultOn: true,
  bgmUrl: "assets/bgm-mirostar-beats-of-world.mp3",
  profileContentVersion: 6,
  chips: ["Unity", "C#", "Multiplayer", "Game Systems"],
  aboutTitle: "플레이 감각을 코드로 구현하는 개발자",
  aboutText: "Unity 클라이언트 개발을 중심으로 전투, UI, 네트워크, 게임 시스템을 설계하고 구현합니다. 작은 상호작용도 플레이어가 즐겁게 느낄 수 있도록 구조와 감각을 함께 다듬습니다.",
  aboutDetailTitle: "함께 즐기는 게임 경험을 설계하는 개발자",
  aboutDetailText: "저는 게임이 함께할 때 더 재미있어진다고 생각합니다. 그래서 혼자 즐기는 순간에도 누군가와 함께 성장하고 도전하고 결과를 나누고 싶어지는 구조를 중요하게 봅니다. Unity 클라이언트 개발을 중심으로 전투 시스템, UI 흐름, 데이터 구조, 플레이 피드백을 만들고 기능이 동작하는 것에서 끝나지 않도록 재미의 흐름까지 다듬고 싶습니다.",
  playPhilosophy: [
    ["함께하는 재미", "혼자 플레이해도 누군가와 같이 성장하고 도전하는 느낌이 남는 게임"],
    ["다시 모이는 이유", "다음 접속, 다음 판, 다음 목표가 자연스럽게 이어지는 성장 루프"],
    ["같이 웃는 순간", "성공과 실패가 이야기거리가 되고 친구와 공유하고 싶어지는 장면"],
    ["읽히는 피드백", "HP, 보상, 스킬, 결과가 바로 이해되어 플레이 흐름을 놓치지 않는 표시"]
  ],
  aboutStrengths: ["게임 시스템 설계", "Unity 클라이언트 구현", "플레이 피드백 개선", "문제 추적과 디버깅"],
  awards: [],
  education: [
    "전주대학교 게임콘텐츠학과 졸업",
    "오즈코딩 게임개발 5기 수료 - AI를 활용한 차세대 스마트 게임 개발자 양성과정 (2026.02 ~ 2026.08)",
    "일본 연수 5일"
  ],
  certificates: [
    { title: "Certified User Programmer", issuer: "Certiport", date: "2025.01.27", desc: "Unity 기본 기능과 C# 스크립팅 활용 역량을 검증한 자격입니다." },
    { title: "Visual Design", issuer: "Certiport", date: "2024.10.08", desc: "화면 구성, 색감, 레이아웃 등 시각 디자인 기본 역량을 검증한 자격입니다." },
    { title: "Video Design", issuer: "Certiport", date: "2024.11.22", desc: "영상 구성과 편집 흐름을 이해하고 시연 자료를 제작할 수 있는 역량을 검증한 자격입니다." },
    { title: "Visual Design Using Adobe Photoshop", issuer: "Certiport", date: "2024.09.27", desc: "Adobe Photoshop을 활용한 이미지 보정, 합성, UI/홍보 이미지 제작 역량을 검증한 자격입니다." },
    { title: "Graphic Design & Illustration Using Adobe Illustrator", issuer: "Certiport", date: "2024.10.08", desc: "Adobe Illustrator를 활용한 벡터 그래픽, 아이콘, 로고형 이미지 제작 역량을 검증한 자격입니다." },
    { title: "Digital Video Using Adobe Premiere Pro", issuer: "Certiport", date: "2024.11.15", desc: "Adobe Premiere Pro를 활용한 게임 플레이 영상 편집과 시연 영상 제작 역량을 검증한 자격입니다." },
    { title: "Visual Effects & Motion Graphics Using Adobe After Effects", issuer: "Certiport", date: "2024.11.22", desc: "Adobe After Effects를 활용한 모션 그래픽과 영상 효과 제작 역량을 검증한 자격입니다." }
  ],
  interests: ["게임플레이 프로그래밍", "전투 시스템", "멀티플레이", "UI/UX", "최적화"],
  activities: ["교내 게임잼 참가", "개인 게임 프로젝트 제작", "팀 기반 Unity 프로젝트", "프로토타입 반복 개발"],
  learning: ["Unity", "C#", "게임 시스템 설계", "UI/UX", "게임 최적화"],
  workStyle: ["작게 만들고 빠르게 테스트", "문제를 기록하고 원인을 추적", "플레이 감각을 우선 확인", "협업자가 이해하기 쉬운 코드 지향"],
  aboutGoal: "협업 속에서도 명확하게 소통하고, 플레이어가 오래 기억할 수 있는 게임 경험을 만드는 개발자가 되는 것이 목표입니다.",
  stats: [["프로젝트", "3+"], ["개발 경험", "2+ Years"], ["주요 엔진", "Unity"], ["관심 분야", "Gameplay"]],
  contact: { github: "https://github.com/haneul68", email: "k648087851@gmail.com", steam: "#" },
  skills: [
    { icon: "UNITY", name: "Unity", desc: "클라이언트 시스템 구현" },
    { icon: "C#", name: "C#", desc: "게임 로직과 객체지향 구조" },
    { icon: "NET", name: "Multiplayer", desc: "Photon / 네트워크 흐름" },
    { icon: "SYS", name: "Game Systems", desc: "전투 / 라운드 / UI" },
    { icon: "DB", name: "Firebase", desc: "저장 데이터 관리" },
    { icon: "GIT", name: "Git", desc: "버전 관리" }
  ],
  projects: [gnBancInterviewProjectTemplate()],
  featuredIndex: 0,
  projectImports: ["gn-banc"],
  workflow: [
    { icon: "PLAN", title: "기획 분석", desc: "플레이 흐름과 핵심 재미를 먼저 정리합니다." },
    { icon: "CODE", title: "시스템 구현", desc: "전투, UI, 데이터 구조를 모듈 단위로 만듭니다." },
    { icon: "TEST", title: "플레이 테스트", desc: "직접 플레이하며 조작감과 피드백을 다듬습니다." },
    { icon: "BUILD", title: "빌드 개선", desc: "최적화, 버그 수정, 플레이 흐름 개선을 반복합니다." }
  ]
};
function cloneDefaultData() {
  return JSON.parse(JSON.stringify(DEFAULT_DATA));
}

function gnBancInterviewProjectTemplate() {
  return {
    title: "GN Banc",
    category: "2D",
    summary: "Unity와 C#으로 제작한 개인 프로젝트 기반 모바일 방치형 수집 RPG입니다. 자동 전투, 성장/보상 루프, 던전, 오프라인 보상, Firebase 저장 구조를 중심으로 플레이어가 다시 접속하고 싶어지는 흐름을 설계했습니다.",
    thumb: "assets/project-gn-banc-title.png",
    heroImage: "assets/project-gn-banc-title.png",
    heroBg: "assets/project-gn-banc-title.png",
    tags: ["Unity", "C#", "Idle RPG", "Mobile", "Firebase", "Object Pooling"],
    status: "제작 기록",
    date: "2026.06.01",
    role: "Unity Client Developer",
    period: "개인 개발",
    team: "개인 프로젝트",
    platform: "Android",
    genre: "방치형 수집 RPG",
    contribution: "기획 의도, 전투 루프, 성장/보상, UI, 저장 구조 전반 구현",
    links: [{ label: "GitHub", url: "https://github.com/haneul68/GN_Banc_GIT" }, { label: "전체 플레이 영상", url: "https://drive.google.com/file/d/1VZyZFEL5aqi8Qik3seAI9TuwxHPVRjS5/view?usp=drive_link" }],
    portfolioTemplateVersion: 11,
    sections: [
      { type: "text", title: "프로젝트 개요", keywords: ["Unity", "C#", "Idle RPG", "Firebase", "Android", "Object Pooling"], text: "GN Banc는 캐릭터를 배치하면 자동 전투가 진행되고, 스테이지 클리어와 던전 보상을 통해 캐릭터와 유물, 스탯을 성장시키는 모바일 방치형 수집 RPG입니다. 자동 전투 자체보다 플레이어가 다시 접속하고 성장 결과를 확인하고 싶어지는 반복 구조를 직접 설계하는 데 목적을 두었습니다." },
      { type: "text", title: "게임 소개", keywords: ["자동 전투", "영웅 수집", "성장 루프", "던전 보상", "오프라인 보상"], text: "플레이어는 여러 영웅을 수집하고 배치해 자동 전투를 진행합니다. 전투에서 얻은 재화와 던전 보상은 캐릭터 성장, 스탯 강화, 유물 획득으로 이어지고, 성장 결과는 다시 더 높은 스테이지 진행으로 연결됩니다. 이 프로젝트는 반복 성장 루프와 저장/보상 피드백을 직접 구현해보는 것을 목표로 만들었습니다." },
      { type: "showcase", title: "한눈에 보기", layout: "media-left", blocks: [{ kind: "media", size: "large", media: "assets/project-gn-banc-combat-flow.gif", title: "대표 플레이 장면", text: "캐릭터 편성, 자동 전투, 보스 등장, 보상 획득으로 이어지는 GN Banc의 핵심 플레이 흐름입니다.", caption: "자동 전투와 성장 루프가 가장 잘 드러나는 대표 장면" }, { kind: "text", size: "normal", title: "제작 목적", text: "방치형 RPG에서 중요한 반복 구조인 자동 전투, 보상, 성장, 저장을 직접 구현하며 모바일 RPG의 기본 사이클을 이해하는 것을 목표로 했습니다." }, { kind: "text", size: "normal", title: "핵심 경험", text: "전투 한 장면뿐 아니라 성장 UI, 던전, 오프라인 보상, 저장까지 이어지는 전체 루프를 하나의 프로젝트 안에서 구성했습니다." }] },
      { type: "showcase", title: "플레이 화면", layout: "media-left", blocks: [{ kind: "media", size: "large", media: "assets/project-gn-banc-hero-upgrade.gif", title: "영웅 장착과 강화", text: "영웅 상세 정보, 능력치, 스킬 설명, 장착/강화 버튼을 한 흐름 안에서 확인할 수 있도록 구성했습니다.", caption: "영웅 선택부터 장착과 강화 판단까지 이어지는 성장 화면" }, { kind: "text", size: "normal", title: "성장 루프", text: "전투 보상으로 얻은 재화를 영웅 강화와 스탯 성장에 다시 사용하게 만들어, 전투 결과가 다음 플레이 목표로 자연스럽게 이어지도록 설계했습니다." }, { kind: "text", size: "normal", title: "UI 피드백", text: "등급, 현재 능력치, 상승 수치, 스킬 정보를 같은 화면에서 확인하게 해 플레이어가 강화 여부를 빠르게 판단할 수 있도록 했습니다." }] },
      { type: "showcase", title: "던전과 보상 흐름", layout: "media-left", blocks: [{ kind: "media", size: "large", media: "assets/project-gn-banc-dungeon-reward.gif", title: "던전 진입 / 클리어 / 보상", text: "던전 진입 후 전투가 진행되고, 클리어 결과가 재화와 성장 데이터로 연결되는 흐름입니다.", caption: "던전 진행, 보스 게이지, 클리어 보상, 스탯 성장으로 이어지는 장면" }, { kind: "text", size: "normal", title: "보상 설계", text: "던전 보상은 단순 지급에서 끝나지 않고 공격력, 체력, 성장 재화와 연결되도록 구성해 반복 플레이의 목적을 만들었습니다." }, { kind: "text", size: "normal", title: "진행 상태", text: "보스 진행률, 현재 스테이지, 재화 변화, 강화 가능 상태를 화면에 노출해 플레이어가 다음 행동을 바로 선택할 수 있도록 했습니다." }] },
      { type: "architecture", title: "전체 시스템 구조", note: "전투 흐름은 StageManager가 중심에서 상태를 전환하고, 실제 기능은 Manager와 Character 계열 클래스가 나누어 담당합니다. 저장과 보상은 DataManager와 Firebase_Manager를 통해 분리해 전투 코드가 데이터 저장 방식에 직접 묶이지 않도록 구성했습니다.", flowTitle: "Play Loop", systemTitle: "Runtime Modules", flow: ["Start|Firebase 또는 테스트 데이터 초기화", "Prepare|보유 캐릭터 배치와 스테이지 준비", "Battle|자동 전투, 몬스터 스폰, 스킬 처리", "Reward|코인, 아이템, 던전 보상 지급", "Growth|강화, 영웅 성장, 다음 스테이지 진행"], systems: ["BaseManager|주요 매니저 접근점과 공통 코루틴 처리", "StageManager|Ready / Play / Boss / Clear / Dungeon 상태 전환", "Spawner|몬스터와 보스 생성, 전투 대상 리스트 관리", "Player / Monster|타겟 탐색, 공격, 피격, 사망 처리", "DataManager|캐릭터, 아이템, 유물, 진행 데이터 관리", "Firebase_Manager|익명 로그인, 저장, 불러오기"], domains: ["Combat|자동 타겟팅, 공격 판정, 스킬", "Growth|레벨, 스탯 강화, 영웅 성장", "Reward|재화, 아이템 드랍, 던전 보상", "UI|상점, 영웅, 인벤토리, 던전 화면", "Save|Firebase 저장, 오프라인 보상"] },
      { type: "features", title: "담당 구현", features: ["StageManager 기반 전투 상태 전환", "플레이어와 몬스터 전투 처리", "보상 지급과 성장 데이터 관리", "Firebase 저장/불러오기", "던전과 오프라인 보상 UI", "반복 생성 객체 풀링 구조"] },
      { type: "text", title: "핵심 구현", keywords: ["StageManager", "Spawner", "DataManager", "Firebase", "Object Pooling"], text: "전투 상태와 UI, 데이터 저장이 한곳에 섞이면 수정이 어려워지기 때문에 StageManager가 전투 진행 상태를 관리하고, Spawner는 몬스터 생성과 대상 리스트를 담당하도록 분리했습니다. 캐릭터, 아이템, 진행 데이터는 DataManager 중심으로 다루고, 저장/불러오기는 Firebase_Manager로 분리해 기능별 책임이 보이도록 구성했습니다." },
      { type: "text", title: "기술 포인트", keywords: ["전투 루프", "저장 구조", "보상 피드백", "모바일 흐름"], text: "방치형 게임은 전투가 자동으로 진행되기 때문에 플레이어가 지금 어떤 보상을 얻었고 어떤 성장이 일어났는지 바로 이해하는 것이 중요합니다. 그래서 전투 결과가 보상, 성장, 저장으로 자연스럽게 이어지도록 흐름을 나누고, 반복 생성되는 몬스터와 보상 처리는 관리 지점이 분산되지 않도록 구조화했습니다." },
      { type: "features", title: "문제 해결 경험", features: ["전투 상태가 UI와 데이터 처리에 섞이지 않도록 StageManager 중심으로 정리", "반복 생성 객체는 풀링 구조로 관리해 생성 비용 감소", "캐릭터/아이템/진행 데이터는 DataManager 중심으로 분리", "접속 종료 후 보상 흐름은 Firebase 저장 구조와 연결", "성장 결과가 즉시 읽히도록 보상 UI와 데이터 갱신 순서 조정"] },
      { type: "text", title: "배운 점", text: "기능을 각각 구현하는 것보다 전투 준비, 자동 전투, 보상, 성장, 저장이 어떤 순서로 이어져 플레이어 경험을 만드는지 설계하는 것이 중요하다는 점을 배웠습니다. 또한 방치형 게임에서는 자동 전투가 끝난 뒤에도 성장 결과가 명확히 남고, 다음 목표가 자연스럽게 보일 때 플레이를 계속 이어가고 싶어진다는 점을 확인했습니다." },
      { type: "text", title: "결과와 보완할 부분", text: "기본 전투 루프, 성장/보상 흐름, 던전, 오프라인 보상, Firebase 저장 구조를 하나의 모바일 RPG 흐름으로 연결했습니다. 이후에는 실제 플레이 데이터를 기준으로 성장 속도와 보상 밸런스를 조정하고, 전투 연출과 캐릭터 수집 동기를 더 강화할 계획입니다." }
    ]
  };
}

function extraProjectTemplates() {
  return [
    {
      title: "Chaos Arena",
      category: "3D",
      summary: "Photon Fusion 기반으로 제작한 2인 팀 프로젝트입니다. 기획 총괄과 플레이어 구현을 담당하며 이동, 대쉬, 기본 공격 콤보, 스킬 입력 구조, 라운드 전투 흐름, 로비와 인게임 UI를 구성했습니다.",
      thumb: "assets/project-chaos-arena.png",
      heroImage: "assets/project-chaos-arena.png",
      heroBg: "assets/project-chaos-arena.png",
      tags: ["Unity", "C#", "Photon Fusion", "3D Multiplayer", "Team Project", "Player Combat"],
      status: "제작 기록",
      date: "Bootcamp Project",
      role: "Unity Client Developer",
      period: "2인 프로젝트",
      team: "2인 팀 프로젝트",
      platform: "PC",
      genre: "3D Multiplayer Arena",
      contribution: "기획 총괄, 플레이어 이동/대쉬/공격/스킬 구조, 멀티플레이 동기화, 라운드 진행, 로비 및 인게임 UI 디자인",
      links: [
        { label: "GitHub", url: "https://github.com/Yongwankim1/Chaos-Arena" },
        { label: "플레이 영상", url: "https://drive.google.com/drive/folders/1pKR-7ToKYZ0Pp2ic_i1ULvNALnNmsVV0?usp=sharing" }
      ],
      portfolioTemplateVersion: 13,
      sections: [
        { type: "text", title: "프로젝트 개요", keywords: ["Unity", "C#", "Photon Fusion", "3D Arena", "2인 팀", "PC"], text: "Chaos Arena는 3D 아레나에서 캐릭터를 선택하고 라운드 단위로 전투를 진행하는 멀티플레이 액션 프로젝트입니다. 저는 프로젝트 기획을 총괄하고, 플레이어 조작과 전투 구조를 중심으로 구현했습니다. 플레이어 입력, 이동, 대쉬, 기본 공격 콤보, 스킬 입력 구조, 애니메이션 연동, 라운드 진행, 로비와 인게임 UI 디자인을 맡았습니다." },
        { type: "text", title: "게임 소개", keywords: ["방 생성", "로비", "캐릭터 선택", "라운드 전투", "스킬 액션"], text: "플레이어는 방을 만들거나 입장한 뒤 로비에서 팀과 캐릭터를 준비하고, 어쌔신·마법사·브루트 중 캐릭터를 선택해 전투에 진입합니다. 전투는 라운드 시간과 점수 흐름을 기준으로 진행되며, 캐릭터별 기본 공격과 Q/E/R 스킬, F 이동기를 활용해 상대와 교전하는 구조입니다." },
        { type: "showcase", title: "한눈에 보기", layout: "media-left", blocks: [
          { kind: "media", size: "feature", media: "assets/project-chaos-battle-scene.gif", title: "인게임 전투 장면", text: "라운드 시간, 팀 점수, 조준점, 체력과 마나, 스킬 키 안내가 함께 보이는 실제 전투 흐름입니다.", caption: "플레이어 조작과 상대 캐릭터의 스킬이 동시에 보이는 대표 전투 장면입니다." },
          { kind: "text", size: "normal", title: "제작 목적", text: "멀티플레이 전투에서 플레이어 입력이 이동, 애니메이션, 공격 판정, 스킬 사용으로 자연스럽게 이어지는 구조를 만드는 것을 목표로 했습니다." },
          { kind: "text", size: "normal", title: "핵심 경험", text: "Photon Fusion 환경에서 입력과 상태 권한을 분리하고, 공격·대쉬·스킬이 서로 충돌하지 않도록 플레이어 액션 흐름을 정리했습니다." }
        ] },
        { type: "showcase", title: "로비와 매치 진입", layout: "bento", blocks: [
          { kind: "media", size: "normal", media: "assets/project-chaos-main.png", title: "메인 화면", text: "방 생성과 입장 흐름이 시작되는 화면입니다." },
          { kind: "media", size: "normal", media: "assets/project-chaos-room-create.png", title: "방 만들기", text: "방 이름, 비밀번호, 인원, 맵을 설정해 매치를 생성합니다." },
          { kind: "media", size: "normal", media: "assets/project-chaos-lobby.png", title: "로비", text: "방 정보, 플레이어 슬롯, 캐릭터 준비 상태를 확인하는 공간입니다." },
          { kind: "media", size: "normal", media: "assets/project-chaos-character-select.png", title: "캐릭터 선택", text: "어쌔신, 마법사, 브루트 중 사용할 캐릭터를 선택합니다." }
        ] },
        { type: "architecture", title: "전체 시스템 구조", flowTitle: "Match Flow", systemTitle: "Runtime Modules", note: "플레이어 입력은 NetworkInputData로 모아지고, 실제 이동·공격·스킬 처리는 StateAuthority 기준으로 실행되도록 구성했습니다. 라운드 흐름은 RoundManager가 상태를 전환하고, 플레이어 전투는 Character 계열 클래스와 ActionLock으로 책임을 나누었습니다.", flow: ["Room|방 생성 또는 입장", "Lobby|플레이어 슬롯과 준비 상태 확인", "Select|캐릭터 선택", "Round|라운드 시간과 점수 기반 전투", "Result|라운드 결과와 다음 진행"], systems: ["NetworkInputData|이동, 시점, 점프, 스프린트, 공격, 대쉬, Q/E/R 입력 수집", "NetworkThirdPersonController|입력 기반 이동, 카메라 방향, 대쉬, 스킬 호출", "PlayerCharacter|HP, Mana, 팀, 사망, 부활, 버프 상태 관리", "CharacterCombat|기본 공격 콤보, 공격 판정, 투사체와 히트 피드백 처리", "CharacterActionLock|공격, 이동, 대쉬, 점프, 스킬 충돌 방지", "RoundManager|캐릭터 선택, 준비, 플레이, 점수와 라운드 상태 전환"], domains: ["Player Control|이동, 점프, 스프린트, 대쉬", "Combat|기본 공격 콤보, 히트박스, 피격 피드백", "Skill|Q/E/R 스킬 입력과 쿨타임/마나 처리", "Network|StateAuthority, RPC, 네트워크 입력", "UI|로비, 캐릭터 선택, 인게임 HUD"] },
        { type: "features", title: "담당 구현", features: ["기획 총괄과 게임 흐름 정리", "플레이어 이동, 점프, 스프린트, 대쉬 구현", "어쌔신과 브루트 기본 공격 및 스킬 구조 구현", "마법사 스킬을 제외한 플레이어 스킬 기본 구조 구현", "Photon Fusion 기반 플레이어 입력과 상태 동기화", "라운드 진행 흐름과 전투 상태 처리", "로비와 인게임 기본 UI 디자인"] },
        { type: "showcase", title: "플레이어 전투 구현", layout: "media-left", blocks: [
          { kind: "media", size: "feature", media: "assets/project-chaos-assassin-combo.gif", title: "어쌔신 기본 공격 콤보", text: "입력 타이밍에 따라 기본 공격이 이어지고, 애니메이션 이벤트 시점에 공격 판정이 발생하도록 구성했습니다.", caption: "콤보 입력 창, 공격 잠금, 히트박스 생성 흐름을 분리했습니다." },
          { kind: "text", size: "normal", title: "공격 판정", text: "CharacterCombat에서 AttackData를 기준으로 공격 범위, 데미지, 넉백, 이펙트, 피격 피드백을 처리했습니다. 팀 정보를 확인해 같은 팀에게 공격이 적용되지 않도록 분기했습니다." },
          { kind: "text", size: "normal", title: "브루트 전투", text: "어쌔신뿐 아니라 브루트의 기본 전투 흐름도 함께 구현했습니다. 캐릭터마다 공격 리듬과 판정 타이밍이 다르게 느껴지도록 입력 처리, 액션 제한, 애니메이션 이벤트 흐름을 맞췄습니다." }
        ] },
        { type: "showcase", title: "스킬과 이동기", layout: "bento", blocks: [
          { kind: "media", size: "normal", media: "assets/project-chaos-assassin-q.gif", title: "Q 스킬", text: "스킬 입력, 쿨타임, 마나 조건을 확인한 뒤 어쌔신의 투사체 흐름으로 연결합니다." },
          { kind: "media", size: "normal", media: "assets/project-chaos-assassin-e.gif", title: "E 스킬", text: "어쌔신의 근접 전투 흐름 안에서 스킬 사용과 액션 제한이 자연스럽게 이어지도록 구성했습니다." },
          { kind: "media", size: "normal", media: "assets/project-chaos-assassin-r.gif", title: "R 스킬", text: "궁극기 사용 중 상태와 액션 제한을 분리해 다른 입력과 충돌하지 않게 처리했습니다." },
          { kind: "media", size: "normal", media: "assets/project-chaos-assassin-dash.gif", title: "F 이동기", text: "CapsuleCast로 장애물을 확인하고, 대쉬 거리와 지속 시간을 기준으로 이동량을 계산했습니다." }
        ] },
        { type: "text", title: "멀티플레이 구현", keywords: ["Photon Fusion", "NetworkBehaviour", "INetworkInput", "StateAuthority", "RPC"], text: "NetworkInputData에 이동, 시점, 점프, 대쉬, Q/E/R 입력을 모아 전달하고, NetworkThirdPersonController가 해당 입력을 받아 플레이어 행동으로 변환합니다. 실제 상태 변경은 StateAuthority 기준으로 처리하고, 애니메이션과 이펙트처럼 다른 클라이언트에서도 보여야 하는 요소는 RPC로 동기화했습니다." },
        { type: "text", title: "라운드 진행", keywords: ["RoundManager", "Character Select", "Preparation", "Playing", "Score"], text: "RoundManager는 대기, 캐릭터 선택, 준비, 플레이 상태를 전환하며 라운드 시간과 점수 흐름을 관리합니다. 캐릭터 선택 이후 플레이어를 전투 위치로 이동시키고, 라운드 결과와 다음 진행이 자연스럽게 이어지도록 구성했습니다." },
        { type: "text", title: "UI 디자인", keywords: ["Lobby UI", "Room UI", "Character Select", "In-game HUD"], text: "로비와 인게임 기본 UI 디자인을 담당했습니다. 방 생성, 입장, 플레이어 슬롯, 캐릭터 선택, 라운드 점수, 체력과 마나, 스킬 키 안내처럼 전투 전후 흐름에서 플레이어가 필요한 정보를 빠르게 확인할 수 있게 구성했습니다." },
        { type: "features", title: "문제 해결 경험", features: ["공격, 대쉬, 스킬 입력이 겹치지 않도록 CharacterActionLock으로 액션 제한 관리", "StateAuthority 기준으로 실제 전투 상태를 처리해 클라이언트별 결과 차이를 줄임", "콤보 입력 창과 애니메이션 이벤트를 분리해 공격 타이밍을 조절", "대쉬 중 장애물 관통을 막기 위해 CapsuleCast 기반 거리 보정 적용", "라운드 상태를 RoundManager로 모아 UI와 전투 흐름을 함께 관리"] },
        { type: "text", title: "배운 점", text: "멀티플레이 전투에서는 기능을 단순히 실행하는 것보다 입력, 권한, 애니메이션, 판정, UI가 같은 흐름으로 이어지는지가 중요하다는 점을 배웠습니다. 특히 플레이어 조작감은 이동 코드만으로 결정되지 않고, 대쉬 제한, 공격 타이밍, 스킬 중 액션 잠금, 라운드 상태까지 함께 맞물릴 때 안정적으로 느껴진다는 것을 확인했습니다." },
        { type: "text", title: "보완할 부분", text: "현재 구조에서 가장 먼저 보완해야 할 부분은 네트워크 지연 상황에서의 피격 판정 안정성입니다. 공격 판정과 피격 피드백을 StateAuthority 기준으로 처리했지만, 실제 플레이 환경에서는 지연 시간에 따라 공격이 맞은 것처럼 보이는데 결과가 늦게 반영될 수 있습니다. 이후에는 히트 판정 로그와 리플레이 가능한 테스트 상황을 만들어 판정 기준을 더 검증하고 싶습니다. 또한 CharacterActionLock에 공격, 대쉬, 스킬 제한이 모여 있어 캐릭터가 늘어날수록 조건이 복잡해질 수 있으므로, 캐릭터 공통 액션 상태와 캐릭터별 스킬 상태를 더 분리하는 리팩토링이 필요하다고 느꼈습니다. UI 쪽에서는 스킬 쿨타임, 피격 방향, 라운드 승패 피드백이 아직 기능 중심으로 보이는 부분이 있어, 플레이어가 전투 상황을 더 빠르게 읽을 수 있도록 시각 효과와 사운드 피드백을 보강해야 합니다." }
      ]
    },
    {
      title: "Cops Catch",
      category: "3D",
      summary: "현재 진행 중인 5인 팀 기반 3D 멀티플레이 프로젝트입니다.",
      thumb: "assets/project-cops-catch.png",
      heroImage: "assets/project-cops-catch.png",
      heroBg: "assets/project-cops-catch.png",
      tags: ["Unity", "3D", "Multiplayer", "Team Project", "5인", "In Progress"],
      status: "진행 중",
      date: "",
      role: "Unity Client Developer",
      period: "진행 중",
      team: "5인 팀 프로젝트",
      platform: "PC",
      genre: "3D Multiplayer",
      contribution: "멀티플레이 시스템 구현 참여",
      sections: [{ type: "overview", title: "프로젝트 개요", text: "Cops Catch는 현재 진행 중인 5인 팀 기반 3D 멀티플레이 프로젝트입니다. 현재는 타이틀 이미지와 기본 정보만 등록되어 있으며, 세부 구현 내용은 이후 관리자에서 추가할 수 있습니다." }]
    },
    {
      title: "Shadow Core Defense",
      category: "2D",
      summary: "Unity와 C#으로 제작한 개인 2D 코어 방어 액션 프로젝트입니다. 라운드 진행, 몬스터 스폰, 코어 방어, 보스 패턴, 어빌리티 선택, 보상/성장, 상점과 룬 시스템까지 전투 이후의 성장 흐름을 함께 구현했습니다.",
      thumb: "assets/project-shadow-core-defense.png",
      heroImage: "assets/project-shadow-core-defense.png",
      heroBg: "assets/project-shadow-core-defense.png",
      tags: ["Unity", "C#", "2D Defense", "Personal Project", "Object Pooling", "Rune System"],
      status: "제작 기록",
      date: "Personal Project",
      role: "Unity Client Developer",
      period: "개인 개발",
      team: "개인 프로젝트",
      platform: "PC",
      genre: "2D Core Defense Action",
      contribution: "기획, 라운드/스폰/보스/전투/보상/성장/상점/룬/UI 흐름 전반 구현",
      links: [
        { label: "GitHub", url: "https://github.com/haneul68/Shadow_Core_Defense" },
        { label: "플레이 영상", url: "https://drive.google.com/drive/folders/1nzH5xHGPtT1VIndM8YJPx2lua3KiLoDg?usp=sharing" }
      ],
      portfolioTemplateVersion: 16,
      sections: [
        { type: "text", title: "프로젝트 개요", keywords: ["Unity", "C#", "2D Defense", "Core Defense", "Object Pooling", "Personal"], text: "Shadow Core Defense는 중앙 코어를 지키며 라운드 단위로 몰려오는 적을 처치하는 2D 코어 방어 액션 프로젝트입니다. 단순히 몬스터를 처치하는 전투 장면만이 아니라, 라운드 진행, 코어 방어, 보스 전투, 어빌리티 선택, 결과 보상, 캐릭터 구매/장착, 인벤토리와 룬 장착까지 전투 이후의 성장 흐름을 하나의 개인 프로젝트 안에서 구성했습니다." },
        { type: "text", title: "게임 소개", keywords: ["Wave", "Core", "Boss", "Ability", "Reward", "Growth"], text: "플레이어는 코어 주변에서 몬스터의 접근을 막고, 제한 시간 안에 웨이브를 버티거나 처치 흐름을 이어갑니다. 일반 웨이브에서는 적 처치 수와 남은 시간을 확인하며 전투하고, 보스 웨이브에서는 보스 체력과 패턴을 기준으로 위치를 조절합니다. 전투 중에는 스킬과 아이템 슬롯을 활용하고, 클리어 이후에는 보상과 성장 시스템으로 다음 플레이를 준비합니다." },
        { type: "showcase", title: "한눈에 보기", layout: "media-left", blocks: [
          { kind: "media", size: "feature", media: "assets/project-shadow-core-defense-gameplay-overview.gif", title: "코어 방어 전투", text: "코어 체력, 웨이브 시간, 적 처치 수, 미니맵, 플레이어 HP/MP/SP와 스킬 슬롯이 함께 보이는 대표 전투 장면입니다.", caption: "몬스터가 코어 근처로 접근하고, 플레이어가 직접 전투로 방어하는 핵심 플레이 흐름입니다." },
          { kind: "text", size: "normal", title: "제작 목적", text: "라운드 기반 디펜스에서 전투 상태, 적 스폰, UI 피드백, 보상 계산이 어떤 순서로 이어져야 플레이 흐름이 끊기지 않는지 직접 구현해보는 것을 목표로 했습니다." },
          { kind: "text", size: "normal", title: "핵심 경험", text: "전투 중에는 코어와 적의 위치를 계속 확인하고, 전투가 끝나면 보상과 성장 선택으로 다음 라운드를 준비하는 구조를 만들었습니다." }
        ] },
        { type: "architecture", title: "전체 시스템 구조", flowTitle: "Defense Loop", systemTitle: "Runtime Modules", note: "전투 진행은 InGame_State_Manager와 Round_Manager가 상태를 전환하고, Enemy_Spawn_Manager가 라운드 데이터에 맞춰 적과 보스를 생성합니다. Base_Manager는 Data, Pool, Inventory, Rune, Sound 매니저의 접근점을 제공하고, 전투 결과는 In_Game_Canvas와 End_Game_Result_Calculator를 통해 보상과 성장 데이터로 이어지도록 구성했습니다.", flow: ["Ready|카운트다운과 라운드 준비", "Battle|라운드 데이터 기반 몬스터 스폰", "Core Defense|코어 체력과 적 접근 상태 확인", "Boss Battle|보스 라운드 진입과 패턴 전투", "Reward/Growth|결과 보상, 어빌리티, 룬/상점 성장"], systems: ["Round_Manager|READY/BATTLE/BOSS/ABILITY/VICTORY/DEATH 상태 전환", "Enemy_Spawn_Manager|라운드 데이터 기반 적 수량, 스폰 범위, 보스 생성 관리", "Boss_AI_Controller|보스 HP 비율에 따른 페이즈와 패턴 루프 실행", "Base_Manager|Data, Pool, Inventory, Rune, Sound 매니저 초기화와 접근점", "Pool_Manager|몬스터, UI, 이펙트 등 반복 생성 객체 풀링", "In_Game_Canvas|웨이브, 타이머, 적 처치 수, 결과 보상 UI 갱신"], domains: ["Combat|플레이어 공격, 스킬, 적 피격 처리", "Defense|코어 체력과 몬스터 접근 관리", "Reward|라운드 결과, 골드, 경험치, 재료 지급", "Growth|캐릭터 구매/장착, 룬 장착, 어빌리티 선택", "UI|전투 HUD, 상점, 인벤토리, 결과창"] },
        { type: "features", title: "담당 구현", features: ["개인 프로젝트로 기획과 구현 전반 진행", "라운드 상태 전환과 카운트다운/타이머 처리", "라운드 데이터 기반 몬스터 스폰과 미니맵 아이콘 등록", "코어 방어 전투 UI와 HP/MP/SP 피드백 구성", "보스 페이즈와 패턴 기반 스킬 실행 구조", "결과 보상 계산과 골드/경험치/재료 지급", "상점, 인벤토리, 캐릭터 구매/장착, 룬 장착 UI 흐름 구현", "반복 생성 객체를 Pool_Manager로 관리"] },
        { type: "showcase", title: "라운드와 코어 방어", layout: "media-left", blocks: [
          { kind: "media", size: "feature", media: "assets/project-shadow-core-defense-core.gif", title: "코어 방어 장면", text: "몬스터가 코어를 공격하는 상황에서 플레이어가 직접 위치를 잡고 적을 처리하는 방어 흐름입니다.", caption: "웨이브 시간, 처치 수, 코어 체력, 미니맵을 동시에 확인하며 플레이하도록 구성했습니다." },
          { kind: "text", size: "normal", title: "라운드 진행", text: "Round_Manager는 READY, BATTLE, BOSS_READY, BOSS_BATTLE, ABILITY_SELECT, VICTORY, DEATH 상태를 전환합니다. 카운트다운 후 일반 전투 또는 보스 전투로 진입하고, 적 처치 여부와 타이머에 따라 다음 상태를 결정합니다." },
          { kind: "text", size: "normal", title: "스폰 구조", text: "Enemy_Spawn_Manager는 Round_Data의 적 수량을 기반으로 스폰 리스트를 만들고, 스폰 순서를 섞은 뒤 일정 간격과 묶음 단위로 적을 생성합니다. 스폰된 적은 리스트와 미니맵 아이콘에 등록해 전투 UI와 연결했습니다." }
        ] },
        { type: "showcase", title: "보스처치와 어빌리티 선택", layout: "media-left", blocks: [
          { kind: "media", size: "feature", media: "assets/project-shadow-core-defense-ability.gif", title: "어빌리티 선택", text: "보스 또는 특정 라운드 흐름 이후 플레이어가 다음 전투에 영향을 줄 선택지를 고르는 장면입니다.", caption: "전투 사이에 선택을 넣어 다음 웨이브의 플레이 방향을 바꾸는 구조입니다." },
          { kind: "text", size: "normal", title: "전투 사이의 선택", text: "라운드가 끝난 뒤 바로 다음 전투로 넘어가는 대신 어빌리티 선택 단계를 넣어, 플레이어가 성장 방향을 판단하고 다음 전투를 준비하는 시간을 만들었습니다." },
          { kind: "text", size: "normal", title: "UI 피드백", text: "전투 중에는 스킬 슬롯, 아이템 슬롯, HP/MP/SP, 적 처치 수, 미니맵 정보를 한 화면에 배치해 현재 상태를 바로 읽을 수 있도록 구성했습니다." }
        ] },
        { type: "showcase", title: "성장과 준비 화면", layout: "bento", blocks: [
          { kind: "media", size: "normal", media: "assets/project-shadow-core-defense-character.gif", title: "캐릭터 구매와 장착", text: "보유 재화로 캐릭터를 구매하고 장착해 다음 전투에 사용할 캐릭터를 준비하는 흐름입니다." },
          { kind: "media", size: "normal", media: "assets/project-shadow-core-defense-shop.gif", title: "상점과 아이템 구매", text: "상점에서 아이템을 확인하고 구매한 뒤 인벤토리 흐름으로 연결합니다." },
          { kind: "media", size: "normal", media: "assets/project-shadow-core-defense-inventory.gif", title: "인벤토리", text: "보유 아이템과 재료를 확인하고, 전투 밖 성장 준비를 진행하는 화면입니다." },
          { kind: "media", size: "normal", media: "assets/project-shadow-core-defense-rune.gif", title: "룬 장착", text: "룬 보유 상태와 장착 슬롯을 확인하고, 전투 전 능력치를 준비하는 성장 화면입니다." }
        ] },
        { type: "showcase", title: "결과 보상", layout: "media-left", blocks: [
          { kind: "media", size: "feature", media: "assets/project-shadow-core-defense-reward.gif", title: "보상 창", text: "플레이 시간, 클리어 라운드, 점수, 획득 골드와 경험치를 결과창에서 보여주는 장면입니다.", caption: "전투 결과가 다음 성장 재화로 이어지도록 결과 계산과 지급 흐름을 연결했습니다." },
          { kind: "text", size: "normal", title: "보상 계산", text: "End_Game_Result_Calculator는 클리어 라운드와 플레이 시간을 기준으로 골드, 경험치, 점수를 계산합니다. 보스 라운드 여부에 따라 보상 가중치를 다르게 주고, 남은 시간은 점수 보너스로 반영했습니다." },
          { kind: "text", size: "normal", title: "재료 지급", text: "Material_Reward_Calculator와 Material_Reward_Filter를 통해 보상 재료를 계산하고, 인벤토리 수용 가능 여부를 고려해 실제 지급 가능한 보상만 반영하도록 구성했습니다." }
        ] },
        { type: "text", title: "핵심 구현", keywords: ["Round Manager", "Spawner", "Object Pooling", "Boss Phase", "Reward Calculator"], text: "전투 진행은 상태 전환 중심으로 구성했습니다. Round_Manager가 현재 라운드와 타이머를 관리하고, Enemy_Spawn_Manager가 라운드별 적 종류와 수량을 기반으로 적을 생성합니다. 반복적으로 생성되는 적, 미니맵 아이콘, UI 슬롯, 이펙트는 Pool_Manager를 통해 필요한 순간 가져오고 반환하도록 만들어 생성 비용과 관리 지점을 줄였습니다." },
        { type: "text", title: "보스 전투 구조", keywords: ["Boss AI", "Phase", "Pattern", "Skill Factory"], text: "Boss_AI_Controller는 보스 체력 비율을 확인해 페이즈를 바꾸고, 각 페이즈에 등록된 패턴을 순서대로 실행합니다. 패턴은 Skill_Data를 통해 Boss_Skill_Factory에서 런타임 스킬로 생성되며, 스킬 실행 시 보스 애니메이션 이벤트와 연결되도록 구성했습니다. 보스가 사망하면 보스가 소환한 적을 정리하고 보스 객체를 풀로 반환합니다." },
        { type: "text", title: "성장 시스템", keywords: ["DataManager", "RuneManager", "Inventory", "Shop"], text: "Data_Manager는 캐릭터, 아이템, 룬, 적 데이터를 Resources의 ScriptableObject에서 읽어 딕셔너리로 관리합니다. Rune_Manager는 룬 보유 여부, 장착 슬롯, 강화 가능 여부, 필요한 재료와 성공 확률을 계산합니다. 상점과 인벤토리는 아이템 구매, 보유 수량, 재료 소비 흐름과 연결해 전투 밖 성장 준비가 가능하도록 구성했습니다." },
        { type: "features", title: "문제 해결 경험", features: ["전투 상태와 UI 갱신이 섞이지 않도록 상태 전환 이벤트 기반으로 분리", "라운드별 적 수량을 리스트로 만들고 셔플해 매번 같은 순서로 스폰되지 않도록 처리", "반복 생성되는 적과 UI 아이콘을 풀링으로 관리해 생성/삭제 부담 감소", "보스 패턴을 페이즈와 스킬 데이터로 분리해 확장 가능한 구조로 구성", "결과 보상 지급 전 인벤토리 수용 가능 여부를 검사해 보상 데이터와 실제 보유 데이터가 어긋나지 않도록 처리"] },
        { type: "text", title: "배운 점", text: "디펜스 게임에서는 전투 그 자체만큼이나 전투 전후의 정보 흐름이 중요하다는 점을 배웠습니다. 적이 어디서 오고, 코어가 얼마나 위험하고, 라운드가 얼마나 남았고, 전투 결과가 어떤 보상과 성장으로 이어지는지가 명확해야 플레이어가 다음 행동을 자연스럽게 선택할 수 있었습니다. 그래서 전투, UI, 보상, 성장 데이터를 따로 구현하기보다 하나의 플레이 루프로 이어지도록 구조를 맞추는 데 집중했습니다." },
        { type: "text", title: "결과와 보완할 부분", text: "라운드 기반 전투, 코어 방어, 보스 패턴, 어빌리티 선택, 결과 보상, 상점/인벤토리/룬 성장 흐름을 하나의 개인 프로젝트로 구성했습니다. 다만 구현을 진행하면서 보완해야 할 부분도 분명했습니다. 먼저 Round_Manager가 라운드 상태 전환을 맡고 있지만, 전투 진행, 보스 진입, 어빌리티 선택, 결과 처리까지 연결되는 흐름이 길어져 상태별 책임을 더 작게 나눌 필요가 있습니다. Enemy_Spawn_Manager도 라운드 데이터 기반으로 동작하지만, 난이도 곡선과 스폰 규칙이 더 세밀하게 데이터화되어야 이후 웨이브 추가와 밸런스 조정이 쉬워질 것 같습니다. 보스 패턴은 페이즈 구조를 만들었지만 패턴 예고, 회피 가능 시간, 피격 위험 표시가 부족해 플레이어가 왜 맞았는지 즉시 이해하기 어려운 순간이 있을 수 있습니다. 앞으로는 보스 공격 범위 표시와 위험도 피드백을 강화하고, 보상/룬/상점 수치도 테스트 데이터를 기준으로 조정해 전투 결과가 성장 선택으로 더 자연스럽게 이어지도록 개선해야 한다고 느꼈습니다." }
      ]
    }
  ];
}

function mergeProjectLinks(existingLinks, templateLinks) {
  const links = Array.isArray(existingLinks) ? [...existingLinks] : [];
  (Array.isArray(templateLinks) ? templateLinks : []).forEach(link => {
    const sameUrl = links.some(item => (item.url || "") === (link.url || ""));
    const sameLabel = links.some(item => (item.label || "") === (link.label || ""));
    if (!sameUrl && !sameLabel) links.push(link);
  });
  if ((existingLinks || []).some(link => (link.url || "").includes("1VZyZFEL5aqi8Qik3seAI9TuwxHPVRjS5")) && !links.some(link => (link.label || "") === "전체 플레이 영상")) {
    links.push({ label: "전체 플레이 영상", url: "https://drive.google.com/file/d/1VZyZFEL5aqi8Qik3seAI9TuwxHPVRjS5/view?usp=drive_link" });
  }
  return links;
}

function mergeProjectDefaults(existing, template) {
  return {
    ...template,
    ...existing,
    thumb: existing.thumb || template.thumb,
    heroImage: existing.heroImage || template.heroImage,
    heroBg: existing.heroBg || template.heroBg,
    summary: existing.summary && !isBrokenText(existing.summary) ? existing.summary : template.summary,
    category: existing.category && !isBrokenText(existing.category) ? existing.category : template.category,
    status: existing.status && !isBrokenText(existing.status) ? existing.status : template.status,
    date: existing.date || template.date,
    tags: Array.isArray(existing.tags) && existing.tags.length && !existing.tags.some(isBrokenText) ? existing.tags : template.tags,
    role: existing.role && !isBrokenText(existing.role) ? existing.role : template.role,
    period: existing.period && !isBrokenText(existing.period) ? existing.period : template.period,
    team: existing.team && !isBrokenText(existing.team) ? existing.team : template.team,
    platform: existing.platform && !isBrokenText(existing.platform) ? existing.platform : template.platform,
    genre: existing.genre && !isBrokenText(existing.genre) ? existing.genre : template.genre,
    contribution: existing.contribution && !isBrokenText(existing.contribution) ? existing.contribution : template.contribution,
    sections: Array.isArray(existing.sections) && existing.sections.length ? existing.sections : template.sections,
    links: mergeProjectLinks(existing.links, template.links)
  };
}

function ensurePortfolioProjects(data) {
  let changed = false;
  const templates = [gnBancInterviewProjectTemplate(), ...extraProjectTemplates()];
  templates.forEach(template => {
    const index = data.projects.findIndex(project => (project.title || "").toLowerCase() === template.title.toLowerCase());
    if (index === -1) {
      data.projects.push(template);
      changed = true;
      return;
    }
    const merged = mergeProjectDefaults(data.projects[index], template);
    if (JSON.stringify(merged) !== JSON.stringify(data.projects[index])) {
      data.projects[index] = merged;
      changed = true;
    }
  });
  data.projectImports = [...new Set([...(data.projectImports || []), "gn-banc", "chaos-arena", "cops-catch", "shadow-core-defense"])];
  return changed;
}

function upgradeGnBancProject(data) {
  const index = data.projects.findIndex(project => (project.title || "").toLowerCase().includes("gn banc"));
  if (index === -1) return false;
  const current = data.projects[index];
  if ((current.portfolioTemplateVersion || 0) >= 11 && current.thumb && current.heroImage && (current.links || []).some(link => (link.url || "").includes("1VZyZFEL5aqi8Qik3seAI9TuwxHPVRjS5"))) return false;
  const template = gnBancInterviewProjectTemplate();
  data.projects[index] = {
    ...mergeProjectDefaults(current, template),
    sections: template.sections,
    portfolioTemplateVersion: 11
  };
  return true;
}

function upgradeChaosArenaProject(data) {
  const index = data.projects.findIndex(project => (project.title || "").toLowerCase().includes("chaos arena"));
  const template = extraProjectTemplates().find(project => project.title === "Chaos Arena");
  if (!template) return false;
  if (index === -1) {
    data.projects.push(template);
    return true;
  }
  const current = data.projects[index];
  if ((current.portfolioTemplateVersion || 0) >= 13 && Array.isArray(current.sections) && current.sections.some(section => section.title === "플레이어 전투 구현")) return false;
  data.projects[index] = {
    ...mergeProjectDefaults(current, template),
    summary: template.summary,
    tags: template.tags,
    contribution: template.contribution,
    links: mergeProjectLinks(current.links, template.links),
    sections: template.sections,
    portfolioTemplateVersion: 13
  };
  return true;
}

function upgradeShadowCoreDefenseProject(data) {
  const index = data.projects.findIndex(project => (project.title || "").toLowerCase().includes("shadow core defense"));
  const template = extraProjectTemplates().find(project => project.title === "Shadow Core Defense");
  if (!template) return false;
  if (index === -1) {
    data.projects.push(template);
    return true;
  }
  const current = data.projects[index];
  if ((current.portfolioTemplateVersion || 0) >= 16 && Array.isArray(current.sections) && current.sections.some(section => section.title === "보스처치와 어빌리티 선택")) return false;
  data.projects[index] = {
    ...mergeProjectDefaults(current, template),
    summary: template.summary,
    tags: template.tags,
    contribution: template.contribution,
    links: mergeProjectLinks(current.links, template.links),
    sections: template.sections,
    portfolioTemplateVersion: 16
  };
  return true;
}

function upgradeProfileFacts(data) {
  if ((data.profileContentVersion || 0) >= 6) return false;
  const base = DEFAULT_DATA;
  data.profileContentVersion = 6;
  data.aboutTitle = base.aboutTitle;
  data.aboutText = base.aboutText;
  data.aboutDetailTitle = base.aboutDetailTitle;
  data.aboutDetailText = base.aboutDetailText;
  data.education = base.education;
  data.awards = [];
  data.certificates = base.certificates;
  data.activities = base.activities;
  data.learning = base.learning;
  data.playPhilosophy = base.playPhilosophy;
  data.aboutStrengths = base.aboutStrengths;
  data.workStyle = base.workStyle;
  data.aboutGoal = base.aboutGoal;
  data.bgmUrl = data.bgmUrl || base.bgmUrl;
  data.contact = { ...(data.contact || {}), github: "https://github.com/haneul68" };
  return true;
}

function mergeData(base, saved) {
  const data = { ...base, ...(saved || {}) };
  data.contact = { ...base.contact, ...(saved?.contact || {}) };
  if (!data.contact.github || data.contact.github === "#") data.contact.github = base.contact.github;
  data.skills = Array.isArray(saved?.skills) && !saved.skills.some(skill => isBrokenText(skill.name) || isBrokenText(skill.desc)) ? saved.skills : base.skills;
  data.projects = Array.isArray(saved?.projects) ? saved.projects : base.projects;
  data.projectImports = Array.isArray(saved?.projectImports) ? saved.projectImports : [];
  if (!data.projects.some(project => (project.title || "").toLowerCase().includes("gn banc")) && !data.projectImports.includes("gn-banc")) {
    data.projects.unshift(gnBancInterviewProjectTemplate());
    data.projectImports = [...data.projectImports, "gn-banc"];
  }
  let projectUpgraded = false;
  if (upgradeGnBancProject(data)) {
    data.projectImports = [...new Set([...data.projectImports, "gn-banc"])];
    projectUpgraded = true;
  }
  if (upgradeChaosArenaProject(data)) {
    data.projectImports = [...new Set([...data.projectImports, "chaos-arena"] )];
    projectUpgraded = true;
  }
  if (upgradeShadowCoreDefenseProject(data)) {
    data.projectImports = [...new Set([...data.projectImports, "shadow-core-defense"] )];
    projectUpgraded = true;
  }
  if (ensurePortfolioProjects(data) || projectUpgraded) {
    saveData(data);
  }
  data.stats = Array.isArray(saved?.stats) && !saved.stats.flat().some(isBrokenText) ? saved.stats : base.stats;
  data.chips = Array.isArray(saved?.chips) && !saved.chips.some(isBrokenText) ? saved.chips : base.chips;
  data.profileAvatar = saved?.profileAvatar || base.profileAvatar || "";
  if (!data.profileAvatar || data.profileAvatar === data.character || data.profileAvatar === "assets/character.png") data.profileAvatar = base.profileAvatar || "assets/profile-photo.jpg";
  data.profileLocation = saved?.profileLocation || base.profileLocation || "Asia/Seoul";
  data.profileLanguages = Array.isArray(saved?.profileLanguages) && !saved.profileLanguages.some(isBrokenText) ? saved.profileLanguages : base.profileLanguages || ["한국어", "영어"];
  data.aboutTitle = saved?.aboutTitle && !isBrokenText(saved.aboutTitle) ? saved.aboutTitle : base.aboutTitle;
  data.aboutText = saved?.aboutText && !isBrokenText(saved.aboutText) ? saved.aboutText : base.aboutText;
  data.aboutDetailTitle = saved?.aboutDetailTitle && !isBrokenText(saved.aboutDetailTitle) ? saved.aboutDetailTitle : base.aboutDetailTitle || "";
  data.aboutDetailText = saved?.aboutDetailText && !isBrokenText(saved.aboutDetailText) ? saved.aboutDetailText : base.aboutDetailText || "";
  data.playPhilosophy = Array.isArray(saved?.playPhilosophy) && !saved.playPhilosophy.flat().some(isBrokenText) ? saved.playPhilosophy : base.playPhilosophy || [];
  data.aboutStrengths = Array.isArray(saved?.aboutStrengths) && !saved.aboutStrengths.some(isBrokenText) ? saved.aboutStrengths : base.aboutStrengths || [];
  data.awards = Array.isArray(saved?.awards) ? saved.awards.filter(item => !isBrokenText(item)) : base.awards || [];
  data.education = Array.isArray(saved?.education) && !saved.education.some(isBrokenText) ? saved.education : base.education || [];
  data.certificates = Array.isArray(saved?.certificates)
    ? saved.certificates.filter(item => !String(typeof item === "object" ? item.title || item.name || "" : item).includes("정보처리")).map(certificateDetail)
    : base.certificates || [];
  data.interests = Array.isArray(saved?.interests) && !saved.interests.some(isBrokenText) ? saved.interests : base.interests || [];
  data.activities = Array.isArray(saved?.activities) && !saved.activities.some(isBrokenText) ? saved.activities : base.activities || [];
  data.learning = Array.isArray(saved?.learning) ? saved.learning.filter(item => !String(item).includes("정보처리") && !isBrokenText(item)) : base.learning || [];
  data.workStyle = Array.isArray(saved?.workStyle) && !saved.workStyle.some(isBrokenText) ? saved.workStyle : base.workStyle || [];
  data.aboutGoal = saved?.aboutGoal && !isBrokenText(saved.aboutGoal) ? saved.aboutGoal : base.aboutGoal || "";
  data.soundDefaultOn = typeof saved?.soundDefaultOn === "boolean" ? saved.soundDefaultOn : base.soundDefaultOn !== false;
  data.bgmUrl = saved?.bgmUrl || base.bgmUrl || "";
  if (upgradeProfileFacts(data)) {
    saveData(data);
  }
  data.featuredIndex = Number.isInteger(saved?.featuredIndex) ? saved.featuredIndex : Number.isInteger(base.featuredIndex) ? base.featuredIndex : 0;
  data.workflow = Array.isArray(saved?.workflow) && !saved.workflow.some(item => isBrokenText(item.title) || isBrokenText(item.desc)) ? saved.workflow : base.workflow;
  return data;
}
function loadData() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return mergeData(cloneDefaultData(), saved);
  } catch {
    return cloneDefaultData();
  }
}

function saveData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error("Portfolio save failed", error);
    return false;
  }
}

let DATA = loadData();
let ACTIVE_PROJECT_FILTER = "all";
let AUDIO_CTX = null;
let MASTER_GAIN = null;
let AMBIENT_NODES = [];
let BGM_AUDIO = null;
const SOUND_PREF_KEY = "khanuelSoundEnabledV2";
let SOUND_ENABLED = localStorage.getItem(SOUND_PREF_KEY) !== null
  ? localStorage.getItem(SOUND_PREF_KEY) === "true"
  : DATA.soundDefaultOn !== false;

function escapeHTML(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function escapeAttr(value) {
  return String(value ?? "")
    .replace(/\\/g, "\\\\")
    .replace(/'/g, "\\'")
    .replace(/\n/g, "");
}

function isVideoUrl(url) {
  return /^data:video\//.test(String(url || "")) || /\.(mp4|webm|ogg)(\?|$)/i.test(String(url || ""));
}

function isUsableExternalLink(url) {
  return /^https?:\/\//i.test(String(url || ""));
}

function setExternalButtonLink(element, url) {
  if (!element) return;
  if (isUsableExternalLink(url)) {
    element.href = url;
    element.target = "_blank";
    element.rel = "noreferrer";
    element.hidden = false;
    element.setAttribute("aria-disabled", "false");
    return;
  }
  element.href = "#";
  element.removeAttribute("target");
  element.removeAttribute("rel");
  element.hidden = true;
  element.setAttribute("aria-disabled", "true");
}

function iconSVG(name = "GAME") {
  const key = String(name || "GAME").toUpperCase();
  const common = 'viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"';
  const icons = {
    GAME: `<svg ${common}><path d="M7 14h-2.5a3.5 3.5 0 0 1 0-7h15a3.5 3.5 0 0 1 0 7h-2.5l-2-2h-6l-2 2Z"/><path d="M7 10h3M8.5 8.5v3"/><path d="M16.5 9.5h.01M18.5 11.5h.01"/></svg>`,
    UNITY: `<svg ${common}><path d="M12 3 4.5 7.3v8.8L12 21l7.5-4.9V7.3L12 3Z"/><path d="M12 3v6.7l5.8 3.4"/><path d="M4.5 7.3 10.3 11v6.8"/><path d="M19.5 7.3 12 11.6 4.5 7.3"/></svg>`,
    "C#": `<svg ${common}><path d="M9 8 5 12l4 4"/><path d="m15 8 4 4-4 4"/><path d="M13 6 11 18"/><path d="M16.5 6.5h3M16 10h3"/><path d="M18 5v6"/></svg>`,
    NET: `<svg ${common}><circle cx="5" cy="12" r="2.5"/><circle cx="18" cy="6" r="2.5"/><circle cx="18" cy="18" r="2.5"/><path d="m7.3 10.8 8.4-3.7M7.3 13.2l8.4 3.7"/></svg>`,
    SYS: `<svg ${common}><path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z"/><path d="M19 12h2M3 12h2M12 3v2M12 19v2M17 7l1.4-1.4M5.6 18.4 7 17M7 7 5.6 5.6M18.4 18.4 17 17"/></svg>`,
    UI: `<svg ${common}><rect x="4" y="5" width="16" height="14" rx="2"/><path d="M4 9h16"/><path d="M8 13h4M8 16h8"/></svg>`,
    GIT: `<svg ${common}><circle cx="6" cy="6" r="2"/><circle cx="18" cy="18" r="2"/><circle cx="6" cy="18" r="2"/><path d="M8 6h3a3 3 0 0 1 3 3v7"/><path d="M6 8v8"/></svg>`,
    DB: `<svg ${common}><ellipse cx="12" cy="5" rx="7" ry="3"/><path d="M5 5v6c0 1.7 3.1 3 7 3s7-1.3 7-3V5"/><path d="M5 11v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6"/></svg>`,
    AI: `<svg ${common}><rect x="7" y="7" width="10" height="10" rx="2"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3"/><path d="M10 14l2-5 2 5M10.7 12h2.6"/></svg>`,
    TOOL: `<svg ${common}><path d="m14.7 6.3 3 3"/><path d="M9 17.5 4.5 19 6 14.5 15.5 5a2.1 2.1 0 0 1 3 3L9 17.5Z"/><path d="M12 8.5 15.5 12"/></svg>`,
    BUG: `<svg ${common}><path d="M8 8a4 4 0 0 1 8 0v8a4 4 0 0 1-8 0V8Z"/><path d="M3 13h5M16 13h5M4 19l4-3M20 19l-4-3M4 7l4 3M20 7l-4 3"/><path d="M10 4 8 2M14 4l2-2"/></svg>`,
    BUILD: `<svg ${common}><path d="M4 20h16"/><path d="M6 20V9l6-5 6 5v11"/><path d="M9 20v-6h6v6"/><path d="M9 10h.01M15 10h.01"/></svg>`,
    MOBILE: `<svg ${common}><rect x="7" y="3" width="10" height="18" rx="2"/><path d="M10 6h4M12 18h.01"/></svg>`,
    COMBAT: `<svg ${common}><path d="M14.5 4.5 19.5 9.5"/><path d="M4 20 20 4"/><path d="m13 7 4 4"/><path d="M5 13l6 6"/></svg>`,
    GROWTH: `<svg ${common}><path d="M4 19h16"/><path d="M7 16V9"/><path d="M12 16V5"/><path d="M17 16v-4"/><path d="m9 7 3-3 3 3"/></svg>`,
    REWARD: `<svg ${common}><path d="M20 12v8H4v-8"/><path d="M2 7h20v5H2z"/><path d="M12 7v13"/><path d="M12 7H8.5A2.5 2.5 0 1 1 11 4.5L12 7Z"/><path d="M12 7h3.5A2.5 2.5 0 1 0 13 4.5L12 7Z"/></svg>`,
    VIDEO: `<svg ${common}><rect x="4" y="6" width="12" height="12" rx="2"/><path d="m16 10 4-2v8l-4-2z"/></svg>`
  };
  return icons[key] || icons.GAME;
}

function portfolioIconFor(value = "") {
  const text = String(value).toLowerCase();
  if (text.includes("unity")) return "UNITY";
  if (text.includes("c#") || text.includes("csharp")) return "C#";
  if (text.includes("firebase") || text.includes("save") || text.includes("data") || text.includes("db") || text.includes("저장")) return "DB";
  if (text.includes("mobile") || text.includes("android") || text.includes("모바일")) return "MOBILE";
  if (text.includes("combat") || text.includes("battle") || text.includes("전투")) return "COMBAT";
  if (text.includes("growth") || text.includes("성장")) return "GROWTH";
  if (text.includes("reward") || text.includes("보상")) return "REWARD";
  if (text.includes("ui") || text.includes("ux") || text.includes("화면")) return "UI";
  if (text.includes("debug") || text.includes("문제") || text.includes("해결")) return "BUG";
  if (text.includes("system") || text.includes("manager") || text.includes("pool") || text.includes("구조")) return "SYS";
  if (text.includes("git") || text.includes("github")) return "GIT";
  if (text.includes("video") || text.includes("gif") || text.includes("영상")) return "VIDEO";
  if (text.includes("build") || text.includes("빌드")) return "BUILD";
  return "GAME";
}

function listFrom(value) {
  return Array.isArray(value) ? value.filter(Boolean) : String(value || "").split("\n").map(item => item.trim()).filter(Boolean);
}

function projectMeta(project) {
  return [
    ["역할", project.role || "Unity Client Developer"],
    ["개발 기간", project.period || project.date || "진행 중"],
    ["팀 규모", project.team || "개인 / 팀"],
    ["플랫폼", project.platform || "PC"],
    ["장르", project.genre || project.category || "Game"],
    ["기여도", project.contribution || "주요 시스템 구현"]
  ];
}

function mediaHTML(url, alt = "") {
  if (!url) return `<div class="empty-media"><span>${iconSVG("VIDEO")}</span><b>${escapeHTML(alt || "Portfolio Media")}</b><small>관리자에서 이미지, GIF, 영상을 추가하면 이곳에 표시됩니다.</small></div>`;
  if (isVideoUrl(url)) return `<video src="${escapeHTML(url)}" muted loop playsinline controls></video>`;
  return `<img src="${escapeHTML(url)}" alt="${escapeHTML(alt)}">`;
}
function heroBackgroundStyle(project) {
  const image = project.heroImage || project.thumb || "";
  if (!image || isVideoUrl(image)) return "";
  return ` style="--detail-hero-image:url('${escapeAttr(image)}')"`;
}

function applyTheme() {
  document.documentElement.style.setProperty("--primary", DATA.theme || "#8a4dff");
  document.documentElement.style.setProperty("--accent", DATA.accent || "#45c7ff");
  document.documentElement.style.setProperty("--card-radius", `${DATA.radius || 8}px`);
  document.body.dataset.background = DATA.background || "night";
}

function formatHeroName(name) {
  const parts = String(name || "KIM HANEUL").trim().split(/\s+/);
  const lastName = parts[0] || "KIM";
  const firstName = parts.slice(1).join(" ") || "HANEUL";
  let index = 0;
  const renderLine = (text, className) => {
    const letters = text.split("").map(char => {
      const display = char === " " ? "&nbsp;" : escapeHTML(char);
      return `<span class="type-char" style="--i:${index++}">${display}</span>`;
    }).join("");
    return `<span class="name-line ${className}">${letters}</span>`;
  };
  return `${renderLine(lastName, "last-name")}${renderLine(firstName, "first-name")}`;
}

function renderSite() {
  if (!$("heroName")) return;
  applyTheme();

  $("brandText").textContent = DATA.brand;
  $("helloText").textContent = DATA.hello;
  $("heroName").innerHTML = formatHeroName(DATA.name);
  $("heroRole").innerHTML = escapeHTML(DATA.role).replace(/(Unity|Client|Developer)/i, "<span>$1</span>");
  $("heroDesc").textContent = DATA.desc;
  $("characterImg").src = DATA.character || "assets/character.png";
  $("heroChips").innerHTML = DATA.chips.map(chip => `<span class="chip">${escapeHTML(chip)}</span>`).join("");
  if ($("profileCard")) {
    const avatar = DATA.profileAvatar || DATA.character || "assets/character.png";
    $("profileCard").innerHTML = `
      <div class="profile-avatar">${mediaHTML(avatar, `${DATA.name} 프로필`)}</div>
      <div class="profile-meta">
        <strong>${escapeHTML(DATA.name || "KIM HANEUL")}</strong>
        <span>${escapeHTML(DATA.role || "Game Developer")}</span>
        <div class="profile-location">${escapeHTML(DATA.profileLocation || "Asia/Seoul")}</div>
        <div class="profile-tags">${(DATA.profileLanguages || []).map(lang => `<em>${escapeHTML(lang)}</em>`).join("")}</div>
      </div>
    `;
  }

  $("aboutTitle").textContent = DATA.aboutTitle;
  $("aboutText").textContent = DATA.aboutText;
  if ($("playNoteGrid")) {
    $("playNoteGrid").innerHTML = (DATA.playPhilosophy || []).map(([title, text]) => `
      <article>
        <b>${escapeHTML(title)}</b>
        <span>${escapeHTML(text)}</span>
      </article>
    `).join("");
  }
  if ($("certificateSummary")) {
    const summaryItems = [
      ...(DATA.education || []).slice(0, 2),
      ...(DATA.certificates || []).map(item => certificateDetail(item).name)
    ];
    $("certificateSummary").innerHTML = summaryItems.map(item => `<span>${escapeHTML(item)}</span>`).join("");
  }
  $("statsBox").innerHTML = DATA.stats.map(([label, value]) => `
    <div><small>${escapeHTML(label)}</small><b>${escapeHTML(value)}</b></div>
  `).join("");

  setExternalButtonLink($("githubLink"), DATA.contact.github);
  setExternalButtonLink($("heroGithub"), DATA.contact.github);
  setExternalButtonLink($("steamLink"), DATA.contact.steam);
  setExternalButtonLink($("heroSteam"), DATA.contact.steam);
  if ($("mailLink")) {
    $("mailLink").href = "#contact";
    $("mailLink").removeAttribute("target");
    $("mailLink").removeAttribute("rel");
  }
  if ($("heroMail")) {
    $("heroMail").href = "#contact";
    $("heroMail").removeAttribute("target");
    $("heroMail").removeAttribute("rel");
  }

  renderFeaturedGame();
  renderProjectFilters();
  renderProjectGrid();

  $("skillsGrid").innerHTML = DATA.skills.map(skill => `
    <article class="skill-card">
      <span class="skill-icon" title="${escapeHTML(skill.icon)}">${iconSVG(skill.icon)}</span>
      <h4>${escapeHTML(skill.name)}</h4>
      <p>${escapeHTML(skill.desc)}</p>
    </article>
  `).join("");

  const contactCards = [
    isUsableExternalLink(DATA.contact.github)
      ? `<a class="contact-card" href="${escapeHTML(DATA.contact.github)}" target="_blank" rel="noreferrer"><span>GitHub</span><b>${escapeHTML(DATA.contact.github)}</b></a>`
      : "",
    `<a class="contact-card" href="mailto:${escapeHTML(DATA.contact.email || "")}"><span>Email</span><b>${escapeHTML(DATA.contact.email || "메일 없음")}</b></a>`,
    isUsableExternalLink(DATA.contact.steam)
      ? `<a class="contact-card" href="${escapeHTML(DATA.contact.steam)}" target="_blank" rel="noreferrer"><span>Link</span><b>${escapeHTML(DATA.contact.steam)}</b></a>`
      : ""
  ].filter(Boolean);
  $("contactCards").innerHTML = contactCards.join("");

  if ($("workflowGrid")) {
    $("workflowGrid").innerHTML = (DATA.workflow || []).map(item => `
      <article class="workflow-card">
        <span>${escapeHTML(item.icon || "DEV")}</span>
        <h4>${escapeHTML(item.title || "")}</h4>
        <p>${escapeHTML(item.desc || "")}</p>
      </article>
    `).join("");
  }
}

function projectCardHTML(project, index) {
  return `
    <article class="project-card" data-project-index="${index}" tabindex="0">
      <div class="project-thumb">
        ${mediaHTML(project.thumb, project.title)}
        <span class="badge">${escapeHTML(project.category || "Game")}</span>
      </div>
      <div class="project-info">
        <h4>${escapeHTML(project.title)}</h4>
        <p>${escapeHTML(project.summary)}</p>
        <small class="project-role">${escapeHTML(project.role || "Unity Client Developer")} · ${escapeHTML(project.platform || "PC")}</small>
        <div class="tags">${(project.tags || []).map(tag => `<span>${escapeHTML(tag)}</span>`).join("")}</div>
      </div>
    </article>
  `;
}

function renderFeaturedGame() {
  const root = $("featuredGame");
  if (!root) return;
  const index = Math.min(Math.max(DATA.featuredIndex || 0, 0), Math.max(DATA.projects.length - 1, 0));
  const project = DATA.projects[index];
  if (!project) {
    root.innerHTML = '<div class="empty-media">대표 게임을 추가하세요.</div>';
    return;
  }
  const features = (project.sections || []).find(section => section.type === "features")?.features || [];
  root.innerHTML = `
    <article class="featured-game-card" data-project-index="${index}" tabindex="0">
      <div class="featured-media">${mediaHTML(project.thumb, project.title)}<span class="badge">${escapeHTML(project.category || "Game")}</span></div>
      <div class="featured-copy">
        <small>${escapeHTML(project.status || "대표 프로젝트")} · ${escapeHTML(project.date || "")}</small>
        <h4>${escapeHTML(project.title)}</h4>
        <p>${escapeHTML(project.summary)}</p>
        <div class="tags">${(project.tags || []).map(tag => `<span>${escapeHTML(tag)}</span>`).join("")}</div>
        <div class="featured-points">${features.slice(0, 4).map(item => `<span>${escapeHTML(item)}</span>`).join("")}</div>
        <button class="btn primary" type="button">자세히 보기</button>
      </div>
    </article>
  `;
}

function renderProjectFilters() {
  const root = $("projectFilter");
  if (!root) return;
  const categories = ["all", ...new Set(DATA.projects.map(project => project.category || "Game"))];
  root.innerHTML = categories.map(category => `
    <button type="button" class="${ACTIVE_PROJECT_FILTER === category ? "active" : ""}" data-project-filter="${escapeHTML(category)}">
      ${category === "all" ? "전체" : escapeHTML(category)}
    </button>
  `).join("");
}

function renderProjectGrid() {
  const root = $("projectGrid");
  if (!root) return;
  const projects = DATA.projects
    .map((project, index) => ({ project, index }))
    .filter(item => ACTIVE_PROJECT_FILTER === "all" || (item.project.category || "Game") === ACTIVE_PROJECT_FILTER);
  root.innerHTML = projects.map(item => projectCardHTML(item.project, item.index)).join("");
}

function renderDetailSection(section, index) {
  const title = escapeHTML(section.title || `섹션 ${index}`);
  let body = "";

  if (section.type === "gallery") {
    body = `<div class="gallery">${(section.images || []).map((url, mediaIndex) => mediaHTML(url, `${title} ${mediaIndex + 1}`)).join("")}</div>`;
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
      ? `<div class="detail-media">${mediaHTML(section.url, title)}</div>`
      : `<a class="video-link" href="${escapeHTML(section.url || "#")}" target="_blank" rel="noreferrer">?곸긽 留곹겕 ?닿린</a>`;
  } else if (section.type === "media") {
    body = `<div class="detail-media">${mediaHTML(section.url, title)}</div><p>${escapeHTML(section.text || "")}</p>`;
  } else {
    const keywords = Array.isArray(section.keywords) && section.keywords.length
      ? `<div class="section-keywords">${section.keywords.map(keyword => `<span>${iconSVG(portfolioIconFor(keyword))}${escapeHTML(keyword)}</span>`).join("")}</div>`
      : "";
    body = `${keywords}<p>${escapeHTML(section.text || "")}</p>`;
  }

  return `<section class="detail-section" id="detail-${index}"><h3><span class="section-icon">${iconSVG(portfolioIconFor(section.title || section.type))}</span>${title}</h3>${body}</section>`;
}

function splitCardLine(line) {
  const [title, ...descParts] = String(line || "").split("|");
  return {
    title: (title || "").trim(),
    desc: descParts.join("|").trim()
  };
}

function renderShowcaseSection(section) {
  const blocks = Array.isArray(section.blocks) ? section.blocks : [];
  const layout = section.layout || "media-left";
  return `
    <div class="showcase-board layout-${escapeHTML(layout)}">
      ${blocks.map(block => renderShowcaseBlock(block)).join("")}
    </div>
  `;
}

function renderShowcaseBlock(block) {
  const kind = block.kind || "text";
  const size = block.size || "normal";
  const media = block.media || "";
  return `
    <article class="showcase-block ${kind === "media" ? "is-media" : "is-text"} size-${escapeHTML(size)}">
      ${kind === "media" ? `<div class="showcase-media">${mediaHTML(media, block.title || "")}</div>` : ""}
      <div class="showcase-copy">
        <span>${kind === "media" ? "IMAGE / GIF" : "IMPLEMENTATION"}</span>
        <h4>${escapeHTML(block.title || "구현 설명")}</h4>
        ${block.text ? `<p>${escapeHTML(block.text)}</p>` : ""}
        ${block.caption ? `<small>${escapeHTML(block.caption)}</small>` : ""}
      </div>
    </article>
  `;
}

function renderArchitectureSection(section) {
  const flow = Array.isArray(section.flow) ? section.flow : [];
  const systems = Array.isArray(section.systems) ? section.systems : (Array.isArray(section.modules) ? section.modules : []);
  const domains = Array.isArray(section.domains) ? section.domains : [];
  return `
    <div class="architecture-board">
      <div class="architecture-band">
        <h4><span class="section-icon">${iconSVG("GAME")}</span>${escapeHTML(section.flowTitle || "Game Flow")}</h4>
        <div class="flow-steps">
          ${flow.map((item, index) => {
            const card = splitCardLine(item);
            return `<div class="flow-step"><small>${String(index + 1).padStart(2, "0")}</small><b>${escapeHTML(card.title)}</b><span>${escapeHTML(card.desc)}</span></div>`;
          }).join("")}
        </div>
      </div>
      <div class="architecture-band">
        <h4><span class="section-icon">${iconSVG("SYS")}</span>${escapeHTML(section.systemTitle || "Runtime System")}</h4>
        <div class="system-stack">
          ${systems.map(item => {
            const card = splitCardLine(item);
            return `<div class="system-card"><span class="mini-icon">${iconSVG(portfolioIconFor(card.title))}</span><b>${escapeHTML(card.title)}</b><small>${escapeHTML(card.desc)}</small></div>`;
          }).join("")}
        </div>
      </div>
      <div class="architecture-band">
        <h4><span class="section-icon">${iconSVG("BUILD")}</span>Development Focus</h4>
        <div class="domain-grid">
          ${domains.map(item => {
            const card = splitCardLine(item);
            return `<div class="domain-card"><span class="mini-icon">${iconSVG(portfolioIconFor(card.title))}</span><b>${escapeHTML(card.title)}</b><small>${escapeHTML(card.desc)}</small></div>`;
          }).join("")}
        </div>
      </div>
      ${section.note ? `<p class="architecture-note">${escapeHTML(section.note)}</p>` : ""}
    </div>
  `;
}

function renderMoreProjects(currentIndex) {
  const items = DATA.projects
    .map((project, index) => ({ project, index }))
    .filter(item => item.index !== currentIndex)
    .slice(0, 3);
  if (!items.length) return "";
  return `
    <section class="detail-section more-projects-section" id="detail-more">
      <div class="section-heading-row">
        <div>
          <span class="section-kicker">NEXT PORTFOLIO</span>
          <h3>다른 작품 보러가기</h3>
        </div>
      </div>
      <div class="more-project-grid">
        ${items.map(({ project, index }) => `
          <button class="more-project-card" type="button" data-open-related-project="${index}">
            <span class="more-project-thumb">${mediaHTML(project.thumb, project.title)}</span>
            <span>
              <b>${escapeHTML(project.title || "Project")}</b>
              <small>${escapeHTML(project.summary || "")}</small>
            </span>
          </button>
        `).join("")}
      </div>
    </section>
  `;
}

function openProject(index) {
  const project = DATA.projects[index];
  if (!project) return;

  const sections = Array.isArray(project.sections) ? project.sections : [];
  const menuItems = [
    { title: "상단", id: "detail-0" },
    ...sections.map((section, i) => ({ title: section.title || `섹션 ${i + 1}`, id: `detail-${i + 1}` })),
    { title: "다른 작품", id: "detail-more" }
  ];

  $("detailMenu").innerHTML = menuItems.map(item => `<a href="#${item.id}">${escapeHTML(item.title)}</a>`).join("");
  $("detailContent").innerHTML = `
    <div class="detail-hero ${project.heroImage || project.thumb ? "has-hero-image" : ""}" id="detail-0"${heroBackgroundStyle(project)}>
      <div class="detail-hero-copy">
        <span class="badge static">${escapeHTML(project.category || "Game")}</span>
        <h2>${escapeHTML(project.title)}</h2>
        <p>${escapeHTML(project.summary)}</p>
        <div class="tags">${(project.tags || []).map(tag => `<span>${escapeHTML(tag)}</span>`).join("")}</div>
        <div class="project-links">
          ${(project.links || []).map(link => `<a href="${escapeHTML(link.url || "#")}" target="_blank" rel="noreferrer">${iconSVG(portfolioIconFor(link.label || link.url || "git"))}${escapeHTML(link.label || "Link")}</a>`).join("") || '<span class="empty-link-guide">GitHub 링크 준비 중</span>'}
        </div>
      </div>
      <div class="detail-hero-panel">
        <div class="portfolio-meta-grid">
          ${projectMeta(project).map(([label, value]) => `<div><small>${escapeHTML(label)}</small><b>${escapeHTML(value)}</b></div>`).join("")}
        </div>
      </div>
    </div>
    ${sections.map((section, i) => renderDetailSection(section, i + 1)).join("")}
    ${renderMoreProjects(index)}
  `;
  $("detailContent").scrollTop = 0;

  $("projectModal").classList.add("open");
  $("projectModal").setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}
function closeProject() {
  const modal = $("projectModal");
  if (!modal) return;
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

function certificateDetail(item) {
  if (item && typeof item === "object") {
    return {
      name: item.title || item.name || "자격증",
      issuer: item.issuer || "Certiport",
      date: item.date || "취득일 확인",
      desc: item.desc || item.summary || "취득한 자격 내용을 정리한 기록입니다."
    };
  }
  const text = String(item || "").trim();
  const dateMatch = text.match(/\(([^)]+)\)$/);
  const date = dateMatch ? dateMatch[1] : "취득일 확인";
  const rawName = text.replace(/\s*\([^)]+\)$/, "");
  const lower = rawName.toLowerCase();
  let name = rawName;
  let issuer = "Certiport";
  let desc = "취득한 자격 내용을 정리한 기록입니다.";
  if (lower.includes("programmer")) {
    name = "Certified User Programmer";
    desc = "Unity 기본 기능과 C# 스크립팅 활용 역량을 검증한 자격입니다.";
  } else if (lower === "visual design") {
    desc = "화면 구성, 색감, 레이아웃 등 시각 디자인 기본 역량을 검증한 자격입니다.";
  } else if (lower === "video design") {
    desc = "영상 구성과 편집 흐름을 이해하고 시연 자료를 제작할 수 있는 역량을 검증한 자격입니다.";
  } else if (lower.includes("photoshop")) {
    desc = "Adobe Photoshop을 활용한 이미지 보정, 합성, UI/홍보 이미지 제작 역량을 검증한 자격입니다.";
  } else if (lower.includes("illustrator")) {
    desc = "Adobe Illustrator를 활용한 벡터 그래픽, 아이콘, 로고형 이미지 제작 역량을 검증한 자격입니다.";
  } else if (lower.includes("premiere")) {
    desc = "Adobe Premiere Pro를 활용한 게임 플레이 영상 편집과 시연 영상 제작 역량을 검증한 자격입니다.";
  } else if (lower.includes("after effects")) {
    desc = "Adobe After Effects를 활용한 모션 그래픽과 영상 효과 제작 역량을 검증한 자격입니다.";
  }
  return { name, issuer, date, desc };
}
function openAboutDetail() {
  const modal = $("aboutModal");
  const content = $("aboutDetailContent");
  if (!modal || !content) return;
  const avatar = DATA.profileAvatar || DATA.character || "assets/character.png";
  const timelineItems = [
    ...(DATA.education || []).map(item => ({ type: "교육", title: item, meta: item.includes("오즈코딩") ? "학력 및 교육" : "Education / Training", text: item.includes("오즈코딩") ? "넥스트러너스평생교육시설에서 AI를 활용한 기획서 작성과 Unity 기반 게임 개발 과정을 학습했습니다." : "게임 개발과 콘텐츠 제작 기반을 쌓은 학습 기록입니다." })),
    ...(DATA.awards || []).map(item => ({ type: "수상", title: item, meta: "Award", text: "문제를 정의하고 결과를 만들어낸 경험입니다." })),
    ...(DATA.activities || []).map(item => ({ type: "활동", title: item, meta: "Project / Activity", text: "직접 만들고 테스트하며 성장한 개발 기록입니다." }))
  ].slice(0, 6);
  const certificateCards = (DATA.certificates || []).map(certificateDetail);
  const philosophy = DATA.playPhilosophy || [];
  const skillCards = [
    ["Firebase / DB", "게임 진행 데이터와 저장 구조를 이해하고, 유저 정보가 안정적으로 이어지도록 설계합니다."],
    ["Unity & C#", "게임플레이 시스템, UI 흐름, 전투 피드백을 유지보수하기 좋은 구조로 구현합니다."],
    ["함께하는 재미", "혼자 플레이해도 같이 성장하고 도전하는 느낌이 들도록 루프와 피드백을 고민합니다."],
    ["플레이 테스트", "버튼을 누르는 순간의 감각과 결과 화면의 명확함을 직접 확인하며 개선합니다."]
  ];
  content.innerHTML = `
    <div class="about-detail-head">
      <div class="profile-avatar large">${mediaHTML(avatar, `${DATA.name} 프로필`)}</div>
      <div>
        <span class="block-kicker">DEVELOPER PROFILE</span>
        <h2>${escapeHTML(DATA.name || "KIM HANEUL")}</h2>
        <p>${escapeHTML(DATA.role || "Game Developer")} · ${escapeHTML(DATA.profileLocation || "Asia/Seoul")}</p>
        <div class="profile-tags">${(DATA.profileLanguages || []).map(lang => `<em>${escapeHTML(lang)}</em>`).join("")}</div>
      </div>
    </div>
    <section class="about-detail-section">
      <h3>${escapeHTML(DATA.aboutDetailTitle || DATA.aboutTitle || "상세 소개")}</h3>
      <p>${escapeHTML(DATA.aboutDetailText || DATA.aboutText || "")}</p>
    </section>
    <section class="about-philosophy">
      <div class="about-section-title">
        <h3>한 판 더를 만드는 장치들</h3>
        <p>저는 게임이 함께할 때 더 재미있어진다고 생각합니다. 그래서 플레이어가 다시 누르고, 같이 성장하고, 결과를 나누고 싶어지는 구조를 중요하게 봅니다.</p>
      </div>
      <div class="philosophy-grid">
        ${philosophy.map(([title, text], index) => `
          <article class="${index === 0 ? "feature" : ""}">
            <small>${index === 0 ? "LOOP MAKER'S NOTE" : `POINT ${index}`}</small>
            <h4>${escapeHTML(title)}</h4>
            <p>${escapeHTML(text)}</p>
          </article>
        `).join("")}
      </div>
    </section>
    <section class="about-detail-section">
      <h3>강점</h3>
      <div class="about-strength-grid">${(DATA.aboutStrengths || []).map(item => `<span>${escapeHTML(item)}</span>`).join("")}</div>
    </section>
    <section class="about-timeline-section">
      <div class="about-section-title center">
        <h3>성장 기록</h3>
        <p><span></span>교육 <span></span>활동 <span></span>경험</p>
      </div>
      <div class="about-timeline">
        ${timelineItems.map((item, index) => `
          <article class="timeline-card ${index % 2 ? "right" : "left"}">
            <small>${escapeHTML(item.type)}</small>
            <h4>${escapeHTML(item.title)}</h4>
            <b>${escapeHTML(item.meta)}</b>
            <p>${escapeHTML(item.text)}</p>
          </article>
        `).join("") || `<article class="timeline-card left"><small>기록</small><h4>성장 기록을 준비 중입니다</h4><b>Profile</b><p>관리자에서 활동 경험을 입력하면 이곳에 정리됩니다.</p></article>`}
      </div>
    </section>
    <section class="about-cert-section">
      <div class="about-section-title">
        <h3>보유 자격증</h3>
        <p>게임 개발 과정에서 필요한 UI 이미지와 플레이 영상까지 직접 다룰 수 있도록 쌓아온 제작 역량입니다.</p>
      </div>
      <div class="certificate-grid">
        ${certificateCards.map(cert => `
          <article class="certificate-card">
            <small>${escapeHTML(cert.issuer)}</small>
            <h4>${escapeHTML(cert.name)}</h4>
            <b>${escapeHTML(cert.date)}</b>
            <p>${escapeHTML(cert.desc)}</p>
          </article>
        `).join("") || `<article class="certificate-card"><small>Certificate</small><h4>자격증 준비 중</h4><b>Profile</b><p>관리자에서 자격증을 추가하면 이곳에 표시됩니다.</p></article>`}
      </div>
    </section>
    <section class="about-ability-section">
      <h3>보유 역량</h3>
      <div class="ability-grid">
        ${skillCards.map(([title, text]) => `
          <article>
            <h4>${escapeHTML(title)}</h4>
            <p>${escapeHTML(text)}</p>
          </article>
        `).join("")}
      </div>
    </section>
    <div class="about-info-grid compact">
      <section class="about-info-card"><h3>관심 분야</h3><ul>${(DATA.interests || []).map(item => `<li>${escapeHTML(item)}</li>`).join("")}</ul></section>
      <section class="about-info-card"><h3>학습 중</h3><ul>${(DATA.learning || []).map(item => `<li>${escapeHTML(item)}</li>`).join("")}</ul></section>
      <section class="about-info-card"><h3>작업 방식</h3><ul>${(DATA.workStyle || []).map(item => `<li>${escapeHTML(item)}</li>`).join("")}</ul></section>
    </div>
    <section class="about-detail-section">
      <h3>목표</h3>
      <p>${escapeHTML(DATA.aboutGoal || "")}</p>
    </section>
  `;
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}
function closeAboutDetail() {
  const modal = $("aboutModal");
  if (!modal) return;
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

function ensureAudio() {
  if (AUDIO_CTX) return AUDIO_CTX;
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return null;
  AUDIO_CTX = new AudioContextClass();
  MASTER_GAIN = AUDIO_CTX.createGain();
  MASTER_GAIN.gain.value = 0;
  MASTER_GAIN.connect(AUDIO_CTX.destination);
  return AUDIO_CTX;
}

function startAmbientSound() {
  const ctx = ensureAudio();
  if (!ctx || AMBIENT_NODES.length) return;
  const notes = [130.81, 164.81, 196, 246.94, 329.63];
  notes.forEach((frequency, index) => {
    const osc = ctx.createOscillator();
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    osc.type = index % 2 ? "sine" : "triangle";
    osc.frequency.value = frequency * (index > 2 ? 0.5 : 1);
    lfo.type = "sine";
    lfo.frequency.value = 0.035 + index * 0.012;
    lfoGain.gain.value = 2.6;
    filter.type = "lowpass";
    filter.frequency.value = 520 + index * 95;
    gain.gain.value = 0.007 + index * 0.0018;
    lfo.connect(lfoGain);
    lfoGain.connect(osc.detune);
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(MASTER_GAIN);
    osc.start();
    lfo.start();
    AMBIENT_NODES.push(osc, lfo, lfoGain, gain, filter);
  });
}

function stopAmbientSound() {
  AMBIENT_NODES.forEach(node => {
    try {
      node.stop?.();
      node.disconnect?.();
    } catch {}
  });
  AMBIENT_NODES = [];
}

function startBgmAudio() {
  const url = DATA.bgmUrl || "";
  if (!url) return false;
  stopAmbientSound();
  if (!BGM_AUDIO || BGM_AUDIO.dataset.sourceUrl !== url) {
    if (BGM_AUDIO) BGM_AUDIO.pause();
    BGM_AUDIO = new Audio(url);
    BGM_AUDIO.dataset.sourceUrl = url;
    BGM_AUDIO.loop = true;
    BGM_AUDIO.preload = "auto";
  }
  BGM_AUDIO.volume = 0.22;
  BGM_AUDIO.play().catch(() => {});
  return true;
}

function setSoundEnabled(enabled) {
  SOUND_ENABLED = enabled;
  localStorage.setItem(SOUND_PREF_KEY, String(enabled));
  const button = $("soundToggle");
  if (button) {
    button.classList.toggle("active", enabled);
    button.setAttribute("aria-pressed", String(enabled));
    button.textContent = enabled ? "Sound ON" : "Sound OFF";
  }
  const ctx = ensureAudio();
  if (!ctx || !MASTER_GAIN) return;
  if (ctx.state === "suspended") ctx.resume();
  if (enabled && !startBgmAudio()) startAmbientSound();
  if (!enabled && BGM_AUDIO) BGM_AUDIO.pause();
  MASTER_GAIN.gain.cancelScheduledValues(ctx.currentTime);
  MASTER_GAIN.gain.setTargetAtTime(enabled ? 0.34 : 0, ctx.currentTime, 0.55);
}

function playClickSound() {
  if (!SOUND_ENABLED) return;
  const ctx = ensureAudio();
  if (!ctx || !MASTER_GAIN) return;
  if (ctx.state === "suspended") ctx.resume();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "triangle";
  osc.frequency.setValueAtTime(740, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(980, ctx.currentTime + 0.035);
  gain.gain.setValueAtTime(0.0001, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.16, ctx.currentTime + 0.008);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.09);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.1);
}

function bindSoundControls() {
  const button = $("soundToggle");
  if (button) {
    button.classList.toggle("active", SOUND_ENABLED);
    button.setAttribute("aria-pressed", String(SOUND_ENABLED));
    button.textContent = SOUND_ENABLED ? "Sound ON" : "Sound OFF";
    button.addEventListener("click", event => {
      event.preventDefault();
      event.stopPropagation();
      setSoundEnabled(!SOUND_ENABLED);
      playClickSound();
    });
  }

  document.addEventListener("pointerdown", event => {
    if (SOUND_ENABLED) {
      ensureAudio()?.resume?.();
      if (!startBgmAudio()) startAmbientSound();
      if (MASTER_GAIN) MASTER_GAIN.gain.setTargetAtTime(0.34, AUDIO_CTX.currentTime, 0.55);
    }
    if (event.target.closest("a, button, [data-project-index], [data-open-related-project], .project-card, .featured-game-card")) {
      playClickSound();
    }
  }, { passive: true });
}

function bindSiteEvents() {
  document.addEventListener("click", event => {
    const filter = event.target.closest("[data-project-filter]");
    if (filter) {
      ACTIVE_PROJECT_FILTER = filter.dataset.projectFilter;
      renderProjectFilters();
      renderProjectGrid();
      return;
    }
    const related = event.target.closest("[data-open-related-project]");
    if (related) {
      openProject(Number(related.dataset.openRelatedProject));
      return;
    }
    const card = event.target.closest("[data-project-index]");
    if (card) openProject(Number(card.dataset.projectIndex));
    if (event.target.closest("[data-close-modal]")) closeProject();
    if (event.target.closest("#openAboutDetail")) openAboutDetail();
    if (event.target.closest("#openAboutDetailSide")) openAboutDetail();
    if (event.target.closest("[data-close-about]")) closeAboutDetail();
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      closeProject();
      closeAboutDetail();
    }
    const card = event.target.closest?.("[data-project-index]");
    if (card && (event.key === "Enter" || event.key === " ")) {
      event.preventDefault();
      openProject(Number(card.dataset.projectIndex));
    }
  });

  $("showAllProjects")?.addEventListener("click", () => {
    $("projects")?.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  document.querySelectorAll(".reveal").forEach(element => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add("show");
      });
    }, { threshold: 0.12 });
    observer.observe(element);
  });
}

window.addEventListener("DOMContentLoaded", () => {
  renderSite();
  bindSiteEvents();
  bindSoundControls();
});
