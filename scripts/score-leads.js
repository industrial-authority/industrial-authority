#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Score Leads Script
 * Categorizes audits into hot/warm/cold leads for prioritization
 */

const REPO_ROOT = process.cwd();
const DATA_DIR = path.join(REPO_ROOT, 'data');
const AUDITS_FILE = path.join(DATA_DIR, 'audits.json');
const LEADS_FILE = path.join(DATA_DIR, 'leads.json');

console.log('--- Starting lead scoring script ---');
console.log(`REPO_ROOT: ${REPO_ROOT}`);
console.log(`DATA_DIR: ${DATA_DIR}`);
console.log(`AUDITS_FILE: ${AUDITS_FILE}`);
console.log(`LEADS_FILE: ${LEADS_FILE}`);

try {
  if (!fs.existsSync(DATA_DIR)) {
    console.log("Creating data directory...");
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(AUDITS_FILE)) {
    console.log('No audits file found. Creating empty leads file.');
    const emptyLeads = {
      hot: [], warm: [], cold: [],
      stats: { total: 0, hot: 0, warm: 0, cold: 0, averageScore: 0 },
      lastUpdated: new Date().toISOString()
    };
    fs.writeFileSync(LEADS_FILE, JSON.stringify(emptyLeads, null, 2));
    process.exit(0);
  }

  let auditsData = { audits: [] };
  try {
    const content = fs.readFileSync(AUDITS_FILE, 'utf8').trim();
    if (content) {
      auditsData = JSON.parse(content);
    }
  } catch (e) {
    console.error(`Error parsing audits file: ${e.message}`);
  }

  const audits = auditsData.audits || [];

  // Categorize by tier
  const leads = {
    hot: audits.filter(a => a.tier === 'hot').sort((a, b) => (b.score || 0) - (a.score || 0)),
    warm: audits.filter(a => a.tier === 'warm').sort((a, b) => (b.score || 0) - (a.score || 0)),
    cold: audits.filter(a => a.tier === 'cold').sort((a, b) => (b.score || 0) - (a.score || 0)),
    stats: {
      total: audits.length,
      hot: audits.filter(a => a.tier === 'hot').length,
      warm: audits.filter(a => a.tier === 'warm').length,
      cold: audits.filter(a => a.tier === 'cold').length,
      averageScore: audits.length > 0 ? Math.round(audits.reduce((sum, a) => sum + (a.score || 0), 0) / audits.length) : 0,
    },
    lastUpdated: new Date().toISOString(),
  };

  fs.writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2));
  console.log('📊 Lead Scoring Complete:');
  console.log(`🔥 Hot Leads: ${leads.stats.hot}`);
  console.log(`🟡 Warm Leads: ${leads.stats.warm}`);
  console.log(`❄️  Cold Leads: ${leads.stats.cold}`);
  console.log(`📈 Average Score: ${leads.stats.averageScore}`);
} catch (e) {
  console.error(`Error in lead scoring: ${e.message}`);
  process.exit(1);
}
