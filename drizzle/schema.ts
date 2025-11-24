import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Emotion records table - stores user's emotion history and generated music data
 */
export const emotionRecords = mysqlTable("emotion_records", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  emotion: varchar("emotion", { length: 50 }).notNull(),
  color: varchar("color", { length: 7 }).notNull(),
  intensity: int("intensity").default(50).notNull(),
  musicParams: text("musicParams").notNull(),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type EmotionRecord = typeof emotionRecords.$inferSelect;
export type InsertEmotionRecord = typeof emotionRecords.$inferInsert;
