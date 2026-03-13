import { describe, it, expect, vi, beforeEach } from "vitest";
import { auditsRouter } from "./audits";
import * as db from "../db";
import * as emailService from "../_core/emailService";

// Mock the database and email service
vi.mock("../db");
vi.mock("../_core/emailService");

describe("auditsRouter", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("create", () => {
    it("should create an audit and send email notification", async () => {
      // Mock the database function
      vi.mocked(db.createAudit).mockResolvedValue({ insertId: 1 } as any);
      vi.mocked(emailService.sendAuditRequestEmail).mockResolvedValue(true);

      const caller = auditsRouter.createCaller({} as any);

      const result = await caller.create({
        companyName: "Test Company",
        companyEmail: "test@company.com",
        companyPhone: "+1234567890",
        companyWebsite: "https://test.com",
        industry: "Manufacturing",
        auditType: "basic",
      });

      expect(result.success).toBe(true);
      expect(result.message).toContain("submitted successfully");
      expect(db.createAudit).toHaveBeenCalledWith(
        expect.objectContaining({
          companyName: "Test Company",
          companyEmail: "test@company.com",
          auditType: "basic",
          price: 25000, // $250 in cents
        })
      );
      expect(emailService.sendAuditRequestEmail).toHaveBeenCalled();
    });

    it("should validate required fields", async () => {
      const caller = auditsRouter.createCaller({} as any);

      await expect(
        caller.create({
          companyName: "",
          companyEmail: "invalid",
          auditType: "basic",
        } as any)
      ).rejects.toThrow();
    });

    it("should set correct price based on audit type", async () => {
      vi.mocked(db.createAudit).mockResolvedValue({ insertId: 1 } as any);
      vi.mocked(emailService.sendAuditRequestEmail).mockResolvedValue(true);

      const caller = auditsRouter.createCaller({} as any);

      // Test authority_engine price
      await caller.create({
        companyName: "Test",
        companyEmail: "test@test.com",
        auditType: "authority_engine",
      });

      expect(db.createAudit).toHaveBeenCalledWith(
        expect.objectContaining({
          price: 500000, // $5,000 in cents
        })
      );

      // Test ongoing price
      await caller.create({
        companyName: "Test",
        companyEmail: "test@test.com",
        auditType: "ongoing",
      });

      expect(db.createAudit).toHaveBeenCalledWith(
        expect.objectContaining({
          price: 250000, // $2,500 in cents
        })
      );
    });
  });

  describe("getById", () => {
    it("should return audit by ID", async () => {
      const mockAudit = {
        id: 1,
        companyName: "Test Company",
        companyEmail: "test@company.com",
        status: "pending",
        auditType: "basic",
      };

      vi.mocked(db.getAuditById).mockResolvedValue(mockAudit as any);

      const caller = auditsRouter.createCaller({} as any);
      const result = await caller.getById({ id: 1 });

      expect(result).toEqual(mockAudit);
      expect(db.getAuditById).toHaveBeenCalledWith(1);
    });

    it("should throw error if audit not found", async () => {
      vi.mocked(db.getAuditById).mockResolvedValue(undefined);

      const caller = auditsRouter.createCaller({} as any);

      await expect(caller.getById({ id: 999 })).rejects.toThrow("Audit not found");
    });
  });

  describe("getAll", () => {
    it("should return all audits for admin users", async () => {
      const mockAudits = [
        { id: 1, companyName: "Company 1", status: "pending" },
        { id: 2, companyName: "Company 2", status: "completed" },
      ];

      vi.mocked(db.getAllAudits).mockResolvedValue(mockAudits as any);

      const adminCtx = {
        user: { id: 1, role: "admin", openId: "admin-user" },
      } as any;

      const caller = auditsRouter.createCaller(adminCtx);
      const result = await caller.getAll();

      expect(result).toEqual(mockAudits);
      expect(db.getAllAudits).toHaveBeenCalled();
    });

    it("should throw error for non-admin users", async () => {
      const userCtx = {
        user: { id: 1, role: "user", openId: "regular-user" },
      } as any;

      const caller = auditsRouter.createCaller(userCtx);

      await expect(caller.getAll()).rejects.toThrow("Unauthorized");
    });
  });

  describe("updateStatus", () => {
    it("should update audit status for admin users", async () => {
      vi.mocked(db.updateAuditStatus).mockResolvedValue({} as any);

      const adminCtx = {
        user: { id: 1, role: "admin", openId: "admin-user" },
      } as any;

      const caller = auditsRouter.createCaller(adminCtx);
      const result = await caller.updateStatus({
        id: 1,
        status: "in_progress",
      });

      expect(result.success).toBe(true);
      expect(db.updateAuditStatus).toHaveBeenCalledWith(1, "in_progress");
    });

    it("should throw error for non-admin users", async () => {
      const userCtx = {
        user: { id: 1, role: "user", openId: "regular-user" },
      } as any;

      const caller = auditsRouter.createCaller(userCtx);

      await expect(
        caller.updateStatus({
          id: 1,
          status: "in_progress",
        })
      ).rejects.toThrow("Unauthorized");
    });
  });

  describe("complete", () => {
    it("should complete audit and send email to client", async () => {
      const mockAudit = {
        id: 1,
        companyName: "Test Company",
        companyEmail: "test@company.com",
        auditType: "basic",
      };

      vi.mocked(db.getAuditById).mockResolvedValue(mockAudit as any);
      vi.mocked(db.updateAuditFindings).mockResolvedValue({} as any);
      vi.mocked(emailService.sendAuditCompletionEmail).mockResolvedValue(true);

      const adminCtx = {
        user: { id: 1, role: "admin", openId: "admin-user" },
      } as any;

      const caller = auditsRouter.createCaller(adminCtx);
      const result = await caller.complete({
        id: 1,
        findings: "Test findings",
        recommendations: "Test recommendations",
      });

      expect(result.success).toBe(true);
      expect(db.updateAuditFindings).toHaveBeenCalledWith(
        1,
        "Test findings",
        "Test recommendations"
      );
      expect(emailService.sendAuditCompletionEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          companyName: "Test Company",
          companyEmail: "test@company.com",
        })
      );
    });

    it("should throw error if audit not found", async () => {
      vi.mocked(db.getAuditById).mockResolvedValue(undefined);

      const adminCtx = {
        user: { id: 1, role: "admin", openId: "admin-user" },
      } as any;

      const caller = auditsRouter.createCaller(adminCtx);

      await expect(
        caller.complete({
          id: 999,
          findings: "Test",
          recommendations: "Test",
        })
      ).rejects.toThrow("Audit not found");
    });
  });
});
