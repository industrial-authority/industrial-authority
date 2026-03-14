#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Handle Stripe Webhook Events
 * Processes payment confirmations and updates audit status
 */

const AUDITS_FILE = path.join(__dirname, '../data/audits.json');
const PAYMENTS_FILE = path.join(__dirname, '../data/payments.json');

// Get webhook event from environment
const webhookEvent = process.env.WEBHOOK_EVENT ? JSON.parse(process.env.WEBHOOK_EVENT) : null;

if (!webhookEvent) {
  console.log('No webhook event provided');
  process.exit(0);
}

// Initialize files
if (!fs.existsSync(AUDITS_FILE)) {
  fs.writeFileSync(AUDITS_FILE, JSON.stringify({ audits: [] }, null, 2));
}

if (!fs.existsSync(PAYMENTS_FILE)) {
  fs.writeFileSync(PAYMENTS_FILE, JSON.stringify({ payments: [] }, null, 2));
}

const auditsData = JSON.parse(fs.readFileSync(AUDITS_FILE, 'utf8'));
const paymentsData = JSON.parse(fs.readFileSync(PAYMENTS_FILE, 'utf8'));

// Handle different webhook types
switch (webhookEvent.type) {
  case 'payment_intent.succeeded':
    console.log('💰 Payment received:', webhookEvent.data.object.id);
    paymentsData.payments.push({
      stripeId: webhookEvent.data.object.id,
      amount: webhookEvent.data.object.amount,
      currency: webhookEvent.data.object.currency,
      status: 'succeeded',
      metadata: webhookEvent.data.object.metadata,
      timestamp: new Date().toISOString(),
    });
    break;

  case 'checkout.session.completed':
    console.log('✅ Checkout completed:', webhookEvent.data.object.id);
    const auditId = webhookEvent.data.object.client_reference_id;
    if (auditId && auditsData.audits) {
      const audit = auditsData.audits.find(a => a.id === parseInt(auditId));
      if (audit) {
        audit.status = 'paid';
        audit.paidAt = new Date().toISOString();
        console.log(`Updated audit ${auditId} to paid status`);
      }
    }
    break;

  case 'invoice.paid':
    console.log('📄 Invoice paid:', webhookEvent.data.object.id);
    paymentsData.payments.push({
      invoiceId: webhookEvent.data.object.id,
      amount: webhookEvent.data.object.amount_paid,
      currency: webhookEvent.data.object.currency,
      status: 'paid',
      timestamp: new Date().toISOString(),
    });
    break;

  default:
    console.log('⚠️  Unknown webhook type:', webhookEvent.type);
}

// Save updated data
fs.writeFileSync(AUDITS_FILE, JSON.stringify(auditsData, null, 2));
fs.writeFileSync(PAYMENTS_FILE, JSON.stringify(paymentsData, null, 2));

console.log('✅ Webhook processed and saved');
