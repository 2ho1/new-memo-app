-- 개발 환경용 간단한 RLS 정책
-- 현재 애플리케이션이 자체 JWT 인증을 사용하므로 모든 작업을 허용

-- User 테이블에 RLS 활성화
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;

-- Memo 테이블에 RLS 활성화  
ALTER TABLE "Memo" ENABLE ROW LEVEL SECURITY;

-- 개발 환경용: 모든 작업 허용
-- User 테이블 정책
CREATE POLICY "Allow all operations on User" ON "User"
    FOR ALL USING (true) WITH CHECK (true);

-- Memo 테이블 정책
CREATE POLICY "Allow all operations on Memo" ON "Memo"
    FOR ALL USING (true) WITH CHECK (true);

-- 참고: 프로덕션 환경에서는 더 엄격한 정책을 사용해야 합니다.
-- 예시:
-- CREATE POLICY "Users can view own memos" ON "Memo"
--     FOR SELECT USING (auth.uid()::text = "userId");
-- 
-- CREATE POLICY "Users can insert own memos" ON "Memo"
--     FOR INSERT WITH CHECK (auth.uid()::text = "userId");
