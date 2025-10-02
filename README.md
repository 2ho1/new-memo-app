# MEMO-LOG

Neo-brutalism 디자인 시스템을 사용한 간편한 메모 관리 애플리케이션입니다.

## 주요 기능

- 🔐 **사용자 인증**: 회원가입, 로그인, 로그아웃
- 📝 **메모 관리**: 메모 생성, 읽기, 수정, 삭제 (CRUD)
- 🎨 **Neo-brutalism 디자인**: 현대적이고 독특한 UI/UX
- 📱 **반응형 디자인**: 모바일과 데스크톱 모두 지원

## 기술 스택

- **Frontend**: Next.js 15, React, TypeScript
- **UI Components**: shadcn/ui (Neo-brutalism 테마)
- **Styling**: Tailwind CSS
- **Database**: SQLite
- **ORM**: Prisma
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs

## 설치 및 실행

1. 의존성 설치:
```bash
npm install
```

2. 환경 변수 설정:
`.env` 파일이 이미 설정되어 있습니다. 필요시 `NEXTAUTH_SECRET`을 변경하세요.

3. 데이터베이스 설정:
```bash
npx prisma db push
```

4. 개발 서버 실행:
```bash
npm run dev
```

5. 브라우저에서 `http://localhost:3000` 접속

## 프로젝트 구조

```
src/
├── app/
│   ├── api/          # API 라우트
│   │   ├── auth/     # 인증 관련 API
│   │   └── memos/    # 메모 관련 API
│   ├── globals.css   # 전역 스타일
│   ├── layout.tsx    # 루트 레이아웃
│   └── page.tsx      # 메인 페이지
├── components/       # UI 컴포넌트
│   ├── ui/          # shadcn/ui 컴포넌트
│   ├── Header.tsx   # 헤더 컴포넌트
│   ├── LoginForm.tsx
│   ├── RegisterForm.tsx
│   ├── MemoList.tsx
│   └── MemoForm.tsx
├── contexts/        # React 컨텍스트
│   └── AuthContext.tsx
└── lib/            # 유틸리티 함수
    ├── auth.ts     # 인증 관련 함수
    ├── prisma.ts   # Prisma 클라이언트
    └── utils.ts    # 기타 유틸리티
```

## API 엔드포인트

### 인증
- `POST /api/auth/register` - 회원가입
- `POST /api/auth/login` - 로그인
- `POST /api/auth/logout` - 로그아웃
- `GET /api/auth/me` - 현재 사용자 정보

### 메모
- `GET /api/memos` - 메모 목록 조회
- `POST /api/memos` - 메모 생성
- `GET /api/memos/[id]` - 개별 메모 조회
- `PUT /api/memos/[id]` - 메모 수정
- `DELETE /api/memos/[id]` - 메모 삭제

## 사용 방법

1. **회원가입**: 이메일과 비밀번호로 새 계정을 생성합니다.
2. **로그인**: 등록한 계정으로 로그인합니다.
3. **메모 작성**: "새 메모" 버튼을 클릭하여 메모를 작성합니다.
4. **메모 관리**: 메모 카드에서 수정/삭제 버튼을 사용하여 메모를 관리합니다.

## 보안 기능

- 비밀번호 해시화 (bcryptjs)
- JWT 토큰 기반 인증
- HTTP-only 쿠키를 통한 토큰 저장
- 사용자별 메모 접근 권한 제어

## 라이선스

MIT License