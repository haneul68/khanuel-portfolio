# KHANEUL Game Developer Portfolio

게임 개발자 포트폴리오 정적 웹사이트입니다.

## 실행

- 방문자 화면: `index.html`
- 관리자 화면: `admin.html`

로컬에서는 `index.html`을 열어 확인할 수 있습니다.

## GitHub Pages 배포

1. GitHub에 새 저장소를 만듭니다.
2. 이 폴더의 파일을 저장소에 올립니다.
3. GitHub 저장소에서 `Settings` -> `Pages`로 이동합니다.
4. `Build and deployment`에서 `Deploy from a branch`를 선택합니다.
5. Branch는 `main`, 폴더는 `/root`를 선택하고 저장합니다.

배포 후 링크 예시:

`https://haneul68.github.io/저장소이름/`

한 번 만든 링크는 유지됩니다. 이후 수정본을 같은 저장소에 다시 올리면 방문자는 같은 링크를 새로고침해서 최신 내용을 볼 수 있습니다.

## 관리자 저장 방식

현재 관리자 화면에서 수정한 내용은 브라우저의 `localStorage`에 저장됩니다.

즉, 내 컴퓨터에서 관리자 화면으로 수정한 내용은 내 브라우저에는 바로 반영되지만, GitHub Pages 방문자에게 자동으로 공유되지는 않습니다. 방문자에게 최신 내용을 보여주려면 수정된 사이트 파일을 다시 GitHub에 업로드해야 합니다.

나중에 관리자 수정 내용을 모든 방문자에게 실시간 반영하려면 Firebase 같은 외부 데이터베이스 연결이 필요합니다.

## 포함된 주요 파일

- `index.html`: 방문자용 페이지
- `admin.html`: 관리자 페이지
- `app.js`: 방문자 화면 데이터와 동작
- `admin.js`: 관리자 화면 동작
- `style.css`: 전체 디자인
- `assets/`: 이미지와 배경음 파일
