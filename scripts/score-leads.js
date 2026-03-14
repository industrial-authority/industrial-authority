#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Score Leads Script
 * Categorizes audits into hot/warm/cold leads for prioritization
 */

const AUDITS_FILE = path.join(__dirname, '../data/audits.json');
const LEADS_FILE = path.join(__dirname, '../data/leads.json');

if (!fs.existsSync(AUDITS_FILE)) {
  console.log('No audits file found');
  process.exit(0);
}

const auditsData = JSON.parse(fs.readFileSync(AUDITS_FILE, 'utf8'));
const audits = auditsData.audits || [];

// Categorize by tier
const leads = {
  hot: audits.filter(a => a.tier === 'hot').sort((a, b) => b.score - a.score),
  warm: audits.filter(a => a.tier === 'warm').sort((a, b) => b.score - a.score),
  cold: audits.filter(a => a.tier === 'cold').sort((a, b) => b.score - a.score),
  stats: {
    total: audits.length,
    hot: audits.filter(a => a.tier === 'hot').length,
    warm: audits.filter(a => a.tier === 'warm').length,
    cold: audits.filter(a => a.tier === 'cold').length,
    averageScore: Math.round(audits.reduce((sum, a) => sum + (a.score || 0), 0) / audits.length || 0),
  },
  lastUpdated: new Date().toISOString(),
};

fs.writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2));

console.log('📊 Lead Scoring Complete:');
console.log(`🔥 Hot Leads: ${leads.stats.hot}`);
console.log(`🟡 Warm Leads: ${leads.stats.warm}`);
console.log(`❄️  Cold Leads: ${leads.stats.cold}`);
console.log(`📈 Average Score: ${leads.stats.averageScore}`);
