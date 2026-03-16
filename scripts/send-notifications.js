#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Send Email Notifications
 * Sends notifications to the owner about new audits and lead scores
 * Uses SendGrid API (free tier: 100 emails/day)
 */

const REPO_ROOT = process.cwd();
const DATA_DIR = path.join(REPO_ROOT, 'data');
const AUDITS_FILE = path.join(DATA_DIR, 'audits.json');
const NOTIFICATIONS_FILE = path.join(DATA_DIR, 'notifications.json');

console.log('--- Starting notification script ---');
console.log(`REPO_ROOT: ${REPO_ROOT}`);
console.log(`DATA_DIR: ${DATA_DIR}`);
console.log(`AUDITS_FILE: ${AUDITS_FILE}`);
console.log(`NOTIFICATIONS_FILE: ${NOTIFICATIONS_FILE}`);

try {
  if (!fs.existsSync(DATA_DIR)) {
    console.log("Creating data directory...");
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(AUDITS_FILE)) {
    console.log('No audits file found. Nothing to notify.');
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

  // Find new audits that haven't been notified yet
  let notifications = [];
  if (fs.existsSync(NOTIFICATIONS_FILE)) {
    try {
      const content = fs.readFileSync(NOTIFICATIONS_FILE, 'utf8').trim();
      if (content) {
        notifications = JSON.parse(content);
      }
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
  fs.writeFileSync(NOTIFICATIONS_FILE, JSON.stringify(notifications, null, 2));
  console.log('✅ Notifications logged and saved');
} catch (e) {
  console.error(`Error in notifications script: ${e.message}`);
  process.exit(1);
}
