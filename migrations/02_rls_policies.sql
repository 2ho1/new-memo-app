-- Supabase RLS (Row Level Security) 정책 설정
-- MEMO-LOG 애플리케이션 보안 정책

-- User 테이블에 RLS 활성화
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;

-- Memo 테이블에 RLS 활성화
ALTER TABLE "Memo" ENABLE ROW LEVEL SECURITY;

-- User 테이블 정책들
-- 1. 사용자는 자신의 정보만 조회 가능
CREATE POLICY "Users can view own profile" ON "User"
    FOR SELECT USING (auth.uid()::text = id);

-- 2. 사용자는 자신의 정보만 업데이트 가능
CREATE POLICY "Users can update own profile" ON "User"
    FOR UPDATE USING (auth.uid()::text = id);

-- 3. 새 사용자 등록 허용 (회원가입)
CREATE POLICY "Enable insert for registration" ON "User"
    FOR INSERT WITH CHECK (true);

-- Memo 테이블 정책들
-- 1. 사용자는 자신의 메모만 조회 가능
CREATE POLICY "Users can view own memos" ON "Memo"
    FOR SELECT USING (auth.uid()::text = "userId");

-- 2. 사용자는 자신의 메모만 생성 가능
CREATE POLICY "Users can insert own memos" ON "Memo"
    FOR INSERT WITH CHECK (auth.uid()::text = "userId");

-- 3. 사용자는 자신의 메모만 업데이트 가능
CREATE POLICY "Users can update own memos" ON "Memo"
    FOR UPDATE USING (auth.uid()::text = "userId");

-- 4. 사용자는 자신의 메모만 삭제 가능
CREATE POLICY "Users can delete own memos" ON "Memo"
    FOR DELETE USING (auth.uid()::text = "userId");

-- 개발/테스트 환경을 위한 임시 정책 (필요시 사용)
-- 주의: 프로덕션에서는 사용하지 마세요!

-- 모든 사용자 데이터에 대한 전체 접근 허용 (개발용)
-- CREATE POLICY "Allow all operations for development" ON "User"
--     FOR ALL USING (true) WITH CHECK (true);

-- 모든 메모 데이터에 대한 전체 접근 허용 (개발용)
-- CREATE POLICY "Allow all operations for development" ON "Memo"
--     FOR ALL USING (true) WITH CHECK (true);
