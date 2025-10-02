-- Supabase 마이그레이션 SQL
-- MEMO-LOG 애플리케이션 초기 스키마

-- User 테이블 생성
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- Memo 테이블 생성
CREATE TABLE "Memo" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "isPinned" BOOLEAN NOT NULL DEFAULT false,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Memo_pkey" PRIMARY KEY ("id")
);

-- 인덱스 생성
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- 외래 키 제약 조건 추가
ALTER TABLE "Memo" ADD CONSTRAINT "Memo_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- 성능 최적화를 위한 추가 인덱스
CREATE INDEX "Memo_userId_idx" ON "Memo"("userId");
CREATE INDEX "Memo_isPinned_idx" ON "Memo"("isPinned");
CREATE INDEX "Memo_createdAt_idx" ON "Memo"("createdAt");
CREATE INDEX "Memo_updatedAt_idx" ON "Memo"("updatedAt");

-- updatedAt 자동 업데이트를 위한 트리거 함수 생성
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- User 테이블에 updatedAt 트리거 적용
CREATE TRIGGER update_user_updated_at 
    BEFORE UPDATE ON "User" 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Memo 테이블에 updatedAt 트리거 적용
CREATE TRIGGER update_memo_updated_at 
    BEFORE UPDATE ON "Memo" 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
