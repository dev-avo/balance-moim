-- 프로덕션 DB 시딩 SQL
-- 이 파일은 scripts/seed-data.json을 기반으로 생성되었습니다
-- 실행 방법: npx wrangler d1 execute balance-moim-db-prod --remote --file=scripts/seed-prod.sql

-- 태그 20개 생성
INSERT OR IGNORE INTO tag (id, name) VALUES
('73196f0a-9b0d-4eb7-ad28-e83ee94f8fd3', '음식'),
('8603341e-d113-40c2-ae9b-680e2586abe0', '연애'),
('3d1caaf9-e6e2-4f8e-b3ce-e58dc11f56b9', '취미'),
('31e24967-9459-45a6-9507-b1d63f6e3d00', '직장생활'),
('735caa7c-ec0c-4cab-aa24-408b4342e233', '여행'),
('2c333321-b5fc-40d8-899f-1a9a9fe7ef1c', '패션'),
('b9418b14-bd4c-47e0-9ec1-d3ce67df38a7', '운동'),
('fe7a462d-a26e-4c65-84ee-136d92be3af2', '영화'),
('2c73c012-c2d5-43ec-b811-e14a7ea5843d', '음악'),
('fe2074d0-7b4d-4685-a38f-7f9c71545835', '게임'),
('a639b829-8714-43da-b190-d9f97ad51a70', 'MBTI'),
('4e7ad6e1-a6d2-444a-953f-767e07a8d2af', '일상'),
('c36c625f-fdde-4e5c-b2c3-730380e2ac7c', '관계'),
('d266c7f2-65ff-403e-96a6-8488aab4d4cc', '가치관'),
('21d00a52-424e-4171-ba38-15c4a3ff2129', '습관'),
('f2c1a766-d63b-4de0-9bec-e71954047509', '건강'),
('538c7d46-5a29-4bba-a3d8-a8bdeb10b6b1', '돈'),
('3701f5f7-fda3-4fa9-b566-17f43c951cc4', '라이프스타일'),
('4c1f3f47-7e9b-4dc0-8c32-9456a82113fc', '자기계발'),
('181cbdf8-54f5-4bf7-96f8-8e32a819431e', 'sns');

-- 질문 100개 생성
-- 질문: 더 맛있는 진라면은?
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, deleted_at, created_at, updated_at) VALUES ('32d12017-65e5-46ba-8ea4-a96f288358e4', '더 맛있는 진라면은?', '매운맛', '순한맛', 'public', NULL, NULL, NULL, 1763818595, 1763818595);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '32d12017-65e5-46ba-8ea4-a96f288358e4', id FROM tag WHERE name = '음식' LIMIT 1;

-- 질문: 치킨은 어떻게 먹을래?
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, deleted_at, created_at, updated_at) VALUES ('924ff819-8096-436b-bee4-01803f2825ee', '치킨은 어떻게 먹을래?', '양념치킨', '후라이드치킨', 'public', NULL, NULL, NULL, 1763818595, 1763818595);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '924ff819-8096-436b-bee4-01803f2825ee', id FROM tag WHERE name = '음식' LIMIT 1;

-- 질문: 피자 선택의 기로
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, deleted_at, created_at, updated_at) VALUES ('c3d90da8-774a-428c-84f7-c9df3baa107a', '피자 선택의 기로', '페퍼로니 피자', '하와이안 피자', 'public', NULL, NULL, NULL, 1763818595, 1763818595);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT 'c3d90da8-774a-428c-84f7-c9df3baa107a', id FROM tag WHERE name = '음식' LIMIT 1;

-- 질문: 커피 vs 녹차
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, deleted_at, created_at, updated_at) VALUES ('af11c188-e84f-4fc9-a6ea-e3cc49e02f18', '커피 vs 녹차', '커피', '녹차', 'public', NULL, NULL, NULL, 1763818595, 1763818595);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT 'af11c188-e84f-4fc9-a6ea-e3cc49e02f18', id FROM tag WHERE name = '음식' LIMIT 1;
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT 'af11c188-e84f-4fc9-a6ea-e3cc49e02f18', id FROM tag WHERE name = '일상' LIMIT 1;

-- 질문: 아침 식사로 뭐가 나아?
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, deleted_at, created_at, updated_at) VALUES ('64a48aa1-5c61-4a9e-8259-fb6a9ae31aa5', '아침 식사로 뭐가 나아?', '밥', '빵', 'public', NULL, NULL, NULL, 1763818595, 1763818595);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '64a48aa1-5c61-4a9e-8259-fb6a9ae31aa5', id FROM tag WHERE name = '음식' LIMIT 1;
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '64a48aa1-5c61-4a9e-8259-fb6a9ae31aa5', id FROM tag WHERE name = '일상' LIMIT 1;

-- 질문: 라면 끓일 때
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, deleted_at, created_at, updated_at) VALUES ('2f46b081-9fcc-411f-acd8-9cae762070b4', '라면 끓일 때', '계란 넣기', '치즈 넣기', 'public', NULL, NULL, NULL, 1763818595, 1763818595);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '2f46b081-9fcc-411f-acd8-9cae762070b4', id FROM tag WHERE name = '음식' LIMIT 1;

-- 질문: 여름 디저트
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, deleted_at, created_at, updated_at) VALUES ('abf689a4-7349-461a-b107-38ccfc3e83dd', '여름 디저트', '팥빙수', '아이스크림', 'public', NULL, NULL, NULL, 1763818595, 1763818595);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT 'abf689a4-7349-461a-b107-38ccfc3e83dd', id FROM tag WHERE name = '음식' LIMIT 1;

-- 질문: 술자리에서
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, deleted_at, created_at, updated_at) VALUES ('ecba49a3-e616-420c-8037-ab30c7ada4af', '술자리에서', '소주', '맥주', 'public', NULL, NULL, NULL, 1763818595, 1763818595);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT 'ecba49a3-e616-420c-8037-ab30c7ada4af', id FROM tag WHERE name = '음식' LIMIT 1;
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT 'ecba49a3-e616-420c-8037-ab30c7ada4af', id FROM tag WHERE name = '일상' LIMIT 1;

-- 질문: 더 먹고 싶은 한식
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, deleted_at, created_at, updated_at) VALUES ('f3f4fab4-b404-4e46-8aa4-1471a65e6200', '더 먹고 싶은 한식', '김치찌개', '된장찌개', 'public', NULL, NULL, NULL, 1763818595, 1763818595);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT 'f3f4fab4-b404-4e46-8aa4-1471a65e6200', id FROM tag WHERE name = '음식' LIMIT 1;

-- 질문: 분식 메뉴 선택
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, deleted_at, created_at, updated_at) VALUES ('8fa7cd21-3592-4517-a2cd-49a2c524a96f', '분식 메뉴 선택', '떡볶이', '튀김', 'public', NULL, NULL, NULL, 1763818595, 1763818595);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '8fa7cd21-3592-4517-a2cd-49a2c524a96f', id FROM tag WHERE name = '음식' LIMIT 1;

-- 질문: 첫 데이트 장소는?
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, deleted_at, created_at, updated_at) VALUES ('aebfed57-2fe4-40ab-b9ee-89883545f7f8', '첫 데이트 장소는?', '영화관', '카페', 'public', NULL, NULL, NULL, 1763818595, 1763818595);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT 'aebfed57-2fe4-40ab-b9ee-89883545f7f8', id FROM tag WHERE name = '연애' LIMIT 1;

-- 질문: 연애 스타일
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, deleted_at, created_at, updated_at) VALUES ('9d581303-1742-4bcd-9f76-83100300cf0f', '연애 스타일', '연락 자주하기', '적당한 거리두기', 'public', NULL, NULL, NULL, 1763818595, 1763818595);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '9d581303-1742-4bcd-9f76-83100300cf0f', id FROM tag WHERE name = '연애' LIMIT 1;
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '9d581303-1742-4bcd-9f76-83100300cf0f', id FROM tag WHERE name = '관계' LIMIT 1;

-- 질문: 선물로 받고 싶은 건?
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, deleted_at, created_at, updated_at) VALUES ('9e17d8c1-6278-4f0f-8e38-205f00b66d2a', '선물로 받고 싶은 건?', '손편지', '비싼 선물', 'public', NULL, NULL, NULL, 1763818595, 1763818595);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '9e17d8c1-6278-4f0f-8e38-205f00b66d2a', id FROM tag WHERE name = '연애' LIMIT 1;
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '9e17d8c1-6278-4f0f-8e38-205f00b66d2a', id FROM tag WHERE name = '관계' LIMIT 1;

-- 질문: 썸 단계에서
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, deleted_at, created_at, updated_at) VALUES ('4a26fcf8-bb57-4127-8bfa-f23b54f2e70b', '썸 단계에서', '직접 고백하기', '상대방 고백 기다리기', 'public', NULL, NULL, NULL, 1763818595, 1763818595);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '4a26fcf8-bb57-4127-8bfa-f23b54f2e70b', id FROM tag WHERE name = '연애' LIMIT 1;

-- 질문: 이상형
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, deleted_at, created_at, updated_at) VALUES ('eed92998-c59a-48b4-aad6-801e89603973', '이상형', '귀여운 타입', '섹시한 타입', 'public', NULL, NULL, NULL, 1763818595, 1763818595);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT 'eed92998-c59a-48b4-aad6-801e89603973', id FROM tag WHERE name = '연애' LIMIT 1;

-- 질문: 여행 스타일
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, deleted_at, created_at, updated_at) VALUES ('ab79d838-3677-475c-a921-03ec1ba68222', '여행 스타일', '계획적인 여행', '즉흥적인 여행', 'public', NULL, NULL, NULL, 1763818595, 1763818595);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT 'ab79d838-3677-475c-a921-03ec1ba68222', id FROM tag WHERE name = '여행' LIMIT 1;
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT 'ab79d838-3677-475c-a921-03ec1ba68222', id FROM tag WHERE name = '라이프스타일' LIMIT 1;

-- 질문: 해외여행 vs 국내여행
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, deleted_at, created_at, updated_at) VALUES ('2a508b42-f5ab-43e8-a304-9d1a53d4f577', '해외여행 vs 국내여행', '해외여행', '국내여행', 'public', NULL, NULL, NULL, 1763818595, 1763818595);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '2a508b42-f5ab-43e8-a304-9d1a53d4f577', id FROM tag WHERE name = '여행' LIMIT 1;

-- 질문: 여행지 숙소
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, deleted_at, created_at, updated_at) VALUES ('a7b43d93-d7bd-44e6-b8e7-4cb43cce9b1b', '여행지 숙소', '호텔', '게스트하우스', 'public', NULL, NULL, NULL, 1763818595, 1763818595);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT 'a7b43d93-d7bd-44e6-b8e7-4cb43cce9b1b', id FROM tag WHERE name = '여행' LIMIT 1;

-- 질문: 여행 중 식사
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, deleted_at, created_at, updated_at) VALUES ('67480520-7879-4664-b88a-25f7f8565397', '여행 중 식사', '현지 맛집 탐방', '편의점 간편식', 'public', NULL, NULL, NULL, 1763818595, 1763818595);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '67480520-7879-4664-b88a-25f7f8565397', id FROM tag WHERE name = '여행' LIMIT 1;
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '67480520-7879-4664-b88a-25f7f8565397', id FROM tag WHERE name = '음식' LIMIT 1;

-- 질문: 휴가 때 하고 싶은 일
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, deleted_at, created_at, updated_at) VALUES ('2ff2f69d-c2e8-4857-a3d2-7b7d882d2c86', '휴가 때 하고 싶은 일', '여행 가기', '집에서 쉬기', 'public', NULL, NULL, NULL, 1763818595, 1763818595);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '2ff2f69d-c2e8-4857-a3d2-7b7d882d2c86', id FROM tag WHERE name = '여행' LIMIT 1;
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '2ff2f69d-c2e8-4857-a3d2-7b7d882d2c86', id FROM tag WHERE name = '일상' LIMIT 1;

-- 질문: 출근 시간
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, deleted_at, created_at, updated_at) VALUES ('190104f9-ec61-48e9-a814-6aaff6f0dd7c', '출근 시간', '일찍 출근, 일찍 퇴근', '늦게 출근, 늦게 퇴근', 'public', NULL, NULL, NULL, 1763818595, 1763818595);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '190104f9-ec61-48e9-a814-6aaff6f0dd7c', id FROM tag WHERE name = '직장생활' LIMIT 1;

-- 질문: 점심시간
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, deleted_at, created_at, updated_at) VALUES ('11440cf3-5fd1-4ef0-8800-3f197032ff49', '점심시간', '동료들과 함께', '혼자 먹기', 'public', NULL, NULL, NULL, 1763818595, 1763818595);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '11440cf3-5fd1-4ef0-8800-3f197032ff49', id FROM tag WHERE name = '직장생활' LIMIT 1;
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '11440cf3-5fd1-4ef0-8800-3f197032ff49', id FROM tag WHERE name = '일상' LIMIT 1;

-- 질문: 회식 vs 회식비 n빵
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, deleted_at, created_at, updated_at) VALUES ('79aaa371-a03a-4542-bbf7-b4e50e7c84f1', '회식 vs 회식비 n빵', '회식 참여', '회식비 받고 집에 가기', 'public', NULL, NULL, NULL, 1763818595, 1763818595);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '79aaa371-a03a-4542-bbf7-b4e50e7c84f1', id FROM tag WHERE name = '직장생활' LIMIT 1;

-- 질문: 업무 스타일
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, deleted_at, created_at, updated_at) VALUES ('8eb9a41e-7579-4766-b84d-74569f051ef7', '업무 스타일', '미리미리 끝내기', '데드라인에 맞춰서', 'public', NULL, NULL, NULL, 1763818595, 1763818595);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '8eb9a41e-7579-4766-b84d-74569f051ef7', id FROM tag WHERE name = '직장생활' LIMIT 1;
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '8eb9a41e-7579-4766-b84d-74569f051ef7', id FROM tag WHERE name = '습관' LIMIT 1;

-- 질문: 이직 vs 현직 유지
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, deleted_at, created_at, updated_at) VALUES ('c1db1309-1e9c-4447-8391-4e8824966a6e', '이직 vs 현직 유지', '좋은 기회면 이직', '현직에서 성장', 'public', NULL, NULL, NULL, 1763818595, 1763818595);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT 'c1db1309-1e9c-4447-8391-4e8824966a6e', id FROM tag WHERE name = '직장생활' LIMIT 1;

-- 질문: 주말 취미
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, deleted_at, created_at, updated_at) VALUES ('13e00738-d6e9-4af7-a02f-aca233825758', '주말 취미', '실내 활동', '야외 활동', 'public', NULL, NULL, NULL, 1763818595, 1763818595);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '13e00738-d6e9-4af7-a02f-aca233825758', id FROM tag WHERE name = '취미' LIMIT 1;
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '13e00738-d6e9-4af7-a02f-aca233825758', id FROM tag WHERE name = '일상' LIMIT 1;

-- 질문: 독서 vs 영화 감상
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, deleted_at, created_at, updated_at) VALUES ('d6437093-5688-4e31-9709-24235ea55fe3', '독서 vs 영화 감상', '책 읽기', '영화 보기', 'public', NULL, NULL, NULL, 1763818595, 1763818595);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT 'd6437093-5688-4e31-9709-24235ea55fe3', id FROM tag WHERE name = '취미' LIMIT 1;

-- 질문: 운동은
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, deleted_at, created_at, updated_at) VALUES ('2397331a-46ae-48a7-b676-fedcf24e52a7', '운동은', '헬스장', '홈트레이닝', 'public', NULL, NULL, NULL, 1763818595, 1763818595);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '2397331a-46ae-48a7-b676-fedcf24e52a7', id FROM tag WHERE name = '운동' LIMIT 1;
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '2397331a-46ae-48a7-b676-fedcf24e52a7', id FROM tag WHERE name = '건강' LIMIT 1;

-- 질문: 음악 듣는 방법
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, deleted_at, created_at, updated_at) VALUES ('16537bd2-27cd-4098-974f-142a663f4729', '음악 듣는 방법', '멜론, 지니 등 스트리밍', '유튜브', 'public', NULL, NULL, NULL, 1763818595, 1763818595);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '16537bd2-27cd-4098-974f-142a663f4729', id FROM tag WHERE name = '음악' LIMIT 1;
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '16537bd2-27cd-4098-974f-142a663f4729', id FROM tag WHERE name = '취미' LIMIT 1;

-- 질문: 게임 장르
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, deleted_at, created_at, updated_at) VALUES ('ef89ea6d-26c1-4355-a6bb-8ae1fe48a098', '게임 장르', 'RPG, 어드벤처', 'FPS, AOS', 'public', NULL, NULL, NULL, 1763818595, 1763818595);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT 'ef89ea6d-26c1-4355-a6bb-8ae1fe48a098', id FROM tag WHERE name = '게임' LIMIT 1;
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT 'ef89ea6d-26c1-4355-a6bb-8ae1fe48a098', id FROM tag WHERE name = '취미' LIMIT 1;

-- 질문: MBTI 믿는 편?
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, deleted_at, created_at, updated_at) VALUES ('5856c73c-1fb2-410f-81ce-fafa679c1651', 'MBTI 믿는 편?', '믿는다', '안 믿는다', 'public', NULL, NULL, NULL, 1763818595, 1763818595);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '5856c73c-1fb2-410f-81ce-fafa679c1651', id FROM tag WHERE name = 'MBTI' LIMIT 1;
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '5856c73c-1fb2-410f-81ce-fafa679c1651', id FROM tag WHERE name = '가치관' LIMIT 1;

-- 질문: 외향적 vs 내향적
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, deleted_at, created_at, updated_at) VALUES ('01719606-6585-4fc8-b96b-55e644e997e7', '외향적 vs 내향적', 'E (외향형)', 'I (내향형)', 'public', NULL, NULL, NULL, 1763818595, 1763818595);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '01719606-6585-4fc8-b96b-55e644e997e7', id FROM tag WHERE name = 'MBTI' LIMIT 1;
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '01719606-6585-4fc8-b96b-55e644e997e7', id FROM tag WHERE name = '일상' LIMIT 1;

-- 질문: 계획형 vs 즉흥형
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, deleted_at, created_at, updated_at) VALUES ('bba403b4-ec7f-482e-a0be-52301bd2b72d', '계획형 vs 즉흥형', 'J (계획형)', 'P (즉흥형)', 'public', NULL, NULL, NULL, 1763818595, 1763818595);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT 'bba403b4-ec7f-482e-a0be-52301bd2b72d', id FROM tag WHERE name = 'MBTI' LIMIT 1;
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT 'bba403b4-ec7f-482e-a0be-52301bd2b72d', id FROM tag WHERE name = '습관' LIMIT 1;

-- 질문: 감정형 vs 사고형
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, deleted_at, created_at, updated_at) VALUES ('2893c371-b95a-4348-91f8-44fa09a79567', '감정형 vs 사고형', 'F (감정형)', 'T (사고형)', 'public', NULL, NULL, NULL, 1763818595, 1763818595);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '2893c371-b95a-4348-91f8-44fa09a79567', id FROM tag WHERE name = 'MBTI' LIMIT 1;

-- 질문: 패션 스타일
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, deleted_at, created_at, updated_at) VALUES ('f93a8657-3eb8-412d-8f6b-d1d3b0ded599', '패션 스타일', '편한 옷', '멋진 옷', 'public', NULL, NULL, NULL, 1763818595, 1763818595);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT 'f93a8657-3eb8-412d-8f6b-d1d3b0ded599', id FROM tag WHERE name = '패션' LIMIT 1;
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT 'f93a8657-3eb8-412d-8f6b-d1d3b0ded599', id FROM tag WHERE name = '라이프스타일' LIMIT 1;

-- 질문: 신발 선택
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, deleted_at, created_at, updated_at) VALUES ('9e626094-9c49-4975-a7a8-d02412e789d0', '신발 선택', '운동화', '구두/힐', 'public', NULL, NULL, NULL, 1763818595, 1763818595);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '9e626094-9c49-4975-a7a8-d02412e789d0', id FROM tag WHERE name = '패션' LIMIT 1;

-- 질문: 옷 쇼핑
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, deleted_at, created_at, updated_at) VALUES ('232bfc1a-0994-4fbf-b45f-55d34bf2da1e', '옷 쇼핑', '온라인', '오프라인', 'public', NULL, NULL, NULL, 1763818595, 1763818595);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '232bfc1a-0994-4fbf-b45f-55d34bf2da1e', id FROM tag WHERE name = '패션' LIMIT 1;
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '232bfc1a-0994-4fbf-b45f-55d34bf2da1e', id FROM tag WHERE name = '일상' LIMIT 1;

-- 질문: 악세서리
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, deleted_at, created_at, updated_at) VALUES ('c538f072-5990-4b5d-aebd-a11394233e46', '악세서리', '착용', '미착용', 'public', NULL, NULL, NULL, 1763818595, 1763818595);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT 'c538f072-5990-4b5d-aebd-a11394233e46', id FROM tag WHERE name = '패션' LIMIT 1;

-- 질문: 아침형 vs 저녁형 인간
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, deleted_at, created_at, updated_at) VALUES ('a880e6fc-472f-4daa-8555-740f1cfe3380', '아침형 vs 저녁형 인간', '아침형', '저녁형', 'public', NULL, NULL, NULL, 1763818595, 1763818595);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT 'a880e6fc-472f-4daa-8555-740f1cfe3380', id FROM tag WHERE name = '일상' LIMIT 1;
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT 'a880e6fc-472f-4daa-8555-740f1cfe3380', id FROM tag WHERE name = '습관' LIMIT 1;

-- 질문: 샤워 시간
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, deleted_at, created_at, updated_at) VALUES ('bbd944a4-f607-42dd-99a6-17a8181c0af3', '샤워 시간', '아침 샤워', '저녁 샤워', 'public', NULL, NULL, NULL, 1763818595, 1763818595);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT 'bbd944a4-f607-42dd-99a6-17a8181c0af3', id FROM tag WHERE name = '일상' LIMIT 1;
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT 'bbd944a4-f607-42dd-99a6-17a8181c0af3', id FROM tag WHERE name = '습관' LIMIT 1;

-- 질문: 장 보는 방법
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, deleted_at, created_at, updated_at) VALUES ('848263ab-c7b7-4559-81fe-e4f80027210c', '장 보는 방법', '마트에서 직접', '온라인 배송', 'public', NULL, NULL, NULL, 1763818595, 1763818595);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '848263ab-c7b7-4559-81fe-e4f80027210c', id FROM tag WHERE name = '일상' LIMIT 1;
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '848263ab-c7b7-4559-81fe-e4f80027210c', id FROM tag WHERE name = '라이프스타일' LIMIT 1;

-- 질문: 청소는
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, deleted_at, created_at, updated_at) VALUES ('77c6e373-8efe-4cc5-b016-d98fd6196ed9', '청소는', '매일 조금씩', '주말에 한번에', 'public', NULL, NULL, NULL, 1763818595, 1763818595);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '77c6e373-8efe-4cc5-b016-d98fd6196ed9', id FROM tag WHERE name = '일상' LIMIT 1;
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '77c6e373-8efe-4cc5-b016-d98fd6196ed9', id FROM tag WHERE name = '습관' LIMIT 1;

-- 질문: 휴대폰 충전
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, deleted_at, created_at, updated_at) VALUES ('0a8ba1b1-998a-4c1a-be0a-31a638f1942c', '휴대폰 충전', '밤에 완충', '수시로 충전', 'public', NULL, NULL, NULL, 1763818595, 1763818595);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '0a8ba1b1-998a-4c1a-be0a-31a638f1942c', id FROM tag WHERE name = '일상' LIMIT 1;
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '0a8ba1b1-998a-4c1a-be0a-31a638f1942c', id FROM tag WHERE name = '습관' LIMIT 1;

-- 질문: SNS 사용
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, deleted_at, created_at, updated_at) VALUES ('c6d28856-e6ff-4983-9969-409bf59c3a5b', 'SNS 사용', '자주 올린다', '거의 안 올린다', 'public', NULL, NULL, NULL, 1763818595, 1763818595);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT 'c6d28856-e6ff-4983-9969-409bf59c3a5b', id FROM tag WHERE name = 'sns' LIMIT 1;
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT 'c6d28856-e6ff-4983-9969-409bf59c3a5b', id FROM tag WHERE name = '일상' LIMIT 1;

-- 질문: 인스타그램 계정
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, deleted_at, created_at, updated_at) VALUES ('5585e7cb-6a65-47eb-8117-da73719603a6', '인스타그램 계정', '공개 계정', '비공개 계정', 'public', NULL, NULL, NULL, 1763818595, 1763818595);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '5585e7cb-6a65-47eb-8117-da73719603a6', id FROM tag WHERE name = 'sns' LIMIT 1;

-- 질문: 단톡방 알림
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, deleted_at, created_at, updated_at) VALUES ('62b66979-6864-4401-88d9-79db3ef4b3f1', '단톡방 알림', '바로바로 확인', '모아서 확인', 'public', NULL, NULL, NULL, 1763818595, 1763818595);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '62b66979-6864-4401-88d9-79db3ef4b3f1', id FROM tag WHERE name = '일상' LIMIT 1;
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '62b66979-6864-4401-88d9-79db3ef4b3f1', id FROM tag WHERE name = '습관' LIMIT 1;

-- 질문: 전화 vs 문자
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, deleted_at, created_at, updated_at) VALUES ('d1496d3f-79c2-4835-85db-af8dc3f29000', '전화 vs 문자', '전화 선호', '문자 선호', 'public', NULL, NULL, NULL, 1763818595, 1763818595);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT 'd1496d3f-79c2-4835-85db-af8dc3f29000', id FROM tag WHERE name = '일상' LIMIT 1;
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT 'd1496d3f-79c2-4835-85db-af8dc3f29000', id FROM tag WHERE name = '관계' LIMIT 1;

-- 질문: 친구 만나는 빈도
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, deleted_at, created_at, updated_at) VALUES ('b2071402-8e55-4110-a93f-ab9d3fe30339', '친구 만나는 빈도', '자주 만나기', '가끔 만나기', 'public', NULL, NULL, NULL, 1763818595, 1763818595);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT 'b2071402-8e55-4110-a93f-ab9d3fe30339', id FROM tag WHERE name = '관계' LIMIT 1;
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT 'b2071402-8e55-4110-a93f-ab9d3fe30339', id FROM tag WHERE name = '일상' LIMIT 1;

-- 질문: 새로운 사람 만나기
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, deleted_at, created_at, updated_at) VALUES ('67d7a29a-8248-4f29-aafc-c0663111ddd9', '새로운 사람 만나기', '좋아함', '부담스러움', 'public', NULL, NULL, NULL, 1763818595, 1763818595);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '67d7a29a-8248-4f29-aafc-c0663111ddd9', id FROM tag WHERE name = '관계' LIMIT 1;

-- 질문: 논쟁이 생기면
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, deleted_at, created_at, updated_at) VALUES ('b2a55278-3e50-4d2d-af13-547867fc0591', '논쟁이 생기면', '끝까지 토론', '적당히 넘어가기', 'public', NULL, NULL, NULL, 1763818595, 1763818595);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT 'b2a55278-3e50-4d2d-af13-547867fc0591', id FROM tag WHERE name = '관계' LIMIT 1;
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT 'b2a55278-3e50-4d2d-af13-547867fc0591', id FROM tag WHERE name = '가치관' LIMIT 1;

-- 질문: 고민 상담
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, deleted_at, created_at, updated_at) VALUES ('7eaf525f-7f53-4d29-8b10-60827bba15b0', '고민 상담', '해결책 원함', '공감만 해주면 됨', 'public', NULL, NULL, NULL, 1763818595, 1763818595);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '7eaf525f-7f53-4d29-8b10-60827bba15b0', id FROM tag WHERE name = '관계' LIMIT 1;

-- 질문: 돈 vs 시간
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, deleted_at, created_at, updated_at) VALUES ('95ea541b-5398-4662-bddc-6cd7113b2ff1', '돈 vs 시간', '돈이 더 중요', '시간이 더 중요', 'public', NULL, NULL, NULL, 1763818595, 1763818595);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '95ea541b-5398-4662-bddc-6cd7113b2ff1', id FROM tag WHERE name = '가치관' LIMIT 1;
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '95ea541b-5398-4662-bddc-6cd7113b2ff1', id FROM tag WHERE name = '돈' LIMIT 1;

-- 질문: 복권 당첨 1억
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, deleted_at, created_at, updated_at) VALUES ('69caf0dc-ec59-4b7a-81f1-f52b014a5b50', '복권 당첨 1억', '투자하기', '저축하기', 'public', NULL, NULL, NULL, 1763818595, 1763818595);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '69caf0dc-ec59-4b7a-81f1-f52b014a5b50', id FROM tag WHERE name = '돈' LIMIT 1;
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '69caf0dc-ec59-4b7a-81f1-f52b014a5b50', id FROM tag WHERE name = '가치관' LIMIT 1;

-- 질문: 소비 패턴
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, deleted_at, created_at, updated_at) VALUES ('22b1984a-f910-4cfb-a4e9-c5c997f9ebeb', '소비 패턴', '플렉스 (과시적 소비)', '짠테크 (알뜰 소비)', 'public', NULL, NULL, NULL, 1763818595, 1763818595);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '22b1984a-f910-4cfb-a4e9-c5c997f9ebeb', id FROM tag WHERE name = '돈' LIMIT 1;
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '22b1984a-f910-4cfb-a4e9-c5c997f9ebeb', id FROM tag WHERE name = '라이프스타일' LIMIT 1;

-- 질문: 카페 음료
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, deleted_at, created_at, updated_at) VALUES ('6b7e3ce6-c79b-4f94-9969-a7f5533f51fb', '카페 음료', '비싸도 스타벅스', '저렴한 카페', 'public', NULL, NULL, NULL, 1763818595, 1763818595);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '6b7e3ce6-c79b-4f94-9969-a7f5533f51fb', id FROM tag WHERE name = '돈' LIMIT 1;
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '6b7e3ce6-c79b-4f94-9969-a7f5533f51fb', id FROM tag WHERE name = '일상' LIMIT 1;

-- 질문: 건강 관리
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, deleted_at, created_at, updated_at) VALUES ('929459c2-573c-43a6-9a96-5d8a83a89c7d', '건강 관리', '꾸준히 관리', '아프면 관리', 'public', NULL, NULL, NULL, 1763818595, 1763818595);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '929459c2-573c-43a6-9a96-5d8a83a89c7d', id FROM tag WHERE name = '건강' LIMIT 1;
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '929459c2-573c-43a6-9a96-5d8a83a89c7d', id FROM tag WHERE name = '습관' LIMIT 1;

-- 질문: 영양제
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, deleted_at, created_at, updated_at) VALUES ('f1455415-9a19-4271-9849-1d449b2106cc', '영양제', '챙겨 먹는다', '안 먹는다', 'public', NULL, NULL, NULL, 1763818595, 1763818595);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT 'f1455415-9a19-4271-9849-1d449b2106cc', id FROM tag WHERE name = '건강' LIMIT 1;

-- 질문: 스트레스 해소
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, deleted_at, created_at, updated_at) VALUES ('bd98e6b4-90d5-410d-ac6b-8ef3e18310a0', '스트레스 해소', '운동', '먹방', 'public', NULL, NULL, NULL, 1763818595, 1763818595);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT 'bd98e6b4-90d5-410d-ac6b-8ef3e18310a0', id FROM tag WHERE name = '건강' LIMIT 1;
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT 'bd98e6b4-90d5-410d-ac6b-8ef3e18310a0', id FROM tag WHERE name = '일상' LIMIT 1;

-- 질문: 잠
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, deleted_at, created_at, updated_at) VALUES ('65953427-d6c4-4e88-98f7-50f810d6f722', '잠', '질보다 양', '양보다 질', 'public', NULL, NULL, NULL, 1763818595, 1763818595);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '65953427-d6c4-4e88-98f7-50f810d6f722', id FROM tag WHERE name = '건강' LIMIT 1;
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '65953427-d6c4-4e88-98f7-50f810d6f722', id FROM tag WHERE name = '습관' LIMIT 1;

-- 질문: 공부 vs 경험
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, deleted_at, created_at, updated_at) VALUES ('14597768-deb5-49cc-af5c-87ea0bf38ab5', '공부 vs 경험', '자격증/학위', '실무 경험', 'public', NULL, NULL, NULL, 1763818595, 1763818595);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '14597768-deb5-49cc-af5c-87ea0bf38ab5', id FROM tag WHERE name = '자기계발' LIMIT 1;
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '14597768-deb5-49cc-af5c-87ea0bf38ab5', id FROM tag WHERE name = '가치관' LIMIT 1;

-- 질문: 책 읽는 방법
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, deleted_at, created_at, updated_at) VALUES ('b96f5939-afe4-4162-a8a2-a6d899840a35', '책 읽는 방법', '종이책', '전자책', 'public', NULL, NULL, NULL, 1763818595, 1763818595);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT 'b96f5939-afe4-4162-a8a2-a6d899840a35', id FROM tag WHERE name = '자기계발' LIMIT 1;
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT 'b96f5939-afe4-4162-a8a2-a6d899840a35', id FROM tag WHERE name = '취미' LIMIT 1;

-- 질문: 영어 공부
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, deleted_at, created_at, updated_at) VALUES ('ad9242fe-9a3c-46c0-8a25-b5dfb631a701', '영어 공부', '문법/독해', '회화', 'public', NULL, NULL, NULL, 1763818595, 1763818595);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT 'ad9242fe-9a3c-46c0-8a25-b5dfb631a701', id FROM tag WHERE name = '자기계발' LIMIT 1;

-- 질문: 자기계발 시간
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, deleted_at, created_at, updated_at) VALUES ('b5daff5b-1477-40d7-a6fc-9da2b4a71f9d', '자기계발 시간', '아침', '저녁', 'public', NULL, NULL, NULL, 1763818595, 1763818595);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT 'b5daff5b-1477-40d7-a6fc-9da2b4a71f9d', id FROM tag WHERE name = '자기계발' LIMIT 1;
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT 'b5daff5b-1477-40d7-a6fc-9da2b4a71f9d', id FROM tag WHERE name = '습관' LIMIT 1;

-- 질문: 영화 장르
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, deleted_at, created_at, updated_at) VALUES ('177c24e8-543a-4a34-8734-c45bcd289e95', '영화 장르', '액션/스릴러', '로맨스/코미디', 'public', NULL, NULL, NULL, 1763818595, 1763818595);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '177c24e8-543a-4a34-8734-c45bcd289e95', id FROM tag WHERE name = '영화' LIMIT 1;
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '177c24e8-543a-4a34-8734-c45bcd289e95', id FROM tag WHERE name = '취미' LIMIT 1;

-- 질문: 영화 보는 방법
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, deleted_at, created_at, updated_at) VALUES ('7f2a7afa-ffb9-4d17-ac46-1fe8bb13c8b7', '영화 보는 방법', '극장에서', 'OTT로 집에서', 'public', NULL, NULL, NULL, 1763818595, 1763818595);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '7f2a7afa-ffb9-4d17-ac46-1fe8bb13c8b7', id FROM tag WHERE name = '영화' LIMIT 1;
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '7f2a7afa-ffb9-4d17-ac46-1fe8bb13c8b7', id FROM tag WHERE name = '일상' LIMIT 1;

-- 질문: 영화 볼 때 간식
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, deleted_at, created_at, updated_at) VALUES ('1a1f0303-50d4-4612-82fe-e4ad25ea4047', '영화 볼 때 간식', '팝콘', '없음', 'public', NULL, NULL, NULL, 1763818595, 1763818595);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '1a1f0303-50d4-4612-82fe-e4ad25ea4047', id FROM tag WHERE name = '영화' LIMIT 1;
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '1a1f0303-50d4-4612-82fe-e4ad25ea4047', id FROM tag WHERE name = '음식' LIMIT 1;

-- 질문: 드라마 시청
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, deleted_at, created_at, updated_at) VALUES ('240e013e-509c-447f-8fb0-d1dcb7971c26', '드라마 시청', '몰아보기', '한 편씩', 'public', NULL, NULL, NULL, 1763818595, 1763818595);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '240e013e-509c-447f-8fb0-d1dcb7971c26', id FROM tag WHERE name = '취미' LIMIT 1;
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '240e013e-509c-447f-8fb0-d1dcb7971c26', id FROM tag WHERE name = '습관' LIMIT 1;

-- 질문: 음악 듣는 상황
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, deleted_at, created_at, updated_at) VALUES ('a736ba1d-881a-4dab-a726-bf8a3606b0fe', '음악 듣는 상황', '집중할 때', '쉴 때', 'public', NULL, NULL, NULL, 1763818595, 1763818595);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT 'a736ba1d-881a-4dab-a726-bf8a3606b0fe', id FROM tag WHERE name = '음악' LIMIT 1;
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT 'a736ba1d-881a-4dab-a726-bf8a3606b0fe', id FROM tag WHERE name = '일상' LIMIT 1;

-- 질문: 좋아하는 음악 장르
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, deleted_at, created_at, updated_at) VALUES ('a77169b2-a8ea-463d-81d0-dbcb817daa1c', '좋아하는 음악 장르', '발라드/인디', '힙합/EDM', 'public', NULL, NULL, NULL, 1763818595, 1763818595);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT 'a77169b2-a8ea-463d-81d0-dbcb817daa1c', id FROM tag WHERE name = '음악' LIMIT 1;

-- 질문: 콘서트 vs 페스티벌
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, deleted_at, created_at, updated_at) VALUES ('f8c4b223-1053-4285-a8f7-f9ce4c58e35a', '콘서트 vs 페스티벌', '콘서트', '페스티벌', 'public', NULL, NULL, NULL, 1763818595, 1763818595);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT 'f8c4b223-1053-4285-a8f7-f9ce4c58e35a', id FROM tag WHERE name = '음악' LIMIT 1;
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT 'f8c4b223-1053-4285-a8f7-f9ce4c58e35a', id FROM tag WHERE name = '취미' LIMIT 1;

-- 질문: 노래방에서
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, deleted_at, created_at, updated_at) VALUES ('b4bf1fa1-32fa-4292-a689-d6f1653b090b', '노래방에서', '적극적으로 부르기', '듣기만', 'public', NULL, NULL, NULL, 1763818595, 1763818595);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT 'b4bf1fa1-32fa-4292-a689-d6f1653b090b', id FROM tag WHERE name = '음악' LIMIT 1;
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT 'b4bf1fa1-32fa-4292-a689-d6f1653b090b', id FROM tag WHERE name = '일상' LIMIT 1;

-- 질문: 게임 플레이
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, deleted_at, created_at, updated_at) VALUES ('881aa0c8-379d-451d-b8df-a029e5a6349e', '게임 플레이', 'PC 게임', '모바일 게임', 'public', NULL, NULL, NULL, 1763818595, 1763818595);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '881aa0c8-379d-451d-b8df-a029e5a6349e', id FROM tag WHERE name = '게임' LIMIT 1;
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '881aa0c8-379d-451d-b8df-a029e5a6349e', id FROM tag WHERE name = '취미' LIMIT 1;

-- 질문: 게임 스타일
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, deleted_at, created_at, updated_at) VALUES ('0b3a51bd-87c7-4261-8bd4-36736e7914a7', '게임 스타일', '혼자', '친구들과', 'public', NULL, NULL, NULL, 1763818595, 1763818595);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '0b3a51bd-87c7-4261-8bd4-36736e7914a7', id FROM tag WHERE name = '게임' LIMIT 1;

-- 질문: 게임 과금
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, deleted_at, created_at, updated_at) VALUES ('3f19aa3b-d5e9-44d9-9f19-1332ef4f8066', '게임 과금', '한다', '안 한다', 'public', NULL, NULL, NULL, 1763818595, 1763818595);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '3f19aa3b-d5e9-44d9-9f19-1332ef4f8066', id FROM tag WHERE name = '게임' LIMIT 1;
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '3f19aa3b-d5e9-44d9-9f19-1332ef4f8066', id FROM tag WHERE name = '돈' LIMIT 1;

-- 질문: e스포츠 관심
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, deleted_at, created_at, updated_at) VALUES ('167c9343-bfda-4556-b6c4-da304de64b65', 'e스포츠 관심', '있다', '없다', 'public', NULL, NULL, NULL, 1763818595, 1763818595);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '167c9343-bfda-4556-b6c4-da304de64b65', id FROM tag WHERE name = '게임' LIMIT 1;

-- 질문: 운동 선호
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, deleted_at, created_at, updated_at) VALUES ('7733ab87-3ebd-417e-8c2f-a19953eaa68d', '운동 선호', '혼자 운동', '단체 운동', 'public', NULL, NULL, NULL, 1763818595, 1763818595);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '7733ab87-3ebd-417e-8c2f-a19953eaa68d', id FROM tag WHERE name = '운동' LIMIT 1;

-- 질문: 러닝 vs 사이클
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, deleted_at, created_at, updated_at) VALUES ('63b62175-8f40-4535-a51d-72feda490668', '러닝 vs 사이클', '러닝', '사이클', 'public', NULL, NULL, NULL, 1763818595, 1763818595);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '63b62175-8f40-4535-a51d-72feda490668', id FROM tag WHERE name = '운동' LIMIT 1;

-- 질문: 운동 시간대
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, deleted_at, created_at, updated_at) VALUES ('a805926f-0851-4129-9b8f-0d71dc380224', '운동 시간대', '아침', '저녁', 'public', NULL, NULL, NULL, 1763818595, 1763818595);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT 'a805926f-0851-4129-9b8f-0d71dc380224', id FROM tag WHERE name = '운동' LIMIT 1;
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT 'a805926f-0851-4129-9b8f-0d71dc380224', id FROM tag WHERE name = '습관' LIMIT 1;

-- 질문: 다이어트 방법
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, deleted_at, created_at, updated_at) VALUES ('78fb9665-2cab-43b3-a321-b3cfa33b4ec8', '다이어트 방법', '운동', '식단 조절', 'public', NULL, NULL, NULL, 1763818595, 1763818595);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '78fb9665-2cab-43b3-a321-b3cfa33b4ec8', id FROM tag WHERE name = '운동' LIMIT 1;
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '78fb9665-2cab-43b3-a321-b3cfa33b4ec8', id FROM tag WHERE name = '건강' LIMIT 1;

-- 질문: 반려동물
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, deleted_at, created_at, updated_at) VALUES ('529ece4d-87cd-4cde-90e1-3d8c848d817a', '반려동물', '강아지', '고양이', 'public', NULL, NULL, NULL, 1763818595, 1763818595);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '529ece4d-87cd-4cde-90e1-3d8c848d817a', id FROM tag WHERE name = '일상' LIMIT 1;
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '529ece4d-87cd-4cde-90e1-3d8c848d817a', id FROM tag WHERE name = '라이프스타일' LIMIT 1;

-- 질문: 계절
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, deleted_at, created_at, updated_at) VALUES ('527e9b69-6050-4516-b1bc-4a3c612a0f28', '계절', '봄/여름', '가을/겨울', 'public', NULL, NULL, NULL, 1763818595, 1763818595);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '527e9b69-6050-4516-b1bc-4a3c612a0f28', id FROM tag WHERE name = '일상' LIMIT 1;

-- 질문: 날씨
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, deleted_at, created_at, updated_at) VALUES ('54f62e05-77d2-4b23-92a2-fd86ff69c235', '날씨', '맑은 날', '비 오는 날', 'public', NULL, NULL, NULL, 1763818595, 1763818595);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '54f62e05-77d2-4b23-92a2-fd86ff69c235', id FROM tag WHERE name = '일상' LIMIT 1;

-- 질문: 교통수단
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, deleted_at, created_at, updated_at) VALUES ('59e1d30a-e606-4a34-8c04-3d4cc636d69f', '교통수단', '대중교통', '자가용', 'public', NULL, NULL, NULL, 1763818595, 1763818595);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '59e1d30a-e606-4a34-8c04-3d4cc636d69f', id FROM tag WHERE name = '일상' LIMIT 1;
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '59e1d30a-e606-4a34-8c04-3d4cc636d69f', id FROM tag WHERE name = '라이프스타일' LIMIT 1;

-- 질문: 집에서
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, deleted_at, created_at, updated_at) VALUES ('8a44b07b-b55b-46e0-9ed1-84ebe84c12b8', '집에서', 'TV 보기', '핸드폰 보기', 'public', NULL, NULL, NULL, 1763818595, 1763818595);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '8a44b07b-b55b-46e0-9ed1-84ebe84c12b8', id FROM tag WHERE name = '일상' LIMIT 1;
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '8a44b07b-b55b-46e0-9ed1-84ebe84c12b8', id FROM tag WHERE name = '습관' LIMIT 1;

-- 질문: 배달 vs 직접 요리
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, deleted_at, created_at, updated_at) VALUES ('f618f13b-700c-4f7d-9dfd-55114d5e9f9f', '배달 vs 직접 요리', '배달 음식', '직접 요리', 'public', NULL, NULL, NULL, 1763818595, 1763818595);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT 'f618f13b-700c-4f7d-9dfd-55114d5e9f9f', id FROM tag WHERE name = '음식' LIMIT 1;
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT 'f618f13b-700c-4f7d-9dfd-55114d5e9f9f', id FROM tag WHERE name = '일상' LIMIT 1;

-- 질문: 요리 실력
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, deleted_at, created_at, updated_at) VALUES ('496f8352-5942-4847-a7a0-c0d944479f93', '요리 실력', '잘하는 편', '못하는 편', 'public', NULL, NULL, NULL, 1763818595, 1763818595);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '496f8352-5942-4847-a7a0-c0d944479f93', id FROM tag WHERE name = '음식' LIMIT 1;
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '496f8352-5942-4847-a7a0-c0d944479f93', id FROM tag WHERE name = '일상' LIMIT 1;

-- 질문: 집 vs 회사
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, deleted_at, created_at, updated_at) VALUES ('c5eb1678-43cd-42af-9437-1df9b6e7a353', '집 vs 회사', '재택근무', '사무실 출근', 'public', NULL, NULL, NULL, 1763818595, 1763818595);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT 'c5eb1678-43cd-42af-9437-1df9b6e7a353', id FROM tag WHERE name = '직장생활' LIMIT 1;
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT 'c5eb1678-43cd-42af-9437-1df9b6e7a353', id FROM tag WHERE name = '라이프스타일' LIMIT 1;

-- 질문: 야근 수당 vs 칼퇴
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, deleted_at, created_at, updated_at) VALUES ('543de934-adad-471c-bf3e-dfcb2f3b3579', '야근 수당 vs 칼퇴', '야근 수당', '칼퇴근', 'public', NULL, NULL, NULL, 1763818595, 1763818595);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '543de934-adad-471c-bf3e-dfcb2f3b3579', id FROM tag WHERE name = '직장생활' LIMIT 1;
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '543de934-adad-471c-bf3e-dfcb2f3b3579', id FROM tag WHERE name = '돈' LIMIT 1;

-- 질문: 직장 위치
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, deleted_at, created_at, updated_at) VALUES ('b95b9db3-e7ba-48ca-9ff8-d94809263b6a', '직장 위치', '집 근처', '좋은 회사면 먼 곳도 OK', 'public', NULL, NULL, NULL, 1763818595, 1763818595);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT 'b95b9db3-e7ba-48ca-9ff8-d94809263b6a', id FROM tag WHERE name = '직장생활' LIMIT 1;

-- 질문: 스타트업 vs 대기업
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, deleted_at, created_at, updated_at) VALUES ('cf359cda-1f6a-4a03-a52c-0c3053605405', '스타트업 vs 대기업', '스타트업', '대기업', 'public', NULL, NULL, NULL, 1763818595, 1763818595);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT 'cf359cda-1f6a-4a03-a52c-0c3053605405', id FROM tag WHERE name = '직장생활' LIMIT 1;

-- 질문: 연차 사용
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, deleted_at, created_at, updated_at) VALUES ('bc648161-0886-4171-ba29-12f123319131', '연차 사용', '아끼지 않고 쓰기', '아껴서 쓰기', 'public', NULL, NULL, NULL, 1763818595, 1763818595);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT 'bc648161-0886-4171-ba29-12f123319131', id FROM tag WHERE name = '직장생활' LIMIT 1;

-- 질문: 점심 메뉴 결정
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, deleted_at, created_at, updated_at) VALUES ('586a0267-f263-4864-a8e9-1c495d777c0a', '점심 메뉴 결정', '내가 정한다', '따라간다', 'public', NULL, NULL, NULL, 1763818595, 1763818595);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '586a0267-f263-4864-a8e9-1c495d777c0a', id FROM tag WHERE name = '일상' LIMIT 1;
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '586a0267-f263-4864-a8e9-1c495d777c0a', id FROM tag WHERE name = '음식' LIMIT 1;

-- 질문: 메신저 답장
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, deleted_at, created_at, updated_at) VALUES ('13c1b883-dd67-410e-9284-48daaecd2bed', '메신저 답장', '바로 답장', '생각하고 답장', 'public', NULL, NULL, NULL, 1763818595, 1763818595);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '13c1b883-dd67-410e-9284-48daaecd2bed', id FROM tag WHERE name = '일상' LIMIT 1;
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '13c1b883-dd67-410e-9284-48daaecd2bed', id FROM tag WHERE name = '관계' LIMIT 1;

-- 질문: 일정 관리
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, deleted_at, created_at, updated_at) VALUES ('49911d61-e620-4ef8-85eb-9590ba1da3ae', '일정 관리', '디지털 (앱)', '아날로그 (노트)', 'public', NULL, NULL, NULL, 1763818595, 1763818595);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '49911d61-e620-4ef8-85eb-9590ba1da3ae', id FROM tag WHERE name = '습관' LIMIT 1;
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '49911d61-e620-4ef8-85eb-9590ba1da3ae', id FROM tag WHERE name = '자기계발' LIMIT 1;

-- 질문: 집 정리
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, deleted_at, created_at, updated_at) VALUES ('342b9ada-cf84-4723-bc77-08a66af1ec52', '집 정리', '미니멀리즘', '맥시멀리즘', 'public', NULL, NULL, NULL, 1763818595, 1763818595);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '342b9ada-cf84-4723-bc77-08a66af1ec52', id FROM tag WHERE name = '라이프스타일' LIMIT 1;
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '342b9ada-cf84-4723-bc77-08a66af1ec52', id FROM tag WHERE name = '습관' LIMIT 1;

-- 질문: 인테리어
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, deleted_at, created_at, updated_at) VALUES ('a2e3fcfd-f1e6-4cdc-8bd0-685eb8d8a496', '인테리어', '모던/심플', '빈티지/앤틱', 'public', NULL, NULL, NULL, 1763818595, 1763818595);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT 'a2e3fcfd-f1e6-4cdc-8bd0-685eb8d8a496', id FROM tag WHERE name = '라이프스타일' LIMIT 1;

-- 질문: 면 vs 밥
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, deleted_at, created_at, updated_at) VALUES ('41c1cfb3-73b5-48c7-927f-2dd43450f62e', '면 vs 밥', '면 요리', '밥 요리', 'public', NULL, NULL, NULL, 1763818595, 1763818595);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '41c1cfb3-73b5-48c7-927f-2dd43450f62e', id FROM tag WHERE name = '음식' LIMIT 1;

-- 질문: 독서 장소
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, deleted_at, created_at, updated_at) VALUES ('7a2097d1-ec91-4c73-a2b0-cb6121d5932a', '독서 장소', '도서관/카페', '집', 'public', NULL, NULL, NULL, 1763818595, 1763818595);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '7a2097d1-ec91-4c73-a2b0-cb6121d5932a', id FROM tag WHERE name = '취미' LIMIT 1;
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '7a2097d1-ec91-4c73-a2b0-cb6121d5932a', id FROM tag WHERE name = '일상' LIMIT 1;

-- 질문: 여름 vs 겨울
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, deleted_at, created_at, updated_at) VALUES ('122abc3a-4a91-4134-b941-a110ceb92394', '여름 vs 겨울', '여름', '겨울', 'public', NULL, NULL, NULL, 1763818595, 1763818595);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '122abc3a-4a91-4134-b941-a110ceb92394', id FROM tag WHERE name = '일상' LIMIT 1;

-- 질문: 자기 전 루틴
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, deleted_at, created_at, updated_at) VALUES ('04d1da0d-8248-4b2a-a676-e469b51073dd', '자기 전 루틴', '독서', '유튜브/넷플릭스', 'public', NULL, NULL, NULL, 1763818595, 1763818595);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '04d1da0d-8248-4b2a-a676-e469b51073dd', id FROM tag WHERE name = '일상' LIMIT 1;
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '04d1da0d-8248-4b2a-a676-e469b51073dd', id FROM tag WHERE name = '습관' LIMIT 1;


-- 총 20개 태그, 100개 질문 생성 완료
