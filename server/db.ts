import { eq, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, audits, clients, services, auditResponses, Audit, Client, Service } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ============ AUDIT QUERIES ============

export async function createAudit(data: {
  companyName: string;
  companyEmail: string;
  companyPhone?: string;
  companyWebsite?: string;
  industry?: string;
  auditType: "basic" | "authority_engine" | "ongoing";
  price?: number;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(audits).values({
    companyName: data.companyName,
    companyEmail: data.companyEmail,
    companyPhone: data.companyPhone,
    companyWebsite: data.companyWebsite,
    industry: data.industry,
    auditType: data.auditType,
    price: data.price,
    status: "pending",
  });

  return result;
}

export async function getAuditById(id: number): Promise<Audit | undefined> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.select().from(audits).where(eq(audits.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getAllAudits(): Promise<Audit[]> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.select().from(audits).orderBy(desc(audits.createdAt));
}

export async function updateAuditStatus(id: number, status: "pending" | "in_progress" | "completed" | "delivered") {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.update(audits).set({ status }).where(eq(audits.id, id));
}

export async function updateAuditFindings(id: number, findings: string, recommendations: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.update(audits).set({ findings, recommendations, status: "completed" }).where(eq(audits.id, id));
}

// ============ CLIENT QUERIES ============

export async function createClient(data: {
  companyName: string;
  email: string;
  phone?: string;
  website?: string;
  industry?: string;
  employees?: number;
  annualRevenue?: string;
  contactPerson?: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.insert(clients).values({
    companyName: data.companyName,
    email: data.email,
    phone: data.phone,
    website: data.website,
    industry: data.industry,
    employees: data.employees,
    annualRevenue: data.annualRevenue,
    contactPerson: data.contactPerson,
    status: "prospect",
  });
}

export async function getClientById(id: number): Promise<Client | undefined> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.select().from(clients).where(eq(clients.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getAllClients(): Promise<Client[]> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.select().from(clients).orderBy(desc(clients.createdAt));
}

export async function updateClientStatus(id: number, status: "prospect" | "lead" | "client" | "inactive") {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.update(clients).set({ status }).where(eq(clients.id, id));
}

// ============ SERVICE QUERIES ============

export async function createService(data: {
  name: string;
  description?: string;
  price: number;
  duration?: string;
  features?: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.insert(services).values({
    name: data.name,
    description: data.description,
    price: data.price,
    duration: data.duration,
    features: data.features,
    active: 1,
  });
}

export async function getServiceById(id: number): Promise<Service | undefined> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.select().from(services).where(eq(services.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getAllServices(): Promise<Service[]> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.select().from(services).where(eq(services.active, 1)).orderBy(desc(services.createdAt));
}

// ============ AUDIT RESPONSE QUERIES ============

export async function recordAuditResponse(auditId: number, responseType: "viewed" | "downloaded" | "inquiry" | "conversion", responseData?: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.insert(auditResponses).values({
    auditId,
    responseType,
    responseData,
  });
}
