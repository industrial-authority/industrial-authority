import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
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
 * Audits table - stores Digital Capability Audits requested by clients
 */
export const audits = mysqlTable("audits", {
  id: int("id").autoincrement().primaryKey(),
  companyName: varchar("companyName", { length: 255 }).notNull(),
  companyEmail: varchar("companyEmail", { length: 320 }).notNull(),
  companyPhone: varchar("companyPhone", { length: 20 }),
  companyWebsite: varchar("companyWebsite", { length: 500 }),
  industry: varchar("industry", { length: 100 }),
  status: mysqlEnum("status", ["pending", "in_progress", "completed", "delivered"]).default("pending").notNull(),
  auditType: mysqlEnum("auditType", ["basic", "authority_engine", "ongoing"]).default("basic").notNull(),
  findings: text("findings"), // JSON string of audit findings
  recommendations: text("recommendations"), // JSON string of recommendations
  price: int("price"), // Price in cents
  paid: int("paid").default(0), // 0 = unpaid, 1 = paid
  userId: int("userId"), // Assigned to consultant
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  completedAt: timestamp("completedAt"),
});

export type Audit = typeof audits.$inferSelect;
export type InsertAudit = typeof audits.$inferInsert;

/**
 * Clients table - stores information about industrial clients
 */
export const clients = mysqlTable("clients", {
  id: int("id").autoincrement().primaryKey(),
  companyName: varchar("companyName", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 20 }),
  website: varchar("website", { length: 500 }),
  industry: varchar("industry", { length: 100 }),
  employees: int("employees"),
  annualRevenue: varchar("annualRevenue", { length: 50 }),
  contactPerson: varchar("contactPerson", { length: 255 }),
  status: mysqlEnum("status", ["prospect", "lead", "client", "inactive"]).default("prospect").notNull(),
  notes: text("notes"),
  userId: int("userId"), // Assigned to consultant
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Client = typeof clients.$inferSelect;
export type InsertClient = typeof clients.$inferInsert;

/**
 * Services table - stores service offerings and pricing
 */
export const services = mysqlTable("services", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  price: int("price").notNull(), // Price in cents
  duration: varchar("duration", { length: 50 }), // e.g., "one-time", "monthly"
  features: text("features"), // JSON string of features
  active: int("active").default(1),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Service = typeof services.$inferSelect;
export type InsertService = typeof services.$inferInsert;

/**
 * Audit responses table - tracks audit delivery and client responses
 */
export const auditResponses = mysqlTable("auditResponses", {
  id: int("id").autoincrement().primaryKey(),
  auditId: int("auditId").notNull(),
  responseType: mysqlEnum("responseType", ["viewed", "downloaded", "inquiry", "conversion"]).notNull(),
  responseData: text("responseData"), // JSON string of response details
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type AuditResponse = typeof auditResponses.$inferSelect;
export type InsertAuditResponse = typeof auditResponses.$inferInsert;