# PRD: 밸런스 모임 (Balance Moim)

## 0. 서비스 철학 및 소개

### 0.1 밸런스 모임?
**"밸런스 모임?"** - 이게 뭐임?

이름 자체가 질문입니다. 처음 듣는 사람들이 "밸런스 모임이 뭐야?"라고 궁금해하는 그 순간부터 서비스가 시작됩니다.

**밸런스 모임 = 밸런스 질문 + 모임**
- 둘 중 하나를 선택하는 **밸런스 질문**으로 취향을 공유하고
- 나와 같은 **모임**에 속한 사람들과 선택을 비교하며 친목을 도모합니다

### 0.2 핵심 가치
두 가지 선택지 중 하나를 고르는 과정은 나의 취향을 드러내는 일이고, 다른 사람들의 선택을 보는 것은 그들을 이해하는 일입니다. 같은 모임에 속한 사람들이 수십, 수백 개의 질문에 답하며 서로의 취향을 알아가는 것은 마치 **사람들 간의 균형을 맞춰나가는 통신**과 같습니다.

### 0.3 첫 접속 시 표시 문구
메인 페이지 접속 시 다음 문구를 표시합니다:

```
🎯 밸런스 모임?

당신의 선택은 무엇인가요?
밸런스 질문으로 취향을 나누고,
모임 친구들과 비교하며 서로를 알아가세요.

[시작하기]
```

---

## 1. 개요

### 1.1 서비스명
**밸런스 모임** - 모임 기반 밸런스 게임 플랫폼

### 1.2 목표
회사, 동아리, 교회 등 다양한 모임에 속한 사람들이 재미있는 양자택일 질문을 통해 서로의 취향을 발견하고, 누가 나와 가장 비슷한 취향을 가졌는지 파악하여 친목을 도모할 수 있는 웹 서비스를 제공한다.

### 1.3 핵심 기능
- **모임 중심 비교**: 내가 속한 모임 사람들의 응답 비교
- **취향 유사도 분석**: 같은 모임에서 나와 가장 취향이 비슷한 사람을 자동으로 찾아줌
- **커스텀 컨텐츠**: 사용자가 직접 질문을 만들고, 모임 전용 질문도 생성 가능

### 1.4 MVP 목표
- **100개 밸런스 질문 등록** (핵심 KPI)
- 최소 10개 모임 생성
- 모임당 평균 5명 이상 멤버

---

## 2. 사용자 스토리

**비로그인 사용자**
- "가볍게 밸런스 게임을 즐기고 싶다. 응답은 통계에만 반영되고 개인 기록은 남지 않는다는 것을 알고 있다."

**로그인 사용자**
- "회사 동료들이 어떤 선택을 했는지 보며 대화 소재를 만들고 싶다."
- "우리 모임만의 밸런스 질문을 만들어 친구들에게 공유하고 싶다."
- "내 이름이 아닌 별명으로 다른 사람들에게 표시되길 원한다."

**모임 생성자**
- "멤버들을 초대하고 관리하고 싶다."

---

## 3. 기능 요구사항

### 3.1 인증 및 사용자 관리

#### 로그인
- Google OAuth 2.0 간편 로그인
- 로그인 없이도 플레이 가능 (기록 저장 안 됨)
- 비로그인 안내: "로그인하지 않으면 응답 기록이 저장되지 않으며, 모임 기능을 사용할 수 없습니다."

#### 사용자 설정
- 표시 이름 설정: 구글 계정명 또는 익명 별명 (2~12자)
- 설정 변경 시 모든 모임에 일괄 적용

#### 회원 탈퇴
- 사용자 상태를 탈퇴(status = -1)로 변경, 등록한 질문은 유지되며 기존 응답은 "(탈퇴한 사용자)"로 표시
- 생성한 모임이 있으면 관리자 위임 또는 모임 삭제 필요

### 3.2 밸런스 게임 플레이

#### 질문 표시 및 선택
- 화면에 1개의 질문과 2개의 선택지 표시
- 예시: "더 맛있는 진라면은?" → [매운맛] vs [순한맛]
- **재응답 불가**: 한번 선택하면 수정 불가
- **첫 질문 시작 시 안내**:
    ```
    ⚠️ 주의사항
    • 한 번 선택한 답변은 수정할 수 없습니다.
    • 신중하게 선택해주세요!
    [시작하기]
    ```

#### 결과 표시
선택 직후 아래 정보를 표시:
**전체 통계**
- 각 선택지의 비율: "매운맛 63% (1,234명) vs 순한맛 37% (723명)" (가로 막대 그래프와 비율 %)

**모임별 통계** (로그인 사용자만)
- 내가 속한 모임별로 선택 비율 표시
- 예:
    ```
    [회사 동료들] 매운맛 80% vs 순한맛 20%
    [대학 동기들] 매운맛 45% vs 순한맛 55%
    ```

#### 다음 질문
- "다음 질문" 버튼 클릭 → 새로운 랜덤 질문 표시
- 로그인 사용자는 이미 응답한 질문 제외
- 태그별 필터링 가능

### 3.3 질문 관리

#### 질문 등록 (로그인 필수)
**필수 입력**
- 질문 제목 (필수, 최대 100자)
- 선택지 A, B (필수, 최대 50자)
- 태그 1개 이상 (기존 태그 검색 자동완성, 신규 태그 등록 가능)

**공개 설정**
- 전체 공개: 모든 사용자가 볼 수 있음
- 모임 전용: 내가 속한 모임 중 1개 선택 (모든 멤버가 생성 가능) → 해당 모임 멤버만 볼 수 있음
- 비공개: 나만 보기 (임시 저장)

#### 질문 관리 페이지
- 내가 등록한 질문 목록 조회 (전체 공개, 모임 전용, 비공개 모두 포함)
- 각 질문별 통계 확인: 총 응답 수, 선택지별 비율, 모임 전용 질문의 경우 해당 모임 내 응답 통계
- 질문 수정: 제목, 선택지, 태그, 공개 설정
- 질문 삭제: **Soft Delete** (DB에는 유지, 화면에서만 숨김)

### 3.4 모임 (Group) 기능

#### 모임 생성 ("모임 생성" 버튼 클릭)
- 입력: 모임 이름 (필수, 최대 30자), 설명 (선택, 최대 200자)
- 생성자가 자동으로 관리자가 됨

#### 초대 링크
- 생성자 + 멤버 모두 초대 링크 생성 가능 ("링크 복사" 버튼으로 클립보드에 복사)
- 형식: `https://balance-moim.com/invite/[CODE]`
- 유효기간: 30일 (자동 만료)
- 로그인한 사용자만 초대 링크를 통해 모임 참여 가능 (비로그인 사용자가 링크 클릭 시 → 로그인 유도 → 로그인 후 자동 참여)

#### 모임 관리 (생성자 전용)
- 모임 정보 수정 (이름, 설명)
- 멤버 목록 조회 및 강제 퇴출
- 퇴출된 멤버의 응답은 통계에 남음

#### 모임 나가기
- 일반 멤버: 언제든지 나가기 가능 (응답은 통계에 유지)
- 생성자: 관리자 위임 후 나가기 또는 모임 삭제

### 3.5 모임 내 분석
- 각 모임 클릭 → 모임 상세 페이지로 이동
#### 모임 상세 페이지
- 전체 멤버의 응답 비교
- 각 질문별 모임 내 선택 비율
- 태그별 필터링 (예: #음식 태그만 보기)

**특정 사용자 선택 시:**
- 해당 사용자가 응답한 질문들과 그의 선택 확인
- 나와의 일치율 표시
- "(탈퇴한 사용자)"의 경우도 통계에 포함되어 표시됨
#### 취향 유사도 랭킹
- 같은 모임 내에서 나와 동일한 선택을 가장 많이 한 사용자 순위 (탈퇴한 사용자 status = -1은 제외)
- 표시: 사용자 이름, 일치율 %, 공통 질문 수
- 예: "철수님과 85% 일치 (20개 중 17개 동일)"
- 특정 사용자 클릭 → 질문별 상세 비교 화면: 질문별로 나의 선택 vs 상대의 선택 나란히 표시

### 3.6 태그 시스템
- 각 질문은 1개 이상의 태그 보유
- 예시: #음식, #연애, #취미, #직장생활, #MBTI
- 질문 등록 시 기존 태그 검색 (자동완성)
- 태그별 질문 필터링

---

## 4. 비-목표 (Non-Goals - 이번 버전에서 제외)

**Phase 2 이후 고려**
- 댓글/토론 기능
- 이미지 첨부
- 웹 푸시 알림 (새 질문, 멤버 참여, 순위 변동)
- 모임 내 랭킹 시스템
- 질문 신고/차단 기능

**완전 제외**
- 카카오톡, 네이버 등 다른 소셜 로그인
- 모바일 앱
- 실시간 채팅
- 질문 재응답 기능

---

## 5. 디자인 및 UI/UX

### 5.1 주요 화면

#### 메인 페이지
```
[첫 접속 시 소개 문구] (0.3 첫 접속 시 표시 문구 참고)
🎯 밸런스 모임?
당신의 선택은 무엇인가요?
[시작하기]
(⚠️ 주의사항 한 번 선택한 답변은 수정할 수 없습니다)

[질문 화면]
더 맛있는 진라면은?
[매운맛] vs [순한맛]
태그: #음식 #라면

[결과 화면]
전체: 매운맛 63% vs 순한맛 37%
[회사 동료들] 매운맛 80% vs 순한맛 20%
[다음 질문 →]
```

#### 내 모임 페이지
```
┌─ 내가 속한 모임 ─────────────┐
│ [회사 동료들] 12명           │
│   → 응답한 질문: 45개         │
│                              │
│ [대학 동기] 8명              │
│   → 응답한 질문: 28개         │
│                              │
│ [교회 청년부] 25명            │
│   → 응답한 질문: 62개         │
│                              │
│ [+ 모임 생성]                │
└──────────────────────────────┘
```

#### 모임 상세 페이지
```
[회사 동료들] ⚙️설정 (생성자만)

📊 모임 통계
- 멤버 수: 12명
- 응답한 질문 수: 45개
- [초대 링크 생성 📋]

🏆 나와 가장 비슷한 사람
1. 철수 (85% 일치) - 20개 중 17개 동일
2. 영희 (78% 일치) - 18개 중 14개 동일

📋 모임 멤버들의 응답
[태그 필터: 전체▼ | #음식 | #취미 | #연애]

질문 1: 치킨은?
  → 후라이드 70% (7명) vs 양념 30% (3명)

질문 2: 주말엔?
  → 집콕 40% (4명) vs 외출 60% (6명)
  
[모임 전용 질문 만들기 +]
```

#### 질문 등록 페이지
```
┌─ 새 밸런스 질문 만들기 ──────┐
│                              │
│ 질문 제목 (필수)              │
│ [더 맛있는 진라면은?       ] │
│                              │
│ 선택지 A (필수)               │
│ [매운맛                   ] │
│                              │
│ 선택지 B (필수)               │
│ [순한맛                   ] │
│                              │
│ 태그 (최소 1개)               │
│ [#음식 #라면          ] 🔍   │
│  추천: #음식 #간식 #야식      │
│                              │
│ 공개 설정                     │
│ ○ 전체 공개                  │
│ ● 모임 전용 [회사 동료들 ▼]  │
│ ○ 비공개                     │
│                              │
│         [등록하기]            │
└──────────────────────────────┘
```

#### 내가 만든 질문 페이지
```
┌─ 내가 만든 질문 ─────────────┐
│                              │
│ [전체 공개] 더 맛있는 진라면은?│
│  → 응답 1,234명 | 편집 | 삭제 │
│  → 매운맛 63% vs 순한맛 37%  │
│                              │
│ [회사 동료들 전용] 점심 메뉴는?│
│  → 응답 8명 | 편집 | 삭제     │
│  → 한식 50% vs 중식 50%      │
│                              │
│ [비공개] 저녁은 뭐 먹을까?     │
│  → 응답 0명 | 편집 | 삭제     │
│                              │
└──────────────────────────────┘
```

#### 사용자 설정 페이지
```
┌─ 설정 ───────────────────────┐
│                              │
│ 📧 로그인 정보               │
│  이메일: user@gmail.com      │
│                              │
│ 👤 표시 이름 설정             │
│  ○ 구글 계정명 사용           │
│     (홍길동)                 │
│  ● 익명 별명 사용             │
│     [귀여운토끼           ]   │
│                              │
│ ⚠️ 모든 모임에 일괄 적용됩니다│
│                              │
│ [저장하기]                   │
│                              │
│ ───────────────────          │
│                              │
│ 🚪 회원 탈퇴                 │
│  [탈퇴하기]                  │
│                              │
└──────────────────────────────┘
```

### 5.2 디자인 원칙 (Apple MacBook Style)

#### 컬러 시스템
- **라이트 모드**: 
  - 배경: `#f5f5f7` (Apple 시그니처 그레이)
  - 카드 배경: `#ffffff` (순백)
  - 텍스트: `#1d1d1f` (거의 블랙)
  - 서브텍스트: `#86868b`
  - 액센트: `#0071e3` (Apple 블루)
  - 성공: `#34c759` (Apple 그린)
  - 경고: `#ff9500` (Apple 오렌지)
  - 위험: `#ff3b30` (Apple 레드)
- **다크 모드**:
  - 배경: `#000000`
  - 카드 배경: `#1c1c1e`
  - 텍스트: `#f5f5f7`
  - 서브텍스트: `#98989d`

#### 타이포그래피
- **폰트**: SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif
- **제목**: 굵고 큰 폰트 (font-weight: 600~700)
- **본문**: 가독성 높은 크기 (16px 기본)
- **자간**: -0.02em (Apple 스타일 타이트한 자간)

#### UI 컴포넌트 스타일
- **버튼**: 
  - 둥근 모서리 (border-radius: 12px~980px)
  - 부드러운 그라데이션 또는 단색
  - 호버 시 밝기 변화 (brightness)
  - 클릭 시 scale(0.98) 효과
- **카드**: 
  - 큰 둥근 모서리 (border-radius: 18px)
  - 미묘한 그림자 (box-shadow: 0 4px 24px rgba(0,0,0,0.08))
  - Glassmorphism 효과 (backdrop-filter: blur)
- **입력 필드**:
  - 둥근 모서리 (border-radius: 10px)
  - 포커스 시 Apple 블루 아웃라인

#### 애니메이션
- **전환 속도**: 0.3s cubic-bezier(0.25, 0.1, 0.25, 1)
- **호버 효과**: 부드러운 scale, brightness 변화
- **페이지 전환**: 페이드 인/아웃
- **결과 표시**: 슬라이드 업 + 막대 그래프 애니메이션

#### 레이아웃 원칙
- **중앙 정렬**: 컨텐츠를 화면 중앙에 배치
- **충분한 여백**: 넉넉한 padding/margin (최소 20px)
- **최대 너비**: 컨텐츠 영역 max-width: 680px (모바일 친화적)
- **선택지 배치**: 큰 터치 영역, 시각적 구분 명확

### 5.3 반응형 디자인
- **모바일 (< 768px)**: 세로 레이아웃, 선택지 세로 배치, 햄버거 메뉴
- **태블릿 (768px ~ 1024px)**: 선택지 가로 배치
- **PC (≥ 1024px)**: 최대 너비 제한, 호버 효과 활성화

---

## 6. 기술 스택

### 6.1 프론트엔드
- **마크업**: HTML5 (시맨틱 태그 사용)
- **스타일링**: CSS3 (CSS Variables, Flexbox, Grid)
- **스크립트**: Vanilla JavaScript (ES6+ 모듈)
- **SPA 라우팅**: 커스텀 라우터 (History API 기반)
- **인증**: Google OAuth 2.0 (팝업 방식)
- **애니메이션**: CSS Transitions/Animations + 선택적 JS

### 6.2 백엔드
- **API**: Cloudflare Pages Functions (서버리스, TypeScript)
- **데이터베이스**: Cloudflare D1 (SQLite 기반)
- **인증 처리**: JWT 토큰 (httpOnly 쿠키)
- **타입 체크**: TypeScript (Cloudflare 자동 컴파일)

### 6.3 배포 및 인프라
- **호스팅**: Cloudflare Pages (GitHub 연동 자동 배포)
- **도메인**: Cloudflare DNS
- **CDN**: Cloudflare CDN (자동)


---

## 7. 데이터베이스 스키마 (ERD)

```sql
-- 사용자
CREATE TABLE user (
    id TEXT PRIMARY KEY,
    google_id TEXT UNIQUE NOT NULL,
    email TEXT NOT NULL,
    display_name TEXT, -- 구글 계정명
    custom_nickname TEXT, -- 익명 별명
    use_nickname INTEGER DEFAULT 0, -- 1이면 custom_nickname 사용
    status INTEGER DEFAULT 1, -- 1: 정상, -1: 탈퇴
    created_at INTEGER DEFAULT (unixepoch()),
    updated_at INTEGER DEFAULT (unixepoch())
);
CREATE INDEX idx_user_google_id ON user(google_id);
CREATE INDEX idx_user_status ON user(status);

-- 밸런스 질문
CREATE TABLE question (
    id TEXT PRIMARY KEY,
    creator_id TEXT REFERENCES user(id),
    title TEXT NOT NULL, -- 질문 제목 (필수)
    option_a TEXT NOT NULL,
    option_b TEXT NOT NULL,
    visibility TEXT DEFAULT 'public', -- 'public', 'group', 'private'
    group_id TEXT REFERENCES user_group(id), -- visibility='group'일 때만 사용
    deleted_at INTEGER, -- Soft Delete: NULL이면 활성, 값이 있으면 삭제됨
    created_at INTEGER DEFAULT (unixepoch()),
    updated_at INTEGER DEFAULT (unixepoch())
);
CREATE INDEX idx_question_creator_id ON question(creator_id);
CREATE INDEX idx_question_visibility ON question(visibility);
CREATE INDEX idx_question_deleted_at ON question(deleted_at);

-- 태그
CREATE TABLE tag (
    id TEXT PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    created_at INTEGER DEFAULT (unixepoch())
);
CREATE INDEX idx_tag_name ON tag(name);

-- 질문-태그 (다대다)
CREATE TABLE question_tag (
    question_id TEXT REFERENCES question(id) ON DELETE CASCADE,
    tag_id TEXT REFERENCES tag(id) ON DELETE CASCADE,
    PRIMARY KEY (question_id, tag_id)
);

-- 응답
CREATE TABLE response (
    id TEXT PRIMARY KEY,
    question_id TEXT REFERENCES question(id) ON DELETE CASCADE,
    user_id TEXT REFERENCES user(id), -- NULL이면 비로그인
    selected_option TEXT NOT NULL, -- 'A' or 'B'
    created_at INTEGER DEFAULT (unixepoch()),
    UNIQUE(question_id, user_id) -- 한 사용자는 한 질문에 1번만 응답
);
CREATE INDEX idx_response_question_id ON response(question_id);
CREATE INDEX idx_response_user_id ON response(user_id);

-- 모임
CREATE TABLE user_group (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    creator_id TEXT REFERENCES user(id),
    created_at INTEGER DEFAULT (unixepoch()),
    updated_at INTEGER DEFAULT (unixepoch())
);
CREATE INDEX idx_user_group_creator_id ON user_group(creator_id);

-- 모임 멤버
CREATE TABLE group_member (
    group_id TEXT REFERENCES user_group(id) ON DELETE CASCADE,
    user_id TEXT REFERENCES user(id) ON DELETE CASCADE,
    joined_at INTEGER DEFAULT (unixepoch()),
    PRIMARY KEY (group_id, user_id)
);
CREATE INDEX idx_group_member_user_id ON group_member(user_id);

-- 초대 링크
CREATE TABLE invite_link (
    id TEXT PRIMARY KEY,
    group_id TEXT REFERENCES user_group(id) ON DELETE CASCADE,
    created_by TEXT REFERENCES user(id),
    created_at INTEGER DEFAULT (unixepoch()),
    expires_at INTEGER -- 30일 후
);
CREATE INDEX idx_invite_link_group_id ON invite_link(group_id);
```

---

## 8. 주요 API 엔드포인트

> **참고**: 동적 경로(`:id`) 대신 쿼리 파라미터(`?id=xxx`)를 사용하여 Cloudflare Pages Functions 라우팅 안정성 확보

### 인증
- `GET /api/auth/callback` - Google OAuth 콜백 (code → JWT 발급)
- `GET /api/auth/session` - 현재 사용자 정보 (세션 확인)
- `POST /api/auth/signout` - 로그아웃 (쿠키 삭제)

### 사용자
- `GET /api/users/me` - 내 정보 조회
- `PATCH /api/users/me` - 내 정보 수정 (표시 이름)
- `DELETE /api/users/me` - 회원 탈퇴 (status = -1로 변경)

### 질문
- `GET /api/questions/random` - 랜덤 질문 1개 (`?tags=음식,라면`)
- `GET /api/questions/my` - 내가 만든 질문
- `GET /api/questions/detail?id=xxx` - 질문 상세
- `POST /api/questions` - 질문 등록
- `PATCH /api/questions/detail?id=xxx` - 질문 수정
- `DELETE /api/questions/detail?id=xxx` - 질문 삭제 (Soft Delete)
- `GET /api/questions/stats?id=xxx` - 통계 (전체 + 모임별)

### 응답
- `POST /api/responses` - 응답 제출

### 모임
- `GET /api/groups/my` - 내가 속한 모임
- `GET /api/groups/detail?id=xxx` - 모임 상세
- `POST /api/groups` - 모임 생성
- `PATCH /api/groups/detail?id=xxx` - 모임 수정 (생성자만)
- `DELETE /api/groups/detail?id=xxx` - 모임 삭제 (생성자만)
- `POST /api/groups/invite?id=xxx` - 초대 링크 생성
- `POST /api/groups/join?code=xxx` - 모임 참여
- `DELETE /api/groups/members?groupId=xxx&userId=xxx` - 멤버 퇴출 (생성자만)
- `POST /api/groups/leave?id=xxx` - 모임 나가기
- `GET /api/groups/similarity?id=xxx` - 취향 유사도 랭킹
- `GET /api/groups/responses?id=xxx&tag=음식` - 모임 응답
- `GET /api/groups/compare?groupId=xxx&userId=xxx` - 사용자 비교

### 태그
- `GET /api/tags` - 전체 태그 목록
- `GET /api/tags/search?q=음식` - 태그 검색
- `POST /api/tags` - 태그 생성

---

## 9. 주요 사용자 플로우

### 9.1 첫 방문자 (비로그인)
1. 메인 페이지 접속 → "밸런스 모임?" 소개 문구
2. [시작하기] → 주의사항 모달 ("한 번 선택한 답변은 수정 불가")
3. 질문 표시 → 선택지 클릭 → 전체 통계 확인
4. "다음 질문" → 계속 플레이
5. (선택) 로그인 → Google 로그인 → 이제부터 기록 저장

### 9.2 모임 참여
1. 초대 링크 클릭 (`/invite/abc123`)
2. 로그인 안 되어 있으면 로그인 유도
3. 로그인 후 자동 참여 → 모임 상세 페이지로 이동

### 9.3 질문 등록
1. "질문 만들기" 버튼
2. 폼 작성: 제목 (필수), 선택지 A/B, 태그 (자동완성), 공개 설정
3. [등록하기] → 성공 메시지 → "내가 만든 질문" 페이지

### 9.4 취향 유사도 확인
1. 모임 클릭 → 모임 상세
2. "나와 가장 비슷한 사람" 섹션 확인
3. 1위 사용자 클릭 → 상세 비교 (질문별 선택 나란히 표시)

---

## 10. 성능 및 보안

### 10.1 성능 최적화
- **Cloudflare CDN**: 정적 자산 캐싱 (HTML, CSS, JS, 이미지)
- **브라우저 캐싱**: Cache-Control 헤더 설정
- **DB 인덱싱**: 자주 조회되는 컬럼에 인덱스
- **페이지네이션**: 모임 목록, 응답 기록
- **Lazy Loading**: 필요 시 JS 모듈 동적 로드
- **최소화**: CSS/JS 파일 minification (빌드 시)

### 10.2 보안
- **JWT 검증**: 모든 API 요청에서 httpOnly 쿠키 토큰 검증
- **XSS 방지**: innerHTML 대신 textContent 사용, DOMPurify, CSP 헤더
- **SQL Injection 방지**: Prepared Statements (D1 바인딩)
- **입력 검증**: 서버 측 검증 필수
- **Rate Limiting**: Cloudflare 설정 (질문 등록 분당 10회, 응답 분당 30회)
- **HTTPS 강제**: Cloudflare 자동 SSL
- **CORS 설정**: API 엔드포인트 CORS 헤더 관리

---

## 11. 개발 로드맵 (4~6주)

### Sprint 1: 기본 인프라 (1주)
- HTML + CSS + JS 프로젝트 구조 설정
- Cloudflare D1 데이터베이스 + 스키마 구축
- Cloudflare Pages Functions 설정
- Google OAuth 2.0 인증
- 기본 레이아웃 및 CSS 디자인 시스템

### Sprint 2: 질문 플레이 (1주)
- 질문 표시 및 선택 UI (JS 동적 렌더링)
- 응답 저장 API (Functions)
- 통계 표시 (전체)
- 다음 질문 랜덤 로드

### Sprint 3: 모임 기능 (1.5주)
- 모임 생성/수정/삭제
- 초대 링크 생성 및 참여
- 모임 멤버 관리
- 모임별 통계

### Sprint 4: 질문 관리 (1주)
- 질문 등록 폼 (HTML + JS 유효성 검사)
- 태그 시스템 (자동완성)
- 내가 만든 질문 페이지
- 질문 수정/삭제 (Soft Delete)

### Sprint 5: 취향 유사도 (0.5주)
- 유사도 계산 알고리즘
- 모임 내 랭킹
- 상세 비교 페이지

### Sprint 6: 배포 (1주)
- 버그 수정 및 테스트
- GitHub 연동 자동 배포 설정
- Cloudflare Pages 배포
- 초기 데이터 시딩 (100개 질문)

---

## 12. 용어 정의

- **밸런스 게임**: 두 선택지 중 하나를 반드시 고르는 게임
- **모임**: 사용자들이 함께 응답을 비교하는 커뮤니티 단위
- **취향 유사도**: 같은 질문에 동일한 선택을 한 비율
- **전체 공개 질문**: 모든 사용자가 플레이 가능
- **모임 전용 질문**: 특정 모임 멤버만 볼 수 있음 (모든 멤버가 생성 가능)
- **비공개 질문**: 작성자만 볼 수 있음 (임시 저장)
- **Soft Delete**: 실제 삭제하지 않고 `deleted_at` 컬럼으로 표시
- **탈퇴한 사용자**: 회원 탈퇴 후 응답에 표시되는 익명 이름 (status = -1)
- **재응답 불가**: 한번 선택한 질문은 수정 불가 정책
- **사용자 상태(status)**: 1(정상), -1(탈퇴)