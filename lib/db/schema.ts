import { sqliteTable, text, integer, primaryKey } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

// 사용자 테이블
export const user = sqliteTable('user', {
  id: text('id').primaryKey(),
  googleId: text('google_id').notNull().unique(),
  email: text('email').notNull(),
  displayName: text('display_name'), // 구글 계정명
  customNickname: text('custom_nickname'), // 익명 별명
  useNickname: integer('use_nickname', { mode: 'boolean' }).default(false), // 1이면 custom_nickname 사용
  status: integer('status').default(1), // 1: 정상, -1: 탈퇴
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
});

// 밸런스 질문 테이블
export const question = sqliteTable('question', {
  id: text('id').primaryKey(),
  creatorId: text('creator_id').references(() => user.id),
  title: text('title').notNull(), // 질문 제목 (필수)
  optionA: text('option_a').notNull(),
  optionB: text('option_b').notNull(),
  visibility: text('visibility').default('public'), // 'public', 'group', 'private'
  groupId: text('group_id').references(() => userGroup.id), // visibility='group'일 때만 사용
  deletedAt: integer('deleted_at', { mode: 'timestamp' }), // Soft Delete: NULL이면 활성
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
});

// 태그 테이블
export const tag = sqliteTable('tag', {
  id: text('id').primaryKey(),
  name: text('name').notNull().unique(),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
});

// 질문-태그 연결 테이블 (다대다)
export const questionTag = sqliteTable('question_tag', {
  questionId: text('question_id').references(() => question.id, { onDelete: 'cascade' }).notNull(),
  tagId: text('tag_id').references(() => tag.id, { onDelete: 'cascade' }).notNull(),
}, (table) => ({
  pk: primaryKey({ columns: [table.questionId, table.tagId] }),
}));

// 응답 테이블
export const response = sqliteTable('response', {
  id: text('id').primaryKey(),
  questionId: text('question_id').references(() => question.id, { onDelete: 'cascade' }).notNull(),
  userId: text('user_id').references(() => user.id), // NULL이면 비로그인
  selectedOption: text('selected_option').notNull(), // 'A' or 'B'
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
});

// 모임 테이블
export const userGroup = sqliteTable('user_group', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  creatorId: text('creator_id').references(() => user.id),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
});

// 모임 멤버 테이블
export const groupMember = sqliteTable('group_member', {
  groupId: text('group_id').references(() => userGroup.id, { onDelete: 'cascade' }).notNull(),
  userId: text('user_id').references(() => user.id, { onDelete: 'cascade' }).notNull(),
  joinedAt: integer('joined_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
}, (table) => ({
  pk: primaryKey({ columns: [table.groupId, table.userId] }),
}));

// 초대 링크 테이블
export const inviteLink = sqliteTable('invite_link', {
  id: text('id').primaryKey(), // 초대 코드 (UUID)
  groupId: text('group_id').references(() => userGroup.id, { onDelete: 'cascade' }).notNull(),
  createdBy: text('created_by').references(() => user.id),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
  expiresAt: integer('expires_at', { mode: 'timestamp' }), // 30일 후
});

// TypeScript 타입 추출
export type User = typeof user.$inferSelect;
export type NewUser = typeof user.$inferInsert;

export type Question = typeof question.$inferSelect;
export type NewQuestion = typeof question.$inferInsert;

export type Tag = typeof tag.$inferSelect;
export type NewTag = typeof tag.$inferInsert;

export type QuestionTag = typeof questionTag.$inferSelect;
export type NewQuestionTag = typeof questionTag.$inferInsert;

export type Response = typeof response.$inferSelect;
export type NewResponse = typeof response.$inferInsert;

export type UserGroup = typeof userGroup.$inferSelect;
export type NewUserGroup = typeof userGroup.$inferInsert;

export type GroupMember = typeof groupMember.$inferSelect;
export type NewGroupMember = typeof groupMember.$inferInsert;

export type InviteLink = typeof inviteLink.$inferSelect;
export type NewInviteLink = typeof inviteLink.$inferInsert;

