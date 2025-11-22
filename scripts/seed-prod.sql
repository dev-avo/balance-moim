-- 프로덕션 DB 시딩 SQL
-- 이 파일은 scripts/seed-data.json을 기반으로 생성되었습니다
-- 실행 방법: npx wrangler d1 execute balance-moim-db-prod --remote --file=scripts/seed-prod.sql

-- 태그 20개 생성
INSERT OR IGNORE INTO tag (id, name) VALUES
('2286f3a5-054f-4357-a6ee-8fee7dda6140', '음식'),
('77d15e31-d01f-4dd5-87ef-aefa9b56a68b', '연애'),
('a7e032ee-dbb1-48bd-be20-94349e62ef25', '취미'),
('b07f1c1c-f754-42d3-86be-7f509be3cdab', '직장생활'),
('50fc1b7f-df6a-4444-82e4-96b8ecef76e4', '여행'),
('db4e6b7b-bd3d-4beb-a495-72bd187b1578', '패션'),
('e79c5ebd-4d54-4dcb-8c20-c26fa9e5dbfa', '운동'),
('eba55c66-5549-42ef-a82c-dc1dedc3b865', '영화'),
('c6d806ac-c41f-4000-9f45-ba68bfe756d3', '음악'),
('c71278df-bad1-4f55-a12a-afe79af8438c', '게임'),
('22649597-63ea-48a4-81c9-1e69e1c5fa06', 'MBTI'),
('fee6ea0e-e582-4b49-823a-f99307760d9a', '일상'),
('24e3c47a-faee-463f-be20-8db1c59a53f2', '관계'),
('c4f56ae4-6546-40a2-80ef-1a38ebf0f449', '가치관'),
('e0f41745-da80-4f77-9ea7-105aaaa32b9b', '습관'),
('59489ee9-802b-48c3-a95d-a7de1a1f75f7', '건강'),
('0b598d93-bb5b-4de2-963b-6c812b89c8ab', '돈'),
('78e50b42-d686-47ad-a0fc-2c1d8c946223', '라이프스타일'),
('855c8646-8c7a-4cda-9300-169be392a665', '자기계발'),
('6a94b41b-1317-4f10-a3b0-fc19230635a5', 'sns');

-- 질문 100개 생성
-- 질문: 더 맛있는 진라면은?
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, created_at, updated_at, status) VALUES ('f05b0b4f-dad0-46d5-b605-b5abb9c4e17f', '더 맛있는 진라면은?', '매운맛', '순한맛', 'public', NULL, NULL, '2025-11-22 13:27:43', '2025-11-22 13:27:43', 1);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) VALUES ('f05b0b4f-dad0-46d5-b605-b5abb9c4e17f', '2286f3a5-054f-4357-a6ee-8fee7dda6140');

-- 질문: 치킨은 어떻게 먹을래?
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, created_at, updated_at, status) VALUES ('f002a2b8-524a-4025-ad62-5d3c3a2f925c', '치킨은 어떻게 먹을래?', '양념치킨', '후라이드치킨', 'public', NULL, NULL, '2025-11-22 13:27:43', '2025-11-22 13:27:43', 1);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) VALUES ('f002a2b8-524a-4025-ad62-5d3c3a2f925c', '2286f3a5-054f-4357-a6ee-8fee7dda6140');

-- 질문: 피자 선택의 기로
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, created_at, updated_at, status) VALUES ('19a4ab06-f4e9-4af2-ade1-6e8b069ce7da', '피자 선택의 기로', '페퍼로니 피자', '하와이안 피자', 'public', NULL, NULL, '2025-11-22 13:27:43', '2025-11-22 13:27:43', 1);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) VALUES ('19a4ab06-f4e9-4af2-ade1-6e8b069ce7da', '2286f3a5-054f-4357-a6ee-8fee7dda6140');

-- 질문: 커피 vs 녹차
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, created_at, updated_at, status) VALUES ('edc04da9-0f2f-41ed-aa99-54130f1e2376', '커피 vs 녹차', '커피', '녹차', 'public', NULL, NULL, '2025-11-22 13:27:43', '2025-11-22 13:27:43', 1);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) VALUES ('edc04da9-0f2f-41ed-aa99-54130f1e2376', '2286f3a5-054f-4357-a6ee-8fee7dda6140');
INSERT OR IGNORE INTO question_tag (question_id, tag_id) VALUES ('edc04da9-0f2f-41ed-aa99-54130f1e2376', 'fee6ea0e-e582-4b49-823a-f99307760d9a');

-- 질문: 아침 식사로 뭐가 나아?
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, created_at, updated_at, status) VALUES ('c54e03ef-c749-4253-a3a0-c999d53e278d', '아침 식사로 뭐가 나아?', '밥', '빵', 'public', NULL, NULL, '2025-11-22 13:27:43', '2025-11-22 13:27:43', 1);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) VALUES ('c54e03ef-c749-4253-a3a0-c999d53e278d', '2286f3a5-054f-4357-a6ee-8fee7dda6140');
INSERT OR IGNORE INTO question_tag (question_id, tag_id) VALUES ('c54e03ef-c749-4253-a3a0-c999d53e278d', 'fee6ea0e-e582-4b49-823a-f99307760d9a');

-- 질문: 라면 끓일 때
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, created_at, updated_at, status) VALUES ('4106dba9-4ae8-4dc2-9c26-e8d7265e69d0', '라면 끓일 때', '계란 넣기', '치즈 넣기', 'public', NULL, NULL, '2025-11-22 13:27:43', '2025-11-22 13:27:43', 1);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) VALUES ('4106dba9-4ae8-4dc2-9c26-e8d7265e69d0', '2286f3a5-054f-4357-a6ee-8fee7dda6140');

-- 질문: 여름 디저트
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, created_at, updated_at, status) VALUES ('458b822c-5951-4bcb-81ee-985b563b4c8c', '여름 디저트', '팥빙수', '아이스크림', 'public', NULL, NULL, '2025-11-22 13:27:43', '2025-11-22 13:27:43', 1);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) VALUES ('458b822c-5951-4bcb-81ee-985b563b4c8c', '2286f3a5-054f-4357-a6ee-8fee7dda6140');

-- 질문: 술자리에서
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, created_at, updated_at, status) VALUES ('eac56282-6d2c-4799-83bb-875d39b8d497', '술자리에서', '소주', '맥주', 'public', NULL, NULL, '2025-11-22 13:27:43', '2025-11-22 13:27:43', 1);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) VALUES ('eac56282-6d2c-4799-83bb-875d39b8d497', '2286f3a5-054f-4357-a6ee-8fee7dda6140');
INSERT OR IGNORE INTO question_tag (question_id, tag_id) VALUES ('eac56282-6d2c-4799-83bb-875d39b8d497', 'fee6ea0e-e582-4b49-823a-f99307760d9a');

-- 질문: 더 먹고 싶은 한식
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, created_at, updated_at, status) VALUES ('823e15dd-5422-4988-8c9b-8adb8495fd84', '더 먹고 싶은 한식', '김치찌개', '된장찌개', 'public', NULL, NULL, '2025-11-22 13:27:43', '2025-11-22 13:27:43', 1);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) VALUES ('823e15dd-5422-4988-8c9b-8adb8495fd84', '2286f3a5-054f-4357-a6ee-8fee7dda6140');

-- 질문: 분식 메뉴 선택
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, created_at, updated_at, status) VALUES ('abdfddb0-2684-4c7a-8249-075470cfeb1f', '분식 메뉴 선택', '떡볶이', '튀김', 'public', NULL, NULL, '2025-11-22 13:27:43', '2025-11-22 13:27:43', 1);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) VALUES ('abdfddb0-2684-4c7a-8249-075470cfeb1f', '2286f3a5-054f-4357-a6ee-8fee7dda6140');

-- 질문: 첫 데이트 장소는?
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, created_at, updated_at, status) VALUES ('c3177b63-4588-455a-a389-a0bb0f55681c', '첫 데이트 장소는?', '영화관', '카페', 'public', NULL, NULL, '2025-11-22 13:27:43', '2025-11-22 13:27:43', 1);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) VALUES ('c3177b63-4588-455a-a389-a0bb0f55681c', '77d15e31-d01f-4dd5-87ef-aefa9b56a68b');

-- 질문: 연애 스타일
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, created_at, updated_at, status) VALUES ('e36a3c07-1c79-40ec-be8a-4ed53c9d6169', '연애 스타일', '연락 자주하기', '적당한 거리두기', 'public', NULL, NULL, '2025-11-22 13:27:43', '2025-11-22 13:27:43', 1);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) VALUES ('e36a3c07-1c79-40ec-be8a-4ed53c9d6169', '77d15e31-d01f-4dd5-87ef-aefa9b56a68b');
INSERT OR IGNORE INTO question_tag (question_id, tag_id) VALUES ('e36a3c07-1c79-40ec-be8a-4ed53c9d6169', '24e3c47a-faee-463f-be20-8db1c59a53f2');

-- 질문: 선물로 받고 싶은 건?
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, created_at, updated_at, status) VALUES ('8f68c7c7-53f2-46be-b549-f93b1ab009c5', '선물로 받고 싶은 건?', '손편지', '비싼 선물', 'public', NULL, NULL, '2025-11-22 13:27:43', '2025-11-22 13:27:43', 1);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) VALUES ('8f68c7c7-53f2-46be-b549-f93b1ab009c5', '77d15e31-d01f-4dd5-87ef-aefa9b56a68b');
INSERT OR IGNORE INTO question_tag (question_id, tag_id) VALUES ('8f68c7c7-53f2-46be-b549-f93b1ab009c5', '24e3c47a-faee-463f-be20-8db1c59a53f2');

-- 질문: 썸 단계에서
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, created_at, updated_at, status) VALUES ('a2057c6d-05ba-4fe0-95ad-805f13277c17', '썸 단계에서', '직접 고백하기', '상대방 고백 기다리기', 'public', NULL, NULL, '2025-11-22 13:27:43', '2025-11-22 13:27:43', 1);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) VALUES ('a2057c6d-05ba-4fe0-95ad-805f13277c17', '77d15e31-d01f-4dd5-87ef-aefa9b56a68b');

-- 질문: 이상형
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, created_at, updated_at, status) VALUES ('06003285-661e-4ddd-ba29-bdc0e43659fd', '이상형', '귀여운 타입', '섹시한 타입', 'public', NULL, NULL, '2025-11-22 13:27:43', '2025-11-22 13:27:43', 1);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) VALUES ('06003285-661e-4ddd-ba29-bdc0e43659fd', '77d15e31-d01f-4dd5-87ef-aefa9b56a68b');

-- 질문: 여행 스타일
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, created_at, updated_at, status) VALUES ('ef3bf5f9-145a-4e41-9c61-305ede737223', '여행 스타일', '계획적인 여행', '즉흥적인 여행', 'public', NULL, NULL, '2025-11-22 13:27:43', '2025-11-22 13:27:43', 1);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) VALUES ('ef3bf5f9-145a-4e41-9c61-305ede737223', '50fc1b7f-df6a-4444-82e4-96b8ecef76e4');
INSERT OR IGNORE INTO question_tag (question_id, tag_id) VALUES ('ef3bf5f9-145a-4e41-9c61-305ede737223', '78e50b42-d686-47ad-a0fc-2c1d8c946223');

-- 질문: 해외여행 vs 국내여행
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, created_at, updated_at, status) VALUES ('dddccb7c-768b-4f58-95ec-1f0e12e05d6d', '해외여행 vs 국내여행', '해외여행', '국내여행', 'public', NULL, NULL, '2025-11-22 13:27:43', '2025-11-22 13:27:43', 1);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) VALUES ('dddccb7c-768b-4f58-95ec-1f0e12e05d6d', '50fc1b7f-df6a-4444-82e4-96b8ecef76e4');

-- 질문: 여행지 숙소
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, created_at, updated_at, status) VALUES ('bf64115d-f200-4432-91a8-f64f47efd2fb', '여행지 숙소', '호텔', '게스트하우스', 'public', NULL, NULL, '2025-11-22 13:27:43', '2025-11-22 13:27:43', 1);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) VALUES ('bf64115d-f200-4432-91a8-f64f47efd2fb', '50fc1b7f-df6a-4444-82e4-96b8ecef76e4');

-- 질문: 여행 중 식사
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, created_at, updated_at, status) VALUES ('91fc9ddd-dad1-40c3-a937-6dda2f74ac91', '여행 중 식사', '현지 맛집 탐방', '편의점 간편식', 'public', NULL, NULL, '2025-11-22 13:27:43', '2025-11-22 13:27:43', 1);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) VALUES ('91fc9ddd-dad1-40c3-a937-6dda2f74ac91', '50fc1b7f-df6a-4444-82e4-96b8ecef76e4');
INSERT OR IGNORE INTO question_tag (question_id, tag_id) VALUES ('91fc9ddd-dad1-40c3-a937-6dda2f74ac91', '2286f3a5-054f-4357-a6ee-8fee7dda6140');

-- 질문: 휴가 때 하고 싶은 일
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, created_at, updated_at, status) VALUES ('8fdd2312-d3a2-45e8-b1ef-5a5b2ce29cdc', '휴가 때 하고 싶은 일', '여행 가기', '집에서 쉬기', 'public', NULL, NULL, '2025-11-22 13:27:43', '2025-11-22 13:27:43', 1);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) VALUES ('8fdd2312-d3a2-45e8-b1ef-5a5b2ce29cdc', '50fc1b7f-df6a-4444-82e4-96b8ecef76e4');
INSERT OR IGNORE INTO question_tag (question_id, tag_id) VALUES ('8fdd2312-d3a2-45e8-b1ef-5a5b2ce29cdc', 'fee6ea0e-e582-4b49-823a-f99307760d9a');

-- 질문: 출근 시간
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, created_at, updated_at, status) VALUES ('6ee4e9ec-ca2c-4f85-ab3c-b19c94405ddb', '출근 시간', '일찍 출근, 일찍 퇴근', '늦게 출근, 늦게 퇴근', 'public', NULL, NULL, '2025-11-22 13:27:43', '2025-11-22 13:27:43', 1);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) VALUES ('6ee4e9ec-ca2c-4f85-ab3c-b19c94405ddb', 'b07f1c1c-f754-42d3-86be-7f509be3cdab');

-- 질문: 점심시간
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, created_at, updated_at, status) VALUES ('c936ba64-aea8-4ab3-83b7-11bfcfdd6f88', '점심시간', '동료들과 함께', '혼자 먹기', 'public', NULL, NULL, '2025-11-22 13:27:43', '2025-11-22 13:27:43', 1);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) VALUES ('c936ba64-aea8-4ab3-83b7-11bfcfdd6f88', 'b07f1c1c-f754-42d3-86be-7f509be3cdab');
INSERT OR IGNORE INTO question_tag (question_id, tag_id) VALUES ('c936ba64-aea8-4ab3-83b7-11bfcfdd6f88', 'fee6ea0e-e582-4b49-823a-f99307760d9a');

-- 질문: 회식 vs 회식비 n빵
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, created_at, updated_at, status) VALUES ('160ae8a2-57cf-4a39-89b5-754f88aa0956', '회식 vs 회식비 n빵', '회식 참여', '회식비 받고 집에 가기', 'public', NULL, NULL, '2025-11-22 13:27:43', '2025-11-22 13:27:43', 1);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) VALUES ('160ae8a2-57cf-4a39-89b5-754f88aa0956', 'b07f1c1c-f754-42d3-86be-7f509be3cdab');

-- 질문: 업무 스타일
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, created_at, updated_at, status) VALUES ('7f0403cb-2754-44d5-b35c-101cc0cc7870', '업무 스타일', '미리미리 끝내기', '데드라인에 맞춰서', 'public', NULL, NULL, '2025-11-22 13:27:43', '2025-11-22 13:27:43', 1);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) VALUES ('7f0403cb-2754-44d5-b35c-101cc0cc7870', 'b07f1c1c-f754-42d3-86be-7f509be3cdab');
INSERT OR IGNORE INTO question_tag (question_id, tag_id) VALUES ('7f0403cb-2754-44d5-b35c-101cc0cc7870', 'e0f41745-da80-4f77-9ea7-105aaaa32b9b');

-- 질문: 이직 vs 현직 유지
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, created_at, updated_at, status) VALUES ('2d55a13a-2c72-4f53-b84c-02705e7ec2c6', '이직 vs 현직 유지', '좋은 기회면 이직', '현직에서 성장', 'public', NULL, NULL, '2025-11-22 13:27:43', '2025-11-22 13:27:43', 1);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) VALUES ('2d55a13a-2c72-4f53-b84c-02705e7ec2c6', 'b07f1c1c-f754-42d3-86be-7f509be3cdab');

-- 질문: 주말 취미
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, created_at, updated_at, status) VALUES ('6f284614-019c-4a90-a9b4-d8e956c8a3fb', '주말 취미', '실내 활동', '야외 활동', 'public', NULL, NULL, '2025-11-22 13:27:43', '2025-11-22 13:27:43', 1);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) VALUES ('6f284614-019c-4a90-a9b4-d8e956c8a3fb', 'a7e032ee-dbb1-48bd-be20-94349e62ef25');
INSERT OR IGNORE INTO question_tag (question_id, tag_id) VALUES ('6f284614-019c-4a90-a9b4-d8e956c8a3fb', 'fee6ea0e-e582-4b49-823a-f99307760d9a');

-- 질문: 독서 vs 영화 감상
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, created_at, updated_at, status) VALUES ('12df30f5-80c6-483a-929b-846dae42141d', '독서 vs 영화 감상', '책 읽기', '영화 보기', 'public', NULL, NULL, '2025-11-22 13:27:43', '2025-11-22 13:27:43', 1);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) VALUES ('12df30f5-80c6-483a-929b-846dae42141d', 'a7e032ee-dbb1-48bd-be20-94349e62ef25');

-- 질문: 운동은
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, created_at, updated_at, status) VALUES ('0485537b-00f0-40c1-8d81-8754512fcb3c', '운동은', '헬스장', '홈트레이닝', 'public', NULL, NULL, '2025-11-22 13:27:43', '2025-11-22 13:27:43', 1);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) VALUES ('0485537b-00f0-40c1-8d81-8754512fcb3c', 'e79c5ebd-4d54-4dcb-8c20-c26fa9e5dbfa');
INSERT OR IGNORE INTO question_tag (question_id, tag_id) VALUES ('0485537b-00f0-40c1-8d81-8754512fcb3c', '59489ee9-802b-48c3-a95d-a7de1a1f75f7');

-- 질문: 음악 듣는 방법
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, created_at, updated_at, status) VALUES ('34eefa08-4a2c-4211-abdd-ac9003235655', '음악 듣는 방법', '멜론, 지니 등 스트리밍', '유튜브', 'public', NULL, NULL, '2025-11-22 13:27:43', '2025-11-22 13:27:43', 1);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) VALUES ('34eefa08-4a2c-4211-abdd-ac9003235655', 'c6d806ac-c41f-4000-9f45-ba68bfe756d3');
INSERT OR IGNORE INTO question_tag (question_id, tag_id) VALUES ('34eefa08-4a2c-4211-abdd-ac9003235655', 'a7e032ee-dbb1-48bd-be20-94349e62ef25');

-- 질문: 게임 장르
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, created_at, updated_at, status) VALUES ('8f5904a9-d28f-43e1-9220-9ac49b8e9ed8', '게임 장르', 'RPG, 어드벤처', 'FPS, AOS', 'public', NULL, NULL, '2025-11-22 13:27:43', '2025-11-22 13:27:43', 1);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) VALUES ('8f5904a9-d28f-43e1-9220-9ac49b8e9ed8', 'c71278df-bad1-4f55-a12a-afe79af8438c');
INSERT OR IGNORE INTO question_tag (question_id, tag_id) VALUES ('8f5904a9-d28f-43e1-9220-9ac49b8e9ed8', 'a7e032ee-dbb1-48bd-be20-94349e62ef25');

-- 질문: MBTI 믿는 편?
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, created_at, updated_at, status) VALUES ('b8316490-8aae-41d0-95fc-9d4a9e279e7a', 'MBTI 믿는 편?', '믿는다', '안 믿는다', 'public', NULL, NULL, '2025-11-22 13:27:43', '2025-11-22 13:27:43', 1);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) VALUES ('b8316490-8aae-41d0-95fc-9d4a9e279e7a', '22649597-63ea-48a4-81c9-1e69e1c5fa06');
INSERT OR IGNORE INTO question_tag (question_id, tag_id) VALUES ('b8316490-8aae-41d0-95fc-9d4a9e279e7a', 'c4f56ae4-6546-40a2-80ef-1a38ebf0f449');

-- 질문: 외향적 vs 내향적
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, created_at, updated_at, status) VALUES ('e20f828d-5d02-4095-abbc-adbec40ae2c4', '외향적 vs 내향적', 'E (외향형)', 'I (내향형)', 'public', NULL, NULL, '2025-11-22 13:27:43', '2025-11-22 13:27:43', 1);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) VALUES ('e20f828d-5d02-4095-abbc-adbec40ae2c4', '22649597-63ea-48a4-81c9-1e69e1c5fa06');
INSERT OR IGNORE INTO question_tag (question_id, tag_id) VALUES ('e20f828d-5d02-4095-abbc-adbec40ae2c4', 'fee6ea0e-e582-4b49-823a-f99307760d9a');

-- 질문: 계획형 vs 즉흥형
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, created_at, updated_at, status) VALUES ('da2fbfb7-b7b6-4c5b-9b36-4e49982f1372', '계획형 vs 즉흥형', 'J (계획형)', 'P (즉흥형)', 'public', NULL, NULL, '2025-11-22 13:27:43', '2025-11-22 13:27:43', 1);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) VALUES ('da2fbfb7-b7b6-4c5b-9b36-4e49982f1372', '22649597-63ea-48a4-81c9-1e69e1c5fa06');
INSERT OR IGNORE INTO question_tag (question_id, tag_id) VALUES ('da2fbfb7-b7b6-4c5b-9b36-4e49982f1372', 'e0f41745-da80-4f77-9ea7-105aaaa32b9b');

-- 질문: 감정형 vs 사고형
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, created_at, updated_at, status) VALUES ('d9869d23-17b2-45f0-912a-bd9be21e1897', '감정형 vs 사고형', 'F (감정형)', 'T (사고형)', 'public', NULL, NULL, '2025-11-22 13:27:43', '2025-11-22 13:27:43', 1);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) VALUES ('d9869d23-17b2-45f0-912a-bd9be21e1897', '22649597-63ea-48a4-81c9-1e69e1c5fa06');

-- 질문: 패션 스타일
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, created_at, updated_at, status) VALUES ('45cbef41-e310-474f-a253-9e78e6a7c8ae', '패션 스타일', '편한 옷', '멋진 옷', 'public', NULL, NULL, '2025-11-22 13:27:43', '2025-11-22 13:27:43', 1);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) VALUES ('45cbef41-e310-474f-a253-9e78e6a7c8ae', 'db4e6b7b-bd3d-4beb-a495-72bd187b1578');
INSERT OR IGNORE INTO question_tag (question_id, tag_id) VALUES ('45cbef41-e310-474f-a253-9e78e6a7c8ae', '78e50b42-d686-47ad-a0fc-2c1d8c946223');

-- 질문: 신발 선택
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, created_at, updated_at, status) VALUES ('fcb47400-922d-4340-b634-f5b7e09bf7c2', '신발 선택', '운동화', '구두/힐', 'public', NULL, NULL, '2025-11-22 13:27:43', '2025-11-22 13:27:43', 1);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) VALUES ('fcb47400-922d-4340-b634-f5b7e09bf7c2', 'db4e6b7b-bd3d-4beb-a495-72bd187b1578');

-- 질문: 옷 쇼핑
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, created_at, updated_at, status) VALUES ('8c2e6048-9858-491f-ae89-3c2552aabf0a', '옷 쇼핑', '온라인', '오프라인', 'public', NULL, NULL, '2025-11-22 13:27:43', '2025-11-22 13:27:43', 1);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) VALUES ('8c2e6048-9858-491f-ae89-3c2552aabf0a', 'db4e6b7b-bd3d-4beb-a495-72bd187b1578');
INSERT OR IGNORE INTO question_tag (question_id, tag_id) VALUES ('8c2e6048-9858-491f-ae89-3c2552aabf0a', 'fee6ea0e-e582-4b49-823a-f99307760d9a');

-- 질문: 악세서리
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, created_at, updated_at, status) VALUES ('851cf25f-4e73-4b67-bc6f-0e7347832ff2', '악세서리', '착용', '미착용', 'public', NULL, NULL, '2025-11-22 13:27:43', '2025-11-22 13:27:43', 1);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) VALUES ('851cf25f-4e73-4b67-bc6f-0e7347832ff2', 'db4e6b7b-bd3d-4beb-a495-72bd187b1578');

-- 질문: 아침형 vs 저녁형 인간
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, created_at, updated_at, status) VALUES ('0a4bcd83-f796-49f7-9369-2a4ba828e729', '아침형 vs 저녁형 인간', '아침형', '저녁형', 'public', NULL, NULL, '2025-11-22 13:27:43', '2025-11-22 13:27:43', 1);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) VALUES ('0a4bcd83-f796-49f7-9369-2a4ba828e729', 'fee6ea0e-e582-4b49-823a-f99307760d9a');
INSERT OR IGNORE INTO question_tag (question_id, tag_id) VALUES ('0a4bcd83-f796-49f7-9369-2a4ba828e729', 'e0f41745-da80-4f77-9ea7-105aaaa32b9b');

-- 질문: 샤워 시간
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, created_at, updated_at, status) VALUES ('be2afb7d-e65f-4510-89cb-c08efb0db1ac', '샤워 시간', '아침 샤워', '저녁 샤워', 'public', NULL, NULL, '2025-11-22 13:27:43', '2025-11-22 13:27:43', 1);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) VALUES ('be2afb7d-e65f-4510-89cb-c08efb0db1ac', 'fee6ea0e-e582-4b49-823a-f99307760d9a');
INSERT OR IGNORE INTO question_tag (question_id, tag_id) VALUES ('be2afb7d-e65f-4510-89cb-c08efb0db1ac', 'e0f41745-da80-4f77-9ea7-105aaaa32b9b');

-- 질문: 장 보는 방법
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, created_at, updated_at, status) VALUES ('be73960f-36f1-4441-9240-c8f76c59ecb9', '장 보는 방법', '마트에서 직접', '온라인 배송', 'public', NULL, NULL, '2025-11-22 13:27:43', '2025-11-22 13:27:43', 1);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) VALUES ('be73960f-36f1-4441-9240-c8f76c59ecb9', 'fee6ea0e-e582-4b49-823a-f99307760d9a');
INSERT OR IGNORE INTO question_tag (question_id, tag_id) VALUES ('be73960f-36f1-4441-9240-c8f76c59ecb9', '78e50b42-d686-47ad-a0fc-2c1d8c946223');

-- 질문: 청소는
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, created_at, updated_at, status) VALUES ('c099d2de-6c18-459f-a8da-1f10305b2284', '청소는', '매일 조금씩', '주말에 한번에', 'public', NULL, NULL, '2025-11-22 13:27:43', '2025-11-22 13:27:43', 1);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) VALUES ('c099d2de-6c18-459f-a8da-1f10305b2284', 'fee6ea0e-e582-4b49-823a-f99307760d9a');
INSERT OR IGNORE INTO question_tag (question_id, tag_id) VALUES ('c099d2de-6c18-459f-a8da-1f10305b2284', 'e0f41745-da80-4f77-9ea7-105aaaa32b9b');

-- 질문: 휴대폰 충전
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, created_at, updated_at, status) VALUES ('25663144-609b-4f94-8e69-83d0efce593c', '휴대폰 충전', '밤에 완충', '수시로 충전', 'public', NULL, NULL, '2025-11-22 13:27:43', '2025-11-22 13:27:43', 1);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) VALUES ('25663144-609b-4f94-8e69-83d0efce593c', 'fee6ea0e-e582-4b49-823a-f99307760d9a');
INSERT OR IGNORE INTO question_tag (question_id, tag_id) VALUES ('25663144-609b-4f94-8e69-83d0efce593c', 'e0f41745-da80-4f77-9ea7-105aaaa32b9b');

-- 질문: SNS 사용
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, created_at, updated_at, status) VALUES ('87c6112f-ca60-46f6-8a0e-503d4f0a8839', 'SNS 사용', '자주 올린다', '거의 안 올린다', 'public', NULL, NULL, '2025-11-22 13:27:43', '2025-11-22 13:27:43', 1);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) VALUES ('87c6112f-ca60-46f6-8a0e-503d4f0a8839', '6a94b41b-1317-4f10-a3b0-fc19230635a5');
INSERT OR IGNORE INTO question_tag (question_id, tag_id) VALUES ('87c6112f-ca60-46f6-8a0e-503d4f0a8839', 'fee6ea0e-e582-4b49-823a-f99307760d9a');

-- 질문: 인스타그램 계정
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, created_at, updated_at, status) VALUES ('df838876-22a3-424a-bfac-f3b0eec54e75', '인스타그램 계정', '공개 계정', '비공개 계정', 'public', NULL, NULL, '2025-11-22 13:27:43', '2025-11-22 13:27:43', 1);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) VALUES ('df838876-22a3-424a-bfac-f3b0eec54e75', '6a94b41b-1317-4f10-a3b0-fc19230635a5');

-- 질문: 단톡방 알림
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, created_at, updated_at, status) VALUES ('bf2c2d23-24ff-494a-a1cc-201dfd0ddeb8', '단톡방 알림', '바로바로 확인', '모아서 확인', 'public', NULL, NULL, '2025-11-22 13:27:43', '2025-11-22 13:27:43', 1);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) VALUES ('bf2c2d23-24ff-494a-a1cc-201dfd0ddeb8', 'fee6ea0e-e582-4b49-823a-f99307760d9a');
INSERT OR IGNORE INTO question_tag (question_id, tag_id) VALUES ('bf2c2d23-24ff-494a-a1cc-201dfd0ddeb8', 'e0f41745-da80-4f77-9ea7-105aaaa32b9b');

-- 질문: 전화 vs 문자
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, created_at, updated_at, status) VALUES ('9f36c8a4-d5e6-43ac-afe1-ba19a42b271f', '전화 vs 문자', '전화 선호', '문자 선호', 'public', NULL, NULL, '2025-11-22 13:27:43', '2025-11-22 13:27:43', 1);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) VALUES ('9f36c8a4-d5e6-43ac-afe1-ba19a42b271f', 'fee6ea0e-e582-4b49-823a-f99307760d9a');
INSERT OR IGNORE INTO question_tag (question_id, tag_id) VALUES ('9f36c8a4-d5e6-43ac-afe1-ba19a42b271f', '24e3c47a-faee-463f-be20-8db1c59a53f2');

-- 질문: 친구 만나는 빈도
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, created_at, updated_at, status) VALUES ('8d74c3c5-4c03-46a1-a026-d774f6bd937b', '친구 만나는 빈도', '자주 만나기', '가끔 만나기', 'public', NULL, NULL, '2025-11-22 13:27:43', '2025-11-22 13:27:43', 1);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) VALUES ('8d74c3c5-4c03-46a1-a026-d774f6bd937b', '24e3c47a-faee-463f-be20-8db1c59a53f2');
INSERT OR IGNORE INTO question_tag (question_id, tag_id) VALUES ('8d74c3c5-4c03-46a1-a026-d774f6bd937b', 'fee6ea0e-e582-4b49-823a-f99307760d9a');

-- 질문: 새로운 사람 만나기
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, created_at, updated_at, status) VALUES ('be72de91-8d27-481c-957c-0d65267d31f4', '새로운 사람 만나기', '좋아함', '부담스러움', 'public', NULL, NULL, '2025-11-22 13:27:43', '2025-11-22 13:27:43', 1);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) VALUES ('be72de91-8d27-481c-957c-0d65267d31f4', '24e3c47a-faee-463f-be20-8db1c59a53f2');

-- 질문: 논쟁이 생기면
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, created_at, updated_at, status) VALUES ('6531a472-208b-44ea-9898-e101911d6571', '논쟁이 생기면', '끝까지 토론', '적당히 넘어가기', 'public', NULL, NULL, '2025-11-22 13:27:43', '2025-11-22 13:27:43', 1);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) VALUES ('6531a472-208b-44ea-9898-e101911d6571', '24e3c47a-faee-463f-be20-8db1c59a53f2');
INSERT OR IGNORE INTO question_tag (question_id, tag_id) VALUES ('6531a472-208b-44ea-9898-e101911d6571', 'c4f56ae4-6546-40a2-80ef-1a38ebf0f449');

-- 질문: 고민 상담
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, created_at, updated_at, status) VALUES ('6a13f758-563b-4aca-8afe-e9dc0160dfa7', '고민 상담', '해결책 원함', '공감만 해주면 됨', 'public', NULL, NULL, '2025-11-22 13:27:43', '2025-11-22 13:27:43', 1);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) VALUES ('6a13f758-563b-4aca-8afe-e9dc0160dfa7', '24e3c47a-faee-463f-be20-8db1c59a53f2');

-- 질문: 돈 vs 시간
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, created_at, updated_at, status) VALUES ('67b3ba2e-5052-4126-a4e1-3012901ceb7f', '돈 vs 시간', '돈이 더 중요', '시간이 더 중요', 'public', NULL, NULL, '2025-11-22 13:27:43', '2025-11-22 13:27:43', 1);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) VALUES ('67b3ba2e-5052-4126-a4e1-3012901ceb7f', 'c4f56ae4-6546-40a2-80ef-1a38ebf0f449');
INSERT OR IGNORE INTO question_tag (question_id, tag_id) VALUES ('67b3ba2e-5052-4126-a4e1-3012901ceb7f', '0b598d93-bb5b-4de2-963b-6c812b89c8ab');

-- 질문: 복권 당첨 1억
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, created_at, updated_at, status) VALUES ('fec31bf0-1a4f-45ef-803f-7297489265e3', '복권 당첨 1억', '투자하기', '저축하기', 'public', NULL, NULL, '2025-11-22 13:27:43', '2025-11-22 13:27:43', 1);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) VALUES ('fec31bf0-1a4f-45ef-803f-7297489265e3', '0b598d93-bb5b-4de2-963b-6c812b89c8ab');
INSERT OR IGNORE INTO question_tag (question_id, tag_id) VALUES ('fec31bf0-1a4f-45ef-803f-7297489265e3', 'c4f56ae4-6546-40a2-80ef-1a38ebf0f449');

-- 질문: 소비 패턴
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, created_at, updated_at, status) VALUES ('320025e8-28de-410a-b52b-4443c17718a4', '소비 패턴', '플렉스 (과시적 소비)', '짠테크 (알뜰 소비)', 'public', NULL, NULL, '2025-11-22 13:27:43', '2025-11-22 13:27:43', 1);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) VALUES ('320025e8-28de-410a-b52b-4443c17718a4', '0b598d93-bb5b-4de2-963b-6c812b89c8ab');
INSERT OR IGNORE INTO question_tag (question_id, tag_id) VALUES ('320025e8-28de-410a-b52b-4443c17718a4', '78e50b42-d686-47ad-a0fc-2c1d8c946223');

-- 질문: 카페 음료
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, created_at, updated_at, status) VALUES ('d0606a8b-60fb-4126-a9e3-6c53e3d0d1a5', '카페 음료', '비싸도 스타벅스', '저렴한 카페', 'public', NULL, NULL, '2025-11-22 13:27:43', '2025-11-22 13:27:43', 1);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) VALUES ('d0606a8b-60fb-4126-a9e3-6c53e3d0d1a5', '0b598d93-bb5b-4de2-963b-6c812b89c8ab');
INSERT OR IGNORE INTO question_tag (question_id, tag_id) VALUES ('d0606a8b-60fb-4126-a9e3-6c53e3d0d1a5', 'fee6ea0e-e582-4b49-823a-f99307760d9a');

-- 질문: 건강 관리
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, created_at, updated_at, status) VALUES ('f6ac7067-5552-4620-8e15-d9c410cf8b48', '건강 관리', '꾸준히 관리', '아프면 관리', 'public', NULL, NULL, '2025-11-22 13:27:43', '2025-11-22 13:27:43', 1);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) VALUES ('f6ac7067-5552-4620-8e15-d9c410cf8b48', '59489ee9-802b-48c3-a95d-a7de1a1f75f7');
INSERT OR IGNORE INTO question_tag (question_id, tag_id) VALUES ('f6ac7067-5552-4620-8e15-d9c410cf8b48', 'e0f41745-da80-4f77-9ea7-105aaaa32b9b');

-- 질문: 영양제
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, created_at, updated_at, status) VALUES ('16725744-7de1-4931-b112-ff76529962b9', '영양제', '챙겨 먹는다', '안 먹는다', 'public', NULL, NULL, '2025-11-22 13:27:43', '2025-11-22 13:27:43', 1);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) VALUES ('16725744-7de1-4931-b112-ff76529962b9', '59489ee9-802b-48c3-a95d-a7de1a1f75f7');

-- 질문: 스트레스 해소
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, created_at, updated_at, status) VALUES ('0c1d07c1-eb48-47f3-b478-fa0872ec9755', '스트레스 해소', '운동', '먹방', 'public', NULL, NULL, '2025-11-22 13:27:43', '2025-11-22 13:27:43', 1);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) VALUES ('0c1d07c1-eb48-47f3-b478-fa0872ec9755', '59489ee9-802b-48c3-a95d-a7de1a1f75f7');
INSERT OR IGNORE INTO question_tag (question_id, tag_id) VALUES ('0c1d07c1-eb48-47f3-b478-fa0872ec9755', 'fee6ea0e-e582-4b49-823a-f99307760d9a');

-- 질문: 잠
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, created_at, updated_at, status) VALUES ('0d188acc-0442-4a50-a093-3e52d3945e7a', '잠', '질보다 양', '양보다 질', 'public', NULL, NULL, '2025-11-22 13:27:43', '2025-11-22 13:27:43', 1);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) VALUES ('0d188acc-0442-4a50-a093-3e52d3945e7a', '59489ee9-802b-48c3-a95d-a7de1a1f75f7');
INSERT OR IGNORE INTO question_tag (question_id, tag_id) VALUES ('0d188acc-0442-4a50-a093-3e52d3945e7a', 'e0f41745-da80-4f77-9ea7-105aaaa32b9b');

-- 질문: 공부 vs 경험
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, created_at, updated_at, status) VALUES ('10b17dda-b786-4b96-b828-2e4f0488e563', '공부 vs 경험', '자격증/학위', '실무 경험', 'public', NULL, NULL, '2025-11-22 13:27:43', '2025-11-22 13:27:43', 1);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) VALUES ('10b17dda-b786-4b96-b828-2e4f0488e563', '855c8646-8c7a-4cda-9300-169be392a665');
INSERT OR IGNORE INTO question_tag (question_id, tag_id) VALUES ('10b17dda-b786-4b96-b828-2e4f0488e563', 'c4f56ae4-6546-40a2-80ef-1a38ebf0f449');

-- 질문: 책 읽는 방법
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, created_at, updated_at, status) VALUES ('548ce217-db24-4880-b4e7-3c5cb23cc3ca', '책 읽는 방법', '종이책', '전자책', 'public', NULL, NULL, '2025-11-22 13:27:43', '2025-11-22 13:27:43', 1);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) VALUES ('548ce217-db24-4880-b4e7-3c5cb23cc3ca', '855c8646-8c7a-4cda-9300-169be392a665');
INSERT OR IGNORE INTO question_tag (question_id, tag_id) VALUES ('548ce217-db24-4880-b4e7-3c5cb23cc3ca', 'a7e032ee-dbb1-48bd-be20-94349e62ef25');

-- 질문: 영어 공부
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, created_at, updated_at, status) VALUES ('fb1cdebf-484b-48d1-95b5-2d200863c063', '영어 공부', '문법/독해', '회화', 'public', NULL, NULL, '2025-11-22 13:27:43', '2025-11-22 13:27:43', 1);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) VALUES ('fb1cdebf-484b-48d1-95b5-2d200863c063', '855c8646-8c7a-4cda-9300-169be392a665');

-- 질문: 자기계발 시간
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, created_at, updated_at, status) VALUES ('a9bc5611-3974-4763-a4df-a209cfcfe532', '자기계발 시간', '아침', '저녁', 'public', NULL, NULL, '2025-11-22 13:27:43', '2025-11-22 13:27:43', 1);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) VALUES ('a9bc5611-3974-4763-a4df-a209cfcfe532', '855c8646-8c7a-4cda-9300-169be392a665');
INSERT OR IGNORE INTO question_tag (question_id, tag_id) VALUES ('a9bc5611-3974-4763-a4df-a209cfcfe532', 'e0f41745-da80-4f77-9ea7-105aaaa32b9b');

-- 질문: 영화 장르
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, created_at, updated_at, status) VALUES ('c9c56316-1897-4013-99a4-172e38aa932e', '영화 장르', '액션/스릴러', '로맨스/코미디', 'public', NULL, NULL, '2025-11-22 13:27:43', '2025-11-22 13:27:43', 1);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) VALUES ('c9c56316-1897-4013-99a4-172e38aa932e', 'eba55c66-5549-42ef-a82c-dc1dedc3b865');
INSERT OR IGNORE INTO question_tag (question_id, tag_id) VALUES ('c9c56316-1897-4013-99a4-172e38aa932e', 'a7e032ee-dbb1-48bd-be20-94349e62ef25');

-- 질문: 영화 보는 방법
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, created_at, updated_at, status) VALUES ('fe616bf0-1a29-4032-b4b3-af7fe742c478', '영화 보는 방법', '극장에서', 'OTT로 집에서', 'public', NULL, NULL, '2025-11-22 13:27:43', '2025-11-22 13:27:43', 1);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) VALUES ('fe616bf0-1a29-4032-b4b3-af7fe742c478', 'eba55c66-5549-42ef-a82c-dc1dedc3b865');
INSERT OR IGNORE INTO question_tag (question_id, tag_id) VALUES ('fe616bf0-1a29-4032-b4b3-af7fe742c478', 'fee6ea0e-e582-4b49-823a-f99307760d9a');

-- 질문: 영화 볼 때 간식
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, created_at, updated_at, status) VALUES ('023f316c-d150-4d6a-9ea3-8a999370bbbe', '영화 볼 때 간식', '팝콘', '없음', 'public', NULL, NULL, '2025-11-22 13:27:43', '2025-11-22 13:27:43', 1);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) VALUES ('023f316c-d150-4d6a-9ea3-8a999370bbbe', 'eba55c66-5549-42ef-a82c-dc1dedc3b865');
INSERT OR IGNORE INTO question_tag (question_id, tag_id) VALUES ('023f316c-d150-4d6a-9ea3-8a999370bbbe', '2286f3a5-054f-4357-a6ee-8fee7dda6140');

-- 질문: 드라마 시청
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, created_at, updated_at, status) VALUES ('ec5d4220-6c66-4b89-a5ec-24930de8ba4e', '드라마 시청', '몰아보기', '한 편씩', 'public', NULL, NULL, '2025-11-22 13:27:43', '2025-11-22 13:27:43', 1);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) VALUES ('ec5d4220-6c66-4b89-a5ec-24930de8ba4e', 'a7e032ee-dbb1-48bd-be20-94349e62ef25');
INSERT OR IGNORE INTO question_tag (question_id, tag_id) VALUES ('ec5d4220-6c66-4b89-a5ec-24930de8ba4e', 'e0f41745-da80-4f77-9ea7-105aaaa32b9b');

-- 질문: 음악 듣는 상황
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, created_at, updated_at, status) VALUES ('78fdee74-51bc-425d-8a58-1534b106e6c8', '음악 듣는 상황', '집중할 때', '쉴 때', 'public', NULL, NULL, '2025-11-22 13:27:43', '2025-11-22 13:27:43', 1);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) VALUES ('78fdee74-51bc-425d-8a58-1534b106e6c8', 'c6d806ac-c41f-4000-9f45-ba68bfe756d3');
INSERT OR IGNORE INTO question_tag (question_id, tag_id) VALUES ('78fdee74-51bc-425d-8a58-1534b106e6c8', 'fee6ea0e-e582-4b49-823a-f99307760d9a');

-- 질문: 좋아하는 음악 장르
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, created_at, updated_at, status) VALUES ('e7fea788-2f17-4bcf-b502-35825d19a514', '좋아하는 음악 장르', '발라드/인디', '힙합/EDM', 'public', NULL, NULL, '2025-11-22 13:27:43', '2025-11-22 13:27:43', 1);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) VALUES ('e7fea788-2f17-4bcf-b502-35825d19a514', 'c6d806ac-c41f-4000-9f45-ba68bfe756d3');

-- 질문: 콘서트 vs 페스티벌
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, created_at, updated_at, status) VALUES ('cfda9fb8-7f8a-40ba-aabb-8ddf83852bd9', '콘서트 vs 페스티벌', '콘서트', '페스티벌', 'public', NULL, NULL, '2025-11-22 13:27:43', '2025-11-22 13:27:43', 1);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) VALUES ('cfda9fb8-7f8a-40ba-aabb-8ddf83852bd9', 'c6d806ac-c41f-4000-9f45-ba68bfe756d3');
INSERT OR IGNORE INTO question_tag (question_id, tag_id) VALUES ('cfda9fb8-7f8a-40ba-aabb-8ddf83852bd9', 'a7e032ee-dbb1-48bd-be20-94349e62ef25');

-- 질문: 노래방에서
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, created_at, updated_at, status) VALUES ('14c85824-6117-4f22-9927-892f419d88ab', '노래방에서', '적극적으로 부르기', '듣기만', 'public', NULL, NULL, '2025-11-22 13:27:43', '2025-11-22 13:27:43', 1);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) VALUES ('14c85824-6117-4f22-9927-892f419d88ab', 'c6d806ac-c41f-4000-9f45-ba68bfe756d3');
INSERT OR IGNORE INTO question_tag (question_id, tag_id) VALUES ('14c85824-6117-4f22-9927-892f419d88ab', 'fee6ea0e-e582-4b49-823a-f99307760d9a');

-- 질문: 게임 플레이
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, created_at, updated_at, status) VALUES ('5d77a778-4608-4173-be04-1f98852f76c9', '게임 플레이', 'PC 게임', '모바일 게임', 'public', NULL, NULL, '2025-11-22 13:27:43', '2025-11-22 13:27:43', 1);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) VALUES ('5d77a778-4608-4173-be04-1f98852f76c9', 'c71278df-bad1-4f55-a12a-afe79af8438c');
INSERT OR IGNORE INTO question_tag (question_id, tag_id) VALUES ('5d77a778-4608-4173-be04-1f98852f76c9', 'a7e032ee-dbb1-48bd-be20-94349e62ef25');

-- 질문: 게임 스타일
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, created_at, updated_at, status) VALUES ('1a175bae-4d21-4158-aed6-3700d1405022', '게임 스타일', '혼자', '친구들과', 'public', NULL, NULL, '2025-11-22 13:27:43', '2025-11-22 13:27:43', 1);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) VALUES ('1a175bae-4d21-4158-aed6-3700d1405022', 'c71278df-bad1-4f55-a12a-afe79af8438c');

-- 질문: 게임 과금
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, created_at, updated_at, status) VALUES ('de16e053-7fce-4e56-8676-eee6866d9c60', '게임 과금', '한다', '안 한다', 'public', NULL, NULL, '2025-11-22 13:27:43', '2025-11-22 13:27:43', 1);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) VALUES ('de16e053-7fce-4e56-8676-eee6866d9c60', 'c71278df-bad1-4f55-a12a-afe79af8438c');
INSERT OR IGNORE INTO question_tag (question_id, tag_id) VALUES ('de16e053-7fce-4e56-8676-eee6866d9c60', '0b598d93-bb5b-4de2-963b-6c812b89c8ab');

-- 질문: e스포츠 관심
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, created_at, updated_at, status) VALUES ('06d1fd5a-9b49-4a0d-ae32-248f18054a94', 'e스포츠 관심', '있다', '없다', 'public', NULL, NULL, '2025-11-22 13:27:43', '2025-11-22 13:27:43', 1);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) VALUES ('06d1fd5a-9b49-4a0d-ae32-248f18054a94', 'c71278df-bad1-4f55-a12a-afe79af8438c');

-- 질문: 운동 선호
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, created_at, updated_at, status) VALUES ('ec49643c-dd54-4d1c-842d-aa8374cbeafb', '운동 선호', '혼자 운동', '단체 운동', 'public', NULL, NULL, '2025-11-22 13:27:43', '2025-11-22 13:27:43', 1);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) VALUES ('ec49643c-dd54-4d1c-842d-aa8374cbeafb', 'e79c5ebd-4d54-4dcb-8c20-c26fa9e5dbfa');

-- 질문: 러닝 vs 사이클
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, created_at, updated_at, status) VALUES ('708ed56a-59fd-45cd-813b-98aeb6122122', '러닝 vs 사이클', '러닝', '사이클', 'public', NULL, NULL, '2025-11-22 13:27:43', '2025-11-22 13:27:43', 1);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) VALUES ('708ed56a-59fd-45cd-813b-98aeb6122122', 'e79c5ebd-4d54-4dcb-8c20-c26fa9e5dbfa');

-- 질문: 운동 시간대
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, created_at, updated_at, status) VALUES ('aad7e812-25e0-4fe3-898b-faa9a21fb67e', '운동 시간대', '아침', '저녁', 'public', NULL, NULL, '2025-11-22 13:27:43', '2025-11-22 13:27:43', 1);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) VALUES ('aad7e812-25e0-4fe3-898b-faa9a21fb67e', 'e79c5ebd-4d54-4dcb-8c20-c26fa9e5dbfa');
INSERT OR IGNORE INTO question_tag (question_id, tag_id) VALUES ('aad7e812-25e0-4fe3-898b-faa9a21fb67e', 'e0f41745-da80-4f77-9ea7-105aaaa32b9b');

-- 질문: 다이어트 방법
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, created_at, updated_at, status) VALUES ('d392fc71-4a6b-435f-a8c3-e8f8e44fb963', '다이어트 방법', '운동', '식단 조절', 'public', NULL, NULL, '2025-11-22 13:27:43', '2025-11-22 13:27:43', 1);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) VALUES ('d392fc71-4a6b-435f-a8c3-e8f8e44fb963', 'e79c5ebd-4d54-4dcb-8c20-c26fa9e5dbfa');
INSERT OR IGNORE INTO question_tag (question_id, tag_id) VALUES ('d392fc71-4a6b-435f-a8c3-e8f8e44fb963', '59489ee9-802b-48c3-a95d-a7de1a1f75f7');

-- 질문: 반려동물
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, created_at, updated_at, status) VALUES ('580a7e69-f3fb-4415-a723-23821788ad9e', '반려동물', '강아지', '고양이', 'public', NULL, NULL, '2025-11-22 13:27:43', '2025-11-22 13:27:43', 1);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) VALUES ('580a7e69-f3fb-4415-a723-23821788ad9e', 'fee6ea0e-e582-4b49-823a-f99307760d9a');
INSERT OR IGNORE INTO question_tag (question_id, tag_id) VALUES ('580a7e69-f3fb-4415-a723-23821788ad9e', '78e50b42-d686-47ad-a0fc-2c1d8c946223');

-- 질문: 계절
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, created_at, updated_at, status) VALUES ('d5b0ddf0-aa4a-4954-935f-cdd9b1bad722', '계절', '봄/여름', '가을/겨울', 'public', NULL, NULL, '2025-11-22 13:27:43', '2025-11-22 13:27:43', 1);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) VALUES ('d5b0ddf0-aa4a-4954-935f-cdd9b1bad722', 'fee6ea0e-e582-4b49-823a-f99307760d9a');

-- 질문: 날씨
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, created_at, updated_at, status) VALUES ('f6b6c6dd-dc70-4c0e-95f7-76b7e5dd87a4', '날씨', '맑은 날', '비 오는 날', 'public', NULL, NULL, '2025-11-22 13:27:43', '2025-11-22 13:27:43', 1);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) VALUES ('f6b6c6dd-dc70-4c0e-95f7-76b7e5dd87a4', 'fee6ea0e-e582-4b49-823a-f99307760d9a');

-- 질문: 교통수단
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, created_at, updated_at, status) VALUES ('540a57aa-106d-406c-b1dc-14ccb3a5dc44', '교통수단', '대중교통', '자가용', 'public', NULL, NULL, '2025-11-22 13:27:43', '2025-11-22 13:27:43', 1);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) VALUES ('540a57aa-106d-406c-b1dc-14ccb3a5dc44', 'fee6ea0e-e582-4b49-823a-f99307760d9a');
INSERT OR IGNORE INTO question_tag (question_id, tag_id) VALUES ('540a57aa-106d-406c-b1dc-14ccb3a5dc44', '78e50b42-d686-47ad-a0fc-2c1d8c946223');

-- 질문: 집에서
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, created_at, updated_at, status) VALUES ('5c9b6ecc-b107-42be-bf8e-9de8c643ca8d', '집에서', 'TV 보기', '핸드폰 보기', 'public', NULL, NULL, '2025-11-22 13:27:43', '2025-11-22 13:27:43', 1);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) VALUES ('5c9b6ecc-b107-42be-bf8e-9de8c643ca8d', 'fee6ea0e-e582-4b49-823a-f99307760d9a');
INSERT OR IGNORE INTO question_tag (question_id, tag_id) VALUES ('5c9b6ecc-b107-42be-bf8e-9de8c643ca8d', 'e0f41745-da80-4f77-9ea7-105aaaa32b9b');

-- 질문: 배달 vs 직접 요리
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, created_at, updated_at, status) VALUES ('f94af271-9b39-448a-ab44-2992ed45b2ed', '배달 vs 직접 요리', '배달 음식', '직접 요리', 'public', NULL, NULL, '2025-11-22 13:27:43', '2025-11-22 13:27:43', 1);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) VALUES ('f94af271-9b39-448a-ab44-2992ed45b2ed', '2286f3a5-054f-4357-a6ee-8fee7dda6140');
INSERT OR IGNORE INTO question_tag (question_id, tag_id) VALUES ('f94af271-9b39-448a-ab44-2992ed45b2ed', 'fee6ea0e-e582-4b49-823a-f99307760d9a');

-- 질문: 요리 실력
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, created_at, updated_at, status) VALUES ('a34777cd-b347-4b0c-a6aa-1289ee5558ed', '요리 실력', '잘하는 편', '못하는 편', 'public', NULL, NULL, '2025-11-22 13:27:43', '2025-11-22 13:27:43', 1);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) VALUES ('a34777cd-b347-4b0c-a6aa-1289ee5558ed', '2286f3a5-054f-4357-a6ee-8fee7dda6140');
INSERT OR IGNORE INTO question_tag (question_id, tag_id) VALUES ('a34777cd-b347-4b0c-a6aa-1289ee5558ed', 'fee6ea0e-e582-4b49-823a-f99307760d9a');

-- 질문: 집 vs 회사
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, created_at, updated_at, status) VALUES ('ac02c97c-cb9e-4b75-ba97-3cb2a0a4e193', '집 vs 회사', '재택근무', '사무실 출근', 'public', NULL, NULL, '2025-11-22 13:27:43', '2025-11-22 13:27:43', 1);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) VALUES ('ac02c97c-cb9e-4b75-ba97-3cb2a0a4e193', 'b07f1c1c-f754-42d3-86be-7f509be3cdab');
INSERT OR IGNORE INTO question_tag (question_id, tag_id) VALUES ('ac02c97c-cb9e-4b75-ba97-3cb2a0a4e193', '78e50b42-d686-47ad-a0fc-2c1d8c946223');

-- 질문: 야근 수당 vs 칼퇴
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, created_at, updated_at, status) VALUES ('9b684b5a-718a-4015-916b-3a169c26d12e', '야근 수당 vs 칼퇴', '야근 수당', '칼퇴근', 'public', NULL, NULL, '2025-11-22 13:27:43', '2025-11-22 13:27:43', 1);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) VALUES ('9b684b5a-718a-4015-916b-3a169c26d12e', 'b07f1c1c-f754-42d3-86be-7f509be3cdab');
INSERT OR IGNORE INTO question_tag (question_id, tag_id) VALUES ('9b684b5a-718a-4015-916b-3a169c26d12e', '0b598d93-bb5b-4de2-963b-6c812b89c8ab');

-- 질문: 직장 위치
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, created_at, updated_at, status) VALUES ('9ca8ebd8-bedd-4271-b937-2c3ea534331e', '직장 위치', '집 근처', '좋은 회사면 먼 곳도 OK', 'public', NULL, NULL, '2025-11-22 13:27:43', '2025-11-22 13:27:43', 1);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) VALUES ('9ca8ebd8-bedd-4271-b937-2c3ea534331e', 'b07f1c1c-f754-42d3-86be-7f509be3cdab');

-- 질문: 스타트업 vs 대기업
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, created_at, updated_at, status) VALUES ('a1f6f595-c5cf-49d5-96f3-a16462eb2af3', '스타트업 vs 대기업', '스타트업', '대기업', 'public', NULL, NULL, '2025-11-22 13:27:43', '2025-11-22 13:27:43', 1);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) VALUES ('a1f6f595-c5cf-49d5-96f3-a16462eb2af3', 'b07f1c1c-f754-42d3-86be-7f509be3cdab');

-- 질문: 연차 사용
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, created_at, updated_at, status) VALUES ('86a69767-1012-4080-bc76-e70e380fcd52', '연차 사용', '아끼지 않고 쓰기', '아껴서 쓰기', 'public', NULL, NULL, '2025-11-22 13:27:43', '2025-11-22 13:27:43', 1);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) VALUES ('86a69767-1012-4080-bc76-e70e380fcd52', 'b07f1c1c-f754-42d3-86be-7f509be3cdab');

-- 질문: 점심 메뉴 결정
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, created_at, updated_at, status) VALUES ('7f7aa768-d4ff-4866-a59b-c8219903e1b3', '점심 메뉴 결정', '내가 정한다', '따라간다', 'public', NULL, NULL, '2025-11-22 13:27:43', '2025-11-22 13:27:43', 1);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) VALUES ('7f7aa768-d4ff-4866-a59b-c8219903e1b3', 'fee6ea0e-e582-4b49-823a-f99307760d9a');
INSERT OR IGNORE INTO question_tag (question_id, tag_id) VALUES ('7f7aa768-d4ff-4866-a59b-c8219903e1b3', '2286f3a5-054f-4357-a6ee-8fee7dda6140');

-- 질문: 메신저 답장
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, created_at, updated_at, status) VALUES ('dc5665d9-9498-4aa8-a8f6-9acbedbd724d', '메신저 답장', '바로 답장', '생각하고 답장', 'public', NULL, NULL, '2025-11-22 13:27:43', '2025-11-22 13:27:43', 1);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) VALUES ('dc5665d9-9498-4aa8-a8f6-9acbedbd724d', 'fee6ea0e-e582-4b49-823a-f99307760d9a');
INSERT OR IGNORE INTO question_tag (question_id, tag_id) VALUES ('dc5665d9-9498-4aa8-a8f6-9acbedbd724d', '24e3c47a-faee-463f-be20-8db1c59a53f2');

-- 질문: 일정 관리
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, created_at, updated_at, status) VALUES ('d7af570b-8d7e-488e-b459-b3dbd5732175', '일정 관리', '디지털 (앱)', '아날로그 (노트)', 'public', NULL, NULL, '2025-11-22 13:27:43', '2025-11-22 13:27:43', 1);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) VALUES ('d7af570b-8d7e-488e-b459-b3dbd5732175', 'e0f41745-da80-4f77-9ea7-105aaaa32b9b');
INSERT OR IGNORE INTO question_tag (question_id, tag_id) VALUES ('d7af570b-8d7e-488e-b459-b3dbd5732175', '855c8646-8c7a-4cda-9300-169be392a665');

-- 질문: 집 정리
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, created_at, updated_at, status) VALUES ('95e1872a-acfa-44a0-b308-65f7b174e548', '집 정리', '미니멀리즘', '맥시멀리즘', 'public', NULL, NULL, '2025-11-22 13:27:43', '2025-11-22 13:27:43', 1);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) VALUES ('95e1872a-acfa-44a0-b308-65f7b174e548', '78e50b42-d686-47ad-a0fc-2c1d8c946223');
INSERT OR IGNORE INTO question_tag (question_id, tag_id) VALUES ('95e1872a-acfa-44a0-b308-65f7b174e548', 'e0f41745-da80-4f77-9ea7-105aaaa32b9b');

-- 질문: 인테리어
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, created_at, updated_at, status) VALUES ('d188d160-45ae-4592-989d-093bb1512955', '인테리어', '모던/심플', '빈티지/앤틱', 'public', NULL, NULL, '2025-11-22 13:27:43', '2025-11-22 13:27:43', 1);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) VALUES ('d188d160-45ae-4592-989d-093bb1512955', '78e50b42-d686-47ad-a0fc-2c1d8c946223');

-- 질문: 면 vs 밥
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, created_at, updated_at, status) VALUES ('6c2bed41-afb6-4c79-b40f-35bb013f00ec', '면 vs 밥', '면 요리', '밥 요리', 'public', NULL, NULL, '2025-11-22 13:27:43', '2025-11-22 13:27:43', 1);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) VALUES ('6c2bed41-afb6-4c79-b40f-35bb013f00ec', '2286f3a5-054f-4357-a6ee-8fee7dda6140');

-- 질문: 독서 장소
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, created_at, updated_at, status) VALUES ('d7b75950-e949-423b-a506-162dacabd4be', '독서 장소', '도서관/카페', '집', 'public', NULL, NULL, '2025-11-22 13:27:43', '2025-11-22 13:27:43', 1);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) VALUES ('d7b75950-e949-423b-a506-162dacabd4be', 'a7e032ee-dbb1-48bd-be20-94349e62ef25');
INSERT OR IGNORE INTO question_tag (question_id, tag_id) VALUES ('d7b75950-e949-423b-a506-162dacabd4be', 'fee6ea0e-e582-4b49-823a-f99307760d9a');

-- 질문: 여름 vs 겨울
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, created_at, updated_at, status) VALUES ('38af6a16-134f-432b-9384-3e9b513e8891', '여름 vs 겨울', '여름', '겨울', 'public', NULL, NULL, '2025-11-22 13:27:43', '2025-11-22 13:27:43', 1);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) VALUES ('38af6a16-134f-432b-9384-3e9b513e8891', 'fee6ea0e-e582-4b49-823a-f99307760d9a');

-- 질문: 자기 전 루틴
INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, created_at, updated_at, status) VALUES ('dfcb9e0e-e62f-4185-a394-4e9db4cab457', '자기 전 루틴', '독서', '유튜브/넷플릭스', 'public', NULL, NULL, '2025-11-22 13:27:43', '2025-11-22 13:27:43', 1);
INSERT OR IGNORE INTO question_tag (question_id, tag_id) VALUES ('dfcb9e0e-e62f-4185-a394-4e9db4cab457', 'fee6ea0e-e582-4b49-823a-f99307760d9a');
INSERT OR IGNORE INTO question_tag (question_id, tag_id) VALUES ('dfcb9e0e-e62f-4185-a394-4e9db4cab457', 'e0f41745-da80-4f77-9ea7-105aaaa32b9b');


-- 총 20개 태그, 100개 질문 생성 완료
