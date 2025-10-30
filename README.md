# moovy-frontend
영화 관람·리뷰 서비스 **Moovy**의 React 프론트엔드입니다.
각자 브랜치에서 개발 후 `develop`으로 병합해 협업합니다.
---
## 1) 프로젝트 개요 (Introduction)
- moovy-frontend는 영화 검색·리뷰·평점을 제공하는 SPA입니다.
- React + Redux Toolkit 기반, Vite로 번들링
## 2) 기술 스택 (Tech Stack)
- **Framework:** React, Vite
- **State:** Redux Toolkit, React-Redux
- **Routing:** React Router
- **UI:** iconify, Bootstrap, SCSS
- **Animations/UX:** GSAP, Swiper
- **HTTP:** Axios
- **Build & Quality:** Vite, ESLint, Prettier, TypeScript
## 3) 주요 기능 (Features)
- 회원가입/로그인(로컬 + 소셜 하이드레이션 구조)
- 영화 리스트/상세, 리뷰 작성 및 관리
- 마이페이지, 관리자 페이지(/admin)
## 4) 아키텍처 다이어그램
```bash
React(Vite) ↔ Axios ↔ Express API ↔ MySQL
        ↘ Redux Toolkit (global state)
```
🎨 [피그마 디자인](https://www.figma.com/design/PcgSz1u6Yqqa2NE4bsMxXd/Project-1--Design?node-id=24-32&p=f&t=iF7vrlJ9V9CCKU36-0)
🗺️ [피그마 유저 플로우](https://www.figma.com/board/aV7Gvqfld9whdizqcnLRcn/Project-1--User-Flow?node-id=0-1&p=f&t=3qkPCAYKImhXsBiR-0)
## 📁 폴더 구조
```bash
moovy-frontend/
├─ public/
├─ src/
│  ├─ app/
│  ├─ assets/
│  ├─ components/
│  │  └─ common/
│  ├─ features/
│  │  ├─ auth/
│  │  └─ ui/
│  ├─ pages/
│  │  ├─ Home/
│  │  ├─ auth/
│  │  ├─ movies/
│  │  ├─ reviews/
│  │  ├─ profile/
│  │  └─ admin/
│  ├─ routes/
│  │  └─ guards/
│  ├─ services/
│  │  └─ api/
│  ├─ styles/
│  ├─ types/
│  └─ utils/
└─ (root configs: tsconfig.*, vite.config.ts, eslint/prettier 등)
```
### 폴더 캡션
- public/: 정적 리소스(파비콘 등)
- src/: 애플리케이션 소스 루트
  - app/: 전역 상태(store, rootReducer), typed hooks
  - assets/: 이미지/아이콘/폰트 등 정적 자산
  - components/: 재사용 UI 컴포넌트 (공통은 common/)
  - features/: Redux slices(도메인 상태/비동기 로직)
  - pages/: 라우팅 단위 화면(홈/영화/리뷰/프로필/관리자)
  - routes/: 라우터 구성 및 접근 가드(Guest/User/Admin)
  - services/: 외부 통신 계층, api/(axios 인스턴스·모듈)
  - styles/: 전역 SCSS
  - types/: 전역 타입 선언(d.ts), env 타입
  - utils/: 공용 유틸(GSAP 설정 등)
## 📦 Import 순서 가이드
> import는 아래 순서로 정렬하고, 그룹 사이엔 한 줄 공백을 둡니다.
- 외부 라이브러리 (React, Router, MUI, Redux…)
- 내부 유틸/전역/서비스 (utils, hooks, api…)
- 컴포넌트 (공통/도메인 컴포넌트)
- 스타일 (scss/css)
## 👥 브랜치 전략
- 운영 브랜치: develop
- 개인 작업 브랜치: ysy, jsy, jse, kty
> 모든 기능 개발은 **개별 브랜치(ysy/jsy/jse/kty)** 에서 진행하고,
> 완료 후 `develop` **기준으로 PR을** 생성합니다.
## 🔀 브랜치 작업 방법
### 1) 원격 브랜치 최초 체크아웃
```bash
git checkout -t origin/브랜치이름
# 예) git checkout -t origin/jsy
```
### 2) 이후 이동
```bash
git checkout 브랜치이름
```
### 3) 최초 push 업스트림 연결
```bash
git push --set-upstream origin 브랜치이름
# 이후에는 git push 만으로 OK
```
---
## ✍️ Git 커밋 메시지 규칙
### 형식
```bash
git commit -m "[태그] 작업 요약"
# 예:
git commit -m "[feat] 로그인 API 구현"
git commit -m "[fix] 영화 목록 페이징 버그 수정"
```
### 태그
| 태그       | 설명                                        |
| ---------- | ------------------------------------------- |
| `feat`     | 새로운 기능 추가                            |
| `patch`    | 간단한 수정 (줄바꿈, 줄추가, 정렬 등)       |
| `fix`      | 버그 수정                                   |
| `refactor` | 코드 리팩토링 (기능 변화 없음)              |
| `style`    | 스타일, 포맷팅, 주석 등 UI 외 변경          |
| `docs`     | 문서 (README 등) 변경                       |
| `test`     | 테스트 코드 추가/수정                       |
| `chore`    | 빌드, 패키지 매니저, 설정 파일 등 기타 작업 |
| `remove`   | 불필요한 코드/파일 제거                     |
> 메시지는 한 줄 요약(≈50자)으로, 의도가 드러나게 작성합니다.
