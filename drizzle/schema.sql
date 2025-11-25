-- 밸런스 모임 (Balance Moim) 데이터베이스 스키마
-- Cloudflare D1 (SQLite) 용
-- 생성일: 2024-11-25

-- =====================================================
-- 1. 사용자 테이블
-- =====================================================
CREATE TABLE IF NOT EXISTS user (
    id TEXT PRIMARY KEY,
    google_id TEXT UNIQUE NOT NULL,
    email TEXT NOT NULL,
    display_name TEXT,
    custom_nickname TEXT,
    use_nickname INTEGER DEFAULT 0,
    status INTEGER DEFAULT 1,
    created_at INTEGER DEFAULT (unixepoch()),
    updated_at INTEGER DEFAULT (unixepoch())
);

CREATE INDEX IF NOT EXISTS idx_user_google_id ON user(google_id);
CREATE INDEX IF NOT EXISTS idx_user_status ON user(status);

-- =====================================================
-- 2. 모임 테이블
-- =====================================================
CREATE TABLE IF NOT EXISTS user_group (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    creator_id TEXT NOT NULL,
    created_at INTEGER DEFAULT (unixepoch()),
    updated_at INTEGER DEFAULT (unixepoch()),
    FOREIGN KEY (creator_id) REFERENCES user(id)
);

CREATE INDEX IF NOT EXISTS idx_user_group_creator_id ON user_group(creator_id);

-- =====================================================
-- 3. 밸런스 질문 테이블
-- =====================================================
CREATE TABLE IF NOT EXISTS question (
    id TEXT PRIMARY KEY,
    creator_id TEXT,
    title TEXT NOT NULL,
    option_a TEXT NOT NULL,
    option_b TEXT NOT NULL,
    visibility TEXT DEFAULT 'public',
    group_id TEXT,
    deleted_at INTEGER,
    created_at INTEGER DEFAULT (unixepoch()),
    updated_at INTEGER DEFAULT (unixepoch()),
    FOREIGN KEY (creator_id) REFERENCES user(id),
    FOREIGN KEY (group_id) REFERENCES user_group(id)
);

CREATE INDEX IF NOT EXISTS idx_question_creator_id ON question(creator_id);
CREATE INDEX IF NOT EXISTS idx_question_visibility ON question(visibility);
CREATE INDEX IF NOT EXISTS idx_question_group_id ON question(group_id);
CREATE INDEX IF NOT EXISTS idx_question_deleted_at ON question(deleted_at);

-- =====================================================
-- 4. 태그 테이블
-- =====================================================
CREATE TABLE IF NOT EXISTS tag (
    id TEXT PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    created_at INTEGER DEFAULT (unixepoch())
);

CREATE INDEX IF NOT EXISTS idx_tag_name ON tag(name);

-- =====================================================
-- 5. 질문-태그 연결 테이블 (다대다)
-- =====================================================
CREATE TABLE IF NOT EXISTS question_tag (
    question_id TEXT NOT NULL,
    tag_id TEXT NOT NULL,
    PRIMARY KEY (question_id, tag_id),
    FOREIGN KEY (question_id) REFERENCES question(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tag(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_question_tag_question_id ON question_tag(question_id);
CREATE INDEX IF NOT EXISTS idx_question_tag_tag_id ON question_tag(tag_id);

-- =====================================================
-- 6. 응답 테이블
-- =====================================================
CREATE TABLE IF NOT EXISTS response (
    id TEXT PRIMARY KEY,
    question_id TEXT NOT NULL,
    user_id TEXT,
    selected_option TEXT NOT NULL,
    created_at INTEGER DEFAULT (unixepoch()),
    FOREIGN KEY (question_id) REFERENCES question(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES user(id)
);

CREATE INDEX IF NOT EXISTS idx_response_question_id ON response(question_id);
CREATE INDEX IF NOT EXISTS idx_response_user_id ON response(user_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_response_unique ON response(question_id, user_id) WHERE user_id IS NOT NULL;

-- =====================================================
-- 7. 모임 멤버 테이블
-- =====================================================
CREATE TABLE IF NOT EXISTS group_member (
    group_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    joined_at INTEGER DEFAULT (unixepoch()),
    left_at INTEGER,
    PRIMARY KEY (group_id, user_id),
    FOREIGN KEY (group_id) REFERENCES user_group(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_group_member_user_id ON group_member(user_id);
CREATE INDEX IF NOT EXISTS idx_group_member_group_id ON group_member(group_id);

-- =====================================================
-- 8. 초대 링크 테이블
-- =====================================================
CREATE TABLE IF NOT EXISTS invite_link (
    id TEXT PRIMARY KEY,
    group_id TEXT NOT NULL,
    created_by TEXT NOT NULL,
    created_at INTEGER DEFAULT (unixepoch()),
    expires_at INTEGER NOT NULL,
    FOREIGN KEY (group_id) REFERENCES user_group(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES user(id)
);

CREATE INDEX IF NOT EXISTS idx_invite_link_group_id ON invite_link(group_id);
CREATE INDEX IF NOT EXISTS idx_invite_link_expires_at ON invite_link(expires_at);
