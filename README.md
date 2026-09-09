# SKY · 김하늘 게임 개발 포트폴리오

Unity 개발자 김하늘의 프로젝트와 개발 기록을 담은 정적 웹사이트입니다.

## 공개 주소

https://haneul68.github.io/khanuel-portfolio/

## 실행

이 폴더에서 정적 웹 서버를 실행하면 됩니다. 별도 패키지 설치나 서버 API가 필요하지 않습니다.

```sh
python -m http.server 4173
```

## 배포

GitHub Pages의 `Deploy from a branch` 설정에서 `gh-pages` 브랜치의 `/ (root)`를 선택합니다. `.nojekyll` 파일로 정적 파일을 그대로 배포합니다.

공개 저장소의 GitHub Pages와 기본 `github.io` 주소를 사용합니다. 별도 서버, 유료 도메인, 유료 빌드 서비스가 필요하지 않습니다. GitHub 서비스 정책과 사용량 한도는 적용됩니다.

- [GitHub Pages 무료 제공 조건과 사용량 한도](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits)
- [배포 브랜치 설정](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)

이 브랜치는 방문자에게 공개할 파일만 담은 배포본입니다. 원본 작업 폴더와 `main` 브랜치는 별도로 유지합니다. 프로젝트 데이터는 `portfolio-data.js`, 화면 동작은 `app.js`와 `pages.js`, 테마는 CSS 파일에서 관리합니다. 플레이 캡처는 전송 용량을 줄인 애니메이션 WebP를 사용합니다.

소개와 프로젝트 상세는 해시 주소를 사용하므로 별도 서버 경로 설정 없이 직접 열 수 있습니다.

- `#profile`
- `#projects`
- `#project/cops-catch`
- `#project/chaos-arena`
- `#project/gn-banc`
- `#project/shadow-core-defense`

실제 게임 캡처와 원래 포트폴리오 기록을 유지했습니다. 캐릭터와 하늘 지도 등 장식 일러스트는 이미지 생성 도구로 제작했으며 게임의 실제 화면을 대체하지 않습니다. 사용한 로컬 폰트의 라이선스는 `assets/fonts/`에 포함되어 있습니다.
