#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Score Leads Script
 * Categorizes audits into hot/warm/cold leads for prioritization
 */

const DATA_DIR = path.join(__dirname, '../data');
const AUDITS_FILE = path.join(DATA_DIR, 'audits.json');
const LEADS_FILE = path.join(DATA_DIR, 'leads.json');

console.log('--- Starting lead scoring script ---');

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

let auditsData;
try {
  const content = fs.readFileSync(AUDITS_FILE, 'utf8').trim();
  auditsData = content ? JSON.parse(content) : { audits: [] };
} catch (e) {
  console.error(`Error parsing audits file: ${e.message}`);
  auditsData = { audits: [] };
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

try {
  fs.writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2));
  console.log('📊 Lead Scoring Complete:');
  console.log(`🔥 Hot Leads: ${leads.stats.hot}`);
  console.log(`🟡 Warm Leads: ${leads.stats.warm}`);
  console.log(`❄️  Cold Leads: ${leads.stats.cold}`);
  console.log(`📈 Average Score: ${leads.stats.averageScore}`);
} catch (e) {
  console.error(`Error writing leads file: ${e.message}`);
  process.exit(1);
}
