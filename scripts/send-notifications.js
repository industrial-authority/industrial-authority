#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Send Email Notifications
 * Sends notifications to the owner about new audits and lead scores
 * Uses SendGrid API (free tier: 100 emails/day)
 */

const DATA_DIR = path.join(__dirname, '../data');
const AUDITS_FILE = path.join(DATA_DIR, 'audits.json');
const NOTIFICATIONS_FILE = path.join(DATA_DIR, 'notifications.json');

console.log('--- Starting notification script ---');

if (!fs.existsSync(AUDITS_FILE)) {
  console.log('No audits file found. Nothing to notify.');
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

// Find new audits that haven't been notified yet
let notifications = [];
if (fs.existsSync(NOTIFICATIONS_FILE)) {
  try {
    const content = fs.readFileSync(NOTIFICATIONS_FILE, 'utf8').trim();
    notifications = content ? JSON.parse(content) : [];
  } catch (e) {
    console.error(`Error parsing notifications file: ${e.message}`);
  }
}

const newAudits = audits.filter(a => !notifications.find(n => n.auditId === a.id && n.type === 'created'));

if (newAudits.length === 0) {
  console.log('No new audits to notify.');
  process.exit(0);
}

// Log notifications (in production, this would send emails via SendGrid)
console.log(`📧 New audit notifications: ${newAudits.length}`);

newAudits.forEach(audit => {
  console.log(`
  Company: ${audit.companyName}
  Email: ${audit.companyEmail}
  Industry: ${audit.industry}
  Type: ${audit.auditType}
  Score: ${audit.score}
  Tier: ${audit.tier}
  `);

  notifications.push({
    auditId: audit.id,
    type: 'created',
    sentAt: new Date().toISOString(),
  });
});

// Save notification history
try {
  fs.writeFileSync(NOTIFICATIONS_FILE, JSON.stringify(notifications, null, 2));
  console.log('✅ Notifications logged and saved');
} catch (e) {
  console.error(`Error writing notifications file: ${e.message}`);
  process.exit(1);
}
