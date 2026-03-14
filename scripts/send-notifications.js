#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Send Email Notifications
 * Sends notifications to the owner about new audits and lead scores
 * Uses SendGrid API (free tier: 100 emails/day)
 */

const AUDITS_FILE = path.join(__dirname, '../data/audits.json');
const NOTIFICATIONS_FILE = path.join(__dirname, '../data/notifications.json');

if (!fs.existsSync(AUDITS_FILE)) {
  console.log('No audits file found');
  process.exit(0);
}

const auditsData = JSON.parse(fs.readFileSync(AUDITS_FILE, 'utf8'));
const audits = auditsData.audits || [];

// Find new audits that haven't been notified yet
let notifications = [];
if (fs.existsSync(NOTIFICATIONS_FILE)) {
  notifications = JSON.parse(fs.readFileSync(NOTIFICATIONS_FILE, 'utf8'));
}

const newAudits = audits.filter(a => !notifications.find(n => n.auditId === a.id && n.type === 'created'));

if (newAudits.length === 0) {
  console.log('No new audits to notify');
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
fs.writeFileSync(NOTIFICATIONS_FILE, JSON.stringify(notifications, null, 2));

console.log('✅ Notifications logged and saved');
