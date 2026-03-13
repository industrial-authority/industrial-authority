import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { createAudit, getAuditById, getAllAudits, updateAuditStatus, updateAuditFindings } from "../db";
import { sendAuditRequestEmail, sendAuditCompletionEmail } from "../_core/emailService";

export const auditsRouter = router({
  /**
   * Create a new audit request (public - no auth required)
   */
  create: publicProcedure
    .input(
      z.object({
        companyName: z.string().min(1, "Company name is required"),
        companyEmail: z.string().email("Valid email is required"),
        companyPhone: z.string().optional(),
        companyWebsite: z.string().optional(),
        industry: z.string().optional(),
        auditType: z.enum(["basic", "authority_engine", "ongoing"]),
      })
    )
    .mutation(async ({ input }) => {
      try {
        // Create audit in database
        const result = await createAudit({
          companyName: input.companyName,
          companyEmail: input.companyEmail,
          companyPhone: input.companyPhone,
          companyWebsite: input.companyWebsite,
          industry: input.industry,
          auditType: input.auditType,
          price: input.auditType === "basic" ? 25000 : input.auditType === "authority_engine" ? 500000 : 250000,
        });

        // Send email notification to owner
        await sendAuditRequestEmail({
          companyName: input.companyName,
          companyEmail: input.companyEmail,
          companyPhone: input.companyPhone,
          industry: input.industry,
          auditType: input.auditType,
        });

        return {
          success: true,
          message: "Audit request submitted successfully. We'll contact you soon!",
        };
      } catch (error) {
        console.error("[Audits] Error creating audit:", error);
        throw new Error("Failed to create audit request");
      }
    }),

  /**
   * Get audit by ID (public - anyone can view)
   */
  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const audit = await getAuditById(input.id);
      if (!audit) {
        throw new Error("Audit not found");
      }
      return audit;
    }),

  /**
   * Get all audits (protected - admin only)
   */
  getAll: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user?.role !== "admin") {
      throw new Error("Unauthorized");
    }
    return await getAllAudits();
  }),

  /**
   * Update audit status (protected - admin only)
   */
  updateStatus: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        status: z.enum(["pending", "in_progress", "completed", "delivered"]),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (ctx.user?.role !== "admin") {
        throw new Error("Unauthorized");
      }
      await updateAuditStatus(input.id, input.status);
      return { success: true };
    }),

  /**
   * Complete audit with findings (protected - admin only)
   */
  complete: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        findings: z.string(),
        recommendations: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (ctx.user?.role !== "admin") {
        throw new Error("Unauthorized");
      }

      // Get audit to get company email
      const audit = await getAuditById(input.id);
      if (!audit) {
        throw new Error("Audit not found");
      }

      // Update audit with findings
      await updateAuditFindings(input.id, input.findings, input.recommendations);

      // Send completion email to client
      await sendAuditCompletionEmail({
        companyName: audit.companyName,
        companyEmail: audit.companyEmail,
        findings: input.findings,
        recommendations: input.recommendations,
        auditType: audit.auditType,
      });

      return { success: true, message: "Audit completed and email sent to client" };
    }),
});
