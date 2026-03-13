import { invokeLLM } from "./llm";

const OWNER_EMAIL = "freelankarx@gmail.com";
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY || "";

/**
 * Send email using the built-in Manus notification system
 * This sends an email to the project owner
 */
export async function sendAuditRequestEmail(data: {
  companyName: string;
  companyEmail: string;
  companyPhone?: string;
  industry?: string;
  auditType: string;
}) {
  try {
    // Generate a professional audit request summary
    const summary = await generateAuditSummary(data);

    // Send notification to owner
    const response = await fetch(`${process.env.BUILT_IN_FORGE_API_URL}/notification/send`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.BUILT_IN_FORGE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to: OWNER_EMAIL,
        subject: `New Audit Request: ${data.companyName}`,
        htmlContent: generateAuditEmailHTML(data, summary),
        textContent: generateAuditEmailText(data, summary),
      }),
    });

    if (!response.ok) {
      console.error("[Email] Failed to send audit request email:", await response.text());
      return false;
    }

    return true;
  } catch (error) {
    console.error("[Email] Error sending audit request email:", error);
    return false;
  }
}

/**
 * Send audit completion email to client
 */
export async function sendAuditCompletionEmail(data: {
  companyName: string;
  companyEmail: string;
  findings: string;
  recommendations: string;
  auditType: string;
}) {
  try {
    const response = await fetch(`${process.env.BUILT_IN_FORGE_API_URL}/notification/send`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.BUILT_IN_FORGE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to: data.companyEmail,
        subject: `Your Digital Capability Audit Report - ${data.companyName}`,
        htmlContent: generateCompletionEmailHTML(data),
        textContent: generateCompletionEmailText(data),
      }),
    });

    if (!response.ok) {
      console.error("[Email] Failed to send audit completion email:", await response.text());
      return false;
    }

    return true;
  } catch (error) {
    console.error("[Email] Error sending audit completion email:", error);
    return false;
  }
}

/**
 * Generate audit summary using LLM
 */
async function generateAuditSummary(data: {
  companyName: string;
  companyEmail: string;
  companyPhone?: string;
  industry?: string;
  auditType: string;
}): Promise<string> {
  try {
    const response = await invokeLLM({
      messages: [
        {
          role: "system",
          content: "You are a professional business analyst. Generate a brief 2-3 sentence summary of an audit request.",
        },
        {
          role: "user",
          content: `Company: ${data.companyName}, Industry: ${data.industry || "Not specified"}, Audit Type: ${data.auditType}. Summarize this audit request professionally.`,
        },
      ],
    });

    const content = response.choices[0]?.message.content;
    return typeof content === "string" ? content : "Audit request received";
  } catch (error) {
    console.error("[Email] Error generating audit summary:", error);
    return "Audit request received";
  }
}

/**
 * Generate HTML email for audit request notification to owner
 */
function generateAuditEmailHTML(
  data: {
    companyName: string;
    companyEmail: string;
    companyPhone?: string;
    industry?: string;
    auditType: string;
  },
  summary: string
): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #1a1a2e; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
          .content { background-color: #f5f5f5; padding: 20px; }
          .footer { background-color: #1a1a2e; color: white; padding: 15px; text-align: center; border-radius: 0 0 8px 8px; }
          .field { margin: 15px 0; }
          .label { font-weight: bold; color: #1a1a2e; }
          .value { color: #555; margin-top: 5px; }
          .button { background-color: #ff8c00; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; margin-top: 15px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>New Audit Request Received</h2>
          </div>
          <div class="content">
            <p><strong>Summary:</strong> ${summary}</p>
            
            <div class="field">
              <div class="label">Company Name:</div>
              <div class="value">${data.companyName}</div>
            </div>
            
            <div class="field">
              <div class="label">Email:</div>
              <div class="value">${data.companyEmail}</div>
            </div>
            
            ${data.companyPhone ? `
            <div class="field">
              <div class="label">Phone:</div>
              <div class="value">${data.companyPhone}</div>
            </div>
            ` : ""}
            
            ${data.industry ? `
            <div class="field">
              <div class="label">Industry:</div>
              <div class="value">${data.industry}</div>
            </div>
            ` : ""}
            
            <div class="field">
              <div class="label">Audit Type:</div>
              <div class="value">${data.auditType}</div>
            </div>
            
            <a href="https://industrial-authority.manus.space/dashboard" class="button">View in Dashboard</a>
          </div>
          <div class="footer">
            <p>&copy; 2026 Industrial Authority. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;
}

/**
 * Generate text email for audit request notification to owner
 */
function generateAuditEmailText(
  data: {
    companyName: string;
    companyEmail: string;
    companyPhone?: string;
    industry?: string;
    auditType: string;
  },
  summary: string
): string {
  return `
New Audit Request Received

Summary: ${summary}

Company Name: ${data.companyName}
Email: ${data.companyEmail}
${data.companyPhone ? `Phone: ${data.companyPhone}` : ""}
${data.industry ? `Industry: ${data.industry}` : ""}
Audit Type: ${data.auditType}

View in Dashboard: https://industrial-authority.manus.space/dashboard

---
Industrial Authority
  `;
}

/**
 * Generate HTML email for audit completion to client
 */
function generateCompletionEmailHTML(data: {
  companyName: string;
  companyEmail: string;
  findings: string;
  recommendations: string;
  auditType: string;
}): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #1a1a2e; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
          .content { background-color: #f5f5f5; padding: 20px; }
          .footer { background-color: #1a1a2e; color: white; padding: 15px; text-align: center; border-radius: 0 0 8px 8px; }
          .section { margin: 20px 0; padding: 15px; background-color: white; border-left: 4px solid #ff8c00; }
          .section-title { font-weight: bold; color: #1a1a2e; font-size: 16px; margin-bottom: 10px; }
          .button { background-color: #ff8c00; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; margin-top: 15px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>Your Digital Capability Audit Report</h2>
          </div>
          <div class="content">
            <p>Dear ${data.companyName},</p>
            <p>Thank you for requesting your Digital Capability Audit. We've completed a comprehensive analysis of your digital presence.</p>
            
            <div class="section">
              <div class="section-title">Key Findings:</div>
              <p>${data.findings}</p>
            </div>
            
            <div class="section">
              <div class="section-title">Recommendations:</div>
              <p>${data.recommendations}</p>
            </div>
            
            <p>To discuss these findings and explore how we can help you pass the procurement test, please reply to this email or call us directly.</p>
            
            <a href="https://industrial-authority.manus.space" class="button">Learn More</a>
          </div>
          <div class="footer">
            <p>&copy; 2026 Industrial Authority. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;
}

/**
 * Generate text email for audit completion to client
 */
function generateCompletionEmailText(data: {
  companyName: string;
  companyEmail: string;
  findings: string;
  recommendations: string;
  auditType: string;
}): string {
  return `
Your Digital Capability Audit Report

Dear ${data.companyName},

Thank you for requesting your Digital Capability Audit. We've completed a comprehensive analysis of your digital presence.

KEY FINDINGS:
${data.findings}

RECOMMENDATIONS:
${data.recommendations}

To discuss these findings and explore how we can help you pass the procurement test, please reply to this email or call us directly.

---
Industrial Authority
https://industrial-authority.manus.space
  `;
}
