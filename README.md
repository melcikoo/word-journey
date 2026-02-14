# 단어의 여정 — 웹 배포 가이드

## 방법 1: GitHub Pages (무료, 추천)

### 1단계: GitHub에 저장소 만들기
1. https://github.com/new 에서 새 저장소 생성
2. 저장소 이름: `word-journey` (원하는 이름 가능)
3. Public으로 설정

### 2단계: 코드 올리기
```bash
# zip 파일 압축 해제 후
cd word-journey

# vite.config.js에서 base를 저장소 이름에 맞게 수정
# base: '/word-journey/'  ← 저장소 이름과 동일하게

git init
git add .
git commit -m "첫 배포"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/word-journey.git
git push -u origin main
```

### 3단계: GitHub Pages 활성화
1. 저장소 → Settings → Pages
2. Source: **GitHub Actions** 선택
3. push하면 자동으로 `.github/workflows/deploy.yml`이 실행됨
4. 1~2분 후 배포 완료

### 배포 URL
```
https://YOUR_USERNAME.github.io/word-journey/
```

---

## 방법 2: Vercel (무료, 가장 간단)

### 1단계
1. https://vercel.com 가입 (GitHub 계정으로)
2. "New Project" → GitHub 저장소 import

### 2단계
- Framework Preset: **Vite** 선택
- 다른 설정 변경 불필요
- "Deploy" 클릭

### 3단계
- `vite.config.js`에서 `base` 줄을 삭제하거나 `'/'`로 변경
  ```js
  base: '/',
  ```

### 배포 URL
```
https://word-journey-xxxxx.vercel.app
```
(커스텀 도메인 연결 가능)

---

## 방법 3: Netlify (무료)

1. https://app.netlify.com
2. "Add new site" → "Import an existing project" → GitHub 연결
3. Build command: `npm run build`
4. Publish directory: `dist`
5. `vite.config.js`의 `base`를 `'/'`로 변경

---

## 로컬에서 테스트

```bash
cd word-journey
npm install
npm run dev
# → http://localhost:5173 에서 확인
```

## 콘텐츠 수정 후 재배포

1. `src/App.jsx`에서 CHAPTERS 데이터 수정
2. `git add . && git commit -m "챕터 수정" && git push`
3. GitHub Actions가 자동으로 재빌드 & 배포 (1~2분)

---

## 프로젝트 구조
```
word-journey/
├── index.html              # HTML 진입점
├── package.json            # 의존성 & 스크립트
├── vite.config.js          # 빌드 설정 (base URL 여기서 변경)
├── src/
│   ├── main.jsx            # React 마운트
│   └── App.jsx             # 게임 전체 코드 (= crossword-game-v3.jsx)
└── .github/
    └── workflows/
        └── deploy.yml      # GitHub Pages 자동 배포
```

## 주의사항
- GitHub Pages 사용 시 `vite.config.js`의 `base`가 저장소 이름과 일치해야 함
- Vercel/Netlify 사용 시 `base`를 `'/'`로 변경
- 모바일 최적화 완료 (viewport meta 설정됨)
