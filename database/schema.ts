import { uuid, pgTable, text, integer, timestamp } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  clerkId: text("clerk_id").notNull().unique(),
  userName: text("user_name").notNull(),
  age: integer("age"), 
  email: text("email").notNull().unique(),
  mobile_no: text("mobile_number").notNull(), 
  userType: text("user_type").notNull(), 
  status: integer("status").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});
