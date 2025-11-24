import { uuid } from 'drizzle-orm/pg-core';
import { integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';
import test from 'node:test';

export const users = pgTable('users', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  clerkId: text('clerk_id').notNull().unique(),
  userName: text('user_name').notNull(),
  age: integer('age').notNull(),
  email: text('email').notNull().unique(),
  mobile_no: integer('mobile_number').notNull().unique(),
  userType: text('user_type').notNull().unique(),
  status: integer('status').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),

});

// export const postsTable = pgTable('posts_table', {
//   id: serial('id').primaryKey(),
//   title: text('title').notNull(),
//   content: text('content').notNull(),
//   userId: integer('user_id')
//     .notNull()
//     .references(() => usersTable.id, { onDelete: 'cascade' }),
//   createdAt: timestamp('created_at').notNull().defaultNow(),
//   updatedAt: timestamp('updated_at')
//     .notNull()
//     .$onUpdate(() => new Date()),
// });

// export type InsertUser = typeof usersTable.$inferInsert;
// export type SelectUser = typeof usersTable.$inferSelect;

// export type InsertPost = typeof postsTable.$inferInsert;
// export type SelectPost = typeof postsTable.$inferSelect;
