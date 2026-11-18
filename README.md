# 12강 공통 실습 프로젝트 — 휴게소 시설점검 현황판

이 프로젝트는 **GitHub → Vercel → 자동 재배포 → Supabase DB 연결 → 최종 검증**을 모든 수강생이 실습하도록 만든 React + Vite 예제입니다.

> **교육용 가상 데이터**만 사용합니다. 실제 한국도로공사 자료나 개인정보가 아닙니다. 웹앱에는 로그인·저장·수정 기능이 없습니다.

## 1. 프로젝트 실행 (DB 없이 가능)

**준비물:** Node.js 20.19 이상(권장 22 LTS), 인터넷 연결

```bash
npm install
npm run dev
```

브라우저에서 터미널에 표시된 `http://127.0.0.1:5173/`에 접속하세요.

DB 연결 전에는 **5건의 가상 데이터**가 자동 표시됩니다. 이름 검색, 상태 필터, 상태별 통계를 사용할 수 있습니다.

## 2. GitHub에 저장하고 Vercel 배포

1. 새 GitHub 저장소를 생성합니다. 프로젝트 **안에 있는 파일**을 업로드합니다(상위 폴더가 한 번 더 들어가지 않도록 주의).
2. `.env.local`, `node_modules/`, `dist/`는 **업로드하지 않습니다.** `.env.example`은 올려도 됩니다.
3. Vercel에 로그인하고 `Add New → Project`에서 해당 GitHub 저장소를 Import합니다.
4. 설정을 확인합니다: **Framework = Vite**, **Build Command = `npm run build`**, **Output Directory = `dist`**.
5. 첫 배포 후 `https://프로젝트명.vercel.app`에서 가상 데이터가 보이는지 확인합니다.

**자동 재배포 실습:** `src/App.jsx`에서 화면 제목 `휴게소 시설점검`을 `우리 팀 시설점검`으로 수정하고 GitHub에 커밋·푸시합니다. Vercel이 새 배포를 시작하는지 확인합니다.

## 3. Supabase DB 프로젝트 생성 (전원 필수)

1. https://supabase.com 에 로그인하고 **새 프로젝트**를 생성합니다. 이 과정에서 클라우드 PostgreSQL DB가 준비됩니다. 로컬에 PostgreSQL을 설치하지 않습니다.
2. Supabase Dashboard → **SQL Editor**를 엽니다.
3. 이 프로젝트의 **`supabase/setup.sql`을 전부 복사해서 실행**합니다.
4. `public.rest_area_inspections`에 **가상 행 5건**이 생성되었는지 확인합니다.
5. 읽기 전용 RLS 정책 `lab_public_read_only`가 활성화되어 있는지 확인합니다. 누구나 조회할 수 있으므로 실제 업무 데이터를 넣지 않습니다.

## 4. 로컬 React 앱과 Supabase 연결 (배포 실패 수강생도 가능)

1. `.env.example` 파일을 복사하여 **`.env.local`**로 만듭니다.
2. Supabase Dashboard의 **Connect** 또는 **Project Settings → API Keys**에서 **Project URL**과 **Publishable key**를 확인합니다.
3. `.env.local`에 값을 넣습니다.

```dotenv
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
```

4. 기존 개발 서버를 종료한 뒤 `npm run dev`로 **재시작**합니다. 환경변수는 Vite 서버 시작 시 읽습니다.
5. 화면의 파란 알림이 **"Supabase 클라우드 DB 연결됨 / LIVE DB"**로 바뀌었는지 확인합니다.

> `.env.local`의 키는 **Publishable key**(구형 프로젝트의 anon key도 지원)만 사용합니다. `service_role`, `sb_secret_` 등 관리자·비밀 키를 넣지 마세요. 공개용 키도 SQL의 RLS 정책 없이 안전한 것은 아닙니다.

## 5. 배포된 Vercel 앱과 Supabase 연결 (배포 성공 수강생)

1. Vercel 프로젝트 → **Settings → Environment Variables**에서 다음 두 항목을 **Production**에 등록합니다.
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_PUBLISHABLE_KEY`
2. 값을 입력한 후 **Redeploy**를 실행합니다. `VITE_` 환경변수는 빌드에 포함되므로 이전 배포에 자동 반영되지 않습니다.
3. 배포 URL을 새로고침해 **LIVE DB** 표기를 확인합니다.

이 예제는 DB 연결 코드가 처음부터 포함되어 있습니다. 따라서 DB 설정 시 **코드를 따로 수정할 필요 없이 환경변수만 추가**하면 됩니다.

## 6. 최종 검증 (전원 필수)

1. Supabase → Table Editor → `public.rest_area_inspections`를 엽니다.
2. `영동 B휴게소`의 `status`를 `점검 필요`에서 **`정상`**으로 수정합니다. 대시보드에서만 직접 수정하세요(웹앱은 조회 전용).
3. **로컬 또는 Vercel 웹앱**에서 `데이터 새로고침` 버튼을 누릅니다.
4. 영동 B휴게소의 상태가 **정상**으로 바뀌고, 상태별 통계가 **정상 3→4건 / 점검 필요 1→0건**으로 바뀌면 성공입니다.

| 확인 항목 | 성공 기준 |
| --- | --- |
| DB 미연결 | `DEMO DATA`, 가상 데이터 5건 |
| DB 연결 | `LIVE DB`, DB 데이터 5건 |
| Supabase 테이블 | 5건이 존재, RLS 조회 정책 존재 |
| DB 데이터 변경 | 새로고침 후 화면과 상태별 통계 변경 |
| DB 조회 실패 | 오류 표시, 가상 데이터로 **조용히 대체하지 않음** |

## 7. 문제 해결

- `npm` 명령을 찾을 수 없음: Node.js 설치·PATH 확인.
- 빈 화면: 브라우저 개발자 도구와 터미널 오류 확인. `npm install` 및 `npm run build` 재시도.
- Supabase `permission denied` / `42501`: SQL 권한과 RLS 조회 정책 확인.
- Supabase `relation does not exist` / `42P01`: `supabase/setup.sql`이 올바른 프로젝트에 실행되었는지 확인.
- `Failed to fetch`: URL, 연결 상태, 방화벽·네트워크 정책 확인.
- 웹앱에 `DEMO DATA`가 계속 보임: `.env.local`의 **두 값 모두** 설정했는지 확인하고 Vite 서버를 재시작. Vercel은 환경변수 등록 후 **Redeploy**.
- `LIVE DB`인데 테이블에 데이터가 없음: 올바른 Supabase 프로젝트의 테이블을 확인.

## 8. 강의용 프롬프트

**GitHub → Vercel:**

> 이 React + Vite 프로젝트를 GitHub에 저장한 뒤 Vercel에 배포해줘. 네가 할 수 있는 일은 직접 진행하고, 내가 해야 하는 일은 하나씩 안내해줘. 업로드나 배포 전에 내 확인을 받아줘.

**Supabase 연결:**

> 이 프로젝트의 `supabase/setup.sql`을 이용해 실습용 Supabase DB를 만들고 연결해줘. 로컬 앱과 Vercel 앱 중 가능한 쪽에서 데이터를 읽게 해줘. 내가 직접 해야 하는 로그인·승인·키 설정은 안내해줘. 실제 데이터 대신 가상 데이터만 사용해줘.

**검증:**

> Supabase에서 가상 데이터 한 건을 수정했어. 웹앱을 새로고침해서 상태와 통계가 바뀌었는지 확인해줘. 정확한 결과와 오류가 있으면 알려줘.

---

### 사용 기술

- React 19, Vite 7, `@supabase/supabase-js` 2
- 프론트엔드 전용 정적 웹앱(Vercel에서 서버·DB 설치 불필요)
- Supabase PostgreSQL(클라우드 DB), 익명 읽기 전용 접근 정책

### 참고 문서

- [Supabase React 시작하기](https://supabase.com/docs/guides/getting-started/quickstarts/reactjs)
- [Vercel Vite 배포 가이드](https://vercel.com/docs/frameworks/frontend/vite)
- [Vercel Git 연동](https://vercel.com/docs/git)
