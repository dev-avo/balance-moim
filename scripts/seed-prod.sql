-- 프로덕션 DB 시딩 SQL
-- 이 파일은 scripts/seed-data.json을 기반으로 생성되었습니다
-- 실행 방법: npx wrangler d1 execute balance-moim-db-prod --remote --file=scripts/seed-prod.sql

-- 태그 20개 생성
INSERT OR IGNORE INTO tag (id, name) VALUES
('b3bc099e-44b7-4780-83f1-dec79bc23ad3', '음식'),
('aef4760e-1461-4d83-a87e-708e200fa0ee', '연애'),
('248059e5-6870-46a6-94c6-5714b87c6b98', '취미'),
('3dbda89f-c243-4157-8b86-6af9bdc034bb', '직장생활'),
('855afab2-31a1-4c9b-8704-3ad202976a00', '여행'),
('b892972a-9839-4eb7-b4cc-85414d297b1d', '패션'),
('508216e4-3263-4c85-926d-17d5477acac3', '운동'),
('6d932f2c-dae0-4422-90da-b4a993fae65f', '영화'),
('799410ed-99db-4618-bc48-050a312258ef', '음악'),
('866614c8-18d2-477e-9975-c4571d2c52c7', '게임'),
('da390d56-1e3e-4810-95e2-b41b2ae27191', 'MBTI'),
('41650358-76a8-4b19-97ac-1df269ab12e0', '일상'),
('1a1d1d60-5cc2-4304-99ac-d0de32ef2b8c', '관계'),
('a6214b30-99a9-4501-b0d3-e6f1e8decd58', '가치관'),
('4b56609f-6242-4f9f-996c-7e3868afe3c0', '습관'),
('5f436f6a-8a8e-4c39-b54c-03cb6a45cace', '건강'),
('08657d19-0c30-44d5-b622-698dbb1cb8e0', '돈'),
('d873264d-ce7f-47a0-bbc0-b5df120dc461', '라이프스타일'),
('d7a70d51-2aa1-492a-9572-f98c82c6e45d', '자기계발'),
('66be31b3-8433-4f00-bb86-6f0aec239bea', 'sns');

-- 질문 100개 생성
-- 질문: 더 맛있는 진라면은?
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, created_at, updated_at, status) VALUES ('86158e06-e671-402b-9d05-2154761f14ab', '더 맛있는 진라면은?', '매운맛', '순한맛', 'public', NULL, NULL, '2025-11-22 13:33:54', '2025-11-22 13:33:54', 1);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '86158e06-e671-402b-9d05-2154761f14ab', id FROM tag WHERE name = '음식' LIMIT 1;

-- 질문: 치킨은 어떻게 먹을래?
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, created_at, updated_at, status) VALUES ('2cb9f3d4-19ed-4be3-a821-e7089d100dba', '치킨은 어떻게 먹을래?', '양념치킨', '후라이드치킨', 'public', NULL, NULL, '2025-11-22 13:33:54', '2025-11-22 13:33:54', 1);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '2cb9f3d4-19ed-4be3-a821-e7089d100dba', id FROM tag WHERE name = '음식' LIMIT 1;

-- 질문: 피자 선택의 기로
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, created_at, updated_at, status) VALUES ('0c4f8555-2c70-4c2a-b5d1-3da5e9977a24', '피자 선택의 기로', '페퍼로니 피자', '하와이안 피자', 'public', NULL, NULL, '2025-11-22 13:33:54', '2025-11-22 13:33:54', 1);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '0c4f8555-2c70-4c2a-b5d1-3da5e9977a24', id FROM tag WHERE name = '음식' LIMIT 1;

-- 질문: 커피 vs 녹차
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, created_at, updated_at, status) VALUES ('dac240ca-69a4-43a6-afa8-5f2ea334203a', '커피 vs 녹차', '커피', '녹차', 'public', NULL, NULL, '2025-11-22 13:33:54', '2025-11-22 13:33:54', 1);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT 'dac240ca-69a4-43a6-afa8-5f2ea334203a', id FROM tag WHERE name = '음식' LIMIT 1;
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT 'dac240ca-69a4-43a6-afa8-5f2ea334203a', id FROM tag WHERE name = '일상' LIMIT 1;

-- 질문: 아침 식사로 뭐가 나아?
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, created_at, updated_at, status) VALUES ('ecc7d34b-8b7b-453e-a846-55f5edeae196', '아침 식사로 뭐가 나아?', '밥', '빵', 'public', NULL, NULL, '2025-11-22 13:33:54', '2025-11-22 13:33:54', 1);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT 'ecc7d34b-8b7b-453e-a846-55f5edeae196', id FROM tag WHERE name = '음식' LIMIT 1;
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT 'ecc7d34b-8b7b-453e-a846-55f5edeae196', id FROM tag WHERE name = '일상' LIMIT 1;

-- 질문: 라면 끓일 때
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, created_at, updated_at, status) VALUES ('4d924b39-cdce-4b60-a400-165c265051fc', '라면 끓일 때', '계란 넣기', '치즈 넣기', 'public', NULL, NULL, '2025-11-22 13:33:54', '2025-11-22 13:33:54', 1);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '4d924b39-cdce-4b60-a400-165c265051fc', id FROM tag WHERE name = '음식' LIMIT 1;

-- 질문: 여름 디저트
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, created_at, updated_at, status) VALUES ('8bfe52fe-244d-4835-ba50-85da05990099', '여름 디저트', '팥빙수', '아이스크림', 'public', NULL, NULL, '2025-11-22 13:33:54', '2025-11-22 13:33:54', 1);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '8bfe52fe-244d-4835-ba50-85da05990099', id FROM tag WHERE name = '음식' LIMIT 1;

-- 질문: 술자리에서
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, created_at, updated_at, status) VALUES ('580b9289-79b8-48f9-b9b1-9e9b1099c1be', '술자리에서', '소주', '맥주', 'public', NULL, NULL, '2025-11-22 13:33:54', '2025-11-22 13:33:54', 1);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '580b9289-79b8-48f9-b9b1-9e9b1099c1be', id FROM tag WHERE name = '음식' LIMIT 1;
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '580b9289-79b8-48f9-b9b1-9e9b1099c1be', id FROM tag WHERE name = '일상' LIMIT 1;

-- 질문: 더 먹고 싶은 한식
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, created_at, updated_at, status) VALUES ('3c1a8fc7-06e0-4ae7-80bb-fb38808aab62', '더 먹고 싶은 한식', '김치찌개', '된장찌개', 'public', NULL, NULL, '2025-11-22 13:33:54', '2025-11-22 13:33:54', 1);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '3c1a8fc7-06e0-4ae7-80bb-fb38808aab62', id FROM tag WHERE name = '음식' LIMIT 1;

-- 질문: 분식 메뉴 선택
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, created_at, updated_at, status) VALUES ('43d8d187-364d-44f6-840f-3b1948b71fbe', '분식 메뉴 선택', '떡볶이', '튀김', 'public', NULL, NULL, '2025-11-22 13:33:54', '2025-11-22 13:33:54', 1);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '43d8d187-364d-44f6-840f-3b1948b71fbe', id FROM tag WHERE name = '음식' LIMIT 1;

-- 질문: 첫 데이트 장소는?
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, created_at, updated_at, status) VALUES ('63799185-b1ed-437d-a073-3cff87342de8', '첫 데이트 장소는?', '영화관', '카페', 'public', NULL, NULL, '2025-11-22 13:33:54', '2025-11-22 13:33:54', 1);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '63799185-b1ed-437d-a073-3cff87342de8', id FROM tag WHERE name = '연애' LIMIT 1;

-- 질문: 연애 스타일
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, created_at, updated_at, status) VALUES ('f662e3c5-9006-4629-8b65-41d9a0e187ce', '연애 스타일', '연락 자주하기', '적당한 거리두기', 'public', NULL, NULL, '2025-11-22 13:33:54', '2025-11-22 13:33:54', 1);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT 'f662e3c5-9006-4629-8b65-41d9a0e187ce', id FROM tag WHERE name = '연애' LIMIT 1;
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT 'f662e3c5-9006-4629-8b65-41d9a0e187ce', id FROM tag WHERE name = '관계' LIMIT 1;

-- 질문: 선물로 받고 싶은 건?
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, created_at, updated_at, status) VALUES ('8ee68038-44d8-4b54-b55e-b6fd4b518a25', '선물로 받고 싶은 건?', '손편지', '비싼 선물', 'public', NULL, NULL, '2025-11-22 13:33:54', '2025-11-22 13:33:54', 1);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '8ee68038-44d8-4b54-b55e-b6fd4b518a25', id FROM tag WHERE name = '연애' LIMIT 1;
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '8ee68038-44d8-4b54-b55e-b6fd4b518a25', id FROM tag WHERE name = '관계' LIMIT 1;

-- 질문: 썸 단계에서
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, created_at, updated_at, status) VALUES ('0d947225-b193-4b17-bd35-96f7a71606fa', '썸 단계에서', '직접 고백하기', '상대방 고백 기다리기', 'public', NULL, NULL, '2025-11-22 13:33:54', '2025-11-22 13:33:54', 1);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '0d947225-b193-4b17-bd35-96f7a71606fa', id FROM tag WHERE name = '연애' LIMIT 1;

-- 질문: 이상형
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, created_at, updated_at, status) VALUES ('f81d7392-6cf5-4f86-939d-2389c69c502d', '이상형', '귀여운 타입', '섹시한 타입', 'public', NULL, NULL, '2025-11-22 13:33:54', '2025-11-22 13:33:54', 1);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT 'f81d7392-6cf5-4f86-939d-2389c69c502d', id FROM tag WHERE name = '연애' LIMIT 1;

-- 질문: 여행 스타일
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, created_at, updated_at, status) VALUES ('e7e6dc12-fab7-479e-8629-321c8e312b94', '여행 스타일', '계획적인 여행', '즉흥적인 여행', 'public', NULL, NULL, '2025-11-22 13:33:54', '2025-11-22 13:33:54', 1);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT 'e7e6dc12-fab7-479e-8629-321c8e312b94', id FROM tag WHERE name = '여행' LIMIT 1;
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT 'e7e6dc12-fab7-479e-8629-321c8e312b94', id FROM tag WHERE name = '라이프스타일' LIMIT 1;

-- 질문: 해외여행 vs 국내여행
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, created_at, updated_at, status) VALUES ('6455f7d6-8a33-4934-92b9-1961d3df1461', '해외여행 vs 국내여행', '해외여행', '국내여행', 'public', NULL, NULL, '2025-11-22 13:33:54', '2025-11-22 13:33:54', 1);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '6455f7d6-8a33-4934-92b9-1961d3df1461', id FROM tag WHERE name = '여행' LIMIT 1;

-- 질문: 여행지 숙소
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, created_at, updated_at, status) VALUES ('d44fca32-e895-40b0-ac9c-502185389457', '여행지 숙소', '호텔', '게스트하우스', 'public', NULL, NULL, '2025-11-22 13:33:54', '2025-11-22 13:33:54', 1);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT 'd44fca32-e895-40b0-ac9c-502185389457', id FROM tag WHERE name = '여행' LIMIT 1;

-- 질문: 여행 중 식사
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, created_at, updated_at, status) VALUES ('da59ef46-ca26-47cf-af58-d54bdfcd0278', '여행 중 식사', '현지 맛집 탐방', '편의점 간편식', 'public', NULL, NULL, '2025-11-22 13:33:54', '2025-11-22 13:33:54', 1);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT 'da59ef46-ca26-47cf-af58-d54bdfcd0278', id FROM tag WHERE name = '여행' LIMIT 1;
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT 'da59ef46-ca26-47cf-af58-d54bdfcd0278', id FROM tag WHERE name = '음식' LIMIT 1;

-- 질문: 휴가 때 하고 싶은 일
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, created_at, updated_at, status) VALUES ('0f2a991a-f4fb-4a83-83fc-d1370cb5fdc7', '휴가 때 하고 싶은 일', '여행 가기', '집에서 쉬기', 'public', NULL, NULL, '2025-11-22 13:33:54', '2025-11-22 13:33:54', 1);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '0f2a991a-f4fb-4a83-83fc-d1370cb5fdc7', id FROM tag WHERE name = '여행' LIMIT 1;
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '0f2a991a-f4fb-4a83-83fc-d1370cb5fdc7', id FROM tag WHERE name = '일상' LIMIT 1;

-- 질문: 출근 시간
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, created_at, updated_at, status) VALUES ('0eed83be-d1dc-402d-ab8c-782c75dbab26', '출근 시간', '일찍 출근, 일찍 퇴근', '늦게 출근, 늦게 퇴근', 'public', NULL, NULL, '2025-11-22 13:33:54', '2025-11-22 13:33:54', 1);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '0eed83be-d1dc-402d-ab8c-782c75dbab26', id FROM tag WHERE name = '직장생활' LIMIT 1;

-- 질문: 점심시간
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, created_at, updated_at, status) VALUES ('05b66242-b447-4e97-a7c6-ac866d405e31', '점심시간', '동료들과 함께', '혼자 먹기', 'public', NULL, NULL, '2025-11-22 13:33:54', '2025-11-22 13:33:54', 1);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '05b66242-b447-4e97-a7c6-ac866d405e31', id FROM tag WHERE name = '직장생활' LIMIT 1;
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '05b66242-b447-4e97-a7c6-ac866d405e31', id FROM tag WHERE name = '일상' LIMIT 1;

-- 질문: 회식 vs 회식비 n빵
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, created_at, updated_at, status) VALUES ('78fea967-9460-4ead-9c74-8b1263831246', '회식 vs 회식비 n빵', '회식 참여', '회식비 받고 집에 가기', 'public', NULL, NULL, '2025-11-22 13:33:54', '2025-11-22 13:33:54', 1);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '78fea967-9460-4ead-9c74-8b1263831246', id FROM tag WHERE name = '직장생활' LIMIT 1;

-- 질문: 업무 스타일
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, created_at, updated_at, status) VALUES ('7c8ed9e8-91c5-4323-a660-406ade92d96f', '업무 스타일', '미리미리 끝내기', '데드라인에 맞춰서', 'public', NULL, NULL, '2025-11-22 13:33:54', '2025-11-22 13:33:54', 1);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '7c8ed9e8-91c5-4323-a660-406ade92d96f', id FROM tag WHERE name = '직장생활' LIMIT 1;
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '7c8ed9e8-91c5-4323-a660-406ade92d96f', id FROM tag WHERE name = '습관' LIMIT 1;

-- 질문: 이직 vs 현직 유지
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, created_at, updated_at, status) VALUES ('7366ebb1-03c2-439c-9688-f19c831f0296', '이직 vs 현직 유지', '좋은 기회면 이직', '현직에서 성장', 'public', NULL, NULL, '2025-11-22 13:33:54', '2025-11-22 13:33:54', 1);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '7366ebb1-03c2-439c-9688-f19c831f0296', id FROM tag WHERE name = '직장생활' LIMIT 1;

-- 질문: 주말 취미
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, created_at, updated_at, status) VALUES ('a5ee4c2f-bdeb-4e18-b211-b031e3355323', '주말 취미', '실내 활동', '야외 활동', 'public', NULL, NULL, '2025-11-22 13:33:54', '2025-11-22 13:33:54', 1);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT 'a5ee4c2f-bdeb-4e18-b211-b031e3355323', id FROM tag WHERE name = '취미' LIMIT 1;
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT 'a5ee4c2f-bdeb-4e18-b211-b031e3355323', id FROM tag WHERE name = '일상' LIMIT 1;

-- 질문: 독서 vs 영화 감상
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, created_at, updated_at, status) VALUES ('0472a515-726b-4e6c-a250-76c55d3c85a3', '독서 vs 영화 감상', '책 읽기', '영화 보기', 'public', NULL, NULL, '2025-11-22 13:33:54', '2025-11-22 13:33:54', 1);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '0472a515-726b-4e6c-a250-76c55d3c85a3', id FROM tag WHERE name = '취미' LIMIT 1;

-- 질문: 운동은
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, created_at, updated_at, status) VALUES ('a999fdf6-3d4a-467d-b829-c9321f200e9c', '운동은', '헬스장', '홈트레이닝', 'public', NULL, NULL, '2025-11-22 13:33:54', '2025-11-22 13:33:54', 1);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT 'a999fdf6-3d4a-467d-b829-c9321f200e9c', id FROM tag WHERE name = '운동' LIMIT 1;
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT 'a999fdf6-3d4a-467d-b829-c9321f200e9c', id FROM tag WHERE name = '건강' LIMIT 1;

-- 질문: 음악 듣는 방법
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, created_at, updated_at, status) VALUES ('b694da49-556d-4d2a-8f01-22128b4b3017', '음악 듣는 방법', '멜론, 지니 등 스트리밍', '유튜브', 'public', NULL, NULL, '2025-11-22 13:33:54', '2025-11-22 13:33:54', 1);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT 'b694da49-556d-4d2a-8f01-22128b4b3017', id FROM tag WHERE name = '음악' LIMIT 1;
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT 'b694da49-556d-4d2a-8f01-22128b4b3017', id FROM tag WHERE name = '취미' LIMIT 1;

-- 질문: 게임 장르
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, created_at, updated_at, status) VALUES ('31b7ab14-4879-4e3d-91d8-4e9cc40b1a75', '게임 장르', 'RPG, 어드벤처', 'FPS, AOS', 'public', NULL, NULL, '2025-11-22 13:33:54', '2025-11-22 13:33:54', 1);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '31b7ab14-4879-4e3d-91d8-4e9cc40b1a75', id FROM tag WHERE name = '게임' LIMIT 1;
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '31b7ab14-4879-4e3d-91d8-4e9cc40b1a75', id FROM tag WHERE name = '취미' LIMIT 1;

-- 질문: MBTI 믿는 편?
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, created_at, updated_at, status) VALUES ('8a0c20cf-aedd-485d-824d-d1e0944a7d09', 'MBTI 믿는 편?', '믿는다', '안 믿는다', 'public', NULL, NULL, '2025-11-22 13:33:54', '2025-11-22 13:33:54', 1);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '8a0c20cf-aedd-485d-824d-d1e0944a7d09', id FROM tag WHERE name = 'MBTI' LIMIT 1;
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '8a0c20cf-aedd-485d-824d-d1e0944a7d09', id FROM tag WHERE name = '가치관' LIMIT 1;

-- 질문: 외향적 vs 내향적
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, created_at, updated_at, status) VALUES ('feadb41c-7a1a-4886-a01f-124dc25ba469', '외향적 vs 내향적', 'E (외향형)', 'I (내향형)', 'public', NULL, NULL, '2025-11-22 13:33:54', '2025-11-22 13:33:54', 1);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT 'feadb41c-7a1a-4886-a01f-124dc25ba469', id FROM tag WHERE name = 'MBTI' LIMIT 1;
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT 'feadb41c-7a1a-4886-a01f-124dc25ba469', id FROM tag WHERE name = '일상' LIMIT 1;

-- 질문: 계획형 vs 즉흥형
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, created_at, updated_at, status) VALUES ('89b99127-df8c-4c32-b6f0-f08eeda0bb74', '계획형 vs 즉흥형', 'J (계획형)', 'P (즉흥형)', 'public', NULL, NULL, '2025-11-22 13:33:54', '2025-11-22 13:33:54', 1);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '89b99127-df8c-4c32-b6f0-f08eeda0bb74', id FROM tag WHERE name = 'MBTI' LIMIT 1;
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '89b99127-df8c-4c32-b6f0-f08eeda0bb74', id FROM tag WHERE name = '습관' LIMIT 1;

-- 질문: 감정형 vs 사고형
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, created_at, updated_at, status) VALUES ('0cf244f0-1f51-4249-aa7a-16ebabee3237', '감정형 vs 사고형', 'F (감정형)', 'T (사고형)', 'public', NULL, NULL, '2025-11-22 13:33:54', '2025-11-22 13:33:54', 1);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '0cf244f0-1f51-4249-aa7a-16ebabee3237', id FROM tag WHERE name = 'MBTI' LIMIT 1;

-- 질문: 패션 스타일
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, created_at, updated_at, status) VALUES ('9dd5653d-ac53-4697-be76-5c6abe407fe6', '패션 스타일', '편한 옷', '멋진 옷', 'public', NULL, NULL, '2025-11-22 13:33:54', '2025-11-22 13:33:54', 1);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '9dd5653d-ac53-4697-be76-5c6abe407fe6', id FROM tag WHERE name = '패션' LIMIT 1;
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '9dd5653d-ac53-4697-be76-5c6abe407fe6', id FROM tag WHERE name = '라이프스타일' LIMIT 1;

-- 질문: 신발 선택
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, created_at, updated_at, status) VALUES ('4406c80d-8414-47e7-bdf5-c7605e653efb', '신발 선택', '운동화', '구두/힐', 'public', NULL, NULL, '2025-11-22 13:33:54', '2025-11-22 13:33:54', 1);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '4406c80d-8414-47e7-bdf5-c7605e653efb', id FROM tag WHERE name = '패션' LIMIT 1;

-- 질문: 옷 쇼핑
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, created_at, updated_at, status) VALUES ('ddac8187-3894-4b99-86b0-984d00d82987', '옷 쇼핑', '온라인', '오프라인', 'public', NULL, NULL, '2025-11-22 13:33:54', '2025-11-22 13:33:54', 1);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT 'ddac8187-3894-4b99-86b0-984d00d82987', id FROM tag WHERE name = '패션' LIMIT 1;
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT 'ddac8187-3894-4b99-86b0-984d00d82987', id FROM tag WHERE name = '일상' LIMIT 1;

-- 질문: 악세서리
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, created_at, updated_at, status) VALUES ('f18ba896-09ce-4fbd-9d90-9ff4845e4cea', '악세서리', '착용', '미착용', 'public', NULL, NULL, '2025-11-22 13:33:54', '2025-11-22 13:33:54', 1);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT 'f18ba896-09ce-4fbd-9d90-9ff4845e4cea', id FROM tag WHERE name = '패션' LIMIT 1;

-- 질문: 아침형 vs 저녁형 인간
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, created_at, updated_at, status) VALUES ('a172b1fd-ccf4-4bb2-ba0d-94fa9742b867', '아침형 vs 저녁형 인간', '아침형', '저녁형', 'public', NULL, NULL, '2025-11-22 13:33:54', '2025-11-22 13:33:54', 1);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT 'a172b1fd-ccf4-4bb2-ba0d-94fa9742b867', id FROM tag WHERE name = '일상' LIMIT 1;
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT 'a172b1fd-ccf4-4bb2-ba0d-94fa9742b867', id FROM tag WHERE name = '습관' LIMIT 1;

-- 질문: 샤워 시간
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, created_at, updated_at, status) VALUES ('5f07b487-10cb-4749-90b5-f9219dec3858', '샤워 시간', '아침 샤워', '저녁 샤워', 'public', NULL, NULL, '2025-11-22 13:33:54', '2025-11-22 13:33:54', 1);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '5f07b487-10cb-4749-90b5-f9219dec3858', id FROM tag WHERE name = '일상' LIMIT 1;
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '5f07b487-10cb-4749-90b5-f9219dec3858', id FROM tag WHERE name = '습관' LIMIT 1;

-- 질문: 장 보는 방법
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, created_at, updated_at, status) VALUES ('8c78622e-72c9-4c09-8bab-8f68d49b312b', '장 보는 방법', '마트에서 직접', '온라인 배송', 'public', NULL, NULL, '2025-11-22 13:33:54', '2025-11-22 13:33:54', 1);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '8c78622e-72c9-4c09-8bab-8f68d49b312b', id FROM tag WHERE name = '일상' LIMIT 1;
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '8c78622e-72c9-4c09-8bab-8f68d49b312b', id FROM tag WHERE name = '라이프스타일' LIMIT 1;

-- 질문: 청소는
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, created_at, updated_at, status) VALUES ('3ba2e79b-21b6-4b3b-990e-4dccb122a675', '청소는', '매일 조금씩', '주말에 한번에', 'public', NULL, NULL, '2025-11-22 13:33:54', '2025-11-22 13:33:54', 1);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '3ba2e79b-21b6-4b3b-990e-4dccb122a675', id FROM tag WHERE name = '일상' LIMIT 1;
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '3ba2e79b-21b6-4b3b-990e-4dccb122a675', id FROM tag WHERE name = '습관' LIMIT 1;

-- 질문: 휴대폰 충전
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, created_at, updated_at, status) VALUES ('2652138e-3de2-4534-a8b2-8c06afe91613', '휴대폰 충전', '밤에 완충', '수시로 충전', 'public', NULL, NULL, '2025-11-22 13:33:54', '2025-11-22 13:33:54', 1);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '2652138e-3de2-4534-a8b2-8c06afe91613', id FROM tag WHERE name = '일상' LIMIT 1;
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '2652138e-3de2-4534-a8b2-8c06afe91613', id FROM tag WHERE name = '습관' LIMIT 1;

-- 질문: SNS 사용
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, created_at, updated_at, status) VALUES ('d2495bee-bc99-46ea-ba14-47795bc7a7f2', 'SNS 사용', '자주 올린다', '거의 안 올린다', 'public', NULL, NULL, '2025-11-22 13:33:54', '2025-11-22 13:33:54', 1);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT 'd2495bee-bc99-46ea-ba14-47795bc7a7f2', id FROM tag WHERE name = 'sns' LIMIT 1;
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT 'd2495bee-bc99-46ea-ba14-47795bc7a7f2', id FROM tag WHERE name = '일상' LIMIT 1;

-- 질문: 인스타그램 계정
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, created_at, updated_at, status) VALUES ('e8fabdfb-e604-42e2-bc52-9ce4060cd0b3', '인스타그램 계정', '공개 계정', '비공개 계정', 'public', NULL, NULL, '2025-11-22 13:33:54', '2025-11-22 13:33:54', 1);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT 'e8fabdfb-e604-42e2-bc52-9ce4060cd0b3', id FROM tag WHERE name = 'sns' LIMIT 1;

-- 질문: 단톡방 알림
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, created_at, updated_at, status) VALUES ('bed97053-0656-4a47-8e2e-3c038cb68c0a', '단톡방 알림', '바로바로 확인', '모아서 확인', 'public', NULL, NULL, '2025-11-22 13:33:54', '2025-11-22 13:33:54', 1);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT 'bed97053-0656-4a47-8e2e-3c038cb68c0a', id FROM tag WHERE name = '일상' LIMIT 1;
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT 'bed97053-0656-4a47-8e2e-3c038cb68c0a', id FROM tag WHERE name = '습관' LIMIT 1;

-- 질문: 전화 vs 문자
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, created_at, updated_at, status) VALUES ('3fd75e41-9749-4211-b6e8-44b64435b3d3', '전화 vs 문자', '전화 선호', '문자 선호', 'public', NULL, NULL, '2025-11-22 13:33:54', '2025-11-22 13:33:54', 1);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '3fd75e41-9749-4211-b6e8-44b64435b3d3', id FROM tag WHERE name = '일상' LIMIT 1;
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '3fd75e41-9749-4211-b6e8-44b64435b3d3', id FROM tag WHERE name = '관계' LIMIT 1;

-- 질문: 친구 만나는 빈도
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, created_at, updated_at, status) VALUES ('416fe7c0-a969-4742-83ad-c7798c1d7d45', '친구 만나는 빈도', '자주 만나기', '가끔 만나기', 'public', NULL, NULL, '2025-11-22 13:33:54', '2025-11-22 13:33:54', 1);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '416fe7c0-a969-4742-83ad-c7798c1d7d45', id FROM tag WHERE name = '관계' LIMIT 1;
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '416fe7c0-a969-4742-83ad-c7798c1d7d45', id FROM tag WHERE name = '일상' LIMIT 1;

-- 질문: 새로운 사람 만나기
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, created_at, updated_at, status) VALUES ('7dc97054-cdf3-448d-8220-09a36928205a', '새로운 사람 만나기', '좋아함', '부담스러움', 'public', NULL, NULL, '2025-11-22 13:33:54', '2025-11-22 13:33:54', 1);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '7dc97054-cdf3-448d-8220-09a36928205a', id FROM tag WHERE name = '관계' LIMIT 1;

-- 질문: 논쟁이 생기면
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, created_at, updated_at, status) VALUES ('f1b2a62c-879b-4fba-b30f-b38cc3363cc4', '논쟁이 생기면', '끝까지 토론', '적당히 넘어가기', 'public', NULL, NULL, '2025-11-22 13:33:54', '2025-11-22 13:33:54', 1);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT 'f1b2a62c-879b-4fba-b30f-b38cc3363cc4', id FROM tag WHERE name = '관계' LIMIT 1;
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT 'f1b2a62c-879b-4fba-b30f-b38cc3363cc4', id FROM tag WHERE name = '가치관' LIMIT 1;

-- 질문: 고민 상담
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, created_at, updated_at, status) VALUES ('975e1502-2879-42a5-98ce-fc881533ff39', '고민 상담', '해결책 원함', '공감만 해주면 됨', 'public', NULL, NULL, '2025-11-22 13:33:54', '2025-11-22 13:33:54', 1);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '975e1502-2879-42a5-98ce-fc881533ff39', id FROM tag WHERE name = '관계' LIMIT 1;

-- 질문: 돈 vs 시간
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, created_at, updated_at, status) VALUES ('dd45d1c4-341b-4661-81c4-5502e2570dfb', '돈 vs 시간', '돈이 더 중요', '시간이 더 중요', 'public', NULL, NULL, '2025-11-22 13:33:54', '2025-11-22 13:33:54', 1);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT 'dd45d1c4-341b-4661-81c4-5502e2570dfb', id FROM tag WHERE name = '가치관' LIMIT 1;
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT 'dd45d1c4-341b-4661-81c4-5502e2570dfb', id FROM tag WHERE name = '돈' LIMIT 1;

-- 질문: 복권 당첨 1억
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, created_at, updated_at, status) VALUES ('233262d9-a938-4a5d-833a-f4153b7c2e8c', '복권 당첨 1억', '투자하기', '저축하기', 'public', NULL, NULL, '2025-11-22 13:33:54', '2025-11-22 13:33:54', 1);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '233262d9-a938-4a5d-833a-f4153b7c2e8c', id FROM tag WHERE name = '돈' LIMIT 1;
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '233262d9-a938-4a5d-833a-f4153b7c2e8c', id FROM tag WHERE name = '가치관' LIMIT 1;

-- 질문: 소비 패턴
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, created_at, updated_at, status) VALUES ('c30cdfcf-b96e-4234-bc33-3282e2b191c6', '소비 패턴', '플렉스 (과시적 소비)', '짠테크 (알뜰 소비)', 'public', NULL, NULL, '2025-11-22 13:33:54', '2025-11-22 13:33:54', 1);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT 'c30cdfcf-b96e-4234-bc33-3282e2b191c6', id FROM tag WHERE name = '돈' LIMIT 1;
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT 'c30cdfcf-b96e-4234-bc33-3282e2b191c6', id FROM tag WHERE name = '라이프스타일' LIMIT 1;

-- 질문: 카페 음료
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, created_at, updated_at, status) VALUES ('6687f5c3-9a46-4c77-b22f-49a0ecccacd7', '카페 음료', '비싸도 스타벅스', '저렴한 카페', 'public', NULL, NULL, '2025-11-22 13:33:54', '2025-11-22 13:33:54', 1);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '6687f5c3-9a46-4c77-b22f-49a0ecccacd7', id FROM tag WHERE name = '돈' LIMIT 1;
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '6687f5c3-9a46-4c77-b22f-49a0ecccacd7', id FROM tag WHERE name = '일상' LIMIT 1;

-- 질문: 건강 관리
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, created_at, updated_at, status) VALUES ('b813c64c-0d42-45ed-998b-19fcf307aedf', '건강 관리', '꾸준히 관리', '아프면 관리', 'public', NULL, NULL, '2025-11-22 13:33:54', '2025-11-22 13:33:54', 1);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT 'b813c64c-0d42-45ed-998b-19fcf307aedf', id FROM tag WHERE name = '건강' LIMIT 1;
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT 'b813c64c-0d42-45ed-998b-19fcf307aedf', id FROM tag WHERE name = '습관' LIMIT 1;

-- 질문: 영양제
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, created_at, updated_at, status) VALUES ('94a9e160-ee35-45bd-bcff-2c7e86515136', '영양제', '챙겨 먹는다', '안 먹는다', 'public', NULL, NULL, '2025-11-22 13:33:54', '2025-11-22 13:33:54', 1);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '94a9e160-ee35-45bd-bcff-2c7e86515136', id FROM tag WHERE name = '건강' LIMIT 1;

-- 질문: 스트레스 해소
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, created_at, updated_at, status) VALUES ('cd03dbee-d0c7-4f23-98ec-eb75fb55a75a', '스트레스 해소', '운동', '먹방', 'public', NULL, NULL, '2025-11-22 13:33:54', '2025-11-22 13:33:54', 1);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT 'cd03dbee-d0c7-4f23-98ec-eb75fb55a75a', id FROM tag WHERE name = '건강' LIMIT 1;
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT 'cd03dbee-d0c7-4f23-98ec-eb75fb55a75a', id FROM tag WHERE name = '일상' LIMIT 1;

-- 질문: 잠
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, created_at, updated_at, status) VALUES ('20e58c3a-d2df-4926-86b4-edce502e344f', '잠', '질보다 양', '양보다 질', 'public', NULL, NULL, '2025-11-22 13:33:54', '2025-11-22 13:33:54', 1);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '20e58c3a-d2df-4926-86b4-edce502e344f', id FROM tag WHERE name = '건강' LIMIT 1;
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '20e58c3a-d2df-4926-86b4-edce502e344f', id FROM tag WHERE name = '습관' LIMIT 1;

-- 질문: 공부 vs 경험
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, created_at, updated_at, status) VALUES ('fd99297a-e9a0-4310-b723-de932e82d559', '공부 vs 경험', '자격증/학위', '실무 경험', 'public', NULL, NULL, '2025-11-22 13:33:54', '2025-11-22 13:33:54', 1);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT 'fd99297a-e9a0-4310-b723-de932e82d559', id FROM tag WHERE name = '자기계발' LIMIT 1;
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT 'fd99297a-e9a0-4310-b723-de932e82d559', id FROM tag WHERE name = '가치관' LIMIT 1;

-- 질문: 책 읽는 방법
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, created_at, updated_at, status) VALUES ('711b991a-769a-4e33-8508-755f8561d422', '책 읽는 방법', '종이책', '전자책', 'public', NULL, NULL, '2025-11-22 13:33:54', '2025-11-22 13:33:54', 1);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '711b991a-769a-4e33-8508-755f8561d422', id FROM tag WHERE name = '자기계발' LIMIT 1;
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '711b991a-769a-4e33-8508-755f8561d422', id FROM tag WHERE name = '취미' LIMIT 1;

-- 질문: 영어 공부
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, created_at, updated_at, status) VALUES ('5173c52b-68e4-422a-8318-e019bc871a1d', '영어 공부', '문법/독해', '회화', 'public', NULL, NULL, '2025-11-22 13:33:54', '2025-11-22 13:33:54', 1);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '5173c52b-68e4-422a-8318-e019bc871a1d', id FROM tag WHERE name = '자기계발' LIMIT 1;

-- 질문: 자기계발 시간
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, created_at, updated_at, status) VALUES ('826910d5-cbac-4320-97bc-bbcd35e892cb', '자기계발 시간', '아침', '저녁', 'public', NULL, NULL, '2025-11-22 13:33:54', '2025-11-22 13:33:54', 1);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '826910d5-cbac-4320-97bc-bbcd35e892cb', id FROM tag WHERE name = '자기계발' LIMIT 1;
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '826910d5-cbac-4320-97bc-bbcd35e892cb', id FROM tag WHERE name = '습관' LIMIT 1;

-- 질문: 영화 장르
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, created_at, updated_at, status) VALUES ('304497bd-dc6c-4b24-9a96-11149bd1ff73', '영화 장르', '액션/스릴러', '로맨스/코미디', 'public', NULL, NULL, '2025-11-22 13:33:54', '2025-11-22 13:33:54', 1);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '304497bd-dc6c-4b24-9a96-11149bd1ff73', id FROM tag WHERE name = '영화' LIMIT 1;
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '304497bd-dc6c-4b24-9a96-11149bd1ff73', id FROM tag WHERE name = '취미' LIMIT 1;

-- 질문: 영화 보는 방법
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, created_at, updated_at, status) VALUES ('72f02216-3fbf-4bf9-8e32-ca0646980fdc', '영화 보는 방법', '극장에서', 'OTT로 집에서', 'public', NULL, NULL, '2025-11-22 13:33:54', '2025-11-22 13:33:54', 1);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '72f02216-3fbf-4bf9-8e32-ca0646980fdc', id FROM tag WHERE name = '영화' LIMIT 1;
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '72f02216-3fbf-4bf9-8e32-ca0646980fdc', id FROM tag WHERE name = '일상' LIMIT 1;

-- 질문: 영화 볼 때 간식
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, created_at, updated_at, status) VALUES ('4649bb88-e3ab-41d4-b1e2-293ec70a0dfb', '영화 볼 때 간식', '팝콘', '없음', 'public', NULL, NULL, '2025-11-22 13:33:54', '2025-11-22 13:33:54', 1);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '4649bb88-e3ab-41d4-b1e2-293ec70a0dfb', id FROM tag WHERE name = '영화' LIMIT 1;
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '4649bb88-e3ab-41d4-b1e2-293ec70a0dfb', id FROM tag WHERE name = '음식' LIMIT 1;

-- 질문: 드라마 시청
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, created_at, updated_at, status) VALUES ('c088a864-6e77-4d29-a945-ab5d3b318114', '드라마 시청', '몰아보기', '한 편씩', 'public', NULL, NULL, '2025-11-22 13:33:54', '2025-11-22 13:33:54', 1);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT 'c088a864-6e77-4d29-a945-ab5d3b318114', id FROM tag WHERE name = '취미' LIMIT 1;
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT 'c088a864-6e77-4d29-a945-ab5d3b318114', id FROM tag WHERE name = '습관' LIMIT 1;

-- 질문: 음악 듣는 상황
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, created_at, updated_at, status) VALUES ('9fa8086b-2cf5-451e-a7cd-9030098b3a2e', '음악 듣는 상황', '집중할 때', '쉴 때', 'public', NULL, NULL, '2025-11-22 13:33:54', '2025-11-22 13:33:54', 1);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '9fa8086b-2cf5-451e-a7cd-9030098b3a2e', id FROM tag WHERE name = '음악' LIMIT 1;
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '9fa8086b-2cf5-451e-a7cd-9030098b3a2e', id FROM tag WHERE name = '일상' LIMIT 1;

-- 질문: 좋아하는 음악 장르
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, created_at, updated_at, status) VALUES ('0da53345-2429-4afb-bb2f-cab468d05a21', '좋아하는 음악 장르', '발라드/인디', '힙합/EDM', 'public', NULL, NULL, '2025-11-22 13:33:54', '2025-11-22 13:33:54', 1);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '0da53345-2429-4afb-bb2f-cab468d05a21', id FROM tag WHERE name = '음악' LIMIT 1;

-- 질문: 콘서트 vs 페스티벌
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, created_at, updated_at, status) VALUES ('7f822786-817d-4bd0-8fd0-da0d737ee014', '콘서트 vs 페스티벌', '콘서트', '페스티벌', 'public', NULL, NULL, '2025-11-22 13:33:54', '2025-11-22 13:33:54', 1);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '7f822786-817d-4bd0-8fd0-da0d737ee014', id FROM tag WHERE name = '음악' LIMIT 1;
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '7f822786-817d-4bd0-8fd0-da0d737ee014', id FROM tag WHERE name = '취미' LIMIT 1;

-- 질문: 노래방에서
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, created_at, updated_at, status) VALUES ('02e2a601-0918-41d0-be80-07514570d1d7', '노래방에서', '적극적으로 부르기', '듣기만', 'public', NULL, NULL, '2025-11-22 13:33:54', '2025-11-22 13:33:54', 1);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '02e2a601-0918-41d0-be80-07514570d1d7', id FROM tag WHERE name = '음악' LIMIT 1;
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '02e2a601-0918-41d0-be80-07514570d1d7', id FROM tag WHERE name = '일상' LIMIT 1;

-- 질문: 게임 플레이
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, created_at, updated_at, status) VALUES ('ff7862ef-787a-45d8-a7ed-e7a111cf85e4', '게임 플레이', 'PC 게임', '모바일 게임', 'public', NULL, NULL, '2025-11-22 13:33:54', '2025-11-22 13:33:54', 1);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT 'ff7862ef-787a-45d8-a7ed-e7a111cf85e4', id FROM tag WHERE name = '게임' LIMIT 1;
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT 'ff7862ef-787a-45d8-a7ed-e7a111cf85e4', id FROM tag WHERE name = '취미' LIMIT 1;

-- 질문: 게임 스타일
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, created_at, updated_at, status) VALUES ('6fcf3539-579a-4ad4-a97c-6f78af3316a9', '게임 스타일', '혼자', '친구들과', 'public', NULL, NULL, '2025-11-22 13:33:54', '2025-11-22 13:33:54', 1);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '6fcf3539-579a-4ad4-a97c-6f78af3316a9', id FROM tag WHERE name = '게임' LIMIT 1;

-- 질문: 게임 과금
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, created_at, updated_at, status) VALUES ('fa203831-2eed-4da9-a74b-840b0274fe3c', '게임 과금', '한다', '안 한다', 'public', NULL, NULL, '2025-11-22 13:33:54', '2025-11-22 13:33:54', 1);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT 'fa203831-2eed-4da9-a74b-840b0274fe3c', id FROM tag WHERE name = '게임' LIMIT 1;
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT 'fa203831-2eed-4da9-a74b-840b0274fe3c', id FROM tag WHERE name = '돈' LIMIT 1;

-- 질문: e스포츠 관심
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, created_at, updated_at, status) VALUES ('631a731e-ee0d-48e7-bf63-639b76441606', 'e스포츠 관심', '있다', '없다', 'public', NULL, NULL, '2025-11-22 13:33:54', '2025-11-22 13:33:54', 1);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '631a731e-ee0d-48e7-bf63-639b76441606', id FROM tag WHERE name = '게임' LIMIT 1;

-- 질문: 운동 선호
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, created_at, updated_at, status) VALUES ('b110668b-944f-4a30-bded-eb05bf6a833d', '운동 선호', '혼자 운동', '단체 운동', 'public', NULL, NULL, '2025-11-22 13:33:54', '2025-11-22 13:33:54', 1);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT 'b110668b-944f-4a30-bded-eb05bf6a833d', id FROM tag WHERE name = '운동' LIMIT 1;

-- 질문: 러닝 vs 사이클
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, created_at, updated_at, status) VALUES ('b27f7555-379e-4ba1-9fba-935cbda2792d', '러닝 vs 사이클', '러닝', '사이클', 'public', NULL, NULL, '2025-11-22 13:33:54', '2025-11-22 13:33:54', 1);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT 'b27f7555-379e-4ba1-9fba-935cbda2792d', id FROM tag WHERE name = '운동' LIMIT 1;

-- 질문: 운동 시간대
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, created_at, updated_at, status) VALUES ('d8d067ca-a340-4bfe-adb2-017cdb649a95', '운동 시간대', '아침', '저녁', 'public', NULL, NULL, '2025-11-22 13:33:54', '2025-11-22 13:33:54', 1);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT 'd8d067ca-a340-4bfe-adb2-017cdb649a95', id FROM tag WHERE name = '운동' LIMIT 1;
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT 'd8d067ca-a340-4bfe-adb2-017cdb649a95', id FROM tag WHERE name = '습관' LIMIT 1;

-- 질문: 다이어트 방법
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, created_at, updated_at, status) VALUES ('59684a8d-5dc5-4478-816e-30a20a8735aa', '다이어트 방법', '운동', '식단 조절', 'public', NULL, NULL, '2025-11-22 13:33:54', '2025-11-22 13:33:54', 1);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '59684a8d-5dc5-4478-816e-30a20a8735aa', id FROM tag WHERE name = '운동' LIMIT 1;
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '59684a8d-5dc5-4478-816e-30a20a8735aa', id FROM tag WHERE name = '건강' LIMIT 1;

-- 질문: 반려동물
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, created_at, updated_at, status) VALUES ('6b10c55e-a891-4450-93d0-22e20544befa', '반려동물', '강아지', '고양이', 'public', NULL, NULL, '2025-11-22 13:33:54', '2025-11-22 13:33:54', 1);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '6b10c55e-a891-4450-93d0-22e20544befa', id FROM tag WHERE name = '일상' LIMIT 1;
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '6b10c55e-a891-4450-93d0-22e20544befa', id FROM tag WHERE name = '라이프스타일' LIMIT 1;

-- 질문: 계절
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, created_at, updated_at, status) VALUES ('bf1c2da2-caab-4c19-997e-07c6ba42922f', '계절', '봄/여름', '가을/겨울', 'public', NULL, NULL, '2025-11-22 13:33:54', '2025-11-22 13:33:54', 1);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT 'bf1c2da2-caab-4c19-997e-07c6ba42922f', id FROM tag WHERE name = '일상' LIMIT 1;

-- 질문: 날씨
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, created_at, updated_at, status) VALUES ('6cec4f5f-d103-4c1d-a0b5-32820a623f4e', '날씨', '맑은 날', '비 오는 날', 'public', NULL, NULL, '2025-11-22 13:33:54', '2025-11-22 13:33:54', 1);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '6cec4f5f-d103-4c1d-a0b5-32820a623f4e', id FROM tag WHERE name = '일상' LIMIT 1;

-- 질문: 교통수단
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, created_at, updated_at, status) VALUES ('abc3735f-0e17-431a-846b-0af59b3c8dcd', '교통수단', '대중교통', '자가용', 'public', NULL, NULL, '2025-11-22 13:33:54', '2025-11-22 13:33:54', 1);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT 'abc3735f-0e17-431a-846b-0af59b3c8dcd', id FROM tag WHERE name = '일상' LIMIT 1;
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT 'abc3735f-0e17-431a-846b-0af59b3c8dcd', id FROM tag WHERE name = '라이프스타일' LIMIT 1;

-- 질문: 집에서
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, created_at, updated_at, status) VALUES ('e567dae1-aeb6-4e5e-a446-147a31707208', '집에서', 'TV 보기', '핸드폰 보기', 'public', NULL, NULL, '2025-11-22 13:33:54', '2025-11-22 13:33:54', 1);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT 'e567dae1-aeb6-4e5e-a446-147a31707208', id FROM tag WHERE name = '일상' LIMIT 1;
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT 'e567dae1-aeb6-4e5e-a446-147a31707208', id FROM tag WHERE name = '습관' LIMIT 1;

-- 질문: 배달 vs 직접 요리
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, created_at, updated_at, status) VALUES ('47c8c94b-d21a-444b-a8dd-e87555c03edb', '배달 vs 직접 요리', '배달 음식', '직접 요리', 'public', NULL, NULL, '2025-11-22 13:33:54', '2025-11-22 13:33:54', 1);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '47c8c94b-d21a-444b-a8dd-e87555c03edb', id FROM tag WHERE name = '음식' LIMIT 1;
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '47c8c94b-d21a-444b-a8dd-e87555c03edb', id FROM tag WHERE name = '일상' LIMIT 1;

-- 질문: 요리 실력
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, created_at, updated_at, status) VALUES ('717b8aab-3d2d-4102-8e0b-1a21463d987c', '요리 실력', '잘하는 편', '못하는 편', 'public', NULL, NULL, '2025-11-22 13:33:54', '2025-11-22 13:33:54', 1);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '717b8aab-3d2d-4102-8e0b-1a21463d987c', id FROM tag WHERE name = '음식' LIMIT 1;
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '717b8aab-3d2d-4102-8e0b-1a21463d987c', id FROM tag WHERE name = '일상' LIMIT 1;

-- 질문: 집 vs 회사
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, created_at, updated_at, status) VALUES ('3dbad7fe-428d-49ef-b62f-b28f129fd2f8', '집 vs 회사', '재택근무', '사무실 출근', 'public', NULL, NULL, '2025-11-22 13:33:54', '2025-11-22 13:33:54', 1);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '3dbad7fe-428d-49ef-b62f-b28f129fd2f8', id FROM tag WHERE name = '직장생활' LIMIT 1;
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '3dbad7fe-428d-49ef-b62f-b28f129fd2f8', id FROM tag WHERE name = '라이프스타일' LIMIT 1;

-- 질문: 야근 수당 vs 칼퇴
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, created_at, updated_at, status) VALUES ('41c968dc-5fcc-4e80-bb62-617fa387e230', '야근 수당 vs 칼퇴', '야근 수당', '칼퇴근', 'public', NULL, NULL, '2025-11-22 13:33:54', '2025-11-22 13:33:54', 1);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '41c968dc-5fcc-4e80-bb62-617fa387e230', id FROM tag WHERE name = '직장생활' LIMIT 1;
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '41c968dc-5fcc-4e80-bb62-617fa387e230', id FROM tag WHERE name = '돈' LIMIT 1;

-- 질문: 직장 위치
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, created_at, updated_at, status) VALUES ('909fc58f-d102-450f-b920-4124c7c808bc', '직장 위치', '집 근처', '좋은 회사면 먼 곳도 OK', 'public', NULL, NULL, '2025-11-22 13:33:54', '2025-11-22 13:33:54', 1);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '909fc58f-d102-450f-b920-4124c7c808bc', id FROM tag WHERE name = '직장생활' LIMIT 1;

-- 질문: 스타트업 vs 대기업
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, created_at, updated_at, status) VALUES ('dcd774a3-76e3-4b8a-980c-24d4219f8976', '스타트업 vs 대기업', '스타트업', '대기업', 'public', NULL, NULL, '2025-11-22 13:33:54', '2025-11-22 13:33:54', 1);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT 'dcd774a3-76e3-4b8a-980c-24d4219f8976', id FROM tag WHERE name = '직장생활' LIMIT 1;

-- 질문: 연차 사용
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, created_at, updated_at, status) VALUES ('af925998-7c18-454a-8679-da4cd5a1999b', '연차 사용', '아끼지 않고 쓰기', '아껴서 쓰기', 'public', NULL, NULL, '2025-11-22 13:33:54', '2025-11-22 13:33:54', 1);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT 'af925998-7c18-454a-8679-da4cd5a1999b', id FROM tag WHERE name = '직장생활' LIMIT 1;

-- 질문: 점심 메뉴 결정
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, created_at, updated_at, status) VALUES ('10952169-571e-4966-b949-7db0979a8cd2', '점심 메뉴 결정', '내가 정한다', '따라간다', 'public', NULL, NULL, '2025-11-22 13:33:54', '2025-11-22 13:33:54', 1);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '10952169-571e-4966-b949-7db0979a8cd2', id FROM tag WHERE name = '일상' LIMIT 1;
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '10952169-571e-4966-b949-7db0979a8cd2', id FROM tag WHERE name = '음식' LIMIT 1;

-- 질문: 메신저 답장
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, created_at, updated_at, status) VALUES ('bac039cc-6754-4371-99b7-84d68dd4623a', '메신저 답장', '바로 답장', '생각하고 답장', 'public', NULL, NULL, '2025-11-22 13:33:54', '2025-11-22 13:33:54', 1);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT 'bac039cc-6754-4371-99b7-84d68dd4623a', id FROM tag WHERE name = '일상' LIMIT 1;
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT 'bac039cc-6754-4371-99b7-84d68dd4623a', id FROM tag WHERE name = '관계' LIMIT 1;

-- 질문: 일정 관리
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, created_at, updated_at, status) VALUES ('ca0a6963-a54c-485f-a13b-87bdad557845', '일정 관리', '디지털 (앱)', '아날로그 (노트)', 'public', NULL, NULL, '2025-11-22 13:33:54', '2025-11-22 13:33:54', 1);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT 'ca0a6963-a54c-485f-a13b-87bdad557845', id FROM tag WHERE name = '습관' LIMIT 1;
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT 'ca0a6963-a54c-485f-a13b-87bdad557845', id FROM tag WHERE name = '자기계발' LIMIT 1;

-- 질문: 집 정리
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, created_at, updated_at, status) VALUES ('7a5bc1ad-770f-49ff-b6b8-53575f19f30f', '집 정리', '미니멀리즘', '맥시멀리즘', 'public', NULL, NULL, '2025-11-22 13:33:54', '2025-11-22 13:33:54', 1);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '7a5bc1ad-770f-49ff-b6b8-53575f19f30f', id FROM tag WHERE name = '라이프스타일' LIMIT 1;
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '7a5bc1ad-770f-49ff-b6b8-53575f19f30f', id FROM tag WHERE name = '습관' LIMIT 1;

-- 질문: 인테리어
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, created_at, updated_at, status) VALUES ('8e4e7182-783c-45dd-bd9e-d9862941dc14', '인테리어', '모던/심플', '빈티지/앤틱', 'public', NULL, NULL, '2025-11-22 13:33:54', '2025-11-22 13:33:54', 1);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '8e4e7182-783c-45dd-bd9e-d9862941dc14', id FROM tag WHERE name = '라이프스타일' LIMIT 1;

-- 질문: 면 vs 밥
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, created_at, updated_at, status) VALUES ('84397e10-086b-467d-9baa-95315f8b0638', '면 vs 밥', '면 요리', '밥 요리', 'public', NULL, NULL, '2025-11-22 13:33:54', '2025-11-22 13:33:54', 1);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '84397e10-086b-467d-9baa-95315f8b0638', id FROM tag WHERE name = '음식' LIMIT 1;

-- 질문: 독서 장소
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, created_at, updated_at, status) VALUES ('50c385e4-74d8-42b1-b040-6697f8b80c82', '독서 장소', '도서관/카페', '집', 'public', NULL, NULL, '2025-11-22 13:33:54', '2025-11-22 13:33:54', 1);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '50c385e4-74d8-42b1-b040-6697f8b80c82', id FROM tag WHERE name = '취미' LIMIT 1;
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '50c385e4-74d8-42b1-b040-6697f8b80c82', id FROM tag WHERE name = '일상' LIMIT 1;

-- 질문: 여름 vs 겨울
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, created_at, updated_at, status) VALUES ('599417b6-6173-434b-955a-c5da49b39962', '여름 vs 겨울', '여름', '겨울', 'public', NULL, NULL, '2025-11-22 13:33:54', '2025-11-22 13:33:54', 1);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '599417b6-6173-434b-955a-c5da49b39962', id FROM tag WHERE name = '일상' LIMIT 1;

-- 질문: 자기 전 루틴
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, created_at, updated_at, status) VALUES ('308aeb4f-d0b6-487a-bac5-e48cfe670312', '자기 전 루틴', '독서', '유튜브/넷플릭스', 'public', NULL, NULL, '2025-11-22 13:33:54', '2025-11-22 13:33:54', 1);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '308aeb4f-d0b6-487a-bac5-e48cfe670312', id FROM tag WHERE name = '일상' LIMIT 1;
INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '308aeb4f-d0b6-487a-bac5-e48cfe670312', id FROM tag WHERE name = '습관' LIMIT 1;


-- 총 20개 태그, 100개 질문 생성 완료
