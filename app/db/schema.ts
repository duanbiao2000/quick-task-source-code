import { text, pgTable, timestamp, pgEnum } from "drizzle-orm/pg-core";

// Define Enums for Priority and Status
export const priorityEnum = pgEnum("priority", ["low", "medium", "high"]);
export const statusEnum = pgEnum("status", ["in progress", "completed"]);

export const userTable = pgTable("userTable", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  hash_password: text("hash_password").notNull(),
});

// Task Table (Using Enums for priority and status)
export const tasksTable = pgTable("tasksTable", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  priority: priorityEnum("priority").notNull(), // Using the enum for priority
  status: statusEnum("status").notNull(), // Using the enum for status
  userId: text("user_id")
    .notNull()
    .references(() => userTable.id), // Linking to the user who created the task
});

export const sessionTable = pgTable("session", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => userTable.id),
  expiresAt: timestamp("expires_at", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
});
