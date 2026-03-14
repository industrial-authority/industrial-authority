#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Handle Flutterwave Webhook Events
 * Processes payment confirmations and updates audit status
 */

const AUDITS_FILE = path.join(__dirname, '../data/audits.json');
const PAYMENTS_FILE = path.join(__dirname, '../data/payments.json');

// Get webhook event from environment
const webhookEvent = process.env.FLUTTERWAVE_EVENT ? JSON.parse(process.env.FLUTTERWAVE_EVENT) : null;

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
switch (webhookEvent.event) {
  case 'charge.completed':
    console.log('💰 Payment received:', webhookEvent.data.id);
    
    // Record payment
    paymentsData.payments.push({
      flutterwaveId: webhookEvent.data.id,
      amount: webhookEvent.data.amount,
      currency: webhookEvent.data.currency,
      status: 'completed',
      reference: webhookEvent.data.tx_ref,
      customer: webhookEvent.data.customer,
      metadata: webhookEvent.data.meta,
      timestamp: new Date().toISOString(),
    });
    
    // Update audit status if metadata contains auditId
    if (webhookEvent.data.meta && webhookEvent.data.meta.auditId) {
      const auditId = parseInt(webhookEvent.data.meta.auditId);
      if (auditsData.audits) {
        const audit = auditsData.audits.find(a => a.id === auditId);
        if (audit) {
          audit.status = 'paid';
          audit.paidAt = new Date().toISOString();
          audit.paymentId = webhookEvent.data.id;
          console.log(`✅ Updated audit ${auditId} to paid status`);
        }
      }
    }
    break;

  case 'charge.failed':
    console.log('❌ Payment failed:', webhookEvent.data.id);
    
    // Record failed payment
    paymentsData.payments.push({
      flutterwaveId: webhookEvent.data.id,
      amount: webhookEvent.data.amount,
      currency: webhookEvent.data.currency,
      status: 'failed',
      reference: webhookEvent.data.tx_ref,
      reason: webhookEvent.data.processor_response,
      timestamp: new Date().toISOString(),
    });
    break;

  default:
    console.log('⚠️  Unknown webhook event:', webhookEvent.event);
}

// Save updated data
fs.writeFileSync(AUDITS_FILE, JSON.stringify(auditsData, null, 2));
fs.writeFileSync(PAYMENTS_FILE, JSON.stringify(paymentsData, null, 2));

console.log('✅ Flutterwave webhook processed and saved');
