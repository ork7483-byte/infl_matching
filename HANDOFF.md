# 인플릭스 (Inflix) — 새 세션 인수인계

## 프로젝트 개요

- **서비스명**: 인플릭스 (Inflix)
- **URL**: https://inflmatching.vercel.app
- **GitHub**: https://github.com/ork7483-byte/infl_matching
- **기술 스택**: Next.js 14 (App Router) + TypeScript + Tailwind CSS + Prisma 5 + PostgreSQL (Neon via Vercel) + NextAuth.js v4 + Recharts
- **테마**: 화이트(라이트) 테마, 액센트 퍼플 #7c3aed / 핑크 #e94560
- **폰트**: Inter (next/font/google) + Pretendard (CDN)
- **경로**: `E:\saas\infl_marketing`

## 현재 규모

| 항목 | 수량 |
|------|------|
| 페이지 | 85 |
| API 라우트 | 83 |
| 컴포넌트 | 24 |
| Lib 모듈 | 10 |
| Prisma 모델 | 38 |
| 총 TS/TSX 파일 | 225 |
| 빌드 페이지 | 144 |
| 커밋 | 34 |

## 완료된 작업 (1~17차 + 전수 점검)

### 1차: 프로젝트 초기화 + DB + 인증 + 레이아웃 + 퍼블릭 페이지
### 2차: Search 페이지 + Gallery 페이지 + GNB 분리
### 3차: 홈+Search 통합 + 광고 랜딩 3개 (/start, /start/brand, /start/creator)
### 4차: 요금제 페이지 (3단 Free/Pro/Enterprise + 얼리 액세스 + 비교표 + FAQ)
### 5차: 리브랜딩 InfluSync → Inflix + 다크 → 화이트 테마
### 6차: 버그 수정 (Gallery 크래시, /register 404, 모바일 최적화)
### 7차: Admin 대시보드 (6페이지 + 15 API + ADMIN role 보호)
### 8차: 마케팅 퍼널 확장 (EventLog + 퍼널/유입/전환/유지/실험실 5서브페이지)
### 9차: 성장 전략 (SEO 도구 3개 + 온보딩 + 리퍼럴 + 바이럴)
### 10차: Collabstr 카드 + 필터 4개 + 무료 도구 6개 + 캠페인브리프/계약서
### 11차: 무료 도구 6개 추가 (EMV, 해시태그, 경쟁사, 멘션, 트렌딩, 유사) + GNB 그룹핑
### 12차: 브랜드 고급 5개 (CRM, 아웃리치, 미디어플랜, 앰배서더, 시장분석) + 경쟁사 비교표
### 13차: AI Studio (가상 AI 모델 12명 + 생성 + 크레딧)
### 14차: 자동 수집 시스템 + 중개 매칭 + 브랜드 가입 보너스
### 15차: AQS 4축 업그레이드 + IGR 신규 + /tools/instagram-grade
### 16차: AI Muse (킬러 피처 — 인플루언서 AI 분신 + 수익 분배 60:40)
### 17차: GNB 재설계 (무료 도구 삭제) + For Brands/Creators 허브 (인플루언서 등급 핵심 도구)
### 전수 점검: 118항목 전체 ✅ + 용어 변경 (AI 분신→AI Muse, 미디어킷 제거) + 온보딩 최종화

## 주요 기능

### 핵심 기능
- **인플루언서 등급**: 종합 등급(S/A/B/C/D) = AQS(50%) + IGR(50%)
- **AQS** (4축): 참여진정성 35% + 오디언스품질 30% + 성과일관성 20% + 댓글품질 15%
- **IGR** (4축): 릴스성과 30% + 참여품질 25% + 콘텐츠전략 25% + 성장모멘텀 20%
- **예상 광고단가**: 피드 (팔로워/1K×₩10K), 릴스 (조회수/1K×₩20K), 스토리 (팔로워/1K×₩5K) × 등급 보정

### 사용자 구조
- **브랜드**: 인플루언서 검색 → 분석 → 매칭 요청 → 캠페인 → 리포트
- **크리에이터**: Instagram 연동 → 카테고리 선택 → AI Muse 생성 → 수익 발생
- **Admin**: 대시보드, 마케팅 퍼널, 사용자/캠페인/매출 관리, 수집/매칭 관리

### AI Studio
- 12명 가상 AI 모델 (여성 6 + 남성 6)
- 크레딧 시스템 (Free 3건/월, Pro 50건/월)
- Search/Gallery에 실제 인플루언서 / AI 모델 탭 분리

### AI Muse (킬러 피처)
- Instagram 연동만 하면 인플루언서 닮은 AI 모델 자동 생성
- 브랜드가 AI Muse 사용 시 수익 분배 (크리에이터 60% / 플랫폼 40%)
- AIMuse, MuseRevenue, MuseUsageLog DB 모델

### 자동 수집
- Business Discovery API로 공개 계정 자동 수집
- /data/collection-seeds.json (30개 브랜드 시드)
- 자동 확산: @멘션 추출 → 새 시드 추가

### 중개 매칭
- 브랜드→인플릭스→인플루언서 (직접 연락 차단)
- MatchRequest 모델 (pending → contacting → accepted/rejected)

## 테스트 계정

| 역할 | 이메일 | 비밀번호 |
|------|--------|----------|
| Admin | ork7483@gmail.com | 1111 |
| Brand | brand1@test.com | 1111 |
| Creator | creator1@test.com | 1111 |

## 환경변수 (Vercel)

DATABASE_URL, NEXTAUTH_URL, NEXTAUTH_SECRET, META_APP_ID, META_APP_SECRET,
INSTAGRAM_ACCESS_TOKEN (장기 토큰, 2026-06-06 만료), INSTAGRAM_USER_ID, FACEBOOK_PAGE_ID

## 다음 세션에서 할 작업

### gstack Step 1~4 (STEP1_GSTACK_CHECK.md)

```
1. /review — 전체 코드 리뷰 (보안, N+1, 미사용 변수, 인증 체크 등)
2. /qa https://inflmatching.vercel.app — 7개 핵심 페이지 브라우저 테스트
3. /plan-design-review — 디자인 감사 (AI Slop, 색상 일관성, 간격)
4. 디자인 이슈 수정 — CSS만 변경, 커밋별 분리
```

### 유의 사항
- gstack v0.15.15.1 설치됨 (업그레이드 가능)
- browse 바이너리: `~/.claude/skills/gstack/browse/dist/browse`
- ui-ux-pro-max: `~/.claude/skills/ui-ux-pro-max/` (search.py 동작 확인됨)
- Vercel Pro 플랜 (배포 무제한, 빌드 시간 400시간/월)
- .env 파일은 .gitignore에 포함됨 (Git에 올라간 적 없음)

## 파일 구조 핵심

```
src/
├── app/
│   ├── page.tsx              # 메인 (Search+Home 통합, ~1800줄)
│   ├── gallery/              # Gallery (Masonry)
│   ├── ai-studio/            # AI Studio (5페이지)
│   ├── for-brands/           # For Brands 허브 + 서브페이지
│   ├── for-creators/         # For Creators 허브 + 서브페이지
│   ├── pricing/              # 요금제 (3단+비교표)
│   ├── admin/                # Admin (12페이지)
│   ├── dashboard/brand/      # 브랜드 대시보드 (12페이지)
│   ├── dashboard/creator/    # 크리에이터 대시보드 (9페이지)
│   ├── tools/                # 무료 도구 (18페이지)
│   ├── influencer/[username] # 인플루언서 프로필
│   ├── start/                # 광고 랜딩 (3페이지)
│   ├── (auth)/               # 로그인/가입
│   ├── ambassador/           # 앰배서더 공개 페이지
│   ├── invite/               # 리퍼럴 초대 랜딩
│   ├── connect/              # Instagram 연동
│   ├── contact/              # Enterprise 문의
│   ├── privacy/ + terms/     # 법적 페이지
│   └── api/                  # 83개 API 라우트
├── components/
│   ├── layout/               # Navbar, Footer, DashboardLayout, AdminLayout
│   ├── charts/               # 5개 Recharts 컴포넌트
│   ├── gallery/              # GalleryCard, ContentDetailModal
│   ├── landing/              # 4개 랜딩 컴포넌트
│   ├── ui/                   # Button, Card, Input, Badge, Select
│   ├── BlurOverlay.tsx       # 비회원 블러
│   ├── MaskedValue.tsx       # 값 마스킹
│   ├── Providers.tsx         # SessionProvider
│   └── InfluencerValueReport.tsx  # 등급 도구 (brand/creator 공유)
├── lib/
│   ├── prisma.ts             # Prisma 싱글톤
│   ├── auth.ts               # NextAuth 설정
│   ├── instagram.ts          # IG Graph API 클라이언트
│   ├── aqs.ts                # AQS 4축 계산
│   ├── igr.ts                # IGR 4축 계산
│   ├── benchmarks.ts         # 팔로워 티어 벤치마크
│   ├── prediction.ts         # 예상 광고단가
│   ├── fake-detection.ts     # 가짜 팔로워 탐지
│   ├── collection.ts         # 자동 수집 로직
│   └── ai-muse.ts            # AI Muse 생성 로직
└── types/
    ├── index.ts
    └── next-auth.d.ts
```
