import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import * as db from "../db";

/**
 * Lead Scoring System
 * Automatically scores audits based on company characteristics
 * Higher scores = higher priority leads
 */

interface LeadScore {
  auditId: number;
  score: number;
  breakdown: {
    industryScore: number;
    websiteScore: number;
    engagementScore: number;
    contractValueScore: number;
  };
  tier: "hot" | "warm" | "cold";
  recommendation: string;
}

// Industry scoring weights (higher = more likely to convert)
const INDUSTRY_SCORES: Record<string, number> = {
  manufacturing: 100,
  precision_machining: 100,
  industrial_automation: 95,
  heavy_logistics: 95,
  specialized_logistics: 95,
  aerospace: 90,
  defense: 90,
  automotive: 85,
  heavy_equipment: 85,
  industrial_valve: 85,
  robotics: 85,
  cnc_machining: 85,
  welding: 80,
  fabrication: 80,
  industrial: 75,
  engineering: 70,
  construction: 65,
  default: 50,
};

// Audit type to contract value mapping
const AUDIT_TYPE_VALUE: Record<string, number> = {
  basic: 25000, // $250
  authority_engine: 500000, // $5,000
  ongoing: 250000, // $2,500/month
};

function scoreIndustry(industry: string): number {
  if (!industry) return INDUSTRY_SCORES.default;
  const normalized = industry.toLowerCase().replace(/\s+/g, "_");
  return INDUSTRY_SCORES[normalized] || INDUSTRY_SCORES.default;
}

function scoreWebsite(website: string): number {
  if (!website) return 0; // No website = red flag
  if (website.includes("linkedin.com")) return 30; // LinkedIn only
  if (website.includes("facebook.com")) return 25; // Facebook only
  if (website.match(/\.(com|net|org|io)$/)) return 80; // Professional domain
  return 50; // Basic website
}

function scoreEngagement(auditType: string): number {
  // Higher tier audits = more serious prospects
  switch (auditType) {
    case "authority_engine":
      return 100; // Most serious
    case "ongoing":
      return 90; // Long-term commitment
    case "basic":
      return 60; // Testing the waters
    default:
      return 50;
  }
}

function scoreContractValue(auditType: string): number {
  const value = AUDIT_TYPE_VALUE[auditType] || 0;
  return Math.min(100, (value / 500000) * 100); // Normalize to 0-100
}

function calculateLeadScore(audit: any): LeadScore {
  const industryScore = scoreIndustry(audit.industry);
  const websiteScore = scoreWebsite(audit.companyWebsite);
  const engagementScore = scoreEngagement(audit.auditType);
  const contractValueScore = scoreContractValue(audit.auditType);

  // Weighted scoring
  const totalScore = industryScore * 0.4 + websiteScore * 0.15 + engagementScore * 0.25 + contractValueScore * 0.2;

  // Determine tier
  let tier: "hot" | "warm" | "cold";
  let recommendation: string;

  if (totalScore >= 80) {
    tier = "hot";
    recommendation = "PRIORITY: High-value prospect. Contact immediately. This company is actively seeking solutions and has serious budget.";
  } else if (totalScore >= 60) {
    tier = "warm";
    recommendation = "MEDIUM PRIORITY: Good prospect. Follow up within 48 hours. Has potential but may need nurturing.";
  } else {
    tier = "cold";
    recommendation = "LOW PRIORITY: Requires nurturing. Consider adding to email sequence. May convert with proper follow-up.";
  }

  return {
    auditId: audit.id,
    score: Math.round(totalScore),
    breakdown: {
      industryScore: Math.round(industryScore),
      websiteScore: Math.round(websiteScore),
      engagementScore: Math.round(engagementScore),
      contractValueScore: Math.round(contractValueScore),
    },
    tier,
    recommendation,
  };
}

export const leadsRouter = router({
  /**
   * Score a single lead
   */
  scoreAudit: publicProcedure
    .input(
      z.object({
        auditId: z.number(),
      })
    )
    .query(async ({ input }) => {
      const audit = await db.getAuditById(input.auditId);
      if (!audit) {
        throw new Error("Audit not found");
      }
      return calculateLeadScore(audit);
    }),

  /**
   * Get all leads sorted by score (highest first)
   */
  getAllLeads: publicProcedure.query(async () => {
    const audits = await db.getAllAudits();
    const scoredLeads = audits.map(calculateLeadScore).sort((a, b) => b.score - a.score);
    return scoredLeads;
  }),

  /**
   * Get hot leads (high priority)
   */
  getHotLeads: publicProcedure.query(async () => {
    const audits = await db.getAllAudits();
    const scoredLeads = audits
      .map(calculateLeadScore)
      .filter((lead) => lead.tier === "hot")
      .sort((a, b) => b.score - a.score);
    return scoredLeads;
  }),

  /**
   * Get warm leads (medium priority)
   */
  getWarmLeads: publicProcedure.query(async () => {
    const audits = await db.getAllAudits();
    const scoredLeads = audits
      .map(calculateLeadScore)
      .filter((lead) => lead.tier === "warm")
      .sort((a, b) => b.score - a.score);
    return scoredLeads;
  }),

  /**
   * Get cold leads (low priority)
   */
  getColdLeads: publicProcedure.query(async () => {
    const audits = await db.getAllAudits();
    const scoredLeads = audits
      .map(calculateLeadScore)
      .filter((lead) => lead.tier === "cold")
      .sort((a, b) => b.score - a.score);
    return scoredLeads;
  }),

  /**
   * Get leads by tier
   */
  getLeadsByTier: publicProcedure
    .input(
      z.object({
        tier: z.enum(["hot", "warm", "cold"]),
      })
    )
    .query(async ({ input }) => {
      const audits = await db.getAllAudits();
      const scoredLeads = audits
        .map(calculateLeadScore)
        .filter((lead) => lead.tier === input.tier)
        .sort((a, b) => b.score - a.score);
      return scoredLeads;
    }),

  /**
   * Get lead statistics
   */
  getLeadStats: publicProcedure.query(async () => {
    const audits = await db.getAllAudits();
    const scoredLeads = audits.map(calculateLeadScore);

    const stats = {
      total: scoredLeads.length,
      hot: scoredLeads.filter((l) => l.tier === "hot").length,
      warm: scoredLeads.filter((l) => l.tier === "warm").length,
      cold: scoredLeads.filter((l) => l.tier === "cold").length,
      averageScore: Math.round(scoredLeads.reduce((sum, l) => sum + l.score, 0) / scoredLeads.length || 0),
      totalPotentialValue: scoredLeads.reduce((sum, lead) => {
        const audit = audits.find((a) => a.id === lead.auditId);
        return sum + (AUDIT_TYPE_VALUE[audit?.auditType || "basic"] || 0);
      }, 0),
    };

    return stats;
  }),
});
