#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

console.log("--- Starting audit processing script ---");

// Use process.cwd() to resolve paths relative to the repository root
const REPO_ROOT = process.cwd();
const DATA_DIR = path.join(REPO_ROOT, "data");
const AUDITS_FILE = path.join(DATA_DIR, "audits.json");
const PAYMENTS_FILE = path.join(DATA_DIR, "payments.json");

console.log(`REPO_ROOT: ${REPO_ROOT}`);
console.log(`DATA_DIR: ${DATA_DIR}`);
console.log(`AUDITS_FILE: ${AUDITS_FILE}`);
console.log(`PAYMENTS_FILE: ${PAYMENTS_FILE}`);

try {
  // Ensure data directory exists
  if (!fs.existsSync(DATA_DIR)) {
    console.log("Creating data directory...");
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  // Initialize files if they don't exist
  if (!fs.existsSync(AUDITS_FILE)) {
    console.log("Initializing audits file...");
    fs.writeFileSync(
      AUDITS_FILE,
      JSON.stringify({ audits: [], lastUpdated: new Date().toISOString() }, null, 2)
    );
  }

  if (!fs.existsSync(PAYMENTS_FILE)) {
    console.log("Initializing payments file...");
    fs.writeFileSync(
      PAYMENTS_FILE,
      JSON.stringify({ payments: [], lastUpdated: new Date().toISOString() }, null, 2)
    );
  }

  // Read existing data
  console.log("Reading existing data...");
  let auditsData = { audits: [] };
  let paymentsData = { payments: [] };

  try {
    const auditsContent = fs.readFileSync(AUDITS_FILE, "utf8").trim();
    if (auditsContent) {
      auditsData = JSON.parse(auditsContent);
    }
  } catch (e) {
    console.error(`Error parsing audits file: ${e.message}`);
  }

  try {
    const paymentsContent = fs.readFileSync(PAYMENTS_FILE, "utf8").trim();
    if (paymentsContent) {
      paymentsData = JSON.parse(paymentsContent);
    }
  } catch (e) {
    console.error(`Error parsing payments file: ${e.message}`);
  }

  const audits = auditsData.audits || [];
  const payments = paymentsData.payments || [];
  console.log(`Found ${audits.length} existing audits and ${payments.length} payments.`);

  // Sync logic: Create audits from successful payments
  payments.forEach(payment => {
    if (payment.status === 'successful' && !audits.find(a => a.id === payment.id)) {
      console.log(`Creating new audit for payment ID: ${payment.id}`);
      audits.push({
        id: payment.id,
        companyName: payment.customer?.name || 'Unknown Company',
        companyEmail: payment.customer?.email || 'Unknown Email',
        industry: payment.metadata?.industry || 'Industrial',
        auditType: payment.metadata?.auditType || 'Full Compliance',
        status: 'pending',
        createdAt: payment.createdAt || new Date().toISOString()
      });
    }
  });

  // Scoring logic
  const INDUSTRY_SCORES = {
    manufacturing: 100,
    precision_machining: 100,
    industrial_automation: 95,
    heavy_logistics: 95,
    aerospace: 90,
    defense: 90,
    automotive: 85,
    default: 50,
  };

  function scoreAudit(audit) {
    const industryKey = (audit.industry || "default").toLowerCase().replace(/\s+/g, "_");
    const industryScore = INDUSTRY_SCORES[industryKey] || INDUSTRY_SCORES.default;
    
    const engagementScore =
      audit.auditType === "authority_engine"
        ? 100
        : audit.auditType === "ongoing"
        ? 90
        : 60;
        
    const totalScore = industryScore * 0.6 + engagementScore * 0.4;

    let tier = "cold";
    if (totalScore >= 80) tier = "hot";
    else if (totalScore >= 60) tier = "warm";

    return {
      score: Math.round(totalScore),
      tier,
    };
  }

  // Process pending audits
  console.log("Processing pending audits...");
  let newlyScoredCount = 0;
  const processedAudits = audits.map((audit) => {
    if (audit.status === "pending") {
      console.log(`Scoring audit for ${audit.companyName}...`);
      const scoring = scoreAudit(audit);
      newlyScoredCount++;
      return {
        ...audit,
        status: "scored",
        score: scoring.score,
        tier: scoring.tier,
        processedAt: new Date().toISOString(),
      };
    }
    return audit;
  });

  // Update data
  auditsData.audits = processedAudits;
  auditsData.lastUpdated = new Date().toISOString();

  // Write back to file
  console.log("Writing updated audits to file...");
  fs.writeFileSync(AUDITS_FILE, JSON.stringify(auditsData, null, 2));

  console.log(`--- Audit Processing Complete ---`);
  console.log(`Total audits: ${processedAudits.length}`);
  console.log(`Newly scored: ${newlyScoredCount}`);
  console.log(`Hot leads: ${processedAudits.filter((a) => a.tier === "hot").length}`);
  console.log(`Warm leads: ${processedAudits.filter((a) => a.tier === "warm").length}`);
  console.log(`Cold leads: ${processedAudits.filter((a) => a.tier === "cold").length}`);
} catch (error) {
  console.error("CRITICAL ERROR in audit processing:", error);
  process.exit(1);
}
