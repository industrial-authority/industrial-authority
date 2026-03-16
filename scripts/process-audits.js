#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

console.log("Starting audit processing script...");

const DATA_DIR = path.join(__dirname, "../data");
const AUDITS_FILE = path.join(DATA_DIR, "audits.json");

console.log(`DATA_DIR: ${DATA_DIR}`);
console.log(`AUDITS_FILE: ${AUDITS_FILE}`);

try {
  // Ensure data directory exists
  if (!fs.existsSync(DATA_DIR)) {
    console.log("Creating data directory...");
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  // Initialize audits file if it doesn't exist
  if (!fs.existsSync(AUDITS_FILE)) {
    console.log("Initializing audits file...");
    fs.writeFileSync(
      AUDITS_FILE,
      JSON.stringify({ audits: [], lastUpdated: new Date().toISOString() }, null, 2)
    );
  }

  // Read existing audits
  console.log("Reading existing audits...");
  let data = JSON.parse(fs.readFileSync(AUDITS_FILE, "utf8"));
  console.log(`Found ${data.audits.length} existing audits.`);

  // Score leads
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
    const industryScore =
      INDUSTRY_SCORES[audit.industry?.toLowerCase().replace(/\s+/g, "_")] ||
      INDUSTRY_SCORES.default;
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
  const processedAudits = data.audits.map((audit) => {
    if (audit.status === "pending") {
      console.log(`Scoring audit for ${audit.companyName}...`);
      const scoring = scoreAudit(audit);
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
  data.audits = processedAudits;
  data.lastUpdated = new Date().toISOString();

  // Write back to file
  console.log("Writing updated audits to file...");
  fs.writeFileSync(AUDITS_FILE, JSON.stringify(data, null, 2));

  console.log(`✅ Processed ${processedAudits.length} audits`);
  console.log(`Hot leads: ${processedAudits.filter((a) => a.tier === "hot").length}`);
  console.log(`Warm leads: ${processedAudits.filter((a) => a.tier === "warm").length}`);
  console.log(`Cold leads: ${processedAudits.filter((a) => a.tier === "cold").length}`);
} catch (error) {
  console.error("Error processing audits:", error);
  process.exit(1);
}
